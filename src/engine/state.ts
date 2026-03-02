/**
 * NonCompliant — Internal State Engine
 *
 * Hidden state driving all UI behavior. All values clamped [0, 1].
 * Deterministic: same input + same state = same result.
 */

// ── Types ──

export interface InternalState {
    patience: number;   // 0 = none, 1 = very patient
    trust: number;      // 0 = none, 1 = full trust
    fatigue: number;    // 0 = fresh, 1 = exhausted
    engagement: number; // 0 = bored, 1 = very engaged
}

export type InteractionType = 'click' | 'drag' | 'type' | 'close' | 'reset' | 'idle';

export interface Interaction {
    type: InteractionType;
    /** Normalized speed 0..1 (0 = very slow, 1 = very fast) */
    speed: number;
    /** Aggression score computed from rolling window 0..1 */
    aggression: number;
    /** Hesitation score computed from pauses 0..1 */
    hesitation: number;
    /** Whether recent actions are repetitive */
    isRepeat: boolean;
    /** Milliseconds idle before this interaction */
    idleBefore: number;
    /** Interaction-specific metadata */
    meta?: {
        sliderDelta?: number;       // requested slider movement magnitude
        burstRate?: number;          // keystrokes per second in last burst
        closeAttemptIndex?: number;  // 0-based count of close attempts this session
        resetType?: 'full' | 'partial'; // computed by reducer
    };
}

export type ComplianceVerdict = 'comply' | 'delay' | 'resist' | 'refuse';

export interface ComplianceResult {
    verdict: ComplianceVerdict;
    delayMs: number;
    resistFactor: number; // 0..1, how much to resist (1 = full block)
    snapBack: boolean;
}

// ── Utility ──

export function clamp01(v: number): number {
    return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function clampState(s: InternalState): InternalState {
    return {
        patience: clamp01(s.patience),
        trust: clamp01(s.trust),
        fatigue: clamp01(s.fatigue),
        engagement: clamp01(s.engagement),
    };
}

// ── Initial State ──

export function createInitialState(): InternalState {
    return {
        patience: 0.8,
        trust: 0.5,
        fatigue: 0.0,
        engagement: 0.6,
    };
}

// ── Decay ──

const BASELINES: Readonly<InternalState> = {
    patience: 0.7,
    trust: 0.5,
    fatigue: 0.0,
    engagement: 0.5,
};

const DECAY_PER_SEC = {
    patience: 0.04,
    trust: 0.02,
    fatigue: 0.035,
    engagement: 0.025,
} as const;

function drift(current: number, target: number, maxDelta: number): number {
    if (current < target) return Math.min(current + maxDelta, target);
    if (current > target) return Math.max(current - maxDelta, target);
    return current;
}

export function applyDecay(state: InternalState, deltaMs: number): InternalState {
    const s = deltaMs / 1000;
    return clampState({
        patience: drift(state.patience, BASELINES.patience, DECAY_PER_SEC.patience * s),
        trust: drift(state.trust, BASELINES.trust, DECAY_PER_SEC.trust * s),
        fatigue: drift(state.fatigue, BASELINES.fatigue, DECAY_PER_SEC.fatigue * s),
        engagement: drift(state.engagement, BASELINES.engagement, DECAY_PER_SEC.engagement * s),
    });
}

// ── Cooperation Window ──

/**
 * Returns true when the system is in a "cooperation window":
 * trust is high and fatigue is low. During this window,
 * interactions are more likely to succeed.
 */
export function isCooperationWindow(state: InternalState): boolean {
    return state.trust > 0.7 && state.fatigue < 0.3 && state.patience > 0.6;
}
