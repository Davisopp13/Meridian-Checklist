import { GRID_STORAGE_KEYS } from './storageKeys.js';

export function exportGridData() {
  const data = {};
  GRID_STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) data[key] = value;
  });
  return {
    exportedAt: new Date().toISOString(),
    keys: data,
  };
}

export function importGridData(payload) {
  if (!payload || typeof payload !== 'object' || !payload.keys) {
    throw new Error('Invalid Grid export JSON');
  }

  Object.entries(payload.keys).forEach(([key, value]) => {
    if (GRID_STORAGE_KEYS.includes(key) && typeof value === 'string') {
      localStorage.setItem(key, value);
    }
  });
}

export function clearGridLocalData() {
  GRID_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}
