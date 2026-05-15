import { useState, useCallback } from 'react';
import type { Screen, GameConfig, AnswerResult } from './types';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './screens/ThemeToggle';
import { HomeScreen } from './screens/HomeScreen';
import { SetupScreen } from './screens/SetupScreen';
import { ReadyScreen } from './screens/ReadyScreen';
import { GameplayScreen } from './screens/GameplayScreen';
import { ResultsScreen } from './screens/ResultsScreen';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);

  const handlePlay = () => setScreen('setup');

  const handleStart = (config: GameConfig) => {
    setGameConfig(config);
    setResults([]);
    setScreen('ready');
  };

  const handleReady = useCallback(() => setScreen('gameplay'), []);

  const handleFinish = useCallback((r: AnswerResult[]) => {
    setResults(r);
    setScreen('results');
  }, []);

  const handlePlayAgain = () => setScreen('setup');
  const handleBackToHome = () => setScreen('home');

  return (
    <ThemeProvider>
      <ThemeToggle />
      {screen === 'home' && <HomeScreen onPlay={handlePlay} />}
      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} onBack={handleBackToHome} />
      )}
      {screen === 'ready' && <ReadyScreen onReady={handleReady} />}
      {screen === 'gameplay' && gameConfig && (
        <GameplayScreen config={gameConfig} onFinish={handleFinish} />
      )}
      {screen === 'results' && (
        <ResultsScreen results={results} onPlayAgain={handlePlayAgain} />
      )}
    </ThemeProvider>
  );
}

export default App;
