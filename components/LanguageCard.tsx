import { themes } from '@/config/themes';
import { languageColors } from '@/config/themes';
import { createSvgWrapper } from '@/utils/svg';
import type { LanguageStats, ThemeName, ChartType } from '@/types/github';

function createBars(languages: [string, number][], total: number, theme: typeof themes[ThemeName]) {
  return `
    <g transform="translate(0, 50)">
      ${languages.map(([lang, value], i) => {
        const percentage = (value / total * 100).toFixed(1);
        const width = Math.max((value / total) * 300, 40);
        const color = languageColors[lang] || '#858585';

        return `
          <g transform="translate(25, ${i * 30})">
            <circle cx="6" cy="6" r="6" fill="${color}"/>
            <text x="25" y="12.5" class="small" fill="${theme.textSecondary}">
              ${lang}: ${percentage}%
            </text>
            <rect x="170" y="0" width="${width}" height="12" fill="${color}" rx="6" opacity="0.8">
              <animate attributeName="width" from="0" to="${width}" dur="0.8s" fill="freeze" />
            </rect>
          </g>
        `;
      }).join('')}
    </g>
  `;
}

function createPieChart(languages: [string, number][], total: number, theme: typeof themes[ThemeName], isDonut = false) {
  const radius = 60;
  const centerX = 300;
  const centerY = 60;
  
  let currentAngle = 0;
  const paths = languages.map(([lang, value]) => {
    const percentage = value / total;
    const angle = percentage * 2 * Math.PI;
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    const color = languageColors[lang] || '#858585';
    
    const startX = centerX + radius * Math.cos(currentAngle);
    const startY = centerY + radius * Math.sin(currentAngle);
    const endX = centerX + radius * Math.cos(currentAngle + angle);
    const endY = centerY + radius * Math.sin(currentAngle + angle);
    
    const path = `
      <path d="M ${centerX} ${centerY}
        L ${startX} ${startY}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
        Z"
        fill="${color}"
      />
    `;
    
    currentAngle += angle;
    return path;
  }).join('');

  const legend = languages.map(([lang, value], i) => {
    const percentage = (value / total * 100).toFixed(1);
    const color = languageColors[lang] || '#858585';
    return `
      <g transform="translate(25, ${i * 30 + 50})">
        <circle cx="6" cy="6" r="6" fill="${color}"/>
        <text x="20" y="10" class="small" fill="${theme.textSecondary}">
          ${lang}: ${percentage}%
        </text>
      </g>
    `;
  }).join('');

  return `
    ${legend}
    <g transform="translate(0, 50)">
      ${paths}
      ${isDonut ? `<circle cx="${centerX}" cy="${centerY}" r="${radius * 0.6}" fill="${theme.bg}" />` : ''}
    </g>
  `;
}

export function generateLanguageSvg(
  stats: LanguageStats, 
  themeName: ThemeName = 'default',
  chartType: ChartType = 'bars'
) {
  const theme = themes[themeName];
  const total = Object.values(stats?.languages || {}).reduce((a, b) => a + b, 0);
  const sortedLangs = Object.entries(stats?.languages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const content = chartType === 'bars' 
    ? createBars(sortedLangs, total, theme)
    : createPieChart(sortedLangs, total, theme, chartType === 'donut');

  return createSvgWrapper(content, `${stats.username}'s Most Used Languages`, theme);
} 