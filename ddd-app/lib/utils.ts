/**
 * Converts a string to a safe data-testid slug.
 * Lowercases, replaces non-alphanumeric characters with hyphens,
 * and strips leading/trailing hyphens.
 * e.g. "CI/CD & Infrastructure" → "ci-cd-infrastructure"
 */
export function toTestId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
