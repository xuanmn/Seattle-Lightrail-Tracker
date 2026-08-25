import { createElement, ICONS } from '../utils/dom';

export class FaqModal {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = this.render();
    document.body.appendChild(this.overlay);
  }

  public open() {
    this.overlay.classList.add('open');
  }

  public close() {
    this.overlay.classList.remove('open');
  }

  private render(): HTMLElement {
    const overlay = createElement('div', 'modal-overlay');
    const modal = createElement('div', 'modal-container');
    modal.style.maxWidth = '700px';

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title', 'Seattle Transit Guide & FAQ');
    const closeBtn = createElement('button', 'icon-btn', ICONS.close);
    closeBtn.onclick = () => this.close();
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', 'modal-body');
    body.style.gap = '1.25rem';

    // Section 1: Quick Start Guide
    const quickStartCard = createElement('div', 'faq-section-wrap');
    quickStartCard.innerHTML = `
      <h4 class="faq-section-heading">📱 Quick Start: Using This Dashboard</h4>
      <div class="faq-quickstart-grid">
        <div class="faq-quickstart-item">
          <div class="faq-quickstart-icon">★</div>
          <div class="faq-quickstart-title">Customize Dashboard</div>
          <div class="faq-quickstart-desc">Click the star on any station or open <strong>+ Add Station</strong> to pin your daily stops.</div>
        </div>
        <div class="faq-quickstart-item">
          <div class="faq-quickstart-icon">🟢</div>
          <div class="faq-quickstart-title">Live GPS Countdowns</div>
          <div class="faq-quickstart-desc">Green badges indicate live satellite-tracked trains. White badges indicate scheduled times.</div>
        </div>
        <div class="faq-quickstart-item">
          <div class="faq-quickstart-icon">🔄</div>
          <div class="faq-quickstart-title">60-Sec Auto Sync</div>
          <div class="faq-quickstart-desc">Arrival estimates refresh live every minute. Switch between 1 Line and 2 Line in the header.</div>
        </div>
      </div>
    `;

    // Section 2: Lines Overview
    const linesCard = createElement('div', 'faq-section-wrap');
    linesCard.innerHTML = `
      <h4 class="faq-section-heading">🚆 Sound Transit Link Light Rail Lines</h4>
      <div class="faq-line-comparison">
        <div class="faq-line-card line-1-box">
          <div class="route-badge direct" style="background: var(--st-green); color: #fff; border: none;">1 LINE (GREEN)</div>
          <div class="route-title">Lynnwood ⇄ Angle Lake</div>
          <div class="route-desc">
            • <strong>23 Stations (33 Miles)</strong><br />
            • <strong>Key Stops:</strong> Lynnwood City Center, Northgate, Univ. of Washington, Capitol Hill, Downtown Seattle (Westlake, Symphony, Pioneer Square, Chinatown-ID), Columbia City, and SeaTac Airport.
          </div>
        </div>
        <div class="faq-line-card line-2-box">
          <div class="route-badge transfer" style="background: var(--st-blue); color: #fff; border: none;">2 LINE (BLUE)</div>
          <div class="route-title">South Bellevue ⇄ Downtown Redmond</div>
          <div class="route-desc">
            • <strong>10 Stations (Eastside Link)</strong><br />
            • <strong>Key Stops:</strong> South Bellevue, East Main, Bellevue Downtown (Transit Center), Wilburton, Spring District, Bel-Red/130th, Overlake Village, Redmond Technology, and Downtown Redmond.
          </div>
        </div>
      </div>
    `;

    // Section 3: Featured Guide - Lynnwood to Bellevue
    const featuredCard = createElement('div', 'faq-featured-card');
    featuredCard.innerHTML = `
      <div class="faq-featured-header">
        <div class="faq-tag">Regional Connection Guide</div>
        <h4 class="faq-featured-title">How do I travel between Lynnwood/Seattle and Bellevue?</h4>
      </div>
      <div class="faq-featured-body">
        <p class="faq-text">
          Currently, the <strong>1 Line</strong> operates through Seattle and the <strong>2 Line</strong> operates on the Eastside. Here are the best ways to connect between them:
        </p>

        <div class="route-option-card">
          <div class="route-badge direct">Option 1: Fastest & Direct (Express Bus via I-405)</div>
          <div class="route-title">ST Express Route 535 (or Route 532 Peak Commuter)</div>
          <p class="route-desc">
            • <strong>Board:</strong> <strong>Lynnwood City Center Station (Bay D1)</strong>.<br />
            • <strong>Route:</strong> Direct down I-405 via Canyon Park, UW Bothell, and Totem Lake.<br />
            • <strong>Arrive:</strong> <strong>Bellevue Transit Center / Bellevue Downtown Station</strong> (~35–45 min).<br />
            • <strong>Transfer:</strong> Walk directly across to the <strong>2 Line Light Rail</strong> platform to reach Spring District, Overlake, or Redmond.
          </p>
        </div>

        <div class="route-option-card">
          <div class="route-badge transfer">Option 2: 1 Line Train + Seattle Transfer (via I-90)</div>
          <div class="route-title">1 Line ➔ Seattle ➔ ST Express 550 ➔ 2 Line</div>
          <p class="route-desc">
            1. Take <strong>1 Line South</strong> from Lynnwood to <strong>Int'l District / Chinatown Station</strong> (~30 min).<br />
            2. Transfer to <strong>ST Express 550</strong> across I-90 directly into <strong>Bellevue Downtown</strong>.<br />
            3. Connect directly to the <strong>2 Line</strong> at Bellevue Downtown Station.
          </p>
        </div>

        <div class="route-option-card future">
          <div class="route-badge future">Future: 1 Line ⇄ 2 Line Direct Rail Transfer</div>
          <div class="route-title">Full I-90 Lake Washington Light Rail Connection</div>
          <p class="route-desc">
            Once Sound Transit opens the cross-lake I-90 Link bridge (Judkins Park & Mercer Island), riders will be able to take the train to <strong>Chinatown-International District Station</strong> and transfer directly between 1 Line and 2 Line across the lake!
          </p>
        </div>
      </div>
    `;

    // Section 4: General Link FAQs
    const generalCard = createElement('div', 'faq-section-wrap');
    generalCard.innerHTML = `
      <h4 class="faq-section-heading">Frequently Asked Questions</h4>

      <div class="faq-item">
        <div class="faq-q">💳 How much does it cost and how do I pay?</div>
        <div class="faq-a">
          • <strong>Link Light Rail:</strong> Flat <strong>$3.00</strong> for adult riders regardless of distance.<br/>
          • <strong>Youth (18 & under):</strong> Ride <strong>100% FREE</strong> on all Sound Transit trains and buses!<br/>
          • <strong>Reduced Fares:</strong> $1.00 for ORCA LIFT (income-qualified) and Regional Reduced Fare Permit (RRFP for seniors 65+ & disability).<br/>
          • <strong>Payment Methods:</strong> Tap your physical or digital <strong>ORCA card</strong> at the yellow station readers before boarding and after exiting, or purchase a mobile ticket via the <strong>Transit GO Ticket</strong> app.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">⏰ How frequently do trains run and what are the operating hours?</div>
        <div class="faq-a">
          • <strong>Peak & Daytime Frequency:</strong> Trains arrive every <strong>8 to 10 minutes</strong>.<br/>
          • <strong>Early Morning / Late Night:</strong> Trains arrive every <strong>10 to 15 minutes</strong>.<br/>
          • <strong>Operating Hours:</strong> Monday – Saturday from <strong>~5:00 AM to 1:00 AM</strong>; Sundays and holidays from <strong>~6:00 AM to 12:00 AM (midnight)</strong>.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">🔗 Official Resources & Service Alerts</div>
        <div class="faq-links-list">
          <a href="https://www.soundtransit.org/ride-with-us/routes-schedules" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>Sound Transit Official Schedules & Alerts</span>
            <span>↗</span>
          </a>
          <a href="https://myorca.com/" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>myORCA Card Management & Online Reload</span>
            <span>↗</span>
          </a>
          <a href="https://kingcounty.gov/en/dept/metro/travel-options/bus/trip-planner" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>King County Metro Regional Trip Planner</span>
            <span>↗</span>
          </a>
          <a href="https://github.com/xuanmn/Seattle-Lightrail-Tracker" target="_blank" rel="noopener noreferrer" class="faq-link-row">
            <span>GitHub Repository & Source Code</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    `;

    body.appendChild(quickStartCard);
    body.appendChild(linesCard);
    body.appendChild(featuredCard);
    body.appendChild(generalCard);

    // Footer
    const footer = createElement('div', 'modal-footer');
    const doneBtn = createElement('button', 'btn-primary', 'Got It');
    doneBtn.onclick = () => this.close();
    footer.appendChild(doneBtn);

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
