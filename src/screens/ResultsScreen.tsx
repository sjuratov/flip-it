import type { MatchState } from '../types';
import './ResultsScreen.css';

interface ResultsScreenProps {
  matchState: MatchState;
  onNextRound: () => void;
  onResetMatch: () => void;
}

export function ResultsScreen({
  matchState,
  onNextRound,
  onResetMatch,
}: ResultsScreenProps) {
  const latestRound = matchState.rounds.at(-1);
  const results = latestRound?.answers ?? [];
  const correct = latestRound?.score ?? 0;
  const wrong = results.filter((r) => !r.correct).length;
  const nextTeam = matchState.config.teams[matchState.activeTeamIndex];

  const teamTotals = matchState.config.teams.map((team) => ({
    ...team,
    score: matchState.rounds
      .filter((round) => round.teamId === team.id)
      .reduce((sum, round) => sum + round.score, 0),
  }));

  return (
    <div className="results-screen">
      <h2 className="results-title">Round Over!</h2>
      {latestRound && (
        <p className="results-subtitle">
          {latestRound.teamName} scored {latestRound.score} point
          {latestRound.score === 1 ? '' : 's'}
        </p>
      )}

      <div className="results-summary">
        <div className="results-stat results-stat-correct">
          <span className="results-stat-number">{correct}</span>
          <span className="results-stat-label">Correct</span>
        </div>
        <div className="results-stat results-stat-wrong">
          <span className="results-stat-number">{wrong}</span>
          <span className="results-stat-label">Wrong</span>
        </div>
      </div>

      <section className="match-scoreboard">
        <h3>Match Score</h3>
        <div className="team-score-list">
          {teamTotals.map((team) => (
            <div className="team-score-item" key={team.id}>
              <span>
                {team.name}
                <small>{team.playerCount} players</small>
              </span>
              <strong>{team.score}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="round-history">
        <h3>Round History</h3>
        <div className="round-history-list">
          {matchState.rounds.map((round, index) => (
            <div className="round-history-item" key={`${round.teamId}-${index}`}>
              <span>Round {index + 1}: {round.teamName}</span>
              <strong>+{round.score}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="results-list">
        {results.map((r, i) => (
          <div
            key={i}
            className={`results-item ${r.correct ? 'results-item-correct' : 'results-item-wrong'}`}
          >
            <span className="results-item-icon">
              {r.correct ? '✓' : '✗'}
            </span>
            <span className="results-item-phrase">{r.phrase}</span>
            <span className="results-item-category">({r.category})</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-large" onClick={onNextRound}>
        Next Round: {nextTeam.name}
      </button>
      <button className="btn btn-text" onClick={onResetMatch}>
        Reset Match
      </button>
    </div>
  );
}
