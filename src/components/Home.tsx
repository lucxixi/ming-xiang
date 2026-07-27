import { ArrowRight, Waves } from 'lucide-react';

export type PracticeId = 'home' | 'body' | 'breathing' | 'candle' | 'thoughts' | 'habit';

interface HomeProps {
  onSelect: (practice: PracticeId) => void;
}

export default function Home({ onSelect }: HomeProps) {
  return (
    <div className="home compact-home">
      <section className="welcome-stage">
        <div className="hero-copy">
          <h1 className="welcome-statement">给第一次冥想的三分钟</h1>
          <div className="welcome-actions">
            <button className="primary-action large" onClick={() => onSelect('body')}>
              身体扫描
              <ArrowRight size={17} />
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
