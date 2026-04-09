import { useState } from 'react';
import { Landmark, User, Lock, Eye, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(identifier, password);
      // Typically save token to localStorage or context
      localStorage.setItem('token', response.access_token);
      console.log('Connexion réussie', response);
      navigate('/onboarding');
      // navigate('/dashboard'); // À décommenter quand vous aurez une route dashboard
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#f9fafb] font-inter flex flex-col relative pb-20">
      <div className="flex-1 flex flex-col items-center pt-16 px-4">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-gray-100">
            <Landmark className="w-10 h-10 text-[#0047a5]" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-[#0047a5] tracking-wide">
            RÉPUBLIQUE MARCHÉ
          </h1>
          <p className="text-[0.7rem] text-slate-500 font-medium tracking-[0.15em] uppercase mt-1">
            L'autorité bienveillante
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-[400px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 overflow-hidden">
          <div className="h-1.5 w-full bg-[#0047a5]"></div>
          
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-1">
              Authentification
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              Accédez à votre espace de collecte sécurisé.
            </p>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Input: Identifiant ou E-mail */}
              <div className="space-y-1.5">
                <label className="block text-[0.7rem] font-bold text-slate-700 uppercase tracking-wide">
                  Identifiant ou E-mail
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
                  <a href="#" className="text-[0.75rem] font-bold text-[#0047a5] hover:underline">
                    Oublié ?
                  </a>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#0047a5] hover:bg-[#003882] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                  {!loading && <LogIn className="ml-2 h-4 w-4" />}
                </button>
              </div>
            </form>

            <div className="my-7 flex items-center">
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Pas encore de compte agent ?
              </p>
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-[#0047a5] bg-[#f8fafc] hover:bg-slate-100 transition-colors"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Demander un accès
              </button>
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
