import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import onboardingReducer from './onboardingSlice'
import { loadPersistedState, savePersistedState } from './persist'

const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
})

const persisted = loadPersistedState()

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persisted
    ? {
        auth: persisted.auth,
        onboarding: persisted.onboarding,
      }
    : undefined,
})

store.subscribe(() => {
  const state = store.getState()
  savePersistedState({
    auth: state.auth,
    onboarding: state.onboarding,
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
