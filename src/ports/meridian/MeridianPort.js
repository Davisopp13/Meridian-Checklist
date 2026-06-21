import './meridianStyles.css';
import { renderSmokeSession } from './MeridianAudit.js';
import { renderMeridianOverview } from './MeridianOverview.js';
import { renderSmokeRecord } from './MeridianReports.js';
import {
  renderMeridianSectionNav,
  renderMeridianSectionsMarkup,
  renderProgressPanel,
} from './MeridianSmokeChecklist.js';

export function renderMeridianPortView({ state, currentFilter }) {
  return `
    <section class="meridian-port" aria-label="Meridian Port">
      ${renderMeridianOverview()}
      ${renderSmokeRecord()}
      ${renderSmokeSession({ state })}
      ${renderProgressPanel({ currentFilter })}
      <div class="section-nav" id="section-nav" aria-label="Meridian checklist sections"></div>
      <div class="filter-empty" id="filter-empty" hidden>No checklist items match the current view.</div>
      <div id="section-container"></div>
    </section>
  `;
}

export { renderMeridianSectionNav, renderMeridianSectionsMarkup };
