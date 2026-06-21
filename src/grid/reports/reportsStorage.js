import { GRID_KEYS } from '../settings/storageKeys.js';

export function loadReports() {
  try {
    const raw = localStorage.getItem(GRID_KEYS.reports);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistReports(reports) {
  localStorage.setItem(GRID_KEYS.reports, JSON.stringify(reports));
}

export function saveReport({ port, title, body }) {
  const reports = loadReports();
  const entry = {
    id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `report-${Date.now()}`,
    port,
    title,
    body,
    createdAt: new Date().toISOString(),
  };
  persistReports([entry, ...reports].slice(0, 30));
  return entry;
}

export function clearReports() {
  localStorage.removeItem(GRID_KEYS.reports);
}
