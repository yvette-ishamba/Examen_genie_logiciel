import { useEffect } from "react";
import { vendeurApi } from "../services/vendeur_api";
import type { VendeurMe, VendeurStatusOut } from "../services/vendeur_api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setVendorData,
  setAdminList,
  setLoading,
  setError,
  setPage,
  setSearchQuery,
} from "../store/slices/vendeursSlice";
import {
  FaArrowLeft,
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaWallet,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
} from "react-icons/fa";
import { jsPDF } from "jspdf";

export default function Vendeurs() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { vendorData, adminList, loading, error, page, period } =
    useAppSelector((state) => state.vendeurs);

  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        if (user?.role === "Vendeur") {
          const data = await vendeurApi.getMe();
          dispatch(setVendorData(data));
        } else {
          const data = await vendeurApi.getAll(page * limit, limit, period);
          dispatch(setAdminList(data));
        }
      } catch (err: any) {
        dispatch(
          setError(
            err.message ||
              "Une erreur est survenue lors de la récupération des données.",
          ),
        );
      }
    };

    fetchData();
  }, [user, page, period, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <FaExclamationCircle className="mx-auto h-12 w-12 text-error mb-4" />
        <h3 className="text-lg font-bold text-on-surface">Erreur</h3>
        <p className="text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-xl shadow-md"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (user?.role === "Vendeur" && vendorData) {
    return <VendeurDetailView data={vendorData} />;
  }

  return <VendeurListView list={adminList} page={page} period={period} />;
}

