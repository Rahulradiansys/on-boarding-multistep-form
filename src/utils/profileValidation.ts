import { z } from 'zod'
import type { ProfileState } from '../store/onboardingSlice'
import { mapZodFieldErrors } from './zodFieldErrors'

export type ProfileFieldErrors = Partial<Record<'name' | 'age' | 'email', string>>

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  age: z
    .string()
    .trim()
    .min(1, 'Age is required.')
    .refine((val) => {
      const n = Number(val)
      return Number.isFinite(n) && Number.isInteger(n) && n >= 1 && n <= 120
    }, 'Enter a whole number between 1 and 120.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
})

export function validateProfile(profile: ProfileState): ProfileFieldErrors {
  const result = profileSchema.safeParse({
    name: profile.name,
    age: profile.age,
    email: profile.email,
  })
  if (result.success) {
    return {}
  }
  return mapZodFieldErrors(result.error, ['name', 'age', 'email'])
}
