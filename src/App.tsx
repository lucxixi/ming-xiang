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
import { pathForRoute, routeFromPath, type AppRoute } from './utils/routes';

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => routeFromPath(window.location.pathname));
  const practice = route.practice;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [practice]);

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextRoute: AppRoute, replace = false) => {
    const path = pathForRoute(nextRoute);
    if (path !== window.location.pathname) {
      window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
    }
    setRoute(nextRoute);
  };

  const selectPractice = (nextPractice: PracticeId) => navigate({ practice: nextPractice });
  const goHome = () => selectPractice('home');

  const renderPractice = () => {
    switch (practice) {
      case 'body':
        return <BodyScan onComplete={goHome} />;
      case 'breathing':
        return (
          <BreathingExercise
            initialMode={route.breathingMode}
            onModeChange={mode => navigate({ practice: 'breathing', breathingMode: mode })}
            onComplete={goHome}
          />
        );
      case 'guided':
        return (
          <GuidedMeditation
            initialMode={route.guidedMode}
            onModeChange={mode => navigate({ practice: 'guided', guidedMode: mode })}
            onComplete={goHome}
          />
        );
      case 'thoughts':
        return <ThoughtBubbles onComplete={goHome} />;
      case 'habit':
        return <HabitTracker onComplete={goHome} />;
      default:
        return <Home onSelect={selectPractice} />;
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
          <PracticeNav current={practice} onSelect={selectPractice} />
          <AmbientMusic />
        </div>
      </header>

      <main>{renderPractice()}</main>
    </div>
  );
}
