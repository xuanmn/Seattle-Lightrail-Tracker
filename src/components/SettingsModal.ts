import { getSettings, updateSettings } from '../services/storage';
import { AppSettings } from '../types/transit';
import { createElement, ICONS } from '../utils/dom';

export interface SettingsModalCallbacks {
  onSettingsSaved: (settings: AppSettings) => void;
}

export class SettingsModal {
  private overlay: HTMLElement;
  private timeFormatCheckbox!: HTMLInputElement;
  private customApiInput!: HTMLInputElement;
  private callbacks: SettingsModalCallbacks;

  constructor(callbacks: SettingsModalCallbacks) {
    this.callbacks = callbacks;
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
  }

  public open() {
    const current = getSettings();
    this.timeFormatCheckbox.checked = current.timeFormat24Hour;
    this.customApiInput.value = current.customApiUrl || '';
    this.overlay.classList.add('open');
  }

  public close() {
    this.overlay.classList.remove('open');
  }

  private save() {
    const updated = updateSettings({
      timeFormat24Hour: this.timeFormatCheckbox.checked,
      customApiUrl: this.customApiInput.value.trim() || undefined,
    });
    this.callbacks.onSettingsSaved(updated);
    this.close();
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'modal-overlay');
    const modal = createElement('div', 'modal-container');

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title', 'Tracker Settings');
    const closeBtn = createElement('button', 'icon-btn', ICONS.close);
    closeBtn.onclick = () => this.close();
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', 'modal-body');

    // Auto-Sync Info
    const syncInfo = createElement('div', 'form-group');
    const syncLabel = createElement('label', 'form-label', 'Live Data Sync');
    const syncText = createElement(
      'div',
      'form-helper',
      'Automatically synchronizes real-time arrival predictions every 60 seconds with continuous second-by-second countdown ticks.'
    );
    syncInfo.appendChild(syncLabel);
    syncInfo.appendChild(syncText);

    // 24 Hour Clock
    const timeGroup = createElement('div', 'form-group');
    timeGroup.style.flexDirection = 'row';
    timeGroup.style.alignItems = 'center';
    timeGroup.style.justifyContent = 'space-between';
    const timeLabel = createElement('label', 'form-label', 'Use 24-Hour Time Format');
    timeLabel.style.marginBottom = '0';
    this.timeFormatCheckbox = createElement('input') as HTMLInputElement;
    this.timeFormatCheckbox.type = 'checkbox';
    this.timeFormatCheckbox.style.width = '18px';
    this.timeFormatCheckbox.style.height = '18px';
    timeGroup.appendChild(timeLabel);
    timeGroup.appendChild(this.timeFormatCheckbox);

    // Custom API Endpoint
    const apiGroup = createElement('div', 'form-group');
    const apiLabel = createElement('label', 'form-label', 'Custom Transit-Tracker-API URL (Optional)');
    this.customApiInput = createElement('input', 'form-control') as HTMLInputElement;
    this.customApiInput.type = 'text';
    this.customApiInput.placeholder = 'https://my-transit-api.fly.dev';
    const apiHelper = createElement(
      'span',
      'form-helper',
      'Leave blank to use direct regional OneBusAway data.'
    );
    apiGroup.appendChild(apiLabel);
    apiGroup.appendChild(this.customApiInput);
    apiGroup.appendChild(apiHelper);

    body.appendChild(syncInfo);
    body.appendChild(timeGroup);
    body.appendChild(apiGroup);

    // Footer
    const footer = createElement('div', 'modal-footer');
    const cancelBtn = createElement('button', 'btn-secondary', 'Cancel');
    cancelBtn.onclick = () => this.close();

    const saveBtn = createElement('button', 'btn-primary', 'Save Settings');
    saveBtn.onclick = () => this.save();

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

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
