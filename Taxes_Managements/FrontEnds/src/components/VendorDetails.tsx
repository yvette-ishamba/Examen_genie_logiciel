import React from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Download, 
  FileText, 
  LayoutDashboard, 
  Banknote, 
  Users, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VendorDetails() {
  const navigate = useNavigate();

  // Données factices pour Moussa Diop
  const vendor = {
    name: "Moussa Diop",
    fiscalId: "#TAX-882-90",
    status: "À JOUR",
    location: "Marché Central, Allée B, Stand 14",
    totalPaid: "45 000 FCFA",
    lastCollection: "Hier",
    payments: [
      {
        id: 1,
        title: "Taxe Journalière",
        date: "12 Oct 2023 • 09:45",
        amount: "1 500 FCFA",
        type: "tax"
      },
      {
        id: 2,
        title: "Taxe Journalière",
        date: "11 Oct 2023 • 10:12",
        amount: "1 500 FCFA",
        type: "tax"
      },
      {
        id: 3,
        title: "Permis Mensuel",
        date: "05 Oct 2023 • 14:30",
        amount: "12 000 FCFA",
        type: "permit"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-inter pb-24 text-slate-800 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-5 bg-white shadow-sm sticky top-0 z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-[#0047a5] stroke-[2.5]" />
        </button>
        <h1 className="text-xl font-extrabold text-[#0047a5] tracking-tight">Détails Vendeur</h1>
        <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm border border-slate-100">
          <div className="w-full h-full bg-[#0f172a] flex items-center justify-center">
            <Users className="h-6 w-6 text-[#38bdf8]" />
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden">
          <div className="flex gap-5">
             <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-slate-50 flex items-center justify-center">
                <Users className="h-12 w-12 text-slate-400" />
             </div>
             <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="space-y-0.5">
                      <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest">ID FISCAL</span>
                      <div className="text-lg font-black text-[#0047a5] tracking-tight">{vendor.fiscalId}</div>
                   </div>
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="text-[0.65rem] font-black tracking-widest uppercase">{vendor.status}</span>
                   </div>
                </div>
                <div className="mt-2">
                   <h2 className="text-2xl font-black text-slate-900 leading-none">{vendor.name}</h2>
                   <div className="flex items-center gap-1.5 mt-2 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-[#0047a5]" />
                      <span className="text-xs font-semibold">{vendor.location}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">TOTAL PAYÉ</span>
              <div className="text-xl font-black text-[#0047a5] tracking-tight">{vendor.totalPaid}</div>
           </div>
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
              <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">DERNIÈRE COLLECTE</span>
              <div className="text-xl font-black text-green-600 tracking-tight">{vendor.lastCollection}</div>
           </div>
        </div>

        {/* Payment History */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
             <h3 className="text-lg font-black text-slate-900 tracking-tight">Historique des Paiements</h3>
             <button onClick={() => alert("Voir tout l'historique")} className="text-[0.7rem] font-black text-[#0047a5] uppercase tracking-widest hover:underline">Voir Tout</button>
          </div>

          <div className="space-y-4">
             {vendor.payments.map((payment) => (
               <div key={payment.id} className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-l-green-500 border border-slate-50 flex items-center gap-4 group hover:border-[#1e3a8a33] transition-all">
                  <div className={`p-3 rounded-xl ${payment.type === 'tax' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                     {payment.type === 'tax' ? <Banknote className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-extrabold text-slate-900 truncate">{payment.title}</h4>
                        <div className="text-lg font-black text-slate-900 shrink-0">{payment.amount}</div>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">{payment.date}</span>
                        <button 
                          onClick={() => alert(`Téléchargement du reçu pour : ${payment.title}`)} 
                          className="flex items-center gap-1 text-[0.65rem] font-black text-[#0047a5] uppercase tracking-widest hover:text-blue-700"
                        >
                           <Download className="h-3 w-3" />
                           REÇU
                        </button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Global Action Button */}
        <div className="pt-4">
           <button onClick={() => alert("Génération du reçu global en PDF")} className="w-full bg-[#0047a5] hover:bg-[#003882] text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all group">
              <div className="bg-white/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                 <FileDown className="h-6 w-6" />
              </div>
              <span className="text-md font-black tracking-widest uppercase">GÉNÉRER UN REÇU GLOBAL PDF</span>
           </button>
           <p className="text-center text-[0.65rem] font-bold text-slate-400 mt-6 tracking-widest uppercase opacity-70">
              L’AUTORITÉ BIENVEILLANTE • SYSTÈME CERTIFIÉ
           </p>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-evenly items-end pt-2 pb-6 px-1 shadow-[0_-15px_30px_rgba(0,0,0,0.03)] z-50">
         <div onClick={() => navigate('/dashboard')} className="flex flex-col items-center justify-center p-2 w-[4.5rem] cursor-pointer text-slate-300 hover:text-[#0047a5] transition-colors">
            <LayoutDashboard className="h-6 w-6 mb-1 stroke-[2.5]" />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">TABLEAU</span>
         </div>
         <div onClick={() => alert("Aller à la page Collecte")} className="flex flex-col items-center justify-center p-2 w-[4.5rem] cursor-pointer text-slate-300 hover:text-[#0047a5] transition-colors">
            <Banknote className="h-6 w-6 mb-1 stroke-[2.5]" />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">COLLECTE</span>
         </div>
         <div className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl w-[5rem] bg-[#0047a5] text-white shadow-xl shadow-blue-900/20 mb-1 transition-all">
            <Users className="h-6 w-6 mb-1 stroke-2" />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">VENDEURS</span>
         </div>
         <div onClick={() => alert("Aller à la page Taxes")} className="flex flex-col items-center justify-center p-2 w-[4.5rem] cursor-pointer text-slate-300 hover:text-[#0047a5] transition-colors">
            <Settings className="h-6 w-6 mb-1 stroke-[2.5]" />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">TAXES</span>
         </div>
         <div onClick={() => alert("Aller à la page Signalements")} className="flex flex-col items-center justify-center p-2 w-[5rem] cursor-pointer text-slate-300 hover:text-[#0047a5] transition-colors">
            <AlertTriangle className="h-6 w-6 mb-1 stroke-[2.5]" />
            <span className="text-[0.5rem] font-black tracking-widest uppercase">SIGNALEMENTS</span>
         </div>
      </nav>
    </div>
  );
}
