import type { Difficulty, Phrase } from '../types';

const DIFFICULTY_SPLITS: Array<{ difficulty: Difficulty; count: number }> = [
  { difficulty: 'family', count: 34 },
  { difficulty: 'brain-burn', count: 33 },
  { difficulty: 'genius', count: 33 },
];

export function withBalancedDifficulties(phrases: string[]): Phrase[] {
  let start = 0;

  return DIFFICULTY_SPLITS.flatMap(({ difficulty, count }) => {
    const group = phrases.slice(start, start + count);
    start += count;
    return group.map((text) => ({ text, difficulty }));
  });
}

