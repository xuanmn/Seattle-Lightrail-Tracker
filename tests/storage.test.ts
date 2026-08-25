import { describe, it, expect, beforeEach } from 'vitest';
import {
  getPinnedStationIds,
  togglePinnedStation,
  getActiveLine,
  setActiveLine,
  getSettings,
  updateSettings,
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

  it('sets and retrieves active line', () => {
    expect(getActiveLine()).toBe('line-1'); // Default line 1
    setActiveLine('line-2');
    expect(getActiveLine()).toBe('line-2');
  });

  it('updates and persists settings', () => {
    const defaults = getSettings();
    expect(defaults.refreshIntervalSeconds).toBe(20);
    expect(defaults.timeFormat24Hour).toBe(false);

    updateSettings({
      refreshIntervalSeconds: 15,
      timeFormat24Hour: true,
      customApiUrl: 'https://my-transit.fly.dev',
    });

    const updated = getSettings();
    expect(updated.refreshIntervalSeconds).toBe(15);
    expect(updated.timeFormat24Hour).toBe(true);
    expect(updated.customApiUrl).toBe('https://my-transit.fly.dev');
  });
});
