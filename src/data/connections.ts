import { Connection, ConnectionType, Era } from '@/types'

/**
 * All possible connections between locations on the Birmingham board
 * Each connection specifies cost, victory points, and era availability
 */
export const connections: Connection[] = [
  // Canal connections (available in Canal era)
  {
    id: 'canal-coalbrookdale-wolverhampton',
    from: 'coalbrookdale',
    to: 'wolverhampton',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-wolverhampton-walsall',
    from: 'wolverhampton',
    to: 'walsall',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-walsall-birmingham',
    from: 'walsall',
    to: 'birmingham',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-birmingham-coventry',
    from: 'birmingham',
    to: 'coventry',
    type: 'canal',
    cost: 4,
    era: 'canal',
    victoryPoints: 2
  },
  {
    id: 'canal-cannock-walsall',
    from: 'cannock',
    to: 'walsall',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-stafford-stone',
    from: 'stafford',
    to: 'stone',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-stone-uttoxeter',
    from: 'stone',
    to: 'uttoxeter',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-uttoxeter-burton-on-trent',
    from: 'uttoxeter',
    to: 'burton-on-trent',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-burton-on-trent-derby',
    from: 'burton-on-trent',
    to: 'derby',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-tamworth-birmingham',
    from: 'tamworth',
    to: 'birmingham',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-birmingham-warwick',
    from: 'birmingham',
    to: 'warwick',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-warwick-leamington',
    from: 'warwick',
    to: 'leamington',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-birmingham-worcester',
    from: 'birmingham',
    to: 'worcester',
    type: 'canal',
    cost: 4,
    era: 'canal',
    victoryPoints: 2
  },
  {
    id: 'canal-worcester-gloucester',
    from: 'worcester',
    to: 'gloucester',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-kidderminster-worcester',
    from: 'kidderminster',
    to: 'worcester',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-wolverhampton-kidderminster',
    from: 'wolverhampton',
    to: 'kidderminster',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-birmingham-dudley',
    from: 'birmingham',
    to: 'dudley',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-dudley-stourbridge',
    from: 'dudley',
    to: 'stourbridge',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-west-bromwich-birmingham',
    from: 'west-bromwich',
    to: 'birmingham',
    type: 'canal',
    cost: 1,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-coventry-nuneaton',
    from: 'coventry',
    to: 'nuneaton',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-coventry-hinckley',
    from: 'coventry',
    to: 'hinckley',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-warwick-droitwich',
    from: 'warwick',
    to: 'droitwich',
    type: 'canal',
    cost: 3,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-droitwich-worcester',
    from: 'droitwich',
    to: 'worcester',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-redditch-warwick',
    from: 'redditch',
    to: 'warwick',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-derby-belper',
    from: 'derby',
    to: 'belper',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },
  {
    id: 'canal-shrewsbury-coalbrookdale',
    from: 'shrewsbury',
    to: 'coalbrookdale',
    type: 'canal',
    cost: 2,
    era: 'canal',
    victoryPoints: 1
  },

  // Rail connections (available in Rail era)
  {
    id: 'rail-shrewsbury-wolverhampton',
    from: 'shrewsbury',
    to: 'wolverhampton',
    type: 'rail',
    cost: 5,
    era: 'rail',
    victoryPoints: 3
  },
  {
    id: 'rail-stafford-wolverhampton',
    from: 'stafford',
    to: 'wolverhampton',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-stafford-cannock',
    from: 'stafford',
    to: 'cannock',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-stafford-tamworth',
    from: 'stafford',
    to: 'tamworth',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-tamworth-nuneaton',
    from: 'tamworth',
    to: 'nuneaton',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-nuneaton-coventry',
    from: 'nuneaton',
    to: 'coventry',
    type: 'rail',
    cost: 2,
    era: 'rail',
    victoryPoints: 1
  },
  {
    id: 'rail-coventry-leamington',
    from: 'coventry',
    to: 'leamington',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-birmingham-coventry',
    from: 'birmingham',
    to: 'coventry',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 3
  },
  {
    id: 'rail-wolverhampton-birmingham',
    from: 'wolverhampton',
    to: 'birmingham',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-cannock-birmingham',
    from: 'cannock',
    to: 'birmingham',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-birmingham-warwick',
    from: 'birmingham',
    to: 'warwick',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-warwick-oxford',
    from: 'warwick',
    to: 'oxford',
    type: 'rail',
    cost: 6,
    era: 'rail',
    victoryPoints: 4
  },
  {
    id: 'rail-birmingham-gloucester',
    from: 'birmingham',
    to: 'gloucester',
    type: 'rail',
    cost: 5,
    era: 'rail',
    victoryPoints: 3
  },
  {
    id: 'rail-gloucester-oxford',
    from: 'gloucester',
    to: 'oxford',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 3
  },
  {
    id: 'rail-kidderminster-birmingham',
    from: 'kidderminster',
    to: 'birmingham',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-derby-nottingham',
    from: 'derby',
    to: 'nottingham',
    type: 'rail',
    cost: 4,
    era: 'rail',
    victoryPoints: 3
  },
  {
    id: 'rail-derby-tamworth',
    from: 'derby',
    to: 'tamworth',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-burton-on-trent-tamworth',
    from: 'burton-on-trent',
    to: 'tamworth',
    type: 'rail',
    cost: 2,
    era: 'rail',
    victoryPoints: 1
  },
  {
    id: 'rail-stone-derby',
    from: 'stone',
    to: 'derby',
    type: 'rail',
    cost: 5,
    era: 'rail',
    victoryPoints: 3
  },
  {
    id: 'rail-uttoxeter-derby',
    from: 'uttoxeter',
    to: 'derby',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-hinckley-market-harborough',
    from: 'hinckley',
    to: 'market-harborough',
    type: 'rail',
    cost: 3,
    era: 'rail',
    victoryPoints: 2
  },
  {
    id: 'rail-coventry-hinckley',
    from: 'coventry',
    to: 'hinckley',
    type: 'rail',
    cost: 2,
    era: 'rail',
    victoryPoints: 1
  },
  {
    id: 'rail-nuneaton-hinckley',
    from: 'nuneaton',
    to: 'hinckley',
    type: 'rail',
    cost: 2,
    era: 'rail',
    victoryPoints: 1
  },

  // Cross-era connections (available in both eras)
  {
    id: 'both-birmingham-redditch',
    from: 'birmingham',
    to: 'redditch',
    type: 'canal',
    cost: 3,
    era: 'both',
    victoryPoints: 2
  },
  {
    id: 'both-worcester-redditch',
    from: 'worcester',
    to: 'redditch',
    type: 'canal',
    cost: 2,
    era: 'both',
    victoryPoints: 1
  }
]

