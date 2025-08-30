import { IndustryTile } from '@/types'

/**
 * All industry tiles available in Brass Birmingham
 * Organized by era and industry type
 */

// Canal Era Industries (Levels 1-2)
const canalEraIndustries: IndustryTile[] = [
  // Coal Industries - Canal Era
  {
    id: 'coal-canal-1-a',
    type: 'coal',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 0,
    ironCost: 1,
    income: 4,
    victoryPoints: 1,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'coal', amount: 2 }
  },
  {
    id: 'coal-canal-1-b',
    type: 'coal',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 0,
    ironCost: 1,
    income: 4,
    victoryPoints: 1,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'coal', amount: 2 }
  },
  {
    id: 'coal-canal-1-c',
    type: 'coal',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 0,
    ironCost: 1,
    income: 4,
    victoryPoints: 1,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'coal', amount: 2 }
  },
  {
    id: 'coal-canal-2-a',
    type: 'coal',
    era: 'canal',
    level: 2,
    cost: 7,
    coalCost: 0,
    ironCost: 1,
    income: 7,
    victoryPoints: 2,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'coal', amount: 3 }
  },
  {
    id: 'coal-canal-2-b',
    type: 'coal',
    era: 'canal',
    level: 2,
    cost: 7,
    coalCost: 0,
    ironCost: 1,
    income: 7,
    victoryPoints: 2,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'coal', amount: 3 }
  },

  // Iron Industries - Canal Era
  {
    id: 'iron-canal-1-a',
    type: 'iron',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 3,
    victoryPoints: 3,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'iron', amount: 4 }
  },
  {
    id: 'iron-canal-1-b',
    type: 'iron',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 3,
    victoryPoints: 3,
    linkVictoryPoints: 1,
    resourceProduction: { type: 'iron', amount: 4 }
  },
  {
    id: 'iron-canal-2-a',
    type: 'iron',
    era: 'canal',
    level: 2,
    cost: 7,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    resourceProduction: { type: 'iron', amount: 4 }
  },
  {
    id: 'iron-canal-2-b',
    type: 'iron',
    era: 'canal',
    level: 2,
    cost: 7,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    resourceProduction: { type: 'iron', amount: 4 }
  },

  // Cotton Mills - Canal Era
  {
    id: 'cotton-canal-1-a',
    type: 'cotton',
    era: 'canal',
    level: 1,
    cost: 12,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    beerRequired: 1
  },
  {
    id: 'cotton-canal-1-b',
    type: 'cotton',
    era: 'canal',
    level: 1,
    cost: 12,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    beerRequired: 1
  },
  {
    id: 'cotton-canal-1-c',
    type: 'cotton',
    era: 'canal',
    level: 1,
    cost: 12,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    beerRequired: 1
  },

  // Manufactured Goods - Canal Era
  {
    id: 'manufactured-goods-canal-1-a',
    type: 'manufactured_goods',
    era: 'canal',
    level: 1,
    cost: 8,
    coalCost: 1,
    ironCost: 1,
    income: 2,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    beerRequired: 1
  },
  {
    id: 'manufactured-goods-canal-1-b',
    type: 'manufactured_goods',
    era: 'canal',
    level: 1,
    cost: 8,
    coalCost: 1,
    ironCost: 1,
    income: 2,
    victoryPoints: 5,
    linkVictoryPoints: 2,
    beerRequired: 1
  },

  // Pottery - Canal Era
  {
    id: 'pottery-canal-1-a',
    type: 'pottery',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 1,
    victoryPoints: 10,
    linkVictoryPoints: 1,
    beerRequired: 1
  },
  {
    id: 'pottery-canal-1-b',
    type: 'pottery',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 1,
    victoryPoints: 10,
    linkVictoryPoints: 1,
    beerRequired: 1
  },
  {
    id: 'pottery-canal-1-c',
    type: 'pottery',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 1,
    victoryPoints: 10,
    linkVictoryPoints: 1,
    beerRequired: 1
  },

  // Brewery - Canal Era
  {
    id: 'brewery-canal-1-a',
    type: 'brewery',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 4,
    victoryPoints: 4,
    linkVictoryPoints: 1
  },
  {
    id: 'brewery-canal-1-b',
    type: 'brewery',
    era: 'canal',
    level: 1,
    cost: 5,
    coalCost: 1,
    ironCost: 0,
    income: 4,
    victoryPoints: 4,
    linkVictoryPoints: 1
  },
  {
    id: 'brewery-canal-2-a',
    type: 'brewery',
    era: 'canal',
    level: 2,
    cost: 9,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 1
  },
  {
    id: 'brewery-canal-2-b',
    type: 'brewery',
    era: 'canal',
    level: 2,
    cost: 9,
    coalCost: 1,
    ironCost: 0,
    income: 5,
    victoryPoints: 5,
    linkVictoryPoints: 1
  }
]

