import { prisma } from '@/lib/prisma'
import TestRunCard from '../components/TestRunCard'
import type { TestRecord, TestRunData } from './types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Test Results | ddutil.dev',
  description: 'Automated Playwright test run results for ddutil.dev',
}

export default async function TestResultsPage() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const runs = await prisma.testRun.findMany({
    where: { runDate: { gte: oneWeekAgo } },
    orderBy: { runDate: 'desc' },
  })

  const formattedRuns: TestRunData[] = runs.map((run) => ({
    id: run.id,
    runDate: run.runDate.toISOString(),
    suiteName: run.suiteName,
    environment: run.environment,
    total: run.total,
    passed: run.passed,
    failed: run.failed,
    skipped: run.skipped,
    durationMs: run.durationMs,
    tests: (run.tests as TestRecord[] | null) ?? null,
  }))

  return (
    <main className="flex min-h-screen flex-col items-center text-slate-200 px-4 sm:px-6 lg:px-8">
      <h1 data-testid="test-results-title" className="pb-20 text-violet-300 text-6xl md:text-8xl font-bold text-center tracking-tight">
        Test Results
      </h1>
      <p data-testid="test-results-description" className="text-slate-200 text-center mb-10 text-2xl">
        Automated tests run against this site — last 7 days
      </p>
      <div data-testid="test-results-info" className="w-full lg:w-200 mx-auto mb-10 border border-slate-700/60 rounded-xl bg-slate-900/40 p-6 text-sm text-slate-300 leading-relaxed">
        <div className="flex flex-col gap-3 mb-4">
          <span className="text-base font-bold text-slate-200">Automated Test Coverage</span>
          <a
            href="https://github.com/ddutil/portfolio_tests"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
            data-testid="test-results-repo-link"
            >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
            </a>
        </div>
        <p className="text-slate-400 mb-3">
          <span className="text-violet-300 font-medium">🎭 Playwright</span> — runs on every push via GitHub Actions across <span className="text-slate-200">Chromium</span> and <span className="text-slate-200">mobile Chrome</span>. Also runs every morning. Covers:
        </p>
        <ul className="space-y-1 text-slate-400 list-none">
          {[
            ['Site load', 'homepage loads, no console errors, no broken resources'],
            ['Navigation', 'all pages reachable by URL and navbar, 404 handling'],
            ['Homepage', 'title, sections, resume PDF download, LinkedIn and contact links'],
            ['Experience', 'tab switching, active state, content visibility per tab'],
            ['Contact form', 'happy path, boundary validation, error messages, DB persistence'],
            ['Rate limiting', 'enforces 5 requests / 10 min (Chromium only)'],
          ].map(([label, detail]) => (
            <li key={label} className="flex gap-2">
              <span className="text-violet-500 shrink-0">▸</span>
              <span><span className="text-slate-200 font-medium">{label}</span> — {detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {formattedRuns.length === 0 ? (
        <p className="text-slate-400">No test runs recorded in the last 7 days.</p>
      ) : (
        <div className="w-full lg:w-200 mx-auto flex flex-col space-y-4 pb-16">
          {formattedRuns.map((run) => (
            <TestRunCard key={run.id} run={run} />
          ))}
        </div>
      )}
    </main>
  )
}
