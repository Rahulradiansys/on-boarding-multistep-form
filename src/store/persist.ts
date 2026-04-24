import type { AuthState } from './authSlice'
import type { OnboardingState } from './onboardingSlice'
import { initialOnboardingState } from './onboardingSlice'

export const STORAGE_KEY = 'onboard-login-state'

export type PersistedShape = {
  auth: AuthState
  onboarding: OnboardingState
}

function mergeOnboarding(partial?: Partial<OnboardingState>): OnboardingState {
  if (!partial) {
    return { ...initialOnboardingState }
  }
  return {
    ...initialOnboardingState,
    ...partial,
    profile: { ...initialOnboardingState.profile, ...partial.profile },
    payment: { ...initialOnboardingState.payment, ...partial.payment },
    songs: Array.isArray(partial.songs) ? partial.songs : initialOnboardingState.songs,
    currentStep:
      typeof partial.currentStep === 'number'
        ? partial.currentStep
        : initialOnboardingState.currentStep,
    isCompleted:
      typeof partial.isCompleted === 'boolean'
        ? partial.isCompleted
        : initialOnboardingState.isCompleted,
  }
}

export function loadPersistedState(): Partial<PersistedShape> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return undefined
    const record = parsed as Record<string, unknown>
    const auth = record.auth as AuthState | undefined
    const onboarding = record.onboarding as Partial<OnboardingState> | undefined
    return {
      auth: auth && typeof auth.isAuthenticated === 'boolean' ? auth : { isAuthenticated: false },
      onboarding: mergeOnboarding(onboarding),
    }
  } catch {
    return undefined
  }
}

export function savePersistedState(state: PersistedShape): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    void 0
  }
}
