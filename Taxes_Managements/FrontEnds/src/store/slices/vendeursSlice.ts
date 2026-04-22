import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type VendeurMe, type VendeurStatusOut } from '../../services/vendeur_api';

interface VendeursState {
  vendorData: VendeurMe | null;
  adminList: VendeurStatusOut[];
  loading: boolean;
  error: string | null;
  page: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  searchQuery: string;
}

const initialState: VendeursState = {
  vendorData: null,
  adminList: [],
  loading: false,
  error: null,
  page: 0,
  period: 'daily',
  searchQuery: '',
};

const vendeursSlice = createSlice({
  name: 'vendeurs',
  initialState,
  reducers: {
    setVendorData: (state, action: PayloadAction<VendeurMe | null>) => {
      state.vendorData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAdminList: (state, action: PayloadAction<VendeurStatusOut[]>) => {
      state.adminList = action.payload;
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
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPeriod: (state, action: PayloadAction<'daily' | 'weekly' | 'monthly' | 'yearly'>) => {
      state.period = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { 
  setVendorData, 
  setAdminList, 
  setLoading, 
  setError, 
  setPage, 
  setPeriod, 
  setSearchQuery 
} = vendeursSlice.actions;

export default vendeursSlice.reducer;
