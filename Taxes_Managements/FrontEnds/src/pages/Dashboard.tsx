
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
        label: 'Recettes (FC)',
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
            return ` ${ctx.parsed.toLocaleString('fr-FR')} FC (${pct}%)`;
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
        <div className="stats-gradient p-6 rounded-2xl text-white shadow-xl md:col-span-1 lg:col-span-1">
          <div className="flex justify-between items-start mb-2">
            <p className="text-white/80 font-semibold text-xs uppercase tracking-widest">Total aujourd'hui</p>
            <span className="material-symbols-outlined text-white/50 animate-pulse">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[1.75rem] lg:text-[2.25rem] font-black leading-tight tracking-tight">
              {summary?.total_today.toLocaleString('fr-FR') || '0'}
            </span>
            <span className="text-lg font-bold opacity-80">FC</span>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
            <span className="text-[10px] font-bold">
              {summary && summary.growth_rate >= 0 ? '+' : ''}
              {summary?.growth_rate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Real-time Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-1 md:col-span-2 lg:col-span-2 gap-5">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-primary mb-2 text-2xl">groups</span>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-1 tracking-wider">Vendeurs</p>
            <p className="text-2xl font-black text-primary">{summary?.active_vendeurs || 0}</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-secondary mb-2 text-2xl">engineering</span>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase mb-1 tracking-wider">Agents</p>
            <p className="text-2xl font-black text-secondary">{summary?.active_agents || 0}</p>
          </div>
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
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-tertiary-container p-3 rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-on-surface tracking-tight">Vendeurs Impayés</p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Situation par type de taxe</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {data?.unpaid_by_tax.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-surface-container/30 p-3 rounded-2xl border border-outline-variant/5">
                <div>
                  <p className="text-xs font-black text-on-surface">{item.taxe_name}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Non collectés aujourd'hui</p>
                </div>
                <div className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-black">
                  {item.count}
                </div>
              </div>
            ))}
            {(!data?.unpaid_by_tax || data.unpaid_by_tax.length === 0) && (
              <div className="text-center py-4 text-xs font-bold text-on-surface-variant/40">
                Excellent ! Tous les vendeurs sont à jour.
              </div>
            )}
          </div>
        </div>

        {/* Signalements Card */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-surface-container-high p-3 rounded-xl text-on-surface-variant">
                <span className="material-symbols-outlined">report_problem</span>
              </div>
              <div>
                <p className="font-black text-on-surface tracking-tight">Derniers Signalements</p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{summary?.pending_signals_count || 0} en attente</p>
              </div>
            </div>
            <span className="text-primary text-xs font-bold cursor-pointer hover:underline">Tout voir</span>
          </div>

          <div className="space-y-3">
            {data?.recent_signals.map((signal) => (
              <div key={signal.id} className="flex gap-4 p-3 rounded-2xl hover:bg-surface-container/20 transition-colors border border-transparent hover:border-outline-variant/10">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-black text-on-surface truncate">{signal.sujet}</p>
                    <span className="text-[9px] font-bold text-on-surface-variant/60 whitespace-nowrap">{signal.time_ago}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/80 font-medium truncate">Par {signal.auteur_name}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${signal.statut === 'en attente' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              </div>
            ))}
            {(!data?.recent_signals || data.recent_signals.length === 0) && (
              <div className="text-center py-4 text-xs font-bold text-on-surface-variant/40">
                Aucun signalement récent.
              </div>
            )}
          </div>
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
        <p className="font-black text-secondary">{amount} FC</p>
        <span className="text-[10px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full uppercase tracking-tighter">PAYÉ</span>
      </div>
    </div>
  );
}
