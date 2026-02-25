'use client'
import { useEffect, useState } from 'react'

interface GitHubStatsData {
  totalCommits: number
  recentCommits: number
  lastPush: string
  repoUrl: string
}

export default function GitHubStats({ repo }: { repo: string }) {
  const [stats, setStats] = useState<GitHubStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

        const [repoRes, commitsRes, contributorsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${repo}`),
          fetch(`https://api.github.com/repos/${repo}/commits?since=${since}&per_page=100`),
          fetch(`https://api.github.com/repos/${repo}/contributors`),
        ])

        const repoData = await repoRes.json()
        const commitsData = await commitsRes.json()
        const contributorsData = await contributorsRes.json()

        const totalCommits = Array.isArray(contributorsData)
          ? contributorsData.reduce(
              (sum: number, c: { contributions: number }) => sum + c.contributions,
              0
            )
          : 0

        setStats({
          totalCommits,
          recentCommits: Array.isArray(commitsData) ? commitsData.length : 0,
          lastPush: repoData.pushed_at,
          repoUrl: repoData.html_url,
        })
      } catch {
        // silently fail — stats are decorative
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [repo])

  if (loading) {
    return (
      <div className="mt-6 pt-4 border-t border-slate-700/60">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">GitHub Stats</p>
        <div className="flex flex-wrap gap-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-32 bg-slate-700/50 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const lastPushDate = new Date(stats.lastPush).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="mt-6 pt-4 border-t border-slate-700/60">
      <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">GitHub Stats</p>
      <div className="flex flex-wrap gap-3">

        {/* Repo Link */}
        <a
          href={stats.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View on GitHub
        </a>

        {/* Total Commits */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300">
          <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <line x1="1.05" y1="12" x2="7" y2="12" />
            <line x1="17.01" y1="12" x2="22.96" y2="12" />
          </svg>
          {stats.totalCommits} total commits
        </div>

        {/* Recent Commits */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300">
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {stats.recentCommits} commits (last 30 days)
        </div>

        {/* Last Push */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300">
          <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Last push: {lastPushDate}
        </div>

      </div>
    </div>
  )
}
