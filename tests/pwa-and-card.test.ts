import { describe, it, expect } from 'vitest';
import { StationCardComponent } from '../src/components/StationCard';
import { Station, StationArrivals } from '../src/types/transit';
import manifest from '../public/manifest.json';

describe('StationCard Live Approach Track', () => {
  const mockStation: Station = {
    id: 'westlake',
    name: 'Westlake',
    shortName: 'Pine St / 4th Ave',
    lines: ['line-1', 'line-2'],
    lat: 47.6115,
    lon: -122.3374,
    platforms: {
      northbound: {
        stopId: '40_1121',
        directionName: 'Northbound',
        cardinalDirection: 'Northbound',
        terminalDestination: 'Lynnwood City Center',
      },
      southbound: {
        stopId: '40_1108',
        directionName: 'Southbound',
        cardinalDirection: 'Southbound',
        terminalDestination: 'Federal Way Downtown',
      },
    },
  };

  it('renders approach track and activates it when a train is within 5 minutes', () => {
    const card = new StationCardComponent(mockStation, false, false, {
      onTogglePin: () => {},
    });

    const el = card.getElement();
    const trackWrap = el.querySelector('.station-approach-track-wrap') as HTMLElement;
    expect(trackWrap).not.toBeNull();
    expect(trackWrap.classList.contains('active')).toBe(false);

    const now = 1700000000000;
    const arrivalsData: StationArrivals = {
      station: mockStation,
      lastUpdated: now,
      direction1: {
        platform: mockStation.platforms.northbound!,
        arrivals: [
          {
            tripId: 'trip_1',
            routeId: '40_100479',
            routeName: '1 Line',
            routeColor: '#008542',
            destination: 'Lynnwood City Center',
            direction: 'Northbound',
            scheduledDepartureTime: now + 3 * 60 * 1000, // 3 minutes away
            predictedDepartureTime: now + 3 * 60 * 1000,
            minutesUntilArrival: 3,
            delaySeconds: 0,
            isRealtime: true,
            statusText: 'On Time',
            statusType: 'ontime',
          },
        ],
      },
      direction2: {
        platform: mockStation.platforms.southbound!,
        arrivals: [],
      },
    };

    card.updateArrivals(arrivalsData);
    expect(trackWrap.classList.contains('active')).toBe(true);

    const bar = trackWrap.querySelector('.station-approach-bar') as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.className).toContain('line-1-approach');
  });

  it('deactivates approach track when no train is within 5 minutes', () => {
    const card = new StationCardComponent(mockStation, false, false, {
      onTogglePin: () => {},
    });

    const el = card.getElement();
    const trackWrap = el.querySelector('.station-approach-track-wrap') as HTMLElement;

    const now = 1700000000000;
    const arrivalsData: StationArrivals = {
      station: mockStation,
      lastUpdated: now,
      direction1: {
        platform: mockStation.platforms.northbound!,
        arrivals: [
          {
            tripId: 'trip_far',
            routeId: '40_100479',
            routeName: '1 Line',
            routeColor: '#008542',
            destination: 'Lynnwood City Center',
            direction: 'Northbound',
            scheduledDepartureTime: now + 12 * 60 * 1000, // 12 minutes away
            predictedDepartureTime: now + 12 * 60 * 1000,
            minutesUntilArrival: 12,
            delaySeconds: 0,
            isRealtime: true,
            statusText: 'On Time',
            statusType: 'ontime',
          },
        ],
      },
      direction2: {
        platform: mockStation.platforms.southbound!,
        arrivals: [],
      },
    };

    card.updateArrivals(arrivalsData);
    expect(trackWrap.classList.contains('active')).toBe(false);
  });
});

describe('PWA Manifest Configuration', () => {
  it('contains valid standalone display mode and transit app metadata', () => {
    expect(manifest.name).toBe('Seattle Light Rail Tracker');
    expect(manifest.short_name).toBe('Link Tracker');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#0b0f17');
    expect(manifest.background_color).toBe('#070a0f');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

    const hasAny = manifest.icons.some((i: { purpose?: string }) => i.purpose === 'any');
    const hasMaskable = manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable');
    expect(hasAny).toBe(true);
    expect(hasMaskable).toBe(true);
  });
});
