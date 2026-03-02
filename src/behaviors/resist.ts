/**
 * NonCompliant — Resist Behavior Helper
 */

import type { InternalState } from '../engine/state';

export interface ResistanceResult {
    factor: number;   // 0..1
    snapBack: boolean;
}

/** Compute resistance level from state. */
export function computeResistance(state: InternalState): ResistanceResult {
    const factor = Math.min(1, Math.max(0,
        (1 - state.patience) * 0.35 +
        state.fatigue * 0.3 +
        (1 - state.trust) * 0.2 -
        state.engagement * 0.12
    ));
    return { factor, snapBack: factor > 0.55 };
}
