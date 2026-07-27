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
          <p className="eyebrow">给第一次冥想的三分钟</p>
          <h1>先不用想明白。</h1>
          <p className="hero-lead">
            不需要学会放空，也不必先变得平静。选一个页面，跟着做三分钟就好。
          </p>
          <div className="welcome-actions">
            <button className="primary-action large" onClick={() => onSelect('body')}>
              从身体扫描开始
              <ArrowRight size={17} />
            </button>
            <button className="text-action" onClick={() => onSelect('breathing')}>
              <Waves size={16} />
              或试试自然呼吸
            </button>
          </div>
          <p className="welcome-safety">
            随时可以睁眼、暂停或结束。关注呼吸不舒服时，改听周围的声音。
          </p>
        </div>

        <div className="water-signature" aria-hidden="true">
          <span className="water-ring water-ring-one" />
          <span className="water-ring water-ring-two" />
          <span className="water-ring water-ring-three" />
          <span className="water-center" />
        </div>
      </section>
    </div>
  );
}
