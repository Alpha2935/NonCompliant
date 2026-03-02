import { describe, it, expect } from 'vitest';
import { computeNextState, computeCompliance, computeResetOutcome, computeCloseOutcome } from '../rules';
import { createInitialState, type Interaction } from '../state';

const calm: Interaction = {
    type: 'click', speed: 0.2, aggression: 0.1, hesitation: 0.6,
    isRepeat: false, idleBefore: 3000,
};
const fast: Interaction = {
    type: 'click', speed: 0.9, aggression: 0.8, hesitation: 0.1,
    isRepeat: false, idleBefore: 200,
};
const repeat: Interaction = {
    type: 'click', speed: 0.5, aggression: 0.5, hesitation: 0.2,
    isRepeat: true, idleBefore: 500,
};

describe('computeNextState', () => {
    it('is deterministic', () => {
        const s = createInitialState();
        expect(computeNextState(s, calm)).toEqual(computeNextState(s, calm));
    });

    it('fast interactions reduce patience', () => {
        const s = createInitialState();
        expect(computeNextState(s, fast).patience).toBeLessThan(s.patience);
    });

    it('slow interactions build trust', () => {
        const s = createInitialState();
        expect(computeNextState(s, calm).trust).toBeGreaterThan(s.trust);
    });

    it('repetition reduces engagement', () => {
        const s = createInitialState();
        expect(computeNextState(s, repeat).engagement).toBeLessThan(s.engagement);
    });

    it('outputs are always clamped [0,1]', () => {
        const extreme = { patience: 0.01, trust: 0.01, fatigue: 0.99, engagement: 0.01 };
        const r = computeNextState(extreme, fast);
        for (const k of ['patience', 'trust', 'fatigue', 'engagement'] as const) {
            expect(r[k]).toBeGreaterThanOrEqual(0);
            expect(r[k]).toBeLessThanOrEqual(1);
        }
    });
});

describe('computeCompliance', () => {
    it('is deterministic', () => {
        const s = createInitialState();
        expect(computeCompliance(s, calm)).toEqual(computeCompliance(s, calm));
    });

    it('healthy state + calm interaction = comply', () => {
        const s = { patience: 0.9, trust: 0.8, fatigue: 0.1, engagement: 0.7 };
        expect(computeCompliance(s, calm).verdict).toBe('comply');
    });

    it('low patience + aggression = refuse', () => {
        const s = { patience: 0.1, trust: 0.1, fatigue: 0.9, engagement: 0.1 };
        expect(computeCompliance(s, fast).verdict).toBe('refuse');
    });

    it('cooperation window biases toward comply', () => {
        const coop = { patience: 0.8, trust: 0.8, fatigue: 0.1, engagement: 0.7 };
        const r = computeCompliance(coop, calm);
        expect(['comply', 'delay']).toContain(r.verdict);
    });
});

describe('computeResetOutcome', () => {
    it('full reset when trust high', () => {
        expect(computeResetOutcome({ patience: 0.7, trust: 0.8, fatigue: 0.5, engagement: 0.5 })).toBe('full');
    });

    it('partial reset when trust medium', () => {
        expect(computeResetOutcome({ patience: 0.3, trust: 0.4, fatigue: 0.5, engagement: 0.5 })).toBe('partial');
    });

    it('refused when trust very low', () => {
        expect(computeResetOutcome({ patience: 0.3, trust: 0.2, fatigue: 0.5, engagement: 0.5 })).toBe('refused');
    });
});

describe('computeCloseOutcome', () => {
    it('first attempt with low trust = nothing', () => {
        const s = { patience: 0.3, trust: 0.2, fatigue: 0.5, engagement: 0.5 };
        expect(computeCloseOutcome(s, 0, 0.6)).toBe('nothing');
    });

    it('second attempt with low trust = shake', () => {
        const s = { patience: 0.3, trust: 0.2, fatigue: 0.5, engagement: 0.5 };
        expect(computeCloseOutcome(s, 1, 0.6)).toBe('shake');
    });

    it('high trust + second attempt = close', () => {
        const s = { patience: 0.7, trust: 0.8, fatigue: 0.3, engagement: 0.5 };
        expect(computeCloseOutcome(s, 1, 0.2)).toBe('close');
    });
});
