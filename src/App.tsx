import { useState, useEffect } from 'react';
import StarField from './components/StarField';
import CourseNav from './components/CourseNav';
import Hero from './components/Hero';
import WhatIsMeditation from './components/WhatIsMeditation';
import BreathingExercise from './components/BreathingExercise';
import BodyScan from './components/BodyScan';
import ThoughtBubbles from './components/ThoughtBubbles';
import FocusExercise from './components/FocusExercise';
import HabitTracker from './components/HabitTracker';

const COMPLETED_KEY = 'meditation_completed_modules';

function loadCompleted(): Set<number> {
  try {
    const data = localStorage.getItem(COMPLETED_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(completed: Set<number>) {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed]));
}

export default function App() {
  const [module, setModule] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(loadCompleted);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [module]);

  const markComplete = (id: number, next: number) => {
    const updated = new Set(completed);
    updated.add(id);
    setCompleted(updated);
    saveCompleted(updated);
    setModule(next);
  };

  const renderModule = () => {
    switch (module) {
      case 0:
        return (
          <Hero
            onStart={() => setModule(1)}
            completedCount={completed.size}
          />
        );
      case 1:
        return <WhatIsMeditation onComplete={() => markComplete(1, 2)} />;
      case 2:
        return <BreathingExercise onComplete={() => markComplete(2, 3)} />;
      case 3:
        return <BodyScan onComplete={() => markComplete(3, 4)} />;
      case 4:
        return <ThoughtBubbles onComplete={() => markComplete(4, 5)} />;
      case 5:
        return <FocusExercise onComplete={() => markComplete(5, 6)} />;
      case 6:
        return <HabitTracker onComplete={() => { markComplete(6, 0); }} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      <StarField />
      <CourseNav current={module} completed={completed} onSelect={setModule} />
      <main className="relative z-10">
        {renderModule()}
      </main>
    </div>
  );
}
