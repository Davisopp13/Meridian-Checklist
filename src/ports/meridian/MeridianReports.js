import { MERIDIAN_SMOKE_RECORD_SECTIONS } from './meridianChecklistData.js';
import { esc, fmtText } from '../../shared/components/text.js';

export function renderSmokeRecord() {
  return `
    <section class="record-panel meridian-record-panel" aria-labelledby="record-title">
      <div class="record-head">
        <div>
          <div class="panel-label">Approved Smoke Record</div>
          <h2 id="record-title">Scoped hybrid auto-close trial checklist</h2>
        </div>
        <span class="record-status">Approved artifact</span>
      </div>
      <div class="record-grid">
        ${MERIDIAN_SMOKE_RECORD_SECTIONS.map((section) => `
          <article class="record-group">
            <h3>${esc(section.title)}</h3>
            <ol>${section.items.map((item) => `<li>${fmtText(item)}</li>`).join('')}</ol>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
