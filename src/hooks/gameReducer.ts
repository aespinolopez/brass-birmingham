import { produce } from 'immer'
import type { GameState, Player, BuiltIndustry } from '@/types'
import type { GameAction, InitializeGameAction, BuildIndustryAction, DevelopLocationAction, SellGoodsAction, TakeLoanAction, PassAction, PlayCardAction, DiscardCardsAction, BuyResourcesAction } from '@/types'
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
  connections
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
    availableTiles: JSON.parse(JSON.stringify(industryTiles))
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
 * Handle building an industry at a location
 */
function buildIndustry(draft: GameState, action: BuildIndustryAction): GameState {
  const { playerId, locationId, industryType, tileId, coalUsed, ironUsed } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  // Validate it's player's turn
  if (draft.players[draft.currentPlayer].id !== playerId) {
    console.error('Not player turn:', playerId)
    return draft
  }
  
  // Validate player has actions remaining
  if (player.actionsRemaining <= 0) {
    console.error('No actions remaining for player:', playerId)
    return draft
  }
  
  // Find location and validate
  const location = draft.board.locations.find(l => l.id === locationId)
  if (!location) {
    console.error('Location not found:', locationId)
    return draft
  }
  
  // Validate industry type is allowed at location
  if (!location.allowedIndustries.includes(industryType)) {
    console.error('Industry type not allowed at location:', industryType, locationId)
    return draft
  }
  
  // Find available tile
  const availableTiles = draft.board.availableTiles[industryType as keyof typeof draft.board.availableTiles][draft.era]
  const tileIndex = availableTiles.findIndex((tile) => tile.id === tileId)
  
  if (tileIndex === -1) {
    console.error('Industry tile not available:', tileId)
    return draft
  }
  
  const tile = availableTiles[tileIndex]
  
  // Validate player has required resources and money
  const totalCost = tile.cost + (coalUsed * getLowestResourcePrice(draft.market, 'coal')) + (ironUsed * getLowestResourcePrice(draft.market, 'iron'))
  
  if (player.money < totalCost) {
    console.error('Player cannot afford industry:', totalCost, player.money)
    return draft
  }
  
  // Validate resource requirements
  if (coalUsed < tile.coalCost || ironUsed < tile.ironCost) {
    console.error('Insufficient resources for industry:', coalUsed, ironUsed, tile.coalCost, tile.ironCost)
    return draft
  }
  
  // Check if location has space
  const industriesAtLocation = draft.board.builtIndustries.filter(ind => ind.locationId === locationId)
  if (industriesAtLocation.length >= location.industrySlots) {
    console.error('Location is full:', locationId)
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
  
  // Purchase resources from market
  if (coalUsed > 0) {
    const coalPurchase = purchaseFromMarket(draft.market, 'coal', coalUsed)
    if (!coalPurchase.success) {
      console.error('Could not purchase required coal')
      return draft
    }
  }
  
  if (ironUsed > 0) {
    const ironPurchase = purchaseFromMarket(draft.market, 'iron', ironUsed)
    if (!ironPurchase.success) {
      console.error('Could not purchase required iron')
      return draft
    }
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
 * Handle developing a location (building a connection)
 */
function developLocation(draft: GameState, action: DevelopLocationAction): GameState {
  const { playerId, connectionId, coalUsed, ironUsed } = action
  
  // Find player and validate
  const player = draft.players.find(p => p.id === playerId)
  if (!player) {
    console.error('Player not found:', playerId)
    return draft
  }
  
  // Validate it's player's turn
  if (draft.players[draft.currentPlayer].id !== playerId) {
    console.error('Not player turn:', playerId)
    return draft
  }
  
  // Validate player has actions remaining
  if (player.actionsRemaining <= 0) {
    console.error('No actions remaining for player:', playerId)
    return draft
  }
  
  // Find connection
  const connection = draft.board.connections.find(c => c.id === connectionId)
  if (!connection) {
    console.error('Connection not found:', connectionId)
    return draft
  }
  
  // Validate connection is available in current era
  if (connection.era !== draft.era && connection.era !== 'both') {
    console.error('Connection not available in current era:', connectionId, draft.era)
    return draft
  }
  
  // Validate connection is not already built
  if (draft.board.builtConnections.includes(connectionId)) {
    console.error('Connection already built:', connectionId)
    return draft
  }
  
  // Validate player can afford connection
  const resourceCost = (coalUsed * getLowestResourcePrice(draft.market, 'coal')) + (ironUsed * getLowestResourcePrice(draft.market, 'iron'))
  const totalCost = connection.cost + resourceCost
  
  if (player.money < totalCost) {
    console.error('Player cannot afford connection:', totalCost, player.money)
    return draft
  }
  
  // Purchase resources from market
  if (coalUsed > 0) {
    const coalPurchase = purchaseFromMarket(draft.market, 'coal', coalUsed)
    if (!coalPurchase.success) {
      console.error('Could not purchase required coal')
      return draft
    }
  }
  
  if (ironUsed > 0) {
    const ironPurchase = purchaseFromMarket(draft.market, 'iron', ironUsed)
    if (!ironPurchase.success) {
      console.error('Could not purchase required iron')
      return draft
    }
  }
  
  // Apply changes
  player.money -= totalCost
  player.actionsRemaining--
  player.connections.push(connectionId)
  draft.board.builtConnections.push(connectionId)
  
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
    console.error('Player not found:', playerId)
    return draft
  }
  
  // Find industry
  const industry = draft.board.builtIndustries.find(ind => ind.id === industryId && ind.playerId === playerId)
  if (!industry) {
    console.error('Industry not found or not owned by player:', industryId, playerId)
    return draft
  }
  
  // Validate industry can produce goods
  if (industry.type === 'coal' || industry.type === 'iron') {
    console.error('Cannot sell goods from resource industries')
    return draft
  }
  
  // Validate industry is not already used/flipped
  if (industry.flipped) {
    console.error('Industry already used this era:', industryId)
    return draft
  }
  
  // Handle external market sales
  if (marketType === 'external') {
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
        console.error('Industry cannot sell to external markets:', industry.type)
        return draft
    }
    
    const sale = sellToMarket(draft.externalMarkets, goodType, goodsAmount)
    if (!sale.success) {
      console.error('Could not sell goods to external market')
      return draft
    }
    
    // Apply income and flip industry
    player.money += sale.income
    industry.flipped = true
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
    const moneyPoints = Math.floor(player.money / 4)
    
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