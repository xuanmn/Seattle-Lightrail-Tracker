import { AppSettings, TransitLineId } from '../types/transit';

const PINNED_STATIONS_KEY = 'seattle_transit_pinned_stations';
const ACTIVE_LINE_KEY = 'seattle_transit_active_line';
const SETTINGS_KEY = 'seattle_transit_settings';
const COLLAPSED_PLATFORMS_KEY = 'seattle_transit_collapsed_platforms';

export interface CollapsedPlatformsState {
  [stationId: string]: {
    col1?: boolean;
    col2?: boolean;
  };
}

const DEFAULT_PINNED_STATIONS: string[] = [
  'westlake',
  'capitol-hill',
  'university-of-washington',
  'bellevue-downtown',
  'seatac-airport',
];

const DEFAULT_SETTINGS: AppSettings = {
  timeFormat24Hour: false,
  activeLine: 'line-1',
  pinnedStationIds: DEFAULT_PINNED_STATIONS,
};

export function getPinnedStationIds(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_STATIONS_KEY);
    if (!raw) return [...DEFAULT_PINNED_STATIONS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_PINNED_STATIONS];
  } catch {
    return [...DEFAULT_PINNED_STATIONS];
  }
}

export function setPinnedStationIds(ids: string[]): void {
  try {
    localStorage.setItem(PINNED_STATIONS_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota/storage errors
  }
}

export function togglePinnedStation(stationId: string): boolean {
  const current = getPinnedStationIds();
  const exists = current.includes(stationId);
  let updated: string[];

  if (exists) {
    updated = current.filter((id) => id !== stationId);
  } else {
    updated = [...current, stationId];
  }

  setPinnedStationIds(updated);
  return !exists; // returns new pinned status
}

export function isStationPinned(stationId: string, cachedPinnedIds?: string[]): boolean {
  const ids = cachedPinnedIds ?? getPinnedStationIds();
  return ids.includes(stationId);
}

export function getActiveLine(): TransitLineId {
  try {
    const raw = localStorage.getItem(ACTIVE_LINE_KEY);
    return raw === 'line-2' ? 'line-2' : 'line-1';
  } catch {
    return 'line-1';
  }
}

export function setActiveLine(line: TransitLineId): void {
  try {
    localStorage.setItem(ACTIVE_LINE_KEY, line);
  } catch {
    // ignore
  }
}

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      pinnedStationIds: getPinnedStationIds(),
      activeLine: getActiveLine(),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  try {
    const current = getSettings();
    const merged = { ...current, ...partial };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    if (partial.activeLine) {
      setActiveLine(partial.activeLine);
    }
    if (partial.pinnedStationIds) {
      setPinnedStationIds(partial.pinnedStationIds);
    }
    return merged;
  } catch {
    return getSettings();
  }
}

export function getCollapsedPlatforms(): CollapsedPlatformsState {
  try {
    const raw = localStorage.getItem(COLLAPSED_PLATFORMS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function setPlatformCollapsed(
  stationId: string,
  colIndex: 1 | 2,
  isCollapsed: boolean
): void {
  try {
    const current = getCollapsedPlatforms();
    if (!current[stationId]) {
      current[stationId] = {};
    }
    if (colIndex === 1) {
      current[stationId].col1 = isCollapsed;
    } else {
      current[stationId].col2 = isCollapsed;
    }
    localStorage.setItem(COLLAPSED_PLATFORMS_KEY, JSON.stringify(current));
  } catch {
    // ignore storage quota errors
  }
}
