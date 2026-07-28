import { describe, expect, it } from 'vitest';
import { clearAudioProgress, readAudioProgress, saveAudioProgress } from './progress';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('audio progress storage', () => {
  it('stores useful progress and clears completed sessions', () => {
    const storage = new MemoryStorage();
    saveAudioProgress('lying', 72.8, storage);
    expect(readAudioProgress('lying', storage)).toBe(72);
    clearAudioProgress('lying', storage);
    expect(readAudioProgress('lying', storage)).toBe(0);
  });

  it('ignores accidental starts shorter than five seconds', () => {
    const storage = new MemoryStorage();
    saveAudioProgress('body', 3, storage);
    expect(readAudioProgress('body', storage)).toBe(0);
  });
});

