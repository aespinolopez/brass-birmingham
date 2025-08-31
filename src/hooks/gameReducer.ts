import { produce } from 'immer'
import type { GameState, Player, BuiltIndustry } from '@/types'
import type { GameAction, InitializeGameAction, BuildIndustryAction, DevelopLocationAction, SellGoodsAction, TakeLoanAction, PassAction, PlayCardAction, DiscardCardsAction, BuyResourcesAction } from '@/types'


/**
 * Log game action error with context
 */
function logGameError(error: string, action: GameAction, details?: Record<string, unknown>) {
  console.error(`[Game Error] ${error}`, {
    actionType: action.type,
    playerId: action.playerId,
    action,
    details
  })
}
import { 
  locations, 
  industryTiles, 
  cardDeck,
  getMarketForPlayerCount,
  getExternalMarketsForPlayerCount,
  STARTING_INCOME_LEVEL,
  STARTING_MONEY,
  STARTING_HAND_SIZE,
  ACTIONS_PER_TURN,
  LOAN_AMOUNT,
  LOAN_INTEREST,
  getIncomeForLevel,
  purchaseFromMarket,
  sellToMarket,
  connections,
  MONEY_TO_VICTORY_POINTS_RATIO
} from '@/data'

/**
 * Main game reducer that handles all game state transitions
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'INITIALIZE_GAME':
        return initializeGame(draft, action)
        
      case 'BUILD_INDUSTRY':
        return buildIndustry(draft, action)
        
      case 'DEVELOP_LOCATION':
        return developLocation(draft, action)
        
      case 'SELL_GOODS':
        return sellGoods(draft, action)
        
      case 'TAKE_LOAN':
        return takeLoan(draft, action)
        
      case 'PASS':
        return passAction(draft, action)
        
      case 'PLAY_CARD':
        return playCard(draft, action)
        
      case 'DISCARD_CARDS':
        return discardCards(draft, action)
        
      case 'BUY_RESOURCES':
        return buyResources(draft, action)
        
      case 'END_PHASE':
        return endPhase(draft)
        
      case 'START_TURN':
        return startTurn(draft)
        
      case 'ADVANCE_ERA':
        return advanceEra(draft)
        
      case 'CALCULATE_INCOME':
        return calculateIncome(draft)
        
      case 'UPDATE_MARKETS':
        return updateMarkets(draft)
        
      case 'END_GAME':
        return endGame(draft)
        
      case 'RESET_GAME':
        return resetGame(draft)
        
      default:
        console.warn('Unknown action type:', (action as { type: string }).type)
        return draft
    }
  })
}

/**
 * Initialize a new game with the specified number of players
 */
function initializeGame(_draft: GameState, action: InitializeGameAction): GameState {
  const { playerCount, playerNames, playerColors } = action
  
  // Create players
  const players: Player[] = []
  for (let i = 0; i < playerCount; i++) {
    players.push({
      id: `player-${i}`,
      name: playerNames[i] || `Player ${i + 1}`,
      color: playerColors[i],
      money: STARTING_MONEY,
      income: STARTING_INCOME_LEVEL,
      victoryPoints: 0,
      hand: [],
      actionsRemaining: ACTIONS_PER_TURN,
      industries: [],
      connections: [],
      hasLoan: false
    })
  }
  
  // Shuffle and deal cards
  const shuffledDeck = [...cardDeck].sort(() => Math.random() - 0.5)
  const dealtCards = shuffledDeck.splice(0, playerCount * STARTING_HAND_SIZE)
  
  players.forEach((player, index) => {
    player.hand = dealtCards.slice(
      index * STARTING_HAND_SIZE, 
      (index + 1) * STARTING_HAND_SIZE
    )
  })
  
  // Initialize board state
  const boardState = {
    locations: [...locations],
    connections: [...connections],
    builtIndustries: [],
    builtConnections: [],
    availableTiles: produce(industryTiles, (draft) => draft)
  }
  
  // Initialize markets
  const market = getMarketForPlayerCount(playerCount)
  const externalMarkets = getExternalMarketsForPlayerCount(playerCount)
  
  // Return complete initial state
  return {
    players,
    currentPlayer: 0,
    phase: 'action',
    era: 'canal',
    turn: 1,
    board: boardState,
    market,
    externalMarkets,
    deck: shuffledDeck,
    discardPile: [],
    gameEnded: false
  }
}

