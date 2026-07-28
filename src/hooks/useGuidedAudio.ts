import { useEffect, useMemo, useRef, useState } from 'react';
import { mediaUrl } from '../utils/assets';
import { clearAudioProgress, readAudioProgress, saveAudioProgress } from '../utils/progress';
import { activeCaptionAt, parseSrt, type CaptionCue } from '../utils/subtitles';

export type AudioLoadState = 'loading' | 'ready' | 'error';

interface GuidedAudioOptions {
  sessionKey: string;
  audioPath: string;
  subtitlePath: string;
  fallbackDuration: number;
  onEnded: () => void;
}

export function useGuidedAudio({
  sessionKey,
  audioPath,
  subtitlePath,
  fallbackDuration,
  onEnded,
}: GuidedAudioOptions) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastSavedSecond = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [running, setRunning] = useState(false);
  const [loadState, setLoadState] = useState<AudioLoadState>('loading');
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [retryToken, setRetryToken] = useState(0);
  const [resumeAt, setResumeAt] = useState(() => readAudioProgress(sessionKey));

  const audioSrc = mediaUrl(audioPath);
  const subtitleSrc = mediaUrl(subtitlePath);

  useEffect(() => {
    const controller = new AbortController();
    setLoadState('loading');
    fetch(subtitleSrc, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Subtitle request failed: ${response.status}`);
        return response.text();
      })
      .then(source => setCues(parseSrt(source)))
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setCues([]);
        setLoadState('error');
      });
    return () => controller.abort();
  }, [subtitleSrc, retryToken]);

  const caption = useMemo(() => activeCaptionAt(cues, elapsed), [cues, elapsed]);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio || loadState === 'error') return;
    try {
      await audio.play();
    } catch {
      setRunning(false);
      setLoadState('error');
    }
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) await play();
    else audio.pause();
  };

  const begin = async (resume: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = resume ? Math.min(resumeAt, Math.max(0, duration - 2)) : 0;
    audio.currentTime = nextTime;
    setElapsed(nextTime);
    setResumeAt(0);
    if (!resume) clearAudioProgress(sessionKey);
    await play();
  };

  const restart = () => {
    const audio = audioRef.current;
    audio?.pause();
    if (audio) audio.currentTime = 0;
    clearAudioProgress(sessionKey);
    setElapsed(0);
    setResumeAt(0);
    setRunning(false);
  };

  const retry = () => {
    setLoadState('loading');
    setRetryToken(value => value + 1);
    audioRef.current?.load();
  };

  return {
    audioRef,
    audioSrc,
    caption,
    duration,
    elapsed,
    loadState,
    resumeAt,
    running,
    begin,
    restart,
    retry,
    togglePlayback,
    audioProps: {
      onLoadedMetadata: (event: React.SyntheticEvent<HTMLAudioElement>) => {
        setDuration(event.currentTarget.duration);
      },
      onCanPlay: () => setLoadState(state => state === 'error' ? state : 'ready'),
      onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement>) => {
        const currentTime = event.currentTarget.currentTime;
        setElapsed(currentTime);
        const second = Math.floor(currentTime);
        if (second - lastSavedSecond.current >= 2 && currentTime < duration - 3) {
          lastSavedSecond.current = second;
          saveAudioProgress(sessionKey, currentTime);
        }
      },
      onPlay: () => setRunning(true),
      onPause: () => setRunning(false),
      onError: () => setLoadState('error'),
      onEnded: () => {
        setRunning(false);
        clearAudioProgress(sessionKey);
        onEnded();
      },
    },
  };
}

