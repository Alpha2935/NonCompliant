/**
 * NonCompliant — Panel (Window Container)
 *
 * Close (X) does NOT always close.
 * Deterministic sequence: nothing → shake → close/minimize.
 * Based on trust + aggression + attempt index.
 */

import { useState, useCallback, useRef } from 'react';
import type { EngineHandle } from '../useEngine';
import type { Interaction } from '../engine/state';
import { computeCloseOutcome } from '../engine/rules';

interface Props {
    engine: EngineHandle;
    title?: string;
    children: React.ReactNode;
}

export function Panel({ engine, title = 'NONCOMPLIANT', children }: Props) {
    const [visible, setVisible] = useState(true);
    const [minimized, setMinimized] = useState(false);
    const [closeAnim, setCloseAnim] = useState('');
    const [closeLabel, setCloseLabel] = useState('×');
    const reopenRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClose = useCallback(() => {
        const tracker = engine.tracker;
        const idle = tracker.getIdleTime();
        const clickSpeed = Math.min(1, Math.max(0, 1 - (idle - 200) / 1800));

        tracker.record('close', clickSpeed);

        const attemptIndex = tracker.getCloseAttempts() - 1; // already incremented in record
        const aggression = tracker.computeAggression();

        const interaction: Interaction = {
            type: 'close',
            speed: clickSpeed,
            aggression,
            hesitation: tracker.computeHesitation(),
            isRepeat: tracker.isRepetitive('close'),
            idleBefore: idle,
            meta: { closeAttemptIndex: attemptIndex },
        };

        engine.dispatch(interaction);

        const outcome = computeCloseOutcome(engine.state, attemptIndex, aggression);

        switch (outcome) {
            case 'nothing':
                // Literally nothing happens. Unsettling.
                setCloseLabel('×');
                break;

            case 'shake':
                setCloseAnim('nc-shake');
                setCloseLabel('—');
                setTimeout(() => {
                    setCloseAnim('');
                    setCloseLabel('×');
                }, 450);
                break;

            case 'minimize':
                setMinimized(true);
                // Reappears after a few seconds
                if (reopenRef.current) clearTimeout(reopenRef.current);
                reopenRef.current = setTimeout(() => {
                    setMinimized(false);
                    tracker.resetCloseAttempts();
                }, 3000);
                break;

            case 'close':
                setVisible(false);
                // It's NonCompliant — it comes back eventually
                if (reopenRef.current) clearTimeout(reopenRef.current);
                reopenRef.current = setTimeout(() => {
                    setVisible(true);
                    setMinimized(false);
                    tracker.resetCloseAttempts();
                }, 4000);
                break;
        }
    }, [engine]);

    const handleExpand = useCallback(() => {
        setMinimized(false);
        engine.tracker.resetCloseAttempts();
    }, [engine]);

    if (!visible) return null;

    if (minimized) {
        return (
            <div
                className="nc-panel nc-panel--minimized"
                onClick={handleExpand}
                role="button"
                tabIndex={0}
                aria-label="Expand panel"
            >
                <span className="nc-panel-title">{title}</span>
                <span className="nc-panel-expand">+</span>
            </div>
        );
    }

    return (
        <div className={`nc-panel ${engine.cooperating ? 'nc-panel--cooperative' : ''}`} role="dialog" aria-label={title}>
            <div className="nc-panel-titlebar">
                <span className="nc-panel-title">{title}</span>
                <button
                    className={`nc-panel-close ${closeAnim}`}
                    onClick={handleClose}
                    type="button"
                    aria-label="Close panel"
                >
                    {closeLabel}
                </button>
            </div>
            <div className="nc-panel-content">
                {children}
            </div>
        </div>
    );
}
