import { createElement, ICONS } from '../utils/dom';

export class SystemMapModal {
  private overlay: HTMLElement;
  private canvasEl!: HTMLElement;
  private currentScale: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private activeFilter: 'all' | 'line-1' | 'line-2' = 'all';

  constructor() {
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
    this.setupEventListeners();
  }

  public open() {
    this.overlay.classList.add('open');
    this.resetView();
  }

  public close() {
    this.overlay.classList.remove('open');
  }

  public getActiveFilter(): 'all' | 'line-1' | 'line-2' {
    return this.activeFilter;
  }

  public setLineFilter(filter: 'all' | 'line-1' | 'line-2') {
    this.setFilter(filter);
  }

  private resetView() {
    this.currentScale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  }

  private zoom(delta: number) {
    const newScale = Math.min(2.5, Math.max(0.6, this.currentScale + delta));
    this.currentScale = newScale;
    this.updateTransform();
  }

  private updateTransform() {
    if (this.canvasEl) {
      this.canvasEl.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.currentScale})`;
    }
  }

  private setFilter(filter: 'all' | 'line-1' | 'line-2') {
    this.activeFilter = filter;

    const allBtn = this.overlay.querySelector('#map-filter-all');
    const l1Btn = this.overlay.querySelector('#map-filter-line1');
    const l2Btn = this.overlay.querySelector('#map-filter-line2');

    allBtn?.classList.toggle('active', filter === 'all');
    l1Btn?.classList.toggle('active', filter === 'line-1');
    l2Btn?.classList.toggle('active', filter === 'line-2');

    const l1Elements = this.overlay.querySelectorAll('.map-elem-line-1');
    const l2Elements = this.overlay.querySelectorAll('.map-elem-line-2');

    if (filter === 'all') {
      l1Elements.forEach((el) => el.classList.remove('dimmed'));
      l2Elements.forEach((el) => el.classList.remove('dimmed'));
    } else if (filter === 'line-1') {
      l1Elements.forEach((el) => el.classList.remove('dimmed'));
      l2Elements.forEach((el) => {
        if (!el.classList.contains('map-elem-shared')) {
          el.classList.add('dimmed');
        } else {
          el.classList.remove('dimmed');
        }
      });
    } else if (filter === 'line-2') {
      l2Elements.forEach((el) => el.classList.remove('dimmed'));
      l1Elements.forEach((el) => {
        if (!el.classList.contains('map-elem-shared')) {
          el.classList.add('dimmed');
        } else {
          el.classList.remove('dimmed');
        }
      });
    }
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });

    const body = this.overlay.querySelector('.system-map-body') as HTMLElement;
    if (!body) return;

    body.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.map-floating-controls')) return;
      this.isDragging = true;
      this.startX = e.clientX - this.panX;
      this.startY = e.clientY - this.panY;
      body.classList.add('panning');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.startX;
      this.panY = e.clientY - this.startY;
      this.updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        body.classList.remove('panning');
      }
    });

    body.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.12 : -0.12;
        this.zoom(delta);
      },
      { passive: false }
    );

    let lastTouchX = 0;
    let lastTouchY = 0;

    body.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    });

    body.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 1) {
          e.preventDefault();
          const touchX = e.touches[0].clientX;
          const touchY = e.touches[0].clientY;
          this.panX += touchX - lastTouchX;
          this.panY += touchY - lastTouchY;
          lastTouchX = touchX;
          lastTouchY = touchY;
          this.updateTransform();
        }
      },
      { passive: false }
    );
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'system-map-modal-overlay');
    const container = createElement('div', 'system-map-container');

    // Header
    const header = createElement('div', 'system-map-header');
    const titleGroup = createElement('div', 'system-map-title-group');
    const iconBadge = createElement('div', 'system-map-icon-badge', '🚊');
    const textGroup = createElement('div', 'system-map-text');
    const title = createElement('h3', 'system-map-title', 'Sound Transit Link System Map');
    const subtitle = createElement(
      'div',
      'system-map-subtitle',
      'Official schematic line diagram • 1 Line (Green) & 2 Line (Blue)'
    );
    textGroup.appendChild(title);
    textGroup.appendChild(subtitle);
    titleGroup.appendChild(iconBadge);
    titleGroup.appendChild(textGroup);

    const actions = createElement('div', 'system-map-header-actions');

    // Filter Group
    const filterGroup = createElement('div', 'map-filter-group');
    const allBtn = createElement('button', 'map-filter-btn active', 'All Lines');
    allBtn.id = 'map-filter-all';
    allBtn.onclick = () => this.setFilter('all');

    const l1Btn = createElement(
      'button',
      'map-filter-btn line-1-btn',
      `<span class="map-filter-pill-dot green"></span> 1 Line`
    );
    l1Btn.id = 'map-filter-line1';
    l1Btn.onclick = () => this.setFilter('line-1');

    const l2Btn = createElement(
      'button',
      'map-filter-btn line-2-btn',
      `<span class="map-filter-pill-dot blue"></span> 2 Line`
    );
    l2Btn.id = 'map-filter-line2';
    l2Btn.onclick = () => this.setFilter('line-2');

    filterGroup.appendChild(allBtn);
    filterGroup.appendChild(l1Btn);
    filterGroup.appendChild(l2Btn);

    const closeBtn = createElement('button', 'icon-btn', ICONS.close);
    closeBtn.title = 'Close System Map';
    closeBtn.onclick = () => this.close();

    actions.appendChild(filterGroup);
    actions.appendChild(closeBtn);

    header.appendChild(titleGroup);
    header.appendChild(actions);

    // Map Viewport Body
    const body = createElement('div', 'system-map-body');

    // Floating Zoom Controls
    const controls = createElement('div', 'map-floating-controls');
    const zoomInBtn = createElement('button', 'map-zoom-btn', '+');
    zoomInBtn.title = 'Zoom In';
    zoomInBtn.onclick = () => this.zoom(0.2);

    const zoomOutBtn = createElement('button', 'map-zoom-btn', '−');
    zoomOutBtn.title = 'Zoom Out';
    zoomOutBtn.onclick = () => this.zoom(-0.2);

    const resetBtn = createElement('button', 'map-zoom-btn', '⟲');
    resetBtn.title = 'Reset Map View';
    resetBtn.onclick = () => this.resetView();

    controls.appendChild(zoomInBtn);
    controls.appendChild(zoomOutBtn);
    controls.appendChild(resetBtn);

    // SVG Canvas
    this.canvasEl = createElement('div', 'map-svg-canvas');
    this.canvasEl.innerHTML = this.generateOfficialSchematicSvg();
    body.appendChild(this.canvasEl);
    body.appendChild(controls);

    // Footer with Legend & Official Link
    const footer = createElement('div', 'system-map-footer');
    const legend = createElement('div', 'system-map-legend');

    legend.innerHTML = `
      <div class="map-legend-item">
        <span class="map-legend-line-sample line-1"></span>
        <span><strong>1 Line</strong> (Lynnwood ⇄ Angle Lake)</span>
      </div>
      <div class="map-legend-item">
        <span class="map-legend-line-sample line-2"></span>
        <span><strong>2 Line</strong> (Lynnwood / Seattle ⇄ Downtown Redmond)</span>
      </div>
      <div class="map-legend-item">
        <span class="map-legend-transfer-sample"></span>
        <span>Transfer Station</span>
      </div>
      <div class="map-legend-item">
        <span>✈️ Airport</span>
      </div>
      <div class="map-legend-item">
        <span>🚆 Sounder / Amtrak</span>
      </div>
      <div class="map-legend-item">
        <span>⛴️ WA State Ferries</span>
      </div>
    `;

    const officialLink = createElement(
      'a',
      'map-official-link',
      `Sound Transit Stations Directory ↗`
    ) as HTMLAnchorElement;
    officialLink.href = 'https://www.soundtransit.org/ride-with-us/stations/link-light-rail-stations';
    officialLink.target = '_blank';
    officialLink.rel = 'noopener noreferrer';

    footer.appendChild(legend);
    footer.appendChild(officialLink);

    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(footer);
    overlay.appendChild(container);

    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    return overlay;
  }

  private generateOfficialSchematicSvg(): string {
    return `
      <svg class="system-map-svg" viewBox="0 0 830 1140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="track-glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="track-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Background grid -->
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.025)" stroke-width="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- ================= TRACK LINES ================= -->

        <!-- 1 Line Track (Green #008542) -->
        <path class="map-track-path line-1-glow map-elem-line-1"
          d="M 272,75 L 272,1075" stroke="#008542" stroke-width="14" opacity="0.3" filter="url(#track-glow-green)" />
        <path class="map-track-path line-1-main map-elem-line-1"
          d="M 272,75 L 272,1075" stroke="#008542" stroke-width="9" stroke-linecap="round" fill="none" />

        <!-- 2 Line Track (Blue #0072CE) - Shared in North/Tunnel + Eastside Corridor -->
        <path class="map-track-path line-2-glow map-elem-line-2 map-elem-shared"
          d="M 298,75 L 298,615 Q 298,665 338,665 L 500,665 Q 540,665 540,635 L 540,75"
          stroke="#0072CE" stroke-width="14" opacity="0.3" filter="url(#track-glow-blue)" />
        <path class="map-track-path line-2-main map-elem-line-2 map-elem-shared"
          d="M 298,75 L 298,615 Q 298,665 338,665 L 500,665 Q 540,665 540,635 L 540,75"
          stroke="#0072CE" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />

        <!-- ================= TERMINUS HEADERS & BULLETS ================= -->

        <!-- North Terminus (Lynnwood City Center) -->
        <g class="map-terminus-badge map-elem-line-1 map-elem-line-2" transform="translate(285, 42)">
          <rect x="-42" y="-16" width="84" height="26" rx="13" fill="#0f172a" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" />
          <circle cx="-13" cy="-3" r="9" fill="#008542" />
          <text x="-13" y="0.5" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">1</text>
          <circle cx="13" cy="-3" r="9" fill="#0072CE" />
          <text x="13" y="0.5" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">2</text>
        </g>

        <!-- 2 Line East Terminus (Downtown Redmond) -->
        <g class="map-terminus-badge map-elem-line-2" transform="translate(540, 42)">
          <rect x="-24" y="-16" width="48" height="26" rx="13" fill="#0f172a" stroke="rgba(0,114,206,0.6)" stroke-width="1.5" />
          <circle cx="0" cy="-3" r="9" fill="#0072CE" />
          <text x="0" y="0.5" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">2</text>
        </g>

        <!-- 1 Line South Terminus (Angle Lake) -->
        <g class="map-terminus-badge map-elem-line-1" transform="translate(272, 1105)">
          <rect x="-24" y="-13" width="48" height="24" rx="12" fill="#0f172a" stroke="rgba(0,133,66,0.6)" stroke-width="1.5" />
          <circle cx="0" cy="-1" r="9" fill="#008542" />
          <text x="0" y="2.5" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">1</text>
        </g>

        <!-- ================= LEFT SPINE: SHARED 1 LINE & 2 LINE STATIONS ================= -->
        ${this.renderDualCapsuleStation('lynnwood-city-center', 285, 75, 'Lynnwood City Center', '1 Line & 2 Line North Terminus', 'left', true)}
        ${this.renderDualCapsuleStation('mountlake-terrace', 285, 120, 'Mountlake Terrace', 'Park & Ride', 'left')}
        ${this.renderDualCapsuleStation('shoreline-north-185th', 285, 165, 'Shoreline North/185th', '', 'left')}
        ${this.renderDualCapsuleStation('shoreline-south-148th', 285, 210, 'Shoreline South/148th', '', 'left')}
        ${this.renderDualCapsuleStation('northgate', 285, 255, 'Northgate', 'Kraken Community Iceplex', 'left')}
        ${this.renderDualCapsuleStation('roosevelt', 285, 300, 'Roosevelt', '', 'left')}
        ${this.renderDualCapsuleStation('u-district', 285, 345, 'U District', 'UW Tower / The Ave', 'left')}
        ${this.renderDualCapsuleStation('university-of-washington', 285, 390, 'University of Washington', 'Husky Stadium / UW Medical', 'left')}
        ${this.renderDualCapsuleStation('capitol-hill', 285, 435, 'Capitol Hill', 'Broadway / First Hill Streetcar', 'left')}

        <!-- Downtown Seattle Transit Tunnel Stations -->
        ${this.renderDualCapsuleStation('westlake', 285, 480, 'Westlake', 'Seattle Center Monorail 🚝', 'left')}
        ${this.renderDualCapsuleStation('symphony', 285, 525, 'Symphony', 'University Street / Benaroya Hall', 'left')}
        ${this.renderDualCapsuleStation('pioneer-square', 285, 570, 'Pioneer Square', 'WA State Ferries ⛴️ / Streetcar', 'left')}
        ${this.renderDualCapsuleStation('international-district-chinatown', 285, 615, 'Intl. District / Chinatown', '1 Line ⇄ 2 Line Transfer • Sounder 🚆 • Amtrak 🚆', 'left', true)}

        <!-- ================= LEFT SPINE: 1 LINE SOUTH STATIONS ================= -->
        ${this.renderLine1Station('stadium', 272, 665, 'Stadium', 'Lumen Field / T-Mobile Park', 'left')}
        ${this.renderLine1Station('sodo', 272, 710, 'SODO', 'Busway', 'left')}
        ${this.renderLine1Station('beacon-hill', 272, 755, 'Beacon Hill', 'Tunnel Station', 'left')}
        ${this.renderLine1Station('mount-baker', 272, 800, 'Mount Baker', 'Transit Center 🚌', 'left')}
        ${this.renderLine1Station('columbia-city', 272, 845, 'Columbia City', 'Historic District', 'left')}
        ${this.renderLine1Station('othello', 272, 890, 'Othello', '', 'left')}
        ${this.renderLine1Station('rainier-beach', 272, 935, 'Rainier Beach', '', 'left')}
        ${this.renderLine1Station('tukwila-intl-blvd', 272, 980, 'Tukwila Intl. Blvd.', 'Park & Ride', 'left')}
        ${this.renderAirportStation('seatac-airport', 272, 1025, 'SeaTac / Airport', "Seattle-Tacoma Int'l Airport ✈️", 'left')}
        ${this.renderLine1Station('angle-lake', 272, 1070, 'Angle Lake', '1 Line South Terminus', 'left', true)}

        <!-- ================= CONNECTING SEGMENT (I-90 CORRIDOR) ================= -->
        ${this.renderLine2Station('judkins-park', 365, 665, 'Judkins Park', 'Rainier Ave S', 'bottom')}
        ${this.renderLine2Station('mercer-island', 475, 665, 'Mercer Island', 'I-90 Park & Ride', 'bottom')}

        <!-- ================= RIGHT SPINE: 2 LINE EASTSIDE STATIONS ================= -->
        ${this.renderLine2Station('south-bellevue', 540, 635, 'South Bellevue', 'Park & Ride / Mercer Slough', 'right', true)}
        ${this.renderLine2Station('east-main', 540, 571, 'East Main', '', 'right')}
        ${this.renderLine2Station('bellevue-downtown', 540, 509, 'Bellevue Downtown', 'Bellevue Transit Center 🚌', 'right', true)}
        ${this.renderLine2Station('wilburton', 540, 447, 'Wilburton', 'Overlake Medical Center', 'right')}
        ${this.renderLine2Station('spring-district', 540, 385, 'Spring District', '120th Station', 'right')}
        ${this.renderLine2Station('bel-red', 540, 323, 'BelRed', '130th Station', 'right')}
        ${this.renderLine2Station('overlake-village', 540, 261, 'Overlake Village', '', 'right')}
        ${this.renderLine2Station('redmond-technology', 540, 199, 'Redmond Technology', 'Microsoft Campus / Transit Center 🚌', 'right', true)}
        ${this.renderLine2Station('marymoor-village', 540, 137, 'Marymoor Village', 'Park & Ride', 'right')}
        ${this.renderLine2Station('downtown-redmond', 540, 75, 'Downtown Redmond', '2 Line East Terminus', 'right', true)}
      </svg>
    `;
  }

  private renderDualCapsuleStation(
    id: string,
    x: number,
    y: number,
    name: string,
    sub: string,
    labelPos: 'left' | 'right' = 'left',
    isTerminus: boolean = false
  ): string {
    const textX = labelPos === 'left' ? x - 26 : x + 26;
    const textAnchor = labelPos === 'left' ? 'end' : 'start';
    const r = isTerminus ? 5.5 : 4.8;

    return `
      <g class="map-station-node map-elem-line-1 map-elem-line-2 map-elem-shared" id="map-node-${id}">
        <!-- Two distinct circles centered on each parallel line with ample separation -->
        <circle class="map-station-circle" cx="${x - 13}" cy="${y}" r="${r}" fill="#ffffff" stroke="#008542" stroke-width="2.5" />
        <circle class="map-station-circle" cx="${x + 13}" cy="${y}" r="${r}" fill="#ffffff" stroke="#0072CE" stroke-width="2.5" />
        <text class="map-station-label" x="${textX}" y="${y + 4.5}" text-anchor="${textAnchor}">${name}</text>
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${y + 15}" text-anchor="${textAnchor}">${sub}</text>` : ''}
      </g>
    `;
  }


  private renderLine1Station(
    id: string,
    x: number,
    y: number,
    name: string,
    sub: string,
    labelPos: 'left' | 'right' = 'left',
    isTerminus: boolean = false
  ): string {
    const textX = labelPos === 'left' ? x - 18 : x + 18;
    const textAnchor = labelPos === 'left' ? 'end' : 'start';
    const r = isTerminus ? 7 : 5.5;

    return `
      <g class="map-station-node map-elem-line-1" id="map-node-${id}">
        <circle class="map-station-circle" cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#008542" stroke-width="3" />
        <text class="map-station-label" x="${textX}" y="${y + 4.5}" text-anchor="${textAnchor}">${name}</text>
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${y + 15}" text-anchor="${textAnchor}">${sub}</text>` : ''}
      </g>
    `;
  }

  private renderLine2Station(
    id: string,
    x: number,
    y: number,
    name: string,
    sub: string,
    labelPos: 'left' | 'right' | 'bottom' = 'right',
    isMajor: boolean = false
  ): string {
    let textX = x + 18;
    let textY = y + 4.5;
    let textAnchor = 'start';

    if (labelPos === 'bottom') {
      textX = x;
      textY = y + 22;
      textAnchor = 'middle';
    } else if (labelPos === 'left') {
      textX = x - 18;
      textY = y + 4.5;
      textAnchor = 'end';
    }

    const r = isMajor ? 7 : 5.5;

    return `
      <g class="map-station-node map-elem-line-2" id="map-node-${id}">
        <circle class="map-station-circle" cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#0072CE" stroke-width="3" />
        <text class="map-station-label" x="${textX}" y="${textY}" text-anchor="${textAnchor}">${name}</text>
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${textY + (labelPos === 'bottom' ? 10 : 12)}" text-anchor="${textAnchor}">${sub}</text>` : ''}
      </g>
    `;
  }

  private renderAirportStation(
    id: string,
    x: number,
    y: number,
    name: string,
    sub: string,
    labelPos: 'left' | 'right' = 'left'
  ): string {
    const textX = labelPos === 'left' ? x - 22 : x + 22;
    const textAnchor = labelPos === 'left' ? 'end' : 'start';

    return `
      <g class="map-station-node map-elem-line-1" id="map-node-${id}">
        <circle class="map-station-circle" cx="${x}" cy="${y}" r="6" fill="#ffffff" stroke="#008542" stroke-width="3" />
        <rect x="${x - 7}" y="${y - 7}" width="14" height="14" rx="3" fill="#f59e0b" />
        <text x="${x}" y="${y + 3.5}" fill="#0f172a" font-size="9" font-weight="900" text-anchor="middle">✈</text>
        <text class="map-station-label" x="${textX}" y="${y + 4.5}" text-anchor="${textAnchor}">${name}</text>
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${y + 15}" text-anchor="${textAnchor}">${sub}</text>` : ''}
      </g>
    `;
  }
}
