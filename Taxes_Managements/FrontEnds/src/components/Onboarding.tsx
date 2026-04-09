import { Landmark, HelpCircle, Store, BadgeCheck, Circle, CheckCircle2, MapPin, ChevronRight, Camera, IdCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
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
           <div className="absolute top-4 left-0 w-[15%] h-[2px] bg-[#0047a5] -z-10"></div>
           
           {/* Step 1 */}
           <div className="flex flex-col items-center bg-[#f9fafb] px-2">
             <div className="w-8 h-8 rounded-full bg-[#0047a5] text-white flex items-center justify-center text-sm font-bold shadow-sm">1</div>
             <span className="text-[0.6rem] font-bold text-[#0047a5] mt-2 uppercase tracking-wide">Rôle</span>
           </div>

           {/* Step 2 */}
           <div className="flex flex-col items-center bg-[#f9fafb] px-2">
             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">2</div>
             <span className="text-[0.6rem] font-bold text-slate-400 mt-2 uppercase tracking-wide">Profil</span>
           </div>

           {/* Step 3 */}
           <div className="flex flex-col items-center bg-[#f9fafb] px-2">
             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">3</div>
             <span className="text-[0.6rem] font-bold text-slate-400 mt-2 uppercase tracking-wide">Validation</span>
           </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 space-y-8">
        
        {/* Section: Bienvenue */}
        <section>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Bienvenue parmi nous</h1>
          <p className="text-sm text-slate-600 mb-5 leading-relaxed">
            Pour commencer, veuillez sélectionner le profil qui correspond à votre activité sur le marché.
          </p>

          <div className="space-y-3">
            {/* Option 1: Vendeur (Selected) */}
            <div className="border-2 border-[#0047a5] bg-blue-50/30 rounded-xl p-4 flex items-center gap-4 cursor-pointer shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6 text-[#0047a5]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0047a5] text-sm">Vendeur</h3>
                <p className="text-xs text-slate-600 mt-0.5">Commerçant, artisan ou producteur local.</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#0047a5]" />
            </div>

            {/* Option 2: Agent de Collecte */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#0047a5] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-6 h-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm">Agent de Collecte</h3>
                <p className="text-xs text-slate-500 mt-0.5">Personnel autorisé pour la perception des taxes.</p>
              </div>
              <Circle className="w-5 h-5 text-slate-300" />
            </div>

            {/* Option 3: Autorité Locale */}
            <div className="border border-slate-200 bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#0047a5] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Landmark className="w-6 h-6 text-slate-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm">Autorité Locale</h3>
                <p className="text-xs text-slate-500 mt-0.5">Administration et supervision du marché.</p>
              </div>
              <Circle className="w-5 h-5 text-slate-300" />
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

        {/* Section: Informations Personnelles */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Informations Personnelles</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Complétez votre profil pour obtenir votre Badge de Confiance.
          </p>

          <form className="space-y-5">
            {/* Input: Nom Complet */}
            <div className="space-y-1.5">
              <label className="block text-[0.7rem] font-bold text-[#0047a5] uppercase tracking-wide">
                Nom Complet
              </label>
              <input
                type="text"
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
                <div className="w-20 bg-[#f1f5f9] rounded-lg flex items-center justify-center font-bold text-slate-800 text-sm border border-transparent">
                  +225
                </div>
                <input
                  type="tel"
                  placeholder="00 00 00 00"
                  className="flex-1 block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0047a5] outline-none placeholder-slate-400 font-medium tracking-wider"
                />
              </div>
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

      </main>

      {/* Sticky Bottom Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 pb-6 shadow-[0_-4px_20px_rgb(0,0,0,0.05)] z-20">
        <div className="max-w-md mx-auto space-y-3">
          <button type="button" className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0047a5] hover:bg-[#003882] shadow-md transition-colors active:scale-[0.98]">
            Suivant
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          
          <p className="text-center text-[0.75rem] text-slate-500 pt-1">
            Déjà inscrit ? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="font-bold text-[#0047a5] hover:underline">Se connecter</a>
          </p>
        </div>
      </div>

    </div>
  );
}
