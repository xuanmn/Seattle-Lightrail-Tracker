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

  it('contains line highlight filter controls and zoom controls', () => {
    const filterButtons = document.querySelectorAll('.map-filter-btn');
    expect(filterButtons.length).toBeGreaterThanOrEqual(3); // All, 1 Line, 2 Line

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

  it('updates active line filter and dims non-selected elements', () => {
    expect(modal.getActiveFilter()).toBe('all');

    modal.setLineFilter('line-1');
    expect(modal.getActiveFilter()).toBe('line-1');

    const dimmedL2 = document.querySelectorAll('.map-elem-line-2.dimmed');
    expect(dimmedL2.length).toBeGreaterThan(0);

    modal.setLineFilter('line-2');
    expect(modal.getActiveFilter()).toBe('line-2');

    modal.setLineFilter('all');
    expect(modal.getActiveFilter()).toBe('all');
    const dimmedAll = document.querySelectorAll('.dimmed');
    expect(dimmedAll.length).toBe(0);
  });
});
