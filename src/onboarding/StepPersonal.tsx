import { type ChangeEvent, type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { logout } from '../store/authSlice'
import { goToNextStep, resetOnboarding, updateProfile } from '../store/onboardingSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { type ProfileFieldErrors, validateProfile } from '../utils/profileValidation'

export function StepPersonal() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const profile = useAppSelector((s) => s.onboarding.profile)
  const [errors, setErrors] = useState<ProfileFieldErrors>({})

  const clearError = (key: keyof ProfileFieldErrors) => {
    setErrors((prev) => {
      if (!prev[key]) {
        return prev
      }
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleSignOut = () => {
    dispatch(logout())
    dispatch(resetOnboarding())
    navigate('/login', { replace: true })
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      dispatch(updateProfile({ profilePicture: null }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        dispatch(updateProfile({ profilePicture: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = validateProfile(profile)
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setErrors({})
    dispatch(goToNextStep())
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form__heading">Personal profile</h2>
      <label className="field">
        <span className="field__label">Full name*</span>
        <Input
          name="name"
          autoComplete="name"
          value={profile.name}
          onChange={(e) => {
            dispatch(updateProfile({ name: e.target.value }))
            clearError('name')
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'profile-name-error' : undefined}
        />
        {errors.name ? (
          <p id="profile-name-error" className="form__error" role="alert">
            {errors.name}
          </p>
        ) : null}
      </label>
      <label className="field">
        <span className="field__label">Age*</span>
        <Input
          name="age"
          type="number"
          inputMode="numeric"
          value={profile.age}
          onChange={(e) => {
            dispatch(updateProfile({ age: e.target.value }))
            clearError('age')
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.age)}
          aria-describedby={errors.age ? 'profile-age-error' : undefined}
        />
        {errors.age ? (
          <p id="profile-age-error" className="form__error" role="alert">
            {errors.age}
          </p>
        ) : null}
      </label>
      <label className="field">
        <span className="field__label">Email*</span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          value={profile.email}
          onChange={(e) => {
            dispatch(updateProfile({ email: e.target.value }))
            clearError('email')
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'profile-email-error' : undefined}
        />
        {errors.email ? (
          <p id="profile-email-error" className="form__error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </label>
      <label className="field">
        <span className="field__label">Profile picture (optional)</span>
        <Input type="file" accept="image/*" onChange={handleFile} />
      </label>
      {profile.profilePicture ? (
        <div className="preview">
          <img src={profile.profilePicture} alt="Profile preview" className="preview__img" />
        </div>
      ) : null}

      <div className="form__actions">
        <Button type="button" variant="ghost" onClick={handleSignOut}>
          Sign out
        </Button>
        <Button type="submit" variant="primary">
          Next
        </Button>
      </div>
    </form>
  )
}
