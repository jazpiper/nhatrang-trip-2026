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

  function loadFromStorage(key, fallback) {
    if (!hasStorage()) return fallback;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return fallback;
    }
  }

  function saveToStorage(key, val) {
    if (!hasStorage()) return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

