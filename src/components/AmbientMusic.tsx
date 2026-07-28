import { Music2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AMBIENT_SRC = '/audio/ambient-focus.m4a';
const AMBIENT_VOLUME = 0.38;

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabledRef = useRef(true);
  const [enabled, setEnabled] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = AMBIENT_VOLUME;

    const tryToPlay = () => {
      if (!enabledRef.current || !audio.paused) return;
      audio.play().catch(() => setPlaying(false));
    };

    tryToPlay();
    document.addEventListener('pointerdown', tryToPlay, { capture: true, once: true });
    document.addEventListener('keydown', tryToPlay, { capture: true, once: true });

    return () => {
      document.removeEventListener('pointerdown', tryToPlay, true);
      document.removeEventListener('keydown', tryToPlay, true);
      audio.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      enabledRef.current = false;
      setEnabled(false);
      audio.pause();
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className="ambient-music">
      <button
        className={enabled ? 'ambient-toggle active' : 'ambient-toggle'}
        onClick={toggle}
        aria-label={enabled ? '关闭背景音乐' : '播放背景音乐'}
        title={enabled ? '关闭背景音乐' : '播放背景音乐'}
      >
        {enabled ? <Music2 size={16} /> : <VolumeX size={16} />}
        <span className={playing ? 'ambient-pulse is-playing' : 'ambient-pulse'} aria-hidden="true" />
      </button>
      <audio
        ref={audioRef}
        src={AMBIENT_SRC}
        autoPlay
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}
