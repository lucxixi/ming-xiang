import { Captions, Ear, Eye, Pause, Play, Square, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playChime } from '../utils/audio';
import PracticeComplete from './PracticeComplete';

interface BreathingExerciseProps {
  onComplete: () => void;
}

type Anchor = 'breath' | 'sound' | 'view';

const TOTAL_SECONDS = 180;

const anchors: Record<Anchor, { label: string; icon: typeof Waves; title: string; copy: string }> = {
  breath: {
    label: '自然呼吸',
    icon: Waves,
    title: '不用调整，只留意这一口气正在离开。',
    copy: '呼吸保持原来的样子就好。动画只是环境的一部分，不需要跟随。',
  },
  sound: {
    label: '周围声音',
    icon: Ear,
    title: '把注意力交给此刻真实存在的声音。',
    copy: '近处或远处都可以。不需要分辨来源，只知道声音正在出现。',
  },
  view: {
    label: '眼前画面',
    icon: Eye,
    title: '睁开眼睛，看向一个具体、稳定的东西。',
    copy: '留意它的颜色、边缘和所在位置，让自己重新接触周围空间。',
  },
};

function formatTime(value: number) {
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export default function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [anchor, setAnchor] = useState<Anchor>('breath');
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

  const restart = () => {
    setStarted(false);
    setRunning(false);
    setRemaining(TOTAL_SECONDS);
    setFinished(false);
    setAnchor('breath');
  };

  if (finished) {
    return (
      <div className="practice-page completion-page">
        <PracticeComplete onLeave={onComplete} onAgain={restart} />
      </div>
    );
  }

  const current = anchors[anchor];
  const progress = ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100;

  return (
    <div className="practice-page breathing-practice">
      <section className="practice-stage breathing-stage">
        <div className="practice-title-row breathing-title">
          <div>
            <p className="eyebrow">3 分钟 · 可随时更换注意位置</p>
            <h1>自然呼吸</h1>
          </div>
          <time>{formatTime(remaining)}</time>
        </div>

        <div className="breathing-visual" aria-hidden="true">
          <span className="breath-ring ring-one" />
          <span className="breath-ring ring-two" />
          <span className="breath-ring ring-three" />
          <span className="breath-glint" />
        </div>

        <div className="breathing-copy">
          {!started ? (
            <>
              <p className="practice-kicker">跟随你的自然节奏</p>
              <h2>不要求深呼吸，也不需要屏息。</h2>
              <p>只是留意呼吸原本的样子。感到紧迫、头晕或不舒服时，可以换到声音或直接结束。</p>
              <button className="primary-action large" onClick={() => { setStarted(true); setRunning(true); }}>
                <Play size={18} />
                开始自然呼吸
              </button>
            </>
          ) : (
            <>
              <p className="practice-kicker">{current.label}</p>
              <h2>{subtitles ? current.title : '在这里停留一会儿。'}</h2>
              <p>{current.copy}</p>
            </>
          )}
        </div>

        {started && (
          <>
            <div className="anchor-switcher" aria-label="切换注意位置">
              {(Object.keys(anchors) as Anchor[]).map(key => {
                const option = anchors[key];
                const Icon = option.icon;
                return (
                  <button key={key} className={anchor === key ? 'active' : ''} onClick={() => setAnchor(key)}>
                    <Icon size={17} />
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="practice-controls floating">
              <button className="round-control" onClick={() => setRunning(value => !value)} aria-label={running ? '暂停' : '继续'}>
                {running ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className={subtitles ? 'control-button active' : 'control-button'} onClick={() => setSubtitles(value => !value)}>
                <Captions size={18} /> 字幕
              </button>
              <button className="control-button danger" onClick={() => { setRunning(false); setFinished(true); }}>
                <Square size={16} /> 结束练习
              </button>
            </div>
          </>
        )}

        <div className="practice-progress"><span style={{ width: `${progress}%` }} /></div>
      </section>
    </div>
  );
}
