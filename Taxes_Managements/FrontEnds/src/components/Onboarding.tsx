import React, { useState } from 'react';
import { Landmark, HelpCircle, Store, BadgeCheck, Circle, CheckCircle2, MapPin, ChevronRight, Camera, IdCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { demandeApi } from '../services/api';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Vendeur');
  const [nomComplet, setNomComplet] = useState('');
  const [indicatif, setIndicatif] = useState('+243');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = async () => {
    console.log('Bouton Suivant cliqué. Étape actuelle:', step);
    if (step === 1) {
      console.log('Passage à l\'étape 2');
      setStep(2);
      setErrorMsg('');
      window.scrollTo(0, 0);
      return;
    }

    if (step === 2) {
      if (!nomComplet || !telephone || !email || !password) {
        setErrorMsg('Veuillez remplir tous les champs (Nom, Téléphone, Email et Mot de passe)');
        return;
      }
      
      setLoading(true);
      setErrorMsg('');
      
      try {
        await demandeApi.create({
          nom_complet: nomComplet,
          telephone: `${indicatif}${telephone}`,
          role: role,
          email: email,
          password: password
        });
        setStep(3);
        window.scrollTo(0, 0);
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      } catch (err: any) {
        console.error('Erreur lors de la création de la demande:', err);
        setErrorMsg(err.message || 'Erreur lors de la demande');
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 3) {
      setStep(step - 1);
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-inter pb-32">
      
      {/* Top Header */}
      <header className="bg-[#f9fafb] pt-6 pb-4 px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Landmark className="w-6 h-6 text-[#0047a5]" strokeWidth={2.5} />
          <span className="font-bold text-lg text-[#0047a5]">L'Autorité Bienveillante</span>
        </div>
        <HelpCircle className="w-5 h-5 text-slate-500" />
      </header>

      {/* Stepper */}
      <div className="px-6 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between relative">
           {/* Connecting lines */}
           <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>
           <div className="absolute top-4 left-0 h-[2px] bg-[#0047a5] -z-10 transition-all duration-300" style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }}></div>
           
           {/* Step 1 */}
           <div 
             className="flex flex-col items-center bg-[#f9fafb] px-2 cursor-pointer"
             onClick={() => setStep(1)}
           >
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${step >= 1 ? 'bg-[#0047a5] text-white' : 'bg-slate-200 text-slate-500'}`}>
               {step > 1 ? <CheckCircle2 className="w-5 h-5 text-white" /> : '1'}
             </div>
             <span className={`text-[0.6rem] font-bold mt-2 uppercase tracking-wide ${step >= 1 ? 'text-[#0047a5]' : 'text-slate-400'}`}>Rôle</span>
           </div>

           {/* Step 2 */}
           <div 
             className="flex flex-col items-center bg-[#f9fafb] px-2 cursor-pointer"
             onClick={() => { if(step > 1) setStep(2); }}
           >
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 2 ? 'bg-[#0047a5] text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
               {step > 2 ? <CheckCircle2 className="w-5 h-5 text-white" /> : '2'}
             </div>
             <span className={`text-[0.6rem] font-bold mt-2 uppercase tracking-wide ${step >= 2 ? 'text-[#0047a5]' : 'text-slate-400'}`}>Profil</span>
           </div>

           {/* Step 3 */}
           <div 
             className="flex flex-col items-center bg-[#f9fafb] px-2 cursor-pointer"
           >
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= 3 ? 'bg-[#0047a5] text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
               3
             </div>
             <span className={`text-[0.6rem] font-bold mt-2 uppercase tracking-wide ${step >= 3 ? 'text-[#0047a5]' : 'text-slate-400'}`}>Validation</span>
           </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 space-y-8">
        
        {step === 1 && (
          <>
            {/* Section: Bienvenue */}
        <section>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Bienvenue parmi nous</h1>
          <p className="text-sm text-slate-600 mb-5 leading-relaxed">
            Pour commencer, veuillez sélectionner le profil qui correspond à votre activité sur le marché.
          </p>

          <div className="space-y-3">
            {/* Option 1: Vendeur */}
            <div 
              onClick={() => setRole('Vendeur')}
              className={`rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${role === 'Vendeur' ? 'border-2 border-[#0047a5] bg-blue-50/30 shadow-sm' : 'border border-slate-200 bg-white hover:border-[#0047a5]'}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${role === 'Vendeur' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Store className={`w-6 h-6 ${role === 'Vendeur' ? 'text-[#0047a5]' : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${role === 'Vendeur' ? 'text-[#0047a5]' : 'text-slate-800'}`}>Vendeur</h3>
                <p className={`text-xs mt-0.5 ${role === 'Vendeur' ? 'text-slate-600' : 'text-slate-500'}`}>Commerçant, artisan ou producteur local.</p>
              </div>
              {role === 'Vendeur' ? <CheckCircle2 className="w-5 h-5 text-[#0047a5]" /> : <Circle className="w-5 h-5 text-slate-300" />}
            </div>

            {/* Option 2: Agent de Collecte */}
            <div 
              onClick={() => setRole('Agent de Collecte')}
              className={`rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${role === 'Agent de Collecte' ? 'border-2 border-[#0047a5] bg-blue-50/30 shadow-sm' : 'border border-slate-200 bg-white hover:border-[#0047a5]'}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${role === 'Agent de Collecte' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <BadgeCheck className={`w-6 h-6 ${role === 'Agent de Collecte' ? 'text-[#0047a5]' : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${role === 'Agent de Collecte' ? 'text-[#0047a5]' : 'text-slate-800'}`}>Agent de Collecte</h3>
                <p className={`text-xs mt-0.5 ${role === 'Agent de Collecte' ? 'text-slate-600' : 'text-slate-500'}`}>Personnel autorisé pour la perception des taxes.</p>
              </div>
              {role === 'Agent de Collecte' ? <CheckCircle2 className="w-5 h-5 text-[#0047a5]" /> : <Circle className="w-5 h-5 text-slate-300" />}
            </div>

            {/* Option 3: Autorité Locale */}
            <div 
              onClick={() => setRole('Autorité Locale')}
              className={`rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors ${role === 'Autorité Locale' ? 'border-2 border-[#0047a5] bg-blue-50/30 shadow-sm' : 'border border-slate-200 bg-white hover:border-[#0047a5]'}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${role === 'Autorité Locale' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Landmark className={`w-6 h-6 ${role === 'Autorité Locale' ? 'text-[#0047a5]' : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${role === 'Autorité Locale' ? 'text-[#0047a5]' : 'text-slate-800'}`}>Autorité Locale</h3>
                <p className={`text-xs mt-0.5 ${role === 'Autorité Locale' ? 'text-slate-600' : 'text-slate-500'}`}>Administration et supervision du marché.</p>
              </div>
              {role === 'Autorité Locale' ? <CheckCircle2 className="w-5 h-5 text-[#0047a5]" /> : <Circle className="w-5 h-5 text-slate-300" />}
            </div>
          </div>
        </section>

        {/* Banner Image */}
        <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm">
          <img src="/market.png" alt="Market banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-white text-xs font-medium leading-snug">
              Sécurisez votre activité et simplifiez vos échanges avec l'administration locale.
            </p>
          </div>
        </div>

          </>
        )}

        {step === 2 && (
          <>
            {/* Section: Informations Personnelles */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Informations Personnelles</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Complétez votre profil pour obtenir votre Badge de Confiance.
          </p>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            {/* Input: Nom Complet */}
            <div className="space-y-1.5">
              <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">
                Nom Complet
              </label>
              <input
                type="text"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="Ex: Jean Dupont"
                className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
              />
            </div>

            {/* Input: Numéro de téléphone */}
            <div className="space-y-1.5">
              <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">
                Numéro de téléphone
              </label>
              <div className="flex gap-2">
                <select
                  className="w-24 bg-[#f1f5f9] rounded-lg px-2 flex items-center justify-center font-bold text-slate-800 text-sm border border-transparent focus:bg-white focus:border-[#0047a5] focus:ring-1 focus:ring-[#0047a5] outline-none cursor-pointer"
                  value={indicatif}
                  onChange={(e) => setIndicatif(e.target.value)}
                >
                  <option value="+243">🇨🇩 +243</option>
                  <option value="+225">🇨🇮 +225</option>
                  <option value="+221">🇸🇳 +221</option>
                  <option value="+237">🇨🇲 +237</option>
                  <option value="+33">🇫🇷 +33</option>
                </select>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="00 00 00 00"
                  className="flex-1 block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium tracking-wider"
                />
              </div>
            </div>

            {/* Input: Email */}
            <div className="space-y-1.5">
              <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">
                Adresse E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
              />
            </div>

            {/* Input: Mot de passe */}
            <div className="space-y-1.5">
              <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">
                Mot de passe personnalisé
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium tracking-widest"
              />
            </div>

            {/* Location button */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">
                Localisation du stand
              </label>
              <button type="button" className="w-full border border-dashed border-slate-300 rounded-lg p-3.5 flex items-center justify-between text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium">Détecter ma position</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

             {/* Documents upload */}
             <div className="bg-[#f9fafb] -mx-4 px-4 py-6 mt-6 border-t border-slate-100">
               <div className="flex items-center gap-2 mb-4">
                 <IdCard className="w-5 h-5 text-[#0047a5]" />
                 <h3 className="font-bold text-slate-800 text-sm">Pièce d'identité (CNI / Passeport)</h3>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <button type="button" className="flex flex-col items-center justify-center gap-2 bg-white border border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors h-32">
                   <Camera className="w-7 h-7 text-slate-400" />
                   <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mt-1">Recto</span>
                 </button>
                 <button type="button" className="flex flex-col items-center justify-center gap-2 bg-white border border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors h-32">
                   <Camera className="w-7 h-7 text-slate-400" />
                   <span className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mt-1">Verso</span>
                 </button>
               </div>
             </div>

           </form>
          </section>
        </>
        )}

        {step === 3 && (
          <section className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Demande envoyée !</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Bravo ! Votre demande d'accès a été envoyée avec succès à l'administrateur. Rapprochez-vous de lui pour obtenir vos identifiants temporaires.
            </p>
            <p className="text-xs text-slate-400">Redirection automatique vers la connexion...</p>
          </section>
        )}

      </main>

      {/* Sticky Bottom Footer */}
      {step < 3 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 pb-6 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] z-20">
          <div className="max-w-md mx-auto space-y-3">
            {errorMsg && <p className="text-red-500 text-sm font-bold text-center mb-2">{errorMsg}</p>}
            <div className="flex gap-3">
              {step > 1 && (
                <button type="button" onClick={handleBack} className="flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-[0.98]">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <button type="button" onClick={handleNext} disabled={loading} className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0047a5] hover:bg-[#003882] shadow-md transition-colors active:scale-[0.98] disabled:opacity-70">
                {loading ? 'Envoi en cours...' : (step === 1 ? 'Suivant' : 'Terminer')}
                {!loading && step === 1 && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </div>
            
            <p className="text-center text-[0.75rem] text-slate-500 pt-1">
              Déjà inscrit ? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="font-bold text-[#0047a5] hover:underline">Se connecter</a>
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
