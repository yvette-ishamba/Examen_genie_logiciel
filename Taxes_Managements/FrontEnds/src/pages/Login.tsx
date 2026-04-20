import { useState } from 'react';
import { Landmark, User, Lock, Eye, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../ui/loginContext';
import { usersApi } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useLogin();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'info' | 'error', message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(identifier, password);
      console.log('Connexion réussie');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetStatus({ type: 'error', message: 'Veuillez entrer votre adresse email.' });
      return;
    }
    
    setResetLoading(true);
    setResetStatus(null);
    try {
      await usersApi.forgotPassword(resetEmail);
      setResetStatus({ 
        type: 'info', 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception (et vos spams).' 
      });
      // Clear field
      setResetEmail('');
    } catch (err: any) {
      setResetStatus({ type: 'error', message: err.message || 'Une erreur est survenue.' });
    } finally {
      setResetLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-inter flex flex-col relative pb-10 sm:pb-20">
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-gray-100">
            <Landmark className="w-10 h-10 text-[#0047a5]" strokeWidth={2} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0047a5] tracking-wide text-center uppercase">
            Gestion des Taxes
          </h1>
          <p className="text-[0.6rem] sm:text-[0.7rem] text-slate-500 font-medium tracking-[0.15em] uppercase mt-1">
            Système Intégré de Collecte
          </p>
        </div>

        <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden transition-all duration-300">
          <div className="h-1.5 w-full bg-[#0047a5]"></div>
          
          <div className="p-6 sm:p-8 md:p-10">
            {!showResetForm ? (
              <>
                <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-slate-800 mb-1">
                  Authentification
                </h2>
                <p className="text-sm text-slate-500 mb-8">
                  Accédez à votre espace de collecte sécurisé.
                </p>

                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-bold text-slate-700 uppercase tracking-wide">
                      Entrez votre mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="ex: agent_75001"
                        className="block w-full pl-10 pr-3 py-3 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] focus:ring-1 focus:ring-[#0047a5] transition-colors outline-none placeholder-slate-400 font-medium"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Input: Mot de passe */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[0.7rem] font-bold text-slate-700 uppercase tracking-wide">
                        Mot de passe
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowResetForm(true)}
                        className="text-[0.75rem] font-bold text-[#0047a5] hover:underline"
                      >
                        Oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-10 py-3 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] focus:ring-1 focus:ring-[#0047a5] transition-colors outline-none placeholder-slate-400 font-medium tracking-widest"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer hover:bg-slate-200 rounded-r-lg px-1">
                        <Eye className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    {error && <p className="text-red-500 text-xs font-medium mb-3">{error}</p>}
                    <Button
                      type="submit"
                      loading={isLoading}
                      fullWidth
                      rightIcon={!isLoading && <LogIn className="h-4 w-4" />}
                    >
                      Se connecter
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowResetForm(false)}
                  className="flex items-center text-xs font-bold text-slate-500 hover:text-[#0047a5] mb-6 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Retour à la connexion
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
                  Mot de passe oublié
                </h2>
                <p className="text-sm text-slate-500 mb-8">
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>

                <form className="space-y-5" onSubmit={handleForgotPassword}>
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-bold text-slate-700 uppercase tracking-wide">
                      Votre adresse mail
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      className="block w-full px-4 py-3 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] transition-colors outline-none font-medium"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    {resetStatus && (
                      <div className={`p-3 rounded-lg text-xs font-medium mb-3 ${
                        resetStatus.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {resetStatus.message}
                      </div>
                    )}
                    <Button
                      type="submit"
                      loading={resetLoading}
                      fullWidth
                    >
                      Envoyer le lien
                    </Button>
                  </div>
                </form>
              </>
            )}

            <div className="my-7 flex items-center">
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Pas encore de compte agent ?
              </p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/onboarding')}
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Demander un accès
              </Button>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center text-slate-400">
          <ShieldCheck className="w-4 h-4 mr-1.5" />
          <span className="text-[0.65rem] font-bold uppercase tracking-widest">
            Connexion sécurisée AES-256
          </span>
        </div>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-6 mt-10">
        <div className="flex justify-center items-center space-x-10 text-[0.65rem] font-bold text-slate-500 tracking-widest">
          <a href="#" className="hover:text-slate-800 transition-colors">CONDITIONS</a>
          <a href="#" className="hover:text-slate-800 transition-colors">CONFIDENTIALITÉ</a>
          <a href="#" className="hover:text-slate-800 transition-colors">AIDE</a>
        </div>
      </footer>

    </div>
  );
}
