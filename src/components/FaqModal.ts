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
    const overlay = createElement('div', 'modal-overlay');
    const modal = createElement('div', 'modal-container modal-container-wide');

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
        <div class="faq-tag">Regional Transit Guide</div>
        <h4 class="faq-featured-title">Can I ride light rail from <span class="faq-hl-line1">Lynnwood / Seattle</span> to <span class="faq-hl-line2">Bellevue / Redmond</span>?</h4>
      </div>
      <div class="faq-featured-body">
        <div class="route-option-card">
          <div class="route-badge direct">Yes! Direct 2 Line Service</div>
          <div class="route-title">Single Continuous Train — No Transfer Needed</div>
          <p class="route-desc">
            The <strong>2 Line</strong> connects <strong>Lynnwood City Center</strong> directly through Seattle (<em>Northgate, UW, Capitol Hill, Westlake, Pioneer Square, Chinatown-ID</em>), across Lake Washington via the I-90 bridge (<em>Mercer Island & Judkins Park</em>), straight to <strong>Bellevue</strong> and <strong>Downtown Redmond</strong>!
          </p>
        </div>

        <div class="route-option-card">
          <div class="route-badge transfer">Key Travel Times & Connections</div>
          <div class="route-title">Fast, Traffic-Proof Commute</div>
          <p class="route-desc">
            • <strong>Downtown Redmond ⇄ Lynnwood City Center:</strong> ~55–60 minutes (direct, no transfer in either direction).<br/>
            • <strong>Bellevue Downtown ⇄ Westlake (Seattle):</strong> ~25–28 minutes.<br/>
            • <strong>Bellevue Downtown ⇄ Capitol Hill:</strong> ~35–40 minutes (direct, no transfer).<br/>
            • <strong>Bellevue Downtown ⇄ UW & Northgate:</strong> Direct on the 2 Line.<br/>
            • <strong>Combined Core Frequency:</strong> On the shared spine between Lynnwood and Chinatown-ID, both 1 Line and 2 Line trains arrive every <strong>4 to 5 minutes</strong> during peak commute hours!<br/>
            • <strong>To SeaTac Airport from Eastside:</strong> Take the 2 Line to any shared station (such as <strong>International District / Chinatown</strong>) and make a quick cross-platform transfer to the southbound <strong>1 Line</strong> (~55–60 min total from Bellevue).
          </p>
        </div>
      </div>
    `;

    // Section 2: General Link FAQs
    const generalCard = createElement('div', 'faq-section-wrap');
    generalCard.innerHTML = `
      <h4 class="faq-section-heading">Frequently Asked Questions</h4>

      <div class="faq-item">
        <div class="faq-q">📱 How do I use and customize this departure board?</div>
        <div class="faq-a">
          • <strong>Save Favorite Stations:</strong> Click the Star icon on any card or open <strong>+ Add Station</strong> to pin your daily commute stops to the top.<br/>
          • <strong>Colored Line Badges:</strong> On shared stations, upcoming departures display colored pills for <strong>(1) 1 Line</strong> (to Federal Way) and <strong>(2) 2 Line</strong> (to Downtown Redmond).<br/>
          • <strong>Live GPS Badges:</strong> Green glowing badges indicate live satellite-tracked trains from Sound Transit; white badges indicate scheduled timetables.<br/>
          • <strong>Live Data Sync:</strong> Automatically synchronizes real-time arrival predictions every 60 seconds with continuous second-by-second countdown ticks. Switch between <strong>1 Line</strong> and <strong>2 Line</strong> using the header toggle.<br/>
          • <strong>Time Format Settings:</strong> Open the gear icon in the header to toggle between 12-hour (2:30 PM) and 24-hour (14:30) arrival times.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">💳 How much does it cost and how do I pay?</div>
        <div class="faq-a">
          • <strong>Link Light Rail Adult Fare:</strong> Flat <strong>$3.00</strong> regardless of distance traveled.<br/>
          • <strong>Youth (18 & under):</strong> Ride <strong>100% FREE</strong> on all Sound Transit trains and buses!<br/>
          • <strong>Reduced Fares:</strong> Flat <strong>$1.00</strong> for ORCA LIFT (income-qualified) and Regional Reduced Fare Permit (RRFP for seniors 65+ and riders with disabilities).<br/>
          • <strong>How to Tap (Flat Fare Rule):</strong> Tap your physical or digital <strong>ORCA card</strong> (available in Google Wallet) at the yellow station readers once before boarding. <strong>You do NOT need to tap off when exiting Link light rail!</strong><br/>
          • <strong>Alternative Payment:</strong> You can also purchase mobile tickets via the <strong>Transit GO Ticket</strong> app or buy single-ride paper tickets at station vending machines.<br/>
          • <strong>2-Hour Transfer Credit:</strong> ORCA transfers between Link light rail, King County Metro buses, Sound Transit Express buses, and Seattle Streetcars are automatically credited for up to 2 hours.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">⏰ How frequently do trains run and what are the operating hours?</div>
        <div class="faq-a">
          • <strong>Peak & Daytime Frequency:</strong> Trains arrive every <strong>8 to 10 minutes</strong> on each line (every <strong>4 to 5 minutes</strong> where lines share tracks between Lynnwood and Chinatown-ID).<br/>
          • <strong>Early Morning / Late Night:</strong> Trains arrive every <strong>10 to 15 minutes</strong>.<br/>
          • <strong>Operating Hours:</strong> Monday – Saturday from <strong>~5:00 AM to 1:00 AM</strong>; Sundays and holidays from <strong>~6:00 AM to 12:00 AM (midnight)</strong>.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🚲 Can I bring bicycles, luggage, or strollers on board?</div>
        <div class="faq-a">
          • <strong>Bicycles:</strong> Yes! Every Link light rail car features dedicated hanging hooks and priority storage space for up to 4 bikes. There is no extra charge.<br/>
          • <strong>Luggage & Strollers:</strong> All stations have level boarding from platforms directly into train cars, making suitcases, strollers, wheelchairs, and mobility devices easy to board.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🛡️ How do I contact Sound Transit Security or get assistance?</div>
        <div class="faq-a">
          • <strong>Security (Call or Text 24/7):</strong> Call or text <strong>206-398-5268</strong> for non-emergencies, safety concerns, or security on trains and platforms.<br/>
          • <strong>Emergency:</strong> Call <strong>911</strong> immediately or use the emergency call buttons on any station platform.<br/>
          • <strong>Lost & Found:</strong> Call <strong>206-553-3000</strong> (managed by King County Metro on behalf of Sound Transit).
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🔗 Official Resources & Service Alerts</div>
        <div class="faq-links-list">
          <a href="https://www.soundtransit.org/ride-with-us/routes-schedules" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>Sound Transit Official Schedules & Alerts</span>
            <span>↗</span>
          </a>
          <a href="https://www.soundtransit.org/ride-with-us/stations/link-light-rail-stations" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>Sound Transit Station Directory & Parking</span>
            <span>↗</span>
          </a>
          <a href="https://myorca.com/" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>myORCA Card Management & Online Reload</span>
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
