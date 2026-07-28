import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface PracticeCompleteProps {
  onLeave: () => void;
  onAgain: () => void;
}

const options = ['松开了一些', '还是有点重', '没有明显变化', '现在不想判断'];

export default function PracticeComplete({ onLeave, onAgain }: PracticeCompleteProps) {
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div className="completion-panel">
      <p className="eyebrow">练习结束</p>
      <h2>带着现在的自己离开就好。</h2>
      <p>没有明显变化，也不代表这三分钟没有发生。</p>

      <fieldset>
        <legend>现在的你，和刚进来时相比呢？</legend>
        <div className="feedback-options">
          {options.map(option => (
            <button
              key={option}
              type="button"
              className={answer === option ? 'selected' : ''}
              onClick={() => setAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="completion-actions">
        <button className="secondary-action" onClick={onAgain}>再练一次</button>
        <button className="primary-action" onClick={onLeave}>
          <ArrowLeft size={16} />
          回到首页
        </button>
      </div>
    </div>
  );
}
