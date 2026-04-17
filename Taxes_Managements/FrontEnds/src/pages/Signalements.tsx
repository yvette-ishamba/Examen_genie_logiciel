import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { signalementsApi } from '../services/api';
import { Plus, X, Check, XCircle, Clock } from 'lucide-react';

interface Signalement {
  id: number;
  sujet: string;
  description: string;
  date_signalement: string;
  statut: string;
  user_id: number;
}

export default function Signalements() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isVendeur = user?.role === 'Vendeur';
  const isAutoriteLocale = user?.role === 'Autorité Locale';

  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSujet, setNewSujet] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const fetchSignalements = async () => {
    try {
      setLoading(true);
      const data = await signalementsApi.getAll();
      // If user is Vendeur, only show their own. If Autorite Locale, show all.
      // Assuming the backend returns all for now, we filter in frontend if needed,
      // but ideally backend handles it. For now let's just filter for Vendeur.
      if (isVendeur) {
        setSignalements(data.filter((s: Signalement) => s.user_id === user.id));
      } else {
        setSignalements(data);
      }
    } catch (error) {
      console.error("Failed to fetch signalements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignalements();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signalementsApi.create({
        sujet: newSujet,
        description: newDescription
      });
      setIsModalOpen(false);
      setNewSujet('');
      setNewDescription('');
      fetchSignalements();
    } catch (error) {
      console.error("Failed to create signalement", error);
    }
  };

  const handleUpdateStatus = async (id: number, statut: string) => {
    try {
      await signalementsApi.updateStatus(id, statut);
      fetchSignalements();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'confirme':
      case 'confirmé':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Confirmé
          </span>
        );
      case 'rejete':
      case 'rejeté':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </span>
        );
      case 'en attente':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Signalements & Incidents</h2>
          <p className="text-sm text-gray-500 mt-1">Gestion des rapports de fraude ou des litiges sur le terrain.</p>
        </div>
        {isVendeur && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Signalement
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {signalements.length === 0 ? (
              <li className="px-6 py-12 text-center text-gray-500">
                Aucun signalement trouvé.
              </li>
            ) : (
              signalements.map((s) => (
                <li key={s.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{s.sujet}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          {getStatusBadge(s.statut)}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {s.description}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Ajouté le <time dateTime={s.date_signalement}>{new Date(s.date_signalement).toLocaleDateString('fr-FR')}</time>
                          </p>
                        </div>
                      </div>
                    </div>
                    {isAutoriteLocale && s.statut.toLowerCase() === 'en attente' && (
                      <div className="ml-6 flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'confirmé')}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="Confirmer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'rejeté')}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Modal for creating a signalement */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleCreate}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Nouveau Signalement
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="sujet" className="block text-sm font-medium text-gray-700">
                            Sujet
                          </label>
                          <input
                            type="text"
                            name="sujet"
                            id="sujet"
                            required
                            value={newSujet}
                            onChange={(e) => setNewSujet(e.target.value)}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            placeholder="Ex: Fraude observée au marché central"
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            required
                            rows={4}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            placeholder="Détails du signalement..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Soumettre
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
