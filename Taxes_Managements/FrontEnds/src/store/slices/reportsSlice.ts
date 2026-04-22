import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type GlobalReports } from '../../services/stats_api';

interface ReportsState {
  reports: GlobalReports | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: null,
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<GlobalReports>) => {
      state.reports = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setReports, setLoading, setError } = reportsSlice.actions;

export default reportsSlice.reducer;
