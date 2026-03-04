'use client'

import { useState } from 'react'
import type { TestRecord, TestRunData } from '../test-results/types'

// ─── Constants ───────────────────────────────────────────────────────────────

const KNOWN_BROWSERS = ['chromium', 'mobile-chrome', 'firefox', 'webkit']

const STATUS = {
  passed:      { color: 'text-green-400',  bg: 'bg-green-400/10',  icon: '✓' },
  failed:      { color: 'text-red-400',    bg: 'bg-red-400/10',    icon: '✗' },
  skipped:     { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: '—' },
  timedOut:    { color: 'text-red-400',    bg: 'bg-red-400/10',    icon: '⏱' },
  interrupted: { color: 'text-orange-400', bg: 'bg-orange-400/10', icon: '!' },
} as const

const BROWSER_DISPLAY: Record<string, string> = {
  'chromium':      '🖥️ chromium',
  'mobile-chrome': '📱 mobile-chrome',
  'firefox':       '🦊 firefox',
  'webkit':        '🌐 webkit',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseName(fullName: string): { browser: string; displayName: string } {
  const parts = fullName.split(' > ')
  const isBrowser = KNOWN_BROWSERS.some((b) => parts[0]?.toLowerCase() === b)

  const browser = isBrowser ? parts[0] : 'unknown'
  const rest = isBrowser ? parts.slice(1) : parts

  // Drop any segment that looks like a file path
  const displayParts = rest.filter((p) => !p.toLowerCase().includes('.spec.'))

  return { browser, displayName: displayParts.join(' › ') }
}

function groupByBrowser(tests: TestRecord[]): Record<string, TestRecord[]> {
  return tests.reduce<Record<string, TestRecord[]>>((acc, test) => {
    const { browser } = parseName(test.name)
    ;(acc[browser] ??= []).push(test)
    return acc
  }, {})
}

function statusCfg(status: string) {
  return STATUS[status as keyof typeof STATUS] ?? { color: 'text-slate-400', bg: '', icon: '?' }
}

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BrowserSection({ browser, tests }: { browser: string; tests: TestRecord[] }) {
  const label = BROWSER_DISPLAY[browser] ?? browser
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
          {label}
        </span>
        <span className="text-xs text-slate-500">{tests.length} tests</span>
      </div>

      <div className="space-y-0.5">
        {tests.map((test, i) => {
          const { displayName } = parseName(test.name)
          const cfg = statusCfg(test.status)
          return (
            <div
              key={i}
              className={`flex items-start gap-2 rounded px-2 py-1 ${cfg.bg}`}
            >
              <span className={`text-xs font-bold mt-0.5 ${cfg.color} w-3 shrink-0`}>
                {cfg.icon}
              </span>
              <span className="text-xs text-slate-300 flex-1 font-mono leading-relaxed break-all">
                {displayName}
              </span>
              <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 ml-2">
                {fmtDuration(test.durationMs)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TestRunCard({ run }: { run: TestRunData }) {
  const [expanded, setExpanded] = useState(false)

  const passRate = run.total > 0 ? Math.round((run.passed / run.total) * 100) : 0
  const allPassed = run.failed === 0
  const browserGroups = run.tests ? groupByBrowser(run.tests) : null

  return (
    <div
      className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50 hover:bg-slate-900 cursor-pointer select-none"
      onClick={() => run.tests && run.tests.length > 0 && setExpanded((v) => !v)}
    >

      {/* ── Summary ─────────────────────────────────────────────────────── */}
      <div className="p-4">

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm text-slate-400">{fmtDate(run.runDate)}</span>

          <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 font-semibold">
            {run.suiteName}
          </span>

          <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
            run.environment === 'ci'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-slate-600/50 text-slate-400'
          }`}>
            {run.environment.toUpperCase()}
          </span>

          <span className="text-xs text-slate-400 ml-auto">
            {fmtDuration(run.durationMs)}
          </span>
        </div>

        {/* Pass / fail counts */}
        <div className="flex items-center gap-4 mb-3">
          <span className={`text-2xl font-bold ${allPassed ? 'text-green-400' : 'text-red-400'}`}>
            {run.passed}/{run.total}
          </span>
          <div className="flex gap-3 text-sm">
            <span className="text-green-400">{run.passed} passed</span>
            {run.failed  > 0 && <span className="text-red-400">{run.failed} failed</span>}
            {run.skipped > 0 && <span className="text-yellow-500">{run.skipped} skipped</span>}
          </div>
          <span className="text-xs text-slate-400">{passRate}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3 flex">
          {run.passed > 0 && (
            <div className="h-full bg-green-600" style={{ width: `${(run.passed / run.total) * 100}%` }} />
          )}
          {run.failed > 0 && (
            <div className="h-full bg-red-500" style={{ width: `${(run.failed / run.total) * 100}%` }} />
          )}
          {run.skipped > 0 && (
            <div className="h-full bg-yellow-600" style={{ width: `${(run.skipped / run.total) * 100}%` }} />
          )}
        </div>

        {/* Expand hint */}
        {run.tests && run.tests.length > 0 && (
          <span className="text-sm text-violet-400">
            {expanded ? '▲ Hide tests' : `▼ Show ${run.tests.length} test results`}
          </span>
        )}
      </div>

      {/* ── Expandable test list ─────────────────────────────────────────── */}
      {expanded && browserGroups && (
        <div className="border-t border-slate-700 divide-y divide-slate-800">
          {Object.entries(browserGroups).map(([browser, tests]) => (
            <BrowserSection key={browser} browser={browser} tests={tests} />
          ))}
        </div>
      )}

    </div>
  )
}
