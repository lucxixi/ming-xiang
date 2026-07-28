import { ArrowLeft, Pause, Play, Sparkles, Waves } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useGuidedAudio } from '../hooks/useGuidedAudio';
import { playBreathIn, playBreathOut, playChime, playClick } from '../utils/audio';
import type { BreathingRouteMode } from '../utils/routes';
import AudioSessionState from './AudioSessionState';
import PracticeComplete from './PracticeComplete';

interface BreathingExerciseProps {
  initialMode?: BreathingRouteMode;
  onModeChange?: (mode: BreathingRouteMode) => void;
  onComplete: () => void;
}

type BreathingMode = 'choice' | 'guided' | 'four-four';
type BreathPhase = 'inhale' | 'exhale';

const GUIDED_AUDIO_SRC = '/audio/guided-breathing.mp3';
const GUIDED_SUBTITLE_SRC = '/audio/guided-breathing.srt';
const GUIDED_FALLBACK_DURATION = 732.891;
const PHASE_DURATION = 4000;

function formatTime(value: number) {
  const safeValue = Math.max(0, Math.round(value));
  return `${Math.floor(safeValue / 60)}:${String(safeValue % 60).padStart(2, '0')}`;
}

function GuidedBreathing({ onBack, onFinish }: { onBack: () => void; onFinish: () => void }) {
  const session = useGuidedAudio({
    sessionKey: 'guided-breathing',
    audioPath: GUIDED_AUDIO_SRC,
    subtitlePath: GUIDED_SUBTITLE_SRC,
    fallbackDuration: GUIDED_FALLBACK_DURATION,
    onEnded: () => {
      playChime();
      onFinish();
    },
  });

  const togglePlayback = async () => {
    playClick();
    await session.togglePlayback();
  };

  return (
    <section className="guided-breathing-stage">
      <div className="breathing-lake-wash" aria-hidden="true" />

      <button className="mode-back" onClick={onBack}>
        <ArrowLeft size={16} />
        选择呼吸方式
      </button>

      <button
        className={session.running ? 'countdown-bubble breathing-countdown is-running' : 'countdown-bubble breathing-countdown'}
        onClick={togglePlayback}
        aria-label={session.running ? '暂停引导呼吸' : '播放引导呼吸'}
      >
        <span className="countdown-icon" aria-hidden="true">
          {session.running ? <Pause size={17} /> : <Play size={17} />}
        </span>
        <time>{formatTime(session.duration - session.elapsed)}</time>
      </button>

      <div className={session.caption ? 'guided-breathing-caption' : 'guided-breathing-caption is-empty'}>
        {session.caption && <h1>{session.caption}</h1>}
      </div>

      <AudioSessionState
        loadState={session.loadState}
        resumeAt={session.resumeAt}
        onResume={() => session.begin(true)}
        onRestart={() => session.begin(false)}
        onRetry={session.retry}
      />

      <audio
        ref={session.audioRef}
        src={session.audioSrc}
        preload="metadata"
        {...session.audioProps}
      />
    </section>
  );
}

function FourFourBreathing({ onBack }: { onBack: () => void }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setPhaseElapsed(value => {
        const next = value + 50;
        if (next < PHASE_DURATION) return next;

        setPhase(current => {
          const nextPhase = current === 'inhale' ? 'exhale' : 'inhale';
          if (nextPhase === 'inhale') playBreathIn();
          else playBreathOut();
          return nextPhase;
        });
        return next - PHASE_DURATION;
      });
    }, 50);

    return () => window.clearInterval(timer);
  }, [running]);

  const progress = phaseElapsed / PHASE_DURATION;
  const scale = phase === 'inhale'
    ? 0.72 + progress * 0.28
    : 1 - progress * 0.28;
  const seconds = Math.max(1, Math.ceil((PHASE_DURATION - phaseElapsed) / 1000));

  const toggle = () => {
    setRunning(value => {
      const next = !value;
      if (next) {
        if (phase === 'inhale') playBreathIn();
        else playBreathOut();
      }
      return next;
    });
  };

  return (
    <section className="four-four-stage">
      <div className="breathing-lake-wash four-four-wash" aria-hidden="true" />

      <button className="mode-back" onClick={onBack}>
        <ArrowLeft size={16} />
        选择呼吸方式
      </button>

      <button
        className={running ? `four-four-orb is-running is-${phase}` : `four-four-orb is-${phase}`}
        onClick={toggle}
        aria-label={running ? '暂停四四呼吸' : '开始四四呼吸'}
        style={{ '--breath-scale': scale } as CSSProperties}
      >
        <span className="orb-ring ring-a" aria-hidden="true" />
        <span className="orb-ring ring-b" aria-hidden="true" />
        <span className="orb-core" aria-hidden="true" />
        <span className="orb-copy">
          <small>{running ? (phase === 'inhale' ? '吸气' : '呼气') : '四四呼吸'}</small>
          <strong>{running ? seconds : <Play size={27} />}</strong>
        </span>
      </button>

      <p className="four-four-note">
        {running ? '跟随圆环，不需要吸得更深。' : '4 秒吸气 · 4 秒呼气'}
      </p>
    </section>
  );
}

export default function BreathingExercise({
  initialMode = 'choice',
  onModeChange,
  onComplete,
}: BreathingExerciseProps) {
  const [mode, setMode] = useState<BreathingMode>(initialMode);
  const [finished, setFinished] = useState(false);

  useEffect(() => setMode(initialMode), [initialMode]);

  const changeMode = (nextMode: BreathingMode) => {
    setMode(nextMode);
    onModeChange?.(nextMode);
  };

  if (finished) {
    return (
      <div className="practice-page completion-page">
        <PracticeComplete
          onLeave={onComplete}
          onAgain={() => {
            setFinished(false);
            changeMode('guided');
          }}
        />
      </div>
    );
  }

  return (
    <div className="practice-page breathing-practice">
      {mode === 'choice' && (
        <section className="breathing-choice-stage">
          <div className="breathing-lake-wash choice-wash" aria-hidden="true" />
          <div className="breathing-choice-content">
            <h1>选择一种呼吸</h1>
            <div className="breathing-mode-options">
              <button onClick={() => changeMode('guided')}>
                <span className="mode-icon"><Waves size={22} /></span>
                <strong>引导呼吸</strong>
                <small>旁白与字幕 · 12 分钟</small>
              </button>
              <button onClick={() => changeMode('four-four')}>
                <span className="mode-icon"><Sparkles size={22} /></span>
                <strong>四四呼吸法</strong>
                <small>4 秒吸气 · 4 秒呼气</small>
              </button>
            </div>
          </div>
        </section>
      )}

      {mode === 'guided' && (
        <GuidedBreathing onBack={() => changeMode('choice')} onFinish={() => setFinished(true)} />
      )}

      {mode === 'four-four' && <FourFourBreathing onBack={() => changeMode('choice')} />}
    </div>
  );
}
