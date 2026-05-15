import { useState, useEffect, useCallback } from 'react';
import './ReadyScreen.css';

interface ReadyScreenProps {
  onReady: () => void;
}

type PermissionEventConstructor = {
  requestPermission?: () => Promise<string>;
};

type SensorPermissionWindow = Window & {
  DeviceOrientationEvent?: PermissionEventConstructor;
  DeviceMotionEvent?: PermissionEventConstructor;
};

function getSensorPermissionConstructors(): PermissionEventConstructor[] {
  const sensorWindow = window as SensorPermissionWindow;
  return [
    sensorWindow.DeviceOrientationEvent,
    sensorWindow.DeviceMotionEvent,
  ].filter(
    (constructor): constructor is PermissionEventConstructor =>
      typeof constructor?.requestPermission === 'function',
  );
}

function needsSensorPermission(): boolean {
  return getSensorPermissionConstructors().length > 0;
}

async function requestSensorPermission(): Promise<boolean> {
  const constructors = getSensorPermissionConstructors();
  if (constructors.length === 0) return true;

  const results = await Promise.all(
    constructors.map((constructor) => constructor.requestPermission?.()),
  );
  return results.every((result) => result === 'granted');
}

function supportsDeviceSensors(): boolean {
  return (
    'DeviceOrientationEvent' in window ||
    'DeviceMotionEvent' in window
  );
}

function sensorPermissionMessage(): string {
  if (!supportsDeviceSensors()) {
    return 'Tilt controls are not available here. Use the buttons during play.';
  }

  if (needsSensorPermission()) {
    return 'Tap to allow tilt controls on this device.';
  }

  return 'Tilt controls are ready.';
}

function permissionDeniedMessage(): string {
  return 'Tilt permission was not granted. You can still play with the buttons.';
}

export function ReadyScreen({ onReady }: ReadyScreenProps) {
  const [phase, setPhase] = useState<'waiting' | 'countdown'>('waiting');
  const [count, setCount] = useState(3);
  const [permissionMessage, setPermissionMessage] = useState(sensorPermissionMessage);

  const handleTap = useCallback(async () => {
    let granted = true;
    if (needsSensorPermission()) {
      granted = await requestSensorPermission();
    }
    if (!granted) {
      setPermissionMessage(permissionDeniedMessage());
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
        <p className="ready-hint">{permissionMessage}</p>
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
