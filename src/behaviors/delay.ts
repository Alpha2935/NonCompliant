/**
 * NonCompliant — Delay Behavior Helper
 */

import type { InternalState } from '../engine/state';

/** Compute delay in ms based on state. */
export function computeDelay(state: InternalState): number {
    const base = state.fatigue * 400 + (1 - state.trust) * 300 + (1 - state.patience) * 200;
    const reduction = state.engagement * 150;
    return Math.max(0, Math.min(900, base - reduction));
}
