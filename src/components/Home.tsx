import { ArrowUpRight, CalendarDays, Cloud, Flame, ScanLine, Waves } from 'lucide-react';

export type PracticeId = 'home' | 'body' | 'breathing' | 'candle' | 'thoughts' | 'habit';

interface HomeProps {
  onSelect: (practice: PracticeId) => void;
}

const supportingPractices = [
  {
    id: 'candle' as const,
    icon: Flame,
    title: '烛火专注',
    copy: '让视线停在一处。走神时，只需注意到自己又回来了。',
  },
  {
    id: 'thoughts' as const,
    icon: Cloud,
    title: '念头云朵',
    copy: '把一个念头放到眼前看看，不急着相信，也不需要赶走。',
  },
  {
    id: 'habit' as const,
    icon: CalendarDays,
    title: '练习记录',
    copy: '给今天留一个小小的标记。不连续，也没有关系。',
  },
];

export default function Home({ onSelect }: HomeProps) {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">给第一次冥想的三分钟</p>
          <h1>先不用想明白。</h1>
          <p className="hero-lead">
            不需要学会放空，也不必先变得平静。选择一种现在比较容易感知的方式，从这里待一会儿。
          </p>
          <div className="safety-note">
            可以睁眼、暂停或结束。关注呼吸不舒服时，改听周围的声音。
          </div>
        </div>

        <div className="water-signature" aria-hidden="true">
          <span className="water-ring water-ring-one" />
          <span className="water-ring water-ring-two" />
          <span className="water-ring water-ring-three" />
          <span className="water-center" />
        </div>
      </section>

      <section className="primary-practices" aria-labelledby="start-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">从这里开始</p>
            <h2 id="start-title">两种零基础练习</h2>
          </div>
          <p>都约 3 分钟，没有完成标准。</p>
        </div>

        <div className="primary-grid">
          <button className="practice-card practice-card-body" onClick={() => onSelect('body')}>
            <div className="practice-icon"><ScanLine size={23} /></div>
            <div>
              <p className="practice-meta">脑子很乱 · 很难集中</p>
              <h3>身体扫描</h3>
              <p>从双脚与地面的接触开始，依次感知身体。任何部位都可以跳过。</p>
            </div>
            <span className="card-action">开始 3 分钟 <ArrowUpRight size={17} /></span>
          </button>

          <button className="practice-card practice-card-breath" onClick={() => onSelect('breathing')}>
            <div className="practice-icon"><Waves size={23} /></div>
            <div>
              <p className="practice-meta">想找一个简单锚点</p>
              <h3>自然呼吸</h3>
              <p>只知道这一口气正在发生。不需要深呼吸，也不规定节奏。</p>
            </div>
            <span className="card-action">开始 3 分钟 <ArrowUpRight size={17} /></span>
          </button>
        </div>
      </section>

      <section className="supporting-section" aria-labelledby="free-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">自由练习</p>
            <h2 id="free-title">如果你想换一种方式</h2>
          </div>
          <p>这些练习不会影响进度，也不需要依次完成。</p>
        </div>

        <div className="supporting-grid">
          {supportingPractices.map(({ id, icon: Icon, title, copy }) => (
            <button key={id} className="support-card" onClick={() => onSelect(id)}>
              <Icon size={19} />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <ArrowUpRight size={16} className="support-arrow" />
            </button>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        Inner Space 是日常练习工具，不替代医疗、心理治疗或现实中的安全行动。
      </footer>
    </div>
  );
}
