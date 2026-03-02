/**
 * NonCompliant — Refuse Behavior Helper
 */

import type { InternalState } from '../engine/state';

/** Should the system refuse this interaction entirely? */
export function shouldRefuse(state: InternalState, aggression: number): boolean {
    if (state.patience < 0.15) return true;
    if (state.fatigue > 0.85 && state.engagement < 0.2) return true;
    if (state.trust < 0.15 && aggression > 0.6) return true;
    return false;
}
