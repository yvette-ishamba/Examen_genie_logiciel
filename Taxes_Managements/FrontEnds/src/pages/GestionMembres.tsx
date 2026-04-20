import { useState, useEffect } from 'react';
import { usersApi } from '../services/api';
import { UserCheck, UserPlus, Edit2, Search, Filter, ShieldCheck, XCircle, AlertCircle, UserX } from 'lucide-react';
import Button from '../components/Button';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone_number: string;
  vendeur?: {
    identifiant_national: string;
  } | null;
  status: string;
  created_at: string;
}

export default function GestionMembres() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone_number: '',
    role: '',
    email: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Confirmation Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    userId: number;
    userName: string;
    action: 'validate' | 'reject';
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const skip = page * itemsPerPage;
      const data = await usersApi.getAll(skip, itemsPerPage);
      setUsers(data);
      setHasMore(data.length === itemsPerPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (userId: number, userName: string, action: 'validate' | 'reject') => {
    setConfirmConfig({ userId, userName, action });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmConfig) return;
    
    setIsProcessingAction(true);
    try {
      if (confirmConfig.action === 'validate') {
        await usersApi.validate(confirmConfig.userId);
        setUsers(users.map(u => u.id === confirmConfig.userId ? { ...u, status: 'valide' } : u));
      } else {
        await usersApi.reject(confirmConfig.userId);
        setUsers(users.map(u => u.id === confirmConfig.userId ? { ...u, status: 'rejete' } : u));
      }
      setIsConfirmModalOpen(false);
    } catch (err: any) {
      alert(`Erreur lors de l'action: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      full_name: user.full_name,
      phone_number: user.phone_number,
      role: user.role,
      email: user.email
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsUpdating(true);
    try {
      await usersApi.update(selectedUser.id, editForm);
      setIsEditModalOpen(false);
      fetchUsers(currentPage);
    } catch (err: any) {
      alert("Erreur lors de la mise à jour: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Membres</h1>
          <p className="text-slate-500">Validez les nouveaux comptes et gérez les informations des utilisateurs.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="flex-1 sm:flex-none px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none min-w-[140px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="valide">Validés</option>
            <option value="en attente">En attente</option>
            <option value="rejete">Rejetés</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Membre</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Identifiant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Chargement...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Aucun membre trouvé.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{user.full_name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.vendeur?.identifiant_national || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.phone_number}</td>
                    <td className="px-6 py-4">
                      {user.status === 'valide' ? (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Validé</span>
                        </div>
                      ) : user.status === 'rejete' ? (
                        <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold">
                          <XCircle className="w-4 h-4" />
                          <span>Rejeté</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
                          <AlertCircle className="w-4 h-4" />
                          <span>En attente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.status === 'en attente' && (
                          <>
                            <button 
                              onClick={() => openConfirmModal(user.id, user.full_name, 'validate')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Valider"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => openConfirmModal(user.id, user.full_name, 'reject')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Rejeter"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {user.status === 'valide' && (
                          <button 
                            onClick={() => handleOpenEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 order-2 sm:order-1">
            Page <span className="font-medium text-slate-700">{currentPage + 1}</span>
          </p>
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0 || loading}
              className="flex-1 sm:flex-none"
            >
              Précédent
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasMore || loading}
              className="flex-1 sm:flex-none"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && confirmConfig && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${confirmConfig.action === 'validate' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {confirmConfig.action === 'validate' ? <UserCheck className="w-8 h-8" /> : <UserX className="w-8 h-8" />}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">
                  {confirmConfig.action === 'validate' ? 'Valider le membre ?' : 'Rejeter le membre ?'}
                </h3>
                <p className="text-sm text-slate-500">
                  Êtes-vous sûr de vouloir {confirmConfig.action === 'validate' ? 'valider' : 'rejeter'} le compte de <span className="font-bold text-slate-700">{confirmConfig.userName}</span> ?
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleConfirmAction}
                  loading={isProcessingAction}
                  variant={confirmConfig.action === 'validate' ? 'primary' : 'secondary'}
                  className={`flex-1 ${confirmConfig.action === 'reject' ? 'bg-red-600 hover:bg-red-700 text-white border-none' : ''}`}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Modifier le membre</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0047a5] uppercase">Nom Complet</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0047a5] uppercase">Téléphone</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0047a5] uppercase">Rôle</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="Vendeur">Vendeur</option>
                  <option value="Agent de Collecte">Agent de Collecte</option>
                  <option value="Autorité Locale">Autorité Locale</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0047a5] uppercase">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 cursor-not-allowed"
                  value={editForm.email}
                  disabled
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  loading={isUpdating}
                  className="flex-1"
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
