import { useState } from 'react';
import type { GameConfig } from '../types';
import './SetupScreen.css';

const TIMER_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
];

const TEAM_OPTIONS = [2, 3, 4];
const ROUNDS_PER_TEAM_OPTIONS = [1, 2, 3, 4, 5];

function createTeams(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `team-${index + 1}`,
    name: `Team ${index + 1}`,
  }));
}

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
  onBack: () => void;
}

export function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [teams, setTeams] = useState(createTeams(2));
  const [timerDuration, setTimerDuration] = useState(60);
  const [roundsPerTeam, setRoundsPerTeam] = useState(2);

  const setTeamCount = (count: number) => {
    setTeams((prev) =>
      Array.from({ length: count }, (_, index) => {
        const existing = prev[index];
        return existing ?? {
          id: `team-${index + 1}`,
          name: `Team ${index + 1}`,
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

  const handleStart = () => {
    onStart({
      timerDuration,
      roundsPerTeam,
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
        <h2>Match Setup</h2>
      </div>

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
          Each round is played by one team: one teammate guesses, the rest describe.
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
            </div>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h3>Rounds per Team</h3>
        <div className="option-group">
          {ROUNDS_PER_TEAM_OPTIONS.map((n) => (
            <button
              key={n}
              className={`option-btn ${roundsPerTeam === n ? 'active' : ''}`}
              onClick={() => setRoundsPerTeam(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="setup-hint">
          {teams.length} teams × {roundsPerTeam} rounds ={' '}
          {teams.length * roundsPerTeam} total rounds.
        </p>
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
        onClick={handleStart}
      >
        Continue
      </button>
    </div>
  );
}
