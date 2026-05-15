import { useState, useEffect, useCallback, useRef } from 'react';
import type { TiltDirection } from '../types';

interface UseTiltOptions {
  enabled: boolean;
  onTilt: (direction: 'up' | 'down') => void;
}

interface UseTiltResult {
  direction: TiltDirection;
  permissionGranted: boolean;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
  triggerManual: (dir: 'up' | 'down') => void;
}

const TILT_DOWN_THRESHOLD = -30;
const TILT_UP_THRESHOLD = 150;
const DEBOUNCE_MS = 1200;

export function useTilt({ enabled, onTilt }: UseTiltOptions): UseTiltResult {
  const [direction, setDirection] = useState<TiltDirection>('neutral');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const lockedRef = useRef(false);
  const onTiltRef = useRef(onTilt);
  onTiltRef.current = onTilt;

  const isDeviceOrientationSupported =
    typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  useEffect(() => {
    if (!isDeviceOrientationSupported) return;

    const dme = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof dme.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      setPermissionGranted(true);
    }
  }, [isDeviceOrientationSupported]);

  const requestPermission = useCallback(async () => {
    const dme = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof dme.requestPermission === 'function') {
      const result = await dme.requestPermission();
      if (result === 'granted') {
        setPermissionGranted(true);
        setNeedsPermission(false);
      }
    }
  }, []);

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
    if (!enabled || !permissionGranted || !isDeviceOrientationSupported) return;

    const handler = (event: DeviceOrientationEvent) => {
      const beta = event.beta;
      if (beta === null) return;

      if (beta < TILT_DOWN_THRESHOLD) {
        handleTilt('down');
      } else if (beta > TILT_UP_THRESHOLD) {
        handleTilt('up');
      }
    };

    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, [enabled, permissionGranted, isDeviceOrientationSupported, handleTilt]);

  const triggerManual = useCallback(
    (dir: 'up' | 'down') => {
      handleTilt(dir);
    },
    [handleTilt],
  );

  return {
    direction,
    permissionGranted,
    needsPermission,
    requestPermission,
    triggerManual,
  };
}
