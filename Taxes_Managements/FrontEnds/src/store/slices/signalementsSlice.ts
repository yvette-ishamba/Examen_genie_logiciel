import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Signalement {
  id: number;
  sujet: string;
  description: string;
  date_signalement: string;
  statut: string;
  user_id: number;
}

interface SignalementsState {
  signalements: Signalement[];
  loading: boolean;
  error: string | null;
}

const initialState: SignalementsState = {
  signalements: [],
  loading: false,
  error: null,
};

const signalementsSlice = createSlice({
  name: 'signalements',
  initialState,
  reducers: {
    setSignalements: (state, action: PayloadAction<Signalement[]>) => {
      state.signalements = action.payload;
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
    addSignalement: (state, action: PayloadAction<Signalement>) => {
      state.signalements.unshift(action.payload);
    },
    updateSignalementStatusInList: (state, action: PayloadAction<{ id: number; statut: string }>) => {
      state.signalements = state.signalements.map(s => 
        s.id === action.payload.id ? { ...s, statut: action.payload.statut } : s
      );
    },
  },
});

export const { 
  setSignalements, 
  setLoading, 
  setError, 
  addSignalement,
  updateSignalementStatusInList
} = signalementsSlice.actions;

export default signalementsSlice.reducer;
