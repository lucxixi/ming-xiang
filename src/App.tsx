import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import BodyScan from './components/BodyScan';
import BreathingExercise from './components/BreathingExercise';
import FocusExercise from './components/FocusExercise';
import HabitTracker from './components/HabitTracker';
import Home, { type PracticeId } from './components/Home';
import PracticeNav from './components/PracticeNav';
import ThoughtBubbles from './components/ThoughtBubbles';

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
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="返回 Inner Space 首页">
          <span className="brand-mark"><Leaf size={17} /></span>
          <span>Inner Space</span>
        </button>
        <PracticeNav current={practice} onSelect={setPractice} />
      </header>

      <main>{renderPractice()}</main>
    </div>
  );
}