// Rail Era Industries (Levels 3-4)
const railEraIndustries: IndustryTile[] = [
  // Coal Industries - Rail Era
  {
    id: 'coal-rail-3-a',
    type: 'coal',
    era: 'rail',
    level: 3,
    cost: 8,
    coalCost: 0,
    ironCost: 2,
    income: 6,
    victoryPoints: 3,
    linkVictoryPoints: 2,
    resourceProduction: { type: 'coal', amount: 4 }
  },
  {
    id: 'coal-rail-3-b',
    type: 'coal',
    era: 'rail',
    level: 3,
    cost: 8,
    coalCost: 0,
    ironCost: 2,
    income: 6,
    victoryPoints: 3,
    linkVictoryPoints: 2,
    resourceProduction: { type: 'coal', amount: 4 }
  },
  {
    id: 'coal-rail-4-a',
    type: 'coal',
    era: 'rail',
    level: 4,
    cost: 10,
    coalCost: 0,
    ironCost: 2,
    income: 8,
    victoryPoints: 4,
    linkVictoryPoints: 2,
    resourceProduction: { type: 'coal', amount: 5 }
  },

  // Iron Industries - Rail Era
  {
    id: 'iron-rail-3-a',
    type: 'iron',
    era: 'rail',
    level: 3,
    cost: 7,
    coalCost: 1,
    ironCost: 0,
    income: 6,
    victoryPoints: 7,
    linkVictoryPoints: 3,
    resourceProduction: { type: 'iron', amount: 5 }
  },
  {
    id: 'iron-rail-3-b',
    type: 'iron',
    era: 'rail',
    level: 3,
    cost: 7,
    coalCost: 1,
    ironCost: 0,
    income: 6,
    victoryPoints: 7,
    linkVictoryPoints: 3,
    resourceProduction: { type: 'iron', amount: 5 }
  },
  {
    id: 'iron-rail-4-a',
    type: 'iron',
    era: 'rail',
    level: 4,
    cost: 9,
    coalCost: 1,
    ironCost: 0,
    income: 7,
    victoryPoints: 9,
    linkVictoryPoints: 3,
    resourceProduction: { type: 'iron', amount: 6 }
  },

  // Cotton Mills - Rail Era
  {
    id: 'cotton-rail-3-a',
    type: 'cotton',
    era: 'rail',
    level: 3,
    cost: 16,
    coalCost: 1,
    ironCost: 1,
    income: 8,
    victoryPoints: 12,
    linkVictoryPoints: 3,
    beerRequired: 1
  },
  {
    id: 'cotton-rail-3-b',
    type: 'cotton',
    era: 'rail',
    level: 3,
    cost: 16,
    coalCost: 1,
    ironCost: 1,
    income: 8,
    victoryPoints: 12,
    linkVictoryPoints: 3,
    beerRequired: 1
  },
  {
    id: 'cotton-rail-4-a',
    type: 'cotton',
    era: 'rail',
    level: 4,
    cost: 20,
    coalCost: 1,
    ironCost: 1,
    income: 10,
    victoryPoints: 15,
    linkVictoryPoints: 4,
    beerRequired: 1
  },

  // Manufactured Goods - Rail Era
  {
    id: 'manufactured-goods-rail-3-a',
    type: 'manufactured_goods',
    era: 'rail',
    level: 3,
    cost: 12,
    coalCost: 1,
    ironCost: 1,
    income: 4,
    victoryPoints: 11,
    linkVictoryPoints: 3,
    beerRequired: 1
  },
  {
    id: 'manufactured-goods-rail-3-b',
    type: 'manufactured_goods',
    era: 'rail',
    level: 3,
    cost: 12,
    coalCost: 1,
    ironCost: 1,
    income: 4,
    victoryPoints: 11,
    linkVictoryPoints: 3,
    beerRequired: 1
  },
  {
    id: 'manufactured-goods-rail-4-a',
    type: 'manufactured_goods',
    era: 'rail',
    level: 4,
    cost: 16,
    coalCost: 1,
    ironCost: 1,
    income: 5,
    victoryPoints: 17,
    linkVictoryPoints: 4,
    beerRequired: 1
  },

  // Pottery - Rail Era
  {
    id: 'pottery-rail-3-a',
    type: 'pottery',
    era: 'rail',
    level: 3,
    cost: 8,
    coalCost: 2,
    ironCost: 0,
    income: 2,
    victoryPoints: 20,
    linkVictoryPoints: 2,
    beerRequired: 1
  },
  {
    id: 'pottery-rail-3-b',
    type: 'pottery',
    era: 'rail',
    level: 3,
    cost: 8,
    coalCost: 2,
    ironCost: 0,
    income: 2,
    victoryPoints: 20,
    linkVictoryPoints: 2,
    beerRequired: 1
  },

  // Brewery - Rail Era
  {
    id: 'brewery-rail-3-a',
    type: 'brewery',
    era: 'rail',
    level: 3,
    cost: 9,
    coalCost: 1,
    ironCost: 1,
    income: 7,
    victoryPoints: 7,
    linkVictoryPoints: 2
  },
  {
    id: 'brewery-rail-3-b',
    type: 'brewery',
    era: 'rail',
    level: 3,
    cost: 9,
    coalCost: 1,
    ironCost: 1,
    income: 7,
    victoryPoints: 7,
    linkVictoryPoints: 2
  },
  {
    id: 'brewery-rail-4-a',
    type: 'brewery',
    era: 'rail',
    level: 4,
    cost: 12,
    coalCost: 1,
    ironCost: 1,
    income: 8,
    victoryPoints: 8,
    linkVictoryPoints: 2
  }
]

