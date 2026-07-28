import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import AmbientMusic from './components/AmbientMusic';
import BodyScan from './components/BodyScan';
import BreathingExercise from './components/BreathingExercise';
import GuidedMeditation from './components/GuidedMeditation';
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
      case 'guided':
        return <GuidedMeditation onComplete={goHome} />;
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
        <div className="topbar-actions">
          <PracticeNav current={practice} onSelect={setPractice} />
          <AmbientMusic />
        </div>
      </header>

      <main>{renderPractice()}</main>
    </div>
  );
}
