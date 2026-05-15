import {
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';
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

const TAP_MOVE_TOLERANCE_PX = 24;
const TOUCH_CLICK_SUPPRESSION_MS = 800;

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
  const pointerStartRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const suppressClickUntilRef = useRef(0);

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

  const handleTilePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return;

    pointerStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTilePointerUp = (
    event: PointerEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    if (event.pointerType === 'mouse') return;

    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const moved = Math.hypot(deltaX, deltaY);

    if (moved > TAP_MOVE_TOLERANCE_PX) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickUntilRef.current =
      event.timeStamp + TOUCH_CLICK_SUPPRESSION_MS;
    action();
  };

  const handleTilePointerCancel = () => {
    pointerStartRef.current = null;
  };

  const handleTileClick = (
    event: MouseEvent<HTMLButtonElement>,
    action: () => void,
  ) => {
    if (event.timeStamp < suppressClickUntilRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

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
              onClick={(event) =>
                handleTileClick(event, () => toggleCategory(category.id))
              }
              onPointerDown={handleTilePointerDown}
              onPointerUp={(event) =>
                handleTilePointerUp(event, () => toggleCategory(category.id))
              }
              onPointerCancel={handleTilePointerCancel}
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
              onClick={(event) =>
                handleTileClick(event, () => setDifficulty(option.value))
              }
              onPointerDown={handleTilePointerDown}
              onPointerUp={(event) =>
                handleTilePointerUp(event, () => setDifficulty(option.value))
              }
              onPointerCancel={handleTilePointerCancel}
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
