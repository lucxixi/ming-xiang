import { useState, useRef } from 'react';
import { Play, Pause, CheckCircle, ChevronRight } from 'lucide-react';
import { playScanTone, playChime, playClick } from '../utils/audio';

interface BodyScanProps {
  onComplete: () => void;
}

const REGIONS = [
  { id: 'head',  label: '头部',     hint: '放松额头的紧绷感，让眼皮沉下来，松开下颌，感受头皮轻轻扩展...', y: 60,  x: 120, rx: 32, ry: 24 },
  { id: 'neck',  label: '颈肩',     hint: '让肩膀自然下沉，感受颈部两侧的肌肉慢慢松开，不要用力...', y: 118, x: 120, rx: 30, ry: 14 },
  { id: 'chest', label: '胸腹',     hint: '感受每次呼吸时胸腔轻轻起伏，让腹部完全放松，没有收着...', y: 178, x: 120, rx: 38, ry: 28 },
  { id: 'arms',  label: '手臂与手', hint: '感受手指的重量，让双臂完全垂落，感受血液流向指尖...', y: 200, x: 120, rx: 58, ry: 18 },
  { id: 'hips',  label: '髋部',     hint: '感受臀部与坐垫的接触，让整个骨盆区域沉下去...', y: 248, x: 120, rx: 28, ry: 18 },
  { id: 'legs',  label: '腿部',     hint: '感受大腿和小腿的重量，双腿自然伸展，膝盖松开...', y: 315, x: 120, rx: 32, ry: 22 },
  { id: 'feet',  label: '双脚',     hint: '感受脚跟与地面的接触，脚趾完全松开，像棉花一样...', y: 385, x: 120, rx: 24, ry: 16 },
];

