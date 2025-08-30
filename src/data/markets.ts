import { Market, ExternalMarket } from '@/types'

/**
 * Initial resource market configuration for coal and iron
 * Markets have multiple price levels with different availability
 */
export const initialMarket: Market = {
  coal: {
    // Available amounts at each price level (from cheapest to most expensive)
    levels: [3, 3, 2, 2, 1, 1],
    // Price for each level
    prices: [1, 2, 3, 4, 5, 6]
  },
  iron: {
    // Available amounts at each price level (from cheapest to most expensive)
    levels: [4, 4, 3, 3, 2, 1],
    // Price for each level
    prices: [1, 2, 3, 4, 5, 6]
  }
}

/**
 * External markets for selling manufactured goods
 * These represent foreign demand for Birmingham's products
 */
export const initialExternalMarkets: ExternalMarket = {
  cotton: {
    // Demand slots (from highest paying to lowest)
    demand: [2, 2, 1, 1, 1, 1, 1],
    // Price for each demand level
    prices: [8, 7, 6, 5, 4, 3, 2]
  },
  manufacturedGoods: {
    // Demand slots for manufactured goods
    demand: [2, 2, 2, 1, 1, 1],
    // Price for each demand level
    prices: [7, 6, 5, 4, 3, 2]
  },
  pottery: {
    // Demand slots for pottery (luxury market)
    demand: [1, 1, 1, 1, 1],
    // Price for each demand level (pottery is high-value, low-volume)
    prices: [10, 9, 8, 7, 6]
  }
}

/**
 * Market configuration for different player counts
 * Adjusts available resources based on number of players
 */
export const getMarketForPlayerCount = (playerCount: number): Market => {
  const baseMarket = JSON.parse(JSON.stringify(initialMarket)) as Market
  
  // Adjust coal availability based on player count
  switch (playerCount) {
    case 2:
      baseMarket.coal.levels = [2, 2, 2, 1, 1, 0]
      baseMarket.iron.levels = [3, 3, 2, 2, 1, 0]
      break
    case 3:
      baseMarket.coal.levels = [3, 2, 2, 2, 1, 0]
      baseMarket.iron.levels = [4, 3, 3, 2, 1, 1]
      break
    case 4:
      // Use default values (already set above)
      break
    default:
      // Default to 4-player configuration
      break
  }
  
  return baseMarket
}

/**
 * External market configuration for different player counts
 */
export const getExternalMarketsForPlayerCount = (playerCount: number): ExternalMarket => {
  const baseMarkets = JSON.parse(JSON.stringify(initialExternalMarkets)) as ExternalMarket
  
  // Adjust market demand based on player count
  switch (playerCount) {
    case 2:
      baseMarkets.cotton.demand = [1, 1, 1, 1, 0, 0, 0]
      baseMarkets.manufacturedGoods.demand = [1, 1, 1, 1, 0, 0]
      baseMarkets.pottery.demand = [1, 1, 1, 0, 0]
      break
    case 3:
      baseMarkets.cotton.demand = [2, 1, 1, 1, 1, 0, 0]
      baseMarkets.manufacturedGoods.demand = [2, 2, 1, 1, 1, 0]
      baseMarkets.pottery.demand = [1, 1, 1, 1, 0]
      break
    case 4:
      // Use default values (already set above)
      break
    default:
      // Default to 4-player configuration
      break
  }
  
  return baseMarkets
}

/**
 * Helper function to get the current lowest price for a resource
 */
export const getLowestPrice = (market: Market, resourceType: 'coal' | 'iron'): number => {
  const resource = market[resourceType]
  
  for (let i = 0; i < resource.levels.length; i++) {
    if (resource.levels[i] > 0) {
      return resource.prices[i]
    }
  }
  
  // If no resources available, return highest price + 1
  return resource.prices[resource.prices.length - 1] + 1
}

/**
 * Helper function to get the highest available price for selling goods
 */
export const getHighestSellPrice = (
  externalMarkets: ExternalMarket, 
  goodType: 'cotton' | 'manufacturedGoods' | 'pottery'
): number => {
  const market = externalMarkets[goodType]
  
  for (let i = 0; i < market.demand.length; i++) {
    if (market.demand[i] > 0) {
      return market.prices[i]
    }
  }
  
  return 0 // No demand available
}

/**
 * Helper function to purchase resources from the market
 */
export const purchaseFromMarket = (
  market: Market, 
  resourceType: 'coal' | 'iron', 
  amount: number
): { cost: number; success: boolean } => {
  const resource = market[resourceType]
  let totalCost = 0
  let remaining = amount
  
  // Create a copy to avoid mutating the original
  const tempLevels = [...resource.levels]
  
  for (let i = 0; i < tempLevels.length && remaining > 0; i++) {
    const available = tempLevels[i]
    const toTake = Math.min(available, remaining)
    
    if (toTake > 0) {
      totalCost += toTake * resource.prices[i]
      tempLevels[i] -= toTake
      remaining -= toTake
    }
  }
  
  if (remaining === 0) {
    // Purchase successful, update the actual market
    resource.levels.splice(0, resource.levels.length, ...tempLevels)
    return { cost: totalCost, success: true }
  } else {
    // Not enough resources available
    return { cost: 0, success: false }
  }
}

/**
 * Helper function to sell goods to external markets
 */
export const sellToMarket = (
  externalMarkets: ExternalMarket,
  goodType: 'cotton' | 'manufacturedGoods' | 'pottery',
  amount: number
): { income: number; success: boolean } => {
  const market = externalMarkets[goodType]
  let totalIncome = 0
  let remaining = amount
  
  // Create a copy to avoid mutating the original
  const tempDemand = [...market.demand]
  
  for (let i = 0; i < tempDemand.length && remaining > 0; i++) {
    const available = tempDemand[i]
    const toSell = Math.min(available, remaining)
    
    if (toSell > 0) {
      totalIncome += toSell * market.prices[i]
      tempDemand[i] -= toSell
      remaining -= toSell
    }
  }
  
  if (remaining === 0) {
    // Sale successful, update the actual market
    market.demand.splice(0, market.demand.length, ...tempDemand)
    return { income: totalIncome, success: true }
  } else {
    // Not enough demand available
    return { income: 0, success: false }
  }
}