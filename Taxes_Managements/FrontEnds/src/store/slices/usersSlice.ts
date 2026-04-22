import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone_number: string;
  vendeur?: {
    identifiant_national: string;
  } | null;
  status: string;
  created_at: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterStatus: string;
  currentPage: number;
  hasMore: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  searchTerm: '',
  filterStatus: 'all',
  currentPage: 0,
  hasMore: true,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
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
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    updateUserStatus: (state, action: PayloadAction<{ id: number; status: string }>) => {
      state.users = state.users.map(u => 
        u.id === action.payload.id ? { ...u, status: action.payload.status } : u
      );
    },
  },
});

export const { 
  setUsers, 
  setLoading, 
  setError, 
  setSearchTerm, 
  setFilterStatus, 
  setCurrentPage, 
  setHasMore,
  updateUserStatus
} = usersSlice.actions;

export default usersSlice.reducer;
