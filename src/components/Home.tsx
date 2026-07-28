import { ScanLine, Waves } from 'lucide-react';

export type PracticeId = 'home' | 'body' | 'breathing' | 'guided' | 'thoughts' | 'habit';

interface HomeProps {
  onSelect: (practice: PracticeId) => void;
}

export default function Home({ onSelect }: HomeProps) {
  return (
    <div className="home">
      <section className="welcome-stage">
        <div className="welcome-wash" aria-hidden="true" />
        <div className="hero-copy">
          <h1 className="welcome-statement">开始一次10分钟的冥想</h1>
          <div className="welcome-actions">
            <button className="primary-action large" onClick={() => onSelect('body')}>
              <ScanLine size={17} />
              身体扫描
            </button>
            <button className="text-action" onClick={() => onSelect('breathing')}>
              <Waves size={16} />
              自然呼吸
            </button>
          </div>
          <p className="welcome-safety">随时可以睁眼、暂停或结束</p>
        </div>
      </section>
    </div>
  );
}
