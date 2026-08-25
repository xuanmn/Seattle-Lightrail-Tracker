import './styles/theme.css';
import './styles/layout.css';
import './styles/board.css';

import { FaqModal } from './components/FaqModal';
import { HeaderComponent } from './components/Header';
import { SettingsModal } from './components/SettingsModal';
import { StationCardComponent } from './components/StationCard';
import { StationPickerModal } from './components/StationPickerModal';
import { getStationsByLine, LINE_CONFIG } from './data/stations';
import { fetchArrivalsForStation } from './services/oba-api';
import {
  getActiveLine,
  getPinnedStationIds,
  getSettings,
  setActiveLine,
  togglePinnedStation,
} from './services/storage';
import { AppSettings, Station, StationArrivals, TransitLineId } from './types/transit';
import { createElement, ICONS } from './utils/dom';

const SYNC_INTERVAL_MS = 60 * 1000; // Fixed 60-second real-time sync cycle

class TransitTrackerApp {
  private appEl: HTMLElement;
  private header!: HeaderComponent;
  private pickerModal!: StationPickerModal;
  private settingsModal!: SettingsModal;
  private faqModal!: FaqModal;

  private activeLine: TransitLineId = 'line-1';
  private showOnlyPinned: boolean = true; // Default to showing only user's chosen favorite stations
  private settings: AppSettings;
  private pinnedIds: string[] = [];
  private cardComponents: Map<string, StationCardComponent> = new Map();
  private arrivalsData: Map<string, StationArrivals> = new Map();

  private stationsGridEl!: HTMLElement;
  private lineTitleEl!: HTMLElement;
  private lineSubtitleEl!: HTMLElement;
  private staleBannerEl!: HTMLElement;
  private viewModePillWrap!: HTMLElement;

  private pollIntervalTimer?: number;
  private countdownTickTimer?: number;
  private isFetching: boolean = false;

  constructor() {
    const root = document.getElementById('app');
    if (!root) throw new Error('Root #app element not found');
    this.appEl = root;

    this.settings = getSettings();
    this.activeLine = getActiveLine();
    this.pinnedIds = getPinnedStationIds();

    this.initUI();
    this.startPolling();
    this.startSecondTicker();
  }

  private initUI() {
    this.appEl.innerHTML = '';

    // Modals
    this.pickerModal = new StationPickerModal({
      onTogglePin: (stationId) => this.handleTogglePin(stationId),
      isStationPinned: (stationId) => this.pinnedIds.includes(stationId),
    });

    this.settingsModal = new SettingsModal({
      onSettingsSaved: (newSettings) => this.handleSettingsSaved(newSettings),
    });

    this.faqModal = new FaqModal();

    // Header
    this.header = new HeaderComponent(this.activeLine, this.settings.timeFormat24Hour, {
      onLineChange: (line) => this.switchLine(line),
      onSettingsClick: () => this.settingsModal.open(),
      onFaqClick: () => this.faqModal.open(),
    });
    this.appEl.appendChild(this.header.getElement());

    // Main Container
    const main = createElement('main', 'main-content');
    const container = createElement('div', 'app-container');

    // Status / Stale Banner (hidden by default)
    this.staleBannerEl = createElement('div', 'status-banner');
    this.staleBannerEl.style.display = 'none';
    container.appendChild(this.staleBannerEl);

    // Dashboard Toolbar
    const toolbar = createElement('div', 'dashboard-toolbar');
    const heading = createElement('div', 'toolbar-heading');
    this.lineTitleEl = createElement('h2', 'section-title');
    this.lineSubtitleEl = createElement('div', 'section-subtitle');
    heading.appendChild(this.lineTitleEl);
    heading.appendChild(this.lineSubtitleEl);

    const controls = createElement('div', 'toolbar-controls');

    // View Mode Toggle Pills (My Stations vs All Stations)
    this.viewModePillWrap = createElement('div', 'line-switcher');
    this.renderViewModePills();
    controls.appendChild(this.viewModePillWrap);

    toolbar.appendChild(heading);
    toolbar.appendChild(controls);
    container.appendChild(toolbar);

    // Stations Grid
    this.stationsGridEl = createElement('div', 'stations-grid');
    container.appendChild(this.stationsGridEl);

    main.appendChild(container);
    this.appEl.appendChild(main);

    this.updateToolbarHeader();
    this.renderStationCards();
  }

  private renderViewModePills() {
    this.viewModePillWrap.innerHTML = '';

    const myBtn = createElement(
      'button',
      `view-mode-btn ${this.showOnlyPinned ? 'active' : ''}`
    );
    myBtn.innerHTML = `★ My Saved Stations`;
    if (this.showOnlyPinned) {
      myBtn.classList.add(this.activeLine === 'line-1' ? 'line-1-active' : 'line-2-active');
    }
    myBtn.onclick = () => {
      this.showOnlyPinned = true;
      this.renderViewModePills();
      this.renderStationCards();
      this.fetchVisibleArrivals();
    };

    const allBtn = createElement(
      'button',
      `view-mode-btn ${!this.showOnlyPinned ? 'active' : ''}`
    );
    allBtn.innerHTML = `All Line Stations`;
    if (!this.showOnlyPinned) {
      allBtn.classList.add(this.activeLine === 'line-1' ? 'line-1-active' : 'line-2-active');
    }
    allBtn.onclick = () => {
      this.showOnlyPinned = false;
      this.renderViewModePills();
      this.renderStationCards();
      this.fetchVisibleArrivals();
    };

    this.viewModePillWrap.appendChild(myBtn);
    this.viewModePillWrap.appendChild(allBtn);
  }

