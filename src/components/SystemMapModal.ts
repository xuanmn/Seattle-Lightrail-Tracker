import { createElement, ICONS } from '../utils/dom';

export class SystemMapModal {
  private overlay: HTMLElement;
  private bodyEl!: HTMLElement;
  private canvasEl!: HTMLElement;

  private fitScale: number = 1;
  private minScale: number = 0.5;
  private maxScale: number = 4;
  private currentScale: number = 1;
  private currentX: number = 0;
  private currentY: number = 0;

  private lastTapTime: number = 0;
  private lastTapX: number = 0;
  private lastTapY: number = 0;

  private isMouseDown = false;
  private mouseStartX = 0;
  private mouseStartY = 0;
  private mouseStartTransX = 0;
  private mouseStartTransY = 0;

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
      this.close();
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isMouseDown) return;
    const dx = e.clientX - this.mouseStartX;
    const dy = e.clientY - this.mouseStartY;
    const nextX = this.mouseStartTransX + dx;
    const nextY = this.mouseStartTransY + dy;
    const clamped = this.clampOffsets(nextX, nextY, this.currentScale);
    this.currentX = clamped.x;
    this.currentY = clamped.y;
    this.applyTransform();
  };

  private handleMouseUp = () => {
    if (this.isMouseDown) {
      this.isMouseDown = false;
      this.bodyEl.classList.remove('is-panning');
    }
  };

  private handleResize = () => {
    if (this.overlay.classList.contains('open')) {
      this.fitToScreen();
    }
  };

  constructor() {
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
    this.setupEventListeners();
  }

  public open() {
    this.overlay.classList.add('open');
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.handleResize);

    // Ensure viewport is measured accurately on next frame and after transition
    requestAnimationFrame(() => {
      this.fitToScreen();
    });
    setTimeout(() => {
      this.fitToScreen();
    }, 60);
  }

  public close() {
    this.overlay.classList.remove('open');
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.handleResize);
  }

  public fitToScreen() {
    if (!this.bodyEl) return;
    const w = this.bodyEl.clientWidth || window.innerWidth;
    const h = this.bodyEl.clientHeight || window.innerHeight * 0.75;
    const padding = 16;

    const scaleX = (w - padding * 2) / 830;
    const scaleY = (h - padding * 2) / 1280;
    this.fitScale = Math.min(scaleX, scaleY);
    this.minScale = this.fitScale * 0.85;
    this.maxScale = Math.max(3.0, this.fitScale * 4.5);

    this.currentScale = this.fitScale;
    this.currentX = (w - 830 * this.fitScale) / 2;
    this.currentY = (h - 1280 * this.fitScale) / 2;

    if (this.canvasEl) {
      this.canvasEl.style.transition = 'none';
    }
    this.applyTransform();
  }

  private applyTransform() {
    if (this.canvasEl) {
      this.canvasEl.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0) scale(${this.currentScale})`;
    }
  }

  private clampOffsets(tx: number, ty: number, s: number): { x: number; y: number } {
    const containerW = this.bodyEl.clientWidth;
    const containerH = this.bodyEl.clientHeight;
    const mapW = 830 * s;
    const mapH = 1280 * s;

    let x = tx;
    let y = ty;

    if (mapW <= containerW) {
      x = (containerW - mapW) / 2;
    } else {
      const minX = containerW - mapW - 30;
      const maxX = 30;
      x = Math.min(maxX, Math.max(minX, x));
    }

    if (mapH <= containerH) {
      y = (containerH - mapH) / 2;
    } else {
      const minY = containerH - mapH - 30;
      const maxY = 30;
      y = Math.min(maxY, Math.max(minY, y));
    }

    return { x, y };
  }

  private animateTo(targetScale: number, targetX: number, targetY: number) {
    if (!this.canvasEl) return;
    this.canvasEl.style.transition = 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    this.currentScale = targetScale;
    this.currentX = targetX;
    this.currentY = targetY;
    this.applyTransform();
    setTimeout(() => {
      if (this.canvasEl) this.canvasEl.style.transition = 'none';
    }, 290);
  }

  private handleDoubleTap(clientX: number, clientY: number) {
    const rect = this.bodyEl.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    if (this.currentScale > this.fitScale * 1.3) {
      // Zoom out to fit
      this.animateTo(
        this.fitScale,
        (this.bodyEl.clientWidth - 830 * this.fitScale) / 2,
        (this.bodyEl.clientHeight - 1280 * this.fitScale) / 2
      );
    } else {
      // Zoom in 2.4x
      const targetScale = Math.min(this.maxScale, this.fitScale * 2.4);
      const targetX = px - (px - this.currentX) * (targetScale / this.currentScale);
      const targetY = py - (py - this.currentY) * (targetScale / this.currentScale);
      const clamped = this.clampOffsets(targetX, targetY, targetScale);
      this.animateTo(targetScale, clamped.x, clamped.y);
    }
  }

  private setupEventListeners() {
    if (!this.bodyEl) return;

    let isTouching = false;
    let touchMode: 'none' | 'pan' | 'pinch' = 'none';
    let touchDragStartX = 0;
    let touchDragStartY = 0;
    let touchStartTransX = 0;
    let touchStartTransY = 0;
    let touchStartDist = 0;
    let touchStartScale = 1;
    let touchStartMidX = 0;
    let touchStartMidY = 0;
    let touchStartX0 = 0;
    let touchStartY0 = 0;

    this.bodyEl.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        if (e.touches.length === 1) {
          const t = e.touches[0];
          const rect = this.bodyEl.getBoundingClientRect();
          const tapX = t.clientX - rect.left;
          const tapY = t.clientY - rect.top;
          const now = Date.now();

          if (
            now - this.lastTapTime < 300 &&
            Math.hypot(tapX - this.lastTapX, tapY - this.lastTapY) < 40
          ) {
            this.handleDoubleTap(t.clientX, t.clientY);
            this.lastTapTime = 0;
            return;
          }
          this.lastTapTime = now;
          this.lastTapX = tapX;
          this.lastTapY = tapY;

          isTouching = true;
          touchMode = 'pan';
          touchDragStartX = t.clientX;
          touchDragStartY = t.clientY;
          touchStartTransX = this.currentX;
          touchStartTransY = this.currentY;
          if (this.canvasEl) this.canvasEl.style.transition = 'none';
        } else if (e.touches.length === 2) {
          isTouching = true;
          touchMode = 'pinch';
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          touchStartDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
          touchStartScale = this.currentScale;
          const rect = this.bodyEl.getBoundingClientRect();
          touchStartMidX = (t1.clientX + t2.clientX) / 2 - rect.left;
          touchStartMidY = (t1.clientY + t2.clientY) / 2 - rect.top;
          touchStartX0 = this.currentX;
          touchStartY0 = this.currentY;
          if (this.canvasEl) this.canvasEl.style.transition = 'none';
        }
      },
      { passive: false }
    );

    this.bodyEl.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (!isTouching) return;
        e.preventDefault();

        if (e.touches.length === 1 && touchMode === 'pan') {
          const t = e.touches[0];
          const dx = t.clientX - touchDragStartX;
          const dy = t.clientY - touchDragStartY;
          const nextX = touchStartTransX + dx;
          const nextY = touchStartTransY + dy;
          const clamped = this.clampOffsets(nextX, nextY, this.currentScale);
          this.currentX = clamped.x;
          this.currentY = clamped.y;
          this.applyTransform();
        } else if (e.touches.length === 2 && touchMode === 'pinch') {
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
          if (touchStartDist > 0) {
            const factor = dist / touchStartDist;
            const newScale = Math.min(
              this.maxScale,
              Math.max(this.minScale, touchStartScale * factor)
            );
            const scaleChange = newScale / touchStartScale;
            const nextX = touchStartMidX - (touchStartMidX - touchStartX0) * scaleChange;
            const nextY = touchStartMidY - (touchStartMidY - touchStartY0) * scaleChange;
            const clamped = this.clampOffsets(nextX, nextY, newScale);
            this.currentScale = newScale;
            this.currentX = clamped.x;
            this.currentY = clamped.y;
            this.applyTransform();
          }
        }
      },
      { passive: false }
    );

    const endTouch = () => {
      isTouching = false;
      touchMode = 'none';
      if (this.currentScale < this.fitScale) {
        this.animateTo(
          this.fitScale,
          (this.bodyEl.clientWidth - 830 * this.fitScale) / 2,
          (this.bodyEl.clientHeight - 1280 * this.fitScale) / 2
        );
      }
    };

    this.bodyEl.addEventListener('touchend', endTouch);
    this.bodyEl.addEventListener('touchcancel', endTouch);

    // Desktop Mouse Controls
    this.bodyEl.addEventListener('mousedown', (e: MouseEvent) => {
      this.isMouseDown = true;
      this.mouseStartX = e.clientX;
      this.mouseStartY = e.clientY;
      this.mouseStartTransX = this.currentX;
      this.mouseStartTransY = this.currentY;
      this.bodyEl.classList.add('is-panning');
      if (this.canvasEl) this.canvasEl.style.transition = 'none';
    });

    this.bodyEl.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault();
        const rect = this.bodyEl.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 1.14 : 0.88;
        const newScale = Math.min(
          this.maxScale,
          Math.max(this.fitScale * 0.9, this.currentScale * factor)
        );
        const nextX = px - (px - this.currentX) * (newScale / this.currentScale);
        const nextY = py - (py - this.currentY) * (newScale / this.currentScale);
        const clamped = this.clampOffsets(nextX, nextY, newScale);
        this.currentScale = newScale;
        this.currentX = clamped.x;
        this.currentY = clamped.y;
        this.applyTransform();
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
    const iconBadge = createElement('div', 'system-map-icon-badge', ICONS.train);
    const textGroup = createElement('div', 'system-map-text');
    const title = createElement('h3', 'system-map-title', 'Sound Transit Link Map');

    const headerLegend = createElement('div', 'system-map-header-legend');
    headerLegend.innerHTML = `
      <div class="map-legend-item">
        <span class="map-legend-line-sample line-1"></span>
        <span><strong>1 Line</strong> (Lynnwood ⇄ Federal Way Downtown)</span>
      </div>
      <div class="map-legend-item">
        <span class="map-legend-line-sample line-2"></span>
        <span><strong>2 Line</strong> (Lynnwood ⇄ Downtown Redmond)</span>
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
    headerLegend.appendChild(officialLink);

    textGroup.appendChild(title);
    textGroup.appendChild(headerLegend);
    titleGroup.appendChild(iconBadge);
    titleGroup.appendChild(textGroup);

    const actions = createElement('div', 'system-map-header-actions');

    const closeBtn = createElement('button', 'icon-btn modal-close-btn', ICONS.close);
    closeBtn.setAttribute('aria-label', 'Close Link Map');
    closeBtn.title = 'Close Link Map';
    closeBtn.onclick = () => this.close();

    actions.appendChild(closeBtn);

    header.appendChild(titleGroup);
    header.appendChild(actions);

    // Map Viewport Body
    this.bodyEl = createElement('div', 'system-map-body');

    // SVG Canvas
    this.canvasEl = createElement('div', 'map-svg-canvas');
    this.canvasEl.innerHTML = this.generateOfficialSchematicSvg();
    this.bodyEl.appendChild(this.canvasEl);

    container.appendChild(header);
    container.appendChild(this.bodyEl);
    overlay.appendChild(container);

    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    return overlay;
  }

  private generateOfficialSchematicSvg(): string {
    return `
      <svg class="system-map-svg" viewBox="0 0 830 1280" width="830" height="1280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="track-glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="track-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="transfer-border-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#008542" />
            <stop offset="50%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0072CE" />
          </linearGradient>
          <filter id="transfer-hub-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
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
          d="M 272,75 L 272,1210" stroke="#008542" stroke-width="14" opacity="0.3" filter="url(#track-glow-green)" />
        <path class="map-track-path line-1-main map-elem-line-1"
          d="M 272,75 L 272,1210" stroke="#008542" stroke-width="9" stroke-linecap="round" fill="none" />

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

        <!-- 1 Line South Terminus (Federal Way Downtown) -->
        <g class="map-terminus-badge map-elem-line-1" transform="translate(272, 1240)">
          <rect x="-24" y="-13" width="48" height="24" rx="12" fill="#0f172a" stroke="rgba(0,133,66,0.6)" stroke-width="1.5" />
          <circle cx="0" cy="-1" r="9" fill="#008542" />
          <text x="0" y="2.5" fill="#ffffff" font-size="11" font-weight="800" text-anchor="middle">1</text>
        </g>

        <!-- ================= LEFT SPINE: SHARED 1 LINE & 2 LINE STATIONS ================= -->
        ${this.renderDualCapsuleStation('lynnwood-city-center', 285, 75, 'Lynnwood City Center', 'Park & Ride / Transit Center', 'left', true)}
        ${this.renderDualCapsuleStation('mountlake-terrace', 285, 120, 'Mountlake Terrace', 'Park & Ride / Freeway Station', 'left')}
        ${this.renderDualCapsuleStation('shoreline-north-185th', 285, 165, 'Shoreline North/185th', 'Park & Ride / NE 185th St', 'left')}
        ${this.renderDualCapsuleStation('shoreline-south-148th', 285, 210, 'Shoreline South/148th', 'Park & Ride / NE 148th St', 'left')}
        ${this.renderDualCapsuleStation('northgate', 285, 255, 'Northgate', 'Park & Ride / Kraken Iceplex', 'left')}
        ${this.renderDualCapsuleStation('roosevelt', 285, 300, 'Roosevelt', 'Park & Ride / Roosevelt High', 'left')}
        ${this.renderDualCapsuleStation('u-district', 285, 345, 'U District', 'UW Tower / The Ave', 'left')}
        ${this.renderDualCapsuleStation('university-of-washington', 285, 390, 'University of Washington', 'Husky Stadium / UW Medical', 'left')}
        ${this.renderDualCapsuleStation('capitol-hill', 285, 435, 'Capitol Hill', 'Broadway / First Hill Streetcar', 'left')}

        <!-- Downtown Seattle Transit Tunnel Stations -->
        ${this.renderDualCapsuleStation('westlake', 285, 480, 'Westlake', 'Seattle Center Monorail / Pine St', 'left')}
        ${this.renderDualCapsuleStation('symphony', 285, 525, 'Symphony', 'Benaroya Hall / University St', 'left')}
        ${this.renderDualCapsuleStation('pioneer-square', 285, 570, 'Pioneer Square', 'WA State Ferries / Streetcar', 'left')}
        
        <!-- Highlighted 1 Line ⇄ 2 Line Transfer Hub -->
        ${this.renderTransferHubStation('international-district-chinatown', 285, 615, 'Intl. District / Chinatown')}

        <!-- ================= LEFT SPINE: 1 LINE SOUTH STATIONS ================= -->
        ${this.renderLine1Station('stadium', 272, 665, 'Stadium', 'Lumen Field / T-Mobile Park', 'left')}
        ${this.renderLine1Station('sodo', 272, 710, 'SODO', 'SODO Busway / Industrial District', 'left')}
        ${this.renderLine1Station('beacon-hill', 272, 755, 'Beacon Hill', 'Tunnel Station / El Centro', 'left')}
        ${this.renderLine1Station('mount-baker', 272, 800, 'Mount Baker', 'Transit Center / Franklin High', 'left')}
        ${this.renderLine1Station('columbia-city', 272, 845, 'Columbia City', 'Historic District / Rainier Ave', 'left')}
        ${this.renderLine1Station('othello', 272, 890, 'Othello', 'Rainier Valley / Othello Park', 'left')}
        ${this.renderLine1Station('rainier-beach', 272, 935, 'Rainier Beach', 'Rainier Beach / Chief Sealth Trail', 'left')}
        ${this.renderLine1Station('tukwila-intl-blvd', 272, 980, 'Tukwila Intl. Blvd.', 'Park & Ride / RapidRide A', 'left')}
        ${this.renderAirportStation('seatac-airport', 272, 1025, 'SeaTac / Airport', "Seattle-Tacoma Int'l Airport", 'left')}
        ${this.renderLine1Station('angle-lake', 272, 1070, 'Angle Lake', 'Park & Ride / S 200th St', 'left')}
        ${this.renderLine1Station('kent-des-moines', 272, 1115, 'Kent Des Moines', 'Highline College / Park & Ride', 'left')}
        ${this.renderLine1Station('star-lake', 272, 1160, 'Star Lake', 'Park & Ride / S 272nd St', 'left')}
        ${this.renderLine1Station('federal-way-downtown', 272, 1205, 'Federal Way Downtown', 'Park & Ride / Transit Center', 'left', true)}

        <!-- ================= CONNECTING SEGMENT (I-90 CORRIDOR) ================= -->
        ${this.renderLine2Station('judkins-park', 355, 665, 'Judkins Park', 'Rainier Ave S / I-90 Trail', 'bottom')}
        ${this.renderLine2Station('mercer-island', 480, 665, 'Mercer Island', 'Park & Ride / I-90 Trail', 'bottom')}

        <!-- ================= RIGHT SPINE: 2 LINE EASTSIDE STATIONS ================= -->
        ${this.renderLine2Station('south-bellevue', 540, 635, 'South Bellevue', 'Park & Ride / Mercer Slough', 'right', true)}
        ${this.renderLine2Station('east-main', 540, 571, 'East Main', 'Surrey Downs / 112th Ave SE', 'right')}
        ${this.renderLine2Station('bellevue-downtown', 540, 509, 'Bellevue Downtown', 'Bellevue Transit Center', 'right', true)}
        ${this.renderLine2Station('wilburton', 540, 447, 'Wilburton', 'Overlake Medical Center', 'right')}
        ${this.renderLine2Station('spring-district', 540, 385, 'Spring District', '120th Station / Spring District', 'right')}
        ${this.renderLine2Station('bel-red', 540, 323, 'BelRed', 'Park & Ride / 130th Station', 'right')}
        ${this.renderLine2Station('overlake-village', 540, 261, 'Overlake Village', '152nd Ave NE / Overlake Village', 'right')}
        ${this.renderLine2Station('redmond-technology', 540, 199, 'Redmond Technology', 'Microsoft Campus / Transit Center', 'right', true)}
        ${this.renderLine2Station('marymoor-village', 540, 137, 'Marymoor Village', 'Park & Ride / Marymoor Park', 'right')}
        ${this.renderLine2Station('downtown-redmond', 540, 75, 'Downtown Redmond', 'Redmond Town Center', 'right', true)}
      </svg>
    `;
  }

  private renderTransferHubStation(
    id: string,
    x: number,
    y: number,
    name: string
  ): string {
    const textX = x - 28;

    return `
      <!-- ================= KEY 1 LINE & 2 LINE TRANSFER HUB ================= -->
      <g class="map-station-node map-transfer-hub-node map-elem-line-1 map-elem-line-2 map-elem-shared" id="map-node-${id}">
        <!-- Outer Glowing Capsule -->
        <rect x="${x - 24}" y="${y - 11}" width="48" height="22" rx="11" fill="#091122" stroke="url(#transfer-border-grad)" stroke-width="2" filter="url(#transfer-hub-glow)" />
        
        <!-- Transfer Connector Bridge -->
        <line x1="${x - 13}" y1="${y}" x2="${x + 13}" y2="${y}" stroke="rgba(255, 255, 255, 0.95)" stroke-width="3" stroke-linecap="round" />

        <!-- Line 1 Station Node (Green) -->
        <circle class="map-station-circle" cx="${x - 13}" cy="${y}" r="6" fill="#ffffff" stroke="#008542" stroke-width="3" />
        <circle cx="${x - 13}" cy="${y}" r="2" fill="#008542" />

        <!-- Line 2 Station Node (Blue) -->
        <circle class="map-station-circle" cx="${x + 13}" cy="${y}" r="6" fill="#ffffff" stroke="#0072CE" stroke-width="3" />
        <circle cx="${x + 13}" cy="${y}" r="2" fill="#0072CE" />

        <!-- Station Name -->
        <text class="map-station-label map-transfer-station-title" x="${textX}" y="${y + 2.5}" text-anchor="end" font-weight="800" font-size="12px" fill="#ffffff">${name}</text>

        <!-- Snug Transfer Pill Badge: (1) ⇄ (2) TRANSFER -->
        <g transform="translate(${textX}, ${y + 8})">
          <rect x="-106" y="0" width="106" height="18" rx="9" fill="#080f1d" stroke="url(#transfer-border-grad)" stroke-width="1.3" />
          
          <!-- Line 1 bullet -->
          <circle cx="-95" cy="9" r="4.8" fill="#008542" />
          <text x="-95" y="12.2" fill="#ffffff" font-size="7" font-weight="900" text-anchor="middle">1</text>
          
          <!-- Transfer symbol -->
          <text x="-84" y="11.8" fill="#cbd5e1" font-size="8" font-weight="800" text-anchor="middle">⇄</text>

          <!-- Line 2 bullet -->
          <circle cx="-73" cy="9" r="4.8" fill="#0072CE" />
          <text x="-73" y="12.2" fill="#ffffff" font-size="7" font-weight="900" text-anchor="middle">2</text>

          <!-- Transfer Label -->
          <text x="-63" y="12.2" fill="#38bdf8" font-size="8.5" font-weight="800" letter-spacing="0.4">TRANSFER</text>
        </g>
      </g>
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
        ${sub ? `<text class="map-station-sublabel" x="${textX}" y="${textY + 12}" text-anchor="${textAnchor}">${sub}</text>` : ''}
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
