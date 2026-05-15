import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RoundConfig, AnswerResult } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useTilt } from '../hooks/useTilt';
import './GameplayScreen.css';

interface GameplayScreenProps {
  roundConfig: RoundConfig;
  timerDuration: number;
  teamName: string;
  roundNumber: number;
  totalRounds: number;
  onFinish: (results: AnswerResult[]) => void;
  onResetMatch: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GameplayScreen({
  roundConfig,
  timerDuration,
  teamName,
  roundNumber,
  totalRounds,
  onFinish,
  onResetMatch,
}: GameplayScreenProps) {
  const phrasePool = useMemo(() => {
    const all = roundConfig.categories.flatMap((c) =>
      c.phrases
        .filter(
          (phrase) =>
            roundConfig.difficulty === 'chaos' ||
            phrase.difficulty === roundConfig.difficulty,
        )
        .map((phrase) => ({
          phrase: phrase.text,
          category: c.name,
          difficulty: phrase.difficulty,
        })),
    );
    return shuffleArray(all);
  }, [roundConfig.categories, roundConfig.difficulty]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const { timeLeft, isExpired, start: startTimer } = useTimer(timerDuration);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (isExpired) return;

      const current = phrasePool[currentIndex % phrasePool.length];
      setResults((prev) => [
        ...prev,
        {
          phrase: current.phrase,
          category: current.category,
          difficulty: current.difficulty,
          correct,
        },
      ]);
      setFeedback(correct ? 'correct' : 'wrong');

      setTimeout(() => {
        setFeedback(null);
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    },
    [isExpired, phrasePool, currentIndex],
  );

  const handleTilt = useCallback(
    (dir: 'up' | 'down') => {
      if (feedback !== null) return;
      handleAnswer(dir === 'down');
    },
    [handleAnswer, feedback],
  );

  const { triggerManual } =
    useTilt({
      enabled: !isExpired && feedback === null,
      onTilt: handleTilt,
    });

  // End game when timer expires
  useEffect(() => {
    if (isExpired) {
      const timeout = setTimeout(() => onFinish(results), 500);
      return () => clearTimeout(timeout);
    }
  }, [isExpired, onFinish, results]);

  const currentPhrase = phrasePool[currentIndex % phrasePool.length].phrase;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const feedbackClass = feedback
    ? feedback === 'correct'
      ? 'gameplay-correct'
      : 'gameplay-wrong'
    : '';

  return (
    <div className={`gameplay-screen ${feedbackClass}`}>
      <div className="gameplay-topbar">
        <button className="btn btn-text" onClick={onResetMatch}>
          Reset Match
        </button>
        <div className="gameplay-turn-info">
          <strong>{teamName}</strong>
          <span>Round {roundNumber} of {totalRounds}</span>
        </div>
        <div className="gameplay-timer">{formatTime(timeLeft)}</div>
      </div>

      <div className="gameplay-phrase-container">
        <div className="gameplay-phrase" key={currentIndex}>
          {feedback === 'correct'
            ? '✅'
            : feedback === 'wrong'
              ? '❌'
              : currentPhrase}
        </div>
        {feedback === null && (
          <p className="gameplay-hint">
            Tilt down = correct &nbsp;·&nbsp; Tilt up = pass
          </p>
        )}
      </div>

      <div className="gameplay-score">
        <span className="score-correct">
          ✓ {results.filter((r) => r.correct).length}
        </span>
        <span className="score-wrong">
          ✗ {results.filter((r) => !r.correct).length}
        </span>
      </div>

      {/* Manual answer buttons */}
      <div className="gameplay-buttons">
        <button
          className="btn btn-correct"
          onClick={() => triggerManual('down')}
          disabled={feedback !== null}
        >
          ✓ Correct
        </button>
        <button
          className="btn btn-wrong"
          onClick={() => triggerManual('up')}
          disabled={feedback !== null}
        >
          ✗ Pass
        </button>
      </div>
    </div>
  );
}
