import { CalendarDays, Cloud, Flame, Home, ScanLine, Waves } from 'lucide-react';
import type { PracticeId } from './Home';

const pages = [
  { id: 'home' as const, icon: Home, label: '欢迎' },
  { id: 'body' as const, icon: ScanLine, label: '身体扫描' },
  { id: 'breathing' as const, icon: Waves, label: '自然呼吸' },
  { id: 'candle' as const, icon: Flame, label: '烛火专注' },
  { id: 'thoughts' as const, icon: Cloud, label: '念头云朵' },
  { id: 'habit' as const, icon: CalendarDays, label: '练习记录' },
];

interface PracticeNavProps {
  current: PracticeId;
  onSelect: (practice: PracticeId) => void;
}

export default function PracticeNav({ current, onSelect }: PracticeNavProps) {
  return (
    <nav className="practice-nav" aria-label="练习页面">
      {pages.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={current === id ? 'nav-item active' : 'nav-item'}
          onClick={() => onSelect(id)}
          aria-current={current === id ? 'page' : undefined}
        >
          <Icon size={15} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
