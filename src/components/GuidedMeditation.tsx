import { Pause, Play, RotateCcw, Square, Volume2, VolumeX } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { playChime, playClick } from '../utils/audio';

interface GuidedMeditationProps {
  onComplete: () => void;
}

const TOTAL_SECONDS = 25 * 60;

function formatTime(value: number) {
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export default function GuidedMeditation({ onComplete }: GuidedMeditationProps) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!running) return;

    const timer = window.setInterval(() => {
      setElapsed(value => {
        if (value >= TOTAL_SECONDS - 1) {
          window.clearInterval(timer);
          setRunning(false);
          playChime();
          return TOTAL_SECONDS;
        }
        return value + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running]);

  const togglePlayback = () => {
    setRunning(value => !value);
    playClick();
  };

  const restart = () => {
    setElapsed(0);
    setRunning(false);
    playClick();
  };

  return (
    <div className="practice-page guided-page">
      <section className="guided-stage">
        <div className="guided-shade" aria-hidden="true" />

        <div className="guided-meta">
          <p>完整跟练</p>
          <span>25 分钟</span>
        </div>

        <div className="guided-copy">
          <p>{running ? '跟着声音，回到此刻。' : '准备好时，就从这里开始。'}</p>
          <h1>不需要把念头赶走。<br />听见它，再轻轻回来。</h1>
        </div>

        <div className="guided-player" aria-label="25 分钟完整冥想播放器">
          <button className="guided-play" onClick={togglePlayback} aria-label={running ? '暂停跟练' : '播放跟练'}>
            {running ? <Pause size={21} /> : <Play size={21} />}
          </button>

          <div className="guided-timeline">
            <input
              aria-label="跟练进度"
              type="range"
              min="0"
              max={TOTAL_SECONDS}
              value={elapsed}
              onChange={event => setElapsed(Number(event.target.value))}
              onClick={event => {
                const bounds = event.currentTarget.getBoundingClientRect();
                const ratio = (event.clientX - bounds.left) / bounds.width;
                setElapsed(Math.round(Math.max(0, Math.min(1, ratio)) * TOTAL_SECONDS));
              }}
              onKeyDown={event => {
                if (event.key === 'Home') setElapsed(0);
                if (event.key === 'End') setElapsed(TOTAL_SECONDS);
                if (event.key === 'ArrowLeft') setElapsed(value => Math.max(0, value - 5));
                if (event.key === 'ArrowRight') setElapsed(value => Math.min(TOTAL_SECONDS, value + 5));
              }}
              style={{ '--guided-progress': `${elapsed / TOTAL_SECONDS * 100}%` } as CSSProperties}
            />
            <div>
              <time>{formatTime(elapsed)}</time>
              <span>完整冥想</span>
              <time>-{formatTime(TOTAL_SECONDS - elapsed)}</time>
            </div>
          </div>

          <button className="guided-tool" onClick={restart} aria-label="重新开始">
            <RotateCcw size={17} />
          </button>
          <button className="guided-tool" onClick={() => setMuted(value => !value)} aria-label={muted ? '打开声音' : '静音'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="guided-tool guided-exit" onClick={onComplete} aria-label="结束跟练">
            <Square size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
