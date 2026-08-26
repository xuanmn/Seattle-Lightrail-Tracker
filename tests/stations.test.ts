import { describe, it, expect } from 'vitest';
import { getStationsByLine, getStationById } from '../src/data/stations';

describe('Station Catalog', () => {
  it('should include all 23 Line 1 stations', () => {
    const line1Stations = getStationsByLine('line-1');
    expect(line1Stations.length).toBe(23);

    // Verify key terminal & extension stations
    const lynnwood = line1Stations.find(s => s.id === 'lynnwood-city-center');
    expect(lynnwood).toBeDefined();
    expect(lynnwood?.name).toBe('Lynnwood City Center');
    expect(lynnwood?.platforms.northbound).toBeDefined();
    expect(lynnwood?.platforms.southbound).toBeDefined();

    const angleLake = line1Stations.find(s => s.id === 'angle-lake');
    expect(angleLake).toBeDefined();
    expect(angleLake?.name).toBe('Angle Lake');

    const westlake = line1Stations.find(s => s.id === 'westlake');
    expect(westlake).toBeDefined();
    expect(westlake?.name).toBe('Westlake');
  });

  it('should include all 10 Line 2 stations', () => {
    const line2Stations = getStationsByLine('line-2');
    expect(line2Stations.length).toBe(10);

    const southBellevue = line2Stations.find(s => s.id === 'south-bellevue');
    expect(southBellevue).toBeDefined();

    const downtownRedmond = line2Stations.find(s => s.id === 'downtown-redmond');
    expect(downtownRedmond).toBeDefined();
  });

  it('uses official Sound Transit naming for updated stations', () => {
    expect(getStationById('shoreline-north-185th')?.name).toBe('Shoreline North/185th');
    expect(getStationById('shoreline-south-148th')?.name).toBe('Shoreline South/148th');
    expect(getStationById('international-district-chinatown')?.name).toBe('Intl. District / Chinatown');
    expect(getStationById('tukwila-intl-blvd')?.name).toBe('Tukwila Intl. Blvd.');
    expect(getStationById('bel-red')?.name).toBe('BelRed');
    expect(getStationById('symphony')?.name).toBe('Symphony');
  });

  it('retains valid stop IDs for Puget Sound OneBusAway', () => {
    const westlake = getStationById('westlake');
    expect(westlake?.platforms.northbound?.stopId).toBe('1_1121');
    expect(westlake?.platforms.southbound?.stopId).toBe('1_1122');
  });

  it('should find station by id', () => {
    const capitolHill = getStationById('capitol-hill');
    expect(capitolHill).toBeDefined();
    expect(capitolHill?.name).toBe('Capitol Hill');
    expect(capitolHill?.lines).toContain('line-1');
  });

  it('should return undefined for non-existent station id', () => {
    const invalid = getStationById('non-existent-stop');
    expect(invalid).toBeUndefined();
  });
});
