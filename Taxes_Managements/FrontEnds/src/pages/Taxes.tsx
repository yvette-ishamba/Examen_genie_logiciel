import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import Button from '../components/Button';
import TaxCard from '../components/TaxeCard';
import CreateTaxes from '../components/CreateTaxes';
import { type TaxeOut, taxeApi } from '../services/taxe_api';
import { statsApi } from '../services/stats_api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setTaxes, 
  addTaxe, 
  updateTaxeInList, 
  removeTaxe, 
  setGlobalStats, 
  setStatsLoading, 
  setSelectedYear, 
  setSelectedCategory, 
  setSearchQuery,
  setDeleteError
} from '../store/slices/taxesSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Taxes() {
  const dispatch = useAppDispatch();
  const initialTaxes = useLoaderData() as TaxeOut[];
  
  const { 
    taxes, 
    globalStats, 
    isStatsLoading, 
    selectedYear, 
    selectedCategory, 
    searchQuery,
    deleteError 
  } = useAppSelector(state => state.taxes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxe, setEditingTaxe] = useState<TaxeOut | undefined>(undefined);

  useEffect(() => {
    if (initialTaxes && initialTaxes.length > 0 && taxes.length === 0) {
      dispatch(setTaxes(initialTaxes));
    }
  }, [initialTaxes, taxes.length, dispatch]);

  const filteredTaxes = taxes.filter(t => 
    t.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.frequence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchStats = async () => {
      dispatch(setStatsLoading(true));
      try {
        const stats = await statsApi.getTaxGlobalStats(Number(selectedYear));
        dispatch(setGlobalStats(stats));
      } catch (err) {
        console.error("Failed to fetch tax stats:", err);
        dispatch(setStatsLoading(false));
      }
    };
    fetchStats();
  }, [selectedYear, dispatch]);

  // Called by CreateTaxes when a tax is successfully created
  const handleTaxeCreated = (newTaxe: TaxeOut) => {
    dispatch(addTaxe(newTaxe));
  };

  const handleTaxeUpdated = (updatedTaxe: TaxeOut) => {
    dispatch(updateTaxeInList(updatedTaxe));
  };

  const handleDeleteTaxe = async (id: number) => {
    try {
      await taxeApi.delete(id);
      dispatch(removeTaxe(id));
    } catch (err: any) {
      dispatch(setDeleteError(err.message || 'Erreur lors de la suppression de la taxe.'));
    }
  };

  // Chart data (Real data from backend)
  const chartData = {
    labels: globalStats?.monthly_data.map(d => d.month) || ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        fill: true,
        label: 'Recettes Globales (FC)',
        data: globalStats?.monthly_data.map(d => d.amount) || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#003f87',
        backgroundColor: 'rgba(0, 63, 135, 0.05)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1b1c1c',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toLocaleString('fr-FR')} FC`,
        },
      },
    },
    scales: {
      y: {
        display: true,
        grid: { display: true, color: 'rgba(0, 0, 0, 0.03)' },
        ticks: {
          font: { size: 10 },
          color: '#424752',
          callback: (value: any) => `${value / 1000}k`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' as const }, color: '#424752' },
      },
    },
  };

  return (
    <div className="px-4 pt-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-12">

      {/* Create/Edit Taxes Modal */}
      <CreateTaxes
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTaxe(undefined); }}
        onCreated={handleTaxeCreated}
        onUpdated={handleTaxeUpdated}
        initialData={editingTaxe}
      />

      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-black text-on-surface tracking-tight">Configuration des Taxes</h2>
        <div className="flex items-center gap-4">
          {/* Search Input for Taxes */}
          <div className="relative group hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Chercher une taxe..."
              className="bg-surface-container-high/50 border border-outline-variant/10 pl-9 pr-4 py-1.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary/40 transition-all font-medium"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/5 font-black flex items-center gap-1.5"
            leftIcon={<span className="material-symbols-outlined text-lg">add_circle</span>}
            onClick={() => { setEditingTaxe(undefined); setIsModalOpen(true); }}
          >
            Nouveau
          </Button>
        </div>
      </div>

      {/* Custom Error Modal for Deletion */}
      {deleteError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => dispatch(setDeleteError(null))} />
          <div className="bg-surface-container-lowest rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative z-10 border border-outline-variant/20 scale-in-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">warning</span>
            </div>
            <h3 className="text-xl font-black text-on-surface text-center mb-3 tracking-tight">Action impossible</h3>
            <p className="text-sm text-on-surface-variant text-center mb-8 font-medium leading-relaxed">
              {deleteError}
            </p>
            <Button
              variant="primary"
              className="w-full font-black py-4 rounded-2xl"
              onClick={() => dispatch(setDeleteError(null))}
            >
              J'ai compris
            </Button>
          </div>
        </div>
      )}

      {/* Tax Cards – dynamic from DB via Loader */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTaxes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">receipt_long</span>
            <p className="font-bold text-on-surface-variant/60">Aucune taxe trouvée</p>
            <p className="text-xs text-on-surface-variant/40">Affinez votre recherche ou créez une nouvelle taxe.</p>
          </div>
        ) : (
          filteredTaxes.map(taxe => (
            <TaxCard 
              key={taxe.id} 
              taxe={taxe} 
              onEdit={(t) => { setEditingTaxe(t); setIsModalOpen(true); }}
              onDelete={handleDeleteTaxe}
            />
          ))
        )}
      </div>

      {/* Statistics Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="text-xl font-black text-on-surface tracking-tight">Statistiques Globales</h2>
            <p className="text-xs text-on-surface-variant font-medium">Analyse des revenus fiscaux cumulés</p>
          </div>
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => dispatch(setSelectedYear(e.target.value))}
              className="bg-surface-container-high/50 text-[10px] font-bold rounded-lg px-2 py-1 outline-none ring-1 ring-outline-variant/20 focus:ring-primary/40 transition-all"
            >
              {[0, 1, 2].map(offset => {
                const y = (new Date().getFullYear() - offset).toString();
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              className="bg-surface-container-high/50 text-[10px] font-bold rounded-lg px-2 py-1 outline-none ring-1 ring-outline-variant/20 focus:ring-primary/40 transition-all"
            >
              <option value="Toutes">Toutes</option>
              <option value="Journalière">Journalière</option>
              <option value="Mensuelle">Mensuelle</option>
              <option value="Périodique">Périodique</option>
            </select>
          </div>
        </div>

        {/* Total Summary Card */}
        <div className="stats-gradient p-6 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
          {isStatsLoading && (
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Montant Total Collecté ({selectedYear})</p>
              <p className="text-3xl font-black tracking-tight">
                {globalStats?.total_amount.toLocaleString('fr-FR') || '0'} <span className="text-lg opacity-80">FC</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 text-center">
              <p className="text-[8px] font-bold opacity-60 uppercase">Moy / Mois</p>
              <p className="text-sm font-black">{globalStats ? (globalStats.monthly_average / 1000).toFixed(1) : '0'}k</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 text-center">
              <p className="text-[8px] font-bold opacity-60 uppercase">Croissance</p>
              <p className={`text-sm font-black ${globalStats && globalStats.growth_rate >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {globalStats && globalStats.growth_rate >= 0 ? '+' : ''}{globalStats?.growth_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Yearly Tax Breakdown List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {globalStats?.tax_breakdown.map((item, idx) => (
            <div key={idx} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex justify-between items-center group hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs font-black text-on-surface uppercase tracking-tight">{item.label}</p>
                  <p className="text-[9px] text-on-surface-variant font-bold">Total annuel {selectedYear}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-primary">{item.amount.toLocaleString('fr-FR')} <span className="text-[10px] opacity-60">FC</span></p>
                <div className="w-full bg-surface-container-high h-1 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${globalStats.total_amount > 0 ? (item.amount / globalStats.total_amount * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {(!globalStats?.tax_breakdown || globalStats.tax_breakdown.length === 0) && !isStatsLoading && (
            <div className="col-span-full text-center py-6 text-xs font-bold text-on-surface-variant/40 italic">
              Aucun paiement enregistré pour l'année {selectedYear}.
            </div>
          )}
        </div>

        {/* Monthly Progression Chart */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-tight">Progression Mensuelle</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold text-on-surface-variant">Recettes directes</span>
            </div>
          </div>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>

      {/* Footer Badge */}
      <div className="flex justify-center pt-8">
        <div className="bg-surface-container-high/50 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/10">
          <span className="material-symbols-outlined text-green-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            security
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
            SÉCURISÉ PAR LE GOUVERNEMENT • V2.4.0
          </span>
        </div>
      </div>

    </div>
  );
}
