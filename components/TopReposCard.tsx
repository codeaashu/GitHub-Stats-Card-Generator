import { themes } from '@/config/themes';
import { icons, createSvgWrapper } from '@/utils/svg';
import type { RepoStats, ThemeName } from '@/types/github';

const createRepoItem = (repo: RepoStats['topRepos'][0], y: number, theme: typeof themes[ThemeName]) => `
  <g transform="translate(25, ${y})">
    <svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16" fill="${theme.textSecondary}">
      ${icons.repos}
    </svg>
    <text x="25" y="12.5" class="small" fill="${theme.textSecondary}">
      ${repo.name}
    </text>
    <g transform="translate(250, 0)">
      <svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16" fill="${theme.textSecondary}">
        ${icons.stars}
      </svg>
      <text x="20" y="12.5" class="small" fill="${theme.textSecondary}">
        ${repo.stars}
      </text>
    </g>
    <g transform="translate(320, 0)">
      <svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16" fill="${theme.textSecondary}">
        ${icons.forks}
      </svg>
      <text x="20" y="12.5" class="small" fill="${theme.textSecondary}">
        ${repo.forks}
      </text>
    </g>
  </g>
`;

export function generateTopReposSvg(stats: RepoStats, themeName: ThemeName = 'default') {
  const theme = themes[themeName];
  
  const content = `
    <g transform="translate(0, 50)">
      ${(stats?.topRepos || []).slice(0, 4).map((repo, i) => createRepoItem(repo, i * 35, theme)).join('')}
    </g>
  `;

  return createSvgWrapper(content, `${stats.username}'s Top Repositories`, theme);
} 