import { Station, TransitLineId } from '../types/transit';

export const STATIONS: Station[] = [
  // ==========================================
  // Line 1 Stations (North to South)
  // ==========================================
  {
    id: 'lynnwood-city-center',
    name: 'Lynnwood City Center',
    lines: ['line-1'],
    lat: 47.8152,
    lon: -122.2965,
    platforms: {
      northbound: {
        stopId: '40_N23-T1',
        directionName: 'Northbound Platform (Terminus)',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_N23-T2',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'mountlake-terrace',
    name: 'Mountlake Terrace',
    lines: ['line-1'],
    lat: 47.7901,
    lon: -122.3175,
    platforms: {
      northbound: {
        stopId: '40_N19-T1',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_N19-T2',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'shoreline-north-185th',
    name: 'Shoreline North/185th',
    lines: ['line-1'],
    lat: 47.7634,
    lon: -122.3278,
    platforms: {
      northbound: {
        stopId: '40_N17-T1',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_N17-T2',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'shoreline-south-148th',
    name: 'Shoreline South/148th',
    lines: ['line-1'],
    lat: 47.7371,
    lon: -122.3283,
    platforms: {
      northbound: {
        stopId: '40_N15-T1',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_N15-T2',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'northgate',
    name: 'Northgate',
    lines: ['line-1'],
    lat: 47.7058,
    lon: -122.3289,
    platforms: {
      northbound: {
        stopId: '40_990006',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_990005',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'roosevelt',
    name: 'Roosevelt',
    lines: ['line-1'],
    lat: 47.6789,
    lon: -122.3178,
    platforms: {
      northbound: {
        stopId: '40_990004',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_990003',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'u-district',
    name: 'U District',
    lines: ['line-1'],
    lat: 47.6608,
    lon: -122.3142,
    platforms: {
      northbound: {
        stopId: '40_990002',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_990001',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'university-of-washington',
    name: 'University of Washington',
    shortName: 'UW Station (Husky Stadium)',
    lines: ['line-1'],
    lat: 47.6499,
    lon: -122.3038,
    platforms: {
      northbound: {
        stopId: '40_99605',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99604',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'capitol-hill',
    name: 'Capitol Hill',
    lines: ['line-1'],
    lat: 47.6198,
    lon: -122.3204,
    platforms: {
      northbound: {
        stopId: '40_99603',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99610',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'westlake',
    name: 'Westlake',
    shortName: 'Downtown Seattle / Pine St',
    lines: ['line-1'],
    lat: 47.6114,
    lon: -122.3372,
    platforms: {
      northbound: {
        stopId: '40_1121',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_1108',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'symphony',
    name: 'Symphony',
    shortName: 'University Street Station',
    lines: ['line-1'],
    lat: 47.6074,
    lon: -122.3359,
    platforms: {
      northbound: {
        stopId: '40_565',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_455',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'pioneer-square',
    name: 'Pioneer Square',
    lines: ['line-1'],
    lat: 47.6025,
    lon: -122.3312,
    platforms: {
      northbound: {
        stopId: '40_532',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_501',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'international-district-chinatown',
    name: 'Intl. District / Chinatown',
    shortName: '1 Line ⇄ 2 Line Transfer Hub',
    lines: ['line-1'],
    lat: 47.5979,
    lon: -122.3283,
    platforms: {
      northbound: {
        stopId: '40_621',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_623',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'stadium',
    name: 'Stadium',
    shortName: 'Lumen Field / T-Mobile Park',
    lines: ['line-1'],
    lat: 47.5919,
    lon: -122.3271,
    platforms: {
      northbound: {
        stopId: '40_99260',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99101',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'sodo',
    name: 'SODO',
    lines: ['line-1'],
    lat: 47.5816,
    lon: -122.3273,
    platforms: {
      northbound: {
        stopId: '40_99256',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99111',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'beacon-hill',
    name: 'Beacon Hill',
    lines: ['line-1'],
    lat: 47.5794,
    lon: -122.3117,
    platforms: {
      northbound: {
        stopId: '40_99240',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99121',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'mount-baker',
    name: 'Mount Baker',
    lines: ['line-1'],
    lat: 47.5772,
    lon: -122.2978,
    platforms: {
      northbound: {
        stopId: '40_55860',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_55949',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'columbia-city',
    name: 'Columbia City',
    lines: ['line-1'],
    lat: 47.5599,
    lon: -122.2858,
    platforms: {
      northbound: {
        stopId: '40_55778',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_56039',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'othello',
    name: 'Othello',
    lines: ['line-1'],
    lat: 47.5372,
    lon: -122.2818,
    platforms: {
      northbound: {
        stopId: '40_55656',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_56159',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'rainier-beach',
    name: 'Rainier Beach',
    lines: ['line-1'],
    lat: 47.5222,
    lon: -122.2798,
    platforms: {
      northbound: {
        stopId: '40_55578',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_56173',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'tukwila-intl-blvd',
    name: 'Tukwila Intl. Blvd.',
    lines: ['line-1'],
    lat: 47.4644,
    lon: -122.2885,
    platforms: {
      northbound: {
        stopId: '40_99900',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99905',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'seatac-airport',
    name: 'SeaTac / Airport',
    shortName: "Seattle-Tacoma Int'l Airport",
    lines: ['line-1'],
    lat: 47.4439,
    lon: -122.2989,
    platforms: {
      northbound: {
        stopId: '40_99903',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99904',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'angle-lake',
    name: 'Angle Lake',
    lines: ['line-1'],
    lat: 47.4243,
    lon: -122.2982,
    platforms: {
      northbound: {
        stopId: '40_99913',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_99914',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'kent-des-moines',
    name: 'Kent Des Moines',
    shortName: 'Highline College',
    lines: ['line-1'],
    lat: 47.3886,
    lon: -122.2981,
    platforms: {
      northbound: {
        stopId: '40_S03-T1',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_S03-T2',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'star-lake',
    name: 'Star Lake',
    shortName: 'S 272nd Park & Ride',
    lines: ['line-1'],
    lat: 47.3575,
    lon: -122.3023,
    platforms: {
      northbound: {
        stopId: '40_S05-T1',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_S05-T2',
        directionName: 'Southbound to Federal Way Downtown',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },
  {
    id: 'federal-way-downtown',
    name: 'Federal Way Downtown',
    shortName: 'Federal Way Transit Center',
    lines: ['line-1'],
    lat: 47.3175,
    lon: -122.3115,
    platforms: {
      northbound: {
        stopId: '40_S07-T1',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_S07-T2',
        directionName: 'Southbound Platform (Terminus)',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  },

  // ==========================================
  // Line 2 Stations (West to East)
  // ==========================================
  {
    id: 'south-bellevue',
    name: 'South Bellevue',
    lines: ['line-2'],
    lat: 47.5878,
    lon: -122.1869,
    platforms: {
      westbound: {
        stopId: '40_E09-T2',
        directionName: 'Westbound Platform (Terminus)',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E09-T1',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'east-main',
    name: 'East Main',
    lines: ['line-2'],
    lat: 47.6041,
    lon: -122.1904,
    platforms: {
      westbound: {
        stopId: '40_E11-T2',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E11-T1',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'bellevue-downtown',
    name: 'Bellevue Downtown',
    lines: ['line-2'],
    lat: 47.6166,
    lon: -122.1932,
    platforms: {
      westbound: {
        stopId: '40_E15-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E15-T2',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'wilburton',
    name: 'Wilburton',
    lines: ['line-2'],
    lat: 47.6186,
    lon: -122.1802,
    platforms: {
      westbound: {
        stopId: '40_E19-T2',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E19-T1',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'spring-district',
    name: 'Spring District',
    lines: ['line-2'],
    lat: 47.6247,
    lon: -122.1648,
    platforms: {
      westbound: {
        stopId: '40_E21-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E21-T2',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'bel-red',
    name: 'BelRed',
    shortName: '130th Station',
    lines: ['line-2'],
    lat: 47.6288,
    lon: -122.1528,
    platforms: {
      westbound: {
        stopId: '40_E23-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E23-T2',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'overlake-village',
    name: 'Overlake Village',
    lines: ['line-2'],
    lat: 47.6384,
    lon: -122.1408,
    platforms: {
      westbound: {
        stopId: '40_E25-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E25-T2',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'redmond-technology',
    name: 'Redmond Technology',
    shortName: 'Microsoft Campus',
    lines: ['line-2'],
    lat: 47.6437,
    lon: -122.1287,
    platforms: {
      westbound: {
        stopId: '40_E27-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E27-T2',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'marymoor-village',
    name: 'Marymoor Village',
    lines: ['line-2'],
    lat: 47.6658,
    lon: -122.1158,
    platforms: {
      westbound: {
        stopId: '40_E29-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E29-T2',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'downtown-redmond',
    name: 'Downtown Redmond',
    lines: ['line-2'],
    lat: 47.6740,
    lon: -122.1228,
    platforms: {
      westbound: {
        stopId: '40_E31-T1',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '40_E31-T2',
        directionName: 'Eastbound Platform (Terminus)',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
];

export function getStationsByLine(lineId: TransitLineId): Station[] {
  return STATIONS.filter(s => s.lines.includes(lineId));
}

export function getStationById(id: string): Station | undefined {
  return STATIONS.find(s => s.id === id);
}

export const LINE_CONFIG = {
  'line-1': {
    id: 'line-1' as TransitLineId,
    name: '1 Line',
    color: '#008542', // Sound Transit Emerald Green
    secondaryColor: '#006633',
    terminusNorth: 'Lynnwood City Center',
    terminusSouth: 'Federal Way Downtown',
    badgeText: '1 LINE',
  },
  'line-2': {
    id: 'line-2' as TransitLineId,
    name: '2 Line',
    color: '#0072CE', // Sound Transit Cobalt Blue
    secondaryColor: '#005599',
    terminusNorth: 'Downtown Redmond',
    terminusSouth: 'South Bellevue',
    badgeText: '2 LINE',
  },
};
