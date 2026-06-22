import {
  MERIDIAN_SMOKE_LOG_ASSERTIONS,
  MERIDIAN_SMOKE_LOG_EXCLUDED,
  MERIDIAN_SMOKE_LOG_RESULTS,
  MERIDIAN_SMOKE_LOG_SESSION_FIELDS,
  MERIDIAN_SMOKE_LOG_SOURCES,
  MERIDIAN_SMOKE_LOG_SURFACES,
  MERIDIAN_SMOKE_LOG_WRITE_LANDED,
} from './meridianChecklistData.js';
import { defaultMeridianState } from './meridianStorage.js';
import { esc } from '../../shared/components/text.js';

function smokeLog(state) {
  return state.smokeLog || defaultMeridianState().smokeLog;
}

function optionList(values, current) {
  return values.map((value) => `<option value="${esc(value)}" ${current === value ? 'selected' : ''}>${esc(value)}</option>`).join('');
}

function assertionOptions(current) {
  return [
    '<option value="">NA</option>',
    ...MERIDIAN_SMOKE_LOG_ASSERTIONS.map((assertion) => (
      `<option value="${esc(assertion.id)}" ${current === assertion.id ? 'selected' : ''}>${esc(assertion.id)}</option>`
    )),
  ].join('');
}

function renderSessionField(field, session) {
  const value = session[field.key] || '';
  if (field.multiline) {
    return `
      <label class="smoke-log-field is-wide" for="smoke-session-${field.key}">
        <span>${esc(field.label)}</span>
        <textarea id="smoke-session-${field.key}" data-smoke-session-field="${field.key}" placeholder="${esc(field.placeholder)}">${esc(value)}</textarea>
      </label>
    `;
  }
  return `
    <label class="smoke-log-field" for="smoke-session-${field.key}">
      <span>${esc(field.label)}</span>
      <input id="smoke-session-${field.key}" data-smoke-session-field="${field.key}" value="${esc(value)}" placeholder="${esc(field.placeholder)}" />
    </label>
  `;
}

function renderSmokeRow(row, index) {
  const rowId = row.rowId || row.id || `row-${index}`;
  return `
    <article class="smoke-log-row" data-smoke-row-index="${index}">
      <div class="smoke-log-row-head">
        <label class="smoke-log-field smoke-log-id" for="smoke-row-id-${index}">
          <span>ID</span>
          <input id="smoke-row-id-${index}" data-smoke-row-field="id" value="${esc(row.id || '')}" placeholder="PR7-A${index + 1}" />
        </label>
        <label class="smoke-log-field" for="smoke-row-surface-${index}">
          <span>Surface</span>
          <select id="smoke-row-surface-${index}" data-smoke-row-field="surface">${optionList(MERIDIAN_SMOKE_LOG_SURFACES, row.surface || 'app')}</select>
        </label>
        <label class="smoke-log-field" for="smoke-row-result-${index}">
          <span>Result</span>
          <select id="smoke-row-result-${index}" data-smoke-row-field="result">${optionList(MERIDIAN_SMOKE_LOG_RESULTS, row.result || 'NA')}</select>
        </label>
        <label class="smoke-log-field" for="smoke-row-write-${index}">
          <span>WriteLanded</span>
          <select id="smoke-row-write-${index}" data-smoke-row-field="writeLanded">${optionList(MERIDIAN_SMOKE_LOG_WRITE_LANDED, row.writeLanded || 'N')}</select>
        </label>
        <label class="smoke-log-field" for="smoke-row-source-${index}">
          <span>Source</span>
          <select id="smoke-row-source-${index}" data-smoke-row-field="source">${optionList(MERIDIAN_SMOKE_LOG_SOURCES, row.source || 'NA')}</select>
        </label>
        <label class="smoke-log-field" for="smoke-row-excluded-${index}">
          <span>Excluded</span>
          <select id="smoke-row-excluded-${index}" data-smoke-row-field="excluded">${optionList(MERIDIAN_SMOKE_LOG_EXCLUDED, row.excluded || 'NA')}</select>
        </label>
        <label class="smoke-log-field" for="smoke-row-assertion-${index}">
          <span>Assert#</span>
          <select id="smoke-row-assertion-${index}" data-smoke-row-field="assertion">${assertionOptions(row.assertion || '')}</select>
        </label>
        <button class="btn btn-secondary smoke-log-remove" type="button" data-smoke-row-remove="${esc(rowId)}" aria-label="Remove smoke row ${index + 1}">Remove</button>
      </div>
      <div class="smoke-log-row-body">
        ${renderRowTextarea(index, 'action', 'Action', 'Smoke action taken', row.action)}
        ${renderRowTextarea(index, 'expected', 'Expected', 'Expected behavior', row.expected)}
        ${renderRowTextarea(index, 'observed', 'Observed', 'Observed behavior', row.observed)}
        ${renderRowTextarea(index, 'console', 'Console', 'Console output or none', row.console)}
        ${renderRowTextarea(index, 'evidence', 'Evidence', 'Screenshot, log, report, query, or link', row.evidence)}
      </div>
    </article>
  `;
}

function renderRowTextarea(index, key, label, placeholder, value = '') {
  return `
    <label class="smoke-log-field" for="smoke-row-${key}-${index}">
      <span>${esc(label)}</span>
      <textarea id="smoke-row-${key}-${index}" data-smoke-row-field="${key}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>
    </label>
  `;
}

export function renderMeridianSmokeLog({ state }) {
  const log = smokeLog(state);
  const session = log.session || {};
  const rows = Array.isArray(log.rows) ? log.rows : [];
  return `
    <section class="session-panel meridian-smoke-log-panel" aria-labelledby="smoke-log-title">
      <div class="session-head">
        <div>
          <div class="panel-label">PR #7 Smoke Log</div>
          <h2 id="smoke-log-title">Scoped hybrid auto-close capture</h2>
        </div>
        <div class="smoke-log-actions">
          <button class="btn btn-secondary" id="btn-smoke-log-add-row" type="button">Add Row</button>
          <button class="btn btn-secondary" id="btn-smoke-log-copy" type="button">Copy Smoke Log</button>
          <button class="btn btn-primary" id="btn-smoke-log-save-report" type="button">Save Grid Report</button>
        </div>
      </div>
      <div class="smoke-log-session-grid" aria-label="Smoke log session header fields">
        ${MERIDIAN_SMOKE_LOG_SESSION_FIELDS.map((field) => renderSessionField(field, session)).join('')}
      </div>
      <div class="assertion-panel" aria-labelledby="assertion-title">
        <h3 id="assertion-title">Assertion reference</h3>
        <ol>
          ${MERIDIAN_SMOKE_LOG_ASSERTIONS.map((assertion) => `<li><strong>${esc(assertion.id)}</strong> ${esc(assertion.label)}</li>`).join('')}
        </ol>
      </div>
      <div class="smoke-log-rows" aria-label="Per-item smoke rows">
        ${rows.map(renderSmokeRow).join('')}
      </div>
    </section>
  `;
}
