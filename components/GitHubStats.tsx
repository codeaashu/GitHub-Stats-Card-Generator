'use client'

import { useState } from 'react'
import UsernameForm from './UsernameForm'
import { generateSvg } from './StatsCard'
import { generateLanguageSvg } from './LanguageCard'
import { generateContributionsSvg } from './ContributionsCard'
import { themes } from '@/config/themes'
import type { ThemeName, ChartType, ContributionStats } from '@/types/github'
import { generateTopReposSvg } from './TopReposCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GitHubResponse {
  message?: string;
  username: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  languages: { [key: string]: number };
  contributions: {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
    averageContributions: number;
  };
  topRepos: Array<{
    name: string;
    stars: number;
    forks: number;
  }>;
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubResponse | null>(null)
  const [languageStats, setLanguageStats] = useState<GitHubResponse | null>(null)
  const [contributionStats, setContributionStats] = useState<GitHubResponse | null>(null)
  const [repoStats, setRepoStats] = useState<GitHubResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<ThemeName>('default')
  const [chartType, setChartType] = useState<ChartType>('bars')

  const fetchStats = async (username: string) => {
    try {
      // Fetch all stats in parallel
      const [generalResponse, languagesResponse, contributionsResponse, reposResponse] = await Promise.all([
        fetch(`/api/github-stats?username=${username}&type=general`),
        fetch(`/api/github-stats?username=${username}&type=languages`),
        fetch(`/api/github-stats?username=${username}&type=contributions`),
        fetch(`/api/github-stats?username=${username}&type=top-repos`)
      ]);

      const [generalData, languagesData, contributionsData, reposData] = await Promise.all([
        generalResponse.json(),
        languagesResponse.json(),
        contributionsResponse.json(),
        reposResponse.json()
      ]);

      if (!generalResponse.ok) {
        setError(generalData.error || 'Failed to fetch GitHub stats');
        return;
      }

      setStats(generalData);
      setLanguageStats(languagesData);
      setContributionStats(contributionsData);
      setRepoStats(reposData);
      setError('');
    } catch {
      setError('Failed to fetch GitHub stats');
    }
  };

  const copyToClipboard = async (getMarkdown: () => string) => {
    try {
      await navigator.clipboard.writeText(getMarkdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enter GitHub Username</CardTitle>
        </CardHeader>
        <CardContent>
          <UsernameForm onSubmit={fetchStats} />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && languageStats && contributionStats && repoStats && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customization Options</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Theme:</label>
                <Select value={theme} onValueChange={(value) => setTheme(value as ThemeName)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(themes).map((themeName) => (
                      <SelectItem key={themeName} value={themeName}>
                        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Chart Type:</label>
                <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bars">Bars</SelectItem>
                    <SelectItem value="pie">Pie</SelectItem>
                    <SelectItem value="donut">Donut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="top-repos">Top Repos</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <StatsCard
                title="General Stats"
                svg={generateSvg(stats, theme, chartType)}
                onCopy={() => {
                  const params = new URLSearchParams({
                    username: stats.username,
                    theme: theme,
                    chart: chartType
                  }).toString();
                  return `![${stats.username}'s GitHub stats](${window.location.origin}/api/svg?${params})`;
                }}
                copied={copied}
                copyToClipboard={copyToClipboard}
              />
            </TabsContent>
            <TabsContent value="languages">
              <StatsCard
                title="Language Stats"
                svg={generateLanguageSvg(languageStats, theme, chartType)}
                onCopy={() => {
                  const params = new URLSearchParams({
                    username: stats.username,
                    type: 'languages',
                    theme: theme,
                    chart: chartType
                  }).toString();
                  return `![${stats.username}'s Language stats](${window.location.origin}/api/svg?${params})`;
                }}
                copied={copied}
                copyToClipboard={copyToClipboard}
              />
            </TabsContent>
            <TabsContent value="contributions">
              <StatsCard
                title="Contributions Stats"
                svg={generateContributionsSvg(contributionStats as unknown as ContributionStats, theme)}
                onCopy={() => {
                  const params = new URLSearchParams({
                    username: stats.username,
                    type: 'contributions',
                    theme: theme
                  }).toString();
                  return `![${stats.username}'s Contribution stats](${window.location.origin}/api/svg?${params})`;
                }}
                copied={copied}
                copyToClipboard={copyToClipboard}
              />
            </TabsContent>
            <TabsContent value="top-repos">
              <StatsCard
                title="Top Repos Stats"
                svg={generateTopReposSvg(repoStats, theme)}
                onCopy={() => {
                  const params = new URLSearchParams({
                    username: stats.username,
                    type: 'top-repos',
                    theme: theme
                  }).toString();
                  return `![${stats.username}'s Top Repos](${window.location.origin}/api/svg?${params})`;
                }}
                copied={copied}
                copyToClipboard={copyToClipboard}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

interface StatsCardProps {
  title: string
  svg: string
  onCopy: () => string
  copied: boolean
  copyToClipboard: (getMarkdown: () => string) => Promise<void>
}

function StatsCard({ title, svg, onCopy, copied, copyToClipboard }: StatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        <Button
          onClick={() => copyToClipboard(onCopy)}
          className="mt-4"
        >
          {copied ? 'Copied!' : 'Copy Markdown'}
        </Button>
      </CardContent>
    </Card>
  )
}

