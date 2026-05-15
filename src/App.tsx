import { useState, useCallback } from 'react';
import type { Screen, GameConfig, AnswerResult, MatchState } from './types';
import { ThemeProvider } from './hooks/ThemeProvider';
import { ThemeToggle } from './screens/ThemeToggle';
import { HomeScreen } from './screens/HomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { RoundSetupScreen } from './screens/RoundSetupScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultsScreen } from './screens/ResultsScreen';

const MATCH_STORAGE_KEY = 'flip-it-match-state';

function loadSavedMatch(): MatchState | null {
  const saved = localStorage.getItem(MATCH_STORAGE_KEY);
  if (!saved) return null;
  try {
    const match = JSON.parse(saved) as MatchState;
    const hasMatchConfig = Boolean(
      match.config?.teams?.length &&
        match.config?.timerDuration &&
        match.config?.roundsPerTeam,
    );
    const hasValidRoundConfig =
      match.roundConfig === null ||
      Boolean(
        match.roundConfig?.difficulty &&
          match.roundConfig?.categories?.every((category) =>
            category.phrases.every((phrase) => typeof phrase !== 'string'),
          ),
      );
    if (!hasMatchConfig || !hasValidRoundConfig) {
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
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = loadSavedMatch();
    if (!saved) return 'home';
    return saved.rounds.length ? 'results' : 'round-setup';
  });

  const handlePlay = () => setScreen('setup');

  const handleStart = (config: GameConfig) => {
    const nextMatch: MatchState = {
      config,
      activeTeamIndex: 0,
      roundConfig: null,
      rounds: [],
    };
    setMatchState(nextMatch);
    saveMatch(nextMatch);
    setScreen('round-setup');
  };

  const handleStartRound = (roundConfig: MatchState['roundConfig']) => {
    setMatchState((current) => {
      if (!current || !roundConfig) return current;
      const nextMatch = {
        ...current,
        roundConfig,
      };
      saveMatch(nextMatch);
      return nextMatch;
    });
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
    setScreen('round-setup');
  };

  const handleResetMatch = () => {
    if (
      !window.confirm('Reset the whole match? Scores and round history will be lost.')
    ) {
      return;
    }
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
  const totalRounds = matchState
    ? matchState.config.teams.length * matchState.config.roundsPerTeam
    : 0;
  const currentRoundNumber = matchState ? matchState.rounds.length + 1 : 1;
  const isMatchComplete = matchState
    ? matchState.rounds.length >= totalRounds
    : false;

  return (
    <ThemeProvider>
      <ThemeToggle />
      {screen === 'home' && <HomeScreen onPlay={handlePlay} />}
      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} onBack={handleBackToHome} />
      )}
      {screen === 'round-setup' && matchState && activeTeam && (
        <RoundSetupScreen
          teamName={activeTeam.name}
          roundNumber={currentRoundNumber}
          totalRounds={totalRounds}
          initialConfig={matchState.roundConfig}
          onStartRound={handleStartRound}
          onResetMatch={handleResetMatch}
        />
      )}
      {screen === 'ready' && activeTeam && (
        <ReadyScreen
          teamName={activeTeam.name}
          roundNumber={currentRoundNumber}
          totalRounds={totalRounds}
          onReady={handleReady}
          onResetMatch={handleResetMatch}
        />
      )}
      {screen === 'gameplay' && matchState && matchState.roundConfig && activeTeam && (
        <GameplayScreen
          roundConfig={matchState.roundConfig}
          timerDuration={matchState.config.timerDuration}
          teamName={activeTeam.name}
          roundNumber={currentRoundNumber}
          totalRounds={totalRounds}
          onFinish={handleFinish}
          onResetMatch={handleResetMatch}
        />
      )}
      {screen === 'results' && matchState && (
        <ResultsScreen
          matchState={matchState}
          isMatchComplete={isMatchComplete}
          onNextRound={handleNextRound}
          onResetMatch={handleResetMatch}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
