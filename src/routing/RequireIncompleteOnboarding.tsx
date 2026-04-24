import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export function RequireIncompleteOnboarding({ children }: { children: ReactNode }) {
  const isCompleted = useAppSelector((s) => s.onboarding.isCompleted)
  if (isCompleted) {
    return <Navigate to="/home" replace />
  }
  return children
}