/**
 * Get connections available in a specific era
 */
export const getConnectionsForEra = (era: Era): Connection[] => {
  return connections.filter(connection => 
    connection.era === era || connection.era === 'both'
  )
}

/**
 * Get connections by type (canal or rail)
 */
export const getConnectionsByType = (type: ConnectionType): Connection[] => {
  return connections.filter(connection => connection.type === type)
}

/**
 * Get connections from a specific location
 */
export const getConnectionsFromLocation = (locationId: string, era?: Era): Connection[] => {
  let validConnections = connections.filter(connection => 
    connection.from === locationId || connection.to === locationId
  )
  
  if (era) {
    validConnections = validConnections.filter(connection => 
      connection.era === era || connection.era === 'both'
    )
  }
  
  return validConnections
}

/**
 * Check if two locations are connected
 */
export const areLocationsConnected = (
  location1: string, 
  location2: string, 
  era?: Era
): boolean => {
  let validConnections = connections.filter(connection => 
    (connection.from === location1 && connection.to === location2) ||
    (connection.from === location2 && connection.to === location1)
  )
  
  if (era) {
    validConnections = validConnections.filter(connection => 
      connection.era === era || connection.era === 'both'
    )
  }
  
  return validConnections.length > 0
}

/**
 * Get the connection between two specific locations
 */
export const getConnectionBetween = (
  location1: string, 
  location2: string, 
  era?: Era
): Connection | undefined => {
  let validConnections = connections.filter(connection => 
    (connection.from === location1 && connection.to === location2) ||
    (connection.from === location2 && connection.to === location1)
  )
  
  if (era) {
    validConnections = validConnections.filter(connection => 
      connection.era === era || connection.era === 'both'
    )
  }
  
  return validConnections[0]
}

/**
 * Canal era connections only
 */
export const canalConnections = getConnectionsForEra('canal')

/**
 * Rail era connections only
 */
export const railConnections = getConnectionsForEra('rail')