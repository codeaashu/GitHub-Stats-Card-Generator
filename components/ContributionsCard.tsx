import { themes } from '@/config/themes';
import { icons, createSvgWrapper } from '@/utils/svg';
import type { ContributionStats, ThemeName } from '@/types/github';

const createStatItem = (icon: string, label: string, value: number, y: number, theme: typeof themes[ThemeName]) => `
  <g transform="translate(25, ${y})">
    <svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16" fill="${theme.textSecondary}">
      ${icon}
    </svg>
    <text x="25" y="12.5" class="small" fill="${theme.textSecondary}">
      ${label}: ${Number(value).toLocaleString()}
    </text>
  </g>
`;

export function generateContributionsSvg(stats: ContributionStats, themeName: ThemeName = 'default') {
  const theme = themes[themeName];
  
  const content = `
    <g transform="translate(0, 50)">
      ${createStatItem(icons.contributions, "Total Contributions", stats.totalContributions, 0, theme)}
      ${createStatItem(icons.streak, "Current Streak", stats.currentStreak, 35, theme)}
      ${createStatItem(icons.streak, "Longest Streak", stats.longestStreak, 70, theme)}
      ${createStatItem(icons.average, "Average Daily", stats.averageContributions, 105, theme)}
    </g>
  `;

  return createSvgWrapper(content, `${stats.username}'s Contributions`, theme);
} 