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

export const categories: Category[] = [
  {
    id: 'animals',
    name: 'Animals',
    icon: '🐾',
    phrases: animalPhrases,
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    phrases: sportPhrases,
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    phrases: musicPhrases,
  },
  {
    id: 'movies-tv',
    name: 'Movies & TV',
    icon: '🎬',
    phrases: moviesTvPhrases,
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍕',
    phrases: foodDrinkPhrases,
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    phrases: geographyPhrases,
  },
  {
    id: 'video-games',
    name: 'Video Games',
    icon: '🎮',
    phrases: videoGamePhrases,
  },
  {
    id: 'books-stories',
    name: 'Books & Stories',
    icon: '📚',
    phrases: booksStoriesPhrases,
  },
  {
    id: 'superheroes-cartoons',
    name: 'Superheroes & Cartoons',
    icon: '🦸',
    phrases: superheroesCartoonsPhrases,
  },
  {
    id: 'science-nature',
    name: 'Science & Nature',
    icon: '🔬',
    phrases: scienceNaturePhrases,
  },
  {
    id: 'jobs',
    name: 'Jobs & Professions',
    icon: '💼',
    phrases: jobsPhrases,
  },
  {
    id: 'holidays',
    name: 'Holidays & Celebrations',
    icon: '🎉',
    phrases: holidaysPhrases,
  },
  {
    id: 'everyday-life',
    name: 'Everyday Life',
    icon: '🏠',
    phrases: everydayLifePhrases,
  },
  {
    id: 'travel-adventure',
    name: 'Travel & Adventure',
    icon: '🌊',
    phrases: travelAdventurePhrases,
  },
  {
    id: 'funny-silly',
    name: 'Funny & Silly',
    icon: '😂',
    phrases: funnySillyPhrases,
  },
];
