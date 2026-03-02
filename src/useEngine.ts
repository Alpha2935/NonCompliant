/**
 * NonCompliant — Engine Hook
 *
 * Manages state lifecycle, decay loop, interaction tracker,
 * and exposes dispatch for all components.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
    createInitialState,
    applyDecay,
    isCooperationWindow,
    type InternalState,
    type Interaction,
    type ComplianceResult,
} from './engine/state';
import { reduce } from './engine/reducer';
import { InteractionTracker } from './engine/timing';

const DECAY_TICK_MS = 100;

export interface EngineHandle {
    state: InternalState;
    tracker: InteractionTracker;
    cooperating: boolean;
    dispatch: (interaction: Interaction) => ComplianceResult;
}

export function useEngine(): EngineHandle {
    const [state, setState] = useState<InternalState>(createInitialState);
    const stateRef = useRef(state);
    const trackerRef = useRef(new InteractionTracker());

    stateRef.current = state;

    // Decay loop via rAF
    useEffect(() => {
        let last = performance.now();
        let frame: number;

        function tick() {
            const now = performance.now();
            const dt = now - last;
            if (dt >= DECAY_TICK_MS) {
                setState(prev => applyDecay(prev, dt));
                last = now;
            }
            frame = requestAnimationFrame(tick);
        }

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, []);

    const dispatch = useCallback((interaction: Interaction): ComplianceResult => {
        const { nextState, compliance } = reduce(stateRef.current, interaction);
        setState(nextState);
        return compliance;
    }, []);

    const cooperating = isCooperationWindow(state);

    return { state, tracker: trackerRef.current, cooperating, dispatch };
}
