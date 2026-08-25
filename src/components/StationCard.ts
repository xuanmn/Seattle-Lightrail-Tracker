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

  private col1El!: HTMLElement;
  private col2El!: HTMLElement;
  private col1Header!: HTMLButtonElement;
  private col2Header!: HTMLButtonElement;
  private col1SummaryBadge!: HTMLElement;
  private col2SummaryBadge!: HTMLElement;
  private platform1Container!: HTMLElement;
  private platform2Container!: HTMLElement;

  private isCol1Collapsed: boolean = false;
  private isCol2Collapsed: boolean = false;

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
    this.starBtn.title = pinned ? 'Remove from favorites' : 'Add to favorites';
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
      data.direction1.platform.terminalDestination,
      this.col1SummaryBadge
    );
    this.renderPlatformArrivals(
      this.platform2Container,
      data.direction2.arrivals,
      data.direction2.platform.terminalDestination,
      this.col2SummaryBadge
    );
  }

  public tickCountdowns() {
    if (!this.currentArrivals) return;
    this.updateArrivals(this.currentArrivals);
  }

  private toggleCollapse(colIndex: 1 | 2) {
    if (colIndex === 1) {
      this.isCol1Collapsed = !this.isCol1Collapsed;
      this.col1El.classList.toggle('collapsed', this.isCol1Collapsed);
    } else {
      this.isCol2Collapsed = !this.isCol2Collapsed;
      this.col2El.classList.toggle('collapsed', this.isCol2Collapsed);
    }
  }

  private renderPlatformArrivals(
    container: HTMLElement,
    arrivals: TransitArrival[],
    defaultDest: string,
    summaryBadge: HTMLElement
  ) {
    container.innerHTML = '';

    if (!arrivals || arrivals.length === 0) {
      const empty = createElement('div', 'departures-empty');
      empty.textContent = 'No upcoming trains';
      container.appendChild(empty);
      summaryBadge.textContent = 'No trains';
      summaryBadge.className = 'platform-summary-badge';
      return;
    }

    // Update collapsed summary badge with next train
    const nextTrain = arrivals[0];
    const nextTargetTime = nextTrain.predictedDepartureTime || nextTrain.scheduledDepartureTime;
    const nextBadge = formatCountdownBadge(nextTargetTime);
    summaryBadge.textContent = nextBadge.text;
    summaryBadge.className = `platform-summary-badge ${nextBadge.isNow ? 'now' : ''}`;

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
    this.starBtn.title = this.isPinned ? 'Remove from favorites' : 'Add to favorites';
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

    // Platform 1 Column
    this.col1El = createElement('div', 'platform-column');
    this.col1Header = createElement('button', 'platform-header') as HTMLButtonElement;
    this.col1Header.type = 'button';
    this.col1Header.title = 'Click to expand or collapse platform departures';

    const dest1 = createElement('div', 'platform-dest');
    dest1.innerHTML = `${ICONS.arrowUp} <span class="dest-text">${p1?.terminalDestination || 'Terminal'}</span>`;

    const rightControls1 = createElement('div', 'platform-header-right');
    this.col1SummaryBadge = createElement('span', 'platform-summary-badge', 'Loading...');
    const chevron1 = createElement('span', 'chevron-icon', ICONS.chevronDown);
    rightControls1.appendChild(this.col1SummaryBadge);
    rightControls1.appendChild(chevron1);

    this.col1Header.appendChild(dest1);
    this.col1Header.appendChild(rightControls1);
    this.col1Header.onclick = () => this.toggleCollapse(1);

    this.platform1Container = createElement('div', 'platform-departures');
    this.col1El.appendChild(this.col1Header);
    this.col1El.appendChild(this.platform1Container);

    // Platform 2 Column
    this.col2El = createElement('div', 'platform-column');
    this.col2Header = createElement('button', 'platform-header') as HTMLButtonElement;
    this.col2Header.type = 'button';
    this.col2Header.title = 'Click to expand or collapse platform departures';

    const dest2 = createElement('div', 'platform-dest');
    dest2.innerHTML = `${ICONS.arrowDown} <span class="dest-text">${p2?.terminalDestination || 'Terminal'}</span>`;

    const rightControls2 = createElement('div', 'platform-header-right');
    this.col2SummaryBadge = createElement('span', 'platform-summary-badge', 'Loading...');
    const chevron2 = createElement('span', 'chevron-icon', ICONS.chevronDown);
    rightControls2.appendChild(this.col2SummaryBadge);
    rightControls2.appendChild(chevron2);

    this.col2Header.appendChild(dest2);
    this.col2Header.appendChild(rightControls2);
    this.col2Header.onclick = () => this.toggleCollapse(2);

    this.platform2Container = createElement('div', 'platform-departures');
    this.col2El.appendChild(this.col2Header);
    this.col2El.appendChild(this.platform2Container);

    platforms.appendChild(this.col1El);
    platforms.appendChild(this.col2El);

    card.appendChild(header);
    card.appendChild(platforms);

    this.setLoading();
    return card;
  }
}
