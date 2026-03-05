export interface TestRecord {
  name: string
  status: string
  durationMs: number
}

export interface TestRunData {
  id: number
  runDate: string       // ISO string (serialised from Date for server → client)
  suiteName: string
  environment: string
  total: number
  passed: number
  failed: number
  skipped: number
  durationMs: number
  tests: TestRecord[] | null
  reportUrl: string | null
}
