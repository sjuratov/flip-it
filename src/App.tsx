import { useState, useCallback } from 'react';
import type { Screen, GameConfig, AnswerResult, MatchState } from './types';
import { ThemeProvider } from './hooks/ThemeProvider';
import { ThemeToggle } from './screens/ThemeToggle';
import { HomeScreen } from './screens/HomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultsScreen } from './screens/ResultsScreen';

const MATCH_STORAGE_KEY = 'flip-it-match-state';

function loadSavedMatch(): MatchState | null {
  const saved = localStorage.getItem(MATCH_STORAGE_KEY);
  if (!saved) return null;
  try {
    const match = JSON.parse(saved) as MatchState;
    const hasDifficulty = Boolean(match.config?.difficulty);
    const hasDifficultyPhrases = match.config?.categories?.every((category) =>
      category.phrases.every((phrase) => typeof phrase !== 'string'),
    );
    if (!hasDifficulty || !hasDifficultyPhrases) {
      localStorage.removeItem(MATCH_STORAGE_KEY);
      return null;
    }
    return match;
  } catch {
    localStorage.removeItem(MATCH_STORAGE_KEY);
    return null;
  }
}

function saveMatch(match: MatchState | null) {
  if (match) {
    localStorage.setItem(MATCH_STORAGE_KEY, JSON.stringify(match));
  } else {
    localStorage.removeItem(MATCH_STORAGE_KEY);
  }
}

function App() {
  const [matchState, setMatchState] = useState<MatchState | null>(() =>
    loadSavedMatch(),
  );
  const [screen, setScreen] = useState<Screen>(() =>
    loadSavedMatch()?.rounds.length ? 'results' : 'home',
  );

  const handlePlay = () => setScreen('setup');

  const handleStart = (config: GameConfig) => {
    const nextMatch: MatchState = {
      config,
      activeTeamIndex: 0,
      rounds: [],
    };
    setMatchState(nextMatch);
    saveMatch(nextMatch);
    setScreen('ready');
  };

  const handleReady = useCallback(() => setScreen('gameplay'), []);

  const handleFinish = useCallback((r: AnswerResult[]) => {
    setMatchState((current) => {
      if (!current) return current;
      const activeTeam = current.config.teams[current.activeTeamIndex];
      const nextMatch: MatchState = {
        ...current,
        activeTeamIndex:
          (current.activeTeamIndex + 1) % current.config.teams.length,
        rounds: [
          ...current.rounds,
          {
            teamId: activeTeam.id,
            teamName: activeTeam.name,
            answers: r,
            score: r.filter((answer) => answer.correct).length,
          },
        ],
      };
      saveMatch(nextMatch);
      return nextMatch;
    });
    setScreen('results');
  }, []);

  const handleNextRound = () => {
    setScreen('ready');
  };

  const handleResetMatch = () => {
    setMatchState(null);
    saveMatch(null);
    setScreen('setup');
  };

  const handleBackToHome = () => {
    setMatchState(null);
    saveMatch(null);
    setScreen('home');
  };

  const activeTeam = matchState?.config.teams[matchState.activeTeamIndex];

  return (
    <ThemeProvider>
      <ThemeToggle />
      {screen === 'home' && <HomeScreen onPlay={handlePlay} />}
      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} onBack={handleBackToHome} />
      )}
      {screen === 'ready' && activeTeam && (
        <ReadyScreen teamName={activeTeam.name} onReady={handleReady} />
      )}
      {screen === 'gameplay' && matchState && (
        <GameplayScreen config={matchState.config} onFinish={handleFinish} />
      )}
      {screen === 'results' && matchState && (
        <ResultsScreen
          matchState={matchState}
          onNextRound={handleNextRound}
          onResetMatch={handleResetMatch}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