/**
 * Validate industry build requirements
 */
function validateIndustryBuild(draft: GameState, action: BuildIndustryAction): 
  | { valid: false; error: string }
  | { valid: true; player: Player; location: any; tile: any; tileIndex: number; availableTiles: any[]; totalCost: number } {
  const { playerId, locationId, industryType, tileId, coalUsed, ironUsed } = action
  
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    return { valid: false, error: 'Player not found' }
  }
  
  if (draft.players[draft.currentPlayer].id !== playerId) {
    return { valid: false, error: 'Not player turn' }
  }
  
  if (player.actionsRemaining <= 0) {
    return { valid: false, error: 'No actions remaining' }
  }
  
  const location = draft.board.locations.find(l => l.id === locationId)
  if (!location) {
    return { valid: false, error: 'Location not found' }
  }
  
  if (!location.allowedIndustries.includes(industryType)) {
    return { valid: false, error: 'Industry type not allowed at location' }
  }
  
  const industriesAtLocation = draft.board.builtIndustries.filter(ind => ind.locationId === locationId)
  if (industriesAtLocation.length >= location.industrySlots) {
    return { valid: false, error: 'Location is full' }
  }
  
  const availableTiles = draft.board.availableTiles[industryType as keyof typeof draft.board.availableTiles][draft.era]
  const tileIndex = availableTiles.findIndex((tile) => tile.id === tileId)
  
  if (tileIndex === -1) {
    return { valid: false, error: 'Industry tile not available' }
  }
  
  const tile = availableTiles[tileIndex]
  const totalCost = tile.cost + (coalUsed * getLowestResourcePrice(draft.market, 'coal')) + (ironUsed * getLowestResourcePrice(draft.market, 'iron'))
  
  if (player.money < totalCost) {
    return { valid: false, error: 'Player cannot afford industry' }
  }
  
  if (coalUsed < tile.coalCost || ironUsed < tile.ironCost) {
    return { valid: false, error: 'Insufficient resources for industry' }
  }
  
  return { valid: true, player, location, tile, tileIndex, availableTiles, totalCost } as const
}

/**
 * Purchase resources from market for industry building
 */
function purchaseIndustryResources(draft: GameState, coalUsed: number, ironUsed: number) {
  if (coalUsed > 0) {
    const coalPurchase = purchaseFromMarket(draft.market, 'coal', coalUsed)
    if (!coalPurchase.success) {
      return { success: false, error: 'Could not purchase required coal' }
    }
  }
  
  if (ironUsed > 0) {
    const ironPurchase = purchaseFromMarket(draft.market, 'iron', ironUsed)
    if (!ironPurchase.success) {
      return { success: false, error: 'Could not purchase required iron' }
    }
  }
  
  return { success: true }
}

/**
 * Handle building an industry at a location
 */
function buildIndustry(draft: GameState, action: BuildIndustryAction): GameState {
  const { playerId, locationId, coalUsed, ironUsed } = action
  
  // Validate the industry build
  const validation = validateIndustryBuild(draft, action)
  if (!validation.valid) {
    logGameError(validation.error, action)
    return draft
  }
  
  const { player, tile, tileIndex, availableTiles, totalCost } = validation
  
  // Type assertion to ensure we have the required properties
  if (!player || !tile || tileIndex === undefined || !availableTiles || totalCost === undefined) {
    logGameError('Invalid validation result', action)
    return draft
  }
  
  // Purchase resources from market
  const resourcePurchase = purchaseIndustryResources(draft, coalUsed, ironUsed)
  if (!resourcePurchase.success) {
    logGameError(resourcePurchase.error || 'Resource purchase failed', action, { coalUsed, ironUsed })
    return draft
  }
  
  // Create built industry
  const builtIndustry: BuiltIndustry = {
    ...tile,
    locationId,
    playerId,
    used: false,
    flipped: false
  }
  
  // Apply changes
  player.money -= totalCost
  player.actionsRemaining--
  player.industries.push(builtIndustry)
  draft.board.builtIndustries.push(builtIndustry)
  
  // Remove tile from available tiles
  availableTiles.splice(tileIndex, 1)
  
  return draft
}

