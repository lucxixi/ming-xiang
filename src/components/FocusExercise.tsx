import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ChevronRight, SkipForward, Minus, Plus } from 'lucide-react';
import { playChime, playClick, playRelease } from '../utils/audio';

interface FocusExerciseProps {
  onComplete: () => void;
}

const PRESETS = [
  { label: '1 分钟', value: 60 },
  { label: '2 分钟', value: 120 },
  { label: '5 分钟', value: 300 },
];

export default function FocusExercise({ onComplete }: FocusExerciseProps) {
  const [running, setRunning] = useState(false);
  const [target, setTarget] = useState(60);
  const [seconds, setSeconds] = useState(0);
  const [distractions, setDistractions] = useState(0);
  const [done, setDone] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'in' | 'out'>('in');
  const [showSetup, setShowSetup] = useState(true);
  const [returnFlash, setReturnFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAll = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathRef.current) clearInterval(breathRef.current);
  };

  const finishSession = () => {
    stopAll();
    setRunning(false);
    setDone(true);
    playChime();
  };

  const startSession = () => {
    setShowSetup(false);
    setSeconds(0);
    setDistractions(0);
    setDone(false);
    setBreathPhase('in');
    playClick();
    setRunning(true);
  };

  const reset = () => {
    stopAll();
    setRunning(false);
    setSeconds(0);
    setDistractions(0);
    setDone(false);
    setShowSetup(true);
    playClick();
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s + 1 >= target) { finishSession(); return target; }
        return s + 1;
      });
    }, 1000);
    breathRef.current = setInterval(() => {
      setBreathPhase(p => p === 'in' ? 'out' : 'in');
    }, 4000);
    return stopAll;
  }, [running, target]);

  const handleDistraction = () => {
    setDistractions(d => d + 1);
    playRelease();
    setReturnFlash(true);
    setTimeout(() => setReturnFlash(false), 600);
  };

  const pct = seconds / target;
  const remaining = target - seconds;
  const elapsed = seconds;
  const focusScore = Math.max(0, 100 - distractions * 6);
  const scoreColor = focusScore >= 80 ? '#7dd6a8' : focusScore >= 50 ? 'var(--accent)' : '#e87676';

  return (
    <div className="min-h-screen px-4 py-24 max-w-2xl mx-auto flex flex-col">
      <div className="fade-in-up mb-8">
        <div className="text-xs tracking-widest mb-3 font-medium" style={{ color: 'var(--primary)' }}>MODULE 05</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          烛火专注冥想
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>
          凝视火焰，让它成为注意力的锚点。<br/>
          思绪飘走时，按"回来了"——这是冥想中最重要的动作。
        </p>
      </div>

      {/* Setup panel */}
      {showSetup && (
        <div className="rounded-2xl p-6 mb-8 fade-in-up-delay-1"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--text)' }}>选择练习时长</p>
          <div className="flex gap-3 mb-5 flex-wrap">
            {PRESETS.map(p => (
              <button key={p.value} onClick={() => setTarget(p.value)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: target === p.value ? 'var(--primary-glow)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${target === p.value ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                  color: target === p.value ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>自定义时长</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setTarget(t => Math.max(30, t - 30))}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <Minus size={13} />
              </button>
              <span className="text-sm tabular-nums w-16 text-center" style={{ color: 'var(--text)' }}>
                {Math.floor(target / 60)}:{String(target % 60).padStart(2, '0')}
              </span>
              <button onClick={() => setTarget(t => Math.min(600, t + 30))}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <Plus size={13} />
              </button>
            </div>
          </div>
          <button onClick={startSession}
            className="w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #f0c060, #d4a030)', color: '#1a0a00', boxShadow: '0 0 20px rgba(240,192,96,0.35)' }}>
            开始专注冥想
          </button>
        </div>
      )}

      {/* Session view */}
      {!showSetup && (
        <div className="flex flex-col items-center fade-in-up">
          {/* Candle */}
          <div className="relative flex flex-col items-center mb-4" style={{ height: 190 }}>
            {(running || done) && (
              <div className="candle-glow absolute rounded-full pointer-events-none"
                style={{ width: 90, height: 90, top: 8, left: '50%', transform: 'translateX(-50%)', background: 'transparent' }} />
            )}
            <div className="candle-flame" style={{ marginBottom: -4 }}>
              <svg width="48" height="72" viewBox="0 0 48 72">
                <defs>
                  <radialGradient id="fg2" cx="50%" cy="80%" r="60%">
                    <stop offset="0%" stopColor="#fff7e6" />
                    <stop offset="30%" stopColor="#ffcc44" />
                    <stop offset="70%" stopColor="#ff8822" />
                    <stop offset="100%" stopColor="#ff4400" stopOpacity="0.8" />
                  </radialGradient>
                </defs>
                <path d="M24 70 C8 70 2 52 2 42 C2 28 12 16 18 8 C20 4 22 0 24 0 C26 0 28 4 30 8 C36 16 46 28 46 42 C46 52 40 70 24 70Z" fill="url(#fg2)" opacity="0.9" />
              </svg>
            </div>
            <div className="candle-flame-inner absolute z-20" style={{ top: 20 }}>
              <svg width="20" height="42" viewBox="0 0 20 42">
                <defs>
                  <radialGradient id="ig2" cx="50%" cy="90%" r="60%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#fffbe6" />
                    <stop offset="100%" stopColor="#ffd060" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
                <path d="M10 40 C3 40 1 30 1 24 C1 16 6 8 10 2 C14 8 19 16 19 24 C19 30 17 40 10 40Z" fill="url(#ig2)" opacity="0.95" />
              </svg>
            </div>
            <div className="relative z-10 rounded-t-sm"
              style={{ width: 36, height: 75, background: 'linear-gradient(to right, #f5f0e8, #fff8f0, #ede5d5)', boxShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
              <div className="absolute -left-1 top-3 w-2 h-5 rounded-b-full" style={{ background: 'linear-gradient(to bottom, #f5f0e8, transparent)' }} />
              <div className="absolute right-1 top-5 w-1.5 h-4 rounded-b-full" style={{ background: 'linear-gradient(to bottom, #f5f0e8, transparent)' }} />
            </div>
            <div className="relative z-10 rounded-full"
              style={{ width: 58, height: 8, background: 'linear-gradient(to bottom, #c8b89a, #a89070)', boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }} />
            {running && (
              <div className="mt-3 text-xs transition-all duration-1000"
                style={{ color: breathPhase === 'in' ? 'rgba(255,200,100,0.75)' : 'rgba(150,200,255,0.7)' }}>
                {breathPhase === 'in' ? '缓缓吸气...' : '轻轻呼气...'}
              </div>
            )}
          </div>

          {/* Timer ring */}
          <div className="relative mb-6" style={{ width: 110, height: 110 }}>
            <svg width="110" height="110" viewBox="0 0 110 110" className="absolute inset-0 -rotate-90">
              <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              <circle cx="55" cy="55" r="48" fill="none"
                stroke={done ? '#7dd6a8' : 'var(--accent)'}
                strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 48}`}
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct)}`}
                style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 5px ${done ? '#7dd6a8' : 'var(--accent)'})` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {done ? (
                <CheckCircle size={28} style={{ color: '#7dd6a8' }} />
              ) : (
                <>
                  <span className="text-xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                    {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>剩余</span>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full mb-5">
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-xl font-bold mb-0.5 tabular-nums" style={{ color: 'var(--text)' }}>{distractions}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>走神次数</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-xl font-bold mb-0.5 tabular-nums" style={{ color: scoreColor }}>{focusScore}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>专注得分</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="text-xl font-bold mb-0.5 tabular-nums" style={{ color: 'var(--primary)' }}>
                {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>已练习</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap justify-center mb-4">
            <button onClick={reset}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <RotateCcw size={15} />
            </button>
            {!done && (
              <button onClick={() => { playClick(); setRunning(r => !r); }}
                className="flex items-center gap-2 px-7 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: running ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, #f0c060, #d4a030)',
                  color: running ? 'var(--text)' : '#1a0a00',
                  border: running ? '1px solid var(--border)' : 'none',
                  boxShadow: running ? 'none' : '0 0 22px rgba(240,192,96,0.4)',
                }}>
                {running ? <><Pause size={15} /> 暂停</> : <><Play size={15} /> 继续</>}
              </button>
            )}
            {running && (
              <button onClick={handleDistraction}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
                style={{
                  background: returnFlash ? 'rgba(240,192,96,0.25)' : 'rgba(240,192,96,0.1)',
                  border: `1px solid ${returnFlash ? 'rgba(240,192,96,0.6)' : 'rgba(240,192,96,0.3)'}`,
                  color: 'var(--accent)',
                  boxShadow: returnFlash ? '0 0 16px rgba(240,192,96,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}>
                回来了 ↩
              </button>
            )}
            {running && (
              <button onClick={finishSession}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
                title="提前结束">
                <SkipForward size={15} />
              </button>
            )}
          </div>

          <div className="rounded-xl px-4 py-3 mb-4 w-full"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>
              <span style={{ color: 'var(--accent)' }}>走神 ≠ 失败。</span>
              每次意识到走神并按"回来了"，就是一次成功的注意力训练。
            </p>
          </div>

          {done && (
            <div className="w-full space-y-3 fade-in-up">
              <div className="text-center py-4 rounded-2xl"
                style={{ background: 'rgba(125,214,168,0.07)', border: '1px solid rgba(125,214,168,0.2)' }}>
                <div className="text-2xl mb-2">🕯️</div>
                <p className="text-sm font-medium mb-1" style={{ color: '#7dd6a8' }}>
                  {focusScore >= 80 ? '专注力很棒！' : focusScore >= 50 ? '做得不错！' : '每次练习都是进步'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  专注了 {Math.floor(elapsed / 60)}分{elapsed % 60}秒 · 走神 {distractions} 次 · 得分 {focusScore}
                </p>
              </div>
              <button onClick={onComplete}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all duration-300"
                style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                <CheckCircle size={16} />
                继续下一课
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
