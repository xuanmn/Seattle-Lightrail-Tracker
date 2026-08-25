/**
 * Time and Countdown Utilities for Live Transit Departures
 */

export function calculateMinutesRemaining(targetEpochMs: number, nowEpochMs: number = Date.now()): number {
  const diffMs = targetEpochMs - nowEpochMs;
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / (60 * 1000));
}

export function formatCountdownBadge(
  targetEpochMs: number,
  nowEpochMs: number = Date.now()
): { text: string; isNow: boolean; rawMinutes: number } {
  const diffMs = targetEpochMs - nowEpochMs;
  const rawMinutes = diffMs / (60 * 1000);

  if (diffMs <= 45 * 1000) {
    // Under 45 seconds -> ARRIVING NOW
    return { text: 'ARRIVING', isNow: true, rawMinutes: 0 };
  }

  const minutes = Math.max(1, Math.round(diffMs / (60 * 1000)));
  return {
    text: `${minutes} MIN`,
    isNow: false,
    rawMinutes: minutes,
  };
}

export function formatDelayStatus(
  delaySeconds: number,
  isRealtime: boolean
): { text: string; type: 'ontime' | 'delayed' | 'early' | 'scheduled' } {
  if (!isRealtime) {
    return { text: 'Scheduled', type: 'scheduled' };
  }

  const delayMinutes = Math.round(Math.abs(delaySeconds) / 60);

  if (delaySeconds >= 60) {
    return {
      text: `+${delayMinutes}m Delay`,
      type: 'delayed',
    };
  }

  if (delaySeconds <= -60) {
    return {
      text: `${delayMinutes}m Early`,
      type: 'early',
    };
  }

  return {
    text: 'On Time',
    type: 'ontime',
  };
}

export function formatClockTime(epochMs: number, is24Hour: boolean = false): string {
  const date = new Date(epochMs);
  if (is24Hour) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

export function formatRelativeTimeAgo(epochMs: number, nowMs: number = Date.now()): string {
  const diffSec = Math.max(0, Math.floor((nowMs - epochMs) / 1000));
  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  return `${diffMin}m ago`;
}