  private switchLine(line: TransitLineId) {
    this.activeLine = line;
    setActiveLine(line);
    this.header.setActiveLine(line);
    this.updateToolbarHeader();
    this.renderViewModePills();
    this.renderStationCards();
    this.fetchVisibleArrivals(true);
  }

  private updateToolbarHeader() {
    const config = LINE_CONFIG[this.activeLine];
    this.lineTitleEl.innerHTML = `
      <span class="station-line-pill ${this.activeLine === 'line-1' ? 'line-1-circle' : 'line-2-circle'}">
        ${this.activeLine === 'line-1' ? '1' : '2'}
      </span>
      ${config.name} Live Departures
    `;
    this.lineSubtitleEl.textContent = `${config.terminusSouth} ⇄ ${config.terminusNorth}`;
  }

  private getVisibleStations(): Station[] {
    const lineStations = getStationsByLine(this.activeLine);

    if (this.showOnlyPinned) {
      // Return only stations the user has pinned for this line
      return lineStations.filter((s) => this.pinnedIds.includes(s.id));
    }

    // In "All Line Stations" view, show pinned first, then others
    const pinnedOnThisLine = lineStations.filter((s) => this.pinnedIds.includes(s.id));
    const unpinnedOnThisLine = lineStations.filter((s) => !this.pinnedIds.includes(s.id));
    return [...pinnedOnThisLine, ...unpinnedOnThisLine];
  }

  private renderStationCards() {
    this.stationsGridEl.innerHTML = '';
    this.cardComponents.clear();

    const stations = this.getVisibleStations();

    if (stations.length === 0) {
      this.renderEmptyDashboard();
      return;
    }

    stations.forEach((station) => {
      const isPinned = this.pinnedIds.includes(station.id);
      const cardComp = new StationCardComponent(
        station,
        isPinned,
        this.settings.timeFormat24Hour,
        {
          onTogglePin: (id) => this.handleTogglePin(id),
        }
      );

      this.cardComponents.set(station.id, cardComp);
      this.stationsGridEl.appendChild(cardComp.getElement());

      // If we already have cached arrivals data for this station, populate it
      const cached = this.arrivalsData.get(station.id);
      if (cached) {
        cardComp.updateArrivals(cached);
      }
    });
  }

  private renderEmptyDashboard() {
    const config = LINE_CONFIG[this.activeLine];
    const emptyCard = createElement('div', 'empty-dashboard-card');

    const icon = createElement('div', 'empty-dashboard-icon', ICONS.star);
    const title = createElement(
      'h3',
      'empty-dashboard-title',
      `No saved stations on ${config.name}`
    );
    const desc = createElement(
      'p',
      'empty-dashboard-desc',
      'Choose the stations you use daily to keep your departure board fast and clean.'
    );

    const lineClass = this.activeLine === 'line-1' ? 'line-1-btn' : 'line-2-btn';
    const btn = createElement(
      'button',
      `empty-dashboard-btn ${lineClass}`,
      `${ICONS.plus} Add & Remove Stations`
    );
    btn.onclick = () => this.pickerModal.open(this.activeLine);

    emptyCard.appendChild(icon);
    emptyCard.appendChild(title);
    emptyCard.appendChild(desc);
    emptyCard.appendChild(btn);

    this.stationsGridEl.appendChild(emptyCard);
  }

  private handleTogglePin(stationId: string) {
    togglePinnedStation(stationId);
    this.pinnedIds = getPinnedStationIds();

    this.renderStationCards();
    this.pickerModal.refreshPinnedState();
    this.fetchVisibleArrivals();
  }

  private handleSettingsSaved(newSettings: AppSettings) {
    this.settings = newSettings;
    this.header.setTimeFormat(newSettings.timeFormat24Hour);

    this.cardComponents.forEach((card) => {
      card.setTimeFormat(newSettings.timeFormat24Hour);
    });

    this.fetchVisibleArrivals(true);
  }

  private async fetchVisibleArrivals(isManual: boolean = false) {
    if (this.isFetching) return;
    this.isFetching = true;

    const stations = this.getVisibleStations();
    if (stations.length === 0) {
      this.isFetching = false;
      return;
    }

    try {
      const fetchPromises = stations.map(async (station) => {
        try {
          const result = await fetchArrivalsForStation(station);
          const data: StationArrivals = {
            station,
            lastUpdated: Date.now(),
            direction1: result.direction1,
            direction2: result.direction2,
          };
          this.arrivalsData.set(station.id, data);

          const card = this.cardComponents.get(station.id);
          if (card) {
            card.updateArrivals(data);
          }
        } catch (err) {
          console.warn(`Failed fetching arrivals for ${station.name}:`, err);
        }
      });

      await Promise.all(fetchPromises);
      this.staleBannerEl.style.display = 'none';
    } catch {
      if (isManual) {
        this.staleBannerEl.style.display = 'flex';
        this.staleBannerEl.textContent =
          'Network connection interrupted. Showing estimated transit schedules while reconnecting...';
      }
    } finally {
      this.isFetching = false;
    }
  }

  private startPolling() {
    if (this.pollIntervalTimer) {
      clearInterval(this.pollIntervalTimer);
    }

    this.fetchVisibleArrivals();
    // Synchronize every 60 seconds
    this.pollIntervalTimer = window.setInterval(() => {
      this.fetchVisibleArrivals();
    }, SYNC_INTERVAL_MS);
  }

  private startSecondTicker() {
    if (this.countdownTickTimer) {
      clearInterval(this.countdownTickTimer);
    }

    // Ticks every second to smoothly update countdown values and clock
    this.countdownTickTimer = window.setInterval(() => {
      this.cardComponents.forEach((card) => {
        card.tickCountdowns();
      });
    }, 1000);
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new TransitTrackerApp();
});
