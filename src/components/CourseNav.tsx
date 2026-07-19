import { Wind, Brain, Scan, Cloud, Flame, Calendar } from 'lucide-react';

const modules = [
  { id: 0, icon: Wind, label: '欢迎', sub: '开启冥想之旅' },
  { id: 1, icon: Brain, label: '冥想是什么', sub: '认识冥想的本质' },
  { id: 2, icon: Wind, label: '呼吸练习', sub: '方框呼吸法' },
  { id: 3, icon: Scan, label: '身体扫描', sub: '感知当下' },
  { id: 4, icon: Cloud, label: '念头观察', sub: '放下执念' },
  { id: 5, icon: Flame, label: '专注冥想', sub: '烛火静心' },
  { id: 6, icon: Calendar, label: '日常修习', sub: '建立习惯' },
];

interface CourseNavProps {
  current: number;
  completed: Set<number>;
  onSelect: (id: number) => void;
}

export default function CourseNav({ current, completed, onSelect }: CourseNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b" style={{ background: 'rgba(4,9,26,0.85)', borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {/* Logo */}
          <div className="flex-shrink-0 mr-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)' }} />
            </div>
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--primary)', fontFamily: 'Noto Serif SC' }}>静心课</span>
          </div>

          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = current === m.id;
            const isDone = completed.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className="relative flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all duration-300 whitespace-nowrap"
                style={{
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                  color: isActive ? 'var(--primary)' : isDone ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                <Icon size={13} />
                <span>{m.label}</span>
                {isDone && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
