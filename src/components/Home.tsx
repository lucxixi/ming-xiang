import { ArrowRight, Waves } from 'lucide-react';
import type { CSSProperties } from 'react';

export type PracticeId = 'home' | 'body' | 'breathing' | 'candle' | 'thoughts' | 'habit';

interface HomeProps {
  onSelect: (practice: PracticeId) => void;
}

export default function Home({ onSelect }: HomeProps) {
  const petals = Array.from({ length: 8 }, (_, index) => index * 45);

  return (
    <div className="home compact-home">
      <section className="welcome-stage">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />

        <div className="hero-copy">
          <div className="lotus-bloom" aria-hidden="true">
            {petals.map((rotation, index) => (
              <span
                key={rotation}
                className="lotus-petal"
                style={{
                  '--rotation': `${rotation}deg`,
                  '--delay': `${index * 0.1}s`,
                } as CSSProperties}
              />
            ))}
            <span className="lotus-heart"><i /></span>
          </div>

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
