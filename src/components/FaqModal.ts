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
    modal.style.maxWidth = '680px';

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title', 'Transit Guide & FAQ');
    const closeBtn = createElement('button', 'icon-btn', ICONS.close);
    closeBtn.onclick = () => this.close();
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const body = createElement('div', 'modal-body');
    body.style.gap = '1.25rem';

    // Featured Guide: Lynnwood to Bellevue
    const featuredCard = createElement('div', 'faq-featured-card');
    featuredCard.innerHTML = `
      <div class="faq-featured-header">
        <div class="faq-tag">Regional Transit Guide</div>
        <h4 class="faq-featured-title">How do I get from Lynnwood to Bellevue?</h4>
      </div>
      <div class="faq-featured-body">
        <p class="faq-text">
          Currently, the <strong>1 Line</strong> operates north-south through Seattle and the <strong>2 Line</strong> operates on the Eastside (South Bellevue ⇄ Downtown Redmond). Here are the most efficient ways to travel between Lynnwood and Bellevue:
        </p>

        <div class="route-option-card">
          <div class="route-badge direct">Option 1: Fastest & Direct (Express Bus via I-405)</div>
          <div class="route-title">ST Express Route 535 (or Route 532 Peak Commuter)</div>
          <p class="route-desc">
            • <strong>Boarding:</strong> <strong>Lynnwood City Center Station (Bay D1)</strong>.<br />
            • <strong>Routing:</strong> Direct down I-405 stopping at Canyon Park, UW Bothell, and Totem Lake.<br />
            • <strong>Arrival:</strong> <strong>Bellevue Transit Center / Bellevue Downtown Station</strong> (~35–45 minutes).<br />
            • <strong>Transfer:</strong> Walk directly across to the <strong>2 Line Light Rail</strong> platform to reach Spring District, Overlake, or Downtown Redmond.
          </p>
        </div>

        <div class="route-option-card">
          <div class="route-badge transfer">Option 2: 1 Line Train + Seattle Transfer (via I-90)</div>
          <div class="route-title">1 Line ➔ Seattle ➔ ST Express 550 ➔ 2 Line</div>
          <p class="route-desc">
            1. Take <strong>1 Line South</strong> from Lynnwood to <strong>Int'l District / Chinatown Station</strong> or <strong>Symphony Station</strong> (~30 min).<br />
            2. Transfer to <strong>ST Express 550</strong> across I-90 directly into <strong>Bellevue Downtown</strong>.<br />
            3. Connect directly to the <strong>2 Line</strong> at Bellevue Downtown Station.
          </p>
        </div>

        <div class="route-option-card future">
          <div class="route-badge future">Future: 1 Line ⇄ 2 Line Direct Rail Transfer</div>
          <div class="route-title">Full I-90 Lake Washington Light Rail Connection</div>
          <p class="route-desc">
            Once Sound Transit opens the cross-lake I-90 Link extension (Judkins Park & Mercer Island), riders will be able to take 1 Line from Lynnwood to <strong>Chinatown-International District Station</strong> and transfer directly to the <strong>2 Line</strong> across Lake Washington without ever leaving the train network!
          </p>
        </div>
      </div>
    `;

    // General Link FAQs
    const generalCard = createElement('div', 'faq-section-wrap');
    generalCard.innerHTML = `
      <h4 class="faq-section-heading">Sound Transit Link Quick Facts</h4>

      <div class="faq-item">
        <div class="faq-q">What is the difference between the 1 Line and 2 Line?</div>
        <div class="faq-a">
          • <strong>1 Line (Green):</strong> 33 miles, 23 stations connecting Lynnwood City Center, Northgate, UW, Downtown Seattle, Beacon Hill, and SeaTac Airport to Angle Lake.<br/>
          • <strong>2 Line (Blue):</strong> 10 stations connecting South Bellevue, Downtown Bellevue, Spring District, and Redmond Technology to Downtown Redmond.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">How frequently do Link trains run?</div>
        <div class="faq-a">
          Trains run every <strong>8 to 10 minutes</strong> during peak and daytime hours, and every <strong>10 to 15 minutes</strong> early in the morning and late at night (roughly 5:00 AM to 1:00 AM).
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">How do fares work?</div>
        <div class="faq-a">
          • <strong>Link Light Rail:</strong> Flat <strong>$3.00</strong> for adult riders regardless of distance. Tap your ORCA card at the yellow station readers before and after riding.<br/>
          • <strong>ST Express Buses:</strong> Flat <strong>$3.25</strong> for adults.<br/>
          • <strong>Youth (18 and under):</strong> Ride <strong>100% FREE</strong> on all Sound Transit trains and buses!
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">Official Links & Resources</div>
        <div class="faq-a">
          • <a href="https://xuanmn.github.io/Seattle-Lightrail-Tracker/" target="_blank" rel="noopener noreferrer" style="color: var(--text-accent); text-decoration: underline;">Live Tracker Web App</a><br/>
          • <a href="https://www.soundtransit.org/ride-with-us/routes-schedules" target="_blank" rel="noopener noreferrer" style="color: var(--text-accent); text-decoration: underline;">Sound Transit Official Schedules & Alerts</a><br/>
          • <a href="https://github.com/xuanmn/Seattle-Lightrail-Tracker" target="_blank" rel="noopener noreferrer" style="color: var(--text-accent); text-decoration: underline;">GitHub Repository & Source Code</a>
        </div>
      </div>
    `;

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
