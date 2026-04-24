import { type ZodError } from 'zod'

export function mapZodFieldErrors<K extends string>(
  error: ZodError<unknown>,
  keys: readonly K[],
): Partial<Record<K, string>> {
  const allowed = new Set<string>(keys)
  const out: Partial<Record<K, string>> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key !== 'string' || !allowed.has(key)) {
      continue
    }
    const k = key as K
    if (out[k] === undefined) {
      out[k] = issue.message
    }
  }
  return out
}
