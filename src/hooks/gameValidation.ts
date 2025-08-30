import type { GameState, Player, Connection } from '@/types'
import type { GameAction, BuildIndustryAction, DevelopLocationAction, SellGoodsAction } from '@/types'

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  error?: string
  details?: Record<string, unknown>
}

/**
 * Validate if a player can perform an action
 */
export function validatePlayerAction(state: GameState, action: GameAction): ValidationResult {
  const player = state.players.find(p => p.id === action.playerId)
  
  if (!player) {
    return { valid: false, error: 'Player not found' }
  }
  
  // Check if it's the player's turn
  if (state.players[state.currentPlayer].id !== action.playerId) {
    return { valid: false, error: 'Not player turn' }
  }
  
  // Check if player has actions remaining
  if (player.actionsRemaining <= 0) {
    return { valid: false, error: 'No actions remaining' }
  }
  
  return { valid: true }
}

/**
 * Validate building an industry
 */
export function validateBuildIndustry(state: GameState, action: BuildIndustryAction): ValidationResult {
  const baseValidation = validatePlayerAction(state, action)
  if (!baseValidation.valid) {
    return baseValidation
  }
  
  const { locationId, industryType, tileId, coalUsed, ironUsed } = action
  const player = state.players.find(p => p.id === action.playerId)!
  
  // Find location
  const location = state.board.locations.find(l => l.id === locationId)
  if (!location) {
    return { valid: false, error: 'Location not found' }
  }
  
  // Check if industry type is allowed at location
  if (!location.allowedIndustries.includes(industryType)) {
    return { 
      valid: false, 
      error: 'Industry type not allowed at location',
      details: { allowedTypes: location.allowedIndustries, requestedType: industryType }
    }
  }
  
  // Check location capacity
  const industriesAtLocation = state.board.builtIndustries.filter(ind => ind.locationId === locationId)
  if (industriesAtLocation.length >= location.industrySlots) {
    return { valid: false, error: 'Location is full' }
  }
  
  // Find available tile
  const availableTiles = state.board.availableTiles[industryType][state.era]
  const tile = availableTiles.find(t => t.id === tileId)
  
  if (!tile) {
    return { valid: false, error: 'Industry tile not available' }
  }
  
  // Validate resource requirements
  if (coalUsed < tile.coalCost) {
    return { 
      valid: false, 
      error: 'Insufficient coal',
      details: { required: tile.coalCost, provided: coalUsed }
    }
  }
  
  if (ironUsed < tile.ironCost) {
    return { 
      valid: false, 
      error: 'Insufficient iron',
      details: { required: tile.ironCost, provided: ironUsed }
    }
  }
  
  // Check if player can afford the cost
  const resourceCost = (coalUsed * getLowestResourcePrice(state.market, 'coal')) + 
                      (ironUsed * getLowestResourcePrice(state.market, 'iron'))
  const totalCost = tile.cost + resourceCost
  
  if (player.money < totalCost) {
    return { 
      valid: false, 
      error: 'Insufficient funds',
      details: { required: totalCost, available: player.money }
    }
  }
  
  // Check market availability
  if (coalUsed > 0) {
    const coalAvailable = getTotalResourceAvailable(state.market, 'coal')
    if (coalUsed > coalAvailable) {
      return { 
        valid: false, 
        error: 'Not enough coal available in market',
        details: { required: coalUsed, available: coalAvailable }
      }
    }
  }
  
  if (ironUsed > 0) {
    const ironAvailable = getTotalResourceAvailable(state.market, 'iron')
    if (ironUsed > ironAvailable) {
      return { 
        valid: false, 
        error: 'Not enough iron available in market',
        details: { required: ironUsed, available: ironAvailable }
      }
    }
  }
  
  return { valid: true }
}

/**
 * Validate developing a location (building a connection)
 */
