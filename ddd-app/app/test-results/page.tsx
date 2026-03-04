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
      <h1 data-testid="test-results-title" className="pb-10 text-violet-300 text-6xl md:text-8xl font-bold text-center tracking-tight">
        Test Results
      </h1>
      <p className="text-slate-400 text-center mb-10 text-2xl">
        Automated tests run against this site — last 7 days
      </p>
      <div className="w-full lg:w-200 mx-auto mb-10 border border-slate-700/60 rounded-xl bg-slate-900/40 p-6 text-sm text-slate-300 leading-relaxed">
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-base font-bold text-slate-200">Automated Test Coverage</span>
          <a
            href="https://github.com/ddutil/portfolio_tests"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 hover:text-violet-300 hover:bg-slate-600 transition-colors font-mono"
          >
            github.com/ddutil/portfolio_tests ↗
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