// --- Vendeur Detail View (Mockup Implementation) ---
function VendeurDetailView({ data }: { data: VendeurMe }) {
  const handleDownloadItem = (id: number) => {
    const item = data.history.find((h) => h.id === id);
    if (!item) return;

    const doc = new jsPDF({
      unit: "mm",
      format: [80, 150], // Receipt format (80mm width)
    });

    // --- Header ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RÉPUBLIQUE DÉMOCRATIQUE", 40, 15, { align: "center" });
    doc.text("DU CONGO", 40, 22, { align: "center" });

    doc.setFontSize(10);
    doc.text("CONGO TAX APP", 40, 30, { align: "center" });
    doc.text("------------------------------------------", 40, 35, {
      align: "center",
    });

    // --- Title ---
    doc.setFontSize(12);
    doc.text("REÇU DE PAIEMENT TAXE", 40, 45, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Réf: ${item.reference}`, 40, 52, { align: "center" });

    // --- Vendor Info ---
    doc.text("------------------------------------------", 40, 60, {
      align: "center",
    });
    doc.text(`Vendeur: ${data.nom} ${data.prenom}`, 10, 68);
    doc.text(`ID Fiscal: ${data.identifiant_national}`, 10, 75);
    doc.text(`Marché: ${data.emplacement}`, 10, 82);

    // --- Payment Info ---
    doc.text("------------------------------------------", 40, 90, {
      align: "center",
    });
    doc.setFont("helvetica", "bold");
    doc.text(`TAXE: ${item.taxe_nom}`, 10, 98);
    doc.setFontSize(14);
    doc.text(`MONTANT: ${item.montant.toLocaleString()} FC`, 10, 110);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date(item.date_paiement).toLocaleString("fr-FR");
    doc.text(`Date: ${dateStr}`, 10, 120);

    // --- Footer ---
    doc.text("------------------------------------------", 40, 130, {
      align: "center",
    });
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Merci pour votre contribution civique.", 40, 138, {
      align: "center",
    });
    doc.text("Document généré numériquement.", 40, 143, { align: "center" });

    doc.save(`Recu_${item.reference}.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-24">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between border-b border-outline-variant sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
            <FaArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-primary">Détails Vendeur</h1>
        </div>
        <div className="h-10 w-10 bg-surface-container rounded-full overflow-hidden border-2 border-primary/20">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nom}`}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nom}&backgroundColor=b6e3f4`}
                alt={data.nom}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  data.status === "À JOUR"
                    ? "bg-secondary-container text-secondary"
                    : "bg-red-100 text-error"
                }`}
              >
                {data.status === "À JOUR" ? (
                  <FaCheckCircle className="h-3 w-3" />
                ) : (
                  <FaExclamationCircle className="h-3 w-3" />
                )}
                {data.status}
              </span>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                  ID FISCAL
                </span>
                <span className="text-primary font-bold text-lg">
                  #{data.identifiant_national}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-3xl font-black text-on-surface leading-tight">
              {data.nom} {data.prenom}
            </h2>
            <div className="flex items-center gap-1.5 text-on-surface-variant mt-2 font-medium">
              <FaMapMarkerAlt className="h-4 w-4 text-primary shrink-0" />
              <span>{data.emplacement}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant shadow-sm transition-transform hover:scale-[1.02]">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
              TOTAL PAYÉ
            </span>
            <span className="text-xl font-black text-primary">
              {data.total_paye.toLocaleString()} FC
            </span>
          </div>
          <div className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant shadow-sm transition-transform hover:scale-[1.02]">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
              DERNIÈRE COLLECTE
            </span>
            <span
              className={`text-xl font-black ${data.derniere_collecte === "Aujourd'hui" || data.derniere_collecte === "Hier" ? "text-secondary" : "text-on-surface"}`}
            >
              {data.derniere_collecte}
            </span>
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-lg text-on-surface">
              Historique des Paiements
            </h3>
            <button className="text-[10px] uppercase font-bold text-primary hover:underline underline-offset-4">
              VOIR TOUT
            </button>
          </div>

          <div className="space-y-3">
            {data.history.length === 0 ? (
              <div className="py-10 text-center bg-white rounded-3xl border border-dashed border-outline-variant">
                <FaFileAlt className="h-10 w-10 text-on-surface-variant/30 mx-auto mb-2" />
                <p className="text-on-surface-variant text-sm">
                  Aucun paiement enregistré
                </p>
              </div>
            ) : (
              data.history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-outline-variant flex items-center justify-between shadow-sm relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-full"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-secondary-container/30 rounded-2xl flex items-center justify-center">
                      <FaWallet className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface leading-tight text-base">
                        {item.taxe_nom}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {new Date(item.date_paiement).toLocaleDateString()} •{" "}
                        {new Date(item.date_paiement).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-on-surface text-lg">
                      {item.montant.toLocaleString()} FC
                    </div>
                    <button
                      onClick={() => handleDownloadItem(item.id)}
                      className="text-[10px] font-bold text-primary flex items-center gap-1 justify-end hover:underline"
                    >
                      <FaDownload className="h-3 w-3" /> REÇU
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Optional Branding Footer like in mockup */}
      <p className="text-center text-[9px] uppercase tracking-[0.2em] font-medium text-on-surface-variant/60 pb-8 px-4">
        CONGO TAX APP • SYSTÈME CERTIFIÉ
      </p>
    </div>
  );
}

// --- Admin/Agent List View ---
function VendeurListView({ list, page }: any) {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.vendeurs);

  const filteredList = list.filter(
    (v: any) =>
      v.noms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id_nat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.marche.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary">
            Gestion des Vendeurs
          </h2>
          <p className="text-on-surface-variant">
            Surveillance des collectes et état des paiements.
          </p>
        </div>

        {/* Removing period filter since we show all statuses now */}
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Rechercher un vendeur..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Desktop Table Content */}
      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider">
                  Vendeur
                </th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider">
                  ID Fiscal
                </th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider">
                  Marché
                </th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider text-center">
                  Journalier
                </th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider text-center">
                  Mensuel
                </th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider text-center">
                  Annuel
                </th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredList.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-on-surface-variant"
                  >
                    Aucun vendeur trouvé.
                  </td>
                </tr>
              ) : (
                filteredList.map((v: VendeurStatusOut) => (
                  <tr
                    key={v.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-surface-container rounded-full flex items-center justify-center text-primary font-bold shadow-sm">
                          {v.noms.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface group-hover:text-primary transition-colors">
                            {v.noms}
                          </div>
                          <div className="text-xs text-on-surface-variant">
                            {v.telephone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">
                      {v.id_nat}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface leading-tight font-medium">
                      {v.marche}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wide uppercase flex items-center gap-1 w-fit ${
                            v.status_daily === "À JOUR"
                              ? "bg-secondary-container text-secondary"
                              : "bg-red-100 text-error"
                          }`}
                        >
                          {v.status_daily === "À JOUR" ? (
                            <FaCheckCircle className="h-2.5 w-2.5" />
                          ) : (
                            <FaExclamationCircle className="h-2.5 w-2.5" />
                          )}
                          {v.status_daily}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wide uppercase flex items-center gap-1 w-fit ${
                            v.status_monthly === "À JOUR"
                              ? "bg-secondary-container text-secondary"
                              : "bg-red-100 text-error"
                          }`}
                        >
                          {v.status_monthly === "À JOUR" ? (
                            <FaCheckCircle className="h-2.5 w-2.5" />
                          ) : (
                            <FaExclamationCircle className="h-2.5 w-2.5" />
                          )}
                          {v.status_monthly}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wide uppercase flex items-center gap-1 w-fit ${
                            v.status_yearly === "À JOUR"
                              ? "bg-secondary-container text-secondary"
                              : "bg-red-100 text-error"
                          }`}
                        >
                          {v.status_yearly === "À JOUR" ? (
                            <FaCheckCircle className="h-2.5 w-2.5" />
                          ) : (
                            <FaExclamationCircle className="h-2.5 w-2.5" />
                          )}
                          {v.status_yearly}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-on-surface text-sm">
                        {v.montant_total.toLocaleString()} FC
                      </div>
                      {v.derniere_collecte && (
                        <div className="text-[10px] text-on-surface-variant mt-0.5">
                          Vu le{" "}
                          {new Date(v.derniere_collecte).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
          <p className="text-xs text-on-surface-variant font-medium">
            Page {page + 1}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setPage(Math.max(0, page - 1)))}
              disabled={page === 0}
              className="p-2 bg-white border border-outline-variant rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors shadow-sm"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => dispatch(setPage(page + 1))}
              disabled={list.length < 10}
              className="p-2 bg-white border border-outline-variant rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors shadow-sm"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
