import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ProfileState = {
  name: string
  age: string
  email: string
  profilePicture: string | null
}

export type PaymentState = {
  cardNumber: string
  expiryDate: string
  cvv: string
}

export type OnboardingState = {
  currentStep: number
  profile: ProfileState
  songs: string[]
  payment: PaymentState
  isCompleted: boolean
}

export const initialProfile: ProfileState = {
  name: '',
  age: '',
  email: '',
  profilePicture: null,
}

export const initialPayment: PaymentState = {
  cardNumber: '',
  expiryDate: '',
  cvv: '',
}

export const initialOnboardingState: OnboardingState = {
  currentStep: 1,
  profile: initialProfile,
  songs: [],
  payment: initialPayment,
  isCompleted: false,
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: initialOnboardingState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    goToNextStep: (state) => {
      state.currentStep = Math.min(4, state.currentStep + 1)
    },
    goToPreviousStep: (state) => {
      state.currentStep = Math.max(1, state.currentStep - 1)
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    setSongs: (state, action: PayloadAction<string[]>) => {
      state.songs = action.payload
    },
    updatePayment: (state, action: PayloadAction<Partial<PaymentState>>) => {
      state.payment = { ...state.payment, ...action.payload }
    },
    completeOnboarding: (state) => {
      state.isCompleted = true
    },
    resetOnboarding: () => initialOnboardingState,
  },
})

export const {
  setCurrentStep,
  goToNextStep,
  goToPreviousStep,
  updateProfile,
  setSongs,
  updatePayment,
  completeOnboarding,
  resetOnboarding,
} = onboardingSlice.actions

export default onboardingSlice.reducer
