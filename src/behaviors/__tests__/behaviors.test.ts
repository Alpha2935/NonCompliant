import { describe, it, expect } from 'vitest';
import { shouldRefuse } from '../../behaviors/refuse';
import { computeDelay } from '../../behaviors/delay';
import { computeResistance } from '../../behaviors/resist';

describe('refuse', () => {
    it('refuses when patience very low', () => {
        expect(shouldRefuse({ patience: 0.1, trust: 0.5, fatigue: 0.5, engagement: 0.5 }, 0.3)).toBe(true);
    });

    it('refuses when fatigue high + engagement low', () => {
        expect(shouldRefuse({ patience: 0.5, trust: 0.5, fatigue: 0.9, engagement: 0.15 }, 0.3)).toBe(true);
    });

    it('does not refuse at healthy state', () => {
        expect(shouldRefuse({ patience: 0.8, trust: 0.8, fatigue: 0.2, engagement: 0.6 }, 0.2)).toBe(false);
    });
});

describe('delay', () => {
    it('returns 0 for healthy state', () => {
        const d = computeDelay({ patience: 0.9, trust: 0.9, fatigue: 0.0, engagement: 0.8 });
        expect(d).toBeLessThan(100);
    });

    it('returns higher delay for stressed state', () => {
        const d = computeDelay({ patience: 0.2, trust: 0.2, fatigue: 0.8, engagement: 0.2 });
        expect(d).toBeGreaterThan(300);
    });

    it('caps at 900ms', () => {
        const d = computeDelay({ patience: 0.0, trust: 0.0, fatigue: 1.0, engagement: 0.0 });
        expect(d).toBeLessThanOrEqual(900);
    });
});

describe('resist', () => {
    it('low resistance for healthy state', () => {
        const r = computeResistance({ patience: 0.9, trust: 0.8, fatigue: 0.1, engagement: 0.7 });
        expect(r.factor).toBeLessThan(0.2);
        expect(r.snapBack).toBe(false);
    });

    it('snap-back for stressed state', () => {
        const r = computeResistance({ patience: 0.1, trust: 0.1, fatigue: 0.9, engagement: 0.1 });
        expect(r.factor).toBeGreaterThan(0.5);
        expect(r.snapBack).toBe(true);
    });
});
