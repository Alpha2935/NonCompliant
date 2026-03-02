/**
 * NonCompliant — BrutalistSlider
 *
 * Aggressive drag → RESIST (apply 60-80% movement) or SNAP BACK.
 * Slow drag → COMPLY.
 * Numeric readout lags by 150-400ms under low patience.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { EngineHandle } from '../useEngine';
import type { Interaction } from '../engine/state';

interface Props {
    engine: EngineHandle;
}

export function BrutalistSlider({ engine }: Props) {
    const [value, setValue] = useState(50);
    const [displayValue, setDisplayValue] = useState(50);
    const [anim, setAnim] = useState('');
    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const displayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Lagging readout: delay based on patience
    useEffect(() => {
        const lag = Math.max(0, (1 - engine.state.patience) * 400);
        if (lag < 50) {
            setDisplayValue(Math.round(value));
            return;
        }
        if (displayTimer.current) clearTimeout(displayTimer.current);
        displayTimer.current = setTimeout(() => {
            setDisplayValue(Math.round(value));
        }, lag);
        return () => { if (displayTimer.current) clearTimeout(displayTimer.current); };
    }, [value, engine.state.patience]);

    const posToValue = useCallback((clientX: number): number => {
        const el = trackRef.current;
        if (!el) return 50;
        const rect = el.getBoundingClientRect();
        return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    }, []);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        dragging.current = true;
        lastX.current = e.clientX;
        lastTime.current = performance.now();
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragging.current) return;

        const now = performance.now();
        const dx = Math.abs(e.clientX - lastX.current);
        const dt = now - lastTime.current;
        const rawSpeed = dt > 0 ? dx / dt : 0;
        const normalizedSpeed = Math.min(1, rawSpeed / 2);

        lastX.current = e.clientX;
        lastTime.current = now;

        const targetValue = posToValue(e.clientX);
        const delta = targetValue - value;

        engine.tracker.record('drag', normalizedSpeed);

        const interaction: Interaction = {
            type: 'drag',
            speed: normalizedSpeed,
            aggression: engine.tracker.computeAggression(),
            hesitation: engine.tracker.computeHesitation(),
            isRepeat: engine.tracker.isRepetitive('drag'),
            idleBefore: engine.tracker.getIdleTime(),
            meta: { sliderDelta: Math.abs(delta) },
        };

        const result = engine.dispatch(interaction);

        switch (result.verdict) {
            case 'refuse':
                setAnim('nc-shake');
                setTimeout(() => setAnim(''), 350);
                break;

            case 'resist': {
                // Apply only partial movement (60-80%)
                const compliance = 1 - result.resistFactor * 0.4; // 0.6..1.0
                const resisted = value + delta * compliance;
                setValue(Math.max(0, Math.min(100, resisted)));
                if (result.snapBack) {
                    setAnim('nc-snap');
                    const snapTarget = value; // snap back to before
                    setTimeout(() => {
                        setValue(snapTarget);
                        setAnim('');
                    }, 200);
                }
                break;
            }

            case 'delay':
                setTimeout(() => {
                    setValue(targetValue);
                }, Math.min(result.delayMs, 300));
                break;

            case 'comply':
                setValue(targetValue);
                break;
        }
    }, [engine, value, posToValue]);

    const onPointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    return (
        <div className="nc-slider-container">
            <span className="nc-slider-label">LEVEL</span>
            <div
                ref={trackRef}
                className={`nc-slider-track ${anim}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                role="slider"
                aria-valuenow={displayValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Level"
                tabIndex={0}
            >
                <div className="nc-slider-fill" style={{ width: `${value}%` }} />
                <div className="nc-slider-handle" style={{ left: `${value}%` }} />
            </div>
            <span className="nc-slider-value">{displayValue}</span>
        </div>
    );
}
