export function renderMeridianOverview() {
  return `
    <section class="scope-banner port-scope" role="status">
      <div class="scope-kicker">Meridian Port guardrail</div>
      <div>This port validates PR #7 only. Do not use it as broad <code>PASSIVE_CLOSE_LIVE</code> readiness evidence.</div>
      <button class="audit-copy-btn" id="btn-audit-top" type="button">Copy Final Fresh Clone Audit Prompt</button>
    </section>
    <section class="hero meridian-hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <div class="meridian-bay-mark" aria-hidden="true">
          <img src="/meridian-checklist-icon.svg" alt="" />
          <span>Readiness bay</span>
        </div>
        <div class="eyebrow">Davis / trusted cohort only</div>
        <h1 id="page-title">Scoped hybrid auto-close validation</h1>
        <p>Hapag-Lloyd IDT Export Rail smoke checklist for confirming passive close behavior while keeping the broad passive close flag off.</p>
      </div>
      <aside class="status-panel" aria-label="Feature flags">
        <div class="flag-row"><span>HYBRID_AUTO_CLOSE_LIVE</span><strong>true</strong></div>
        <div class="flag-row critical"><span>PASSIVE_CLOSE_LIVE</span><strong>false</strong></div>
        <div class="flag-note">Must remain false through the entire trial.</div>
      </aside>
    </section>
  `;
}
