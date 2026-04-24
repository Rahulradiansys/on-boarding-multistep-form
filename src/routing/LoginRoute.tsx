import { Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { useAppSelector } from '../store/hooks'

export function LoginRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const isCompleted = useAppSelector((s) => s.onboarding.isCompleted)

  if (!isAuthenticated) {
    return <LoginPage />
  }
  if (isCompleted) {
    return <Navigate to="/home" replace />
  }
  return <Navigate to="/onboarding" replace />
}
