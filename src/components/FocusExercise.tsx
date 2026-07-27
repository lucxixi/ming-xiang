import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playChime, playClick } from '../utils/audio';

interface FocusExerciseProps {
  onComplete: () => void;
}

const presets = [60, 120, 300];

function formatTime(value: number) {
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export default function FocusExercise({ onComplete }: FocusExerciseProps) {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [returns, setReturns] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setRemaining(value => {
        if (value <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          playChime();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const start = () => {
    setStarted(true);
    setRemaining(duration);
    setReturns(0);
    setRunning(true);
    playClick();
  };

  const reset = () => {
    setStarted(false);
    setRunning(false);
    setRemaining(duration);
    setReturns(0);
  };

  return (
    <div className="practice-page free-practice-page candle-page">
      <section className="free-practice-shell candle-shell">
        <div className="free-practice-heading">
          <p className="eyebrow">自由练习 · 视觉锚点</p>
          <h1>烛火专注</h1>
          <p>让视线停在火焰附近。注意跑开时，按一次“注意到了”，然后决定是否回来。</p>
        </div>

        <div className="candle-scene">
          <div className="candle-aura" />
          <div className="flame"><span /></div>
          <div className="candle-body" />
          {started && <time>{formatTime(remaining)}</time>}
        </div>

        {!started ? (
          <div className="focus-setup">
            <span>选择停留时间</span>
            <div>
              {presets.map(value => (
                <button key={value} className={duration === value ? 'active' : ''} onClick={() => { setDuration(value); setRemaining(value); }}>
                  {value / 60} 分钟
                </button>
              ))}
            </div>
            <button className="primary-action large" onClick={start}><Play size={18} /> 开始练习</button>
          </div>
        ) : (
          <>
            <button className="return-button" onClick={() => { setReturns(value => value + 1); playClick(); }}>
              注意到了
              <span>{returns === 0 ? '走神不是失败' : `已经回来 ${returns} 次`}</span>
            </button>
            <div className="practice-controls floating">
              <button className="round-control" onClick={() => setRunning(value => !value)}>
                {running ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="control-button" onClick={reset}><RotateCcw size={17} /> 重新开始</button>
              <button className="control-button danger" onClick={onComplete}><Square size={15} /> 结束练习</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
