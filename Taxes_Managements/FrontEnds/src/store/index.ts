import { configureStore } from '@reduxjs/toolkit';
import onboardingReducer from './slices/onboardingSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import collecteAdminReducer from './slices/collecteAdminSlice';
import taxesReducer from './slices/taxesSlice';
import usersReducer from './slices/usersSlice';
import signalementsReducer from './slices/signalementsSlice';
import reportsReducer from './slices/reportsSlice';
import vendeursReducer from './slices/vendeursSlice';
import resetPasswordReducer from './slices/resetPasswordSlice';

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    collecteAdmin: collecteAdminReducer,
    taxes: taxesReducer,
    users: usersReducer,
    signalements: signalementsReducer,
    reports: reportsReducer,
    vendeurs: vendeursReducer,
    resetPassword: resetPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
