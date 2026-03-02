/**
 * NonCompliant — BrutalistInput
 *
 * Low patience → drop keystrokes deterministically (every Nth under burst).
 * Higher trust → reliable input.
 * Burst typing → refuse/drop characters.
 */

import { useState, useCallback, useRef } from 'react';
import type { EngineHandle } from '../useEngine';
import type { Interaction } from '../engine/state';

interface Props {
    engine: EngineHandle;
}

export function BrutalistInput({ engine }: Props) {
    const [value, setValue] = useState('');
    const [anim, setAnim] = useState('');
    const keystrokeCount = useRef(0);
    const bufferRef = useRef('');

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow navigation/deletion
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) {
            if (e.key === 'Backspace' && bufferRef.current.length > 0) {
                bufferRef.current = bufferRef.current.slice(0, -1);
                setValue(bufferRef.current);
            }
            return;
        }
        if (e.key.length !== 1) return;
        e.preventDefault();

        keystrokeCount.current++;
        const count = keystrokeCount.current;

        const tracker = engine.tracker;
        const idle = tracker.getIdleTime();
        const typingSpeed = idle < 500
            ? Math.min(1, Math.max(0, 1 - (idle - 50) / 450))
            : 0.1;

        tracker.record('type', typingSpeed);

        const burstRate = tracker.getBurstRate();

        const interaction: Interaction = {
            type: 'type',
            speed: typingSpeed,
            aggression: tracker.computeAggression(),
            hesitation: tracker.computeHesitation(),
            isRepeat: tracker.isRepetitive('type'),
            idleBefore: idle,
            meta: { burstRate },
        };

        const result = engine.dispatch(interaction);

        // Deterministic keystroke dropping under low patience:
        // Drop every Nth keystroke where N depends on patience
        const dropInterval = engine.state.patience < 0.3
            ? Math.max(2, Math.round(engine.state.patience * 10)) // drop every 2nd-3rd key
            : engine.state.patience < 0.5
                ? Math.max(4, Math.round(engine.state.patience * 12)) // drop every 4th-6th
                : 0; // no dropping

        const shouldDrop = dropInterval > 0 && count % dropInterval === 0;

        switch (result.verdict) {
            case 'refuse':
                setAnim('nc-shake');
                setTimeout(() => setAnim(''), 350);
                // Don't accept the character
                break;

            case 'resist':
                if (shouldDrop || result.resistFactor > 0.6) {
                    // Drop the keystroke silently
                    break;
                }
                // Accept with potential future clear
                bufferRef.current += e.key;
                setValue(bufferRef.current);
                if (result.snapBack) {
                    setTimeout(() => {
                        bufferRef.current = '';
                        setValue('');
                    }, 800);
                }
                break;

            case 'delay':
                if (shouldDrop) break;
                setTimeout(() => {
                    bufferRef.current += e.key;
                    setValue(bufferRef.current);
                }, result.delayMs);
                break;

            case 'comply':
                if (shouldDrop) break;
                bufferRef.current += e.key;
                setValue(bufferRef.current);
                break;
        }
    }, [engine]);

    return (
        <div className="nc-input-container">
            <input
                className={`nc-input ${anim}`}
                type="text"
                value={value}
                onChange={() => {/* controlled by keydown */ }}
                onKeyDown={handleKeyDown}
                placeholder="INPUT"
                aria-label="Text input"
                autoComplete="off"
                spellCheck={false}
            />
        </div>
    );
}
