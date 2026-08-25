import { Station, StationArrivals, TransitArrival } from '../types/transit';
import { createElement, ICONS } from '../utils/dom';
import { formatClockTime, formatCountdownBadge } from '../utils/time';

export interface StationCardCallbacks {
  onTogglePin: (stationId: string) => void;
}

export class StationCardComponent {
  private element: HTMLElement;
  private station: Station;
  private isPinned: boolean;
  private is24Hour: boolean;
  private callbacks: StationCardCallbacks;
  private starBtn!: HTMLButtonElement;
  private platform1Container!: HTMLElement;
  private platform2Container!: HTMLElement;
  private currentArrivals?: StationArrivals;

  constructor(
    station: Station,
    isPinned: boolean,
    is24Hour: boolean,
    callbacks: StationCardCallbacks
  ) {
    this.station = station;
    this.isPinned = isPinned;
    this.is24Hour = is24Hour;
    this.callbacks = callbacks;
    this.element = this.render();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setPinned(pinned: boolean) {
    this.isPinned = pinned;
    this.starBtn.className = `star-btn ${pinned ? 'pinned' : ''}`;
    this.starBtn.innerHTML = pinned ? ICONS.starFilled : ICONS.star;
  }

  public setTimeFormat(is24Hour: boolean) {
    this.is24Hour = is24Hour;
    if (this.currentArrivals) {
      this.updateArrivals(this.currentArrivals);
    }
  }

  public setLoading() {
    this.platform1Container.innerHTML = `
      <div class="skeleton-row"></div>
      <div class="skeleton-row"></div>
    `;
    this.platform2Container.innerHTML = `
      <div class="skeleton-row"></div>
      <div class="skeleton-row"></div>
    `;
  }

  public updateArrivals(data: StationArrivals) {
    this.currentArrivals = data;
    this.renderPlatformArrivals(
      this.platform1Container,
      data.direction1.arrivals,
      data.direction1.platform.terminalDestination
    );
    this.renderPlatformArrivals(
      this.platform2Container,
      data.direction2.arrivals,
      data.direction2.platform.terminalDestination
    );
  }

  public tickCountdowns() {
    if (!this.currentArrivals) return;
    this.updateArrivals(this.currentArrivals);
  }

  private renderPlatformArrivals(
    container: HTMLElement,
    arrivals: TransitArrival[],
    defaultDest: string
  ) {
    container.innerHTML = '';

    if (!arrivals || arrivals.length === 0) {
      const empty = createElement('div', 'departures-empty');
      empty.textContent = 'No upcoming trains';
      container.appendChild(empty);
      return;
    }

    const list = createElement('div', 'departures-list');

    arrivals.forEach((arrival) => {
      const targetTime = arrival.predictedDepartureTime || arrival.scheduledDepartureTime;
      const badge = formatCountdownBadge(targetTime);

      const row = createElement('div', `departure-row ${badge.isNow ? 'arriving-soon' : ''}`);

      const info = createElement('div', 'dep-info');
      const dest = createElement('div', 'dep-dest');
      dest.textContent = arrival.destination || defaultDest;

      const meta = createElement('div', 'dep-meta');
      const clock = createElement(
        'span',
        'dep-clock',
        formatClockTime(targetTime, this.is24Hour)
      );
      const status = createElement(
        'span',
        `status-pill ${arrival.statusType}`,
        arrival.statusText
      );

      meta.appendChild(clock);
      meta.appendChild(status);
      info.appendChild(dest);
      info.appendChild(meta);

      const chip = createElement(
        'div',
        `countdown-chip ${badge.isNow ? 'now' : ''}`,
        badge.text
      );

      row.appendChild(info);
      row.appendChild(chip);
      list.appendChild(row);
    });

    container.appendChild(list);
  }

  private render(): HTMLElement {
    const isLine1 = this.station.lines.includes('line-1');
    const card = createElement(
      'div',
      `station-card ${isLine1 ? 'line-1-card' : 'line-2-card'}`
    );
    card.id = `station-${this.station.id}`;

    // Header
    const header = createElement('div', 'station-header');
    const titleGroup = createElement('div', 'station-title-group');

    const linePill = createElement(
      'span',
      `station-line-pill ${isLine1 ? 'line-1-circle' : 'line-2-circle'}`,
      isLine1 ? '1' : '2'
    );

    const nameWrap = createElement('div', 'station-name-wrap');
    const name = createElement('h3', 'station-name', this.station.name);
    if (this.station.shortName) {
      const sub = createElement('span', 'station-subname', this.station.shortName);
      nameWrap.appendChild(name);
      nameWrap.appendChild(sub);
    } else {
      nameWrap.appendChild(name);
    }

    titleGroup.appendChild(linePill);
    titleGroup.appendChild(nameWrap);

    const actions = createElement('div', 'station-actions');
    this.starBtn = createElement(
      'button',
      `star-btn ${this.isPinned ? 'pinned' : ''}`,
      this.isPinned ? ICONS.starFilled : ICONS.star
    ) as HTMLButtonElement;
    this.starBtn.title = this.isPinned ? 'Unpin station' : 'Pin to favorites';
    this.starBtn.onclick = (e) => {
      e.stopPropagation();
      this.callbacks.onTogglePin(this.station.id);
    };

    actions.appendChild(this.starBtn);
    header.appendChild(titleGroup);
    header.appendChild(actions);

    // Body: Platforms
    const platforms = createElement('div', 'station-platforms');

    const p1 = this.station.platforms.northbound || this.station.platforms.westbound;
    const p2 = this.station.platforms.southbound || this.station.platforms.eastbound;

    // Platform 1
    const col1 = createElement('div', 'platform-column');
    const head1 = createElement('div', 'platform-header');
    const dest1 = createElement('div', 'platform-dest');
    dest1.innerHTML = `${ICONS.arrowUp} to ${p1?.terminalDestination || 'Terminal'}`;
    head1.appendChild(dest1);
    this.platform1Container = createElement('div', 'platform-departures');
    col1.appendChild(head1);
    col1.appendChild(this.platform1Container);

    // Platform 2
    const col2 = createElement('div', 'platform-column');
    const head2 = createElement('div', 'platform-header');
    const dest2 = createElement('div', 'platform-dest');
    dest2.innerHTML = `${ICONS.arrowDown} to ${p2?.terminalDestination || 'Terminal'}`;
    head2.appendChild(dest2);
    this.platform2Container = createElement('div', 'platform-departures');
    col2.appendChild(head2);
    col2.appendChild(this.platform2Container);

    platforms.appendChild(col1);
    platforms.appendChild(col2);

    card.appendChild(header);
    card.appendChild(platforms);

    this.setLoading();
    return card;
  }
}
