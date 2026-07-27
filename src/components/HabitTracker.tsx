import { CalendarDays, Check, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { playChime, playClick } from '../utils/audio';

interface HabitTrackerProps {
  onComplete: () => void;
}

const STORAGE_KEY = 'inner_space_practice_days';

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function loadDays() {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return new Set<string>();
  }
}

export default function HabitTracker({ onComplete }: HabitTrackerProps) {
  const [days, setDays] = useState<Set<string>>(loadDays);
  const today = dayKey(new Date());
  const recentDays = useMemo(() => Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (20 - index));
    return { key: dayKey(date), label: date.getDate() };
  }), []);

  const toggleToday = () => {
    const next = new Set(days);
    if (next.has(today)) next.delete(today);
    else next.add(today);
    setDays(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    playChime();
  };

  const clear = () => {
    setDays(new Set());
    localStorage.removeItem(STORAGE_KEY);
    playClick();
  };

  return (
    <div className="practice-page free-practice-page">
      <section className="free-practice-shell habit-shell">
        <div className="free-practice-heading">
          <p className="eyebrow">只保存在这台设备</p>
          <h1>练习记录</h1>
          <p>它只是帮你记住哪些日子练过，不计算连续天数，也不评价练习质量。</p>
        </div>

        <div className="habit-summary">
          <div className="habit-symbol"><CalendarDays size={24} /></div>
          <div>
            <strong>{days.size}</strong>
            <span>次留下记录</span>
          </div>
        </div>

        <div className="habit-calendar">
          {recentDays.map(day => (
            <div key={day.key} className={days.has(day.key) ? 'marked' : day.key === today ? 'today' : ''}>
              {days.has(day.key) ? <Check size={15} /> : day.label}
            </div>
          ))}
        </div>

        <button className={days.has(today) ? 'primary-action recorded' : 'primary-action'} onClick={toggleToday}>
          <Check size={17} />
          {days.has(today) ? '今天已经留下记录' : '记录今天的练习'}
        </button>
        <p className="habit-reassurance">漏掉一天不需要补。想回来时，再回来就好。</p>

        <div className="free-footer-actions">
          <button className="quiet-button" onClick={clear}><RotateCcw size={15} /> 清空本地记录</button>
          <button className="secondary-action" onClick={onComplete}>回到首页</button>
        </div>
      </section>
    </div>
  );
}
