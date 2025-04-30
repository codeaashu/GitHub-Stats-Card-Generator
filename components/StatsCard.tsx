import { themes } from '@/config/themes';
import { icons, createSvgWrapper } from '@/utils/svg';
import type { Stats, ThemeName, ChartType } from '@/types/github';

function createBar(
  value: number, 
  maxValue: number, 
  y: number, 
  label: string, 
  color: string,
  theme: typeof themes[ThemeName],
  icon: string
) {
  const maxWidth = 300;
  const width = Math.max((value / maxValue) * maxWidth, 40);
  return `
    <g transform="translate(25, ${y})">
      <svg x="0" y="0" width="16" height="16" viewBox="0 0 16 16" fill="${theme.textSecondary}">
        ${icon}
      </svg>
      <text x="25" y="12.5" class="small" fill="${theme.textSecondary}">${label}: ${value.toLocaleString()}</text>
      <rect x="170" y="0" width="${width}" height="20" fill="${color}" rx="6">
        <animate attributeName="width" from="0" to="${width}" dur="0.8s" fill="freeze" />
      </rect>
    </g>
  `;
}

function createBars(stats: Stats, theme: typeof themes[ThemeName], maxValue: number) {
  return `
    <g transform="translate(0, 50)">
      ${createBar(stats.publicRepos, maxValue, 0, "Repositories", theme.bars[0], theme, icons.repos)}
      ${createBar(stats.totalStars, maxValue, 35, "Stars", theme.bars[1], theme, icons.stars)}
      ${createBar(stats.totalForks, maxValue, 70, "Forks", theme.bars[2], theme, icons.forks)}
      ${createBar(stats.followers, maxValue, 105, "Followers", theme.bars[3], theme, icons.followers)}
    </g>
  `;
}

function createPieChart(stats: Stats, theme: typeof themes[ThemeName]) {
  const total = stats.publicRepos + stats.totalStars + stats.totalForks + stats.followers;
  const radius = 60;
  const centerX = 350;
  const centerY = 100;
  
  let currentAngle = 0;
  const sections = [
    { value: stats.publicRepos, color: theme.bars[0], label: "Repos" },
    { value: stats.totalStars, color: theme.bars[1], label: "Stars" },
    { value: stats.totalForks, color: theme.bars[2], label: "Forks" },
    { value: stats.followers, color: theme.bars[3], label: "Followers" }
  ];

  const paths = sections.map(section => {
    const percentage = section.value / total;
    const angle = percentage * 2 * Math.PI;
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const startX = centerX + radius * Math.cos(currentAngle);
    const startY = centerY + radius * Math.sin(currentAngle);
    const endX = centerX + radius * Math.cos(currentAngle + angle);
    const endY = centerY + radius * Math.sin(currentAngle + angle);
    
    const path = `
      <path d="M ${centerX} ${centerY}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z"
        fill="${section.color}"
      />
    `;
    
    currentAngle += angle;
    return path;
  }).join('');

  return `
    <g transform="translate(-100, 0)">
      ${paths}
    </g>
    <g transform="translate(25, 50)">
      ${sections.map((section, i) => `
        <g transform="translate(0, ${i * 30})">
          <rect x="0" y="0" width="12" height="12" fill="${section.color}" />
          <text x="20" y="10" class="small" fill="${theme.textSecondary}">
            ${section.label}: ${section.value.toLocaleString()}
          </text>
        </g>
      `).join('')}
    </g>
  `;
}

function createDonutChart(stats: Stats, theme: typeof themes[ThemeName]) {
  const pieChart = createPieChart(stats, theme);
  return `
    ${pieChart}
    <circle cx="250" cy="100" r="40" fill="${theme.bg}" />
  `;
}

export function generateSvg(
  stats: Stats, 
  themeName: ThemeName = 'default',
  chartType: ChartType = 'bars'
) {
  const theme = themes[themeName];
  const maxValue = Math.max(
    stats.publicRepos,
    stats.totalStars,
    stats.totalForks,
    stats.followers
  );

  let chartContent;
  switch (chartType) {
    case 'pie':
      chartContent = createPieChart(stats, theme);
      break;
    case 'donut':
      chartContent = createDonutChart(stats, theme);
      break;
    default:
      chartContent = createBars(stats, theme, maxValue);
  }

  return createSvgWrapper(chartContent, `${stats.username}'s GitHub Stats`, theme);
} 