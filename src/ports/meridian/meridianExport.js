import {
  MERIDIAN_AUDIT_OPTS,
  MERIDIAN_DECISION_OPTS,
  MERIDIAN_SECTIONS,
  MERIDIAN_SMOKE_LOG_ASSERTIONS,
  MERIDIAN_SMOKE_LOG_SESSION_FIELDS,
} from './meridianChecklistData.js';

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

function clean(value, fallback = '_Not recorded_') {
  const text = String(value || '').trim();
  return text || fallback;
}

function smokeLogRows(state) {
  return Array.isArray(state.smokeLog?.rows) ? state.smokeLog.rows : [];
}

function smokeLogCounts(rows) {
  return rows.reduce((count, row) => {
    if (row.result === 'PASS') count.pass += 1;
    else if (row.result === 'FAIL') count.fail += 1;
    else if (row.result === 'BLOCKED') count.blocked += 1;
    return count;
  }, { pass: 0, fail: 0, blocked: 0 });
}

export function buildMeridianSmokeLogExport({ state }) {
  const now = new Date().toISOString();
  const log = state.smokeLog || {};
  const session = log.session || {};
  const rows = smokeLogRows(state);
  const counts = smokeLogCounts(rows);
  const assertionMap = new Map(MERIDIAN_SMOKE_LOG_ASSERTIONS.map((assertion) => [assertion.id, assertion.label]));

  let md = '';
  md += '# Meridian Port - PR #7 Smoke Log\n';
  md += `**Exported:** ${now}\n\n`;
  md += '## Scope\n';
  md += '- Port: meridian\n';
  md += '- Type: smoke\n';
  md += '- Source: human\n';
  md += '- Capture surface: The Grid / Meridian Port only\n';
  md += '- Automation boundary: no audio automation and no two-way Hermes control\n\n';
  md += '## Session Header\n';
  MERIDIAN_SMOKE_LOG_SESSION_FIELDS.forEach((field) => {
    md += `- ${field.label}: ${clean(session[field.key])}\n`;
  });
  md += '\n';
  md += '## Result Counts\n';
  md += `- PASS: ${counts.pass}\n`;
  md += `- FAIL: ${counts.fail}\n`;
  md += `- BLOCKED: ${counts.blocked}\n\n`;
  md += '## Assertion Reference\n';
  MERIDIAN_SMOKE_LOG_ASSERTIONS.forEach((assertion) => {
    md += `${assertion.id}. ${assertion.label}\n`;
  });
  md += '\n';
  md += '## Smoke Rows\n\n';
  if (!rows.length) {
    md += '_No smoke rows recorded._\n\n';
  } else {
    rows.forEach((row, index) => {
      const assertion = row.assertion ? `${row.assertion} ${assertionMap.get(row.assertion) || ''}`.trim() : 'NA';
      md += `### ${clean(row.id, `Row ${index + 1}`)}\n`;
      md += `- Surface: ${clean(row.surface, 'NA')}\n`;
      md += `- Action: ${clean(row.action)}\n`;
      md += `- Expected: ${clean(row.expected)}\n`;
      md += `- Observed: ${clean(row.observed)}\n`;
      md += `- Result: ${clean(row.result, 'NA')}\n`;
      md += `- WriteLanded: ${clean(row.writeLanded, 'N')}\n`;
      md += `- Source: ${clean(row.source, 'NA')}\n`;
      md += `- Excluded: ${clean(row.excluded, 'NA')}\n`;
      md += `- Console: ${clean(row.console)}\n`;
      md += `- Evidence: ${clean(row.evidence)}\n`;
      md += `- Assert#: ${assertion}\n\n`;
    });
  }
  md += '---\n';
  md += '*This smoke log records the PR #7 scoped hybrid auto-close smoke only.*\n';
  return md;
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
  md += '## PR #7 Smoke Log Snapshot\n\n';
  md += `- Smoke rows: ${smokeLogRows(state).length}\n`;
  const smokePass = smokeLogRows(state).filter((row) => row.result === 'PASS').length;
  const smokeFail = smokeLogRows(state).filter((row) => row.result === 'FAIL').length;
  const smokeBlocked = smokeLogRows(state).filter((row) => row.result === 'BLOCKED').length;
  md += `- Smoke row results: ${smokePass} PASS, ${smokeFail} FAIL, ${smokeBlocked} BLOCKED\n`;
  md += '- Full smoke-log export is available from the PR #7 Smoke Log panel.\n\n';

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
