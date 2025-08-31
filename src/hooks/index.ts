// Custom React hooks for game logic and state management

// Game state management
export { gameReducer } from './gameReducer'
export { 
  GameProvider,
  useGame,
  useCurrentPlayer,
  usePlayer,
  useIsPlayerTurn,
  useAvailableActions,
  useGameActions
} from './GameProvider'

// Game validation utilities
export {
  validatePlayerAction,
  validateBuildIndustry,
  validateDevelopLocation,
  validateSellGoods,
  validateGameState,
  shouldGameEnd,
  getAvailableActions
} from './gameValidation'

export type { ValidationResult } from './gameValidation'