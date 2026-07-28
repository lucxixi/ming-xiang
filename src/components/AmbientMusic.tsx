import { Music2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { mediaUrl } from '../utils/assets';

const AMBIENT_SRC = '/audio/ambient-focus.m4a';
const DEFAULT_AMBIENT_VOLUME = 0.7;
const VOLUME_KEY = 'inner-space:ambient-volume';
const ENABLED_KEY = 'inner-space:ambient-enabled';

function storedVolume() {
  try {
    const value = Number(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : DEFAULT_AMBIENT_VOLUME;
  } catch {
    return DEFAULT_AMBIENT_VOLUME;
  }
}

export default function AmbientMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(storedVolume);
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(ENABLED_KEY) !== 'false' && volume > 0;
    } catch {
      return volume > 0;
    }
  });
  const enabledRef = useRef(enabled);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    enabledRef.current = enabled;
    try {
      localStorage.setItem(ENABLED_KEY, String(enabled));
    } catch {
      // Preferences remain available for this session.
    }
  }, [enabled]);

  useEffect(() => {
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      // Preferences remain available for this session.
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = storedVolume();

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
  }, []); // The element is initialized once; later volume changes are handled by changeVolume.

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
    const nextVolume = volume || DEFAULT_AMBIENT_VOLUME;
    if (!volume) setVolume(nextVolume);
    audio.volume = nextVolume;
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  const changeVolume = async (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(value);
    audio.volume = value;

    if (value === 0) {
      enabledRef.current = false;
      setEnabled(false);
      audio.pause();
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
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
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={event => changeVolume(Number(event.currentTarget.value))}
        aria-label={`背景音乐音量 ${Math.round(volume * 100)}%`}
        title={`背景音乐音量 ${Math.round(volume * 100)}%`}
      />
      <output aria-live="polite">{Math.round(volume * 100)}</output>
      <audio
        ref={audioRef}
        src={mediaUrl(AMBIENT_SRC)}
        autoPlay={enabled}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}
