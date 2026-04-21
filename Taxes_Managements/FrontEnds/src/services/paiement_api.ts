import { request } from './api';

export interface PaiementCreate {
  vendeur_id: number;
  taxe_id: number;
  montant: number;
  reference: string;
  date_paiement?: string;
}

export interface AgentCollecteSummary {
  agent_id: number;
  agent_name: string;
  total_collected: number;
  nb_collectes: number;
}

export interface CollecteListItem {
  id: number;
  vendeur_name: string;
  taxe_name: string;
  montant: number;
  date_paiement: string;
  reference: string;
  agent_name: string;
}

export interface CollecteListResponse {
  items: CollecteListItem[];
  total: number;
  page: number;
  pages: number;
}

export const paiementApi = {
  create: async (payload: PaiementCreate) => {
    return request('/paiements/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getByAgent: async (): Promise<AgentCollecteSummary[]> => {
    return request('/paiements/by-agent');
  },

  getList: async (page: number = 1): Promise<CollecteListResponse> => {
    return request(`/paiements/list?page=${page}`);
  },
};
