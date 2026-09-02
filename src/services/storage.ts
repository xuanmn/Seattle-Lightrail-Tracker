import { AppSettings, TransitLineId } from '../types/transit';

const PINNED_STATIONS_KEY = 'seattle_transit_pinned_stations';
const ACTIVE_LINE_KEY = 'seattle_transit_active_line';
const SETTINGS_KEY = 'seattle_transit_settings';

const DEFAULT_PINNED_STATIONS: string[] = [
  'westlake',
  'capitol-hill',
  'university-of-washington',
  'bellevue-downtown',
  'seatac-airport',
];

const DEFAULT_SETTINGS: AppSettings = {
  timeFormat24Hour: false,
};

export function getPinnedStationIds(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_STATIONS_KEY);
    if (raw === null) return [...DEFAULT_PINNED_STATIONS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_PINNED_STATIONS];
  } catch {
    return [...DEFAULT_PINNED_STATIONS];
  }
}

function setPinnedStationIds(ids: string[]): void {
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
    return merged;
  } catch {
    return getSettings();
  }
}


const DIRECTION_FILTERS_KEY = 'seattle_transit_direction_filters';

export type StationDirectionFilter = 'both' | 'dir1' | 'dir2';

export function getStationDirectionFilters(): Record<string, StationDirectionFilter> {
  try {
    const raw = localStorage.getItem(DIRECTION_FILTERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function setStationDirectionFilter(
  stationId: string,
  filter: StationDirectionFilter
): void {
  try {
    const current = getStationDirectionFilters();
    current[stationId] = filter;
    localStorage.setItem(DIRECTION_FILTERS_KEY, JSON.stringify(current));
  } catch {
    // ignore
  }
}
