import { useState, useEffect, useCallback, useMemo } from 'react';
import type { GameConfig, AnswerResult } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useTilt } from '../hooks/useTilt';
import './GameplayScreen.css';

interface GameplayScreenProps {
  config: GameConfig;
  onFinish: (results: AnswerResult[]) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function GameplayScreen({ config, onFinish }: GameplayScreenProps) {
  const phrases = useMemo(() => {
    const all = config.categories.flatMap((c) => c.phrases);
    return shuffleArray(all);
  }, [config.categories]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const { timeLeft, isExpired, start: startTimer } = useTimer(config.timerDuration);

  useEffect(() => {
    startTimer();
    setGameStarted(true);
  }, [startTimer]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (!gameStarted || isExpired) return;

      const phrase = phrases[currentIndex % phrases.length];
      setResults((prev) => [...prev, { phrase, correct }]);
      setFeedback(correct ? 'correct' : 'wrong');

      setTimeout(() => {
        setFeedback(null);
        setCurrentIndex((prev) => prev + 1);
      }, 800);
    },
    [gameStarted, isExpired, phrases, currentIndex],
  );

  const handleTilt = useCallback(
    (dir: 'up' | 'down') => {
      if (feedback !== null) return;
      handleAnswer(dir === 'down');
    },
    [handleAnswer, feedback],
  );

  const { needsPermission, permissionGranted, requestPermission, triggerManual } =
    useTilt({
      enabled: gameStarted && !isExpired && feedback === null,
      onTilt: handleTilt,
    });

  // End game when timer expires
  useEffect(() => {
    if (isExpired && gameStarted) {
      const timeout = setTimeout(() => onFinish(results), 500);
      return () => clearTimeout(timeout);
    }
  }, [isExpired, gameStarted, onFinish, results]);

  const currentPhrase = phrases[currentIndex % phrases.length];

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
      <div className="gameplay-timer">{formatTime(timeLeft)}</div>

      <div className="gameplay-phrase-container">
        {needsPermission && !permissionGranted && (
          <button className="btn btn-primary" onClick={requestPermission}>
            Enable Tilt Controls
          </button>
        )}
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

      {/* Desktop fallback buttons */}
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
