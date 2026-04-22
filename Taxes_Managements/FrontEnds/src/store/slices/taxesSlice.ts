import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TaxeOut } from '../../services/taxe_api';
import { type TaxGlobalStats } from '../../services/stats_api';

interface TaxesState {
  taxes: TaxeOut[];
  globalStats: TaxGlobalStats | null;
  isStatsLoading: boolean;
  selectedYear: string;
  selectedCategory: string;
  searchQuery: string;
  deleteError: string | null;
}

const initialState: TaxesState = {
  taxes: [],
  globalStats: null,
  isStatsLoading: false,
  selectedYear: new Date().getFullYear().toString(),
  selectedCategory: 'Toutes',
  searchQuery: '',
  deleteError: null,
};

const taxesSlice = createSlice({
  name: 'taxes',
  initialState,
  reducers: {
    setTaxes: (state, action: PayloadAction<TaxeOut[]>) => {
      state.taxes = action.payload;
    },
    addTaxe: (state, action: PayloadAction<TaxeOut>) => {
      state.taxes.push(action.payload);
    },
    updateTaxeInList: (state, action: PayloadAction<TaxeOut>) => {
      state.taxes = state.taxes.map(t => t.id === action.payload.id ? action.payload : t);
    },
    removeTaxe: (state, action: PayloadAction<number>) => {
      state.taxes = state.taxes.filter(t => t.id !== action.payload);
    },
    setGlobalStats: (state, action: PayloadAction<TaxGlobalStats | null>) => {
      state.globalStats = action.payload;
      state.isStatsLoading = false;
    },
    setStatsLoading: (state, action: PayloadAction<boolean>) => {
      state.isStatsLoading = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDeleteError: (state, action: PayloadAction<string | null>) => {
      state.deleteError = action.payload;
    },
  },
});

export const { 
  setTaxes, 
  addTaxe, 
  updateTaxeInList, 
  removeTaxe, 
  setGlobalStats, 
  setStatsLoading, 
  setSelectedYear, 
  setSelectedCategory, 
  setSearchQuery,
  setDeleteError
} = taxesSlice.actions;

export default taxesSlice.reducer;
