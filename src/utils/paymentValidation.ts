import { z } from 'zod'
import { mapZodFieldErrors } from './zodFieldErrors'

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatExpiryFromDigits(raw: string): string {
  const d = digitsOnly(raw).slice(0, 4)
  if (d.length <= 2) {
    return d
  }
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

export function luhnCheck(panDigits: string): boolean {
  if (panDigits.length < 13 || panDigits.length > 19) {
    return false
  }
  let sum = 0
  let alt = false
  for (let i = panDigits.length - 1; i >= 0; i -= 1) {
    let n = Number.parseInt(panDigits[i]!, 10)
    if (Number.isNaN(n)) {
      return false
    }
    if (alt) {
      n *= 2
      if (n > 9) {
        n -= 9
      }
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

export function parseExpiryMmYy(value: string): { month: number; year: number } | null {
  const trimmed = value.trim()
  const match = /^(\d{2})\/(\d{2})$/.exec(trimmed)
  if (!match) {
    return null
  }
  const month = Number.parseInt(match[1]!, 10)
  const yy = Number.parseInt(match[2]!, 10)
  if (month < 1 || month > 12 || Number.isNaN(yy)) {
    return null
  }
  return { month, year: 2000 + yy }
}

export function isExpiryNotExpired(month: number, year: number): boolean {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  if (year > y) {
    return true
  }
  if (year < y) {
    return false
  }
  return month >= m
}

export type PaymentFieldErrors = {
  cardNumber?: string
  expiryDate?: string
  cvv?: string
}

const paymentSchema = z.object({
  cardNumber: z.string().superRefine((value, ctx) => {
    const pan = digitsOnly(value ?? '')
    if (pan.length < 13 || pan.length > 19) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter between 13 and 19 digits.' })
      return
    }
    if (!luhnCheck(pan)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card number does not pass the checksum (invalid number).',
      })
    }
  }),
  expiryDate: z.string().superRefine((value, ctx) => {
    const expiry = parseExpiryMmYy(value ?? '')
    if (!expiry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Use format MM/YY with a valid month (01–12).',
      })
      return
    }
    if (!isExpiryNotExpired(expiry.month, expiry.year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card appears expired. Enter a future expiry.',
      })
    }
  }),
  cvv: z.string().superRefine((value, ctx) => {
    const cvv = digitsOnly(value ?? '')
    if (cvv.length < 3 || cvv.length > 4) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter 3 or 4 digits (4 for Amex).' })
    }
  }),
})

export function validatePaymentFields(input: {
  cardNumber: string
  expiryDate: string
  cvv: string
}): PaymentFieldErrors {
  const result = paymentSchema.safeParse(input)
  if (result.success) {
    return {}
  }
  return mapZodFieldErrors(result.error, ['cardNumber', 'expiryDate', 'cvv'])
}
