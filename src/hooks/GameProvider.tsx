import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { GameState, GameAction, Player } from '@/types'
import { gameReducer } from './gameReducer'
import { validatePlayerAction, validateGameState, shouldGameEnd } from './gameValidation'
import { ERA_TURN_LIMITS } from '@/data'

/**
 * Initial game state
 */
const initialGameState: GameState = {
  players: [],
  currentPlayer: 0,
  phase: 'action',
  era: 'canal',
  turn: 1,
  board: {
    locations: [],
    connections: [],
    builtIndustries: [],
    builtConnections: [],
    availableTiles: {
      coal: { canal: [], rail: [] },
      iron: { canal: [], rail: [] },
      cotton: { canal: [], rail: [] },
      manufactured_goods: { canal: [], rail: [] },
      pottery: { canal: [], rail: [] },
      brewery: { canal: [], rail: [] }
    }
  },
  market: {
    coal: { levels: [], prices: [] },
    iron: { levels: [], prices: [] }
  },
  externalMarkets: {
    cotton: { demand: [], prices: [] },
    manufacturedGoods: { demand: [], prices: [] },
    pottery: { demand: [], prices: [] }
  },
  deck: [],
  discardPile: [],
  gameEnded: false
}

/**
 * Game context interface
 */
interface GameContextType {
  state: GameState
  dispatch: (action: GameAction) => void
  isValidAction: (action: GameAction) => boolean
  getCurrentPlayer: () => string
  isPlayerTurn: (playerId: string) => boolean
  getPlayerById: (playerId: string) => Player | undefined
  canPerformAction: (playerId: string, actionType: string) => boolean
}

/**
 * Game context
 */
const GameContext = createContext<GameContextType | undefined>(undefined)

/**
 * Process automatic state transitions in the correct order to avoid race conditions
 */
function processAutomaticTransitions(state: GameState): GameState {
  let currentState = state
  
  // 1. First check if era should advance (highest priority)
  if (currentState.era === 'canal' && currentState.turn > ERA_TURN_LIMITS.canal && !currentState.gameEnded) {
    currentState = gameReducer(currentState, {
      type: 'ADVANCE_ERA',
      playerId: ''
    } as GameAction)
  }
  
  // 2. Then check if phase should advance (only if still in action phase)
  if (currentState.phase === 'action' && !currentState.gameEnded) {
    const allPlayersFinished = currentState.players.every(player => player.actionsRemaining === 0)
    if (allPlayersFinished) {
      currentState = gameReducer(currentState, {
        type: 'END_PHASE',
        playerId: ''
      } as GameAction)
    }
  }
  
  // 3. Finally check if game should end (lowest priority)
  if (shouldGameEnd(currentState) && !currentState.gameEnded) {
    currentState = gameReducer(currentState, {
      type: 'END_GAME',
      playerId: ''
    } as GameAction)
  }
  
  return currentState
}

/**
 * Enhanced reducer with validation and side effects
 */
function enhancedGameReducer(state: GameState, action: GameAction): GameState {
  // Process the action (validation is handled within individual reducers for better context)
  const newState = gameReducer(state, action)
  
  // If the state didn't change, the action was invalid
  if (newState === state && action.type !== 'INITIALIZE_GAME' && action.type !== 'RESET_GAME') {
    console.warn('Action was rejected:', action)
    return state
  }
  
  // Validate the resulting state
  const stateValidation = validateGameState(newState)
  if (!stateValidation.valid) {
    console.error('Invalid state after action:', stateValidation.error, action)
    return state // Return previous state if validation fails
  }
  
  // Apply automatic state transitions in proper order
  const finalState = processAutomaticTransitions(newState)
  
  return finalState
}

/**
 * Game provider component props
 */
interface GameProviderProps {
  children: ReactNode
  initialState?: Partial<GameState>
}

/**
 * Game provider component
 */
