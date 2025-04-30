import { themes } from '@/config/themes';

export interface Stats {
  username: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
}

export interface LanguageStats {
  username: string;
  languages: { [key: string]: number };
}

export interface ContributionStats {
  username: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  averageContributions: number;
}

export interface RepoStats {
  username: string;
  topRepos: Array<{
    name: string;
    stars: number;
    forks: number;
  }>;
}

export type ChartType = 'bars' | 'pie' | 'donut';
export type ThemeName = keyof typeof themes; 