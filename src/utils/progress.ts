const PREFIX = 'inner-space:audio-progress:';

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readAudioProgress(sessionKey: string, storage: Storage | null = browserStorage()) {
  if (!storage) return 0;
  const value = Number(storage.getItem(`${PREFIX}${sessionKey}`));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function saveAudioProgress(sessionKey: string, seconds: number, storage: Storage | null = browserStorage()) {
  if (!storage || !Number.isFinite(seconds) || seconds < 5) return;
  storage.setItem(`${PREFIX}${sessionKey}`, String(Math.floor(seconds)));
}

export function clearAudioProgress(sessionKey: string, storage: Storage | null = browserStorage()) {
  storage?.removeItem(`${PREFIX}${sessionKey}`);
}

