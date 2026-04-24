import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export function RootRedirect() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const isCompleted = useAppSelector((s) => s.onboarding.isCompleted)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (isCompleted) {
    return <Navigate to="/home" replace />
  }
  return <Navigate to="/onboarding" replace />
}
