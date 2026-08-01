export function readJsonStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

export function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readStringStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStringStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
