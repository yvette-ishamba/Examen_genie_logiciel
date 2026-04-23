import { useEffect, useRef } from "react";
import { statsApi } from "../services/stats_api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setReports, setLoading, setError } from "../store/slices/reportsSlice";
import {
  FaChartBar,
  FaChartLine,
  FaUsers,
  FaDownload,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import Button from "../components/Button";
import { jsPDF } from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function Rapports() {
  const dispatch = useAppDispatch();
  const { reports, loading, error } = useAppSelector((state) => state.reports);

  const marketChartRef = useRef<any>(null);
  const complianceChartRef = useRef<any>(null);
  const categoryChartRef = useRef<any>(null);

  const handleExportPDF = () => {
    if (!reports) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Header ---
    doc.setFillColor(0, 71, 165); // Primary Blue
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CONGO TAX APP", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("RAPPORT DÉCISIONNEL GLOBAL", 20, 30);
    doc.text(new Date().toLocaleDateString("fr-FR"), pageWidth - 50, 20);

    let yPos = 50;

    // --- Report 1: Market Distribution ---
    doc.setTextColor(0, 71, 165);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. Distribution des Recettes par Marché", 20, yPos);
    yPos += 10;

    if (marketChartRef.current) {
      const img = marketChartRef.current.toBase64Image();
      doc.addImage(img, "PNG", 20, yPos, 170, 60);
      yPos += 70;
    }

    // --- Report 2: Compliance Stats ---
    doc.text("2. Taux de Conformité (Paiements Journaliers)", 20, yPos);
    yPos += 10;

    if (complianceChartRef.current) {
      const img = complianceChartRef.current.toBase64Image();
      doc.addImage(img, "PNG", 20, yPos, 60, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      reports.compliance_stats.forEach((stat, i) => {
        doc.text(
          `${stat.label}: ${stat.percentage?.toFixed(1)}% (${stat.value} vendeurs)`,
          90,
          yPos + 20 + i * 10,
        );
      });
      yPos += 70;
    }

    // --- Page Break if needed ---
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    // --- Report 3: Revenue by Category ---
    doc.setTextColor(0, 71, 165);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("3. Recettes par Fréquence de Taxe", 20, yPos);
    yPos += 10;

    if (categoryChartRef.current) {
      const img = categoryChartRef.current.toBase64Image();
      doc.addImage(img, "PNG", 20, yPos, 80, 80);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      reports.revenue_by_category.forEach((cat, i) => {
        doc.text(
          `${cat.label}: ${cat.value.toLocaleString()} FC`,
          110,
          yPos + 30 + i * 10,
        );
      });
      yPos += 90;
    }

    // --- Footer Summary ---
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPos, pageWidth - 30, 30, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Note: Ce rapport est généré automatiquement par le système Congo Tax App.",
      20,
      yPos + 10,
    );
    doc.text(
      "Il est destiné à l'usage exclusif de l'Autorité Locale pour la prise de décision.",
      20,
      yPos + 18,
    );

    doc.save(
      `Rapport_Decisionnel_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      dispatch(setLoading(true));
      try {
        const data = await statsApi.getGlobalReports();
        dispatch(setReports(data));
      } catch (err: any) {
        dispatch(setError(err.message || "Impossible de charger les données"));
      }
    };
    fetchReports();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !reports) {
    return (
      <div className="p-10 text-center">
        <FaExclamationCircle className="mx-auto h-12 w-12 text-error mb-4" />
        <h2 className="text-xl font-bold text-on-surface">Erreur</h2>
        <p className="text-on-surface-variant">
          {error || "Impossible de charger les données"}
        </p>
      </div>
    );
  }

  // --- Chart Configurations ---

  const marketChartData = {
    labels: reports.market_distribution.map((d) => d.label),
    datasets: [
      {
        label: "Recettes par Marché (FC)",
        data: reports.market_distribution.map((d) => d.value),
        backgroundColor: "rgba(0, 71, 165, 0.7)",
        borderRadius: 12,
      },
    ],
  };

  const complianceChartData = {
    labels: reports.compliance_stats.map((d) => d.label),
    datasets: [
      {
        data: reports.compliance_stats.map((d) => d.value),
        backgroundColor: [
          "#166534", // Secondary/Green
          "#b91c1c", // Error/Red
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const categoryChartData = {
    labels: reports.revenue_by_category.map((d) => d.label),
    datasets: [
      {
        label: "Par Fréquence",
        data: reports.revenue_by_category.map((d) => d.value),
        backgroundColor: ["#0047a5", "#00609b", "#0081d5", "#3b82f6"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            Rapports Décisionnels
          </h1>
          <p className="text-on-surface-variant font-medium">
            Analyse globale de l'écosystème fiscal de la juridiction.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            className="rounded-2xl font-black py-3 px-6 shadow-md shadow-primary/20"
            onClick={handleExportPDF}
          >
            <FaDownload className="w-4 h-4 mr-2" /> Exporter PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Report 1: Market Performance */}
        <div className="bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col h-full group hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">
                Distribution par Marché
              </h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                Recettes cumulées
              </p>
            </div>
            <div className="bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-black text-on-surface-variant flex items-center gap-1.5">
              <FaCalendarAlt className="w-3 h-3" /> Global
            </div>
          </div>

          <div className="flex-1 min-h-[300px]">
            <Bar
              ref={marketChartRef}
              data={marketChartData}
              options={{
                animation: false, // Disable animation for clean export
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { font: { weight: "bold" } },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { font: { weight: "bold" } },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Report 2: Compliance Rate */}
        <div className="bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col h-full group hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">
                Taux de Conformité
              </h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                État des paiements journaliers
              </p>
            </div>
            <div className="bg-secondary/10 px-3 py-1 rounded-full text-[10px] font-black text-secondary flex items-center gap-1.5 animate-pulse">
              <FaChartLine className="w-3 h-3" /> En direct
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
            <div className="w-full md:w-1/2 max-w-[250px]">
              <Doughnut
                ref={complianceChartRef}
                data={complianceChartData}
                options={{
                  animation: false,
                  cutout: "75%",
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {reports.compliance_stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-on-surface uppercase">
                      {stat.label}
                    </span>
                    <span className="text-xs font-black text-primary">
                      {stat.percentage?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? "bg-secondary" : "bg-error"}`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report 3: Agent Performance */}
        <div className="bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col h-full group hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <FaUsers className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">
                Performance des Agents
              </h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                Top 30 derniers jours
              </p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {reports.agent_performance.length === 0 ? (
              <p className="text-center py-10 text-on-surface-variant italic text-sm">
                Aucune activité enregistrée.
              </p>
            ) : (
              reports.agent_performance.slice(0, 5).map((agent, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl group/item hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-on-surface">
                        {agent.label}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase">
                        Collecteur Certifié
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">
                      {agent.value.toLocaleString()} FC
                    </p>
                    <p className="text-[10px] text-secondary font-black uppercase">
                      Performant
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report 4: Revenue Category Breakdown */}
        <div className="bg-white p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col h-full group hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <FaChartBar className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-on-surface tracking-tight">
                Recettes par Fréquence
              </h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                Répartition des flux
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[250px] mb-6">
            <Pie
              ref={categoryChartRef}
              data={categoryChartData}
              options={{
                animation: false,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                    labels: {
                      font: { weight: "bold", size: 10 },
                      usePointStyle: true,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {reports.revenue_by_category.map((cat, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/5"
              >
                <p className="text-[10px] font-black text-on-surface-variant uppercase mb-1">
                  {cat.label}
                </p>
                <p className="text-sm font-black text-on-surface">
                  {cat.value.toLocaleString()}{" "}
                  <span className="text-[9px] opacity-40">FC</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Support Alert */}
      <div className="bg-primary/5 border border-primary/10 p-8 rounded-[32px] flex items-start gap-6">
        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
          <FaChartLine className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-black text-primary mb-2 tracking-tight">
            Note d'Aide à la Décision
          </h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed max-w-4xl">
            Sur la base des données actuelles, le marché avec la plus forte
            contribution est{" "}
            <strong>{reports.market_distribution[0]?.label || "N/A"}</strong>.
            Le taux de conformité global est de{" "}
            <strong>
              {reports.compliance_stats[0]?.percentage?.toFixed(1)}%
            </strong>
            . Une attention particulière devrait être portée aux taxes de type{" "}
            <strong>
              {[...reports.revenue_by_category].sort(
                (a, b) => a.value - b.value,
              )[0]?.label || "N/A"}
            </strong>{" "}
            qui présentent le volume de recettes le plus faible.
          </p>
        </div>
      </div>
    </div>
  );
}
