import { ArrowUp, RotateCcw, X } from 'lucide-react';
import type { CSSProperties, FormEvent } from 'react';
import { useRef, useState } from 'react';
import { playClick, playRelease } from '../utils/audio';

interface ThoughtBubblesProps {
  onComplete: () => void;
}

interface Thought {
  id: number;
  text: string;
  left: number;
  duration: number;
  scale: number;
  released: boolean;
}

const suggestions = ['那件还没解决的事', '我是不是做得不够好', '下一步怎么办'];

export default function ThoughtBubbles({ onComplete }: ThoughtBubblesProps) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [input, setInput] = useState('');
  const id = useRef(0);

  const removeThought = (thoughtId: number) => {
    setThoughts(items => items.filter(item => item.id !== thoughtId));
  };

  const addThought = (value: string) => {
    const text = value.trim();
    if (!text) return;

    const thoughtId = ++id.current;
    const duration = 18 + Math.random() * 8;
    playClick();
    setThoughts(items => [
      ...items.slice(-7),
      {
        id: thoughtId,
        text,
        left: 8 + Math.random() * 70,
        duration,
        scale: .9 + Math.random() * .18,
        released: false,
      },
    ]);
    window.setTimeout(() => removeThought(thoughtId), duration * 1000);
    setInput('');
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    addThought(input);
  };

  const release = (thoughtId: number) => {
    setThoughts(items => items.map(item => item.id === thoughtId ? { ...item, released: true } : item));
    playRelease();
    window.setTimeout(() => removeThought(thoughtId), 900);
  };

  return (
    <div className="practice-page free-practice-page thought-page">
      <section className="thought-stage">
        <div className="sky-light" aria-hidden="true" />

        <header className="thought-heading">
          <h1>念头云朵</h1>
          <p>写下来，让它经过。</p>
        </header>

        <div className="thought-actions">
          {thoughts.length > 0 && (
            <button onClick={() => setThoughts([])}>
              <RotateCcw size={15} />
              清空
            </button>
          )}
          <button onClick={onComplete}>
            <X size={15} />
            结束
          </button>
        </div>

        {thoughts.length === 0 && (
          <p className="thought-empty">此刻脑中正在说什么？</p>
        )}

        <div className="thought-cloud-layer" aria-live="polite">
          {thoughts.map(thought => (
            <button
              key={thought.id}
              className={thought.released ? 'thought-cloud released' : 'thought-cloud'}
              style={{
                '--cloud-left': `${thought.left}%`,
                '--cloud-duration': `${thought.duration}s`,
                '--cloud-scale': thought.scale,
              } as CSSProperties}
              onClick={() => release(thought.id)}
              aria-label={`放走念头：${thought.text}`}
            >
              <span>{thought.text}</span>
            </button>
          ))}
        </div>

        <form className="thought-composer" onSubmit={submit}>
          <div className="thought-entry">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="写下此刻的念头"
              aria-label="写下此刻的念头"
            />
            <button type="submit" disabled={!input.trim()} aria-label="放到云上">
              <ArrowUp size={19} />
            </button>
          </div>
          <div className="thought-suggestions">
            {suggestions.map(suggestion => (
              <button type="button" key={suggestion} onClick={() => addThought(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </section>
    </div>
  );
}
