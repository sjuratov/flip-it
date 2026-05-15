import { useState, useEffect } from 'react';
import './ReadyScreen.css';

interface ReadyScreenProps {
  onReady: () => void;
}

export function ReadyScreen({ onReady }: ReadyScreenProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onReady();
      return;
    }
    const timeout = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [count, onReady]);

  return (
    <div className="ready-screen">
      <div className="ready-instruction">
        <span className="ready-phone-icon">📱</span>
        <p>Place the phone on your forehead</p>
        <p className="ready-hint">Screen facing outward</p>
      </div>
      <div className="ready-countdown" key={count}>
        {count}
      </div>
    </div>
  );
}
