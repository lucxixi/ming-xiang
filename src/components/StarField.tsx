import { useMemo } from 'react';

const STAR_COUNT = 120;

export default function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      dur: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="stars-layer">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            '--dur': s.dur,
            '--delay': s.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
