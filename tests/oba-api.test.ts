import { describe, it, expect } from 'vitest';
import { transformObaArrivals } from '../src/services/oba-api';
import { StationPlatform } from '../src/types/transit';

describe('OneBusAway API Transformer', () => {
  const mockPlatform: StationPlatform = {
    stopId: '1_99611',
    directionName: 'Northbound to Lynnwood City Center',
    cardinalDirection: 'Northbound',
    terminalDestination: 'Lynnwood City Center',
  };

  it('transforms raw OneBusAway JSON into typed TransitArrival items', () => {
    const now = 1700000000000;
    const rawData = {
      code: 200,
      text: 'OK',
      data: {
        entry: {
          stopId: '1_99611',
          arrivalsAndDepartures: [
            {
              tripId: '40_trip_01',
              routeId: '40_100479',
              routeShortName: '1 Line',
              tripHeadsign: 'Lynnwood City Center',
              scheduledDepartureTime: now + 5 * 60 * 1000,
              predictedDepartureTime: now + 6 * 60 * 1000, // 1 min late
              predicted: true,
            },
            {
              tripId: '40_trip_02',
              routeId: '40_100479',
              routeShortName: '1 Line',
              tripHeadsign: 'Lynnwood City Center',
              scheduledDepartureTime: now + 15 * 60 * 1000,
              predictedDepartureTime: null, // Scheduled only
              predicted: false,
            },
          ],
        },
      },
    };

    const arrivals = transformObaArrivals(rawData, mockPlatform, now);
    expect(arrivals.length).toBe(2);

    // First arrival (realtime)
    expect(arrivals[0].tripId).toBe('40_trip_01');
    expect(arrivals[0].destination).toBe('Lynnwood City Center');
    expect(arrivals[0].isRealtime).toBe(true);
    expect(arrivals[0].delaySeconds).toBe(60); // 1 minute late
    expect(arrivals[0].statusType).toBe('delayed');
    expect(arrivals[0].minutesUntilArrival).toBe(6);

    // Second arrival (scheduled)
    expect(arrivals[1].tripId).toBe('40_trip_02');
    expect(arrivals[1].isRealtime).toBe(false);
    expect(arrivals[1].statusType).toBe('scheduled');
    expect(arrivals[1].minutesUntilArrival).toBe(15);
  });

  it('filters out past arrivals and limits result size', () => {
    const now = 1700000000000;
    const rawData = {
      code: 200,
      data: {
        entry: {
          stopId: '1_99611',
          arrivalsAndDepartures: [
            {
              tripId: '40_past_trip',
              routeShortName: '1 Line',
              tripHeadsign: 'Lynnwood City Center',
              scheduledDepartureTime: now - 5 * 60 * 1000, // 5 min ago
              predictedDepartureTime: now - 3 * 60 * 1000,
              predicted: true,
            },
            {
              tripId: '40_upcoming_trip',
              routeShortName: '1 Line',
              tripHeadsign: 'Lynnwood City Center',
              scheduledDepartureTime: now + 4 * 60 * 1000,
              predictedDepartureTime: now + 4 * 60 * 1000,
              predicted: true,
            },
          ],
        },
      },
    };

    const arrivals = transformObaArrivals(rawData, mockPlatform, now);
    expect(arrivals.length).toBe(1);
    expect(arrivals[0].tripId).toBe('40_upcoming_trip');
  });
});
