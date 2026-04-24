import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { DEMO_PASSWORD, DEMO_USERNAME } from '../constants/credentials'
import { loginSuccess } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import { type LoginFieldErrors, validateLoginFields } from '../utils/loginValidation'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [error, setError] = useState<string | null>(null)

  const clearFieldError = (key: keyof LoginFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[key]) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const nextFields = validateLoginFields({ username, password })
    if (Object.keys(nextFields).length > 0) {
      setFieldErrors(nextFields)
      return
    }
    setFieldErrors({})
    const u = username.trim()
    const p = password.trim()
    if (u === DEMO_USERNAME && p === DEMO_PASSWORD) {
      dispatch(loginSuccess())
      navigate('/onboarding', { replace: true })
      return
    }
    setError('Invalid username or password. Try user123 / password123.')
  }

  return (
    <div className="page page--narrow">
      <div className="card">
        <h1 className="card__title">Sign in</h1>
        <p className="card__hint">
          Demo account: <code>{DEMO_USERNAME}</code> / <code>{DEMO_PASSWORD}</code>
        </p>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field__label">Username</span>
            <Input
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                clearFieldError('username')
              }}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.username)}
              aria-describedby={fieldErrors.username ? 'login-username-error' : undefined}
            />
            {fieldErrors.username ? (
              <p id="login-username-error" className="form__error" role="alert">
                {fieldErrors.username}
              </p>
            ) : null}
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
              }}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            />
            {fieldErrors.password ? (
              <p id="login-password-error" className="form__error" role="alert">
                {fieldErrors.password}
              </p>
            ) : null}
          </label>
          {error ? <p className="form__error">{error}</p> : null}
          <Button type="submit" variant="primary">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
