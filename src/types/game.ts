/**
 * Core game type definitions for Brass Birmingham
 */

/**
 * The two eras of the game
 */
export type Era = 'canal' | 'rail'

/**
 * Current phase of a player's turn
 */
export type GamePhase = 'action' | 'income' | 'market'

/**
 * Player colors available in the game
 */
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow'

/**
 * Types of industries that can be built
 */
export type IndustryType = 'coal' | 'iron' | 'cotton' | 'manufactured_goods' | 'pottery' | 'brewery'

/**
 * Types of connections between locations
 */
export type ConnectionType = 'canal' | 'rail'

/**
 * Resource types in the game
 */
export type ResourceType = 'coal' | 'iron' | 'beer'

/**
 * Card types in player hands
 */
export type CardType = 'location' | 'industry' | 'wild'

/**
 * Represents a location on the game board
 */
export interface Location {
  /** Unique identifier for the location */
  id: string
  /** Display name of the location */
  name: string
  /** Industries that can be built at this location */
  allowedIndustries: IndustryType[]
  /** Available industry slots */
  industrySlots: number
  /** SVG coordinates for rendering */
  coordinates: {
    x: number
    y: number
  }
  /** Market connections (for selling goods) */
  marketConnections: string[]
}

/**
 * Represents a connection between two locations
 */
export interface Connection {
  /** Unique identifier for the connection */
  id: string
  /** Starting location ID */
  from: string
  /** Ending location ID */
  to: string
  /** Type of connection */
  type: ConnectionType
  /** Cost to build the connection */
  cost: number
  /** Which era this connection is available in */
  era: Era | 'both'
  /** Victory points for building this connection */
  victoryPoints: number
}

/**
 * Represents an industry tile
 */
export interface IndustryTile {
  /** Unique identifier for the tile */
  id: string
  /** Type of industry */
  type: IndustryType
  /** Era this tile belongs to */
  era: Era
  /** Level of the industry (1-4) */
  level: number
  /** Cost to build */
  cost: number
  /** Coal required to build */
  coalCost: number
  /** Iron required to build */
  ironCost: number
  /** Income generated during income phase */
  income: number
  /** Victory points for building */
  victoryPoints: number
  /** Victory points for connection to this industry */
  linkVictoryPoints: number
  /** Resource production (for coal/iron industries) */
  resourceProduction?: {
    type: ResourceType
    amount: number
  }
  /** Beer requirement for operation */
  beerRequired?: number
}

/**
 * Represents an industry built on the board
 */
export interface BuiltIndustry extends IndustryTile {
  /** Location where it's built */
  locationId: string
  /** Player who owns it */
  playerId: string
  /** Whether it has been used this turn */
  used: boolean
  /** Whether it's flipped (sold goods/used production) */
  flipped: boolean
}

/**
 * Represents a card in a player's hand
 */
export interface Card {
  /** Unique identifier for the card */
  id: string
  /** Type of card */
  type: CardType
  /** Location ID (for location cards) */
  locationId?: string
  /** Industry type (for industry cards) */
  industryType?: IndustryType
  /** Era this card is active in */
  era: Era | 'both'
}

/**
 * Market state for resources
 */
export interface Market {
  /** Available coal on the market */
  coal: {
    /** Available amounts at each price level */
    levels: number[]
    /** Current prices */
    prices: number[]
  }
  /** Available iron on the market */
  iron: {
    /** Available amounts at each price level */
    levels: number[]
    /** Current prices */
    prices: number[]
  }
}

/**
 * External market for selling goods
 */
export interface ExternalMarket {
  /** Cotton market */
  cotton: {
    /** Available demand */
    demand: number[]
    /** Current prices */
    prices: number[]
  }
  /** Manufactured goods market */
  manufacturedGoods: {
    /** Available demand */
    demand: number[]
    /** Current prices */
    prices: number[]
  }
  /** Pottery market */
  pottery: {
    /** Available demand */
    demand: number[]
    /** Current prices */
    prices: number[]
  }
}

/**
 * Represents a player in the game
 */
export interface Player {
  /** Unique identifier for the player */
  id: string
  /** Player's chosen color */
  color: PlayerColor
  /** Player's display name */
  name: string
  /** Current money */
  money: number
  /** Current income level */
  income: number
  /** Victory points */
  victoryPoints: number
  /** Cards in hand */
  hand: Card[]
  /** Number of actions remaining this turn */
  actionsRemaining: number
  /** Industries built by this player */
  industries: BuiltIndustry[]
  /** Connections built by this player */
  connections: string[]
  /** Whether player has taken a loan */
  hasLoan: boolean
}

/**
 * State of the game board
 */
export interface BoardState {
  /** All locations on the board */
  locations: Location[]
  /** All possible connections */
  connections: Connection[]
  /** Industries built on the board */
  builtIndustries: BuiltIndustry[]
  /** Connections that have been built */
  builtConnections: string[]
  /** Available industry tiles by type and era */
  availableTiles: {
    [key in IndustryType]: {
      canal: IndustryTile[]
      rail: IndustryTile[]
    }
  }
}

/**
 * Complete game state
 */
export interface GameState {
  /** Array of all players */
  players: Player[]
  /** Current player index */
  currentPlayer: number
  /** Current game phase */
  phase: GamePhase
  /** Current era */
  era: Era
  /** Current turn number */
  turn: number
  /** State of the game board */
  board: BoardState
  /** Resource markets */
  market: Market
  /** External markets for goods */
  externalMarkets: ExternalMarket
  /** Deck of cards */
  deck: Card[]
  /** Discard pile */
  discardPile: Card[]
  /** Whether the game has ended */
  gameEnded: boolean
  /** Final scores (only set when game ends) */
  finalScores?: {
    [playerId: string]: {
      industryPoints: number
      connectionPoints: number
      moneyPoints: number
      totalPoints: number
    }
  }
}