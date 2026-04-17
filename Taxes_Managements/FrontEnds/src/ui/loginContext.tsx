import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  loginUser, 
  logout as logoutAction, 
  clearError as clearErrorAction,
  type User as AuthUser
} from '../store/slices/authSlice';

/**
 * Re-export User interface for backward compatibility
 */
export type User = AuthUser;

/**
 * Hook for using the login logic (Redux Adapter)
 * This maintains the exact same interface as the old context hook.
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (identifier: string, pass: string) => {
    await dispatch(loginUser({ identifier, pass })).unwrap();
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};

/**
 * AuthProvider is now just a placeholder to avoid breaking App.tsx
 * It could eventually be removed after updating App.tsx
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
