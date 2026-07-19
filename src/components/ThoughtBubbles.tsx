import { useState, useCallback, useRef } from 'react';
import { Plus, CheckCircle, ChevronRight } from 'lucide-react';
import { playRelease, playClick } from '../utils/audio';

interface ThoughtBubblesProps {
  onComplete: () => void;
}

interface Thought {
  id: number;
  text: string;
  x: number;
  size: number;
  dur: number;
  released: boolean;
}

const PRESET_THOUGHTS = [
  '今天的工作任务', '那件令我担心的事', '对未来的焦虑',
  '昨天发生的事', '我是否做得足够好', '下一步要做什么',
  '身体的不适感', '一直没解决的问题',
];

let idCounter = 0;

export default function ThoughtBubbles({ onComplete }: ThoughtBubblesProps) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [input, setInput] = useState('');
  const [releasedCount, setReleasedCount] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const stars = useRef(
    Array.from({ length: 28 }, () => ({
      top: `${Math.random() * 65}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.8,
      op: Math.random() * 0.5 + 0.15,
    }))
  );

  const addThought = useCallback((text: string) => {
    playClick();
    const t: Thought = {
      id: ++idCounter,
      text,
      x: 8 + Math.random() * 72,
      size: 110 + Math.random() * 50,
      dur: 9 + Math.random() * 5,
      released: false,
    };
    setThoughts(prev => [...prev.slice(-8), t]);
  }, []);

  const releaseThought = useCallback((id: number) => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, released: true } : t));
    playRelease();
    setReleasedCount(c => {
      const next = c + 1;
      if (next >= 1) setCanComplete(true);
      return next;
    });
    setTimeout(() => setThoughts(prev => prev.filter(t => t.id !== id)), 9000);
  }, []);

  const handleAdd = () => {
    if (!input.trim()) return;
    addThought(input.trim());
    setInput('');
  };

  const livingCount = thoughts.filter(t => !t.released).length;

  return (
    <div className="min-h-screen px-4 py-24 max-w-3xl mx-auto flex flex-col">
      <div className="fade-in-up mb-6">
        <div className="text-xs tracking-widest mb-3 font-medium" style={{ color: 'var(--primary)' }}>MODULE 04</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          念头观察 · 云朵练习
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>
          写下脑海中的念头，它们会变成云朵飘上来。<br/>
          <span style={{ color: 'var(--primary)' }}>点击云朵</span>放走它——看着它消散，感受那一刻的轻松。
        </p>
      </div>

      {/* Step guide */}
      <div className="flex gap-3 mb-5 fade-in-up-delay-1">
        {[
          { n: '①', t: '写下念头', s: '下方输入或选预设' },
          { n: '②', t: '看它升起', s: '云朵从底部浮上来' },
          { n: '③', t: '点击放走', s: '温柔告别这个念头' },
        ].map(step => (
          <div key={step.n} className="flex-1 rounded-xl p-3 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-base mb-1" style={{ color: 'var(--primary)' }}>{step.n}</div>
            <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text)' }}>{step.t}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{step.s}</div>
          </div>
        ))}
      </div>

      {/* Sky canvas */}
      <div className="relative rounded-2xl overflow-hidden mb-5 fade-in-up-delay-2"
        style={{
          height: 300,
          background: 'linear-gradient(to bottom, #030a18 0%, #071220 50%, #0d1a30 100%)',
          border: '1px solid var(--border)',
        }}>
        {stars.current.map((s, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, background: 'white', opacity: s.op }} />
        ))}
        <div className="absolute top-3 right-6 w-9 h-9 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 35% 35%, #fff8dc, #f0c060)', boxShadow: '0 0 18px rgba(240,192,96,0.35)' }} />

        {thoughts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.18)' }}>
              在下方写下念头，<br />让它化为云朵飘上来
            </p>
          </div>
        )}

        {thoughts.map(t => (
          <div key={t.id} className="absolute thought-float"
            style={{
              left: `${t.x}%`, bottom: 0,
              '--dur': `${t.dur}s`,
              pointerEvents: t.released ? 'none' : 'auto',
            } as React.CSSProperties}>
            <button
              onClick={() => !t.released && releaseThought(t.id)}
              className="rounded-full px-4 py-2.5 text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: t.released ? 'rgba(91,196,232,0.06)' : 'rgba(12,22,48,0.88)',
                border: `1px solid ${t.released ? 'rgba(91,196,232,0.15)' : 'rgba(255,255,255,0.22)'}`,
                color: t.released ? 'rgba(91,196,232,0.45)' : 'var(--text)',
                maxWidth: `${t.size}px`,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                cursor: t.released ? 'default' : 'pointer',
                boxShadow: t.released ? 'none' : '0 4px 18px rgba(0,0,0,0.4)',
              }}
              title={t.released ? '' : `点击放走：${t.text}`}>
              {t.released ? '✦ 已放走' : t.text}
            </button>
            {!t.released && (
              <div className="text-center mt-0.5" style={{ color: 'rgba(255,255,255,0.28)', fontSize: 9 }}>点击放走</div>
            )}
          </div>
        ))}

        {releasedCount > 0 && (
          <div className="absolute top-2.5 left-3 text-xs px-2.5 py-1 rounded-full pointer-events-none"
            style={{ background: 'rgba(91,196,232,0.1)', border: '1px solid rgba(91,196,232,0.2)', color: 'var(--primary)' }}>
            已放走 {releasedCount} 个念头
          </div>
        )}
        {livingCount > 0 && (
          <div className="absolute bottom-2 right-3 text-xs pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {livingCount} 个念头漂浮中，点击放走
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4 fade-in-up-delay-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="写下此刻占据你脑海的念头..."
          className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
          onFocus={e => { e.target.style.borderColor = 'rgba(91,196,232,0.4)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
        />
        <button onClick={handleAdd} disabled={!input.trim()}
          className="px-4 py-3 rounded-xl transition-all duration-200"
          style={{
            background: input.trim() ? 'var(--primary-glow)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${input.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
            color: input.trim() ? 'var(--primary)' : 'var(--text-muted)',
          }}>
          <Plus size={16} />
        </button>
      </div>

      {/* Presets */}
      <div className="fade-in-up-delay-4 mb-5">
        <p className="text-xs mb-2.5" style={{ color: 'var(--text-muted)' }}>常见念头，点击添加：</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_THOUGHTS.map(t => (
            <button key={t} onClick={() => addThought(t)}
              className="px-3 py-1.5 rounded-full text-xs transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(91,196,232,0.3)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="rounded-2xl p-4 mb-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>
          <span style={{ color: 'var(--accent)' }}>冥想时遇到念头：</span>
          不要强行驱走。默默标注"这是个念头"，然后温柔地把注意力带回呼吸。念头会自己消散的。
        </p>
      </div>

      {/* Complete after first release */}
      {canComplete && (
        <button onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-medium fade-in-up transition-all duration-300"
          style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
          <CheckCircle size={16} />
          {releasedCount >= 3 ? `放走了 ${releasedCount} 个念头，很好！继续` : '体验到了，继续'}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
