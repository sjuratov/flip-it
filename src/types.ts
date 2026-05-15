export interface Category {
  id: string;
  name: string;
  icon: string;
  phrases: string[];
}

export interface GameConfig {
  categories: Category[];
  timerDuration: number; // seconds
  teams: Team[];
}

export interface AnswerResult {
  phrase: string;
  category: string;
  correct: boolean;
}

export interface Team {
  id: string;
  name: string;
  playerCount: number;
}

export interface RoundResult {
  teamId: string;
  teamName: string;
  answers: AnswerResult[];
  score: number;
}

export interface MatchState {
  config: GameConfig;
  activeTeamIndex: number;
  rounds: RoundResult[];
}

export type Screen = 'home' | 'setup' | 'ready' | 'gameplay' | 'results';

export type TiltDirection = 'down' | 'up' | 'neutral';
