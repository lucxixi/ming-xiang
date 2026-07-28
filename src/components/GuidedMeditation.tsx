import { ArrowLeft, BedDouble, Pause, Play, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { playChime, playClick } from '../utils/audio';
import { activeCaptionAt, parseSrt, type CaptionCue } from '../utils/subtitles';
import PracticeComplete from './PracticeComplete';

interface GuidedMeditationProps {
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [running, setRunning] = useState(false);
  const [cues, setCues] = useState<CaptionCue[]>([]);

  useEffect(() => {
    fetch(subtitleSrc)
      .then(response => response.text())
      .then(source => setCues(parseSrt(source)))
      .catch(() => setCues([]));
  }, [subtitleSrc]);

  const caption = useMemo(() => activeCaptionAt(cues, elapsed), [cues, elapsed]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    playClick();
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setRunning(false);
      }
    } else {
      audio.pause();
    }
  };

  return (
    <section className={`${mode}-guided-stage`}>
      <div className={`${mode}-guided-wash`} aria-hidden="true" />

      <button className="mode-back" onClick={onBack}>
        <ArrowLeft size={16} />
        选择练习姿势
      </button>

      <button
        className={running ? 'countdown-bubble guided-countdown is-running' : 'countdown-bubble guided-countdown'}
        onClick={togglePlayback}
        aria-label={running ? `暂停${title}` : `播放${title}`}
      >
        <span className="countdown-icon" aria-hidden="true">
          {running ? <Pause size={17} /> : <Play size={17} />}
        </span>
        <time>{formatTime(duration - elapsed)}</time>
      </button>

      <div className={caption ? 'full-guided-caption' : 'full-guided-caption is-empty'} aria-live="polite">
        {caption && <h1>{caption}</h1>}
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
        onTimeUpdate={event => setElapsed(event.currentTarget.currentTime)}
        onPlay={() => setRunning(true)}
        onPause={() => setRunning(false)}
        onEnded={() => {
          setRunning(false);
          playChime();
          onFinish();
        }}
      />
    </section>
  );
}

export default function GuidedMeditation({ onComplete }: GuidedMeditationProps) {
  const [mode, setMode] = useState<GuidedMode>('choice');
  const [finished, setFinished] = useState(false);

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
              <button onClick={() => setMode('seated')}>
                <span className="mode-icon"><UserRound size={22} /></span>
                <strong>静坐冥想</strong>
                <small>引导与字幕 · 20 分钟</small>
              </button>
              <button onClick={() => setMode('lying')}>
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
          onBack={() => setMode('choice')}
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
          onBack={() => setMode('choice')}
          onFinish={() => setFinished(true)}
        />
      )}
    </div>
  );
}
