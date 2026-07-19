import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ChevronRight, SkipForward } from 'lucide-react';
import { playBreathIn, playBreathOut, playChime, playClick } from '../utils/audio';

interface BreathingExerciseProps {
  onComplete: () => void;
}

type Phase = 'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2';

const PHASES: { phase: Phase; label: string; subLabel: string; duration: number; color: string }[] = [
  { phase: 'inhale', label: '吸气',  subLabel: '用鼻子缓缓深吸一口气',    duration: 4, color: '#5bc4e8' },
  { phase: 'hold1',  label: '屏息',  subLabel: '轻轻憋住，放松肩膀',       duration: 4, color: '#f0c060' },
  { phase: 'exhale', label: '呼气',  subLabel: '用嘴慢慢把气完全呼出',     duration: 4, color: '#7dd6a8' },
  { phase: 'hold2',  label: '屏息',  subLabel: '感受呼出后的那份平静',     duration: 4, color: '#c4a8e8' },
];

const TOTAL_CYCLES = 4;

export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [scale, setScale] = useState(0.55);
  const [done, setDone] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimeRef = useRef(0);
  const prevPhaseRef = useRef(-1);

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetAll = useCallback(() => {
    stopTimer();
    setRunning(false);
    setPhaseIndex(0);
    setCountdown(4);
    setCycles(0);
    setScale(0.55);
    setDone(false);
    setCanSkip(false);
    phaseTimeRef.current = 0;
    prevPhaseRef.current = -1;
    playClick();
  }, []);

  const finishSession = useCallback((cyclesDone: number) => {
    stopTimer();
    setRunning(false);
    setDone(true);
    playChime();
    if ('speechSynthesis' in window) {
      const msg = cyclesDone >= TOTAL_CYCLES
        ? '很棒，你完成了四轮方框呼吸！'
        : `完成了${cyclesDone}轮练习，感受身体的放松。`;
      const utter = new SpeechSynthesisUtterance(msg);
      utter.lang = 'zh-CN';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  useEffect(() => {
    if (!running) return;

    if (prevPhaseRef.current !== phaseIndex) {
      prevPhaseRef.current = phaseIndex;
      const ph = PHASES[phaseIndex].phase;
      if (ph === 'inhale') playBreathIn();
      else if (ph === 'exhale') playBreathOut();
    }

    intervalRef.current = setInterval(() => {
      phaseTimeRef.current += 1;
      const cur = PHASES[phaseIndex];
      const remaining = cur.duration - phaseTimeRef.current;
      setCountdown(remaining > 0 ? remaining : 0);

      const pct = phaseTimeRef.current / cur.duration;
      if (cur.phase === 'inhale')      setScale(0.55 + pct * 0.45);
      else if (cur.phase === 'hold1')  setScale(1);
      else if (cur.phase === 'exhale') setScale(1 - pct * 0.45);
      else                              setScale(0.55);

      if (phaseTimeRef.current >= cur.duration) {
        phaseTimeRef.current = 0;
        const nextIndex = (phaseIndex + 1) % 4;
        if (nextIndex === 0) {
          const newCycles = cycles + 1;
          setCycles(newCycles);
          if (newCycles >= 1) setCanSkip(true);
          if (newCycles >= TOTAL_CYCLES) { finishSession(newCycles); return; }
        }
        setPhaseIndex(nextIndex);
        setCountdown(PHASES[nextIndex].duration);
        const nextPh = PHASES[nextIndex].phase;
        if (nextPh === 'inhale') playBreathIn();
        else if (nextPh === 'exhale') playBreathOut();
      }
    }, 1000);

    return stopTimer;
  }, [running, phaseIndex, cycles, finishSession]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="min-h-screen px-4 py-24 max-w-2xl mx-auto flex flex-col">
      <div className="fade-in-up mb-8">
        <div className="text-xs tracking-widest mb-3 font-medium" style={{ color: 'var(--primary)' }}>MODULE 02</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          方框呼吸法
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>
          每边4秒，形成一个"方框"。Navy SEAL特种部队用它在紧张时快速镇定。<br />
          眼睛半闭，跟随圆圈律动自然呼吸。
        </p>
      </div>

      {/* Box diagram */}
      <div className="flex justify-center mb-6 fade-in-up-delay-1">
        <svg width="200" height="200" viewBox="0 0 220 220">
          {running && (
            <rect x="20" y="20" width="180" height="180" rx="12"
              fill="none" stroke={currentPhase.color} strokeWidth="2" strokeOpacity="0.45"
              strokeDasharray="680"
              strokeDashoffset={680 - (phaseIndex * 170 + (phaseTimeRef.current / currentPhase.duration) * 170)}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          )}
          <rect x="20" y="20" width="180" height="180" rx="12"
            fill="none" stroke="rgba(91,196,232,0.12)" strokeWidth="1.5" strokeDasharray="5 5" />
          <text x="110" y="13"  textAnchor="middle" fill="rgba(91,196,232,0.5)"  fontSize="10" fontFamily="Noto Sans SC">吸气 4s</text>
          <text x="213" y="114" textAnchor="middle" fill="rgba(240,192,96,0.5)"  fontSize="10" fontFamily="Noto Sans SC" transform="rotate(90,213,114)">屏息 4s</text>
          <text x="110" y="218" textAnchor="middle" fill="rgba(125,214,168,0.5)" fontSize="10" fontFamily="Noto Sans SC">呼气 4s</text>
          <text x="7"   y="114" textAnchor="middle" fill="rgba(196,168,232,0.5)" fontSize="10" fontFamily="Noto Sans SC" transform="rotate(-90,7,114)">屏息 4s</text>
        </svg>
      </div>

      {/* Breathing circle */}
      <div className="flex-1 flex flex-col items-center justify-center fade-in-up-delay-2">
        <div className="relative flex items-center justify-center mb-4" style={{ width: 280, height: 280 }}>
          {running && currentPhase.phase === 'inhale' && [0, 1, 2].map(i => (
            <div key={i} className="ripple-ring absolute"
              style={{ inset: 0, borderColor: currentPhase.color, animationDelay: `${i}s` }} />
          ))}
          <div className="absolute rounded-full"
            style={{
              width: `${scale * 240}px`, height: `${scale * 240}px`,
              background: `radial-gradient(circle, ${currentPhase.color}18, transparent 70%)`,
              transition: running ? 'width 1s linear, height 1s linear' : 'none',
            }} />
          <div className="rounded-full flex flex-col items-center justify-center z-10 select-none"
            style={{
              width: `${scale * 190}px`, height: `${scale * 190}px`,
              background: `radial-gradient(circle at 38% 38%, ${currentPhase.color}55, ${currentPhase.color}22)`,
              border: `2px solid ${currentPhase.color}70`,
              boxShadow: `0 0 ${scale * 28}px ${currentPhase.color}35`,
              transition: running ? 'width 1s linear, height 1s linear, background 0.5s, border-color 0.5s, box-shadow 1s' : 'none',
              minWidth: 80, minHeight: 80,
            }}>
            {running ? (
              <>
                <div className="text-3xl font-bold tabular-nums leading-none" style={{ color: currentPhase.color }}>{countdown}</div>
                <div className="text-sm font-medium mt-1" style={{ color: currentPhase.color, opacity: 0.9 }}>{currentPhase.label}</div>
              </>
            ) : done ? (
              <div className="text-sm text-center px-4" style={{ color: '#7dd6a8' }}>完成 ✓</div>
            ) : (
              <div className="text-sm text-center px-4" style={{ color: 'rgba(255,255,255,0.4)' }}>准备好了<br/>点击开始</div>
            )}
          </div>
        </div>

        {/* Phase guidance */}
        <div className="text-sm text-center h-6 mb-6 transition-all duration-500"
          style={{ color: running ? currentPhase.color : 'transparent' }}>
          {running ? currentPhase.subLabel : ''}
        </div>

        {/* Cycle dots */}
        <div className="flex items-center gap-3 mb-6">
          {Array.from({ length: TOTAL_CYCLES }, (_, i) => (
            <div key={i} className="rounded-full transition-all duration-500"
              style={{
                width: i < cycles ? 10 : 8, height: i < cycles ? 10 : 8,
                background: i < cycles ? 'var(--accent)' : i === cycles && running ? 'rgba(91,196,232,0.5)' : 'rgba(255,255,255,0.1)',
                boxShadow: i < cycles ? '0 0 6px var(--accent)' : i === cycles && running ? '0 0 6px var(--primary)' : 'none',
              }} />
          ))}
          <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>{cycles}/{TOTAL_CYCLES} 轮</span>
        </div>

        {/* Phase pill indicators */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {PHASES.map((p, i) => (
            <div key={i} className="px-3 py-1.5 rounded-full text-xs transition-all duration-300"
              style={{
                background: running && i === phaseIndex ? `${p.color}20` : 'transparent',
                border: `1px solid ${running && i === phaseIndex ? p.color : 'rgba(255,255,255,0.08)'}`,
                color: running && i === phaseIndex ? p.color : 'var(--text-muted)',
                fontWeight: running && i === phaseIndex ? 600 : 400,
                boxShadow: running && i === phaseIndex ? `0 0 8px ${p.color}30` : 'none',
              }}>
              {p.label} {p.duration}s
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={resetAll}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            title="重置">
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => { playClick(); setRunning(r => !r); }}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm transition-all duration-300"
            style={{
              background: running ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg, var(--primary), #3aa8d4)',
              color: running ? 'var(--text)' : '#04091a',
              border: running ? '1px solid var(--border)' : 'none',
              boxShadow: running ? 'none' : '0 0 25px rgba(91,196,232,0.4)',
            }}>
            {running ? <><Pause size={16} /> 暂停</> : <><Play size={16} /> {done ? '再练一次' : cycles > 0 ? '继续' : '开始练习'}</>}
          </button>
          {canSkip && !done && (
            <button onClick={() => finishSession(cycles)}
              className="flex items-center gap-1.5 px-5 py-3 rounded-full text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}
              title="已够了，提前结束">
              <SkipForward size={14} /> 够了，结束
            </button>
          )}
        </div>
      </div>

      {done && (
        <div className="mt-8 fade-in-up">
          <div className="text-center mb-4 py-5 rounded-2xl"
            style={{ background: 'rgba(125,214,168,0.07)', border: '1px solid rgba(125,214,168,0.2)' }}>
            <div className="text-3xl mb-2">🌿</div>
            <p className="text-sm font-medium mb-1.5" style={{ color: '#7dd6a8' }}>
              很棒！你完成了 {cycles} 轮方框呼吸
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              感受现在身体的状态。<br />血氧浓度提升，神经系统正在平静下来。
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
  );
}
