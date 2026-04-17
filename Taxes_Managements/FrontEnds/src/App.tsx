import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AppLayout from './ui/AppLayout';
import Collecte from './pages/Collecte';
import Vendeurs from './pages/Vendeurs';
import Taxes from './pages/Taxes';
import Signalements from './pages/Signalements';
import { taxeApi } from './services/taxe_api';

import ProtectedRoute from './ui/ProtectedRoute';
import ErrorBoundary from './ui/ErrorBoundary';
import { statsApi } from './services/stats_api';
import { setDashboardData, setLoading, setError } from './store/slices/dashboardSlice';
import { paiementApi } from './services/paiement_api';
import { setCollecteData, setLoading as setCollecteLoading, setError as setCollecteError } from './store/slices/collecteAdminSlice';

// Loaders
const taxesLoader = async () => {
  return taxeApi.getAll();
};

const collecteLoader = async () => {
  return taxeApi.getView();
};

const collecteAdminLoader = async () => {
  store.dispatch(setCollecteLoading(true));
  try {
    const [list, agents] = await Promise.all([
      paiementApi.getList(1), // initial page 1 — pagination is handled in the component
      paiementApi.getByAgent(),
    ]);
    store.dispatch(setCollecteData({ list, agents }));
    return { list, agents };
  } catch (err: any) {
    const msg = err.message || 'Erreur lors du chargement des collectes';
    store.dispatch(setCollecteError(msg));
    throw new Error(msg);
  }
};

const dashboardLoader = async () => {
  store.dispatch(setLoading(true));
  try {
    const data = await statsApi.getDashboardData();
    store.dispatch(setDashboardData(data));
    return data;
  } catch (err: any) {
    const msg = err.message || 'Erreur lors du chargement des statistiques';
    store.dispatch(setError(msg));
    throw new Error(msg);
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute requireAdmin />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
            loader: dashboardLoader,
          },
          {
            path: 'taxes',
            element: <Taxes />,
            loader: taxesLoader,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['Agent de Collecte', 'Autorité Locale']} />,
        children: [
          {
            path: 'collecte',
            element: <Collecte />,
            loader: async () => {
              const state = store.getState();
              const role = state.auth.user?.role;
              if (role === 'Autorité Locale') {
                return collecteAdminLoader();
              }
              return collecteLoader();
            },
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['Vendeur', 'Agent de Collecte', 'Autorité Locale']} />,
        children: [
          {
            path: 'vendeurs',
            element: <Vendeurs />,
          },
          {
            path: 'signalements',
            element: <Signalements />,
          },
        ],
      },
    ],
  },
]);

import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './store/hooks';
import { restoreSession } from './store/slices/authSlice';
import { useEffect } from 'react';

/**
 * Component to trigger session restoration on mount
 */
function AuthInitialize({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
      <AuthInitialize>
        <RouterProvider router={router} />
      </AuthInitialize>
    </Provider>
  );
}

export default App;
