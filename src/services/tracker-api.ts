import { Station, TransitArrival } from '../types/transit';
import { calculateMinutesRemaining, formatDelayStatus } from '../utils/time';

export interface TrackerApiTrip {
  tripId: string;
  routeId: string;
  routeName: string;
  routeColor?: string | null;
  stopId: string;
  headsign: string;
  scheduledTime: string; // ISO 8601 string
  estimatedTime?: string | null; // ISO 8601 string
  delay?: number | null; // seconds
  isRealtime?: boolean;
}

export class TransitTrackerClient {
  private ws: WebSocket | null = null;
  private serverUrl: string;
  private isConnected: boolean = false;
  private subscriptions: Set<string> = new Set();
  private onUpdateCallback?: (stopId: string, arrivals: TransitArrival[]) => void;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl.replace(/\/$/, '');
  }

  public setUpdateCallback(cb: (stopId: string, arrivals: TransitArrival[]) => void) {
    this.onUpdateCallback = cb;
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = this.serverUrl.replace(/^http/, 'ws') + '/schedule';
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.resubscribeAll();
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'schedule' && payload.data) {
            this.handleScheduleUpdate(payload.data);
          }
        } catch {
          // ignore non-json messages
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch {
      this.isConnected = false;
    }
  }

  public subscribeStation(station: Station): void {
    const p1 = station.platforms.northbound || station.platforms.westbound;
    const p2 = station.platforms.southbound || station.platforms.eastbound;

    if (p1) this.subscribeStop(p1.stopId);
    if (p2) this.subscribeStop(p2.stopId);
  }

  private subscribeStop(stopId: string): void {
    this.subscriptions.add(stopId);
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          event: 'subscribe',
          data: {
            feedCode: 'st',
            routeStopPairs: `1 Line:${stopId}`,
            limit: 6,
          },
        })
      );
    }
  }

  private resubscribeAll(): void {
    for (const stopId of this.subscriptions) {
      this.subscribeStop(stopId);
    }
  }

  private handleScheduleUpdate(data: { stopId: string; trips: TrackerApiTrip[] }): void {
    if (!data.stopId || !data.trips || !this.onUpdateCallback) return;

    const arrivals: TransitArrival[] = data.trips.map((trip) => {
      const schedMs = new Date(trip.scheduledTime).getTime();
      const predMs = trip.estimatedTime ? new Date(trip.estimatedTime).getTime() : null;
      const isRt = Boolean(trip.isRealtime ?? (predMs !== null));
      const targetTime = predMs || schedMs;
      const delaySec = trip.delay ?? (predMs ? Math.round((predMs - schedMs) / 1000) : 0);
      const delayInfo = formatDelayStatus(delaySec, isRt);

      return {
        tripId: trip.tripId,
        routeId: trip.routeId,
        routeName: trip.routeName,
        routeColor: trip.routeColor ? `#${trip.routeColor}` : '#008542',
        destination: trip.headsign,
        direction: 'Northbound',
        scheduledDepartureTime: schedMs,
        predictedDepartureTime: predMs,
        minutesUntilArrival: calculateMinutesRemaining(targetTime),
        isRealtime: isRt,
        delaySeconds: delaySec,
        statusText: delayInfo.text,
        statusType: delayInfo.type,
      };
    });

    this.onUpdateCallback(data.stopId, arrivals);
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}
