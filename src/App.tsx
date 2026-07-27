import { useEffect, useState } from 'react';
import { ArrowLeft, Leaf } from 'lucide-react';
import BodyScan from './components/BodyScan';
import BreathingExercise from './components/BreathingExercise';
import FocusExercise from './components/FocusExercise';
import HabitTracker from './components/HabitTracker';
import Home, { type PracticeId } from './components/Home';
import ThoughtBubbles from './components/ThoughtBubbles';

const TITLES: Partial<Record<PracticeId, string>> = {
  body: '身体扫描',
  breathing: '自然呼吸',
  candle: '烛火专注',
  thoughts: '念头云朵',
  habit: '练习记录',
};

export default function App() {
  const [practice, setPractice] = useState<PracticeId>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [practice]);

  const goHome = () => setPractice('home');

  const renderPractice = () => {
    switch (practice) {
      case 'body':
        return <BodyScan onComplete={goHome} />;
      case 'breathing':
        return <BreathingExercise onComplete={goHome} />;
      case 'candle':
        return <FocusExercise onComplete={goHome} />;
      case 'thoughts':
        return <ThoughtBubbles onComplete={goHome} />;
      case 'habit':
        return <HabitTracker onComplete={goHome} />;
      default:
        return <Home onSelect={setPractice} />;
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient-leaf ambient-leaf-one" />
      <div className="ambient-leaf ambient-leaf-two" />

      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="返回 Inner Space 首页">
          <span className="brand-mark"><Leaf size={17} /></span>
          <span>Inner Space</span>
        </button>

        {practice !== 'home' && (
          <div className="topbar-context">
            <span>{TITLES[practice]}</span>
            <button className="quiet-button" onClick={goHome}>
              <ArrowLeft size={15} />
              返回首页
            </button>
          </div>
        )}
      </header>

      <main>{renderPractice()}</main>
    </div>
  );
}
