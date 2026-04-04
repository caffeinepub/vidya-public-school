// Safe localStorage wrapper -- ICP sandboxed iframes may deny localStorage access
function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // silently ignore
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
}

export const safeStorage = { get: safeGet, set: safeSet, remove: safeRemove };
