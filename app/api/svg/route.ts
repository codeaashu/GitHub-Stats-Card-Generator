import { NextRequest } from 'next/server'
import { generateSvg } from '@/components/StatsCard'
import { generateLanguageSvg } from '@/components/LanguageCard'
import { generateContributionsSvg } from '@/components/ContributionsCard'
import { generateTopReposSvg } from '@/components/TopReposCard'
import type { ThemeName, ChartType } from '@/types/github'
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')
    const theme = (searchParams.get('theme') || 'default') as ThemeName
    const type = searchParams.get('type') || 'general'
    const chart = (searchParams.get('chart') || 'bars') as ChartType

    if (!username) {
      return new Response('Username is required', { status: 400 })
    }

    const baseUrl = request.nextUrl.origin
    
    console.log('Base URL:', baseUrl)
    console.log('Making request to:', `${baseUrl}/api/github-stats?username=${username}&type=${type}`)
    
    const response = await fetch(`${baseUrl}/api/github-stats?username=${username}&type=${type}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GitHub-Stats-Generator'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response status:', response.status)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))
      console.error('Error text:', errorText)
      throw new Error(`Failed to fetch stats: Status ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Read and encode font file
    const fontPath = join(process.cwd(), 'app/fonts/MonaSans-SemiBold.woff2');
    const fontBuffer = readFileSync(fontPath);
    const base64Font = fontBuffer.toString('base64');

    // Generate SVG based on type
    let svg: string
    switch (type) {
      case 'languages':
        svg = generateLanguageSvg(data, theme, chart)
        break
      case 'contributions':
        svg = generateContributionsSvg(data, theme)
        break
      case 'top-repos':
        svg = generateTopReposSvg(data, theme)
        break
      default:
        svg = generateSvg(data, theme, chart)
    }

    svg = svg.replace(
      /<style>[^]*?<\/style>/,
      `<style>
        @font-face {
          font-family: 'Mona Sans';
          src: url(data:font/woff2;base64,${base64Font}) format('woff2');
        }
        .text { 
          font: 600 18px 'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        .small { 
          font: 600 14px 'Mona Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        }
      </style>`
    )

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return new Response(`Error generating SVG: ${error instanceof Error ? error.message : 'Unknown error'}\nPlease check server logs for more details.`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }
}