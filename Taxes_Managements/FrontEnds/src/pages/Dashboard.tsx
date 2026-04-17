
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { useAppSelector } from '../store/hooks';

export default function Dashboard() {
  const { data, isLoading, error } = useAppSelector((state) => state.dashboard);

  // Bar Chart Setup
  const chartLabels = data?.weekly_revenue.map(p => p.label) || ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const chartValues = data?.weekly_revenue.map(p => p.amount) || [0, 0, 0, 0, 0, 0, 0];

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Recettes (FCFA)',
        data: chartValues,
        backgroundColor: '#003f87',
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: '#0056b3',
      },
    ],
  };

  const barOptions = {
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
      },
    },
    scales: {
      y: { display: false, grid: { display: false } },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' as const }, color: '#424752' },
      },
    },
  };

  // Doughnut Chart Setup
  const DONUT_COLORS = [
    '#003f87', '#0070cc', '#00a36e', '#f5a623',
    '#e74c3c', '#9b59b6', '#1abc9c', '#e67e22',
  ];
  const donutLabels = data?.tax_distribution.map(p => p.label) || [];
  const donutValues = data?.tax_distribution.map(p => p.amount) || [];

  const donutData = {
    labels: donutLabels,
    datasets: [{
      data: donutValues,
      backgroundColor: DONUT_COLORS.slice(0, donutLabels.length),
      hoverBackgroundColor: DONUT_COLORS.slice(0, donutLabels.length).map(c => c + 'cc'),
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 11, weight: 'bold' as const },
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1b1c1c',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        callbacks: {
          label: (ctx: any) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
            return ` ${ctx.parsed.toLocaleString('fr-FR')} FCFA (${pct}%)`;
          },
        },
      },
    },
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-error font-bold">
        {error}
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div className="px-4 pt-6 space-y-6 animate-in fade-in duration-700">
      
      {/* Main Performance Card */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className="stats-gradient p-6 rounded-2xl text-white shadow-xl ">
          <div className="flex justify-between items-start mb-2">
            <p className="text-white/80 font-semibold text-xs uppercase tracking-widest">Total collecté aujourd'hui</p>
            <span className="material-symbols-outlined text-white/50 animate-pulse">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[2.25rem] font-black leading-tight tracking-tight">
              {summary?.total_today.toLocaleString('fr-FR') || '0'}
            </span>
            <span className="text-xl font-bold opacity-80">FCFA</span>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
            <span className="text-[10px] font-bold">
              {summary && summary.growth_rate >= 0 ? '+' : ''}
              {summary?.growth_rate.toFixed(1)}% par rapport à hier
            </span>
          </div>
        </div>

        {/* Real-time Status Grid */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-primary mb-2 text-2xl">groups</span>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-1 tracking-wider">Vendeurs actifs</p>
          <p className="text-2xl font-black text-primary">{summary?.active_vendeurs || 0}</p>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-secondary mb-2 text-2xl">engineering</span>
          <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-1 tracking-wider">Agents terrain</p>
          <p className="text-2xl font-black text-secondary">{summary?.active_agents || 0}</p>
        </div>
      </section>
      

      {/* Charts Section: Bar + Doughnut side by side */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar Chart — Evolution des recettes */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          <h3 className="font-bold text-base mb-4 tracking-tight">Évolution des recettes</h3>
          <div className="h-52 px-2">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut Chart — Répartition par type de taxe */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col">
          <h3 className="font-bold text-base mb-4 tracking-tight">Répartition par taxe</h3>
          {donutValues.length > 0 ? (
            <div className="flex-1 min-h-0" style={{ height: '180px' }}>
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-on-surface-variant font-medium">Aucune donnée</p>
            </div>
          )}
        </div>

      </section>

      {/* Alerts & Signals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-lg">Alertes prioritaires</h3>
          <span className="text-primary font-bold text-sm cursor-pointer hover:underline">Voir tout</span>
        </div>
        
        {/* Vendeurs Impayés Card */}
        <div className="bg-tertiary-container/10 p-5 rounded-2xl border border-tertiary/10 flex items-center gap-4 cursor-pointer hover:bg-tertiary-container/15 transition-colors">
          <div className="bg-tertiary-container p-3 rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-on-tertiary-fixed-variant">Vendeurs Impayés</p>
            <p className="text-sm text-on-tertiary-fixed-variant/70">
              {summary?.unpaid_vendeurs_count || 0} dossiers critiques à traiter
            </p>
          </div>
          <span className="material-symbols-outlined text-tertiary">chevron_right</span>
        </div>

        {/* Signalements Card */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
          <div className="bg-surface-container-high p-3 rounded-xl">
            <span className="material-symbols-outlined text-on-surface-variant">report_problem</span>
          </div>
          <div className="flex-1">
            <p className="font-bold">Signalements en attente</p>
            <p className="text-sm text-on-surface-variant">
              {summary?.pending_signals_count || 0} nouveaux incidents signalés
            </p>
          </div>
          {summary && summary.pending_signals_count > 0 && (
            <div className="bg-error text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">NOUVEAU</div>
          )}
        </div>
      </div>


      <section className="pb-8">
        <h3 className="font-bold text-lg mb-4 px-1">Dernières Collectes</h3>
        <div className="space-y-3">
          {data?.recent_activity.map((item) => (
            <ActivityItem 
              key={item.id}
              name={item.vendeur_name}
              location={item.location}
              time={item.time_ago}
              amount={item.amount.toLocaleString('fr-FR')}
            />
          ))}
          {data?.recent_activity.length === 0 && (
            <p className="text-center text-sm text-on-surface-variant py-4">Aucune collecte récente</p>
          )}
        </div>
      </section>

    </div>
  );
}

function ActivityItem({ name, location, time, amount }: { name: string; location: string; time: string; amount: string }) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow border border-outline-variant/5">
      <div>
        <p className="font-bold text-on-surface">{name}</p>
        <p className="text-xs text-on-surface-variant">{location} • {time}</p>
      </div>
      <div className="text-right">
        <p className="font-black text-secondary">{amount} FCFA</p>
        <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full uppercase tracking-tighter">PAYÉ</span>
      </div>
    </div>
  );
}
