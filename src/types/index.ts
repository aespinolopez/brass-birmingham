// TypeScript type definitions for Brass Birmingham game entities

// Core game types
export type {
  Era,
  GamePhase,
  PlayerColor,
  IndustryType,
  ConnectionType,
  ResourceType,
  CardType,
  Location,
  Connection,
  IndustryTile,
  BuiltIndustry,
  Card,
  Market,
  ExternalMarket,
  Player,
  BoardState,
  GameState
} from './game'

// Action types
export type {
  BuildIndustryAction,
  DevelopLocationAction,
  SellGoodsAction,
  TakeLoanAction,
  PassAction,
  PlayCardAction,
  DiscardCardsAction,
  BuyResourcesAction,
  EndPhaseAction,
  StartTurnAction,
  AdvanceEraAction,
  CalculateIncomeAction,
  UpdateMarketsAction,
  EndGameAction,
  InitializeGameAction,
  ResetGameAction,
  GameAction
} from './actions'

// Type guards
export {
  isPlayerAction,
  requiresResources,
  isMarketAction
} from './actions'