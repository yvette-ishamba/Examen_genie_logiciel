import { useState } from 'react';
import { FaLandmark, FaStore, FaCertificate, FaRegCircle, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setStep, setRole, updatePersonalInfo, submitOnboardingProfile, type RoleType } from '../store/slices/onboardingSlice';
import { usersApi } from '../services/api';
import Button from '../components/Button';

export default function Onboarding() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role, fullName, phoneNumber, email, password, identifiantNational, emplacement, currentStep, submitting, submitError } = useAppSelector((state) => state.onboarding);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: RoleType) => {
    dispatch(setRole(selectedRole));
    setValidationError(null);
  };

  const handleNextStep = async () => {
    setValidationError(null);
    
    if (currentStep === 1) {
      if (!role) {
        setValidationError("Veuillez sélectionner un rôle.");
        return;
      }
      dispatch(setStep(2));
    } else if (currentStep === 2) {
      // Validate all fields except identifiantNational
      if (!email || !password || !fullName || !phoneNumber) {
        setValidationError("Tous les champs sont requis.");
        return;
      }
      
      if (role === 'Vendeur' && !emplacement) {
        setValidationError("L'emplacement est requis pour les vendeurs.");
        return;
      }

      try {
        // Check if email exists
        const { exists } = await usersApi.checkEmail(email);
        if (exists) {
          setValidationError("Cet email est déjà utilisé.");
          return;
        }
        dispatch(setStep(3));
      } catch (err) {
        setValidationError("Erreur lors de la vérification de l'email.");
      }
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    dispatch(setStep(currentStep - 1));
  };

  const handleSubmit = async () => {
    try {
      const resultAction = await dispatch(submitOnboardingProfile());
      if (submitOnboardingProfile.fulfilled.match(resultAction)) {
        navigate('/validation-pending'); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-0 sm:p-5 min-h-screen bg-slate-100/50 flex items-center justify-center'>
      
      <div className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto bg-[#f9fafb] font-inter shadow-2xl sm:rounded-2xl overflow-hidden">

      {/* Stepper */}
      <div className="px-6 py-6 max-w-md sm:max-w-lg md:max-w-xl xl:max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto transition-all duration-300">
        <div className="flex items-center justify-between relative">
           {/* Connecting lines */}
           <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>
           <div className="absolute top-4 left-0 w-[15%] h-[2px] bg-[#0047a5] -z-10"></div>
           
            {/* Step 1 */}
           <div className="flex flex-col items-center bg-[#f9fafb] px-2">
             <div className={`w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-[#0047a5] text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>1</div>
             <span className={`text-[0.6rem] font-bold ${currentStep >= 1 ? 'text-[#0047a5]' : 'text-slate-400'} mt-2 uppercase tracking-wide`}>Rôle</span>
           </div>

           {/* Step 2 */}
           <div className="flex flex-col items-center bg-[#f9fafb] px-2">
             <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-[#0047a5] text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>2</div>
             <span className={`text-[0.6rem] font-bold ${currentStep >= 2 ? 'text-[#0047a5]' : 'text-slate-400'} mt-2 uppercase tracking-wide`}>Profil</span>
           </div>

           {/* Step 3 */}
           <div className="flex flex-col items-center bg-[#f9fafb] px-2">
             <div className={`w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-[#0047a5] text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>3</div>
             <span className={`text-[0.6rem] font-bold ${currentStep >= 3 ? 'text-[#0047a5]' : 'text-slate-400'} mt-2 uppercase tracking-wide`}>Validation</span>
           </div>
        </div>
      </div>

      <main className="w-full px-4 sm:px-6 md:px-8 space-y-6 sm:space-y-8 transition-all duration-300 min-h-[300px] sm:min-h-[400px]">
        
        {/* Step 1: Role Selection */}
        {currentStep === 1 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-slate-200 rounded-xl p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Choisissez votre rôle</h2>
          <div className="grid grid-cols-1 gap-5">
            {/* Option 1: Vendeur */}
            <div 
              onClick={() => handleRoleSelect('Vendeur')}
              className={`border-2 ${role === 'Vendeur' ? 'border-[#0047a5] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-[#0047a5]'} rounded-xl p-4 flex items-center gap-4 cursor-pointer shadow-sm transition-colors`}
            >
              <div className={`w-12 h-12 rounded-lg ${role === 'Vendeur' ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                <FaStore className={`w-6 h-6 ${role === 'Vendeur' ? 'text-[#0047a5]' : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${role === 'Vendeur' ? 'text-[#0047a5]' : 'text-slate-800'} text-sm`}>Vendeur</h3>
                <p className="text-xs text-slate-600 mt-0.5">Commerçant, artisan ou producteur local.</p>
              </div>
              {role === 'Vendeur' ? <FaCheckCircle className="w-5 h-5 text-[#0047a5]" /> : <FaRegCircle className="w-5 h-5 text-slate-300" />}
            </div>

            {/* Option 2: Agent de Collecte */}
            <div 
              onClick={() => handleRoleSelect('Agent de Collecte')}
              className={`border-2 ${role === 'Agent de Collecte' ? 'border-[#0047a5] bg-blue-50/30' : 'border-transparent border-slate-200 bg-white hover:border-[#0047a5]'} rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors`}
            >
              <div className={`w-12 h-12 rounded-lg ${role === 'Agent de Collecte' ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                <FaCertificate className={`w-6 h-6 ${role === 'Agent de Collecte' ? 'text-[#0047a5]' : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${role === 'Agent de Collecte' ? 'text-[#0047a5]' : 'text-slate-800'} text-sm`}>Agent de Collecte</h3>
                <p className="text-xs text-slate-500 mt-0.5">Personnel autorisé pour la perception des taxes.</p>
              </div>
              {role === 'Agent de Collecte' ? <FaCheckCircle className="w-5 h-5 text-[#0047a5]" /> : <FaRegCircle className="w-5 h-5 text-slate-300" />}
            </div>

            {/* Option 3: Autorité Locale */}
            <div 
              onClick={() => handleRoleSelect('Autorité Locale')}
              className={`border-2 ${role === 'Autorité Locale' ? 'border-[#0047a5] bg-blue-50/30' : 'border-transparent border-slate-200 bg-white hover:border-[#0047a5]'} rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors`}
            >
              <div className={`w-12 h-12 rounded-lg ${role === 'Autorité Locale' ? 'bg-blue-100' : 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                <FaLandmark className={`w-6 h-6 ${role === 'Autorité Locale' ? 'text-[#0047a5]' : 'text-slate-700'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${role === 'Autorité Locale' ? 'text-[#0047a5]' : 'text-slate-800'} text-sm`}>Autorité Locale</h3>
                <p className="text-xs text-slate-500 mt-0.5">Administration et supervision du marché.</p>
              </div>
              {role === 'Autorité Locale' ? <FaCheckCircle className="w-5 h-5 text-[#0047a5]" /> : <FaRegCircle className="w-5 h-5 text-slate-300" />}
            </div>
          </div>
        </section>
        )}

        {/* Step 2: Personal & Account Info */}
        {currentStep === 2 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-slate-200 rounded-xl p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Détails de votre profil</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
                  value={email}
                  onChange={(e) => dispatch(updatePersonalInfo({ email: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
                  value={password}
                  onChange={(e) => dispatch(updatePersonalInfo({ password: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">Nom Complet</label>
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
                  value={fullName}
                  onChange={(e) => dispatch(updatePersonalInfo({ fullName: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">Numéro de téléphone</label>
                <div className="flex gap-2">
                  <div className="w-20 bg-[#f1f5f9] rounded-lg flex items-center justify-center font-bold text-slate-800 text-sm border border-transparent">+243</div>
                  <input
                    type="tel"
                    placeholder="00 00 00 00"
                    className="flex-1 block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium tracking-wider"
                    value={phoneNumber}
                    onChange={(e) => dispatch(updatePersonalInfo({ phoneNumber: e.target.value }))}
                  />
                </div>
              </div>

              {role === 'Vendeur' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">Identifiant National</label>
                    <input
                      type="text"
                      placeholder="Identifiant fiscal ou national"
                      className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
                      value={identifiantNational}
                      onChange={(e) => dispatch(updatePersonalInfo({ identifiantNational: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">Emplacement</label>
                    <input
                      type="text"
                      placeholder="Ex: Stand A15, Marché Central"
                      className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium"
                      value={emplacement}
                      onChange={(e) => dispatch(updatePersonalInfo({ emplacement: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </section>
        )}

        {/* Step 3: Validation / Summary */}
        {currentStep === 3 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-slate-200 rounded-xl p-4">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Récapitulatif de votre inscription</h2>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between border-bottom pb-2">
              <span className="text-slate-500 text-sm">Rôle</span>
              <span className="text-slate-800 font-bold">{role}</span>
            </div>
            <div className="flex justify-between border-bottom pb-2">
              <span className="text-slate-500 text-sm">Nom</span>
              <span className="text-slate-800 font-bold">{fullName}</span>
            </div>
            <div className="flex justify-between border-bottom pb-2">
              <span className="text-slate-500 text-sm">Email</span>
              <span className="text-slate-800 font-bold">{email}</span>
            </div>
            <div className="flex justify-between border-bottom pb-2">
              <span className="text-slate-500 text-sm">Téléphone</span>
              <span className="text-slate-800 font-bold">+243 {phoneNumber}</span>
            </div>
          </div>
        </section>
        )}

      </main>

      {/* Sticky Bottom Footer */}
      <div className="w-full p-4 pb-6 z-20">
        <div className="mx-auto space-y-3 transition-all duration-300 flex justify-center flex-col items-center">
          {(submitError || validationError) && (
            <p className="text-red-500 text-xs font-bold text-center mb-2">
              {submitError || validationError}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
            {currentStep > 1 && (
              <Button 
                variant="secondary"
                onClick={handlePrevStep}
                className="w-full sm:w-[120px]"
              >
                Retour
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNextStep}
                className="w-full sm:w-[160px]"
                rightIcon={<FaArrowRight className="h-4 w-4" />}
              >
                Suivant
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                loading={submitting}
                className="w-full sm:w-[240px]"
                rightIcon={!submitting && <FaArrowRight className="h-4 w-4" />}
              >
                Confirmer et S'inscrire
              </Button>
            )}
          </div>
          
          <p className="text-center text-[0.75rem] text-slate-500 pt-1">
            Déjà inscrit ? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="font-bold text-[#0047a5] hover:underline">Se connecter</a>
          </p>
        </div>
      </div>

    </div>
    </div>
    
  );
}
