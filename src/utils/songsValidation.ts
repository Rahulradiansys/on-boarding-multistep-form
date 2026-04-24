import { z } from 'zod'

export type SongsFormValues = {
  songs: string[]
}

export const songsFormSchema = z.object({
  songs: z.array(z.string()).superRefine((rows, ctx) => {
    const trimmedRows = rows.map((s) => String(s).trim())
    const nonEmpty = trimmedRows.filter(Boolean)
    if (nonEmpty.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add at least one song.',
        path: ['songs'],
      })
      return
    }
    const partial = rows.some((raw) => {
      const t = String(raw).trim()
      return t.length > 0 && t.length < 2
    })
    if (partial) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each song must be at least 2 characters (or clear the row).',
        path: ['songs'],
      })
    }
  }),
})

export function validateSongsForm(values: SongsFormValues): { songs?: string } {
  const result = songsFormSchema.safeParse(values)
  if (result.success) {
    return {}
  }
  const msg = result.error.issues.find((i) => i.path[0] === 'songs')?.message
  return msg ? { songs: msg } : {}
}
