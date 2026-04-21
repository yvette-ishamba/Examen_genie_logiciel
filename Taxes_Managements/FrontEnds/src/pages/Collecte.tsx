import { useState, useEffect, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useLogin } from '../ui/loginContext';
import { type TaxeOut } from '../services/taxe_api';
import { vendeurApi, type VendeurViewOut } from '../services/vendeur_api';
import { paiementApi } from '../services/paiement_api';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCollecteData, setLoading as setCollecteLoading, setError as setCollecteError } from '../store/slices/collecteAdminSlice';
import Button from '../components/Button';

// ─── Payment Result Modal ─────────────────────────────────────────────────────

type ModalKind = 'success' | 'error';

function PaymentResultModal({
  kind,
  message,
  onClose,
}: {
  kind: ModalKind;
  message: string;
  onClose: () => void;
}) {
  const isSuccess = kind === 'success';
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-w-sm w-full bg-surface-container-lowest rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <span
            className={`material-symbols-outlined text-5xl ${
              isSuccess ? 'text-green-600' : 'text-red-500'
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isSuccess ? 'check_circle' : 'cancel'}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`text-xl font-black tracking-tight text-center ${
            isSuccess ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {isSuccess ? 'Paiement réussi' : 'Paiement échoué'}
        </h3>

        {/* Message */}
        <p className="text-sm text-center text-on-surface-variant font-medium leading-relaxed">
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`mt-1 w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all active:scale-95 ${
            isSuccess
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200'
              : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200'
          }`}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

// ─── Admin / Autorité Locale View ────────────────────────────────────────────

function CollecteAdminView() {
  const dispatch = useAppDispatch();
  const { listData, agents, isLoading, error } = useAppSelector((s) => s.collecteAdmin);
  const [currentPage, setCurrentPage] = useState(listData?.page || 1);

  const loadPage = useCallback(async (page: number) => {
    dispatch(setCollecteLoading(true));
    try {
      const [list, agentList] = await Promise.all([
        paiementApi.getList(page),
        paiementApi.getByAgent(),
      ]);
      dispatch(setCollecteData({ list, agents: agentList }));
      setCurrentPage(page);
    } catch (err: any) {
      dispatch(setCollecteError(err.message || 'Erreur de chargement'));
    }
  }, [dispatch]);

  const totalPages = listData?.pages || 1;
  const totalRecords = listData?.total || 0;

  // Color palette for agent ranking medals
  const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];

  if (isLoading && !listData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-error font-bold">{error}</div>;
  }

  return (
    <div className="px-4 pt-6 space-y-6 animate-in fade-in duration-700 pb-24">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-on-surface tracking-tight">Journal des Collectes</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            {totalRecords} collectes enregistrées · triées par agent le plus actif
          </p>
        </div>
        <div className="bg-primary/10 text-primary text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
          Vue Admin
        </div>
      </div>

      {/* Agent Leaderboard */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] px-1">
          Classement des Agents
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {agents.map((agent, idx) => (
            <div
              key={agent.agent_id}
              className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-surface-container flex items-center justify-center">
                {idx < 3 ? (
                  <span className={`material-symbols-outlined text-lg ${medalColors[idx]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {idx === 0 ? 'workspace_premium' : 'military_tech'}
                  </span>
                ) : (
                  <span className="text-sm font-black text-on-surface-variant">{idx + 1}</span>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-on-surface text-sm truncate">{agent.agent_name}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">
                  {agent.nb_collectes} collecte{agent.nb_collectes !== 1 ? 's' : ''}
                </p>
              </div>
              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-primary">
                  {agent.total_collected.toLocaleString('fr-FR')}
                </p>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">FCFA</p>
              </div>
            </div>
          ))}
          {agents.length === 0 && (
            <p className="text-sm text-on-surface-variant col-span-full text-center py-4">Aucun agent actif</p>
          )}
        </div>
      </section>

      {/* Collecte List Table */}
      <section className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
            Détail des Collectes
          </h3>
          <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
            Page {currentPage} / {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-outline-variant/10 shadow-sm bg-surface-container-lowest">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-surface-container text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">
              <tr>
                <th className="px-5 py-3">Vendeur</th>
                <th className="px-5 py-3">Taxe & Montant</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center animate-pulse">
                    <span className="text-xs font-bold text-on-surface-variant">Chargement...</span>
                  </td>
                </tr>
              ) : listData?.items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <span className="text-xs font-bold text-on-surface-variant">Aucune collecte trouvée</span>
                  </td>
                </tr>
              ) : (
                listData?.items.map((item) => {
                  const date = new Date(item.date_paiement);
                  const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
                  const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={item.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-on-surface">{item.vendeur_name}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono">{item.reference}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[10px] font-black text-primary/80 uppercase">{item.taxe_name}</p>
                        <p className="text-sm font-black text-on-surface">{item.montant.toLocaleString('fr-FR')} <span className="text-[9px] opacity-60">FCFA</span></p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-black text-primary">
                              {item.agent_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-on-surface">{item.agent_name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-on-surface">{dateStr}</p>
                        <p className="text-[10px] text-on-surface-variant">{timeStr}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 bg-surface-container-lowest border-t border-outline-variant/10">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => loadPage(currentPage - 1)}
              leftIcon={<span className="material-symbols-outlined text-sm">chevron_left</span>}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => loadPage(currentPage + 1)}
            >
              Suivant <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Agent de Collecte View (existing form) ───────────────────────────────────

function CollecteAgentView() {
  const taxes = useLoaderData() as TaxeOut[];

  const [selectedTaxeId, setSelectedTaxeId] = useState<number | null>(taxes[0]?.id || null);
  const selectedTaxe = taxes.find(t => t.id === selectedTaxeId);

  const [vendeurs, setVendeurs] = useState<VendeurViewOut[]>([]);
  const [selectedVendeurId, setSelectedVendeurId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [modal, setModal] = useState<{ kind: ModalKind; message: string } | null>(null);

  const todayIso = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayIso());

  const PAGE_SIZE = 10;

  const fetchVendeurs = useCallback(async (query: string, page: number, taxId?: number) => {
    setLoading(true);
    try {
      const data = await vendeurApi.getListView(query, page * PAGE_SIZE, PAGE_SIZE, taxId);
      setVendeurs(data);
    } catch (err: any) {
      setModal({ kind: 'error', message: err.message || 'Erreur lors du chargement des vendeurs.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVendeurs(searchQuery, currentPage, selectedTaxeId || undefined);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, selectedTaxeId, fetchVendeurs]);

  // Update date whenever the selected vendeur changes (or is cleared)
  useEffect(() => {
    if (!selectedVendeurId) {
      setSelectedDate(todayIso());
      return;
    }
    const vendor = vendeurs.find(v => v.id === selectedVendeurId);
    if (vendor?.derniere_collecte) {
      // Use the date portion of the ISO string directly to avoid timezone shift
      const raw = vendor.derniere_collecte;
      const datePart = raw.includes('T') ? raw.split('T')[0] : new Date(raw).toISOString().split('T')[0];
      setSelectedDate(datePart);
    } else {
      setSelectedDate(todayIso());
    }
  }, [selectedVendeurId, vendeurs]);

  const handleRegisterPayment = async () => {
    if (!selectedVendeurId || !selectedTaxeId || !selectedTaxe) {
      setModal({ kind: 'error', message: 'Veuillez sélectionner un vendeur et une taxe.' });
      return;
    }
    setPaymentLoading(true);
    try {
      const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await paiementApi.create({
        vendeur_id: selectedVendeurId,
        taxe_id: selectedTaxeId,
        montant: selectedTaxe.montant_base,
        reference,
        date_paiement: selectedDate ? new Date(selectedDate + 'T00:00:00').toISOString() : undefined,
      });
      setModal({ kind: 'success', message: `Le paiement de ${selectedTaxe.montant_base.toLocaleString('fr-FR')} FCFA pour ${selectedVendeur?.noms ?? 'ce vendeur'} a été enregistré.` });
      setSelectedVendeurId(null);
    } catch (err: any) {
      setModal({ kind: 'error', message: err.message || "Erreur lors de l'enregistrement du paiement." });
    } finally {
      setPaymentLoading(false);
    }
  };

  const selectedVendeur = vendeurs.find(v => v.id === selectedVendeurId);

  return (
    <div className="flex flex-col items-center px-4 pt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-32">

      {/* Search Bar */}
      <div className="relative flex items-center gap-2 w-[80%]">
        <div className="relative flex-1 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            placeholder="Trouver un vendeur (ID ou Nom)"
            className="w-full bg-surface-container px-12 py-3.5 rounded-2xl text-sm outline-none ring-1 ring-outline-variant/30 focus:ring-primary/60 transition-all font-medium"
          />
        </div>
        <button className="bg-primary p-3 rounded-xl text-white shadow-md active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
        </button>
      </div>

      {/* Vendor List */}
      <section className="space-y-4 w-[80%]">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">
            Sélectionner un Vendeur
          </h3>
          <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
            Page {currentPage + 1}
          </span>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-outline-variant/10 shadow-sm bg-surface-container-lowest">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">
              <tr>
                <th className="px-5 py-3 font-black">Vendeur</th>
                <th className="px-5 py-3 font-black">ID / Marche</th>
                <th className="px-5 py-3 font-black">Dernier Paiement</th>
                <th className="px-5 py-3 font-black w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center animate-pulse"><span className="text-xs font-bold text-on-surface-variant">Chargement des vendeurs...</span></td></tr>
              ) : vendeurs.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-10 text-center"><span className="text-xs font-bold text-on-surface-variant">Aucun vendeur trouvé</span></td></tr>
              ) : (
                vendeurs.map(v => (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVendeurId(v.id)}
                    className={`cursor-pointer transition-colors ${selectedVendeurId === v.id ? 'bg-primary/5' : 'hover:bg-surface-container/30'}`}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-on-surface">{v.noms}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">{v.telephone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[10px] font-black text-primary/80 uppercase">{v.id_nat}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium capitalize">{v.marche}</p>
                    </td>
                    <td className="px-5 py-4">
                      {v.derniere_collecte ? (
                        <div>
                          <p className="text-xs font-bold text-on-surface">{new Date(v.derniere_collecte).toLocaleDateString('fr-FR')}</p>
                          <p className="text-[9px] text-on-surface-variant uppercase font-black">Payé</p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-error uppercase tracking-tighter bg-error/10 px-2 py-0.5 rounded">Jamais payé</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedVendeurId === v.id ? 'bg-primary border-primary' : 'border-outline-variant/30'}`}>
                        {selectedVendeurId === v.id && (
                          <span className="material-symbols-outlined text-white text-[14px] font-black">done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 bg-surface-container-lowest border-t border-outline-variant/10">
            <Button variant="outline" size="sm" disabled={currentPage === 0 || loading} onClick={() => setCurrentPage(prev => prev - 1)} leftIcon={<span className="material-symbols-outlined text-sm">chevron_left</span>}>Précédent</Button>
            <Button variant="outline" size="sm" disabled={vendeurs.length < PAGE_SIZE || loading} onClick={() => setCurrentPage(prev => prev + 1)}>Suivant <span className="material-symbols-outlined text-sm ml-1">chevron_right</span></Button>
          </div>
        </div>
      </section>

      {/* Date Selection */}
      <section className="space-y-4 w-[80%] px-1">
        <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Date de la Collecte</h3>
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">calendar_today</span>
          </div>
          <div className="flex-1">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-bold text-on-surface"
            />
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">La date sera initialisée à la dernière collecte du vendeur.</p>
          </div>
        </div>
      </section>

      {/* Tax Type Selection */}
      <section className="space-y-4 w-[80%] px-1">
        <h3 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Type de Collecte</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {taxes.map(taxe => (
            <div
              key={taxe.id}
              onClick={() => setSelectedTaxeId(taxe.id)}
              className={`relative bg-surface-container-lowest p-5 rounded-3xl border-2 transition-all cursor-pointer active:scale-95 ${selectedTaxeId === taxe.id ? 'border-primary shadow-lg shadow-primary/10' : 'border-outline-variant/10 hover:border-primary/30 shadow-sm'}`}
            >
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedTaxeId === taxe.id ? 'bg-primary text-white scale-100' : 'bg-surface-container border border-outline-variant/30 scale-0'}`}>
                <span className="material-symbols-outlined text-[16px] font-black">done</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${selectedTaxeId === taxe.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined text-2xl">
                  {taxe.frequence === 'Journalière' ? 'calendar_today' : taxe.frequence === 'Mensuelle' ? 'event' : 'stars'}
                </span>
              </div>
              <h5 className={`font-black tracking-tight transition-colors ${selectedTaxeId === taxe.id ? 'text-primary' : 'text-on-surface'}`}>{taxe.nom}</h5>
              <div className="mt-2 text-right">
                <p className={`text-xl font-black leading-none ${selectedTaxeId === taxe.id ? 'text-primary' : 'text-on-surface'}`}>{taxe.montant_base.toLocaleString('fr-FR')}</p>
                <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-1">CDF</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Result Modal */}
      {modal && (
        <PaymentResultModal
          kind={modal.kind}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

      {/* Action Button */}
      <div className="w-[50%] px-4 transform transition-all hover:-translate-y-1">
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleRegisterPayment}
          disabled={!selectedVendeurId || paymentLoading}
          loading={paymentLoading}
          className="bg-green-800 hover:bg-green-900 shadow-[0_12px_24px_rgba(21,128,61,0.25)] h-16 rounded-2xl text-lg flex items-center justify-center gap-3 disabled:bg-surface-container-high disabled:text-on-surface-variant/40 disabled:shadow-none"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {selectedVendeur ? `Enregistrer pour ${selectedVendeur.noms.split(' ')[0]}` : 'Sélectionner un vendeur'}
        </Button>
      </div>
    </div>
  );
}

// ─── Root Component (RBAC Dispatcher) ────────────────────────────────────────

export default function Collecte() {
  const { user } = useLogin();

  if (user?.role === 'Autorité Locale') {
    return <CollecteAdminView />;
  }

  return <CollecteAgentView />;
}