export function validateDevelopLocation(state: GameState, action: DevelopLocationAction): ValidationResult {
  const baseValidation = validatePlayerAction(state, action)
  if (!baseValidation.valid) {
    return baseValidation
  }
  
  const { connectionId, coalUsed, ironUsed } = action
  const player = state.players.find(p => p.id === action.playerId)!
  
  // Find connection
  const connection = state.board.connections.find(c => c.id === connectionId)
  if (!connection) {
    return { valid: false, error: 'Connection not found' }
  }
  
  // Check if connection is available in current era
  if (connection.era !== state.era && connection.era !== 'both') {
    return { 
      valid: false, 
      error: 'Connection not available in current era',
      details: { connectionEra: connection.era, currentEra: state.era }
    }
  }
  
  // Check if connection is already built
  if (state.board.builtConnections.includes(connectionId)) {
    return { valid: false, error: 'Connection already built' }
  }
  
  // Validate player can afford the connection
  const resourceCost = (coalUsed * getLowestResourcePrice(state.market, 'coal')) + 
                      (ironUsed * getLowestResourcePrice(state.market, 'iron'))
  const totalCost = connection.cost + resourceCost
  
  if (player.money < totalCost) {
    return { 
      valid: false, 
      error: 'Insufficient funds for connection',
      details: { required: totalCost, available: player.money }
    }
  }
  
  // Validate player has network connection requirement
  // (Player must have an industry or connection that connects to one end of the new connection)
  const hasNetworkConnection = validateNetworkConnection(state, player, connection)
  if (!hasNetworkConnection.valid) {
    return hasNetworkConnection
  }
  
  return { valid: true }
}

/**
 * Validate selling goods from an industry
 */
export function validateSellGoods(state: GameState, action: SellGoodsAction): ValidationResult {
  const baseValidation = validatePlayerAction(state, action)
  if (!baseValidation.valid) {
    return baseValidation
  }
  
  const { industryId, marketType, goodsAmount } = action
  
  // Find industry
  const industry = state.board.builtIndustries.find(ind => 
    ind.id === industryId && ind.playerId === action.playerId
  )
  
  if (!industry) {
    return { valid: false, error: 'Industry not found or not owned by player' }
  }
  
  // Check if industry can produce goods
  if (industry.type === 'coal' || industry.type === 'iron') {
    return { valid: false, error: 'Cannot sell goods from resource industries' }
  }
  
  // Check if industry is already used/flipped
  if (industry.flipped) {
    return { valid: false, error: 'Industry already used this era' }
  }
  
  // Validate beer requirement for manufacturing industries
  if (industry.beerRequired && industry.beerRequired > 0) {
    const beerAvailable = getBeerAvailableToIndustry(state, industry)
    if (beerAvailable < industry.beerRequired) {
      return { 
        valid: false, 
        error: 'Insufficient beer for industry operation',
        details: { required: industry.beerRequired, available: beerAvailable }
      }
    }
  }
  
  // Validate market capacity for external sales
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
        return { valid: false, error: 'Industry cannot sell to external markets' }
    }
    
    const marketCapacity = getTotalMarketDemand(state.externalMarkets, goodType)
    if (goodsAmount > marketCapacity) {
      return { 
        valid: false, 
        error: 'Not enough market demand',
        details: { requested: goodsAmount, available: marketCapacity }
      }
    }
  }
  
  return { valid: true }
}

/**
 * Validate network connection requirement for building connections
 */
function validateNetworkConnection(state: GameState, player: Player, connection: Connection): ValidationResult {
  // Check if player has any industries at the connection endpoints
  const playerIndustries = state.board.builtIndustries.filter(ind => ind.playerId === player.id)
  
  const hasIndustryAtFrom = playerIndustries.some(ind => ind.locationId === connection.from)
  const hasIndustryAtTo = playerIndustries.some(ind => ind.locationId === connection.to)
  
  if (hasIndustryAtFrom || hasIndustryAtTo) {
    return { valid: true }
  }
  
  // Check if player has any existing connections that connect to the endpoints
  const playerConnections = player.connections
  const connectedLocations = new Set<string>()
  
  // Build a set of all locations the player is connected to
  playerConnections.forEach(connId => {
    const conn = state.board.connections.find(c => c.id === connId)
    if (conn) {
      connectedLocations.add(conn.from)
      connectedLocations.add(conn.to)
    }
  })
  
  if (connectedLocations.has(connection.from) || connectedLocations.has(connection.to)) {
    return { valid: true }
  }
  
  return { 
    valid: false, 
    error: 'Player must have a network connection to build this connection',
    details: { 
      connectionEndpoints: [connection.from, connection.to],
      playerLocations: Array.from(connectedLocations),
      playerIndustries: playerIndustries.map(ind => ind.locationId)
    }
  }
}

/**
 * Get the lowest price for a resource in the market
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

/**
 * Get total available amount of a resource in the market
 */
function getTotalResourceAvailable(market: { coal: { levels: number[]; prices: number[] }; iron: { levels: number[]; prices: number[] } }, resourceType: 'coal' | 'iron'): number {
  const resource = market[resourceType]
  return resource.levels.reduce((sum: number, level: number) => sum + level, 0)
}

