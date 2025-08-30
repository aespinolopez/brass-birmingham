import { Location } from '@/types'

/**
 * Birmingham board locations based on historical West Midlands geography
 * Coordinates are based on SVG positioning for the game board
 */
export const locations: Location[] = [
  // Top row locations
  {
    id: 'stafford',
    name: 'Stafford',
    allowedIndustries: ['pottery', 'brewery'],
    industrySlots: 2,
    coordinates: { x: 150, y: 50 },
    marketConnections: ['pottery-market']
  },
  {
    id: 'stone',
    name: 'Stone',
    allowedIndustries: ['pottery', 'brewery'],
    industrySlots: 1,
    coordinates: { x: 200, y: 80 },
    marketConnections: ['pottery-market']
  },
  {
    id: 'uttoxeter',
    name: 'Uttoxeter',
    allowedIndustries: ['brewery'],
    industrySlots: 1,
    coordinates: { x: 250, y: 60 },
    marketConnections: []
  },
  {
    id: 'derby',
    name: 'Derby',
    allowedIndustries: ['iron', 'pottery', 'brewery'],
    industrySlots: 2,
    coordinates: { x: 350, y: 40 },
    marketConnections: ['pottery-market']
  },
  
  // Second row
  {
    id: 'cannock',
    name: 'Cannock',
    allowedIndustries: ['coal'],
    industrySlots: 2,
    coordinates: { x: 120, y: 120 },
    marketConnections: []
  },
  {
    id: 'burton-on-trent',
    name: 'Burton-on-Trent',
    allowedIndustries: ['brewery'],
    industrySlots: 2,
    coordinates: { x: 280, y: 120 },
    marketConnections: []
  },
  {
    id: 'tamworth',
    name: 'Tamworth',
    allowedIndustries: ['coal'],
    industrySlots: 1,
    coordinates: { x: 220, y: 140 },
    marketConnections: []
  },
  
  // Third row
  {
    id: 'wolverhampton',
    name: 'Wolverhampton',
    allowedIndustries: ['iron', 'manufactured_goods'],
    industrySlots: 2,
    coordinates: { x: 80, y: 180 },
    marketConnections: ['manufactured-goods-market']
  },
  {
    id: 'walsall',
    name: 'Walsall',
    allowedIndustries: ['iron'],
    industrySlots: 1,
    coordinates: { x: 140, y: 200 },
    marketConnections: []
  },
  {
    id: 'coalbrookdale',
    name: 'Coalbrookdale',
    allowedIndustries: ['coal', 'iron'],
    industrySlots: 2,
    coordinates: { x: 40, y: 160 },
    marketConnections: []
  },
  
  // Fourth row - Birmingham area
  {
    id: 'birmingham',
    name: 'Birmingham',
    allowedIndustries: ['iron', 'manufactured_goods', 'brewery'],
    industrySlots: 3,
    coordinates: { x: 180, y: 260 },
    marketConnections: ['manufactured-goods-market']
  },
  {
    id: 'west-bromwich',
    name: 'West Bromwich',
    allowedIndustries: ['iron'],
    industrySlots: 1,
    coordinates: { x: 120, y: 240 },
    marketConnections: []
  },
  
  // Fifth row
  {
    id: 'kidderminster',
    name: 'Kidderminster',
    allowedIndustries: ['cotton'],
    industrySlots: 2,
    coordinates: { x: 80, y: 320 },
    marketConnections: ['cotton-market']
  },
  {
    id: 'worcester',
    name: 'Worcester',
    allowedIndustries: ['cotton'],
    industrySlots: 1,
    coordinates: { x: 140, y: 360 },
    marketConnections: ['cotton-market']
  },
  {
    id: 'droitwich',
    name: 'Droitwich',
    allowedIndustries: ['pottery'],
    industrySlots: 1,
    coordinates: { x: 180, y: 340 },
    marketConnections: ['pottery-market']
  },
  
  // Sixth row
  {
    id: 'coventry',
    name: 'Coventry',
    allowedIndustries: ['cotton', 'manufactured_goods', 'pottery'],
    industrySlots: 3,
    coordinates: { x: 280, y: 280 },
    marketConnections: ['cotton-market', 'manufactured-goods-market', 'pottery-market']
  },
  {
    id: 'nuneaton',
    name: 'Nuneaton',
    allowedIndustries: ['coal'],
    industrySlots: 2,
    coordinates: { x: 320, y: 200 },
    marketConnections: []
  },
  {
    id: 'hinckley',
    name: 'Hinckley',
    allowedIndustries: ['cotton'],
    industrySlots: 1,
    coordinates: { x: 350, y: 240 },
    marketConnections: ['cotton-market']
  },
  
  // Seventh row
  {
    id: 'redditch',
    name: 'Redditch',
    allowedIndustries: ['manufactured_goods'],
    industrySlots: 1,
    coordinates: { x: 220, y: 380 },
    marketConnections: ['manufactured-goods-market']
  },
  {
    id: 'warwick',
    name: 'Warwick',
    allowedIndustries: ['pottery', 'brewery'],
    industrySlots: 2,
    coordinates: { x: 260, y: 340 },
    marketConnections: ['pottery-market']
  },
  {
    id: 'leamington',
    name: 'Leamington',
    allowedIndustries: ['manufactured_goods'],
    industrySlots: 1,
    coordinates: { x: 300, y: 360 },
    marketConnections: ['manufactured-goods-market']
  },
  
  // Bottom row
  {
    id: 'gloucester',
    name: 'Gloucester',
    allowedIndustries: ['pottery', 'brewery'],
    industrySlots: 2,
    coordinates: { x: 100, y: 420 },
    marketConnections: ['pottery-market']
  },
  {
    id: 'oxford',
    name: 'Oxford',
    allowedIndustries: ['brewery'],
    industrySlots: 2,
    coordinates: { x: 360, y: 420 },
    marketConnections: []
  },
  
  // Additional strategic locations
  {
    id: 'dudley',
    name: 'Dudley',
    allowedIndustries: ['coal', 'iron'],
    industrySlots: 2,
    coordinates: { x: 140, y: 300 },
    marketConnections: []
  },
  {
    id: 'stourbridge',
    name: 'Stourbridge',
    allowedIndustries: ['coal', 'iron'],
    industrySlots: 1,
    coordinates: { x: 100, y: 280 },
    marketConnections: []
  },
  {
    id: 'belper',
    name: 'Belper',
    allowedIndustries: ['cotton'],
    industrySlots: 1,
    coordinates: { x: 380, y: 80 },
    marketConnections: ['cotton-market']
  },
  {
    id: 'market-harborough',
    name: 'Market Harborough',
    allowedIndustries: ['brewery'],
    industrySlots: 1,
    coordinates: { x: 400, y: 300 },
    marketConnections: []
  },
  
  // Border locations
  {
    id: 'nottingham',
    name: 'Nottingham',
    allowedIndustries: ['cotton', 'manufactured_goods'],
    industrySlots: 2,
    coordinates: { x: 420, y: 140 },
    marketConnections: ['cotton-market', 'manufactured-goods-market']
  },
  {
    id: 'shrewsbury',
    name: 'Shrewsbury',
    allowedIndustries: ['coal'],
    industrySlots: 1,
    coordinates: { x: 20, y: 200 },
    marketConnections: []
  }
]