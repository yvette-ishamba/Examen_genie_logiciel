import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, usersApi } from '../../services/api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,
  error: null,
};

/**
 * Async Thunk for Login
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ identifier, pass }: { identifier: string; pass: string }, { rejectWithValue }) => {
    try {
      const authResponse = await authApi.login(identifier, pass);
      const token = authResponse.access_token;
      localStorage.setItem('token', token);
      
      const userProfile = await usersApi.getMe();
      return { user: userProfile, token };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Erreur de connexion');
    }
  }
);

/**
 * Async Thunk for restorting session
 */
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');
    
    try {
      const userProfile = await usersApi.getMe();
      return { user: userProfile, token };
    } catch (err: any) {
      localStorage.removeItem('token');
      return rejectWithValue(err.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Restore Session
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError, stopLoading } = authSlice.actions;
export default authSlice.reducer;
