import { z } from 'zod'
import { mapZodFieldErrors } from './zodFieldErrors'

export type LoginFieldErrors = Partial<Record<'username' | 'password', string>>

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required.'),
  password: z.string().trim().min(1, 'Password is required.'),
})

export function validateLoginFields(values: { username: string; password: string }): LoginFieldErrors {
  const result = loginSchema.safeParse(values)
  if (result.success) {
    return {}
  }
  return mapZodFieldErrors(result.error, ['username', 'password'])
}
