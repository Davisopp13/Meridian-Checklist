import { renderGridNav } from './GridNav.js';
import { renderGridStatusBar } from './GridStatusBar.js';
import { renderPortSwitcher } from './PortSwitcher.js';
import { esc } from '../shared/components/text.js';

export function renderGridShell({
  activePortId,
  activeView,
  activeModuleName,
  content,
  navItems,
  project,
  projects,
  status,
}) {
  const moduleSuffix = activeModuleName ? ` / ${esc(activeModuleName)}` : '';

  return `
    <div class="grid-shell">
      <header class="grid-header">
        <div class="grid-header-top">
          <a class="brand grid-brand" href="#top" aria-label="The Grid command home">
            <span class="grid-brand-glyph" aria-hidden="true"></span>
            <span>
              <span class="brand-name">The Grid</span>
              <span class="brand-subtitle">Human command surface${moduleSuffix}</span>
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
        ${renderGridNav({ items: navItems, activeView })}
      </header>

      ${renderPortSwitcher({ projects, activePortId, status })}
      ${renderGridStatusBar({ activeProject: project, ...status })}

      <main class="layout grid-layout" id="top">
        ${content}
      </main>

      <div class="toast" id="toast">Copied to clipboard</div>
    </div>
  `;
}
