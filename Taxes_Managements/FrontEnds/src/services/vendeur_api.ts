import { request } from './api';

export interface VendeurViewOut {
  id: number;
  noms: string;
  telephone: string;
  id_nat: string;
  marche: string;
}

export interface PaymentHistoryItem {
  id: number;
  taxe_nom: string;
  montant: number;
  date_paiement: string;
  reference: string;
}

export interface VendeurMe {
  id: number;
  nom: string;
  prenom: string;
  identifiant_national: string;
  telephone: string;
  emplacement: string;
  status: string;
  total_paye: number;
  derniere_collecte: string | null;
  history: PaymentHistoryItem[];
}

export interface VendeurStatusOut extends VendeurViewOut {
  status: string;
  derniere_collecte: string | null;
  montant_total: number;
}

export const vendeurApi = {
  getListView: async (q: string = '', skip: number = 0, limit: number = 10): Promise<VendeurViewOut[]> => {
    const params = new URLSearchParams({
      q,
      skip: skip.toString(),
      limit: limit.toString(),
    });
    return request(`/vendeurs/view?${params}`);
  },

  getAll: async (skip: number = 0, limit: number = 10, period: string = 'daily'): Promise<VendeurStatusOut[]> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      period
    });
    return request(`/vendeurs/?${params}`);
  },

  getMe: async (): Promise<VendeurMe> => {
    return request('/vendeurs/me');
  }
};
