/**
 * NonCompliant — BrutalistButton
 *
 * Submit + Request Reset behaviors.
 * Spammed → often REFUSE. Clicked after a pause → likely COMPLY.
 * On COMPLY: brief border-align effect (no "success" text).
 * Reset: not always successful; depends on trust.
 */

import { useState, useCallback, useRef } from 'react';
import type { EngineHandle } from '../useEngine';
import type { Interaction } from '../engine/state';
import { computeResetOutcome, applyReset } from '../engine/rules';

interface Props {
    engine: EngineHandle;
    variant: 'submit' | 'reset';
}

export function BrutalistButton({ engine, variant }: Props) {
    const baseLabel = variant === 'reset' ? 'REQUEST RESET' : 'SUBMIT';
    const [label, setLabel] = useState(baseLabel);
    const [anim, setAnim] = useState('');
    const [aligned, setAligned] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
        if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    };

    const handleClick = useCallback(() => {
        clearTimer();

        const tracker = engine.tracker;
        const idle = tracker.getIdleTime();
        const clickSpeed = Math.min(1, Math.max(0, 1 - (idle - 200) / 1800));

        tracker.record('click', clickSpeed);

        const interaction: Interaction = {
            type: variant === 'reset' ? 'reset' : 'click',
            speed: clickSpeed,
            aggression: tracker.computeAggression(),
            hesitation: tracker.computeHesitation(),
            isRepeat: tracker.isRepetitive('click'),
            idleBefore: idle,
        };

        // Reset has its own outcome path
        if (variant === 'reset') {
            handleReset(interaction);
            return;
        }

        const result = engine.dispatch(interaction);

        switch (result.verdict) {
            case 'refuse':
                setAnim('nc-shake');
                timer.current = setTimeout(() => setAnim(''), 450);
                break;

            case 'resist':
                setAnim('nc-shake');
                setLabel('—');
                timer.current = setTimeout(() => {
                    setAnim('');
                    setLabel(baseLabel);
                }, 350);
                break;

            case 'delay':
                setLabel('WAIT');
                timer.current = setTimeout(() => {
                    // Brief border-align = comply confirmation
                    setAligned(true);
                    setLabel(baseLabel);
                    setTimeout(() => setAligned(false), 200);
                }, result.delayMs);
                break;

            case 'comply':
                setAligned(true);
                timer.current = setTimeout(() => {
                    setAligned(false);
                }, 180 + result.delayMs);
                break;
        }
    }, [engine, variant, baseLabel]);

    const handleReset = useCallback((interaction: Interaction) => {
        const outcome = computeResetOutcome(engine.state);

        // Still apply the interaction to update state
        engine.dispatch(interaction);

        switch (outcome) {
            case 'refused':
                setAnim('nc-shake');
                setLabel('DENIED');
                timer.current = setTimeout(() => {
                    setAnim('');
                    setLabel(baseLabel);
                }, 600);
                break;

            case 'partial':
                setLabel('PARTIAL');
                timer.current = setTimeout(() => {
                    // Apply partial reset
                    const resetState = applyReset(engine.state, 'partial');
                    // We dispatch an idle interaction to nudge state in the right direction
                    engine.dispatch({
                        type: 'idle',
                        speed: 0,
                        aggression: 0,
                        hesitation: 1,
                        isRepeat: false,
                        idleBefore: 5000,
                    });
                    // Force the partial reset by dispatching one more
                    void resetState; // outcome already applied through rules
                    setLabel(baseLabel);
                }, 400);
                break;

            case 'full':
                setAligned(true);
                setLabel('ACCEPTED');
                timer.current = setTimeout(() => {
                    setAligned(false);
                    setLabel(baseLabel);
                }, 500);
                break;
        }
    }, [engine, baseLabel]);

    return (
        <button
            className={`nc-button ${anim} ${aligned ? 'nc-button--aligned' : ''}`}
            onClick={handleClick}
            type="button"
            aria-label={baseLabel}
        >
            {label}
        </button>
    );
}
