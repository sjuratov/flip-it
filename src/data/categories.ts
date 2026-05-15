import type { Category } from '../types';
import {
  animalPhrases,
  sportPhrases,
  musicPhrases,
  moviesTvPhrases,
  foodDrinkPhrases,
} from './categories-batch1';
import {
  geographyPhrases,
  videoGamePhrases,
  booksStoriesPhrases,
  superheroesCartoonsPhrases,
  scienceNaturePhrases,
} from './categories-batch2';
import {
  jobsPhrases,
  holidaysPhrases,
  everydayLifePhrases,
  travelAdventurePhrases,
  funnySillyPhrases,
} from './categories-batch3';
import { withBalancedDifficulties } from './difficulty';

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    icon: '🐾',
    phrases: withBalancedDifficulties(animalPhrases),
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    phrases: withBalancedDifficulties(sportPhrases),
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    phrases: withBalancedDifficulties(musicPhrases),
  },
  {
    id: 'movies-tv',
    name: 'Movies & TV',
    icon: '🎬',
    phrases: withBalancedDifficulties(moviesTvPhrases),
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍕',
    phrases: withBalancedDifficulties(foodDrinkPhrases),
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    phrases: withBalancedDifficulties(geographyPhrases),
  },
  {
    id: 'video-games',
    name: 'Video Games',
    icon: '🎮',
    phrases: withBalancedDifficulties(videoGamePhrases),
  },
  {
    id: 'books-stories',
    name: 'Books & Stories',
    icon: '📚',
    phrases: withBalancedDifficulties(booksStoriesPhrases),
  },
  {
    id: 'superheroes-cartoons',
    name: 'Superheroes & Cartoons',
    icon: '🦸',
    phrases: withBalancedDifficulties(superheroesCartoonsPhrases),
  },
  {
    id: 'science-nature',
    name: 'Science & Nature',
    icon: '🔬',
    phrases: withBalancedDifficulties(scienceNaturePhrases),
  },
  {
    id: 'jobs',
    name: 'Jobs & Professions',
    icon: '💼',
    phrases: withBalancedDifficulties(jobsPhrases),
  },
  {
    id: 'holidays',
    name: 'Holidays & Celebrations',
    icon: '🎉',
    phrases: withBalancedDifficulties(holidaysPhrases),
  },
  {
    id: 'everyday-life',
    name: 'Everyday Life',
    icon: '🏠',
    phrases: withBalancedDifficulties(everydayLifePhrases),
  },
  {
    id: 'travel-adventure',
    name: 'Travel & Adventure',
    icon: '🌊',
    phrases: withBalancedDifficulties(travelAdventurePhrases),
  },
  {
    id: 'funny-silly',
    name: 'Funny & Silly',
    icon: '😂',
    phrases: withBalancedDifficulties(funnySillyPhrases),
  },
];
