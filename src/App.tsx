/**
 * NonCompliant — Main Application
 *
 * Single-screen interface. No menus, no navigation, no onboarding.
 * You don't operate it. You interact with it.
 *
 * DEV: Ctrl+Shift+D toggles hidden state debug overlay.
 */

import { useState, useEffect, useCallback } from 'react';
import { useEngine } from './useEngine';
import { Panel } from './components/Panel';
import { BrutalistButton } from './components/BrutalistButton';
import { BrutalistSlider } from './components/BrutalistSlider';
import { BrutalistInput } from './components/BrutalistInput';
import './index.css';

function DebugOverlay({ state, cooperating }: {
  state: { patience: number; trust: number; fatigue: number; engagement: number };
  cooperating: boolean;
}) {
  return (
    <div className="nc-debug">
      <div className="nc-debug-title">STATE</div>
      <div>PAT {state.patience.toFixed(2)}</div>
      <div>TRU {state.trust.toFixed(2)}</div>
      <div>FAT {state.fatigue.toFixed(2)}</div>
      <div>ENG {state.engagement.toFixed(2)}</div>
      {cooperating && <div className="nc-debug-coop">COOP</div>}
    </div>
  );
}

export default function App() {
  const engine = useEngine();
  const [showDebug, setShowDebug] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      setShowDebug(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="nc-app">
      <div className="nc-layout">
        <div>
          <h1 className="nc-title">NonCompliant</h1>
          <p className="nc-subtitle">This software does not obey commands</p>
        </div>

        <Panel engine={engine} title="INTERACTION">
          <BrutalistButton engine={engine} variant="submit" />
          <BrutalistSlider engine={engine} />
          <BrutalistInput engine={engine} />
          <BrutalistButton engine={engine} variant="reset" />
        </Panel>
      </div>

      {showDebug && <DebugOverlay state={engine.state} cooperating={engine.cooperating} />}
    </div>
  );
}
