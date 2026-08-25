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
          Currently, <strong>1 Line</strong> operates in Seattle/Snohomish County and <strong>2 Line</strong> operates on the Eastside. Here are the best ways to travel between Lynnwood and Bellevue:
        </p>

        <div class="route-option-card">
          <div class="route-badge direct">Option 1: Fastest & Direct (Express Bus)</div>
          <div class="route-title">ST Express Route 535 / 532 (via I-405)</div>
          <p class="route-desc">
            Board <strong>ST Express 535</strong> directly at <strong>Lynnwood City Center Station Bay 4</strong>. It travels directly down I-405 to the <strong>Bellevue Transit Center / Bellevue Downtown Station</strong> in approximately <strong>35–45 minutes</strong> with no Seattle transfers required.
          </p>
        </div>

        <div class="route-option-card">
          <div class="route-badge transfer">Option 2: 1 Line Train + I-90 Bus Transfer</div>
          <div class="route-title">1 Line ➔ Seattle ➔ ST Express 550 ➔ 2 Line</div>
          <p class="route-desc">
            1. Take <strong>1 Line South</strong> from Lynnwood to <strong>Int'l District / Chinatown Station</strong> or <strong>Westlake</strong> (~30 min).<br />
            2. Transfer to <strong>ST Express 550</strong> across I-90 directly into <strong>Bellevue Downtown</strong>.<br />
            3. Connect directly to the <strong>2 Line</strong> at Bellevue Downtown for Spring District or Redmond.
          </p>
        </div>

        <div class="route-option-card future">
          <div class="route-badge future">Future: 1 Line ⇄ 2 Line Rail Transfer</div>
          <div class="route-title">Full Lake Washington Rail Connection</div>
          <p class="route-desc">
            Once Sound Transit completes the I-90 connection between Seattle and South Bellevue, riders will be able to transfer between the <strong>1 Line</strong> and <strong>2 Line</strong> at <strong>Chinatown-International District</strong> or <strong>Pioneer Square</strong> directly on the rail network!
          </p>
        </div>
      </div>
    `;

    // General Link FAQs
    const generalCard = createElement('div', 'faq-section-wrap');
    generalCard.innerHTML = `
      <h4 class="faq-section-heading">Link Light Rail Quick Info</h4>

      <div class="faq-item">
        <div class="faq-q">What is the difference between the 1 Line and 2 Line?</div>
        <div class="faq-a">
          <strong>1 Line (Green)</strong> runs 33 miles north-south from Lynnwood City Center through Northgate, UW, Downtown Seattle, and SeaTac Airport to Angle Lake.<br/>
          <strong>2 Line (Blue)</strong> serves the Eastside starter line from South Bellevue through Downtown Bellevue to Redmond Technology and Downtown Redmond.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">How frequently do Link trains run?</div>
        <div class="faq-a">
          Trains generally run every <strong>8 to 10 minutes</strong> during peak hours and every <strong>10 to 15 minutes</strong> during early morning, midday, and late evenings.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-q">How do I pay for rides?</div>
        <div class="faq-a">
          Tap an <strong>ORCA card</strong> at the yellow station card readers before boarding and after exiting, or purchase a mobile ticket on the <strong>Transit GO Ticket</strong> app. Fares for 1 Line are a flat $3.00 for adults.
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
