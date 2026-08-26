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

  constructor(callbacks: StationPickerCallbacks) {
    this.callbacks = callbacks;
    this.overlay = this.render();
    document.body.appendChild(this.overlay);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });
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
    this.renderStationsList();
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
      `picker-add-btn ${isPinned ? 'pinned' : ''}`
    ) as HTMLButtonElement;

    if (isPinned) {
      actionBtn.innerHTML = `<span class="btn-text-default">✓ Added</span><span class="btn-text-hover">✕ Remove</span>`;
    } else {
      actionBtn.textContent = '+ Add Station';
    }

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
    const title = createElement('h3', 'modal-title', 'Add & Remove Stations');
    const closeBtn = createElement('button', 'icon-btn modal-close-btn', ICONS.close);
    closeBtn.setAttribute('aria-label', 'Close Add & Remove Stations');
    closeBtn.title = 'Close';
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

    // List
    this.listContainer = createElement('div', 'departures-list');

    body.appendChild(filtersWrap);
    body.appendChild(this.listContainer);

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);

    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    return overlay;
  }
}
