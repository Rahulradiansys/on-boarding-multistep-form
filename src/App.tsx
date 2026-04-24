import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { OnboardingPage } from './onboarding/OnboardingPage'
import { LoginRoute } from './routing/LoginRoute'
import { RequireAuth } from './routing/RequireAuth'
import { RequireIncompleteOnboarding } from './routing/RequireIncompleteOnboarding'
import { RequireOnboardingComplete } from './routing/RequireOnboardingComplete'
import { RootRedirect } from './routing/RootRedirect'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <RequireIncompleteOnboarding>
                <OnboardingPage />
              </RequireIncompleteOnboarding>
            </RequireAuth>
          }
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <RequireOnboardingComplete>
                <HomePage />
              </RequireOnboardingComplete>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
