import { TransitLineId } from '../types/transit';
import { createElement, ICONS } from '../utils/dom';
import { formatClockTime } from '../utils/time';

export interface HeaderCallbacks {
  onLineChange: (line: TransitLineId) => void;
  onSettingsClick: () => void;
  onFaqClick: () => void;
}

export class HeaderComponent {
  private element: HTMLElement;
  private logoEl!: HTMLElement;
  private line1Btn!: HTMLButtonElement;
  private line2Btn!: HTMLButtonElement;
  private clockEl!: HTMLElement;
  private activeLine: TransitLineId = 'line-1';
  private is24Hour: boolean = false;
  private callbacks: HeaderCallbacks;

  constructor(initialLine: TransitLineId, is24Hour: boolean, callbacks: HeaderCallbacks) {
    this.activeLine = initialLine;
    this.is24Hour = is24Hour;
    this.callbacks = callbacks;
    this.element = this.render();
    this.startClock();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setActiveLine(line: TransitLineId) {
    this.activeLine = line;
    if (this.logoEl) {
      this.logoEl.className = `brand-logo ${line === 'line-1' ? 'line-1-logo' : 'line-2-logo'}`;
    }
    if (line === 'line-1') {
      this.line1Btn.className = 'line-btn active line-1-active';
      this.line2Btn.className = 'line-btn';
    } else {
      this.line1Btn.className = 'line-btn';
      this.line2Btn.className = 'line-btn active line-2-active';
    }
  }

  public setTimeFormat(is24Hour: boolean) {
    this.is24Hour = is24Hour;
    this.updateClock();
  }

  private startClock() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  private updateClock() {
    if (this.clockEl) {
      this.clockEl.textContent = formatClockTime(Date.now(), this.is24Hour);
    }
  }

  private render(): HTMLElement {
    const header = createElement('header', 'app-header');
    const container = createElement('div', 'app-container header-inner');

    // Brand Left
    const brand = createElement('div', 'brand-section');
    this.logoEl = createElement(
      'div',
      `brand-logo ${this.activeLine === 'line-1' ? 'line-1-logo' : 'line-2-logo'}`,
      ICONS.train
    );
    const textGroup = createElement('div', 'brand-text');
    const title = createElement('div', 'brand-title');
    title.innerHTML = `Seattle Light Rail <span class="live-indicator"><span class="pulse-dot"></span>Live</span>`;
    const subtitle = createElement('div', 'brand-subtitle', 'Sound Transit Link Real-Time Tracker');
    textGroup.appendChild(title);
    textGroup.appendChild(subtitle);
    brand.appendChild(this.logoEl);
    brand.appendChild(textGroup);

    // Line Switcher Center
    const switcher = createElement('div', 'line-switcher');
    this.line1Btn = createElement(
      'button',
      `line-btn ${this.activeLine === 'line-1' ? 'active line-1-active' : ''}`
    ) as HTMLButtonElement;
    this.line1Btn.innerHTML = `<span class="line-badge-circle line-1-circle">1</span> 1 Line`;
    this.line1Btn.title = 'Lynnwood City Center ⇄ Angle Lake';
    this.line1Btn.onclick = () => {
      this.setActiveLine('line-1');
      this.callbacks.onLineChange('line-1');
    };

    this.line2Btn = createElement(
      'button',
      `line-btn ${this.activeLine === 'line-2' ? 'active line-2-active' : ''}`
    ) as HTMLButtonElement;
    this.line2Btn.innerHTML = `<span class="line-badge-circle line-2-circle">2</span> 2 Line`;
    this.line2Btn.title = 'South Bellevue ⇄ Downtown Redmond';
    this.line2Btn.onclick = () => {
      this.setActiveLine('line-2');
      this.callbacks.onLineChange('line-2');
    };

    switcher.appendChild(this.line1Btn);
    switcher.appendChild(this.line2Btn);

    // Right Controls
    const actions = createElement('div', 'header-actions');
    this.clockEl = createElement('div', 'clock-display');

    const faqBtn = createElement(
      'button',
      'header-text-btn',
      `Transit Guide & FAQ`
    );
    faqBtn.title = 'How to travel between Lynnwood, Seattle, and Bellevue';
    faqBtn.onclick = () => this.callbacks.onFaqClick();

    const settingsBtn = createElement('button', 'icon-btn', ICONS.settings);
    settingsBtn.title = 'Settings & Preferences';
    settingsBtn.onclick = () => this.callbacks.onSettingsClick();

    actions.appendChild(this.clockEl);
    actions.appendChild(faqBtn);
    actions.appendChild(settingsBtn);

    container.appendChild(brand);
    container.appendChild(switcher);
    container.appendChild(actions);
    header.appendChild(container);

    return header;
  }
}
