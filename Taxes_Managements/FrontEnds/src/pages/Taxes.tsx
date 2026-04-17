import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Button from '../components/Button';
import TaxCard from '../components/TaxeCard';
import CreateTaxes from '../components/CreateTaxes';
import { type TaxeOut } from '../services/taxe_api';
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
  const initialTaxes = useLoaderData() as TaxeOut[];
  const [taxes, setTaxes] = useState<TaxeOut[]>(initialTaxes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  // Called by CreateTaxes when a tax is successfully created
  const handleTaxeCreated = (newTaxe: TaxeOut) => {
    setTaxes(prev => [...prev, newTaxe]);
  };

  // Chart data (Keeping mock data for display)
  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        fill: true,
        label: 'Recettes Globales (CDF)',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 88000, 95000],
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
          label: (context: any) => `${context.parsed.y.toLocaleString('fr-FR')} CDF`,
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

      {/* Create Taxes Modal */}
      <CreateTaxes
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleTaxeCreated}
      />

      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-black text-on-surface tracking-tight">Configuration des Taxes</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/5 font-black flex items-center gap-1.5"
          leftIcon={<span className="material-symbols-outlined text-lg">add_circle</span>}
          onClick={() => setIsModalOpen(true)}
        >
          Nouveau
        </Button>
      </div>

      {/* Tax Cards – dynamic from DB via Loader */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {taxes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-10 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">receipt_long</span>
            <p className="font-bold text-on-surface-variant/60">Aucune taxe configurée</p>
            <p className="text-xs text-on-surface-variant/40">Cliquez sur "Nouveau" pour en créer une.</p>
          </div>
        ) : (
          taxes.map(taxe => (
            <TaxCard key={taxe.id} taxe={taxe} />
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
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-surface-container-high/50 text-[10px] font-bold rounded-lg px-2 py-1 outline-none ring-1 ring-outline-variant/20 focus:ring-primary/40 transition-all"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
        <div className="stats-gradient p-6 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Montant Total Collecté</p>
              <p className="text-3xl font-black tracking-tight">
                1 245 000 <span className="text-lg opacity-80">CDF</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 text-center">
              <p className="text-[8px] font-bold opacity-60 uppercase">Moy / Mois</p>
              <p className="text-sm font-black">103.7k</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5 text-center">
              <p className="text-[8px] font-bold opacity-60 uppercase">Croissance</p>
              <p className="text-sm font-black text-green-300">+18%</p>
            </div>
          </div>
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