/**
 * Get total market demand for a good type
 */
function getTotalMarketDemand(externalMarkets: { cotton: { demand: number[] }; manufacturedGoods: { demand: number[] }; pottery: { demand: number[] } }, goodType: 'cotton' | 'manufacturedGoods' | 'pottery'): number {
  const market = externalMarkets[goodType]
  return market.demand.reduce((sum: number, level: number) => sum + level, 0)
}

/**
 * Get beer available to an industry (from connected breweries)
 */
function getBeerAvailableToIndustry(state: GameState, industry: { playerId: string }): number {
  // This would need to check for connected breweries through the network
  // For now, simplified implementation
  const playerBreweries = state.board.builtIndustries.filter(ind => 
    ind.playerId === industry.playerId && 
    ind.type === 'brewery' && 
    !ind.used
  )
  
  return playerBreweries.reduce((sum, brewery) => {
    return sum + (brewery.resourceProduction?.amount || 1)
  }, 0)
}

/**
 * Validate the entire game state for consistency
 */
export function validateGameState(state: GameState): ValidationResult {
  // Check player count
  if (state.players.length < 2 || state.players.length > 4) {
    return { valid: false, error: 'Invalid player count' }
  }
  
  // Check current player index
  if (state.currentPlayer < 0 || state.currentPlayer >= state.players.length) {
    return { valid: false, error: 'Invalid current player index' }
  }
  
  // Check era
  if (state.era !== 'canal' && state.era !== 'rail') {
    return { valid: false, error: 'Invalid era' }
  }
  
  // Check phase
  if (!['action', 'income', 'market'].includes(state.phase)) {
    return { valid: false, error: 'Invalid phase' }
  }
  
  // Validate player states
  for (const player of state.players) {
    if (player.money < 0) {
      return { valid: false, error: `Player ${player.id} has negative money` }
    }
    
    if (player.actionsRemaining < 0) {
      return { valid: false, error: `Player ${player.id} has negative actions` }
    }
    
    if (player.hand.length > 8) {
      return { valid: false, error: `Player ${player.id} has too many cards` }
    }
  }
  
  // Validate board state consistency
  const allIndustryIds = state.board.builtIndustries.map(ind => ind.id)
  const uniqueIndustryIds = new Set(allIndustryIds)
  if (allIndustryIds.length !== uniqueIndustryIds.size) {
    return { valid: false, error: 'Duplicate industry IDs found' }
  }
  
  const allConnectionIds = state.board.builtConnections
  const uniqueConnectionIds = new Set(allConnectionIds)
  if (allConnectionIds.length !== uniqueConnectionIds.size) {
    return { valid: false, error: 'Duplicate connection IDs found' }
  }
  
  return { valid: true }
}

/**
 * Check if the game should end
 */
export function shouldGameEnd(state: GameState): boolean {
  // Game ends at the end of rail era after specified number of turns
  if (state.era === 'rail' && state.turn > 6) {
    return true
  }
  
  // Game ends if all players have passed (no actions remaining)
  const allPlayersPassed = state.players.every(player => player.actionsRemaining === 0)
  if (allPlayersPassed && state.phase === 'action') {
    return true
  }
  
  return false
}

/**
 * Get available actions for a player
 */
export function getAvailableActions(state: GameState, playerId: string): string[] {
  const player = state.players.find(p => p.id === playerId)
  if (!player || state.players[state.currentPlayer].id !== playerId) {
    return []
  }
  
  if (player.actionsRemaining <= 0) {
    return ['PASS']
  }
  
  const actions: string[] = ['PASS']
  
  // Can always take a loan if don't have one
  if (!player.hasLoan) {
    actions.push('TAKE_LOAN')
  }
  
  // Can build industries if have cards and money
  if (player.hand.length > 0 && player.money > 0) {
    actions.push('BUILD_INDUSTRY')
  }
  
  // Can develop locations if have money
  if (player.money > 0) {
    actions.push('DEVELOP_LOCATION')
  }
  
  // Can sell goods if have unflipped industries
  const unflippedIndustries = state.board.builtIndustries.filter(ind => 
    ind.playerId === playerId && !ind.flipped && 
    ['cotton', 'manufactured_goods', 'pottery'].includes(ind.type)
  )
  if (unflippedIndustries.length > 0) {
    actions.push('SELL_GOODS')
  }
  
  return actions
}