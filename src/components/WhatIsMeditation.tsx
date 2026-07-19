import { ChevronRight, CheckCircle } from 'lucide-react';

interface WhatIsMeditationProps {
  onComplete: () => void;
}

const facts = [
  {
    num: '01',
    title: '不是让大脑空白',
    desc: '冥想的目标不是停止思考，而是学会观察念头，不被它们带走。就像看着云彩飘过天空——你不需要追赶每一朵云。',
    icon: '🌤️',
  },
  {
    num: '02',
    title: '不是宗教仪式',
    desc: '现代冥想经过大量神经科学研究验证，完全可以作为提升专注力、减少压力的日常工具。哈佛医学院有超过30年的研究支持。',
    icon: '🔬',
  },
  {
    num: '03',
    title: '每天8分钟就有效',
    desc: '研究表明，每天练习8-12分钟，坚持8周，大脑结构就会发生可测量的改变——杏仁核体积缩小，前额叶皮层增厚。',
    icon: '⏱️',
  },
  {
    num: '04',
    title: '核心：注意力的训练',
    desc: '冥想就是反复将注意力拉回到当下的练习。走神不是失败，意识到走神并拉回来，才是冥想的"锻炼动作"。',
    icon: '🎯',
  },
];

const benefits = [
  { label: '减少焦虑', pct: 68 },
  { label: '提升专注力', pct: 72 },
  { label: '改善睡眠', pct: 58 },
  { label: '情绪稳定', pct: 75 },
];

export default function WhatIsMeditation({ onComplete }: WhatIsMeditationProps) {
  return (
    <div className="min-h-screen px-4 py-24 max-w-3xl mx-auto">
      <div className="fade-in-up">
        <div className="text-xs tracking-widest mb-3 font-medium" style={{ color: 'var(--primary)' }}>MODULE 01</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          冥想到底是什么？
        </h2>
        <p className="text-base mb-12" style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
          在开始练习之前，先打破几个常见误解。
        </p>
      </div>

      {/* Misconceptions */}
      <div className="space-y-4 mb-16">
        {facts.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 fade-in-up"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{f.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono" style={{ color: 'var(--primary)' }}>{f.num}</span>
                  <h3 className="font-semibold text-base" style={{ color: 'var(--text)' }}>{f.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits chart */}
      <div className="rounded-2xl p-6 mb-12 fade-in-up-delay-2"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <h3 className="font-semibold mb-1 text-base" style={{ color: 'var(--text)' }}>科学研究支持的效果</h3>
        <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>基于全球超过3000项冥想研究的综合分析</p>
        <div className="space-y-4">
          {benefits.map((b, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5">
                <span style={{ color: 'var(--text)' }}>{b.label}</span>
                <span style={{ color: 'var(--primary)' }}>{b.pct}% 受益</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full progress-fill"
                  style={{
                    width: `${b.pct}%`,
                    background: 'linear-gradient(to right, var(--primary), #7dd6f0)',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The core insight */}
      <div className="rounded-2xl p-6 mb-12 text-center fade-in-up-delay-3"
        style={{ background: 'linear-gradient(135deg, rgba(91,196,232,0.08), rgba(240,192,96,0.06))', border: '1px solid rgba(91,196,232,0.2)' }}>
        <div className="text-4xl mb-4">💭</div>
        <blockquote className="text-lg font-medium mb-3 leading-relaxed" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          "你不是你的念头，<br />你是观察念头的那个人。"
        </blockquote>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>—— 冥想的核心洞察</p>
      </div>

      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-medium transition-all duration-300 fade-in-up-delay-4"
        style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,196,232,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary-glow)'; }}
      >
        <CheckCircle size={16} />
        我明白了，继续
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
