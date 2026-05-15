import './HomeScreen.css';

interface HomeScreenProps {
  onPlay: () => void;
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
  return (
    <div className="home-screen">
      <div className="home-logo">
        <span className="home-icon">🔄</span>
        <h1 className="home-title">Flip It!</h1>
        <p className="home-subtitle">The party guessing game</p>
      </div>
      <button className="btn btn-primary btn-large" onClick={onPlay}>
        Play
      </button>
    </div>
  );
}
