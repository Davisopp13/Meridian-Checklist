import { esc } from '../shared/components/text.js';

export function renderGridNav({ items, activeModuleId }) {
  return `
    <nav class="grid-nav" aria-label="Module navigation" role="tablist">
      ${items.map((item) => `
        <button
          class="grid-nav-btn${activeModuleId === item.id ? ' is-active' : ''}${item.disabled ? ' is-disabled' : ''}"
          type="button"
          role="tab"
          data-module-id="${item.id}"
          aria-selected="${activeModuleId === item.id}"
          aria-controls="top"
          ${item.disabled ? 'disabled aria-disabled="true"' : ''}
        >${esc(item.label)}</button>
      `).join('')}
    </nav>
  `;
}
