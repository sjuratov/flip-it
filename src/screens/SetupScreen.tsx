import { useState } from 'react';
import type { Category, GameConfig } from '../types';
import { categories as allCategories } from '../data/categories';
import './SetupScreen.css';

const TIMER_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
];

const PLAYER_OPTIONS = [2, 3, 4];

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
  onBack: () => void;
}

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(),
  );
  const [playerCount, setPlayerCount] = useState(2);
  const [timerDuration, setTimerDuration] = useState(60);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedCategories: Category[] = allCategories.filter((c) =>
    selectedCategoryIds.has(c.id),
  );

  const canStart = selectedCategories.length > 0;

  const handleStart = () => {
    if (!canStart) return;
    onStart({
      categories: selectedCategories,
      playerCount,
      timerDuration,
    });
  };

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <button className="btn btn-text" onClick={onBack}>
          ← Back
        </button>
        <h2>Game Setup</h2>
      </div>

      <section className="setup-section">
        <h3>Categories</h3>
        <div className="category-grid">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-card ${selectedCategoryIds.has(cat.id) ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h3>Players</h3>
        <div className="option-group">
          {PLAYER_OPTIONS.map((n) => (
            <button
              key={n}
              className={`option-btn ${playerCount === n ? 'active' : ''}`}
              onClick={() => setPlayerCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h3>Timer</h3>
        <div className="option-group">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`option-btn ${timerDuration === opt.value ? 'active' : ''}`}
              onClick={() => setTimerDuration(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <button
        className="btn btn-primary btn-large"
        disabled={!canStart}
        onClick={handleStart}
      >
        Start Game
      </button>
    </div>
  );
}
