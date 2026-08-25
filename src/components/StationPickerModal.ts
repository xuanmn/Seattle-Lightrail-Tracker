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
  private searchInput!: HTMLInputElement;
  private activeFilterLine: TransitLineId | 'all' = 'all';
  private callbacks: StationPickerCallbacks;

  constructor(callbacks: StationPickerCallbacks) {
    this.callbacks = callbacks;
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
  }

  public open(initialLine?: TransitLineId) {
    if (initialLine) this.activeFilterLine = initialLine;
    this.searchInput.value = '';
    this.renderStationsList();
    this.overlay.classList.add('open');
    setTimeout(() => this.searchInput.focus(), 100);
  }

  public close() {
    this.overlay.classList.remove('open');
  }

  public refreshPinnedState() {
    this.renderStationsList();
  }

  private renderStationsList() {
    const query = this.searchInput.value.toLowerCase().trim();
    this.listContainer.innerHTML = '';

    const filtered = STATIONS.filter((station) => {
      const matchesLine =
        this.activeFilterLine === 'all' || station.lines.includes(this.activeFilterLine);
      const matchesSearch =
        !query ||
        station.name.toLowerCase().includes(query) ||
        (station.shortName && station.shortName.toLowerCase().includes(query));
      return matchesLine && matchesSearch;
    });

    if (filtered.length === 0) {
      const empty = createElement('div', 'departures-empty');
      empty.textContent = 'No stations found matching search.';
      this.listContainer.appendChild(empty);
      return;
    }

    filtered.forEach((station) => {
      const item = this.createStationRow(station);
      this.listContainer.appendChild(item);
    });
  }

  private createStationRow(station: Station): HTMLElement {
    const isLine1 = station.lines.includes('line-1');
    const isPinned = this.callbacks.isStationPinned(station.id);

    const row = createElement('div', 'departure-row');
    row.style.cursor = 'pointer';
    row.style.padding = '0.85rem 1rem';

    const info = createElement('div', 'brand-section');

    const linePill = createElement(
      'span',
      `station-line-pill ${isLine1 ? 'line-1-circle' : 'line-2-circle'}`,
      isLine1 ? '1' : '2'
    );
    linePill.style.width = '24px';
    linePill.style.height = '24px';
    linePill.style.fontSize = '0.8rem';

    const textGroup = createElement('div', 'station-name-wrap');
    const name = createElement('div', 'station-name');
    name.style.fontSize = '1rem';
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

    const starBtn = createElement(
      'button',
      `star-btn ${isPinned ? 'pinned' : ''}`,
      isPinned ? ICONS.starFilled : ICONS.star
    ) as HTMLButtonElement;
    starBtn.title = isPinned ? 'Pinned' : 'Pin station';

    const toggle = (e: Event) => {
      e.stopPropagation();
      this.callbacks.onTogglePin(station.id);
      this.refreshPinnedState();
    };

    row.onclick = toggle;
    starBtn.onclick = toggle;

    row.appendChild(info);
    row.appendChild(starBtn);
    return row;
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'modal-overlay');
    const modal = createElement('div', 'modal-container');

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title', 'Add Station to Dashboard');
    const closeBtn = createElement('button', 'icon-btn', ICONS.close);
    closeBtn.onclick = () => this.close();
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', 'modal-body');

    // Search Input
    const searchWrap = createElement('div', 'form-group');
    this.searchInput = createElement(
      'input',
      'form-control'
    ) as HTMLInputElement;
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search stations (e.g., Capitol Hill, SeaTac, Westlake)...';
    this.searchInput.oninput = () => this.renderStationsList();
    searchWrap.appendChild(this.searchInput);

    // List
    this.listContainer = createElement('div', 'departures-list');
    this.listContainer.style.maxHeight = '420px';
    this.listContainer.style.overflowY = 'auto';

    body.appendChild(searchWrap);
    body.appendChild(this.listContainer);

    // Footer
    const footer = createElement('div', 'modal-footer');
    const doneBtn = createElement('button', 'btn-primary', 'Done');
    doneBtn.onclick = () => this.close();
    footer.appendChild(doneBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);

    // Click outside to close
    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    return overlay;
  }
}
