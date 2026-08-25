import { Station, StationArrivals, TransitArrival } from '../types/transit';
import { createElement, ICONS } from '../utils/dom';
import { formatClockTime, formatCountdownBadge } from '../utils/time';

export interface KioskCallbacks {
  onExit: () => void;
}

export class KioskViewComponent {
  private element: HTMLElement;
  private stationTitleEl!: HTMLElement;
  private lineBadgeEl!: HTMLElement;
  private clockEl!: HTMLElement;
  private col1TitleEl!: HTMLElement;
  private col2TitleEl!: HTMLElement;
  private col1ListEl!: HTMLElement;
  private col2ListEl!: HTMLElement;
  private dotsContainer!: HTMLElement;
  private is24Hour: boolean = false;
  private callbacks: KioskCallbacks;
  private currentStationIndex: number = 0;
  private stations: Station[] = [];
  private arrivalsMap: Map<string, StationArrivals> = new Map();
  private rotationTimer?: number;

  constructor(is24Hour: boolean, callbacks: KioskCallbacks) {
    this.is24Hour = is24Hour;
    this.callbacks = callbacks;
    this.element = this.render();
    this.startClock();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public open(stations: Station[], arrivalsMap: Map<string, StationArrivals>, autoRotate: boolean = true) {
    this.stations = stations;
    this.arrivalsMap = arrivalsMap;
    this.currentStationIndex = 0;
    this.element.style.display = 'flex';
    this.renderCurrentStation();

    if (autoRotate && this.stations.length > 1) {
      this.startAutoRotation();
    }
  }

  public close() {
    this.element.style.display = 'none';
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
  }

  public updateArrivals(arrivalsMap: Map<string, StationArrivals>) {
    this.arrivalsMap = arrivalsMap;
    this.renderCurrentStation();
  }

  private startAutoRotation() {
    if (this.rotationTimer) clearInterval(this.rotationTimer);
    this.rotationTimer = window.setInterval(() => {
      this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length;
      this.renderCurrentStation();
    }, 15000);
  }

  private startClock() {
    setInterval(() => {
      if (this.clockEl) {
        this.clockEl.textContent = formatClockTime(Date.now(), this.is24Hour);
      }
    }, 1000);
  }

  private renderCurrentStation() {
    if (this.stations.length === 0) return;
    const station = this.stations[this.currentStationIndex];
    if (!station) return;

    const isLine1 = station.lines.includes('line-1');
    this.stationTitleEl.textContent = station.name;
    this.lineBadgeEl.textContent = isLine1 ? '1' : '2';
    this.lineBadgeEl.className = `kiosk-line-badge ${isLine1 ? 'kiosk-line-1' : 'kiosk-line-2'}`;

    const p1 = station.platforms.northbound || station.platforms.westbound;
    const p2 = station.platforms.southbound || station.platforms.eastbound;

    this.col1TitleEl.textContent = `To ${p1?.terminalDestination || 'Terminal'}`;
    this.col2TitleEl.textContent = `To ${p2?.terminalDestination || 'Terminal'}`;

    const data = this.arrivalsMap.get(station.id);
    this.renderKioskList(this.col1ListEl, data?.direction1.arrivals || []);
    this.renderKioskList(this.col2ListEl, data?.direction2.arrivals || []);

    this.renderDots();
  }

  private renderKioskList(container: HTMLElement, arrivals: TransitArrival[]) {
    container.innerHTML = '';

    if (arrivals.length === 0) {
      const empty = createElement('div', 'departures-empty');
      empty.style.fontSize = '1.3rem';
      empty.textContent = 'No upcoming departures scheduled';
      container.appendChild(empty);
      return;
    }

    arrivals.slice(0, 4).forEach((arrival, idx) => {
      const targetTime = arrival.predictedDepartureTime || arrival.scheduledDepartureTime;
      const badge = formatCountdownBadge(targetTime);

      const row = createElement('div', `kiosk-row ${idx === 0 ? 'first-arrival' : ''}`);

      const dest = createElement('div', 'kiosk-dest', arrival.destination);

      const meta = createElement('div', 'kiosk-row-meta');
      const status = createElement('div', `kiosk-status ${arrival.statusType}`, arrival.statusText);
      const chip = createElement(
        'div',
        `kiosk-badge ${badge.isNow ? 'arriving' : ''}`,
        badge.text
      );

      meta.appendChild(status);
      meta.appendChild(chip);

      row.appendChild(dest);
      row.appendChild(meta);
      container.appendChild(row);
    });
  }

  private renderDots() {
    this.dotsContainer.innerHTML = '';
    if (this.stations.length <= 1) return;

    this.stations.forEach((_, idx) => {
      const dot = createElement(
        'div',
        `kiosk-dot ${idx === this.currentStationIndex ? 'active' : ''}`
      );
      dot.onclick = () => {
        this.currentStationIndex = idx;
        this.renderCurrentStation();
      };
      this.dotsContainer.appendChild(dot);
    });
  }

  private render(): HTMLElement {
    const kiosk = createElement('div', 'kiosk-view');
    kiosk.style.display = 'none';

    // Header
    const header = createElement('div', 'kiosk-header');
    const info = createElement('div', 'kiosk-station-info');
    this.lineBadgeEl = createElement('div', 'kiosk-line-badge kiosk-line-1', '1');
    this.stationTitleEl = createElement('div', 'kiosk-station-name', 'Westlake');
    info.appendChild(this.lineBadgeEl);
    info.appendChild(this.stationTitleEl);

    const meta = createElement('div', 'kiosk-meta');
    this.clockEl = createElement('div', 'kiosk-clock', formatClockTime(Date.now(), this.is24Hour));

    const exitBtn = createElement(
      'button',
      'kiosk-exit-btn',
      `${ICONS.close} Exit Fullscreen`
    );
    exitBtn.onclick = () => {
      this.close();
      this.callbacks.onExit();
    };

    meta.appendChild(this.clockEl);
    meta.appendChild(exitBtn);

    header.appendChild(info);
    header.appendChild(meta);

    // Board Columns
    const grid = createElement('div', 'kiosk-board-grid');

    const col1 = createElement('div', 'kiosk-column');
    this.col1TitleEl = createElement('div', 'kiosk-column-title', 'Northbound Platform');
    this.col1ListEl = createElement('div', 'kiosk-arrivals-list');
    col1.appendChild(this.col1TitleEl);
    col1.appendChild(this.col1ListEl);

    const col2 = createElement('div', 'kiosk-column');
    this.col2TitleEl = createElement('div', 'kiosk-column-title', 'Southbound Platform');
    this.col2ListEl = createElement('div', 'kiosk-arrivals-list');
    col2.appendChild(this.col2TitleEl);
    col2.appendChild(this.col2ListEl);

    grid.appendChild(col1);
    grid.appendChild(col2);

    // Footer with pagination dots
    const footer = createElement('div', 'kiosk-footer');
    const note = createElement('span', '', 'Live Link Light Rail Departures');
    this.dotsContainer = createElement('div', 'kiosk-dots');
    footer.appendChild(note);
    footer.appendChild(this.dotsContainer);

    kiosk.appendChild(header);
    kiosk.appendChild(grid);
    kiosk.appendChild(footer);

    return kiosk;
  }
}
