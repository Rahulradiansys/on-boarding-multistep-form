import { type FormEvent, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { goToNextStep, goToPreviousStep, updatePayment } from '../store/onboardingSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  digitsOnly,
  formatExpiryFromDigits,
  type PaymentFieldErrors,
  validatePaymentFields,
} from '../utils/paymentValidation'

const MAX_PAN_DIGITS = 19
const MAX_CVV_DIGITS = 4

export function StepPayment() {
  const dispatch = useAppDispatch()
  const payment = useAppSelector((s) => s.onboarding.payment)
  const [errors, setErrors] = useState<PaymentFieldErrors>({})

  useEffect(() => {
    const pan = digitsOnly(payment.cardNumber).slice(0, MAX_PAN_DIGITS)
    const cvv = digitsOnly(payment.cvv).slice(0, MAX_CVV_DIGITS)
    const exp = formatExpiryFromDigits(payment.expiryDate)
    if (pan !== payment.cardNumber || cvv !== payment.cvv || exp !== payment.expiryDate) {
      dispatch(updatePayment({ cardNumber: pan, cvv, expiryDate: exp }))
    }
  }, [dispatch, payment.cardNumber, payment.cvv, payment.expiryDate])

  const clearError = (key: keyof PaymentFieldErrors) => {
    setErrors((prev) => {
      if (!prev[key]) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleCardChange = (raw: string) => {
    const pan = digitsOnly(raw).slice(0, MAX_PAN_DIGITS)
    dispatch(updatePayment({ cardNumber: pan }))
    clearError('cardNumber')
  }

  const handleExpiryChange = (raw: string) => {
    dispatch(updatePayment({ expiryDate: formatExpiryFromDigits(raw) }))
    clearError('expiryDate')
  }

  const handleCvvChange = (raw: string) => {
    const cvv = digitsOnly(raw).slice(0, MAX_CVV_DIGITS)
    dispatch(updatePayment({ cvv }))
    clearError('cvv')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validatePaymentFields(payment)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    dispatch(goToNextStep())
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__heading">Payment information</h2>
      <p className="card__hint">Demo only — nothing is sent to a server.</p>

      <label className="field">
        <span className="field__label">Card number</span>
        <Input
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242424242424242"
          maxLength={MAX_PAN_DIGITS}
          value={payment.cardNumber}
          onChange={(e) => handleCardChange(e.target.value)}
          aria-required="true"
          aria-invalid={Boolean(errors.cardNumber)}
          aria-describedby={errors.cardNumber ? 'pay-card-error' : undefined}
        />
        {errors.cardNumber ? (
          <p id="pay-card-error" className="form__error" role="alert">
            {errors.cardNumber}
          </p>
        ) : null}
      </label>
      <div className="form__grid">
        <label className="field">
          <span className="field__label">Expiry (MM/YY)</span>
          <Input
            autoComplete="cc-exp"
            placeholder="12/30"
            inputMode="numeric"
            maxLength={5}
            value={payment.expiryDate}
            onChange={(e) => handleExpiryChange(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.expiryDate)}
            aria-describedby={errors.expiryDate ? 'pay-exp-error' : undefined}
          />
          {errors.expiryDate ? (
            <p id="pay-exp-error" className="form__error" role="alert">
              {errors.expiryDate}
            </p>
          ) : null}
        </label>
        <label className="field">
          <span className="field__label">CVV</span>
          <Input
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={MAX_CVV_DIGITS}
            value={payment.cvv}
            onChange={(e) => handleCvvChange(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.cvv)}
            aria-describedby={errors.cvv ? 'pay-cvv-error' : undefined}
          />
          {errors.cvv ? (
            <p id="pay-cvv-error" className="form__error" role="alert">
              {errors.cvv}
            </p>
          ) : null}
        </label>
      </div>

      <div className="form__actions">
        <Button type="button" variant="ghost" onClick={() => dispatch(goToPreviousStep())}>
          Back
        </Button>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  )
}
