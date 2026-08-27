  // --- 1. Storage Helpers ---
  // Node test runners have no usable localStorage (and Node >= 22 exposes a stub that
  // throws), so feature-detect once instead of warning on every single key.
  function hasStorage() {
    try {
      return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';
    } catch (e) {
      return false;
    }
  }

  /**
   * Sanitizes deserialized localStorage data to prevent prototype pollution,
   * type confusion, and poisoned array/object properties.
   */
  function sanitizeStorageData(data, fallback) {
    if (data === null || data === undefined) {
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
        const cleanFallback = Object.create(null);
        Object.assign(cleanFallback, fallback);
        return cleanFallback;
      }
      return fallback;
    }

    if (Array.isArray(fallback)) {
      if (!Array.isArray(data)) return fallback.slice();
      return data
        .filter(item => typeof item === 'string' || typeof item === 'number')
        .slice(0, 500)
        .map(item => String(item).slice(0, 200));
    }

    if (typeof fallback === 'object' && fallback !== null) {
      const cleanObj = Object.create(null);
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        Object.assign(cleanObj, fallback);
        return cleanObj;
      }
      const entries = Object.entries(data).slice(0, 500);
      for (const [k, v] of entries) {
        if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
        const cleanKey = String(k).slice(0, 100);
        if (typeof v === 'string') {
          cleanObj[cleanKey] = v.slice(0, 5000);
        } else if (v !== null && v !== undefined && (typeof v === 'number' || typeof v === 'boolean')) {
          cleanObj[cleanKey] = String(v).slice(0, 5000);
        }
      }
      return cleanObj;
    }

    if (typeof fallback === 'string') {
      if (typeof data !== 'string') return fallback;
      return data.slice(0, 5000);
    }

    if (typeof fallback === 'number') {
      const num = Number(data);
      return isNaN(num) ? fallback : num;
    }

    if (typeof fallback === 'boolean') {
      return typeof data === 'boolean' ? data : fallback;
    }

    return fallback;
  }

  function loadFromStorage(key, fallback) {
    if (!hasStorage()) return sanitizeStorageData(null, fallback);
    try {
      if (typeof key !== 'string' || !key.startsWith('nha_trang_')) {
        console.warn('Blocked reading from non-namespaced storage key:', key);
        return sanitizeStorageData(null, fallback);
      }
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return sanitizeStorageData(null, fallback);
      const parsed = JSON.parse(raw);
      return sanitizeStorageData(parsed, fallback);
    } catch (e) {
      console.warn('LocalStorage load error for key "' + key + '":', e);
      return sanitizeStorageData(null, fallback);
    }
  }

  function saveToStorage(key, val) {
    if (!hasStorage()) return false;
    try {
      if (typeof key !== 'string' || !key.startsWith('nha_trang_')) {
        console.warn('Blocked writing to non-namespaced storage key:', key);
        return false;
      }
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      console.warn('LocalStorage save error for key "' + key + '":', e);
      return false;
    }
  }


