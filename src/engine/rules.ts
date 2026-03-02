/**
 * NonCompliant — Compliance Rules (Pure Functions)
 *
 * Maps (state + interaction context) to a ComplianceResult.
 * Deterministic: same inputs = same outputs.
 */

import {
    type InternalState,
    type Interaction,
    type ComplianceResult,
    type ComplianceVerdict,
    isCooperationWindow,
    clamp01,
    clampState,
} from './state';

// ── State Transition ──

/**
 * Pure function: compute the next state after an interaction.
 */
export function computeNextState(
    state: InternalState,
    interaction: Interaction
): InternalState {
    const { speed, aggression, hesitation, isRepeat, idleBefore } = interaction;

    // Idle recovery
    const idleRecovery = Math.min(idleBefore / 5000, 0.25);

    // Speed pressure
    const speedPenalty = speed > 0.5 ? (speed - 0.5) * 0.6 : 0;
    const speedBonus = speed < 0.3 ? (0.3 - speed) * 0.35 : 0;

    // Aggression damage
    const aggressionPenalty = aggression * 0.25;

    // Hesitation reward
    const hesitationBonus = hesitation * 0.15;

    // Repetition penalty
    const repeatPenalty = isRepeat ? 0.12 : 0;

    // Fatigue from interaction
    const fatigueGain = 0.025 + speed * 0.06 + aggression * 0.04;

    // Engagement: varied actions boost, repetition kills
    const engagementDelta = isRepeat ? -0.1 : 0.04 - speed * 0.02;

    // Type multipliers
    const tm = TYPE_MODS[interaction.type] ?? TYPE_MODS.click;

    return clampState({
        patience:
            state.patience
            + idleRecovery
            + hesitationBonus * tm.patience
            - speedPenalty * tm.patience
            - aggressionPenalty * tm.patience
            - repeatPenalty,
        trust:
            state.trust
            + speedBonus * tm.trust
            + hesitationBonus * 0.5 * tm.trust
            + idleRecovery * 0.4
            - aggressionPenalty * 0.5
            - (speed > 0.8 ? 0.08 : 0),
        fatigue:
            state.fatigue + fatigueGain * tm.fatigue,
        engagement:
            state.engagement + engagementDelta * tm.engagement,
    });
}

interface TypeMod { patience: number; trust: number; fatigue: number; engagement: number; }

const TYPE_MODS: Record<string, TypeMod> = {
    click: { patience: 1.0, trust: 1.0, fatigue: 1.0, engagement: 1.0 },
    drag: { patience: 1.2, trust: 0.8, fatigue: 1.3, engagement: 1.1 },
    type: { patience: 0.8, trust: 1.2, fatigue: 0.9, engagement: 1.0 },
    close: { patience: 1.5, trust: 0.5, fatigue: 0.6, engagement: 0.6 },
    reset: { patience: 0.5, trust: 1.0, fatigue: 0.3, engagement: 0.8 },
    idle: { patience: 0.0, trust: 1.0, fatigue: 0.0, engagement: 0.5 },
};

// ── Compliance Function ──

/**
 * THE core compliance function.
 * Returns COMPLY / DELAY / RESIST / REFUSE based on state + interaction.
 */
export function computeCompliance(
    state: InternalState,
    interaction: Interaction
): ComplianceResult {
    const coop = isCooperationWindow(state);

    // During cooperation window, heavily bias toward comply
    if (coop && interaction.aggression < 0.5) {
        const smallDelay = Math.max(0, (1 - state.trust) * 100);
        return {
            verdict: smallDelay > 50 ? 'delay' : 'comply',
            delayMs: smallDelay,
            resistFactor: 0,
            snapBack: false,
        };
    }

    // Compute a "compliance score" (higher = more likely to comply)
    const complianceScore = computeComplianceScore(state, interaction);

    let verdict: ComplianceVerdict;
    let delayMs = 0;
    let resistFactor = 0;
    let snapBack = false;

    if (complianceScore > 0.7) {
        verdict = 'comply';
        delayMs = Math.max(0, (1 - complianceScore) * 80);
    } else if (complianceScore > 0.45) {
        verdict = 'delay';
        delayMs = 250 + (1 - complianceScore) * 650; // 250..900ms
    } else if (complianceScore > 0.2) {
        verdict = 'resist';
        resistFactor = clamp01(1 - complianceScore * 1.5);
        snapBack = resistFactor > 0.6;
    } else {
        verdict = 'refuse';
        resistFactor = 1;
    }

    return { verdict, delayMs, resistFactor, snapBack };
}

/**
 * Compute a scalar compliance score from 0 (will refuse) to 1 (will comply).
 * This is the heart of NonCompliant's decision making.
 */
function computeComplianceScore(
    state: InternalState,
    interaction: Interaction
): number {
    // Base: weighted combination of state dimensions
    const base =
        state.patience * 0.3 +
        state.trust * 0.3 +
        (1 - state.fatigue) * 0.2 +
        state.engagement * 0.2;

    // Interaction modifiers
    const aggressionPenalty = interaction.aggression * 0.35;
    const hesitationBonus = interaction.hesitation * 0.15;
    const repeatPenalty = interaction.isRepeat ? 0.15 : 0;
    const speedPenalty = interaction.speed > 0.7 ? (interaction.speed - 0.7) * 0.3 : 0;

    return clamp01(base - aggressionPenalty + hesitationBonus - repeatPenalty - speedPenalty);
}

// ── Reset Logic ──

export type ResetOutcome = 'full' | 'partial' | 'refused';

/**
 * Determine what happens when the user requests a reset.
 */
export function computeResetOutcome(state: InternalState): ResetOutcome {
    if (state.trust > 0.65 && state.patience > 0.4) return 'full';
    if (state.trust > 0.35) return 'partial';
    return 'refused';
}

export function applyReset(state: InternalState, outcome: ResetOutcome): InternalState {
    switch (outcome) {
        case 'full':
            return {
                patience: clamp01(state.patience + 0.3),
                trust: clamp01(state.trust + 0.1),
                fatigue: clamp01(state.fatigue * 0.2),
                engagement: clamp01(state.engagement + 0.15),
            };
        case 'partial':
            return {
                ...state,
                fatigue: clamp01(state.fatigue * 0.5),
                patience: clamp01(state.patience + 0.1),
            };
        case 'refused':
            return state;
    }
}

// ── Close Logic ──

export type CloseOutcome = 'nothing' | 'shake' | 'close' | 'minimize';

/**
 * Deterministic close behavior based on state + attempt index.
 */
export function computeCloseOutcome(
    state: InternalState,
    attemptIndex: number,
    aggression: number
): CloseOutcome {
    // Under low trust + spamming → resist
    if (state.trust < 0.4 && aggression > 0.4) {
        return attemptIndex === 0 ? 'nothing' : 'shake';
    }

    // Higher trust path
    if (state.trust > 0.6 && attemptIndex >= 1) {
        return state.patience > 0.5 ? 'close' : 'minimize';
    }

    // Default progression
    if (attemptIndex === 0) return 'nothing';
    if (attemptIndex === 1) return 'shake';
    // 3rd+ attempt: state decides
    if (state.trust > 0.4) return 'close';
    return 'minimize';
}
