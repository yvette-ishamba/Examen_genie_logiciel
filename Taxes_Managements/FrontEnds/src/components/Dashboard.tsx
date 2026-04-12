import React, { useState, useEffect, useRef } from 'react';
import { 
  Landmark, 
  User, 
  TrendingUp, 
  Users, 
  UserCog, 
  AlertTriangle, 
  ChevronRight, 
  LayoutDashboard, 
  Banknote, 
  Settings,
  Mail,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi, demandeApi } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('TABLEAU');
  
  // États pour le formulaire de création de Vendeur/Agent
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    is_admin: false,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [pendingDemandes, setPendingDemandes] = useState<any[]>([]);
  const previousDemandesCount = useRef<number>(-1);

  const fetchDemandes = async () => {
    try {
      const data = await demandeApi.getPending();
      setPendingDemandes(data);
      
      // Notification si une nouvelle demande arrive après le chargement initial
      if (previousDemandesCount.current !== -1 && data.length > previousDemandesCount.current) {
        alert("Notification : Une nouvelle demande d'accès a été reçue !");
      }
      previousDemandesCount.current = data.length;
    } catch (err) {
      console.error('Erreur lors du chargement des demandes', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDemandes();
    // Rafraîchir toutes les 30 secondes pour les nouvelles demandes
    const interval = setInterval(fetchDemandes, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateDemandeStatus = async (id: number, status: string) => {
    try {
      await demandeApi.updateStatus(id, status);
      fetchDemandes(); // Recharger la liste
    } catch (err) {
      console.error('Erreur lors de la mise à jour', err);
    }
  };

  const chartData = [
    { day: 'LUN', totalHeight: 45, darkHeight: 28 },
    { day: 'MAR', totalHeight: 65, darkHeight: 50 },
    { day: 'MER', totalHeight: 75, darkHeight: 65 },
    { day: 'JEU', totalHeight: 50, darkHeight: 40 },
    { day: 'VEN', totalHeight: 85, darkHeight: 75 },
    { day: 'SAM', totalHeight: 60, darkHeight: 0 },
    { day: 'DIM', totalHeight: 70, darkHeight: 0 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await userApi.create(formData);
      setSuccessMsg('Utilisateur créé avec succès !');
      // Réinitialiser le formulaire
      setFormData({
        full_name: '',
        email: '',
        password: '',
        is_admin: false,
        is_active: true
      });
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-inter pb-24 text-slate-800">
      {/* En-tête (Top Bar) */}
      <div className="flex justify-between items-center px-4 py-4">
         <div className="flex items-center space-x-2">
            <Landmark className="text-[#0047a5] h-6 w-6 stroke-2" />
            <h1 className="text-[#0047a5] font-extrabold text-sm tracking-wide">
              L'Autorité Bienveillante
            </h1>
         </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors"
              title="Déconnexion"
            >
               <LogOut className="h-4 w-4" />
               <span className="text-xs font-bold">Quitter</span>
            </button>
            <div className="bg-[#0f172a] rounded-lg p-1.5 flex items-center justify-center shadow-sm">
               <User className="h-5 w-5 text-[#38bdf8] stroke-2" />
            </div>
          </div>
      </div>

      {activeTab === 'TABLEAU' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Carte Principale Bleue */}
          <div className="px-4 mt-1">
            <div className="bg-[#0047a5] text-white rounded-xl p-5 shadow-md relative overflow-hidden">
               <h2 className="text-[0.65rem] font-bold tracking-widest text-[#93c5fd] uppercase">
                 TOTAL COLLECTÉ AUJOURD'HUI
               </h2>
               <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">45 000</span>
                  <span className="ml-1.5 text-lg font-medium text-blue-200">FCFA</span>
               </div>
               
               <div className="mt-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-bold bg-[#1e3a8a] text-blue-100">
                     +12% par rapport à hier
                  </span>
               </div>
               
               <div className="absolute top-5 right-5 text-[#3b82f6]">
                  <TrendingUp className="h-5 w-5 stroke-2" />
               </div>
            </div>
          </div>

          {/* Cartes Vendeurs et Agents */}
          <div className="px-4 mt-4 flex space-x-4">
             <div className="bg-white p-4 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-50 flex-1">
                <div className="flex items-center mb-2">
                   <Users className="text-[#0047a5] h-5 w-5 stroke-[2.5]" />
                </div>
                <div className="text-[0.6rem] font-bold tracking-widest text-slate-500 uppercase mt-2">
                   VENDEURS ACTIFS
                </div>
                <div className="text-2xl font-extrabold text-[#0047a5] mt-0.5 tracking-tight">
                   128
                </div>
             </div>
             
             <div className="bg-white p-4 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-50 flex-1">
                <div className="flex items-center mb-2">
                   <UserCog className="text-green-700 h-5 w-5 stroke-[2.5]" />
                </div>
                <div className="text-[0.6rem] font-bold tracking-widest text-slate-500 uppercase mt-2">
                   AGENTS TERRAIN
                </div>
                <div className="text-2xl font-extrabold text-green-700 mt-0.5 tracking-tight">
                   14
                </div>
             </div>
          </div>

          {/* Graphique Évolution des recettes */}
          <div className="px-4 mt-6">
             <div className="bg-white p-5 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-50">
                <h3 className="text-[0.95rem] font-bold text-slate-800 mb-6">Évolution des recettes</h3>
                
                <div className="flex justify-between items-end h-28 mt-2 px-1">
                   {chartData.map((data, index) => (
                     <div key={index} className="flex flex-col items-center w-8">
                        <div className="h-28 w-full flex items-end justify-center pb-2">
                           <div 
                             className="w-[90%] bg-[#e2e8f0] rounded-t-[4px] relative overflow-hidden flex items-end"
                             style={{ height: `${data.totalHeight}%` }}
                           >
                             {data.darkHeight > 0 && (
                               <div 
                                 className="w-full bg-[#0047a5] rounded-t-[4px]"
                                 style={{ height: `${(data.darkHeight / data.totalHeight) * 100}%` }}
                               ></div>
                             )}
                           </div>
                        </div>
                        <span className="text-[0.55rem] font-bold text-slate-800 mt-1 uppercase">
                          {data.day}
                        </span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Alertes Prioritaires */}
          <div className="px-4 mt-8">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-[0.95rem] font-bold text-slate-800">Alertes prioritaires</h3>
                <a href="#" className="text-[0.7rem] font-bold text-[#0047a5] hover:underline hover:text-[#003882]">
                   Voir tout
                </a>
             </div>
             
             <div className="space-y-3">
                {/* Dynamique: Demandes d'accès nouveaux utilisateurs */}
                {pendingDemandes.map((demande) => (
                  <div key={demande.id} className="bg-blue-50 rounded-xl p-3.5 border border-blue-100 flex items-center shadow-sm animate-in fade-in">
                    <div className="bg-[#0047a5] p-2.5 rounded-lg flex-shrink-0">
                      <UserCog className="text-white h-5 w-5 stroke-2" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-extrabold text-[#0047a5] tracking-wide mb-0.5">Demande d'accès : {demande.role}</div>
                      <div className="text-[0.7rem] text-blue-700 font-medium">{demande.nom_complet} • {demande.telephone}</div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleUpdateDemandeStatus(demande.id, 'Acceptee')}
                         className="bg-[#0047a5] text-white text-[0.6rem] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#003882] transition-colors"
                       >
                         ACCEPTER
                       </button>
                       <button 
                         onClick={() => handleUpdateDemandeStatus(demande.id, 'Refusee')}
                         className="bg-red-50 text-red-700 border border-red-100 text-[0.6rem] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-100 transition-colors"
                       >
                         REFUSER
                       </button>
                    </div>
                  </div>
                ))}

                <div className="bg-[#fcf3e8] rounded-xl p-3.5 border border-[#eedrcc] flex items-center cursor-pointer shadow-sm animate-in fade-in">
                   <div className="bg-[#9a3412] p-2.5 rounded-lg flex-shrink-0">
                      <AlertTriangle className="text-white h-5 w-5 stroke-2" />
                   </div>
                   <div className="ml-3 flex-1">
                      <div className="text-sm font-extrabold text-[#9a3412] tracking-wide mb-0.5">Vendeurs Impayés</div>
                      <div className="text-[0.7rem] text-[#b45309] font-medium">8 dossiers critiques à traiter</div>
                   </div>
                   <ChevronRight className="text-[#9a3412] h-4 w-4" />
                </div>

                <div className="bg-[#f1f5f9] rounded-xl p-3.5 flex items-center cursor-pointer shadow-sm animate-in fade-in" style={{animationDelay: '100ms'}}>
                   <div className="bg-[#e2e8f0] p-2.5 rounded-lg flex-shrink-0">
                      <AlertTriangle className="text-[#334155] h-5 w-5 stroke-2" />
                   </div>
                   <div className="ml-3 flex-1">
                      <div className="text-sm font-extrabold text-slate-800 tracking-wide mb-0.5">Signalements en attente</div>
                      <div className="text-[0.7rem] text-slate-500 font-medium">3 nouveaux incidents signalés</div>
                   </div>
                   <span className="bg-[#dc2626] text-white text-[0.55rem] font-bold px-2 py-1 rounded-full mr-1 tracking-widest shadow-sm">
                     NOUVEAU
                   </span>
                </div>
             </div>
          </div>

          {/* Dernières Collectes */}
          <div className="px-4 mt-8">
             <h3 className="text-[0.95rem] font-bold text-slate-800 mb-3">Dernières Collectes</h3>
             
             <div className="space-y-3">
                <div className="bg-white p-4 justify-between items-center rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-50 flex">
                   <div>
                     <div className="text-sm font-extrabold text-slate-800 tracking-wide mb-0.5">Mamadou Konaté</div>
                     <div className="text-[0.65rem] text-slate-500 font-medium">Marché Central • Il y a 5 min</div>
                   </div>
                   <div className="text-right flex flex-col justify-end items-end">
                     <div className="text-sm font-extrabold text-green-700 tracking-wide">2 500 FCFA</div>
                     <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[0.6rem] font-bold bg-[#bbf7d0] text-green-800 tracking-widest">
                       PAYÉ
                     </div>
                   </div>
                </div>

                <div className="bg-white p-4 justify-between items-center rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-50 flex">
                   <div>
                     <div className="text-sm font-extrabold text-slate-800 tracking-wide mb-0.5">Safiétou Diallo</div>
                     <div className="text-[0.65rem] text-slate-500 font-medium">Zone Artisanale • Il y a 12 min</div>
                   </div>
                   <div className="text-right flex flex-col justify-end items-end">
                     <div className="text-sm font-extrabold text-green-700 tracking-wide">5 000 FCFA</div>
                     <div className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[0.6rem] font-bold bg-[#bbf7d0] text-green-800 tracking-widest">
                       PAYÉ
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* ONGLET VENDEURS (Formulaire d'ajout) */}
      {activeTab === 'VENDEURS' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 px-4 mt-2">
          <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
            <div className="bg-[#0047a5] h-1.5 w-full"></div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="bg-slate-100 p-2.5 rounded-lg mr-4">
                  <UserPlusIcon className="h-6 w-6 text-[#0047a5]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ajouter un Agent</h2>
                  <p className="text-xs text-slate-500 mt-1">Créez un profil pour un nouveau vendeur ou superviseur.</p>
                </div>
              </div>

              {successMsg && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start text-green-800">
                   <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                   <span className="text-sm font-medium">{successMsg}</span>
                </div>
              )}
              
              {errorMsg && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-800">
                   <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                   <span className="text-sm font-medium">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nom Complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="Ex: Amadou Fall"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm transition-colors focus:bg-white focus:border-[#0047a5] focus:ring-1 focus:ring-[#0047a5] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Adresse E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="agent@marche.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm transition-colors focus:bg-white focus:border-[#0047a5] focus:ring-1 focus:ring-[#0047a5] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 bg-[#f8fafc] border border-slate-200 rounded-lg text-sm transition-colors focus:bg-white focus:border-[#0047a5] focus:ring-1 focus:ring-[#0047a5] outline-none tracking-widest"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center">
                  <input
                    id="is_admin"
                    name="is_admin"
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#0047a5] focus:ring-[#0047a5] border-gray-300 rounded"
                  />
                  <label htmlFor="is_admin" className="ml-2 block text-sm font-medium text-slate-700">
                    Droits d'Administrateur
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-[#0047a5] hover:bg-[#003882] shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Création en cours...' : 'Enregistrer l\'Agent'}
                    {!loading && <Save className="ml-2 h-4 w-4" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AUTRES ONGLETS (Vides pour l'instant) */}
      {(activeTab === 'COLLECTE' || activeTab === 'TAXES' || activeTab === 'SIGNALEMENTS') && (
        <div className="flex flex-col items-center justify-center p-10 h-64 opacity-50">
           <div className="bg-slate-200 p-4 rounded-full mb-4">
              <Settings className="h-8 w-8 text-slate-400" />
           </div>
           <h2 className="text-lg font-bold text-slate-500">Module en construction</h2>
           <p className="text-sm text-slate-400 text-center mt-2">La section {activeTab} sera disponible lors de la prochaine mise à jour.</p>
        </div>
      )}

      {/* Barre de navigation inférieure */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-evenly items-end pt-2 pb-5 px-1 shadow-[0_-10px_15px_rgba(0,0,0,0.02)] z-50">
         <div 
           onClick={() => setActiveTab('TABLEAU')}
           className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl w-[4rem] cursor-pointer transition-all duration-200 ${activeTab === 'TABLEAU' ? 'bg-[#0047a5] text-white shadow-md mb-1' : 'text-slate-400 hover:text-[#0047a5]'}`}
         >
            <LayoutDashboard className={`h-[1.15rem] w-[1.15rem] mb-[0.15rem] ${activeTab === 'TABLEAU' ? 'stroke-2' : 'stroke-[2.5]'}`} />
            <span className="text-[0.55rem] font-bold tracking-wider mt-0.5">TABLEAU</span>
         </div>
         
         <div 
           onClick={() => setActiveTab('COLLECTE')}
           className={`flex flex-col items-center justify-center p-2 w-[4rem] cursor-pointer transition-colors ${activeTab === 'COLLECTE' ? 'text-[#0047a5]' : 'text-slate-400 hover:text-[#0047a5]'}`}
         >
            <Banknote className="h-[1.15rem] w-[1.15rem] mb-[0.15rem] stroke-[2.5]" />
            <span className="text-[0.55rem] font-bold tracking-wider mt-0.5">COLLECTE</span>
         </div>

         <div 
           onClick={() => setActiveTab('VENDEURS')}
           className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl w-[4rem] cursor-pointer transition-all duration-200 ${activeTab === 'VENDEURS' ? 'bg-[#0047a5] text-white shadow-md mb-1' : 'text-slate-400 hover:text-[#0047a5]'}`}
         >
            <Users className={`h-[1.15rem] w-[1.15rem] mb-[0.15rem] ${activeTab === 'VENDEURS' ? 'stroke-2' : 'stroke-[2.5]'}`} />
            <span className="text-[0.55rem] font-bold tracking-wider mt-0.5">VENDEURS</span>
         </div>

         <div 
           onClick={() => setActiveTab('TAXES')}
           className={`flex flex-col items-center justify-center p-2 w-[4rem] cursor-pointer transition-colors ${activeTab === 'TAXES' ? 'text-[#0047a5]' : 'text-slate-400 hover:text-[#0047a5]'}`}
         >
            <Settings className="h-[1.15rem] w-[1.15rem] mb-[0.15rem] stroke-[2.5]" />
            <span className="text-[0.55rem] font-bold tracking-wider mt-0.5">TAXES</span>
         </div>

         <div 
           onClick={() => setActiveTab('SIGNALEMENTS')}
           className={`flex flex-col items-center justify-center p-2 w-[4.5rem] cursor-pointer transition-colors ${activeTab === 'SIGNALEMENTS' ? 'text-[#0047a5]' : 'text-slate-400 hover:text-[#0047a5]'}`}
         >
            <AlertTriangle className="h-[1.15rem] w-[1.15rem] mb-[0.15rem] stroke-[2.5]" />
            <span className="text-[0.5rem] font-bold tracking-widest mt-0.5">SIGNALEMENTS</span>
         </div>
      </div>

    </div>
  );
}

// Composant local pour éviter un import redondant si absent
function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <line x1="19" y1="8" x2="19" y2="14"></line>
      <line x1="22" y1="11" x2="16" y2="11"></line>
    </svg>
  );
}