/**
 * Validate connection development requirements
 */
function validateConnectionDevelopment(draft: GameState, action: DevelopLocationAction):
  | { valid: false; error: string }
  | { valid: true; player: Player; connection: any; totalCost: number } {
  const { playerId, connectionId, coalUsed, ironUsed } = action
  
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    return { valid: false, error: 'Player not found' }
  }
  
  if (draft.players[draft.currentPlayer].id !== playerId) {
    return { valid: false, error: 'Not player turn' }
  }
  
  if (player.actionsRemaining <= 0) {
    return { valid: false, error: 'No actions remaining' }
  }
  
  const connection = draft.board.connections.find(c => c.id === connectionId)
  if (!connection) {
    return { valid: false, error: 'Connection not found' }
  }
  
  if (connection.era !== draft.era && connection.era !== 'both') {
    return { valid: false, error: 'Connection not available in current era' }
  }
  
  if (draft.board.builtConnections.includes(connectionId)) {
    return { valid: false, error: 'Connection already built' }
  }
  
  const resourceCost = (coalUsed * getLowestResourcePrice(draft.market, 'coal')) + (ironUsed * getLowestResourcePrice(draft.market, 'iron'))
  const totalCost = connection.cost + resourceCost
  
  if (player.money < totalCost) {
    return { valid: false, error: 'Player cannot afford connection' }
  }
  
  return { valid: true, player, connection, totalCost }
}

/**
 * Handle developing a location (building a connection)
 */
function developLocation(draft: GameState, action: DevelopLocationAction): GameState {
  const { coalUsed, ironUsed } = action
  
  // Validate the connection development
  const validation = validateConnectionDevelopment(draft, action)
  if (!validation.valid) {
    logGameError(validation.error, action)
    return draft
  }
  
  const { player, connection, totalCost } = validation
  
  // Type assertion to ensure we have the required properties
  if (!player || !connection || totalCost === undefined) {
    logGameError('Invalid validation result', action)
    return draft
  }
  
  // Purchase resources from market (reuse helper function)
  const resourcePurchase = purchaseIndustryResources(draft, coalUsed, ironUsed)
  if (!resourcePurchase.success) {
    logGameError(resourcePurchase.error || 'Resource purchase failed', action, { coalUsed, ironUsed })
    return draft
  }
  
  // Apply changes
  player.money -= totalCost
  player.actionsRemaining--
  player.connections.push(action.connectionId)
  draft.board.builtConnections.push(action.connectionId)
  
  // Add victory points
  player.victoryPoints += connection.victoryPoints
  
  return draft
}

/**
 * Handle selling goods from an industry
 */
