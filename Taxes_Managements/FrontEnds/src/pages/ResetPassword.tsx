import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLandmark, FaLock, FaArrowRight, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { usersApi } from '../services/api';
import Button from '../components/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setNewPassword, 
  setConfirmPassword, 
  setLoading, 
  setStatus, 
  resetForm 
} from '../store/slices/resetPasswordSlice';

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { 
    newPassword, 
    confirmPassword, 
    loading, 
    status 
  } = useAppSelector(state => state.resetPassword);

  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      dispatch(setStatus({ type: 'error', message: 'Token de réinitialisation manquant.' }));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(setStatus({ type: 'error', message: 'Les mots de passe ne correspondent pas.' }));
      return;
    }
    if (newPassword.length < 6) {
      dispatch(setStatus({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' }));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setStatus(null));
    try {
      await usersApi.resetPasswordWithToken(token, newPassword);
      dispatch(setStatus({ type: 'success', message: 'Votre mot de passe a été réinitialisé avec succès !' }));
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      dispatch(setStatus({ type: 'error', message: err.message || 'Le lien est invalide ou a expiré.' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-inter flex flex-col pt-16 px-4">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <FaLandmark className="w-10 h-10 text-[#0047a5]" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-[#0047a5] tracking-wide">GESTION DES TAXES</h1>
      </div>

      <div className="w-full max-w-[400px] mx-auto bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden transition-all duration-300">
        <div className="h-1.5 w-full bg-[#0047a5]"></div>
        
        <div className="p-8">
          {status?.type === 'success' ? (
            <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Succès !</h2>
              <p className="text-sm text-slate-500 mb-6">{status.message}</p>
              <p className="text-xs text-slate-400">Redirection vers la connexion...</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Nouveau mot de passe</h2>
              <p className="text-sm text-slate-500 mb-8">
                Veuillez entrer votre nouveau mot de passe sécurisé.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="block text-[0.7rem] font-bold text-slate-700 uppercase tracking-wide">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-3 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] transition-colors outline-none font-medium"
                      value={newPassword}
                      onChange={(e) => dispatch(setNewPassword(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[0.7rem] font-bold text-slate-700 uppercase tracking-wide">Confirmer le mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-3 py-3 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] transition-colors outline-none font-medium"
                      value={confirmPassword}
                      onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  {status?.type === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-xs font-medium mb-3 bg-red-50 p-2.5 rounded-lg border border-red-100">
                      <FaExclamationCircle className="w-4 h-4 shrink-0" />
                      {status.message}
                    </div>
                  )}
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!token}
                    fullWidth
                    rightIcon={!loading && <FaArrowRight className="h-4 w-4" />}
                  >
                    Réinitialiser le mot de passe
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center text-slate-400">
        <FaShieldAlt className="w-4 h-4 mr-1.5" />
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-center">
          Protection des données sécurisée
        </span>
      </div>
    </div>
  );
}
