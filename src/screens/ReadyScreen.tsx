import { useState, useEffect, useCallback } from 'react';
import './ReadyScreen.css';

interface ReadyScreenProps {
  onReady: () => void;
}

function needsOrientationPermission(): boolean {
  const dme = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  return typeof dme.requestPermission === 'function';
}

async function requestOrientationPermission(): Promise<boolean> {
  const dme = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  if (typeof dme.requestPermission === 'function') {
    const result = await dme.requestPermission();
    return result === 'granted';
  }
  return true;
}

export function ReadyScreen({ onReady }: ReadyScreenProps) {
  const [phase, setPhase] = useState<'waiting' | 'countdown'>('waiting');
  const [count, setCount] = useState(3);

  const handleTap = useCallback(async () => {
    if (needsOrientationPermission()) {
      await requestOrientationPermission();
    }
    setPhase('countdown');
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) {
      onReady();
      return;
    }
    const timeout = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [phase, count, onReady]);

  return (
    <div className="ready-screen">
      <div className="ready-instruction">
        <span className="ready-phone-icon">📱</span>
        <p>Place the phone on your forehead</p>
        <p className="ready-hint">Screen facing outward</p>
      </div>
      {phase === 'waiting' ? (
        <button className="btn btn-primary btn-large ready-start-btn" onClick={handleTap}>
          Tap to Start
        </button>
      ) : (
        <div className="ready-countdown" key={count}>
          {count}
        </div>
      )}
    </div>
  );
}
