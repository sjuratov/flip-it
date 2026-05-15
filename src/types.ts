export type Difficulty = 'family' | 'brain-burn' | 'genius';

export type DifficultySelection = Difficulty | 'chaos';

export interface Phrase {
  text: string;
  difficulty: Difficulty;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  phrases: Phrase[];
}

export interface GameConfig {
  timerDuration: number; // seconds
  teams: Team[];
  roundsPerTeam: number;
}

export interface RoundConfig {
  categories: Category[];
  difficulty: DifficultySelection;
}

export interface AnswerResult {
  phrase: string;
  category: string;
  difficulty: Difficulty;
  correct: boolean;
}

export interface Team {
  id: string;
  name: string;
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
  roundConfig: RoundConfig | null;
  rounds: RoundResult[];
}

export type Screen = 'home' | 'setup' | 'round-setup' | 'ready' | 'gameplay' | 'results';

export type TiltDirection = 'down' | 'up' | 'neutral';
