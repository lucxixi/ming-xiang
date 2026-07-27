import { Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { playChime, playClick } from '../utils/audio';
import PracticeComplete from './PracticeComplete';

interface BodyScanProps {
  onComplete: () => void;
}

interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

const AUDIO_SRC = '/audio/body-scan.mp3';
const SUBTITLE_SRC = '/audio/body-scan.srt';
const FALLBACK_DURATION = 574.224;

function parseTimestamp(value: string) {
  const [hours, minutes, seconds] = value.replace(',', '.').split(':');
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function parseSrt(source: string): CaptionCue[] {
  return source
    .trim()
    .split(/\r?\n\r?\n/)
    .map(block => {
      const lines = block.split(/\r?\n/);
      const timingIndex = lines.findIndex(line => line.includes('-->'));
      if (timingIndex === -1) return null;

      const [start, end] = lines[timingIndex].split('-->').map(value => value.trim());
      return {
        start: parseTimestamp(start),
        end: parseTimestamp(end),
        text: lines.slice(timingIndex + 1).join(' ').trim(),
      };
    })
    .filter((cue): cue is CaptionCue => Boolean(cue?.text));
}

function formatTime(value: number) {
  const safeValue = Math.max(0, Math.round(value));
  return `${Math.floor(safeValue / 60)}:${String(safeValue % 60).padStart(2, '0')}`;
}

export default function BodyScan({ onComplete }: BodyScanProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [cues, setCues] = useState<CaptionCue[]>([]);

  useEffect(() => {
    fetch(SUBTITLE_SRC)
      .then(response => response.text())
      .then(source => setCues(parseSrt(source)))
      .catch(() => setCues([]));
  }, []);

  const activeCaption = useMemo(() => {
    if (cues.length === 0) return '';
    if (elapsed < cues[0].start) return cues[0].text;
    return cues.find(cue => elapsed >= cue.start && elapsed <= cue.end)?.text ?? '';
  }, [cues, elapsed]);

  const restart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setElapsed(0);
    setRunning(false);
    setFinished(false);
  };

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

  const finish = () => {
    audioRef.current?.pause();
    setRunning(false);
    setFinished(true);
    playChime();
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
            className={running ? 'countdown-bubble is-running' : 'countdown-bubble'}
            onClick={togglePlayback}
            aria-label={running ? '暂停身体扫描' : '播放身体扫描'}
          >
            <span className="countdown-icon" aria-hidden="true">
              {running ? <Pause size={17} /> : <Play size={17} />}
            </span>
            <time>{formatTime(duration - elapsed)}</time>
          </button>

          <div className={activeCaption ? 'body-caption' : 'body-caption is-empty'} aria-live="polite">
            {activeCaption && <h1>{activeCaption}</h1>}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={AUDIO_SRC}
          preload="metadata"
          onLoadedMetadata={event => setDuration(event.currentTarget.duration)}
          onTimeUpdate={event => setElapsed(event.currentTarget.currentTime)}
          onPlay={() => setRunning(true)}
          onPause={() => setRunning(false)}
          onEnded={finish}
        />
      </section>
    </div>
  );
}
