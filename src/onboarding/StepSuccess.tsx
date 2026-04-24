import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { completeOnboarding, goToPreviousStep } from '../store/onboardingSlice'
import { useAppDispatch } from '../store/hooks'

export function StepSuccess() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleFinish = () => {
    dispatch(completeOnboarding())
    navigate('/home', { replace: true })
  }

  return (
    <div className="form">
      <h2 className="form__heading">You are all set</h2>
      <p className="card__lead">
        Thanks for completing onboarding. Your details are stored locally in this browser for this demo.
      </p>
      <div className="success-banner" role="status">
        <span className="success-banner__icon" aria-hidden>
          ✓
        </span>
        <div>
          <p className="success-banner__title">Onboarding complete</p>
          <p className="success-banner__text">Continue to your home dashboard when you are ready.</p>
        </div>
      </div>
      <div className="form__actions">
        <Button type="button" variant="ghost" onClick={() => dispatch(goToPreviousStep())}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={handleFinish}>
          Go to home
        </Button>
      </div>
    </div>
  )
}
