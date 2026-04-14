import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '../../services/api';

export type RoleType = 'Vendeur' | 'Agent de Collecte' | 'Autorité Locale' | null;

interface OnboardingState {
  currentStep: number;
  role: RoleType;
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  identifiantNational: string;
  emplacement: string;
  submitting: boolean;
  submitError: string | null;
}

const initialState: OnboardingState = {
  currentStep: 1,
  role: 'Vendeur', // Default selected
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  identifiantNational: '',
  emplacement: '',
  submitting: false,
  submitError: null,
};

export const submitOnboardingProfile = createAsyncThunk(
  'onboarding/submitProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const payload = state.onboarding;
      if (!payload.role || !payload.fullName || !payload.phoneNumber || !payload.email || !payload.password) {
        return rejectWithValue("Veuillez remplir correctement tous les champs obligatoires.");
      }
      const response = await usersApi.register(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Erreur de soumission');
    }
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setRole: (state, action: PayloadAction<RoleType>) => {
      state.role = action.payload;
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<OnboardingState>>) => {
      Object.assign(state, action.payload);
    },
    resetOnboarding: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingProfile.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitOnboardingProfile.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitOnboardingProfile.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });
  }
});

export const { setStep, setRole, updatePersonalInfo, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
