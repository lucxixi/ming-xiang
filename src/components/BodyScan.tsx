import { Captions, Pause, Play, SkipForward, Square } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { playChime, playClick } from '../utils/audio';
import PracticeComplete from './PracticeComplete';

interface BodyScanProps {
  onComplete: () => void;
}

const TOTAL_SECONDS = 180;

const REGIONS = [
  { label: '双脚', guide: '把注意力带到双脚。感觉它们与地面、衣物或彼此接触的位置。' },
  { label: '小腿', guide: '注意小腿此刻的感觉。松、紧、麻、热，或者什么也感觉不到。' },
  { label: '腹部', guide: '感觉腹部随着自然呼吸轻轻变化。不需要主动调整呼吸。' },
  { label: '双手', guide: '感觉双手放在哪里。留意手指、掌心，以及它们接触到的地方。' },
  { label: '肩颈', guide: '把注意力带到肩颈。无需赶走紧绷，只需要知道它在这里。' },
  { label: '面部', guide: '留意额头、眼周和下颌。如果不舒服，可以直接跳过。' },
  { label: '全身', guide: '让注意范围慢慢扩大，感觉整个身体，以及身体所在的空间。' },
];

const REGION_SECONDS = TOTAL_SECONDS / REGIONS.length;

function formatTime(value: number) {
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export default function BodyScan({ onComplete }: BodyScanProps) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [subtitles, setSubtitles] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running || finished) return;

    const timer = window.setInterval(() => {
      setElapsed(value => {
        if (value >= TOTAL_SECONDS - 1) {
          window.clearInterval(timer);
          setRunning(false);
          setFinished(true);
          playChime();
          return TOTAL_SECONDS;
        }
        return value + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, finished]);

  const regionIndex = useMemo(
    () => Math.min(REGIONS.length - 1, Math.floor(elapsed / REGION_SECONDS)),
    [elapsed],
  );
  const current = REGIONS[regionIndex];

  const restart = () => {
    setElapsed(0);
    setRunning(false);
    setFinished(false);
    setSubtitles(true);
  };

  const togglePlayback = () => {
    setRunning(value => !value);
    playClick();
  };

  const skipRegion = () => {
    const next = Math.min(TOTAL_SECONDS, Math.ceil((regionIndex + 1) * REGION_SECONDS));
    setElapsed(next);
    playClick();
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
        <div className="body-audio-shade" aria-hidden="true" />

        <div className="body-audio-meta">
          <p>身体扫描</p>
          <span>3 分钟</span>
        </div>

        <div className="body-caption" aria-live="polite">
          <p>现在 · {current.label}</p>
          <h1>{subtitles ? current.guide : '把注意力轻轻放在这里。'}</h1>
        </div>

        <div className="body-scan-player guided-player" aria-label="3 分钟身体扫描播放器">
          <button className="guided-play" onClick={togglePlayback} aria-label={running ? '暂停身体扫描' : '播放身体扫描'}>
            {running ? <Pause size={21} /> : <Play size={21} />}
          </button>

          <div className="guided-timeline">
            <input
              aria-label="身体扫描进度"
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
              <span>{current.label}</span>
              <time>-{formatTime(TOTAL_SECONDS - elapsed)}</time>
            </div>
          </div>

          <button className={subtitles ? 'guided-tool active' : 'guided-tool'} onClick={() => setSubtitles(value => !value)} aria-label="切换字幕">
            <Captions size={18} />
          </button>
          <button className="guided-tool" onClick={skipRegion} aria-label="跳过这个部位">
            <SkipForward size={18} />
          </button>
          <button className="guided-tool guided-exit" onClick={() => setFinished(true)} aria-label="结束身体扫描">
            <Square size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
