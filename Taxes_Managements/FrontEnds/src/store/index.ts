import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboardingSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import collecteAdminReducer from './slices/collecteAdminSlice';

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    collecteAdmin: collecteAdminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
