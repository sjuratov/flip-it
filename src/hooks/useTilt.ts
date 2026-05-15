import { useState, useCallback, useEffect, useRef } from 'react';
import type { TiltDirection } from '../types';

interface UseTiltOptions {
  enabled: boolean;
  onTilt: (direction: 'up' | 'down') => void;
}

interface UseTiltResult {
  direction: TiltDirection;
  triggerManual: (dir: 'up' | 'down') => void;
}

const TILT_DELTA_THRESHOLD = 35;
const DEBOUNCE_MS = 1200;

function normalizeAngleDelta(delta: number): number {
  if (delta > 180) return delta - 360;
  if (delta < -180) return delta + 360;
  return delta;
}

export function useTilt({ enabled, onTilt }: UseTiltOptions): UseTiltResult {
  const [direction, setDirection] = useState<TiltDirection>('neutral');
  const lockedRef = useRef(false);
  const betaBaselineRef = useRef<number | null>(null);
  const onTiltRef = useRef(onTilt);

  useEffect(() => {
    onTiltRef.current = onTilt;
  }, [onTilt]);

  const handleTilt = useCallback((dir: 'up' | 'down') => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setDirection(dir);
    onTiltRef.current(dir);
    setTimeout(() => {
      lockedRef.current = false;
      setDirection('neutral');
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;

    betaBaselineRef.current = null;

    const handler = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta === null) return;

      if (betaBaselineRef.current === null) {
        betaBaselineRef.current = beta;
        return;
      }

      const delta = normalizeAngleDelta(beta - betaBaselineRef.current);

      // Calibrated at the player's forehead/rest position:
      // tilt down increases beta; tilt up decreases beta.
      if (delta > TILT_DELTA_THRESHOLD) {
        handleTilt('down');
      } else if (delta < -TILT_DELTA_THRESHOLD) {
        handleTilt('up');
      }
    };

    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [enabled, handleTilt]);

  const triggerManual = useCallback(
    (dir: 'up' | 'down') => {
      handleTilt(dir);
    },
    [handleTilt],
  );

  return { direction, triggerManual };
}
