import { describe, it, expect } from 'vitest';
import { getStationsByLine, getStationById } from '../src/data/stations';

describe('Station Catalog', () => {
  it('should include all 26 Line 1 stations', () => {
    const line1Stations = getStationsByLine('line-1');
    expect(line1Stations.length).toBe(26);

    // Verify key terminal & extension stations
    const lynnwood = line1Stations.find(s => s.id === 'lynnwood-city-center');
    expect(lynnwood).toBeDefined();
    expect(lynnwood?.name).toBe('Lynnwood City Center');
    expect(lynnwood?.platforms.northbound).toBeDefined();
    expect(lynnwood?.platforms.southbound).toBeDefined();

    const angleLake = line1Stations.find(s => s.id === 'angle-lake');
    expect(angleLake).toBeDefined();
    expect(angleLake?.name).toBe('Angle Lake');

    const federalWay = line1Stations.find(s => s.id === 'federal-way-downtown');
    expect(federalWay).toBeDefined();
    expect(federalWay?.name).toBe('Federal Way Downtown');

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
    expect(getStationById('kent-des-moines')?.name).toBe('Kent Des Moines');
    expect(getStationById('star-lake')?.name).toBe('Star Lake');
    expect(getStationById('federal-way-downtown')?.name).toBe('Federal Way Downtown');
  });

  it('retains valid stop IDs for Puget Sound OneBusAway', () => {
    const westlake = getStationById('westlake');
    expect(westlake?.platforms.northbound?.stopId).toBe('40_1121');
    expect(westlake?.platforms.southbound?.stopId).toBe('40_1108');

    const lynnwood = getStationById('lynnwood-city-center');
    expect(lynnwood?.platforms.northbound?.stopId).toBe('40_N23-T1');
    expect(lynnwood?.platforms.southbound?.stopId).toBe('40_N23-T2');
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
