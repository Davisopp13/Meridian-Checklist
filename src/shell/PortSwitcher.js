import { esc } from '../shared/components/text.js';

export function renderPortSwitcher({ projects, activePortId, status }) {
  const activeProject = projects.find((project) => project.id === activePortId) || projects[0];
  const totals = status?.totals || { tested: 0, total: 0 };

  return `
    <section class="port-switcher" aria-label="Active project port">
      <div class="port-switcher-active">
        <span class="port-switcher-icon" aria-hidden="true">
          <img src="${esc(activeProject.icon || '/meridian-checklist-icon.svg')}" alt="" />
        </span>
        <span>
          <span class="port-switcher-label">Docked module</span>
          <strong>${esc(activeProject.name)}</strong>
          <em>${esc(activeProject.summary)}</em>
        </span>
      </div>
      <label class="port-switcher-control" for="port-switcher-select">
        <span>Switch module</span>
        <select id="port-switcher-select">
          ${projects.map((project) => `
            <option value="${esc(project.id)}" ${project.id === activePortId ? 'selected' : ''}>
              ${esc(project.name)}
            </option>
          `).join('')}
        </select>
      </label>
      <div class="port-switcher-meta">
        <button class="btn btn-secondary btn-open-port" type="button" data-grid-view="ports">Open checklist</button>
        <span class="port-chip is-active">${esc(activeProject.status)} module</span>
        <span class="port-chip">Audit: ${esc(status?.auditLabel || 'Not run')}</span>
        <span class="port-chip">Smoke: ${totals.tested}/${totals.total}</span>
      </div>
    </section>
  `;
}
