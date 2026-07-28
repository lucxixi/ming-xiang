import { RotateCw } from 'lucide-react';
import type { AudioLoadState } from '../hooks/useGuidedAudio';

interface AudioSessionStateProps {
  loadState: AudioLoadState;
  resumeAt: number;
  onResume: () => void;
  onRestart: () => void;
  onRetry: () => void;
}

function formatTime(value: number) {
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}

export default function AudioSessionState({
  loadState,
  resumeAt,
  onResume,
  onRestart,
  onRetry,
}: AudioSessionStateProps) {
  if (loadState === 'error') {
    return (
      <div className="audio-state-card" role="alert">
        <strong>音频没有加载成功</strong>
        <button onClick={onRetry}><RotateCw size={15} />重新加载</button>
      </div>
    );
  }

  if (resumeAt > 5) {
    return (
      <div className="audio-state-card">
        <strong>继续上次的 {formatTime(resumeAt)}</strong>
        <div>
          <button onClick={onResume}>继续</button>
          <button className="quiet" onClick={onRestart}>从头开始</button>
        </div>
      </div>
    );
  }

  if (loadState === 'loading') {
    return <div className="audio-loading" role="status">正在准备音频…</div>;
  }

  return null;
}

