import { describe, it, expect } from 'vitest';
import { createInitialState, clampState, clamp01, applyDecay, isCooperationWindow } from '../state';

describe('state', () => {
    it('creates initial state with valid values', () => {
        const s = createInitialState();
        for (const k of ['patience', 'trust', 'fatigue', 'engagement'] as const) {
            expect(s[k]).toBeGreaterThanOrEqual(0);
            expect(s[k]).toBeLessThanOrEqual(1);
        }
    });

    it('clamp01 clamps correctly', () => {
        expect(clamp01(-0.5)).toBe(0);
        expect(clamp01(0.5)).toBe(0.5);
        expect(clamp01(1.5)).toBe(1);
    });

    it('clampState clamps all fields', () => {
        const s = clampState({ patience: -1, trust: 2, fatigue: 0.5, engagement: -0.1 });
        expect(s.patience).toBe(0);
        expect(s.trust).toBe(1);
        expect(s.fatigue).toBe(0.5);
        expect(s.engagement).toBe(0);
    });

    it('clampState returns a new object (immutable)', () => {
        const a = { patience: 0.5, trust: 0.5, fatigue: 0.5, engagement: 0.5 };
        expect(clampState(a)).not.toBe(a);
    });
});

describe('decay', () => {
    it('moves patience toward baseline', () => {
        const low = { patience: 0.2, trust: 0.5, fatigue: 0.0, engagement: 0.5 };
        const result = applyDecay(low, 5000);
        expect(result.patience).toBeGreaterThan(0.2);
        expect(result.patience).toBeLessThanOrEqual(0.7);
    });

    it('moves fatigue toward 0', () => {
        const tired = { patience: 0.7, trust: 0.5, fatigue: 0.8, engagement: 0.5 };
        expect(applyDecay(tired, 5000).fatigue).toBeLessThan(0.8);
    });

    it('does not overshoot baselines', () => {
        const s = { patience: 0.69, trust: 0.49, fatigue: 0.01, engagement: 0.49 };
        const r = applyDecay(s, 100000);
        expect(r.patience).toBe(0.7);
        expect(r.trust).toBe(0.5);
        expect(r.fatigue).toBe(0);
        expect(r.engagement).toBe(0.5);
    });

    it('zero delta = no change', () => {
        const s = { patience: 0.3, trust: 0.8, fatigue: 0.5, engagement: 0.4 };
        expect(applyDecay(s, 0)).toEqual(s);
    });

    it('resistance always decays (patience recovers)', () => {
        const veryLow = { patience: 0.05, trust: 0.5, fatigue: 0.0, engagement: 0.5 };
        expect(applyDecay(veryLow, 2000).patience).toBeGreaterThan(0.05);
    });
});

describe('cooperation window', () => {
    it('returns true when trust high, fatigue low, patience high', () => {
        expect(isCooperationWindow({ patience: 0.8, trust: 0.8, fatigue: 0.1, engagement: 0.5 })).toBe(true);
    });

    it('returns false when trust is low', () => {
        expect(isCooperationWindow({ patience: 0.8, trust: 0.3, fatigue: 0.1, engagement: 0.5 })).toBe(false);
    });

    it('returns false when fatigue is high', () => {
        expect(isCooperationWindow({ patience: 0.8, trust: 0.8, fatigue: 0.5, engagement: 0.5 })).toBe(false);
    });
});
