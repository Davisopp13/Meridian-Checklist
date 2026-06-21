import { MERIDIAN_AUDIT_OPTS, MERIDIAN_DECISION_OPTS, MERIDIAN_SECTIONS } from './meridianChecklistData.js';

function plainText(text) {
  return text.replace(/`([^`]+)`/g, '$1');
}

function itemEvidence(state, id) {
  const item = state.items[id] || {};
  return {
    caseNumber: item.caseNumber || '',
    evidenceLink: item.evidenceLink || '',
    testedAt: item.testedAt || '',
    notes: item.notes || '',
  };
}

function appendEvidence(md, evidence) {
  const lines = [];
  if (evidence.caseNumber.trim()) lines.push(`  - Case: ${evidence.caseNumber.trim()}`);
  if (evidence.evidenceLink.trim()) lines.push(`  - Evidence: ${evidence.evidenceLink.trim()}`);
  if (evidence.testedAt.trim()) lines.push(`  - Timestamp: ${evidence.testedAt.trim()}`);
  if (evidence.notes.trim()) lines.push(`  - Notes: ${evidence.notes.trim().replace(/\n/g, '\n    ')}`);
  return lines.length ? `${md}${lines.join('\n')}\n` : `${md}  - Evidence: _(none recorded)_\n`;
}

export function buildMeridianExport({ state, totals }) {
  const now = new Date().toISOString();
  const decision = state.decision || { verdict: null, notes: '' };
  const option = MERIDIAN_DECISION_OPTS.find((item) => item.id === decision.verdict);
  const audit = state.audit || { verdict: null, notes: '' };
  const auditOpt = MERIDIAN_AUDIT_OPTS.find((item) => item.id === audit.verdict);
  const run = state.run || { tester: '', environmentUrl: '' };
  const count = totals;

  let md = '';
  md += '# Meridian Port - Hybrid Auto-Close Smoke Test - PR #7\n';
  md += `**Exported:** ${now}\n\n`;
  md += '## Context\n';
  md += '- HYBRID_AUTO_CLOSE_LIVE: true (PR #7)\n';
  md += '- PASSIVE_CLOSE_LIVE: false (must remain off)\n';
  md += '- Scope: Davis / trusted cohort only - Hapag-Lloyd IDT Export Rail\n\n';
  md += '## Smoke Session\n';
  md += `- Tester: ${run.tester?.trim() || '_Not recorded_'}\n`;
  md += `- Environment URL: ${run.environmentUrl?.trim() || '_Not recorded_'}\n`;
  md += `- Fresh clone audit verdict: ${auditOpt ? auditOpt.label : '_Not recorded_'}\n`;
  if (audit.notes?.trim()) md += `- Fresh clone audit notes: ${audit.notes.trim().replace(/\n/g, '\n  ')}\n`;
  md += '\n';
  md += '## Summary\n';
  md += `- Pass: ${count.pass}\n`;
  md += `- Fail: ${count.fail}\n`;
  md += `- Blocked: ${count.blocked}\n`;
  md += `- Not tested: ${count.nt}\n`;
  md += `- Tested: ${count.tested}/${count.total} (${count.pct}%)\n\n`;
  md += '## Final Decision\n';
  md += `**Verdict:** ${option ? option.label : '_Not yet recorded_'}\n`;
  if (decision.notes?.trim()) md += `**Notes:** ${decision.notes.trim()}\n`;
  md += '\n';

  const badItems = [];
  MERIDIAN_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      const status = state.items[item.id]?.status || 'not-tested';
      if (status === 'fail' || status === 'blocked') {
        badItems.push({ section, item, status, evidence: itemEvidence(state, item.id) });
      }
    });
  });

  md += '## Failed / Blocked Items\n\n';
  if (!badItems.length) {
    md += '_None. All tested items passed or are not yet tested._\n\n';
  } else {
    let lastSectionId = null;
    badItems.forEach(({ section, item, status, evidence }) => {
      if (lastSectionId !== section.id) {
        md += `### ${section.num}. ${section.title}\n`;
        lastSectionId = section.id;
      }
      md += `- ${status.toUpperCase()} - ${plainText(item.text)}\n`;
      md = appendEvidence(md, evidence);
    });
    md += '\n';
  }

  const evidenceItems = [];
  MERIDIAN_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      const evidence = itemEvidence(state, item.id);
      const status = state.items[item.id]?.status || 'not-tested';
      const hasEvidence = ['caseNumber', 'evidenceLink', 'testedAt', 'notes']
        .some((key) => evidence[key]?.trim());
      if (hasEvidence && status !== 'not-tested') {
        evidenceItems.push({ section, item, status, evidence });
      }
    });
  });

  md += '## Recorded Smoke Evidence\n\n';
  if (!evidenceItems.length) {
    md += '_No item evidence recorded._\n\n';
  } else {
    evidenceItems.forEach(({ section, item, status, evidence }) => {
      md += `- ${section.num}.${section.items.indexOf(item) + 1} ${status.toUpperCase()} - ${plainText(item.text)}\n`;
      md = appendEvidence(md, evidence);
    });
    md += '\n';
  }

  md += '---\n';
  md += '*This checklist validates the scoped hybrid auto-close trial only.*\n';
  md += '*Do not use as proof of broad PASSIVE_CLOSE_LIVE readiness.*\n';

  return md;
}
