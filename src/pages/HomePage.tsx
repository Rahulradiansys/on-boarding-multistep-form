import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { logout } from '../store/authSlice'
import { resetOnboarding } from '../store/onboardingSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export function HomePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const name = useAppSelector((s) => s.onboarding.profile.name)

  const handleSignOut = () => {
    dispatch(logout())
    dispatch(resetOnboarding())
    navigate('/', { replace: true })
  }

  return (
    <div className="page">
      <div className="card card--wide">
        <h1 className="card__title">Welcome home</h1>
        <p className="card__lead">
          {name.trim()
            ? `Welcome back, ${name.trim()}. Your onboarding is complete.`
            : 'Your onboarding is complete. Welcome aboard.'}
        </p>
        <div className="form__actions form__actions--trailing">
          <Button type="button" variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
