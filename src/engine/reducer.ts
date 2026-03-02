/**
 * NonCompliant — Reducer
 *
 * Single entry point for all interactions.
 * Combines rules + state transitions into one dispatch.
 */

import type { InternalState, Interaction, ComplianceResult } from './state';
import { computeNextState, computeCompliance } from './rules';

export interface DispatchResult {
    nextState: InternalState;
    compliance: ComplianceResult;
}

/**
 * Process an interaction: compute compliance verdict AND update state.
 * Pure function.
 */
export function reduce(
    state: InternalState,
    interaction: Interaction
): DispatchResult {
    const compliance = computeCompliance(state, interaction);
    const nextState = computeNextState(state, interaction);
    return { nextState, compliance };
}
