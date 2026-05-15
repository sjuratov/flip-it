export interface Category {
  id: string;
  name: string;
  icon: string;
  phrases: string[];
}

export interface GameConfig {
  categories: Category[];
  playerCount: number;
  timerDuration: number; // seconds
}

export interface AnswerResult {
  phrase: string;
  category: string;
  correct: boolean;
}

export type Screen = 'home' | 'setup' | 'ready' | 'gameplay' | 'results';

export type TiltDirection = 'down' | 'up' | 'neutral';
