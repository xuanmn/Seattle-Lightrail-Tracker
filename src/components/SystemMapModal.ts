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
    const newScale = Math.min(2.5, Math.max(0.65, this.currentScale + delta));
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
    // Keyboard Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });

    const body = this.overlay.querySelector('.system-map-body') as HTMLElement;
    if (!body) return;

    // Mouse Drag
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

    // Wheel Zoom
    body.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.12 : -0.12;
        this.zoom(delta);
      },
      { passive: false }
    );

    // Touch Support
    let lastTouchX = 0;
    let lastTouchY = 0;

    body.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    });

    body.addEventListener('touchmove', (e) => {
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
    }, { passive: false });
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'system-map-modal-overlay');
    const container = createElement('div', 'system-map-container');

    // Header
    const header = createElement('div', 'system-map-header');
    const titleGroup = createElement('div', 'system-map-title-group');
    const iconBadge = createElement('div', 'system-map-icon-badge', '🗺️');
    const textGroup = createElement('div', 'system-map-text');
    const title = createElement('h3', 'system-map-title', 'Link Light Rail System Map');
    const subtitle = createElement(
      'div',
      'system-map-subtitle',
      'Sound Transit 1 Line (Lynnwood ⇄ Angle Lake) & 2 Line (Seattle ⇄ Redmond)'
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

    // Floating Controls
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
    this.canvasEl.innerHTML = this.generateSvgMap();
    body.appendChild(this.canvasEl);
    body.appendChild(controls);

    // Footer with Legend & Official Link
    const footer = createElement('div', 'system-map-footer');
    const legend = createElement('div', 'system-map-legend');

    legend.innerHTML = `
      <div class="map-legend-item">
        <span class="map-legend-line-sample line-1"></span>
        <span><strong>1 Line</strong> (Green)</span>
      </div>
      <div class="map-legend-item">
        <span class="map-legend-line-sample line-2"></span>
        <span><strong>2 Line</strong> (Blue)</span>
      </div>
      <div class="map-legend-item">
        <span class="map-legend-transfer-sample"></span>
        <span>Transfer Station</span>
      </div>
      <div class="map-legend-item">
        <span>✈️ SeaTac Airport</span>
      </div>
      <div class="map-legend-item">
        <span>🚆 Amtrak / Sounder</span>
      </div>
    `;

    const officialLink = createElement(
      'a',
      'map-official-link',
      `Official Sound Transit Stations ↗`
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

  private generateSvgMap(): string {
    return `
      <svg class="system-map-svg" viewBox="0 0 950 960" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.08)" />
            <stop offset="100%" stop-color="rgba(14, 165, 233, 0.03)" />
          </linearGradient>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Geographic Waterways -->
        <!-- Puget Sound -->
        <path class="map-water-area" d="M 0,0 L 150,0 Q 170,300 130,500 T 150,960 L 0,960 Z" />
        <text x="35" y="470" class="map-water-label">Puget Sound</text>

        <!-- Lake Washington -->
        <path class="map-water-area" d="M 390,180 Q 420,380 400,560 Q 380,680 430,820 L 480,820 Q 460,680 480,560 Q 520,380 470,180 Z" />
        <text x="415" y="430" class="map-water-label" transform="rotate(75 415,430)">Lake Washington</text>

        <!-- I-90 Bridge Label -->
        <text x="375" y="555" fill="rgba(255,255,255,0.4)" font-size="8.5" font-weight="600">I-90 Lake Washington Bridge</text>

        <!-- ================= TRACKS ================= -->

        <!-- 1 Line Glow & Main Track (Lynnwood -> Angle Lake) -->
        <path class="map-track-path line-1-glow map-elem-line-1"
          d="M 290,60 L 290,220 Q 290,260 260,300 L 230,360 Q 210,410 210,460 L 210,570 Q 210,610 230,640 L 270,700 L 270,810 Q 270,850 240,875 L 240,920" />
        <path class="map-track-path line-1-main map-elem-line-1"
          d="M 290,60 L 290,220 Q 290,260 260,300 L 230,360 Q 210,410 210,460 L 210,570 Q 210,610 230,640 L 270,700 L 270,810 Q 270,850 240,875 L 240,920" />

        <!-- 2 Line Glow & Main Track (Lynnwood -> Seattle Tunnel -> Cross Lake -> Redmond) -->
        <!-- Shared tunnel overlay segment -->
        <path class="map-track-path line-2-glow map-elem-line-2 map-elem-shared"
          d="M 290,60 L 290,220 Q 290,260 260,300 L 230,360 Q 210,410 210,460 L 210,570" />
        
        <!-- 2 Line Eastside Branch -->
        <path class="map-track-path line-2-glow map-elem-line-2"
          d="M 210,570 L 320,570 L 430,570 L 530,570 Q 560,570 580,540 L 610,490 Q 630,450 660,420 L 730,340 Q 760,300 780,260 L 820,200" />
        <path class="map-track-path line-2-main map-elem-line-2"
          d="M 210,570 L 320,570 L 430,570 L 530,570 Q 560,570 580,540 L 610,490 Q 630,450 660,420 L 730,340 Q 760,300 780,260 L 820,200" />

        <!-- ================= STATIONS ================= -->

        <!-- Shared Line 1 & Line 2 North Stations -->
        ${this.renderStation('lynnwood-city-center', 290, 60, 'Lynnwood City Center', '1 Line & 2 Line Terminus', 'right', true, 'both')}
        ${this.renderStation('mountlake-terrace', 290, 100, 'Mountlake Terrace', '', 'right', false, 'both')}
        ${this.renderStation('shoreline-north-185th', 290, 140, 'Shoreline North/185th', '', 'right', false, 'both')}
        ${this.renderStation('shoreline-south-148th', 290, 180, 'Shoreline South/148th', '', 'right', false, 'both')}
        ${this.renderStation('northgate', 290, 220, 'Northgate', '', 'right', false, 'both')}
        ${this.renderStation('roosevelt', 270, 280, 'Roosevelt', '', 'left', false, 'both')}
        ${this.renderStation('u-district', 245, 330, 'U District', '', 'left', false, 'both')}
        ${this.renderStation('university-of-washington', 225, 380, 'University of Washington', 'Husky Stadium', 'left', false, 'both')}
        ${this.renderStation('capitol-hill', 210, 425, 'Capitol Hill', '', 'left', false, 'both')}

        <!-- Downtown Seattle Shared Tunnel Interchanges -->
        ${this.renderTransferStation('westlake', 210, 465, 'Westlake', 'Downtown Seattle / Monorail', 'left')}
        ${this.renderTransferStation('symphony', 210, 500, 'Symphony', 'University Street', 'left')}
        ${this.renderTransferStation('pioneer-square', 210, 535, 'Pioneer Square', 'Ferries / Colman Dock', 'left')}
        ${this.renderTransferStation('international-district-chinatown', 210, 570, 'Intl. District / Chinatown', '1 Line ⇄ 2 Line Transfer • Sounder 🚆', 'left', true)}

        <!-- 2 Line Eastside Stations -->
        ${this.renderStation('judkins-park', 320, 570, 'Judkins Park', '', 'top', false, 'line-2')}
        ${this.renderStation('mercer-island', 430, 570, 'Mercer Island', '', 'top', false, 'line-2')}
        ${this.renderStation('south-bellevue', 530, 570, 'South Bellevue', 'Park & Ride', 'bottom', true, 'line-2')}
        ${this.renderStation('east-main', 580, 540, 'East Main', '', 'right', false, 'line-2')}
        ${this.renderStation('bellevue-downtown', 610, 490, 'Bellevue Downtown', 'Transit Center', 'right', true, 'line-2')}
        ${this.renderStation('wilburton', 635, 455, 'Wilburton', '', 'right', false, 'line-2')}
        ${this.renderStation('spring-district', 660, 420, 'Spring District', '', 'right', false, 'line-2')}
        ${this.renderStation('bel-red', 695, 380, 'BelRed', '130th Station', 'right', false, 'line-2')}
        ${this.renderStation('overlake-village', 730, 340, 'Overlake Village', '', 'right', false, 'line-2')}
        ${this.renderStation('redmond-technology', 760, 300, 'Redmond Technology', 'Microsoft Campus', 'right', false, 'line-2')}
        ${this.renderStation('marymoor-village', 790, 250, 'Marymoor Village', '', 'right', false, 'line-2')}
        ${this.renderStation('downtown-redmond', 820, 200, 'Downtown Redmond', '2 Line East Terminus', 'right', true, 'line-2')}

        <!-- 1 Line South Stations -->
        ${this.renderStation('stadium', 210, 610, 'Stadium', 'Lumen Field / T-Mobile Park', 'left', false, 'line-1')}
        ${this.renderStation('sodo', 225, 640, 'SODO', '', 'left', false, 'line-1')}
        ${this.renderStation('beacon-hill', 250, 675, 'Beacon Hill', 'Tunnel Station', 'right', false, 'line-1')}
        ${this.renderStation('mount-baker', 270, 710, 'Mount Baker', 'Transit Center', 'right', false, 'line-1')}
        ${this.renderStation('columbia-city', 270, 745, 'Columbia City', '', 'right', false, 'line-1')}
        ${this.renderStation('othello', 270, 780, 'Othello', '', 'right', false, 'line-1')}
        ${this.renderStation('rainier-beach', 270, 815, 'Rainier Beach', '', 'right', false, 'line-1')}
        ${this.renderStation('tukwila-intl-blvd', 250, 855, 'Tukwila Intl. Blvd.', 'Park & Ride', 'right', false, 'line-1')}
        ${this.renderStation('seatac-airport', 240, 890, 'SeaTac / Airport', '✈️ Main Terminal Link', 'right', true, 'line-1')}
        ${this.renderStation('angle-lake', 240, 925, 'Angle Lake', '1 Line South Terminus', 'right', true, 'line-1')}
      </svg>
    `;
  }

  private renderStation(
    id: string,
    x: number,
    y: number,
    name: string,
    sub: string,
    labelPos: 'left' | 'right' | 'top' | 'bottom',
    isTerminus: boolean = false,
    line: 'line-1' | 'line-2' | 'both' = 'both'
  ): string {
    const lineClass =
      line === 'both'
        ? 'map-elem-line-1 map-elem-line-2 map-elem-shared'
        : line === 'line-1'
        ? 'map-elem-line-1'
        : 'map-elem-line-2';

    const strokeColor = line === 'line-2' ? '#0072CE' : '#008542';
    const r = isTerminus ? 6 : 4.5;

    let textX = x;
    let textY = y;
    let textAnchor = 'start';

    if (labelPos === 'right') {
      textX = x + 12;
      textY = y + 4;
      textAnchor = 'start';
    } else if (labelPos === 'left') {
      textX = x - 12;
      textY = y + 4;
      textAnchor = 'end';
    } else if (labelPos === 'top') {
      textX = x;
      textY = y - 10;
      textAnchor = 'middle';
    } else if (labelPos === 'bottom') {
      textX = x;
      textY = y + 16;
      textAnchor = 'middle';
    }

    return `
      <g class="map-station-node ${lineClass}" id="map-node-${id}">
        <circle class="map-station-circle" cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="${strokeColor}" />
        <text class="map-station-label" x="${textX}" y="${textY}" text-anchor="${textAnchor}">${name}</text>
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${textY + 11}" text-anchor="${textAnchor}">${sub}</text>` : ''}
      </g>
    `;
  }

  private renderTransferStation(
    id: string,
    x: number,
    y: number,
    name: string,
    sub: string,
    labelPos: 'left' | 'right' = 'left',
    isHub: boolean = false
  ): string {
    const textX = labelPos === 'left' ? x - 15 : x + 15;
    const textAnchor = labelPos === 'left' ? 'end' : 'start';

    return `
      <g class="map-station-node map-elem-line-1 map-elem-line-2 map-elem-shared" id="map-node-${id}">
        <rect class="map-transfer-pill" x="${x - 7}" y="${y - 5}" width="14" height="10" rx="5" />
        ${isHub ? `<circle cx="${x}" cy="${y}" r="2" fill="#008542" />` : ''}
        <text class="map-station-label" x="${textX}" y="${y + 4}" text-anchor="${textAnchor}">${name}</text>
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${y + 13}" text-anchor="${textAnchor}">${sub}</text>` : ''}
      </g>
    `;
  }
}
