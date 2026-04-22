import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ResetPasswordState {
  newPassword: string;
  confirmPassword: string;
  loading: boolean;
  status: { type: 'success' | 'error', message: string } | null;
}

const initialState: ResetPasswordState = {
  newPassword: '',
  confirmPassword: '',
  loading: false,
  status: null,
};

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    setNewPassword: (state, action: PayloadAction<string>) => {
      state.newPassword = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStatus: (state, action: PayloadAction<{ type: 'success' | 'error', message: string } | null>) => {
      state.status = action.payload;
      state.loading = false;
    },
    resetForm: (state) => {
      state.newPassword = '';
      state.confirmPassword = '';
      state.loading = false;
      state.status = null;
    },
  },
});

export const { 
  setNewPassword, 
  setConfirmPassword, 
  setLoading, 
  setStatus, 
  resetForm 
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
