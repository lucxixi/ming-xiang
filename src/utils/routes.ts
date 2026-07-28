import type { PracticeId } from '../components/Home';

export type BreathingRouteMode = 'choice' | 'guided' | 'four-four';
export type GuidedRouteMode = 'choice' | 'seated' | 'lying';

export interface AppRoute {
  practice: PracticeId;
  breathingMode?: BreathingRouteMode;
  guidedMode?: GuidedRouteMode;
}

const practicePaths: Record<PracticeId, string> = {
  home: '/',
  body: '/practice/body-scan',
  breathing: '/practice/breathing',
  guided: '/practice/guided',
  thoughts: '/practice/thoughts',
  habit: '/practice/history',
};

export function pathForRoute(route: AppRoute) {
  if (route.practice === 'breathing' && route.breathingMode && route.breathingMode !== 'choice') {
    return `${practicePaths.breathing}/${route.breathingMode}`;
  }
  if (route.practice === 'guided' && route.guidedMode && route.guidedMode !== 'choice') {
    return `${practicePaths.guided}/${route.guidedMode}`;
  }
  return practicePaths[route.practice];
}

export function routeFromPath(pathname: string): AppRoute {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/practice/breathing/guided') return { practice: 'breathing', breathingMode: 'guided' };
  if (path === '/practice/breathing/four-four') return { practice: 'breathing', breathingMode: 'four-four' };
  if (path === '/practice/guided/seated') return { practice: 'guided', guidedMode: 'seated' };
  if (path === '/practice/guided/lying') return { practice: 'guided', guidedMode: 'lying' };

  const match = Object.entries(practicePaths).find(([, value]) => value === path);
  return { practice: (match?.[0] as PracticeId | undefined) ?? 'home' };
}

