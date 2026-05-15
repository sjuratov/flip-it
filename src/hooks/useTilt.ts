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

const TILT_DOWN_THRESHOLD = 140; // beta > 140° = phone tilted face-down (correct)
const TILT_UP_THRESHOLD = 40;   // beta < 40° = phone tilted face-up (wrong/skip)
const DEBOUNCE_MS = 1200;

export function useTilt({ enabled, onTilt }: UseTiltOptions): UseTiltResult {
  const [direction, setDirection] = useState<TiltDirection>('neutral');
  const lockedRef = useRef(false);
  const onTiltRef = useRef(onTilt);
  onTiltRef.current = onTilt;

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

  // Always attach listener when enabled — permission is handled in ReadyScreen.
  // On iOS if permission was granted, events fire. If not, they simply don't.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;

    const handler = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta === null) return;

      // Phone on forehead: beta ≈ 90° at rest
      // Tilt down (bow head): beta → 180° → correct
      // Tilt up (look up): beta → 0° → wrong/skip
      if (beta > TILT_DOWN_THRESHOLD) {
        handleTilt('down');
      } else if (beta < TILT_UP_THRESHOLD) {
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
