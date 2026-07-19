import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface HeroProps {
  onStart: () => void;
  completedCount: number;
}

export default function Hero({ onStart, completedCount }: HeroProps) {
  const lotusBloomed = useRef(false);

  useEffect(() => {
    lotusBloomed.current = true;
  }, []);

  const petals = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-24">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #5bc4e8, transparent)', top: '15%', left: '10%', animation: 'floatOrb1 12s ease-in-out infinite alternate' }} />
        <div className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f0c060, transparent)', bottom: '20%', right: '8%', animation: 'floatOrb2 15s ease-in-out infinite alternate' }} />
      </div>

      {/* Lotus symbol */}
      <div className="relative w-24 h-24 mb-8 fade-in-up">
        <div className="absolute inset-0 flex items-center justify-center">
          {petals.map((rot, i) => (
            <div
              key={i}
              className="petal absolute w-5 h-10 rounded-full opacity-60"
              style={{
                '--r': `${rot}deg`,
                '--d': `${i * 0.12}s`,
                background: 'linear-gradient(to top, var(--primary), transparent)',
                transformOrigin: 'bottom center',
                transform: `rotate(${rot}deg) translateY(-28px) scale(1)`,
              } as React.CSSProperties}
            />
          ))}
          <div className="w-8 h-8 rounded-full z-10 flex items-center justify-center"
            style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', boxShadow: '0 0 20px var(--primary)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--primary)' }} />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-3 fade-in-up-delay-1 glow-text"
        style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
        冥想入门课
      </h1>
      <p className="text-base md:text-lg text-center mb-2 fade-in-up-delay-2"
        style={{ color: 'var(--text-muted)', maxWidth: '480px' }}>
        专为零基础设计 · 7个互动模块 · 循序渐进
      </p>
      <p className="text-sm text-center mb-10 fade-in-up-delay-3"
        style={{ color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.8' }}>
        放下手边的事，用15分钟认识自己的内心。<br />冥想不是逃避，而是一次向内的探索。
      </p>

      {/* Progress badge */}
      {completedCount > 0 && (
        <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full fade-in-up-delay-3"
          style={{ background: 'var(--accent-glow)', border: '1px solid rgba(240,192,96,0.3)' }}>
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-sm" style={{ color: 'var(--accent)' }}>已完成 {completedCount}/6 个模块</span>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onStart}
        className="group flex items-center gap-3 px-8 py-4 rounded-full font-medium text-base transition-all duration-300 fade-in-up-delay-4"
        style={{
          background: 'linear-gradient(135deg, var(--primary), #3aa8d4)',
          color: '#04091a',
          boxShadow: '0 0 30px rgba(91,196,232,0.4)',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(91,196,232,0.65)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(91,196,232,0.4)')}
      >
        {completedCount > 0 ? '继续学习' : '开始冥想之旅'}
        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      {/* Module preview cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-16 max-w-2xl w-full fade-in-up-delay-5">
        {[
          { emoji: '🌬️', title: '呼吸练习', desc: '方框呼吸法 · 平静身心' },
          { emoji: '🧘', title: '身体扫描', desc: '感知全身 · 释放紧张' },
          { emoji: '☁️', title: '念头观察', desc: '无评判地放下念头' },
          { emoji: '🕯️', title: '专注冥想', desc: '烛火练习 · 训练专注' },
          { emoji: '📆', title: '日常修习', desc: '21天打卡 · 建立习惯' },
          { emoji: '🧠', title: '科学原理', desc: '了解冥想的神经科学' },
        ].map((item, i) => (
          <div key={i} className="module-card rounded-xl p-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-2xl mb-2">{item.emoji}</div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{item.title}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatOrb1 {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(40px, -30px) scale(1.15); }
        }
        @keyframes floatOrb2 {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(-35px, 25px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