/**
 * All industry tiles organized by type and era for easy access
 */
export const industryTiles = {
  coal: {
    canal: canalEraIndustries.filter(tile => tile.type === 'coal'),
    rail: railEraIndustries.filter(tile => tile.type === 'coal')
  },
  iron: {
    canal: canalEraIndustries.filter(tile => tile.type === 'iron'),
    rail: railEraIndustries.filter(tile => tile.type === 'iron')
  },
  cotton: {
    canal: canalEraIndustries.filter(tile => tile.type === 'cotton'),
    rail: railEraIndustries.filter(tile => tile.type === 'cotton')
  },
  manufactured_goods: {
    canal: canalEraIndustries.filter(tile => tile.type === 'manufactured_goods'),
    rail: railEraIndustries.filter(tile => tile.type === 'manufactured_goods')
  },
  pottery: {
    canal: canalEraIndustries.filter(tile => tile.type === 'pottery'),
    rail: railEraIndustries.filter(tile => tile.type === 'pottery')
  },
  brewery: {
    canal: canalEraIndustries.filter(tile => tile.type === 'brewery'),
    rail: railEraIndustries.filter(tile => tile.type === 'brewery')
  }
}

/**
 * All industry tiles as flat arrays for convenience
 */
export const allIndustryTiles = [...canalEraIndustries, ...railEraIndustries]
export const canalIndustries = canalEraIndustries
export const railIndustries = railEraIndustries