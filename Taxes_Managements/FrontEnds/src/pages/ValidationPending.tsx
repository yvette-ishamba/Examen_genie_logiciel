import { useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck, LogOut, RefreshCcw, XCircle, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, restoreSession } from '../store/slices/authSlice';
import Button from '../components/Button';
import { useEffect } from 'react';

export default function ValidationPending() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If user is already validated, redirect to login
    if (user?.status === 'valide') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    await dispatch(restoreSession());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="relative">
            <div className={`w-24 h-24 ${user?.status === 'rejete' ? 'bg-red-50' : 'bg-blue-50'} rounded-full flex items-center justify-center ${user?.status !== 'rejete' ? 'animate-pulse' : ''}`}>
              {user?.status === 'rejete' ? (
                <XCircle className="w-12 h-12 text-red-600" />
              ) : (
                <Clock className="w-12 h-12 text-[#0047a5]" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
              {user?.status === 'rejete' ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-800">
            {user?.status === 'rejete' ? 'Demande rejetée' : 'Validation en attente'}
          </h1>
          <p className="text-slate-500 leading-relaxed">
            {user?.status === 'rejete' ? (
              <>Votre demande d'adhésion a été <span className="font-bold text-red-600">rejetée</span> par l'autorité locale. Veuillez contacter le support pour plus d'informations.</>
            ) : (
              <>Merci pour votre inscription, <span className="font-semibold text-slate-700">{user?.full_name}</span>. Votre compte est actuellement en attente de validation par l'autorité locale.</>
            )}
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${user?.status === 'rejete' ? 'bg-red-50/50 border-red-100/50' : 'bg-blue-50/50 border-blue-100/50'}`}>
          <p className={`text-sm ${user?.status === 'rejete' ? 'text-red-800' : 'text-blue-800'}`}>
            {user?.status === 'rejete' 
              ? "L'accès à la plateforme vous a été refusé. Si vous pensez qu'il s'agit d'une erreur, veuillez vous rapprocher de l'administration."
              : "Cette étape est nécessaire pour garantir la sécurité et l'intégrité de notre plateforme de gestion des taxes."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleRefresh}
            className="w-full"
            leftIcon={<RefreshCcw className="w-4 h-4" />}
          >
            Vérifier le statut
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleLogout}
            className="w-full text-slate-600 hover:text-red-600 hover:bg-red-50"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Se déconnecter
          </Button>
        </div>

        <div className="pt-4 text-xs text-slate-400">
          Besoin d'aide ? Contactez l'administration au <span className="font-semibold">+243 00 00 00 00</span>
        </div>
      </div>
    </div>
  );
}
