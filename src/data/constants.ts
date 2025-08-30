/**
 * Game constants for Brass Birmingham
 * These define the core rules and mechanics of the game
 */

/**
 * Income track levels and their corresponding income values
 * Players move along this track to determine their income during the income phase
 */
export const INCOME_TRACK = [
  -10, -7, -4, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
  12, 14, 16, 18, 20, 22, 25, 28, 31, 34, 37, 40, 44, 48, 
  52, 56, 60, 65, 70, 75, 80, 86, 92, 98
]

/**
 * Starting income level for new players
 */
export const STARTING_INCOME_LEVEL = 10 // Index 10 = 5 income

/**
 * Starting money for new players
 */
export const STARTING_MONEY = 17

/**
 * Starting hand size for players
 */
export const STARTING_HAND_SIZE = 8

/**
 * Actions per turn for each player
 */
export const ACTIONS_PER_TURN = 2

/**
 * Loan configuration
 */
export const LOAN_AMOUNT = 30
export const LOAN_INTEREST = 3 // Income penalty per turn
export const LOAN_REPAYMENT = 30 // Cost to repay loan

/**
 * Victory points for money at end of game
 */
export const MONEY_TO_VICTORY_POINTS_RATIO = 4 // 4 money = 1 victory point

/**
 * Market refill amounts during market phase
 */
export const MARKET_REFILL = {
  coal: {
    levels: [1, 1, 1, 1, 0, 0], // Amount to add to each price level
    maxPerLevel: [4, 4, 3, 3, 2, 1] // Maximum that can be on each level
  },
  iron: {
    levels: [1, 1, 1, 1, 0, 0],
    maxPerLevel: [5, 5, 4, 4, 3, 2]
  }
}

/**
 * External market refill amounts
 */
export const EXTERNAL_MARKET_REFILL = {
  cotton: {
    demandIncrease: [1, 1, 0, 0, 0, 0, 0], // Amount to add to each price level
    maxPerLevel: [3, 3, 2, 2, 2, 1, 1] // Maximum demand at each level
  },
  manufacturedGoods: {
    demandIncrease: [1, 1, 1, 0, 0, 0],
    maxPerLevel: [3, 3, 3, 2, 2, 1]
  },
  pottery: {
    demandIncrease: [0, 1, 1, 0, 0], // Pottery market grows slowly
    maxPerLevel: [1, 2, 2, 1, 1]
  }
}

/**
 * Game phase configuration
 */
export const GAME_PHASES = {
  action: 'action',
  income: 'income',
  market: 'market'
} as const

/**
 * Era configuration
 */
export const ERAS = {
  canal: 'canal',
  rail: 'rail'
} as const

/**
 * Turn limits for each era
 */
export const ERA_TURN_LIMITS = {
  canal: 8, // Canal era lasts 8 turns per player
  rail: 6   // Rail era lasts 6 turns per player
}

/**
 * Card discard and draw rules
 */
export const CARD_MANAGEMENT = {
  maxHandSize: 8,
  cardsToDrawPerTurn: 2,
  cardsToDiscardAtEndOfEra: 'all' // Discard all cards at end of canal era
}

/**
 * Network building rules
 */
export const NETWORK_RULES = {
  maxConnectionsPerTurn: 1,
  mustConnectToOwnIndustry: true,
  cannotBuildOverExistingConnection: true
}

/**
 * Industry building rules
 */
export const INDUSTRY_RULES = {
  mustHaveMatchingCard: true,
  canBuildOnSameLocation: false, // Cannot build same industry type on same location
  maxIndustriesPerLocation: 'varies', // Depends on location
  mustPayResourceCosts: true
}

/**
 * Scoring configuration
 */
export const SCORING = {
  industryPoints: 'fromTile', // Victory points come from the industry tile
  connectionPoints: 'fromConnection', // Victory points from connection tiles
  moneyConversion: MONEY_TO_VICTORY_POINTS_RATIO,
  canalEraScoring: false, // No scoring during canal era
  railEraScoring: true // Full scoring at end of rail era
}

/**
 * Player count configurations
 */
export const PLAYER_COUNT_CONFIG = {
  min: 2,
  max: 4,
  optimal: 4
}

/**
 * Resource consumption rules
 */
export const RESOURCE_CONSUMPTION = {
  coalFirst: true, // Use coal before iron when both are required
  buyFromMarketFirst: true, // Buy from market before using own production
  coalForIron: true, // Coal mines can substitute for iron in some cases
  beerRequired: ['cotton', 'manufactured_goods', 'pottery'] // Industries that require beer
}

/**
 * Connection costs by era and type
 */
export const CONNECTION_COSTS = {
  canal: {
    min: 1,
    max: 4,
    typical: 2
  },
  rail: {
    min: 2,
    max: 6,
    typical: 3
  }
}

/**
 * Industry development costs
 */
export const DEVELOPMENT_COSTS = {
  minLevel: 1,
  maxLevel: 4,
  canalEraLevels: [1, 2],
  railEraLevels: [3, 4]
}

/**
 * Game end conditions
 */
export const GAME_END_CONDITIONS = {
  completedRailEra: true,
  allPlayersPass: true,
  noMoreActions: false // Game doesn't end if players run out of valid actions
}

/**
 * Helper functions for game constants
 */
export const getIncomeForLevel = (level: number): number => {
  if (level < 0 || level >= INCOME_TRACK.length) {
    return INCOME_TRACK[INCOME_TRACK.length - 1]
  }
  return INCOME_TRACK[level]
}

export const getMoneyVictoryPoints = (money: number): number => {
  return Math.floor(money / MONEY_TO_VICTORY_POINTS_RATIO)
}

export const isIndustryEligibleForEra = (industryLevel: number, era: 'canal' | 'rail'): boolean => {
  if (era === 'canal') {
    return DEVELOPMENT_COSTS.canalEraLevels.includes(industryLevel)
  } else {
    return DEVELOPMENT_COSTS.railEraLevels.includes(industryLevel)
  }
}

export const getMaxTurnsForEra = (era: 'canal' | 'rail'): number => {
  return ERA_TURN_LIMITS[era]
}