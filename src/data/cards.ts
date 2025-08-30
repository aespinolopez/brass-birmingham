import { Card, IndustryType, Era } from '@/types'
import { locations } from './locations'

/**
 * Generate location cards for all board locations
 */
const generateLocationCards = (): Card[] => {
  const locationCards: Card[] = []
  
  locations.forEach((location) => {
    // Each location gets one card per era (some locations work in both eras)
    locationCards.push({
      id: `location-${location.id}-canal`,
      type: 'location',
      locationId: location.id,
      era: 'canal'
    })
    
    locationCards.push({
      id: `location-${location.id}-rail`,
      type: 'location',
      locationId: location.id,
      era: 'rail'
    })
  })
  
  return locationCards
}

/**
 * Generate industry cards for each industry type
 */
const generateIndustryCards = (): Card[] => {
  const industryCards: Card[] = []
  const industryTypes: IndustryType[] = ['coal', 'iron', 'cotton', 'manufactured_goods', 'pottery', 'brewery']
  
  industryTypes.forEach(industryType => {
    // Canal era industry cards
    for (let i = 0; i < 3; i++) {
      industryCards.push({
        id: `industry-${industryType}-canal-${i + 1}`,
        type: 'industry',
        industryType,
        era: 'canal'
      })
    }
    
    // Rail era industry cards
    for (let i = 0; i < 3; i++) {
      industryCards.push({
        id: `industry-${industryType}-rail-${i + 1}`,
        type: 'industry',
        industryType,
        era: 'rail'
      })
    }
  })
  
  return industryCards
}

/**
 * Generate wild cards that can be used as any location or industry
 */
const generateWildCards = (): Card[] => {
  const wildCards: Card[] = []
  
  // Wild cards for canal era
  for (let i = 0; i < 4; i++) {
    wildCards.push({
      id: `wild-canal-${i + 1}`,
      type: 'wild',
      era: 'canal'
    })
  }
  
  // Wild cards for rail era
  for (let i = 0; i < 4; i++) {
    wildCards.push({
      id: `wild-rail-${i + 1}`,
      type: 'wild',
      era: 'rail'
    })
  }
  
  return wildCards
}

/**
 * Complete deck of cards for Brass Birmingham
 */
export const cardDeck: Card[] = [
  ...generateLocationCards(),
  ...generateIndustryCards(),
  ...generateWildCards()
]

/**
 * Cards organized by era for easy access during different game phases
 */
export const canalEraCards = cardDeck.filter(card => card.era === 'canal')
export const railEraCards = cardDeck.filter(card => card.era === 'rail')

/**
 * Cards organized by type
 */
export const locationCards = cardDeck.filter(card => card.type === 'location')
export const industryCards = cardDeck.filter(card => card.type === 'industry')
export const wildCards = cardDeck.filter(card => card.type === 'wild')

/**
 * Helper function to get cards for a specific era
 */
export const getCardsForEra = (era: Era): Card[] => {
  return cardDeck.filter(card => card.era === era)
}

/**
 * Helper function to get industry cards for a specific type
 */
export const getIndustryCards = (industryType: IndustryType, era?: Era): Card[] => {
  let cards = industryCards.filter(card => card.industryType === industryType)
  
  if (era) {
    cards = cards.filter(card => card.era === era)
  }
  
  return cards
}

/**
 * Helper function to get location cards for a specific location
 */
export const getLocationCards = (locationId: string, era?: Era): Card[] => {
  let cards = locationCards.filter(card => card.locationId === locationId)
  
  if (era) {
    cards = cards.filter(card => card.era === era)
  }
  
  return cards
}