import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPinnedStationIds,
  togglePinnedStation,
  isStationPinned,
  getActiveLine,
  setActiveLine,
  getSettings,
  updateSettings,
  getCollapsedPlatforms,
  setPlatformCollapsed,
} from '../src/services/storage';

describe('Local Storage & Settings Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default pinned stations on first load', () => {
    const pinned = getPinnedStationIds();
    expect(pinned.length).toBeGreaterThanOrEqual(3);
    expect(pinned).toContain('westlake');
    expect(pinned).toContain('capitol-hill');
    expect(pinned).toContain('bellevue-downtown');
  });

  it('toggles pinned station status correctly', () => {
    // Unpin westlake
    const unpinnedResult = togglePinnedStation('westlake');
    expect(unpinnedResult).toBe(false);
    expect(getPinnedStationIds()).not.toContain('westlake');

    // Re-pin westlake
    const pinnedResult = togglePinnedStation('westlake');
    expect(pinnedResult).toBe(true);
    expect(getPinnedStationIds()).toContain('westlake');
  });

  it('preserves an explicitly empty list of pinned stations when user unpins all stations', () => {
    const defaultStations = getPinnedStationIds();
    defaultStations.forEach((id) => togglePinnedStation(id));

    // Should stay empty, NOT auto-populate default stations
    expect(getPinnedStationIds()).toEqual([]);
  });

  it('checks if a station is pinned, optionally using cached array', () => {
    expect(isStationPinned('westlake')).toBe(true);
    expect(isStationPinned('non-existent-station')).toBe(false);

    // Using provided cached array (avoids localStorage read)
    const customList = ['station-a', 'station-b'];
    expect(isStationPinned('station-a', customList)).toBe(true);
    expect(isStationPinned('westlake', customList)).toBe(false);
  });

  it('sets and retrieves active line', () => {
    expect(getActiveLine()).toBe('line-1'); // Default line 1
    setActiveLine('line-2');
    expect(getActiveLine()).toBe('line-2');
  });

  it('updates and persists settings', () => {
    const defaults = getSettings();
    expect(defaults.timeFormat24Hour).toBe(false);

    updateSettings({
      timeFormat24Hour: true,
    });

    const updated = getSettings();
    expect(updated.timeFormat24Hour).toBe(true);
  });

  it('persists platform collapse states individually per station', () => {
    expect(getCollapsedPlatforms()).toEqual({});

    // Collapse Northbound (col 1) on Capitol Hill
    setPlatformCollapsed('capitol-hill', 1, true);
    let state = getCollapsedPlatforms();
    expect(state['capitol-hill']?.col1).toBe(true);
    expect(state['capitol-hill']?.col2).toBeUndefined();

    // Collapse Southbound (col 2) on Westlake
    setPlatformCollapsed('westlake', 2, true);
    state = getCollapsedPlatforms();
    expect(state['capitol-hill']?.col1).toBe(true);
    expect(state['westlake']?.col2).toBe(true);

    // Uncollapse Northbound on Capitol Hill
    setPlatformCollapsed('capitol-hill', 1, false);
    state = getCollapsedPlatforms();
    expect(state['capitol-hill']?.col1).toBe(false);
  });
});
