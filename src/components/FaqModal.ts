import { createElement, ICONS } from '../utils/dom';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock';
import { attachBottomSheetSwipe } from '../utils/bottomSheetGesture';

export class FaqModal {
  private overlay: HTMLElement;
  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
      this.close();
    }
  };

  constructor() {
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
  }

  public open() {
    this.overlay.classList.add('open');
    lockBodyScroll();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public close() {
    if (!this.overlay.classList.contains('open')) return;
    this.overlay.classList.remove('open');
    unlockBodyScroll();
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'modal-overlay faq-modal-overlay');
    const modal = createElement('div', 'modal-container modal-container-wide faq-modal-container');

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title', 'Seattle Transit Guide & FAQ');
    const closeBtn = createElement('button', 'icon-btn modal-close-btn', ICONS.close);
    closeBtn.setAttribute('aria-label', 'Close Transit Guide');
    closeBtn.title = 'Close Transit Guide';
    closeBtn.onclick = () => this.close();
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Enable mobile bottom sheet swipe-to-dismiss gesture directly on header
    attachBottomSheetSwipe({
      overlay,
      container: modal,
      header,
      onClose: () => this.close(),
    });

    // Body
    const body = createElement('div', 'modal-body');

    // Section 1: Regional Connection & Line 1 / Line 2 Guide
    const connectionGuideCard = createElement('div', 'faq-featured-card');
    connectionGuideCard.innerHTML = `
      <div class="faq-featured-header">
        <div class="faq-tag">Regional Route Guide</div>
        <h4 class="faq-featured-title">Lynnwood / Seattle ⇄ Bellevue / Redmond Connection</h4>
      </div>
      <div class="faq-featured-body">
        <div class="route-option-card">
          <div class="route-badge direct">Direct 2 Line</div>
          <div class="route-title">Single Train — No Transfer</div>
          <p class="route-desc">
            The <strong>2 Line</strong> runs directly between <strong>Lynnwood City Center</strong> and <strong>Downtown Redmond</strong> via Downtown Seattle and the I-90 bridge.
          </p>
        </div>

        <div class="route-option-card">
          <div class="route-badge transfer">Travel Times & Connections</div>
          <div class="route-title">Key Station Pairs</div>
          <p class="route-desc">
            • <strong>Bellevue ⇄ Westlake (Seattle):</strong> ~25 min<br/>
            • <strong>Bellevue ⇄ Capitol Hill:</strong> ~35 min (direct)<br/>
            • <strong>Downtown Redmond ⇄ Lynnwood:</strong> ~55 min (direct)<br/>
            • <strong>Bellevue ⇄ UW & Northgate:</strong> Direct on 2 Line<br/>
            • <strong>Shared Core (Lynnwood ⇄ Chinatown-ID):</strong> Trains arrive every <strong>4–5 min</strong> during peak hours.<br/>
            • <strong>To SeaTac Airport:</strong> Take 2 Line to Chinatown-ID, then cross-platform transfer to 1 Line Southbound (~55 min total from Bellevue).
          </p>
        </div>
      </div>
    `;

    // Section 2: General Link FAQs
    const generalCard = createElement('div', 'faq-section-wrap');
    generalCard.innerHTML = `
      <h4 class="faq-section-heading">Frequently Asked Questions</h4>

      <div class="faq-item">
        <div class="faq-q">📱 Tracker Usage</div>
        <div class="faq-a">
          • <strong>Pin Stations:</strong> Click the Star icon on any card or use <strong>+ Add Station</strong> to pin favorite stops.<br/>
          • <strong>Line Toggle:</strong> Switch between 1 Line and 2 Line in the top header.<br/>
          • <strong>GPS vs Scheduled:</strong> Green badges indicate live satellite-tracked trains. White badges show scheduled timetable data.<br/>
          • <strong>Updates:</strong> Countdown ticks every second. Live arrivals refresh automatically every 60 seconds.<br/>
          • <strong>Time Format:</strong> Toggle between 12-hour and 24-hour display in Settings.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">💳 Fares & Payment</div>
        <div class="faq-a">
          • <strong>Adult Fare:</strong> Flat <strong>$3.00</strong> per trip (distance does not affect price).<br/>
          • <strong>Youth (18 & under):</strong> <strong>Free</strong> on all trains and buses.<br/>
          • <strong>Reduced Fare:</strong> Flat <strong>$1.00</strong> for ORCA LIFT and RRFP (seniors 65+ / disability).<br/>
          • <strong>How to Tap:</strong> Tap your ORCA card once before boarding. <strong>You do NOT need to tap off</strong> when exiting.<br/>
          • <strong>Transfers:</strong> ORCA includes automatic 2-hour transfer credit across Metro, ST Express, and Streetcar.<br/>
          • <strong>Other Payments:</strong> Transit GO Ticket app or station ticket machines.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">⏰ Frequency & Operating Hours</div>
        <div class="faq-a">
          • <strong>Peak:</strong> Every 8–10 min per line (every 4–5 min on shared Lynnwood–Chinatown segment).<br/>
          • <strong>Off-Peak & Weekends:</strong> Every 10–15 min.<br/>
          • <strong>Operating Span:</strong> Mon–Sat ~5:00 AM – 1:00 AM; Sun & Holidays ~6:00 AM – 12:00 AM.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🚲 Bikes, Luggage & Accessibility</div>
        <div class="faq-a">
          • <strong>Bicycles:</strong> Allowed free on all trains. Up to 4 hanging hooks per car.<br/>
          • <strong>Luggage & Strollers:</strong> Allowed. All stations and platforms provide step-free, level boarding.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🛡️ Security & Lost and Found</div>
        <div class="faq-a">
          • <strong>Security (24/7 call or text):</strong> <strong>206-398-5268</strong><br/>
          • <strong>Emergency:</strong> Call <strong>911</strong> or use platform emergency call boxes.<br/>
          • <strong>Lost & Found:</strong> <strong>206-553-3000</strong> (King County Metro).
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🔗 Official Resources</div>
        <div class="faq-links-list">
          <a href="https://www.soundtransit.org/ride-with-us/routes-schedules" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>Sound Transit Schedules & Alerts</span>
            <span>↗</span>
          </a>
          <a href="https://www.soundtransit.org/ride-with-us/stations/link-light-rail-stations" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>Station Directory & Parking Facilities</span>
            <span>↗</span>
          </a>
          <a href="https://myorca.com/" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>myORCA Card Management</span>
            <span>↗</span>
          </a>
          <a href="https://github.com/xuanmn/Seattle-Lightrail-Tracker" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>GitHub Repository & Source Code</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    `;

    body.appendChild(connectionGuideCard);
    body.appendChild(generalCard);

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);

    overlay.onclick = (e) => {
      if (e.target === overlay) this.close();
    };

    return overlay;
  }
}
