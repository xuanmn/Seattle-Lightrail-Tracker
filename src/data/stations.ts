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
        stopId: '1_99001',
        directionName: 'Northbound Platform (Terminus)',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99002',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99003',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99004',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
      },
    },
  },
  {
    id: 'shoreline-north-185th',
    name: 'Shoreline North / 185th',
    lines: ['line-1'],
    lat: 47.7634,
    lon: -122.3278,
    platforms: {
      northbound: {
        stopId: '1_99005',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99006',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
      },
    },
  },
  {
    id: 'shoreline-south-148th',
    name: 'Shoreline South / 148th',
    lines: ['line-1'],
    lat: 47.7371,
    lon: -122.3283,
    platforms: {
      northbound: {
        stopId: '1_99007',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99008',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99009',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99010',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99605',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99606',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99607',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99608',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99609',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99610',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99611',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99612',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_1121',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_1122',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_1123',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_1124',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_1125',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_1126',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
      },
    },
  },
  {
    id: 'international-district-chinatown',
    name: "Int'l District / Chinatown",
    lines: ['line-1'],
    lat: 47.5979,
    lon: -122.3283,
    platforms: {
      northbound: {
        stopId: '1_1127',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_1128',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99113',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99114',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99115',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99116',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99117',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99118',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99119',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99120',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99121',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99122',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99123',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99124',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99125',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99126',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
      },
    },
  },
  {
    id: 'tukwila-intl-blvd',
    name: 'Tukwila Intl Blvd',
    lines: ['line-1'],
    lat: 47.4644,
    lon: -122.2885,
    platforms: {
      northbound: {
        stopId: '1_99127',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99128',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
      },
    },
  },
  {
    id: 'seatac-airport',
    name: 'SeaTac / Airport',
    shortName: 'Seattle-Tacoma Int Airport',
    lines: ['line-1'],
    lat: 47.4439,
    lon: -122.2989,
    platforms: {
      northbound: {
        stopId: '1_99129',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99130',
        directionName: 'Southbound to Angle Lake',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99131',
        directionName: 'Northbound to Lynnwood City Center',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '1_99132',
        directionName: 'Southbound Platform (Terminus)',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Angle Lake',
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
        stopId: '1_99701',
        directionName: 'Westbound Platform (Terminus)',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99702',
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
        stopId: '1_99703',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99704',
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
        stopId: '1_99705',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99706',
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
        stopId: '1_99707',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99708',
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
        stopId: '1_99709',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99710',
        directionName: 'Eastbound to Downtown Redmond',
        cardinalDirection: 'Eastbound',
        terminalDestination: 'Downtown Redmond',
      },
    },
  },
  {
    id: 'bel-red',
    name: 'Bel-Red / 130th',
    lines: ['line-2'],
    lat: 47.6288,
    lon: -122.1528,
    platforms: {
      westbound: {
        stopId: '1_99711',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99712',
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
        stopId: '1_99713',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99714',
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
        stopId: '1_99715',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99716',
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
        stopId: '1_99717',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99718',
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
        stopId: '1_99719',
        directionName: 'Westbound to South Bellevue',
        cardinalDirection: 'Westbound',
        terminalDestination: 'South Bellevue',
      },
      eastbound: {
        stopId: '1_99720',
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
    terminusSouth: 'Angle Lake',
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
