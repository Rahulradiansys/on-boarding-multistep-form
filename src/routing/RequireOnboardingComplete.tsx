import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export function RequireOnboardingComplete({ children }: { children: ReactNode }) {
  const isCompleted = useAppSelector((s) => s.onboarding.isCompleted)
  if (!isCompleted) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}
