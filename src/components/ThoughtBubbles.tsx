import { Cloud, Plus, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import { playClick, playRelease } from '../utils/audio';

interface ThoughtBubblesProps {
  onComplete: () => void;
}

interface Thought {
  id: number;
  text: string;
  left: number;
  released: boolean;
}

const suggestions = ['那件还没解决的事', '我是不是做得不够好', '下一步怎么办'];

export default function ThoughtBubbles({ onComplete }: ThoughtBubblesProps) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [input, setInput] = useState('');
  const id = useRef(0);

  const addThought = (value: string) => {
    const text = value.trim();
    if (!text) return;
    playClick();
    setThoughts(items => [
      ...items.slice(-6),
      { id: ++id.current, text, left: 10 + Math.random() * 65, released: false },
    ]);
    setInput('');
  };

  const release = (thoughtId: number) => {
    setThoughts(items => items.map(item => item.id === thoughtId ? { ...item, released: true } : item));
    playRelease();
    window.setTimeout(() => {
      setThoughts(items => items.filter(item => item.id !== thoughtId));
    }, 1800);
  };

  return (
    <div className="practice-page free-practice-page thought-page">
      <section className="free-practice-shell">
        <div className="free-practice-heading">
          <p className="eyebrow">自由练习 · 念头与事实之间</p>
          <h1>念头云朵</h1>
          <p>写下一句此刻黏住你的话。让它暂时成为眼前的一句话，而不是必须服从的命令。</p>
        </div>

        <div className="thought-sky">
          <div className="sky-light" />
          {thoughts.length === 0 && (
            <div className="thought-empty">
              <Cloud size={27} />
              <span>念头出现时，可以先看看它。</span>
            </div>
          )}
          {thoughts.map(thought => (
            <button
              key={thought.id}
              className={thought.released ? 'thought-cloud released' : 'thought-cloud'}
              style={{ left: `${thought.left}%` }}
              onClick={() => release(thought.id)}
            >
              {thought.released ? '它正在经过' : thought.text}
            </button>
          ))}
        </div>

        <div className="thought-input-row">
          <label>
            <span>此刻脑中正在说什么？</span>
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && addThought(input)}
              placeholder="例如：我一定会搞砸"
            />
          </label>
          <button className="primary-action" onClick={() => addThought(input)} disabled={!input.trim()}>
            <Plus size={17} />
            放到云上
          </button>
        </div>

        <div className="suggestion-row">
          {suggestions.map(suggestion => (
            <button key={suggestion} onClick={() => addThought(suggestion)}>{suggestion}</button>
          ))}
        </div>

        <div className="free-footer-actions">
          <button className="quiet-button" onClick={() => setThoughts([])}><RotateCcw size={15} /> 清空画面</button>
          <button className="secondary-action" onClick={onComplete}>结束练习</button>
        </div>
      </section>
    </div>
  );
}
