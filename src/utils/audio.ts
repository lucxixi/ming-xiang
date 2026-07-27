let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playBell(freq = 528, duration = 1.5, gain = 0.25) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.connect(g);
    g.connect(ac.destination);
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.type = 'sine';
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(gain, ac.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch {
    return;
  }
}

export function playBreathIn() { playBell(396, 0.6, 0.12); }
export function playBreathOut() { playBell(264, 0.8, 0.10); }

export function playChime() {
  playBell(528, 2.0, 0.22);
  setTimeout(() => playBell(660, 1.5, 0.15), 180);
  setTimeout(() => playBell(792, 1.2, 0.10), 380);
}

export function playClick() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.connect(g);
    g.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.1);
    g.gain.setValueAtTime(0.18, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.15);
  } catch {
    return;
  }
}

export function playRelease() {
  try {
    const ac = getCtx();
    [440, 554, 660].forEach((freq, i) => {
      setTimeout(() => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.connect(g);
        g.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ac.currentTime);
        g.gain.setValueAtTime(0.13, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.0);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 1.0);
      }, i * 100);
    });
  } catch {
    return;
  }
}

export function playScanTone(regionIndex: number) {
  const freqs = [396, 417, 440, 528, 396, 417, 528];
  playBell(freqs[regionIndex % freqs.length] ?? 440, 1.2, 0.14);
}
