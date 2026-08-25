import { STATIONS } from '../data/stations';
import { Station, TransitLineId } from '../types/transit';
import { createElement, ICONS } from '../utils/dom';

export interface StationPickerCallbacks {
  onTogglePin: (stationId: string) => void;
  isStationPinned: (stationId: string) => boolean;
}

export class StationPickerModal {
  private overlay: HTMLElement;
  private listContainer!: HTMLElement;
  private activeFilterLine: TransitLineId = 'line-1';
  private callbacks: StationPickerCallbacks;
  private tab1Btn!: HTMLButtonElement;
  private tab2Btn!: HTMLButtonElement;
  private progressBar!: HTMLElement;

  constructor(callbacks: StationPickerCallbacks) {
    this.callbacks = callbacks;
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
  }

  public open(initialLine?: TransitLineId) {
    if (initialLine) {
      this.setFilter(initialLine);
    } else {
      this.setFilter(this.activeFilterLine);
    }
    if (this.listContainer) {
      this.listContainer.scrollTop = 0;
    }
    this.renderStationsList();
    this.overlay.classList.add('open');
  }

  public close() {
    this.overlay.classList.remove('open');
  }

  public refreshPinnedState() {
    this.renderStationsList();
  }

  private setFilter(line: TransitLineId) {
    this.activeFilterLine = line;
    this.tab1Btn.className = `filter-pill ${line === 'line-1' ? 'active line-1' : ''}`;
    this.tab2Btn.className = `filter-pill ${line === 'line-2' ? 'active line-2' : ''}`;
    if (this.progressBar) {
      this.progressBar.className = `picker-scroll-progress-bar ${line}`;
    }
    this.renderStationsList();
  }

  private updateScrollProgress() {
    if (!this.listContainer || !this.progressBar) return;
    const maxScroll = this.listContainer.scrollHeight - this.listContainer.clientHeight;
    if (maxScroll <= 0) {
      this.progressBar.style.width = '100%';
      this.listContainer.classList.add('at-bottom');
    } else {
      const pct = Math.min(100, Math.max(0, (this.listContainer.scrollTop / maxScroll) * 100));
      this.progressBar.style.width = `${pct}%`;
      const isAtBottom =
        this.listContainer.scrollTop + this.listContainer.clientHeight >=
        this.listContainer.scrollHeight - 6;
      this.listContainer.classList.toggle('at-bottom', isAtBottom);
    }
  }

  private renderStationsList() {
    this.listContainer.innerHTML = '';

    const filtered = STATIONS.filter((station) =>
      station.lines.includes(this.activeFilterLine)
    );

    filtered.forEach((station) => {
      const item = this.createStationRow(station);
      this.listContainer.appendChild(item);
    });

    this.updateScrollProgress();
  }

  private createStationRow(station: Station): HTMLElement {
    const isLine1 = station.lines.includes('line-1');
    const isPinned = this.callbacks.isStationPinned(station.id);

    const row = createElement('div', 'picker-station-row');

    const info = createElement('div', 'brand-section');

    const linePill = createElement(
      'span',
      `station-line-pill ${isLine1 ? 'line-1-circle' : 'line-2-circle'}`,
      isLine1 ? '1' : '2'
    );

    const textGroup = createElement('div', 'station-name-wrap');
    const name = createElement('div', 'station-name');

    name.textContent = station.name;

    if (station.shortName) {
      const sub = createElement('div', 'station-subname', station.shortName);
      textGroup.appendChild(name);
      textGroup.appendChild(sub);
    } else {
      textGroup.appendChild(name);
    }

    info.appendChild(linePill);
    info.appendChild(textGroup);

    // Action button
    const actionBtn = createElement(
      'button',
      `picker-add-btn ${isPinned ? 'pinned' : ''}`,
      isPinned ? `✓ On Dashboard` : `+ Add Station`
    ) as HTMLButtonElement;

    const toggle = (e: Event) => {
      e.stopPropagation();
      this.callbacks.onTogglePin(station.id);
      this.refreshPinnedState();
    };

    row.onclick = toggle;
    actionBtn.onclick = toggle;

    row.appendChild(info);
    row.appendChild(actionBtn);
    return row;
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'modal-overlay');
    const modal = createElement('div', 'modal-container');

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title', 'Choose Stations for Dashboard');
    const closeBtn = createElement('button', 'icon-btn', ICONS.close);
    closeBtn.onclick = () => this.close();
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', 'modal-body');

    // Line Filter Pills
    const filtersWrap = createElement('div', 'picker-filter-pills');
    this.tab1Btn = createElement(
      'button',
      'filter-pill active line-1',
      '1 Line (Lynnwood ⇄ Angle Lake)'
    ) as HTMLButtonElement;
    this.tab1Btn.onclick = () => this.setFilter('line-1');

    this.tab2Btn = createElement(
      'button',
      'filter-pill',
      '2 Line (South Bellevue ⇄ Downtown Redmond)'
    ) as HTMLButtonElement;
    this.tab2Btn.onclick = () => this.setFilter('line-2');

    filtersWrap.appendChild(this.tab1Btn);
    filtersWrap.appendChild(this.tab2Btn);

    // Scroll progress / loading bar
    const progressTrack = createElement('div', 'picker-scroll-progress-track');
    this.progressBar = createElement(
      'div',
      `picker-scroll-progress-bar ${this.activeFilterLine}`
    );
    progressTrack.appendChild(this.progressBar);

    // List
    this.listContainer = createElement('div', 'departures-list');
    this.listContainer.addEventListener('scroll', () => this.updateScrollProgress());

    body.appendChild(filtersWrap);
    body.appendChild(progressTrack);
    body.appendChild(this.listContainer);

    // Footer
    const footer = createElement('div', 'modal-footer');
    const doneBtn = createElement('button', 'btn-primary', 'Close');
    doneBtn.onclick = () => this.close();
    footer.appendChild(doneBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    return overlay;
  }
}