export default function BodyScan({ onComplete }: BodyScanProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [autoCompleted, setAutoCompleted] = useState(false);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoIndexRef = useRef(0);
  const [scanProgress, setScanProgress] = useState(0);

  const canComplete = visited.size >= 3 || autoCompleted;

  const stopAuto = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const handleRegionClick = (i: number) => {
    if (running) return;
    playClick();
    playScanTone(i);
    setActiveIndex(prev => prev === i ? -1 : i);
    setVisited(prev => new Set([...prev, i]));
  };

  const startAuto = () => {
    stopAuto();
    setAutoCompleted(false);
    setActiveIndex(0);
    setVisited(new Set([0]));
    playScanTone(0);
    autoIndexRef.current = 0;
    setScanProgress(0);
    setRunning(true);

    timerRef.current = setInterval(() => {
      autoIndexRef.current += 1;
      setScanProgress(autoIndexRef.current);
      if (autoIndexRef.current >= REGIONS.length) {
        stopAuto();
        setRunning(false);
        setActiveIndex(-1);
        setAutoCompleted(true);
        playChime();
      } else {
        setActiveIndex(autoIndexRef.current);
        setVisited(prev => new Set([...prev, autoIndexRef.current]));
        playScanTone(autoIndexRef.current);
      }
    }, 5000);
  };

  const stopScan = () => { stopAuto(); setRunning(false); setActiveIndex(-1); };

  const currentRegion = activeIndex >= 0 ? REGIONS[activeIndex] : null;

  return (
    <div className="min-h-screen px-4 py-24 max-w-3xl mx-auto">
      <div className="fade-in-up mb-6">
        <div className="text-xs tracking-widest mb-3 font-medium" style={{ color: 'var(--primary)' }}>MODULE 03</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Noto Serif SC', color: 'var(--text)' }}>
          身体扫描冥想
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: '1.9' }}>
          将注意力从头到脚依次移动，感知每个部位。<br/>
          <span style={{ color: 'var(--primary)' }}>点击身体部位</span>单独体验，或<span style={{ color: 'var(--primary)' }}>开始自动引导</span>。探索3个部位后即可继续。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Body SVG */}
        <div className="flex-shrink-0 mx-auto md:mx-0 fade-in-up-delay-1">
          <svg width="240" height="440" viewBox="0 0 240 440">
            {activeIndex >= 0 && (
              <ellipse cx={REGIONS[activeIndex].x} cy={REGIONS[activeIndex].y}
                rx={REGIONS[activeIndex].rx + 22} ry={REGIONS[activeIndex].ry + 18}
                fill="rgba(91,196,232,0.1)" className="scan-active" />
            )}
            {/* Body */}
            <circle cx="120" cy="60" r="32" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="109" y="90" width="22" height="18" rx="8" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <path d="M60,115 Q90,108 120,108 Q150,108 180,115 L184,150 Q150,145 120,145 Q90,145 56,150 Z"
              fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="79" y="145" width="82" height="100" rx="12" fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <path d="M79,150 Q56,175 52,222 Q50,242 57,256 Q67,242 71,222 Q76,175 86,155 Z"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            <path d="M161,150 Q184,175 188,222 Q190,242 183,256 Q173,242 169,222 Q164,175 154,155 Z"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            <path d="M79,245 Q81,265 86,276 Q100,281 120,281 Q140,281 154,276 Q159,265 161,245 Z"
              fill="rgba(255,255,255,0.055)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <path d="M86,276 Q81,310 83,360 Q85,390 89,406 Q101,411 106,406 Q109,390 109,360 Q111,310 116,276 Z"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            <path d="M154,276 Q159,310 157,360 Q155,390 151,406 Q139,411 134,406 Q131,390 131,360 Q129,310 124,276 Z"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />

            {running && activeIndex >= 0 && (
              <line x1="40" y1={REGIONS[activeIndex].y} x2="200" y2={REGIONS[activeIndex].y}
                stroke="rgba(91,196,232,0.35)" strokeWidth="1" strokeDasharray="4 3" />
            )}

            {REGIONS.map((r, i) => {
              const isActive = activeIndex === i;
              const isVisited = visited.has(i);
              return (
                <g key={r.id} onClick={() => handleRegionClick(i)} style={{ cursor: running ? 'default' : 'pointer' }}>
                  <ellipse cx={r.x} cy={r.y} rx={r.rx} ry={r.ry}
                    fill={isActive ? 'rgba(91,196,232,0.28)' : isVisited ? 'rgba(91,196,232,0.05)' : 'rgba(91,196,232,0)'}
                    stroke={isActive ? 'rgba(91,196,232,0.85)' : isVisited ? 'rgba(91,196,232,0.3)' : 'rgba(91,196,232,0.18)'}
                    strokeWidth={isActive ? 1.5 : 1}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 7px rgba(91,196,232,0.55))' : 'none',
                      transition: 'all 0.35s ease',
                    }} />
                  <text x={r.x + r.rx + 5} y={r.y + 4}
                    fill={isActive ? 'rgba(91,196,232,0.95)' : isVisited ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}
                    fontSize="9.5" fontFamily="Noto Sans SC" style={{ pointerEvents: 'none', transition: 'fill 0.3s' }}>
                    {r.label}{isVisited && !isActive ? ' ✓' : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right panel */}
        <div className="flex-1 fade-in-up-delay-2">
          {/* Hint box */}
          <div className="rounded-2xl p-5 mb-4 min-h-28 transition-all duration-400"
            style={{
              background: currentRegion ? 'rgba(91,196,232,0.07)' : 'var(--bg-card)',
              border: `1px solid ${currentRegion ? 'rgba(91,196,232,0.28)' : 'var(--border)'}`,
            }}>
            {currentRegion ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full scan-active" style={{ background: 'var(--primary)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{currentRegion.label}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text)', lineHeight: '1.95' }}>{currentRegion.hint}</p>
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  {running ? '5秒后自动移到下一区域...' : '点击其他部位继续探索'}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-20 text-center gap-2">
                {autoCompleted ? (
                  <><div className="text-xl">✨</div><p className="text-sm" style={{ color: '#7dd6a8' }}>身体扫描完成！感受全身的放松</p></>
                ) : visited.size > 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>已探索 {visited.size}/{REGIONS.length} 个区域</p>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>点击左侧身体的任意部位开始</p>
                )}
              </div>
            )}
          </div>

          {/* Auto progress */}
          {running && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                <span>自动扫描中</span><span>{Math.min(scanProgress + 1, REGIONS.length)}/{REGIONS.length}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${((scanProgress + 1) / REGIONS.length) * 100}%`, background: 'var(--primary)' }} />
              </div>
            </div>
          )}

          {/* Visited chips */}
          {!running && visited.size > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {REGIONS.map((r, i) => (
                <span key={r.id} className="text-xs px-2 py-0.5 rounded-full transition-all"
                  style={{
                    background: visited.has(i) ? 'rgba(91,196,232,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${visited.has(i) ? 'rgba(91,196,232,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    color: visited.has(i) ? 'var(--primary)' : 'var(--text-muted)',
                  }}>
                  {r.label}{visited.has(i) ? ' ✓' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Prep tips */}
          <div className="space-y-2 mb-5">
            {['找一个舒适坐姿，背部放松', '闭上眼睛或目光柔和向下', '遇到不适感只是观察，不评判'].map((tip, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--primary)' }} />
                {tip}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3 flex-wrap">
            {running ? (
              <button onClick={stopScan}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <Pause size={14} /> 停止
              </button>
            ) : (
              <button onClick={startAuto}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, var(--primary), #3aa8d4)', color: '#04091a', boxShadow: '0 0 20px rgba(91,196,232,0.3)' }}>
                <Play size={14} />
                {autoCompleted ? '再次扫描' : '开始自动引导'}
              </button>
            )}
          </div>

          {/* Complete after 3 manual or auto finish */}
          {canComplete && (
            <button onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-medium mt-4 fade-in-up transition-all duration-300"
              style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              <CheckCircle size={16} />
              {autoCompleted ? '完美！继续下一课' : `已感知 ${visited.size} 个区域，继续`}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
