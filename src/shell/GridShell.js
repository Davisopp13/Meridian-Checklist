import { renderGridNav } from './GridNav.js';
import { renderGridStatusBar } from './GridStatusBar.js';
import { esc } from '../shared/components/text.js';

function renderModuleMark(module) {
  if (module?.icon) {
    return `
      <span class="brand-module-icon" aria-hidden="true">
        <img src="${esc(module.icon)}" alt="" />
      </span>
    `;
  }
  return '<img src="/tron-logo.png" alt="" class="grid-brand-logo" aria-hidden="true" />';
}

export function renderGridShell({
  activeModule,
  activeModuleId,
  content,
  modules,
  project,
  status,
}) {
  const brandName = activeModule?.name ? esc(activeModule.name) : 'The Grid';
  const isMeridianModule = activeModuleId === 'meridian-port';

  return `
    <div class="grid-shell">
      <header class="grid-header">
        <div class="grid-header-top">
          <a class="brand grid-brand" href="#top" aria-label="The Grid command home">
            ${renderModuleMark(activeModule)}
            <span>
              <span class="brand-name">${brandName}</span>
              <span class="brand-subtitle">Human command surface</span>
            </span>
          </a>
          <div class="header-meta" aria-label="Grid status">
            <button class="install-btn" id="btn-install" type="button" hidden title="Install The Grid as a local PWA">Install app</button>
            <span class="header-status-line">
              <strong class="pwa-state" id="pwa-state">Online</strong>
              <span>Local-first</span>
              <span>Hermes runtime</span>
            </span>
          </div>
        </div>
        ${renderGridNav({
          items: modules.map((module) => ({ id: module.id, label: module.name })),
          activeModuleId,
        })}
      </header>

      ${isMeridianModule ? renderGridStatusBar({ activeProject: project, ...status }) : ''}

      <main class="layout grid-layout" id="top">
        ${content}
      </main>

      <div class="toast" id="toast">Copied to clipboard</div>
    </div>
  `;
}
