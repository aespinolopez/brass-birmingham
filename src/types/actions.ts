/**
 * Action types for the game state reducer
 */

import type { IndustryType, PlayerColor, ResourceType } from './game'

/**
 * Base action interface
 */
interface BaseAction {
  type: string
  playerId: string
}

/**
 * Action to build an industry at a location
 */
export interface BuildIndustryAction extends BaseAction {
  type: 'BUILD_INDUSTRY'
  locationId: string
  industryType: IndustryType
  tileId: string
  coalUsed: number
  ironUsed: number
}

/**
 * Action to develop a location (build connection)
 */
export interface DevelopLocationAction extends BaseAction {
  type: 'DEVELOP_LOCATION'
  connectionId: string
  coalUsed: number
  ironUsed: number
}

/**
 * Action to sell goods from an industry
 */
export interface SellGoodsAction extends BaseAction {
  type: 'SELL_GOODS'
  industryId: string
  marketType: 'local' | 'distant' | 'external'
  marketLocationId?: string
  goodsAmount: number
}

/**
 * Action to take a loan
 */
export interface TakeLoanAction extends BaseAction {
  type: 'TAKE_LOAN'
}

/**
 * Action to pass the turn
 */
export interface PassAction extends BaseAction {
  type: 'PASS'
}

/**
 * Action to play a card
 */
export interface PlayCardAction extends BaseAction {
  type: 'PLAY_CARD'
  cardId: string
}

/**
 * Action to discard cards
 */
export interface DiscardCardsAction extends BaseAction {
  type: 'DISCARD_CARDS'
  cardIds: string[]
}

/**
 * Action to buy resources from market
 */
export interface BuyResourcesAction extends BaseAction {
  type: 'BUY_RESOURCES'
  purchases: Array<{
    resource: ResourceType
    amount: number
    cost: number
  }>
}

/**
 * Action to end the current phase
 */
export interface EndPhaseAction extends BaseAction {
  type: 'END_PHASE'
}

/**
 * Action to start a new turn
 */
export interface StartTurnAction extends BaseAction {
  type: 'START_TURN'
}

/**
 * Action to advance to the next era
 */
export interface AdvanceEraAction extends BaseAction {
  type: 'ADVANCE_ERA'
}

/**
 * Action to calculate income for all players
 */
export interface CalculateIncomeAction extends BaseAction {
  type: 'CALCULATE_INCOME'
}

/**
 * Action to update markets after resource consumption
 */
export interface UpdateMarketsAction extends BaseAction {
  type: 'UPDATE_MARKETS'
  coalConsumed: number
  ironConsumed: number
}

/**
 * Action to end the game
 */
export interface EndGameAction extends BaseAction {
  type: 'END_GAME'
}

/**
 * Action to initialize a new game
 */
export interface InitializeGameAction extends BaseAction {
  type: 'INITIALIZE_GAME'
  playerCount: number
  playerNames: string[]
  playerColors: PlayerColor[]
}

/**
 * Action to reset the game state
 */
export interface ResetGameAction extends BaseAction {
  type: 'RESET_GAME'
}

/**
 * Union type of all possible game actions
 */
export type GameAction =
  | BuildIndustryAction
  | DevelopLocationAction
  | SellGoodsAction
  | TakeLoanAction
  | PassAction
  | PlayCardAction
  | DiscardCardsAction
  | BuyResourcesAction
  | EndPhaseAction
  | StartTurnAction
  | AdvanceEraAction
  | CalculateIncomeAction
  | UpdateMarketsAction
  | EndGameAction
  | InitializeGameAction
  | ResetGameAction

/**
 * Type guard to check if an action is a player action
 */
export function isPlayerAction(action: GameAction): boolean {
  return action.playerId !== ''
}

/**
 * Type guard to check if an action requires resources
 */
export function requiresResources(action: GameAction): action is BuildIndustryAction | DevelopLocationAction {
  return action.type === 'BUILD_INDUSTRY' || action.type === 'DEVELOP_LOCATION'
}

/**
 * Type guard to check if an action is a market action
 */
export function isMarketAction(action: GameAction): action is SellGoodsAction | BuyResourcesAction {
  return action.type === 'SELL_GOODS' || action.type === 'BUY_RESOURCES'
}