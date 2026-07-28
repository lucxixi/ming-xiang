import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { useGuidedAudio } from '../hooks/useGuidedAudio';
import { playChime, playClick } from '../utils/audio';
import AudioSessionState from './AudioSessionState';
import PracticeComplete from './PracticeComplete';

interface BodyScanProps {
  onComplete: () => void;
}

const AUDIO_SRC = '/audio/body-scan.mp3';
const SUBTITLE_SRC = '/audio/body-scan.srt';
const FALLBACK_DURATION = 574.224;

function formatTime(value: number) {
  const safeValue = Math.max(0, Math.round(value));
  return `${Math.floor(safeValue / 60)}:${String(safeValue % 60).padStart(2, '0')}`;
}

export default function BodyScan({ onComplete }: BodyScanProps) {
  const [finished, setFinished] = useState(false);
  const session = useGuidedAudio({
    sessionKey: 'body-scan',
    audioPath: AUDIO_SRC,
    subtitlePath: SUBTITLE_SRC,
    fallbackDuration: FALLBACK_DURATION,
    onEnded: () => {
      playChime();
      setFinished(true);
    },
  });

  const restart = () => {
    session.restart();
    setFinished(false);
  };

  const togglePlayback = async () => {
    playClick();
    await session.togglePlayback();
  };

  if (finished) {
    return (
      <div className="practice-page completion-page">
        <PracticeComplete onLeave={onComplete} onAgain={restart} />
      </div>
    );
  }

  return (
    <div className="practice-page body-practice">
      <section className="body-audio-stage">
        <div className="body-scene">
          <div className="body-audio-shade" aria-hidden="true" />

          <button
            className={session.running ? 'countdown-bubble is-running' : 'countdown-bubble'}
            onClick={togglePlayback}
            aria-label={session.running ? '暂停身体扫描' : '播放身体扫描'}
          >
            <span className="countdown-icon" aria-hidden="true">
              {session.running ? <Pause size={17} /> : <Play size={17} />}
            </span>
            <time>{formatTime(session.duration - session.elapsed)}</time>
          </button>

          <div className={session.caption ? 'body-caption' : 'body-caption is-empty'}>
            {session.caption && <h1>{session.caption}</h1>}
          </div>

          <AudioSessionState
            loadState={session.loadState}
            resumeAt={session.resumeAt}
            onResume={() => session.begin(true)}
            onRestart={() => session.begin(false)}
            onRetry={session.retry}
          />
        </div>

        <audio
          ref={session.audioRef}
          src={session.audioSrc}
          preload="metadata"
          {...session.audioProps}
        />
      </section>
    </div>
  );
}
