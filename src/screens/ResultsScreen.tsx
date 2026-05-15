import type { AnswerResult } from '../types';
import './ResultsScreen.css';

interface ResultsScreenProps {
  results: AnswerResult[];
  onPlayAgain: () => void;
}

export function ResultsScreen({ results, onPlayAgain }: ResultsScreenProps) {
  const correct = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => !r.correct).length;

  return (
    <div className="results-screen">
      <h2 className="results-title">Round Over!</h2>

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

      <button className="btn btn-primary btn-large" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
}
