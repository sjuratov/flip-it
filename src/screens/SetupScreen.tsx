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

const TEAM_OPTIONS = [2, 3, 4];
const PLAYER_OPTIONS = [2, 3, 4, 5, 6];

function createTeams(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `team-${index + 1}`,
    name: `Team ${index + 1}`,
    playerCount: 2,
  }));
}

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
  onBack: () => void;
}

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(),
  );
  const [teams, setTeams] = useState(createTeams(2));
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

  const setTeamCount = (count: number) => {
    setTeams((prev) =>
      Array.from({ length: count }, (_, index) => {
        const existing = prev[index];
        return existing ?? {
          id: `team-${index + 1}`,
          name: `Team ${index + 1}`,
          playerCount: 2,
        };
      }),
    );
  };

  const setTeamName = (teamId: string, name: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, name } : team,
      ),
    );
  };

  const setTeamPlayerCount = (teamId: string, playerCount: number) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, playerCount } : team,
      ),
    );
  };

  const handleStart = () => {
    if (!canStart) return;
    onStart({
      categories: selectedCategories,
      timerDuration,
      teams: teams.map((team, index) => ({
        ...team,
        name: team.name.trim() || `Team ${index + 1}`,
      })),
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
        <h3>Teams</h3>
        <div className="option-group">
          {TEAM_OPTIONS.map((n) => (
            <button
              key={n}
              className={`option-btn ${teams.length === n ? 'active' : ''}`}
              onClick={() => setTeamCount(n)}
            >
              {n} Teams
            </button>
          ))}
        </div>
        <p className="setup-hint">
          Each team needs at least 2 players: one guesses, teammates describe.
        </p>
        <div className="team-list">
          {teams.map((team, index) => (
            <div className="team-card" key={team.id}>
              <label className="team-name-label">
                <span>Team {index + 1} name</span>
                <input
                  className="team-name-input"
                  value={team.name}
                  onChange={(event) => setTeamName(team.id, event.target.value)}
                />
              </label>
              <div>
                <span className="team-size-label">Players</span>
                <div className="option-group team-player-options">
                  {PLAYER_OPTIONS.map((n) => (
                    <button
                      key={n}
                      className={`option-btn ${team.playerCount === n ? 'active' : ''}`}
                      onClick={() => setTeamPlayerCount(team.id, n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
