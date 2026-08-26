import { describe, it, expect, beforeEach } from 'vitest';
import { SystemMapModal } from '../src/components/SystemMapModal';

describe('SystemMapModal Component', () => {
  let modal: SystemMapModal;

  beforeEach(() => {
    document.body.innerHTML = '';
    modal = new SystemMapModal();
  });

  it('renders modal overlay into document body with map elements', () => {
    const overlay = document.querySelector('.system-map-modal-overlay');
    expect(overlay).not.toBeNull();
    const svg = overlay?.querySelector('svg.system-map-svg');
    expect(svg).not.toBeNull();
  });

  it('opens and closes modal using open/close methods', () => {
    const overlay = document.querySelector('.system-map-modal-overlay') as HTMLElement;
    expect(overlay.classList.contains('open')).toBe(false);

    modal.open();
    expect(overlay.classList.contains('open')).toBe(true);

    modal.close();
    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('contains floating zoom controls', () => {
    const zoomBtns = document.querySelectorAll('.map-zoom-btn');
    expect(zoomBtns.length).toBeGreaterThanOrEqual(3); // Zoom in, zoom out, reset
  });

  it('renders station nodes and line tracks within SVG', () => {
    const svg = document.querySelector('svg.system-map-svg');
    const tracks = svg?.querySelectorAll('.map-track-path');
    expect(tracks?.length).toBeGreaterThanOrEqual(2);

    const stationNodes = svg?.querySelectorAll('.map-station-node');
    expect(stationNodes?.length).toBeGreaterThanOrEqual(20);
  });
});
