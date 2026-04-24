import { useAppSelector } from '../store/hooks'
import { StepPayment } from './StepPayment.tsx'
import { StepPersonal } from './StepPersonal.tsx'
import { StepSongs } from './StepSongs.tsx'
import { StepSuccess } from './StepSuccess.tsx'

const STEP_LABELS = ['Profile', 'Songs', 'Payment', 'Done']

export function OnboardingPage() {
  const currentStep = useAppSelector((s) => s.onboarding.currentStep)

  return (
    <div className="page">
      <div className="card card--wide">
        <header className="onboarding__header">
          <h1 className="card__title">Onboarding</h1>
          <ol className="steps" aria-label="Onboarding progress">
            {STEP_LABELS.map((label, index) => {
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isDone = currentStep > stepNumber
              return (
                <li
                  key={label}
                  className={`steps__item${isActive ? ' steps__item--active' : ''}${isDone ? ' steps__item--done' : ''}`}
                >
                  <span className="steps__badge" aria-hidden>
                    {isDone ? '✓' : stepNumber}
                  </span>
                  <span className="steps__label">{label}</span>
                </li>
              )
            })}
          </ol>
        </header>

        {currentStep === 1 ? <StepPersonal /> : null}
        {currentStep === 2 ? <StepSongs /> : null}
        {currentStep === 3 ? <StepPayment /> : null}
        {currentStep === 4 ? <StepSuccess /> : null}
      </div>
    </div>
  )
}
