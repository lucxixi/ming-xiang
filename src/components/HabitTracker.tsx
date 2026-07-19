import { useState } from 'react';
import { CheckCircle, Trophy, Flame, RotateCcw } from 'lucide-react';
import { playChime, playClick } from '../utils/audio';

interface HabitTrackerProps {
  onComplete: () => void;
}

const TOTAL_DAYS = 21;
const STORAGE_KEY = 'meditation_habit_tracker';

const TIPS = [
  '选择固定的时间，比如早起后或睡前',
  '从5分钟开始，不要强迫自己太久',
  '不要评判自己的练习质量',
  '错过一天没关系，重要的是不错过两天',
  '把冥想垫放在明显的地方',
  '可以先从呼吸练习开始',
  '记录练习后的感受，强化动力',
];

function loadCheckins(): Set<string> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCheckins(checkins: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkins]));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitTracker({ onComplete }: HabitTrackerProps) {
  const [checkins, setCheckins] = useState<Set<string>>(() => loadCheckins());
  const [justChecked, setJustChecked] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  const today = todayKey();
  const isCheckedToday = checkins.has(today);
  const completedCount = checkins.size;

  const streak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (!checkins.has(key)) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  })();

  const checkIn = () => {
    if (isCheckedToday) return;
    const next = new Set(checkins);
    next.add(today);
    setCheckins(next);
    saveCheckins(next);
    setJustChecked(true);
    playChime();
  };

  const reset = () => {
    const empty = new Set<string>();
    setCheckins(empty);
    saveCheckins(empty);
    setJustChecked(false);
    playClick();
  };

  // Generate 21 day keys from today back
  const dayKeys = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (TOTAL_DAYS - 1 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="min-h-screen px-4 py-24 max-w-2xl mx-auto">
      <div className="fade-in-up mb-8">
        <div className="text-xs tracking-widest mb-3 font-medium" style={{ color: 'var(--primary)' }}>MODULE 06</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          21天冥想挑战
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          神经科学研究显示，持续21天的练习能让冥想成为习惯。<br />
          每天完成练习后来这里打卡，建立你的冥想日历。
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8 fade-in-up-delay-1">
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={16} style={{ color: '#ff8844' }} />
            <span className="text-2xl font-bold" style={{ color: '#ff8844' }}>{streak}</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>连续天数</div>
        </div>
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--primary)' }}>{completedCount}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>累计天数</div>
        </div>
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
            {Math.round((completedCount / TOTAL_DAYS) * 100)}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>完成进度</div>
        </div>
      </div>

      {/* 21-day grid */}
      <div className="rounded-2xl p-5 mb-6 fade-in-up-delay-2"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: 'var(--text)' }}>21天日历</h3>
          <button onClick={reset} className="flex items-center gap-1 text-xs transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <RotateCcw size={11} />
            重置
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {dayKeys.map((key, i) => {
            const isChecked = checkins.has(key);
            const isToday = key === today;
            const isFuture = key > today;
            return (
              <div
                key={key}
                className="relative flex flex-col items-center gap-1"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-medium transition-all duration-300"
                  style={{
                    background: isChecked
                      ? 'linear-gradient(135deg, var(--primary), #3aa8d4)'
                      : isToday
                        ? 'rgba(91,196,232,0.1)'
                        : isFuture
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(255,255,255,0.05)',
                    border: isToday && !isChecked ? '1px solid rgba(91,196,232,0.4)' : '1px solid transparent',
                    color: isChecked ? '#04091a' : isFuture ? 'rgba(255,255,255,0.15)' : 'var(--text-muted)',
                    boxShadow: isChecked ? '0 0 10px rgba(91,196,232,0.3)' : 'none',
                  }}
                >
                  {isChecked ? '✓' : i + 1}
                </div>
                {isToday && (
                  <div className="w-1 h-1 rounded-full" style={{ background: 'var(--primary)' }} />
                )}
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(completedCount / TOTAL_DAYS) * 100}%`,
                background: 'linear-gradient(to right, var(--primary), var(--accent))',
              }}
            />
          </div>
          <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
            {completedCount}/{TOTAL_DAYS} 天 · {TOTAL_DAYS - completedCount > 0 ? `还差 ${TOTAL_DAYS - completedCount} 天` : '挑战完成！'}
          </div>
        </div>
      </div>

      {/* Today check-in */}
      <div className="rounded-2xl p-5 mb-6 fade-in-up-delay-3"
        style={{
          background: isCheckedToday ? 'rgba(125,214,168,0.08)' : 'var(--bg-card)',
          border: `1px solid ${isCheckedToday ? 'rgba(125,214,168,0.3)' : 'var(--border)'}`,
        }}>
        {justChecked || isCheckedToday ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(125,214,168,0.15)', border: '1px solid rgba(125,214,168,0.4)' }}>
              <CheckCircle size={22} style={{ color: '#7dd6a8' }} />
            </div>
            <div>
              <p className="font-medium text-sm mb-1" style={{ color: '#7dd6a8' }}>今日已打卡！</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {streak > 1 ? `你已连续坚持了 ${streak} 天，太棒了！` : '今天迈出了好的一步，明天继续！'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm mb-1" style={{ color: 'var(--text)' }}>今天完成冥想了吗？</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>记录今天的练习</p>
            </div>
            <button
              onClick={checkIn}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, var(--primary), #3aa8d4)',
                color: '#04091a',
                boxShadow: '0 0 20px rgba(91,196,232,0.3)',
              }}
            >
              打卡 ✓
            </button>
          </div>
        )}
      </div>

      {/* Daily tip */}
      <div className="rounded-2xl p-4 mb-6 fade-in-up-delay-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="text-xs mb-2 font-medium" style={{ color: 'var(--accent)' }}>今日小贴士</div>
        <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>{TIPS[tipIndex]}</p>
      </div>

      {/* Achievement */}
      {completedCount >= 7 && (
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-3 fade-in-up"
          style={{ background: 'rgba(240,192,96,0.08)', border: '1px solid rgba(240,192,96,0.25)' }}>
          <Trophy size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--accent)' }}>
              {completedCount >= 21 ? '🏆 挑战完成者' : completedCount >= 14 ? '⭐ 第三周开始了' : '🌱 一周冥想者'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {completedCount >= 21 ? '恭喜！你已经建立了冥想习惯' : `坚持 ${completedCount} 天，继续前进！`}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-medium fade-in-up transition-all duration-300"
        style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
      >
        <CheckCircle size={16} />
        课程完成！回到首页
        <CheckCircle size={16} />
      </button>
    </div>
  );
}
