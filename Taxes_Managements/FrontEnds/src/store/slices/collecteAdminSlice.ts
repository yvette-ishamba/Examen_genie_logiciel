import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CollecteListResponse, AgentCollecteSummary } from '../../services/paiement_api';

interface CollecteAdminState {
  listData: CollecteListResponse | null;
  agents: AgentCollecteSummary[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CollecteAdminState = {
  listData: null,
  agents: [],
  isLoading: false,
  error: null,
};

const collecteAdminSlice = createSlice({
  name: 'collecteAdmin',
  initialState,
  reducers: {
    setCollecteData: (
      state,
      action: PayloadAction<{ list: CollecteListResponse; agents: AgentCollecteSummary[] }>
    ) => {
      state.listData = action.payload.list;
      state.agents = action.payload.agents;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCollecteData, setLoading, setError } = collecteAdminSlice.actions;
export default collecteAdminSlice.reducer;