function sellGoods(draft: GameState, action: SellGoodsAction): GameState {
  const { playerId, industryId, marketType, goodsAmount } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    logGameError('Player not found', action, { playerId })
    return draft
  }
  
  // Find industry
  const industry = draft.board.builtIndustries.find(ind => ind.id === industryId && ind.playerId === playerId)
  if (!industry) {
    logGameError('Industry not found or not owned by player', action, { industryId, playerId })
    return draft
  }
  
  // Validate industry can produce goods
  if (industry.type === 'coal' || industry.type === 'iron') {
    logGameError('Cannot sell goods from resource industries', action, { industryType: industry.type })
    return draft
  }
  
  // Validate industry is not already used/flipped
  if (industry.flipped) {
    logGameError('Industry already used this era', action, { industryId })
    return draft
  }
  
  // Handle different market types
  if (marketType === 'external') {
    // External market sales (existing implementation)
    let goodType: 'cotton' | 'manufacturedGoods' | 'pottery'
    
    switch (industry.type) {
      case 'cotton':
        goodType = 'cotton'
        break
      case 'manufactured_goods':
        goodType = 'manufacturedGoods'
        break
      case 'pottery':
        goodType = 'pottery'
        break
      default:
        logGameError('Industry cannot sell to external markets', action, { industryType: industry.type })
        return draft
    }
    
    const sale = sellToMarket(draft.externalMarkets, goodType, goodsAmount)
    if (!sale.success) {
      logGameError('Could not sell goods to external market', action, { goodType, goodsAmount })
      return draft
    }
    
    // Apply income and flip industry
    player.money += sale.income
    industry.flipped = true
  } else if (marketType === 'local') {
    // Local market sales - sell to other players' industries in same location
    // For now, simplified logic - just check for cotton mills that need cotton
    const localDemand = draft.board.builtIndustries.filter(ind => 
      ind.locationId === industry.locationId && 
      ind.playerId !== playerId &&
      !ind.flipped &&
      (ind.type === 'manufactured_goods' && industry.type === 'cotton') // Cotton mills need cotton
    )
    
    if (localDemand.length === 0) {
      logGameError('No local demand for goods', action, { industryType: industry.type, locationId: industry.locationId })
      return draft
    }
    
    // Sell to first available local consumer (simplified logic)
    const consumer = localDemand[0]
    const salePrice = 2 * goodsAmount // Fixed price for local sales
    
    player.money += salePrice
    industry.flipped = true
    consumer.used = true // Mark consumer as having used goods
  } else if (marketType === 'distant') {
    // Distant market sales - sell through network connections
    // Check if player has network connection to a market location
    // For now, simplified - assume Liverpool and other ports are market locations
    const marketLocations = draft.board.locations.filter(loc => 
      loc.name.includes('Liverpool') || loc.name.includes('Port')
    )
    const playerConnectedLocations = getConnectedLocations(draft, playerId)
    
    const accessibleMarkets = marketLocations.filter(market => 
      playerConnectedLocations.includes(market.id)
    )
    
    if (accessibleMarkets.length === 0) {
      logGameError('No accessible distant markets', action, { playerId, industryType: industry.type })
      return draft
    }
    
    // Use first accessible market (simplified logic)
    const salePrice = 1 * goodsAmount // Lower price for distant sales
    player.money += salePrice
    industry.flipped = true
  } else {
    logGameError('Invalid market type', action, { marketType })
    return draft
  }
  
  return draft
}

/**
 * Handle taking a loan
 */
function takeLoan(draft: GameState, action: TakeLoanAction): GameState {
  const { playerId } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  // Validate player doesn't already have a loan
  if (player.hasLoan) {
    console.error('Player already has a loan:', playerId)
    return draft
  }
  
  // Apply loan
  player.money += LOAN_AMOUNT
  player.hasLoan = true
  player.income -= LOAN_INTEREST
  
  return draft
}

/**
 * Handle pass action
 */
function passAction(draft: GameState, action: PassAction): GameState {
  const { playerId } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  // End player's turn
  player.actionsRemaining = 0
  
  return draft
}

/**
 * Handle playing a card
 */
function playCard(draft: GameState, action: PlayCardAction): GameState {
  const { playerId, cardId } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  // Find and remove card from hand
  const cardIndex = player.hand.findIndex(card => card.id === cardId)
  if (cardIndex === -1) {
    console.error('Card not found in player hand:', cardId)
    return draft
  }
  
  const card = player.hand[cardIndex]
  player.hand.splice(cardIndex, 1)
  draft.discardPile.push(card)
  
  return draft
}

/**
 * Handle discarding cards
 */
function discardCards(draft: GameState, action: DiscardCardsAction): GameState {
  const { playerId, cardIds } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  // Remove cards from hand and add to discard pile
  cardIds.forEach((cardId) => {
    const cardIndex = player.hand.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      const card = player.hand[cardIndex]
      player.hand.splice(cardIndex, 1)
      draft.discardPile.push(card)
    }
  })
  
  return draft
}

/**
 * Handle buying resources from market
 */
function buyResources(draft: GameState, action: BuyResourcesAction): GameState {
  const { playerId, purchases } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  let totalCost = 0
  
  // Calculate total cost and validate affordability
  purchases.forEach((purchase) => {
    totalCost += purchase.cost
  })
  
  if (player.money < totalCost) {
    console.error('Player cannot afford resource purchases:', totalCost, player.money)
    return draft
  }
  
  // Execute purchases
  purchases.forEach((purchase) => {
    if (purchase.resource === 'coal' || purchase.resource === 'iron') {
      const result = purchaseFromMarket(draft.market, purchase.resource, purchase.amount)
      if (!result.success) {
        console.error('Could not complete resource purchase:', purchase)
      }
    }
  })
  
  player.money -= totalCost
  
  return draft
}

/**
 * Handle ending the current phase
 */
