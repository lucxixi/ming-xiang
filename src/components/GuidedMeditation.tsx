import { ArrowLeft, BedDouble, Pause, Play, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGuidedAudio } from '../hooks/useGuidedAudio';
import { playChime, playClick } from '../utils/audio';
import type { GuidedRouteMode } from '../utils/routes';
import AudioSessionState from './AudioSessionState';
import PracticeComplete from './PracticeComplete';

interface GuidedMeditationProps {
  initialMode?: GuidedRouteMode;
  onModeChange?: (mode: GuidedRouteMode) => void;
  onComplete: () => void;
}

type GuidedMode = 'choice' | 'seated' | 'lying';

const SEATED_AUDIO_SRC = '/audio/seated-meditation.mp3';
const SEATED_SUBTITLE_SRC = '/audio/seated-meditation.srt';
const SEATED_FALLBACK_DURATION = 1210.436;
const LYING_AUDIO_SRC = '/audio/lying-meditation.mp3';
const LYING_SUBTITLE_SRC = '/audio/lying-meditation.srt';
const LYING_FALLBACK_DURATION = 1054.563;

function formatTime(value: number) {
  const safeValue = Math.max(0, Math.round(value));
  return `${Math.floor(safeValue / 60)}:${String(safeValue % 60).padStart(2, '0')}`;
}

interface GuidedSessionProps {
  mode: Exclude<GuidedMode, 'choice'>;
  title: string;
  audioSrc: string;
  subtitleSrc: string;
  fallbackDuration: number;
  onBack: () => void;
  onFinish: () => void;
}

function GuidedSession({
  mode,
  title,
  audioSrc,
  subtitleSrc,
  fallbackDuration,
  onBack,
  onFinish,
}: GuidedSessionProps) {
  const session = useGuidedAudio({
    sessionKey: `${mode}-meditation`,
    audioPath: audioSrc,
    subtitlePath: subtitleSrc,
    fallbackDuration,
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
    <section className={`${mode}-guided-stage`}>
      <div className={`${mode}-guided-wash`} aria-hidden="true" />

      <button className="mode-back" onClick={onBack}>
        <ArrowLeft size={16} />
        选择练习姿势
      </button>

      <button
        className={session.running ? 'countdown-bubble guided-countdown is-running' : 'countdown-bubble guided-countdown'}
        onClick={togglePlayback}
        aria-label={session.running ? `暂停${title}` : `播放${title}`}
      >
        <span className="countdown-icon" aria-hidden="true">
          {session.running ? <Pause size={17} /> : <Play size={17} />}
        </span>
        <time>{formatTime(session.duration - session.elapsed)}</time>
      </button>

      <div className={session.caption ? 'full-guided-caption' : 'full-guided-caption is-empty'}>
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

export default function GuidedMeditation({
  initialMode = 'choice',
  onModeChange,
  onComplete,
}: GuidedMeditationProps) {
  const [mode, setMode] = useState<GuidedMode>(initialMode);
  const [finished, setFinished] = useState(false);

  useEffect(() => setMode(initialMode), [initialMode]);

  const changeMode = (nextMode: GuidedMode) => {
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
          }}
        />
      </div>
    );
  }

  return (
    <div className="practice-page guided-page">
      {mode === 'choice' && (
        <section className="guided-choice-stage">
          <div className="guided-choice-wash" aria-hidden="true" />
          <div className="guided-choice-content">
            <h1>选择练习姿势</h1>
            <div className="guided-mode-options">
              <button onClick={() => changeMode('seated')}>
                <span className="mode-icon"><UserRound size={22} /></span>
                <strong>静坐冥想</strong>
                <small>引导与字幕 · 20 分钟</small>
              </button>
              <button onClick={() => changeMode('lying')}>
                <span className="mode-icon"><BedDouble size={22} /></span>
                <strong>躺平冥想</strong>
                <small>引导与字幕 · 18 分钟</small>
              </button>
            </div>
          </div>
        </section>
      )}

      {mode === 'seated' && (
        <GuidedSession
          mode="seated"
          title="静坐冥想"
          audioSrc={SEATED_AUDIO_SRC}
          subtitleSrc={SEATED_SUBTITLE_SRC}
          fallbackDuration={SEATED_FALLBACK_DURATION}
          onBack={() => changeMode('choice')}
          onFinish={() => setFinished(true)}
        />
      )}

      {mode === 'lying' && (
        <GuidedSession
          mode="lying"
          title="躺平冥想"
          audioSrc={LYING_AUDIO_SRC}
          subtitleSrc={LYING_SUBTITLE_SRC}
          fallbackDuration={LYING_FALLBACK_DURATION}
          onBack={() => changeMode('choice')}
          onFinish={() => setFinished(true)}
        />
      )}
    </div>
  );
}
