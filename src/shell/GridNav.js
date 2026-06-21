import { esc } from '../shared/components/text.js';

export function renderGridNav({ items, activeView }) {
  return `
    <nav class="grid-nav" aria-label="Grid navigation" role="tablist">
      ${items.map((item) => `
        <button
          class="grid-nav-btn${activeView === item.id ? ' is-active' : ''}${item.disabled ? ' is-disabled' : ''}"
          type="button"
          role="tab"
          data-grid-view="${item.id}"
          aria-selected="${activeView === item.id}"
          aria-controls="top"
          ${item.disabled ? 'disabled aria-disabled="true"' : ''}
        >${esc(item.label)}</button>
      `).join('')}
    </nav>
  `;
}
