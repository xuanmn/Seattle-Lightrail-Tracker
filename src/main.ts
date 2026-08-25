import './styles/theme.css';
import './styles/layout.css';
import './styles/board.css';
import './styles/kiosk.css';

import { HeaderComponent } from './components/Header';
import { KioskViewComponent } from './components/KioskView';
import { SettingsModal } from './components/SettingsModal';
import { StationCardComponent } from './components/StationCard';
import { StationPickerModal } from './components/StationPickerModal';
import { getStationById, getStationsByLine, LINE_CONFIG } from './data/stations';
import { fetchArrivalsForStation } from './services/oba-api';
import {
  getActiveLine,
  getPinnedStationIds,
  getSettings,
  isStationPinned,
  setActiveLine,
  togglePinnedStation,
} from './services/storage';
import { AppSettings, Station, StationArrivals, TransitLineId } from './types/transit';
import { createElement, ICONS } from './utils/dom';

class TransitTrackerApp {
  private appEl: HTMLElement;
  private header!: HeaderComponent;
  private kioskView!: KioskViewComponent;
  private pickerModal!: StationPickerModal;
  private settingsModal!: SettingsModal;

  private activeLine: TransitLineId = 'line-1';
  private settings: AppSettings;
  private pinnedIds: string[] = [];
  private cardComponents: Map<string, StationCardComponent> = new Map();
  private arrivalsData: Map<string, StationArrivals> = new Map();

  private stationsGridEl!: HTMLElement;
  private lineTitleEl!: HTMLElement;
  private lineSubtitleEl!: HTMLElement;
  private staleBannerEl!: HTMLElement;

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

    // Header
    this.header = new HeaderComponent(this.activeLine, this.settings.timeFormat24Hour, {
      onLineChange: (line) => this.switchLine(line),
      onRefreshClick: () => this.fetchVisibleArrivals(true),
      onKioskClick: () => this.openKiosk(),
      onSettingsClick: () => this.settingsModal.open(),
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
    const addStationBtn = createElement(
      'button',
      'btn-primary',
      `${ICONS.plus} Add / Browse Stations`
    );
    addStationBtn.onclick = () => this.pickerModal.open(this.activeLine);
    controls.appendChild(addStationBtn);

    toolbar.appendChild(heading);
    toolbar.appendChild(controls);
    container.appendChild(toolbar);

    // Stations Grid
    this.stationsGridEl = createElement('div', 'stations-grid');
    container.appendChild(this.stationsGridEl);

    main.appendChild(container);
    this.appEl.appendChild(main);

    // Modals
    this.pickerModal = new StationPickerModal({
      onTogglePin: (stationId) => this.handleTogglePin(stationId),
      isStationPinned: (stationId) => isStationPinned(stationId),
    });

    this.settingsModal = new SettingsModal({
      onSettingsSaved: (newSettings) => this.handleSettingsSaved(newSettings),
    });

    this.kioskView = new KioskViewComponent(this.settings.timeFormat24Hour, {
      onExit: () => {
        // Returned from kiosk
      },
    });
    document.body.appendChild(this.kioskView.getElement());

    this.updateToolbarHeader();
    this.renderStationCards();
  }

  private switchLine(line: TransitLineId) {
    this.activeLine = line;
    setActiveLine(line);
    this.header.setActiveLine(line);
    this.updateToolbarHeader();
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
    const pinnedOnThisLine = lineStations.filter((s) => this.pinnedIds.includes(s.id));
    const unpinnedOnThisLine = lineStations.filter((s) => !this.pinnedIds.includes(s.id));

    // Show pinned stations first, followed by all other stations on this line
    return [...pinnedOnThisLine, ...unpinnedOnThisLine];
  }

  private renderStationCards() {
    this.stationsGridEl.innerHTML = '';
    this.cardComponents.clear();

    const stations = this.getVisibleStations();

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

  private handleTogglePin(stationId: string) {
    const newStatus = togglePinnedStation(stationId);
    this.pinnedIds = getPinnedStationIds();

    const card = this.cardComponents.get(stationId);
    if (card) {
      card.setPinned(newStatus);
    }
    this.pickerModal.refreshPinnedState();
  }

  private handleSettingsSaved(newSettings: AppSettings) {
    this.settings = newSettings;
    this.header.setTimeFormat(newSettings.timeFormat24Hour);

    this.cardComponents.forEach((card) => {
      card.setTimeFormat(newSettings.timeFormat24Hour);
    });

    this.startPolling(); // Restart poll timer with new interval
    this.fetchVisibleArrivals(true);
  }

  private openKiosk() {
    const pinnedStations = this.pinnedIds
      .map((id) => getStationById(id))
      .filter((s): s is Station => Boolean(s));

    const stationsToDisplay =
      pinnedStations.length > 0 ? pinnedStations : getStationsByLine(this.activeLine).slice(0, 4);

    this.kioskView.open(stationsToDisplay, this.arrivalsData, this.settings.autoRotateKiosk);
  }

  private async fetchVisibleArrivals(isManual: boolean = false) {
    if (this.isFetching) return;
    this.isFetching = true;
    this.header.setRefreshing(true);

    const stations = this.getVisibleStations();

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

      // Update Kiosk view if open
      this.kioskView.updateArrivals(this.arrivalsData);
    } catch {
      if (isManual) {
        this.staleBannerEl.style.display = 'flex';
        this.staleBannerEl.textContent =
          'Network connection interrupted. Showing estimated transit schedules while reconnecting...';
      }
    } finally {
      this.isFetching = false;
      this.header.setRefreshing(false);
    }
  }

  private startPolling() {
    if (this.pollIntervalTimer) {
      clearInterval(this.pollIntervalTimer);
    }

    const intervalMs = Math.max(10, this.settings.refreshIntervalSeconds) * 1000;
    this.fetchVisibleArrivals();
    this.pollIntervalTimer = window.setInterval(() => {
      this.fetchVisibleArrivals();
    }, intervalMs);
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
