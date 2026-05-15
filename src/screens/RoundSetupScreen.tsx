import { useRef, useState } from 'react';
import type { Category, DifficultySelection, RoundConfig } from '../types';
import { categories as allCategories } from '../data/categories';
import './SetupScreen.css';

const DIFFICULTY_OPTIONS: Array<{
  value: DifficultySelection;
  label: string;
  description: string;
}> = [
  {
    value: 'family',
    label: 'Family Fun',
    description: 'Easy, kid-friendly phrases everyone knows.',
  },
  {
    value: 'brain-burn',
    label: 'Brain Burn',
    description: 'Harder phrases for adults and confident players.',
  },
  {
    value: 'genius',
    label: 'Genius Mode',
    description: 'Obscure, clever, and expert-level clues.',
  },
  {
    value: 'chaos',
    label: 'Chaos Mix',
    description: 'A funny random mix from all difficulty levels.',
  },
];

/**
 * Activation guard: on touch devices iOS fires both pointerup AND a
 * synthesized click for the same tap.  Without a guard the toggle runs
 * twice (select → deselect) so the tile appears to do nothing.
 *
 * We route both onPointerUp and onClick through `activateTile`.
 * The first event for a given tap runs the action and records its
 * timeStamp; any event whose timeStamp is within 500 ms of the last
 * activation is silently dropped.
 */
const DEDUP_WINDOW_MS = 500;

interface RoundSetupScreenProps {
  teamName: string;
  roundNumber: number;
  totalRounds: number;
  initialConfig: RoundConfig | null;
  onStartRound: (config: RoundConfig) => void;
  onResetMatch: () => void;
}

export function RoundSetupScreen({
  teamName,
  roundNumber,
  totalRounds,
  initialConfig,
  onStartRound,
  onResetMatch,
}: RoundSetupScreenProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    () => new Set(initialConfig?.categories.map((category) => category.id) ?? []),
  );
  const [difficulty, setDifficulty] = useState<DifficultySelection>(
    initialConfig?.difficulty ?? 'chaos',
  );

  // Timestamp of last accepted activation (shared across all tiles)
  const lastActivationRef = useRef(0);

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

  const selectedCategories: Category[] = allCategories.filter((category) =>
    selectedCategoryIds.has(category.id),
  );

  const handleStartRound = () => {
    if (selectedCategories.length === 0) return;
    onStartRound({
      categories: selectedCategories,
      difficulty,
    });
  };

  // Single handler for both onPointerUp and onClick.
  // The first event runs the action; the duplicate is deduplicated.
  const activateTile = (
    event: React.PointerEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    const ts = event.timeStamp;
    if (ts - lastActivationRef.current < DEDUP_WINDOW_MS) {
      event.preventDefault();
      return;
    }
    lastActivationRef.current = ts;
    action();
  };

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <button className="btn btn-text" onClick={onResetMatch}>
          Reset Match
        </button>
        <h2>Round Setup</h2>
      </div>

      <section className="setup-section setup-callout">
        <h3>Next Up</h3>
        <p className="round-setup-team">{teamName}</p>
        <p className="setup-hint">
          Round {roundNumber} of {totalRounds}. Pick categories and difficulty
          for this team&apos;s turn.
        </p>
      </section>

      <section className="setup-section">
        <h3>Categories</h3>
        <div className="category-grid">
          {allCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`category-card ${selectedCategoryIds.has(category.id) ? 'selected' : ''}`}
              onPointerUp={(e) => activateTile(e, () => toggleCategory(category.id))}
              onClick={(e) => activateTile(e, () => toggleCategory(category.id))}
              aria-pressed={selectedCategoryIds.has(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h3>Difficulty</h3>
        <div className="difficulty-grid">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`difficulty-card ${difficulty === option.value ? 'selected' : ''}`}
              onPointerUp={(e) => activateTile(e, () => setDifficulty(option.value))}
              onClick={(e) => activateTile(e, () => setDifficulty(option.value))}
              aria-pressed={difficulty === option.value}
            >
              <span className="difficulty-name">{option.label}</span>
              <span className="difficulty-description">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      <button
        className="btn btn-primary btn-large"
        disabled={selectedCategories.length === 0}
        onClick={handleStartRound}
      >
        Start Round
      </button>
    </div>
  );
}

