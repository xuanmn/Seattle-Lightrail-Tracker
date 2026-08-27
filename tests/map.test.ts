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

  it('renders a naturally scrollable map body without floating zoom controls', () => {
    const mapBody = document.querySelector('.system-map-body');
    expect(mapBody).not.toBeNull();

    const zoomBtns = document.querySelectorAll('.map-zoom-btn');
    expect(zoomBtns.length).toBe(0);
  });

  it('renders header legend with line definitions and official directory link', () => {
    const headerLegend = document.querySelector('.system-map-header-legend');
    expect(headerLegend).not.toBeNull();
    expect(headerLegend?.textContent).toContain('1 Line');
    expect(headerLegend?.textContent).toContain('2 Line');

    const officialLink = headerLegend?.querySelector('a.map-official-link');
    expect(officialLink).not.toBeNull();
    expect(officialLink?.getAttribute('href')).toContain('soundtransit.org');
  });

  it('renders station nodes including new Federal Way extension stations within SVG', () => {
    const svg = document.querySelector('svg.system-map-svg');
    const tracks = svg?.querySelectorAll('.map-track-path');
    expect(tracks?.length).toBeGreaterThanOrEqual(2);

    const stationNodes = svg?.querySelectorAll('.map-station-node');
    expect(stationNodes?.length).toBeGreaterThanOrEqual(23);

    expect(svg?.querySelector('#map-node-kent-des-moines')).not.toBeNull();
    expect(svg?.querySelector('#map-node-star-lake')).not.toBeNull();
    expect(svg?.querySelector('#map-node-federal-way-downtown')).not.toBeNull();
  });

  it('renders highlighted 1 Line and 2 Line transfer hub at Chinatown station', () => {
    const svg = document.querySelector('svg.system-map-svg');
    const chinatownNode = svg?.querySelector('#map-node-international-district-chinatown');
    expect(chinatownNode).not.toBeNull();
    expect(chinatownNode?.classList.contains('map-transfer-hub-node')).toBe(true);
    expect(chinatownNode?.textContent).toContain('TRANSFER');
  });

  it('renders I-90 Trail sublabels on Judkins Park and Mercer Island stations', () => {
    const svg = document.querySelector('svg.system-map-svg');
    const judkinsNode = svg?.querySelector('#map-node-judkins-park');
    expect(judkinsNode).not.toBeNull();
    expect(judkinsNode?.textContent).toContain('Judkins Park');
    expect(judkinsNode?.textContent).toContain('I-90 Trail');

    const mercerNode = svg?.querySelector('#map-node-mercer-island');
    expect(mercerNode).not.toBeNull();
    expect(mercerNode?.textContent).toContain('Mercer Island');
    expect(mercerNode?.textContent).toContain('I-90 Trail');
  });
});
