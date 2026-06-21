import { esc } from '../shared/components/text.js';

export function renderGridStatusBar({
  activeProject,
  auditLabel,
  decisionLabel,
  inboxCount,
  nextLabel,
  savedAt,
  totals,
}) {
  return `
    <aside class="grid-status-bar" aria-label="Command Center">
      <div class="grid-status-title">
        <span>Command Center</span>
        <strong>${esc(activeProject.name)}</strong>
      </div>
      <div class="grid-status-cluster">
        <div class="grid-status-cell is-port">
          <span>Next open</span>
          <strong id="shell-next-label">${esc(nextLabel || 'All smoke items tested')}</strong>
        </div>
        <div class="grid-status-cell">
          <span>Audit verdict</span>
          <strong id="shell-audit-label">${esc(auditLabel)}</strong>
        </div>
        <div class="grid-status-cell">
          <span>Smoke status</span>
          <strong id="shell-progress-label">${totals.tested}/${totals.total} tested</strong>
        </div>
        <div class="grid-status-cell">
          <span>Final decision</span>
          <strong id="shell-decision-label">${esc(decisionLabel)}</strong>
        </div>
        <div class="grid-status-cell">
          <span>Audio inbox</span>
          <strong id="shell-inbox-label">${inboxCount} item${inboxCount === 1 ? '' : 's'}</strong>
        </div>
      </div>
      <div class="grid-status-actions">
        <span class="last-saved" id="last-saved">${savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString()}` : 'Not yet saved'}</span>
        <button class="btn btn-primary btn-export-summary" id="btn-export" type="button">Export Summary</button>
        <button class="btn btn-danger-subtle" id="btn-reset" type="button">Reset Meridian Port</button>
      </div>
    </aside>
  `;
}
