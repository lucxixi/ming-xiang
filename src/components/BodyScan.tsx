import { Captions, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import type { CSSProperties } from 'react';
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
  const [subtitles, setSubtitles] = useState(true);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [cues, setCues] = useState<CaptionCue[]>([]);

  useEffect(() => {
    fetch(SUBTITLE_SRC)
      .then(response => response.text())
      .then(source => setCues(parseSrt(source)))
      .catch(() => setCues([]));
  }, []);

  const activeCaption = useMemo(() => {
    if (!subtitles || cues.length === 0) return '';
    if (elapsed < cues[0].start) return cues[0].text;
    return cues.find(cue => elapsed >= cue.start && elapsed <= cue.end)?.text ?? '';
  }, [cues, elapsed, subtitles]);

  const seekTo = (nextValue: number) => {
    const next = Math.max(0, Math.min(duration, nextValue));
    if (audioRef.current) audioRef.current.currentTime = next;
    setElapsed(next);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setElapsed(0);
    setRunning(false);
    setFinished(false);
    setSubtitles(true);
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

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
    playClick();
  };

  const finish = (withChime = false) => {
    audioRef.current?.pause();
    setRunning(false);
    setFinished(true);
    if (withChime) playChime();
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

          <div className={activeCaption ? 'body-caption' : 'body-caption is-empty'} aria-live="polite">
            {activeCaption && <h1>{activeCaption}</h1>}
          </div>
        </div>

        <div className="body-player-dock">
          <div className="body-scan-player guided-player" aria-label="身体扫描音频播放器">
            <button className="guided-play" onClick={togglePlayback} aria-label={running ? '暂停身体扫描' : '播放身体扫描'}>
              {running ? <Pause size={21} /> : <Play size={21} />}
            </button>

            <div className="guided-timeline">
              <input
                aria-label="身体扫描进度"
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={elapsed}
                onChange={event => seekTo(Number(event.target.value))}
                onKeyDown={event => {
                  if (event.key === 'Home') seekTo(0);
                  if (event.key === 'End') seekTo(duration);
                  if (event.key === 'ArrowLeft') seekTo(elapsed - 5);
                  if (event.key === 'ArrowRight') seekTo(elapsed + 5);
                }}
                style={{ '--guided-progress': `${duration ? elapsed / duration * 100 : 0}%` } as CSSProperties}
              />
              <div>
                <time>{formatTime(elapsed)}</time>
                <span aria-hidden="true" />
                <time>-{formatTime(duration - elapsed)}</time>
              </div>
            </div>

            <button className={subtitles ? 'guided-tool active' : 'guided-tool'} onClick={() => setSubtitles(value => !value)} aria-label="切换字幕">
              <Captions size={18} />
            </button>
            <button className="guided-tool" onClick={toggleMute} aria-label={muted ? '打开声音' : '静音'}>
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button className="guided-tool guided-exit" onClick={() => finish()} aria-label="结束身体扫描">
              <Square size={15} />
            </button>
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
          onEnded={() => finish(true)}
        />
      </section>
    </div>
  );
}
