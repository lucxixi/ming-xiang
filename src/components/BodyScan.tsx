import { Captions, Pause, Play, SkipForward, Square } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { playChime, playScanTone } from '../utils/audio';
import PracticeComplete from './PracticeComplete';

interface BodyScanProps {
  onComplete: () => void;
}

const TOTAL_SECONDS = 180;

const REGIONS = [
  { label: '双脚', guide: '把注意力带到双脚与地面的接触。感觉重量、温度，或者什么也感觉不到。', y: 365 },
  { label: '小腿', guide: '注意小腿此刻的感觉。松、紧、麻、热，都只是现在收到的信息。', y: 306 },
  { label: '腹部', guide: '注意腹部与衣物的接触。呼吸保持原来的样子，不需要主动放松。', y: 205 },
  { label: '双手', guide: '感觉双手放在哪里。留意手指、掌心，或者手与腿接触的位置。', y: 222 },
  { label: '肩颈', guide: '注意肩颈现在是什么状态。不用把紧绷赶走，只需要知道它在这里。', y: 126 },
  { label: '面部', guide: '感觉额头、眼周和下颌。如果某个部位不舒服，可以直接跳过。', y: 72 },
  { label: '全身', guide: '把注意范围轻轻扩大到整个身体，以及身体所在的房间。', y: 210 },
];

function formatTime(value: number) {
  const minutes = Math.floor(value / 60);
  return `${minutes}:${String(value % 60).padStart(2, '0')}`;
}

export default function BodyScan({ onComplete }: BodyScanProps) {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [regionIndex, setRegionIndex] = useState(0);
  const [subtitles, setSubtitles] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running || finished) return;

    const timer = window.setInterval(() => {
      setRemaining(value => {
        if (value <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          setFinished(true);
          playChime();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, finished]);

  const elapsed = TOTAL_SECONDS - remaining;
  const automaticIndex = Math.min(REGIONS.length - 1, Math.floor(elapsed / 25));

  useEffect(() => {
    if (!started || !running || automaticIndex <= regionIndex) return;
    setRegionIndex(automaticIndex);
    playScanTone(automaticIndex);
  }, [automaticIndex, regionIndex, running, started]);

  const current = REGIONS[regionIndex];
  const progress = useMemo(() => ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100, [remaining]);

  const start = () => {
    setStarted(true);
    setRunning(true);
    playScanTone(0);
  };

  const restart = () => {
    setStarted(false);
    setRunning(false);
    setFinished(false);
    setRemaining(TOTAL_SECONDS);
    setRegionIndex(0);
  };

  const skipRegion = () => {
    const next = Math.min(REGIONS.length - 1, regionIndex + 1);
    setRegionIndex(next);
    playScanTone(next);
  };

  if (finished) {
    return (
      <div className="practice-page completion-page">
        <PracticeComplete onLeave={onComplete} onAgain={restart} />
      </div>
    );
  }

  return (
    <div className={started ? 'practice-page body-practice is-immersive' : 'practice-page body-practice'}>
      <section className="practice-stage body-stage">
        <div className="practice-title-row">
          <div>
            <p className="eyebrow">3 分钟 · 身体接触与感觉</p>
            <h1>身体扫描</h1>
          </div>
          <time>{formatTime(remaining)}</time>
        </div>

        <div className="body-layout">
          <div className="body-copy">
            {!started ? (
              <>
                <p className="practice-kicker">跟随身体的感觉</p>
                <h2>从最容易感知的位置开始。</h2>
                <p>
                  不需要放松每一个部位，也不需要获得特别的感觉。你可以睁眼，任何区域都能跳过。
                </p>
                <button className="primary-action large" onClick={start}>
                  <Play size={18} />
                  开始身体扫描
                </button>
              </>
            ) : (
              <>
                <p className="practice-kicker">现在 · {current.label}</p>
                <h2>{subtitles ? current.guide : '把注意力轻轻放在这里。'}</h2>
                <p>注意跑开时，只需知道它跑开了，再选择是否回来。</p>
              </>
            )}
          </div>

          <div className="body-map" aria-label={`当前扫描部位：${current.label}`}>
            <svg viewBox="0 0 220 430" role="img" aria-hidden="true">
              <circle cx="110" cy="65" r="34" />
              <path d="M82 108 Q110 96 138 108 L151 231 Q135 250 110 250 Q85 250 69 231Z" />
              <path d="M74 121 Q52 159 45 230 Q43 252 57 260 Q69 241 73 205 L88 132Z" />
              <path d="M146 121 Q168 159 175 230 Q177 252 163 260 Q151 241 147 205 L132 132Z" />
              <path d="M82 242 Q72 310 77 393 Q88 408 100 393 L108 251Z" />
              <path d="M138 242 Q148 310 143 393 Q132 408 120 393 L112 251Z" />
              <circle className="body-focus" cx="110" cy={current.y} r={current.label === '全身' ? 74 : 24} />
            </svg>

            <ol>
              {REGIONS.map((region, index) => (
                <li key={region.label} className={index === regionIndex ? 'active' : index < regionIndex ? 'visited' : ''}>
                  <button onClick={() => setRegionIndex(index)} disabled={!started}>
                    <span />
                    {region.label}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {started && (
          <div className="practice-controls">
            <button className="round-control" onClick={() => setRunning(value => !value)} aria-label={running ? '暂停' : '继续'}>
              {running ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button className={subtitles ? 'control-button active' : 'control-button'} onClick={() => setSubtitles(value => !value)}>
              <Captions size={18} /> 字幕
            </button>
            <button className="control-button" onClick={skipRegion}>
              <SkipForward size={18} /> 跳过这个部位
            </button>
            <button className="control-button danger" onClick={() => { setRunning(false); setFinished(true); }}>
              <Square size={16} /> 结束练习
            </button>
          </div>
        )}

        <div className="practice-progress"><span style={{ width: `${progress}%` }} /></div>
      </section>
    </div>
  );
}
