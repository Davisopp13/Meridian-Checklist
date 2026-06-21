import { MERIDIAN_AUDIT_OPTS, MERIDIAN_RUN_FIELDS } from './meridianChecklistData.js';
import { defaultMeridianState } from './meridianStorage.js';
import { esc } from '../../shared/components/text.js';

export function renderSmokeSession({ state }) {
  const audit = state.audit || defaultMeridianState().audit;
  const run = state.run || defaultMeridianState().run;
  return `
    <section class="session-panel meridian-audit-panel" aria-labelledby="session-title">
      <div class="session-head">
        <div>
          <div class="panel-label">Smoke Session</div>
          <h2 id="session-title">Fresh clone gate and run metadata</h2>
        </div>
        <button class="btn btn-audit" id="btn-audit-session" type="button">Copy Final Fresh Clone Audit Prompt</button>
      </div>
      <div class="run-fields">
        ${MERIDIAN_RUN_FIELDS.map((field) => `
          <label class="run-field" for="run-${field.key}">
            <span>${esc(field.label)}</span>
            <input id="run-${field.key}" data-run-field="${field.key}" value="${esc(run[field.key] || '')}" placeholder="${esc(field.placeholder)}" />
          </label>
        `).join('')}
      </div>
      <div class="audit-verdict-group" role="group" aria-label="Fresh clone audit verdict">
        ${MERIDIAN_AUDIT_OPTS.map((opt) => {
          const selected = audit.verdict === opt.id;
          return `
            <button class="audit-option${selected ? ` ${opt.cls}` : ''}" type="button" data-audit-verdict="${opt.id}" aria-pressed="${selected}">
              <span>${esc(opt.label)}</span>
              <small>${esc(opt.desc)}</small>
            </button>
          `;
        }).join('')}
      </div>
      <label class="audit-notes-label" for="audit-notes">Fresh clone audit notes</label>
      <textarea class="audit-notes" id="audit-notes" placeholder="Paste audit verdict, blocker summary, or cited evidence links">${esc(audit.notes || '')}</textarea>
    </section>
  `;
}
