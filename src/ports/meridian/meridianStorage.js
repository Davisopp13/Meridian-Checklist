import { GRID_KEYS, LEGACY_MERIDIAN_KEY } from '../../grid/settings/storageKeys.js';
import { MERIDIAN_SMOKE_LOG_ASSERTIONS } from './meridianChecklistData.js';

function defaultSmokeLogRows() {
  return MERIDIAN_SMOKE_LOG_ASSERTIONS.map((assertion) => ({
    id: `PR7-A${assertion.id}`,
    surface: 'app',
    action: '',
    expected: assertion.label,
    observed: '',
    result: 'NA',
    writeLanded: 'N',
    source: 'NA',
    excluded: 'NA',
    console: '',
    evidence: '',
    assertion: assertion.id,
  }));
}

function defaultSmokeLog() {
  return {
    session: {
      dateTime: new Date().toISOString(),
      testerCohort: '',
      liveDbRef: '',
      gridDeploySha: '',
      meridianPrBranchHeadSha: '',
      passiveCloseLiveActual: '',
      hybridAutoCloseLiveActual: '',
      migration099Trigger: '',
      cohortScopeAllowSet: '',
    },
    rows: defaultSmokeLogRows(),
  };
}

export function defaultMeridianState() {
  return {
    items: {},
    audit: { verdict: 'not-run', notes: '' },
    run: { tester: '', environmentUrl: '' },
    smokeLog: defaultSmokeLog(),
    decision: { verdict: null, notes: '' },
    savedAt: null,
  };
}

export function loadMeridianState() {
  const defaults = defaultMeridianState();

  try {
    const raw = localStorage.getItem(GRID_KEYS.meridianChecklist)
      || localStorage.getItem(LEGACY_MERIDIAN_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      items: parsed.items || defaults.items,
      audit: { ...defaults.audit, ...(parsed.audit || {}) },
      run: { ...defaults.run, ...(parsed.run || {}) },
      smokeLog: {
        ...defaults.smokeLog,
        ...(parsed.smokeLog || {}),
        session: { ...defaults.smokeLog.session, ...(parsed.smokeLog?.session || {}) },
        rows: Array.isArray(parsed.smokeLog?.rows) && parsed.smokeLog.rows.length
          ? parsed.smokeLog.rows
          : defaults.smokeLog.rows,
      },
      decision: { ...defaults.decision, ...(parsed.decision || {}) },
    };
  } catch {
    return defaults;
  }
}

export function persistMeridianState(state) {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(GRID_KEYS.meridianChecklist, JSON.stringify(state));
  localStorage.setItem(GRID_KEYS.meridianAudit, JSON.stringify(state.audit || defaultMeridianState().audit));
  localStorage.setItem(GRID_KEYS.meridianMetadata, JSON.stringify(state.run || defaultMeridianState().run));
}

export function clearMeridianState() {
  localStorage.removeItem(GRID_KEYS.meridianChecklist);
  localStorage.removeItem(GRID_KEYS.meridianAudit);
  localStorage.removeItem(GRID_KEYS.meridianMetadata);
}

export function getMeridianExports() {
  try {
    const raw = localStorage.getItem(GRID_KEYS.meridianExports);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMeridianExport(markdown) {
  const exports = getMeridianExports();
  const entry = {
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `export-${Date.now()}`,
    port: 'meridian-port',
    title: 'Meridian smoke export',
    markdown,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...exports].slice(0, 20);
  localStorage.setItem(GRID_KEYS.meridianExports, JSON.stringify(next));
  return entry;
}

export function clearMeridianExports() {
  localStorage.removeItem(GRID_KEYS.meridianExports);
}