export function GameProvider({ children, initialState }: GameProviderProps) {
  const [state, dispatch] = useReducer(
    enhancedGameReducer,
    { ...initialGameState, ...initialState }
  )
  
  /**
   * Check if an action is valid
   */
  const isValidAction = (action: GameAction): boolean => {
    const validation = validatePlayerAction(state, action)
    return validation.valid
  }
  
  /**
   * Get the current player ID
   */
  const getCurrentPlayer = (): string => {
    if (state.players.length === 0) return ''
    return state.players[state.currentPlayer].id
  }
  
  /**
   * Check if it's a specific player's turn
   */
  const isPlayerTurn = (playerId: string): boolean => {
    return getCurrentPlayer() === playerId
  }
  
  /**
   * Get a player by ID
   */
  const getPlayerById = (playerId: string) => {
    return state.players.find(p => p.id === playerId)
  }
  
  /**
   * Check if a player can perform a specific action type
   */
  const canPerformAction = (playerId: string, actionType: string): boolean => {
    const player = getPlayerById(playerId)
    if (!player) return false
    
    if (!isPlayerTurn(playerId)) return false
    
    if (player.actionsRemaining <= 0 && actionType !== 'PASS') return false
    
    switch (actionType) {
      case 'TAKE_LOAN':
        return !player.hasLoan
        
      case 'BUILD_INDUSTRY':
        return player.hand.length > 0 && player.money > 0
        
      case 'DEVELOP_LOCATION':
        return player.money > 0
        
      case 'SELL_GOODS': {
        const unflippedIndustries = state.board.builtIndustries.filter(ind => 
          ind.playerId === playerId && 
          !ind.flipped && 
          ['cotton', 'manufactured_goods', 'pottery'].includes(ind.type)
        )
        return unflippedIndustries.length > 0
      }
        
      case 'PASS':
        return true
        
      default:
        return false
    }
  }
  
  const contextValue: GameContextType = {
    state,
    dispatch,
    isValidAction,
    getCurrentPlayer,
    isPlayerTurn,
    getPlayerById,
    canPerformAction
  }
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

/**
 * Hook to use the game context
 */
export function useGame(): GameContextType {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

/**
 * Hook to get the current player
 */
export function useCurrentPlayer() {
  const { state, getCurrentPlayer } = useGame()
  const currentPlayerId = getCurrentPlayer()
  return state.players.find(p => p.id === currentPlayerId)
}

/**
 * Hook to get a specific player
 */
export function usePlayer(playerId: string) {
  const { getPlayerById } = useGame()
  return getPlayerById(playerId)
}

/**
 * Hook to check if it's the local player's turn
 */
export function useIsPlayerTurn(playerId: string) {
  const { isPlayerTurn } = useGame()
  return isPlayerTurn(playerId)
}

/**
 * Hook to get available actions for a player
 */
export function useAvailableActions(playerId: string) {
  const { state, canPerformAction } = useGame()
  const player = state.players.find(p => p.id === playerId)
  
  if (!player) return []
  
  const actionTypes = [
    'BUILD_INDUSTRY',
    'DEVELOP_LOCATION', 
    'SELL_GOODS',
    'TAKE_LOAN',
    'PASS'
  ]
  
  return actionTypes.filter(actionType => canPerformAction(playerId, actionType))
}

/**
 * Hook for dispatching actions with validation
 */
export function useGameActions() {
  const { dispatch, isValidAction } = useGame()
  
  return {
    /**
     * Dispatch an action with validation
     */
    dispatchAction: (action: GameAction) => {
      if (isValidAction(action)) {
        dispatch(action)
      } else {
        console.warn('Action rejected by validation:', action)
      }
    },
    
    /**
     * Initialize a new game
     */
    initializeGame: (playerCount: number, playerNames: string[], playerColors: string[]) => {
      dispatch({
        type: 'INITIALIZE_GAME',
        playerId: '',
        playerCount,
        playerNames,
        playerColors
      } as GameAction)
    },
    
    /**
     * Build an industry
     */
    buildIndustry: (
      playerId: string,
      locationId: string,
      industryType: string,
      tileId: string,
      coalUsed: number = 0,
      ironUsed: number = 0
    ) => {
      dispatch({
        type: 'BUILD_INDUSTRY',
        playerId,
        locationId,
        industryType,
        tileId,
        coalUsed,
        ironUsed
      } as GameAction)
    },
    
    /**
     * Develop a location (build connection)
     */
    developLocation: (
      playerId: string,
      connectionId: string,
      coalUsed: number = 0,
      ironUsed: number = 0
    ) => {
      dispatch({
        type: 'DEVELOP_LOCATION',
        playerId,
        connectionId,
        coalUsed,
        ironUsed
      } as GameAction)
    },
    
    /**
     * Sell goods from an industry
     */
    sellGoods: (
      playerId: string,
      industryId: string,
      marketType: 'local' | 'distant' | 'external',
      goodsAmount: number,
      marketLocationId?: string
    ) => {
      dispatch({
        type: 'SELL_GOODS',
        playerId,
        industryId,
        marketType,
        marketLocationId,
        goodsAmount
      } as GameAction)
    },
    
    /**
     * Take a loan
     */
    takeLoan: (playerId: string) => {
      dispatch({
        type: 'TAKE_LOAN',
        playerId
      } as GameAction)
    },
    
    /**
     * Pass turn
     */
    pass: (playerId: string) => {
      dispatch({
        type: 'PASS',
        playerId
      } as GameAction)
    }
  }
}