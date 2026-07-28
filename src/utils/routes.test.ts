import { describe, expect, it } from 'vitest';
import { pathForRoute, routeFromPath } from './routes';

describe('app routes', () => {
  it('maps every guided mode to a stable URL', () => {
    expect(pathForRoute({ practice: 'body' })).toBe('/practice/body-scan');
    expect(pathForRoute({ practice: 'breathing', breathingMode: 'four-four' })).toBe('/practice/breathing/four-four');
    expect(pathForRoute({ practice: 'guided', guidedMode: 'lying' })).toBe('/practice/guided/lying');
  });

  it('restores practice state from direct URLs', () => {
    expect(routeFromPath('/practice/breathing/guided')).toEqual({
      practice: 'breathing',
      breathingMode: 'guided',
    });
    expect(routeFromPath('/practice/guided/seated/')).toEqual({
      practice: 'guided',
      guidedMode: 'seated',
    });
    expect(routeFromPath('/unknown')).toEqual({ practice: 'home' });
  });
});