function endPhase(draft: GameState): GameState {
  switch (draft.phase) {
    case 'action':
      draft.phase = 'income'
      break
    case 'income':
      draft.phase = 'market'
      break
    case 'market':
      draft.phase = 'action'
      // Advance to next player or next turn
      if (draft.currentPlayer < draft.players.length - 1) {
        draft.currentPlayer++
      } else {
        draft.currentPlayer = 0
        draft.turn++
      }
      break
  }
  
  return draft
}

/**
 * Handle starting a new turn
 */
function startTurn(draft: GameState): GameState {
  // Reset actions for current player
  draft.players[draft.currentPlayer].actionsRemaining = ACTIONS_PER_TURN
  
  return draft
}

/**
 * Handle advancing to the next era
 */
function advanceEra(draft: GameState): GameState {
  if (draft.era === 'canal') {
    draft.era = 'rail'
    draft.turn = 1
    
    // Discard all cards and reshuffle
    draft.players.forEach(player => {
      draft.discardPile.push(...player.hand)
      player.hand = []
    })
    
    // Deal new hands for rail era
    const availableCards = draft.deck.filter(card => card.era === 'rail')
    const shuffledCards = [...availableCards].sort(() => Math.random() - 0.5)
    
    draft.players.forEach((player, index) => {
      player.hand = shuffledCards.slice(
        index * STARTING_HAND_SIZE,
        (index + 1) * STARTING_HAND_SIZE
      )
    })
  }
  
  return draft
}

/**
 * Handle calculating income for all players
 */
function calculateIncome(draft: GameState): GameState {
  draft.players.forEach(player => {
    const income = getIncomeForLevel(player.income)
    player.money += income
    
    // Apply loan interest
    if (player.hasLoan) {
      player.money -= LOAN_INTEREST
    }
  })
  
  return draft
}

/**
 * Handle updating markets after resource consumption
 */
function updateMarkets(draft: GameState): GameState {
  // Market updates are handled within individual actions
  // This could be used for end-of-turn market refills
  return draft
}

/**
 * Handle ending the game
 */
function endGame(draft: GameState): GameState {
  draft.gameEnded = true
  
  // Calculate final scores
  const finalScores: { [playerId: string]: {
    industryPoints: number
    connectionPoints: number
    moneyPoints: number
    totalPoints: number
  } } = {}
  
  draft.players.forEach(player => {
    const industryPoints = player.industries.reduce((sum, ind) => sum + ind.victoryPoints, 0)
    const connectionPoints = player.victoryPoints // Already accumulated from connections
    const moneyPoints = Math.floor(player.money / MONEY_TO_VICTORY_POINTS_RATIO)
    
    finalScores[player.id] = {
      industryPoints,
      connectionPoints,
      moneyPoints,
      totalPoints: industryPoints + connectionPoints + moneyPoints
    }
  })
  
  draft.finalScores = finalScores
  
  return draft
}

/**
 * Handle resetting the game
 */
function resetGame(draft: GameState): GameState {
  // This would reset to initial state - implementation depends on requirements
  return draft
}

/**
 * Get all locations connected to a player through their network
 */
function getConnectedLocations(state: GameState, playerId: string): string[] {
  const player = state.players.find(p => p.id === playerId)
  if (!player) return []
  
  const connectedLocations = new Set<string>()
  
  // Add locations with player's industries
  state.board.builtIndustries
    .filter(ind => ind.playerId === playerId)
    .forEach(ind => connectedLocations.add(ind.locationId))
  
  // Add locations connected through player's connections
  player.connections.forEach(connectionId => {
    const connection = state.board.connections.find(c => c.id === connectionId)
    if (connection) {
      connectedLocations.add(connection.from)
      connectedLocations.add(connection.to)
    }
  })
  
  return Array.from(connectedLocations)
}

/**
 * Helper function to get the lowest price for a resource
 */
function getLowestResourcePrice(market: { coal: { levels: number[]; prices: number[] }; iron: { levels: number[]; prices: number[] } }, resourceType: 'coal' | 'iron'): number {
  const resource = market[resourceType]
  
  for (let i = 0; i < resource.levels.length; i++) {
    if (resource.levels[i] > 0) {
      return resource.prices[i]
    }
  }
  
  return resource.prices[resource.prices.length - 1] + 1
}