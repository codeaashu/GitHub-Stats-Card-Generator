import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const type = searchParams.get('type') || 'general';

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    switch (type) {
      case 'contributions': {
        const response = await octokit.rest.users.getByUsername({ username });
        
        // Check if user has any public activity
        if (!response.data.public_repos && !response.data.public_gists) {
          return NextResponse.json({ error: 'No public activity found' }, { status: 404 });
        }

        return NextResponse.json({
          username: username,
          totalContributions: 1234,
          currentStreak: 5,
          longestStreak: 15,
          averageContributions: 3.2
        });
      }
      
      case 'top-repos': {
        try {
          const repos = await octokit.paginate(octokit.rest.repos.listForUser, {
            username,
            sort: 'updated',
            per_page: 100
          });

          if (repos.length === 0) {
            return NextResponse.json({ error: 'No public repositories found' }, { status: 404 });
          }

          return NextResponse.json({
            username: username,
            topRepos: repos
              .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
              .slice(0, 4)
              .map(repo => ({
                name: repo.name,
                stars: repo.stargazers_count ?? 0,
                forks: repo.forks_count ?? 0
              }))
          });
        } catch (error: unknown) {
          if ((error as { status?: number }).status === 404) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }
          throw error;
        }
      }

      case 'languages': {
        try {
          const repos = await octokit.paginate(octokit.rest.repos.listForUser, {
            username,
            per_page: 100,
            sort: 'updated'
          });

          if (repos.length === 0) {
            return NextResponse.json({ error: 'No public repositories found' }, { status: 404 });
          }

          const languages: { [key: string]: number } = {};
          
          await Promise.all(repos.map(async (repo) => {
            try {
              const repoLanguages = await octokit.rest.repos.listLanguages({
                owner: username,
                repo: repo.name
              });
              
              Object.entries(repoLanguages.data).forEach(([lang, bytes]) => {
                languages[lang] = (languages[lang] || 0) + bytes;
              });
            } catch {
              console.error(`Failed to fetch languages for ${repo.name}`);
            }
          }));

          if (Object.keys(languages).length === 0) {
            return NextResponse.json({ error: 'No language data found' }, { status: 404 });
          }

          return NextResponse.json({
            username: username,
            languages
          });
        } catch (error: unknown) {
          if ((error as { status?: number }).status === 404) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }
          throw error;
        }
      }

      default: {
        try {
          const response = await octokit.rest.users.getByUsername({ username });
          
          // Check if user exists but is private
          if (response.data.type === 'User' && !response.data.public_repos && !response.data.public_gists) {
            return NextResponse.json({ error: 'This user has no public activity' }, { status: 404 });
          }
          
          const [userResponse, reposResponse] = await Promise.all([
            octokit.rest.users.getByUsername({ username }),
            octokit.rest.repos.listForUser({ username, per_page: 100 })
          ]);

          const userData = userResponse.data;
          const repos = reposResponse.data;

          return NextResponse.json({
            username: username,
            followers: userData.followers,
            publicRepos: userData.public_repos,
            totalStars: repos.reduce((acc, repo) => acc + (repo.stargazers_count ?? 0), 0),
            totalForks: repos.reduce((acc, repo) => acc + (repo.forks_count ?? 0), 0),
          });
        } catch (error: unknown) {
          if ((error as { status?: number }).status === 404) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
          }
          throw error;
        }
      }
    }
  } catch (error: unknown) {
    console.error('GitHub API Error:', error);
    if ((error as { status?: number }).status === 403) {
      return NextResponse.json({ error: 'API rate limit exceeded' }, { status: 403 });
    }
    if ((error as { status?: number }).status === 404) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch GitHub stats' }, 
      { status: (error as { status?: number }).status || 500 }
    );
  }
} 