import { renderGridNav } from './GridNav.js';
import { renderGridStatusBar } from './GridStatusBar.js';
import { renderPortSwitcher } from './PortSwitcher.js';
import { esc } from '../shared/components/text.js';

export function renderGridShell({
  activePortId,
  activeView,
  content,
  navItems,
  project,
  projects,
  status,
}) {
  return `
    <div class="grid-shell">
      <header class="grid-header">
        <a class="brand grid-brand" href="#top" aria-label="The Grid command home">
          <span class="grid-brand-glyph" aria-hidden="true"></span>
          <span>
            <span class="brand-name">The Grid</span>
            <span class="brand-subtitle">Human command surface / ${esc(project.name)}</span>
          </span>
        </a>
        <div class="header-meta" aria-label="Grid status">
          <button class="install-btn" id="btn-install" type="button" hidden title="Install The Grid as a local PWA">Install app</button>
          <span class="meta-pill" title="Browser connectivity and offline cache status">
            <span>Connection</span>
            <strong class="pwa-state" id="pwa-state">Online</strong>
          </span>
          <span class="meta-pill" title="You are using The Grid shell, not a project module">
            <span>Layer</span>
            <strong>Grid shell</strong>
          </span>
          <span class="meta-pill" title="MVP data is stored locally in this browser">
            <span>Storage</span>
            <strong>Local-first</strong>
          </span>
          <span class="meta-pill muted" title="Hermes still handles agent/runtime work outside this static PWA">
            <span>Runtime</span>
            <strong>Hermes</strong>
          </span>
        </div>
      </header>

      ${renderGridNav({ items: navItems, activeView })}
      ${renderPortSwitcher({ projects, activePortId, status })}
      ${renderGridStatusBar({ activeProject: project, ...status })}

      <main class="layout grid-layout" id="top">
        ${content}
      </main>

      <div class="toast" id="toast">Copied to clipboard</div>
    </div>
  `;
}
