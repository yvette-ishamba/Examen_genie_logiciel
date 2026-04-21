import { request } from './api';

export interface TaxeOut {
  id: number;
  nom: string;
  montant_base: number;
  frequence: string;
  description?: string | null;
  prix_libre: boolean;
}

export interface TaxeCreate {
  nom: string;
  montant_base: number;
  frequence: string;
  description?: string;
  prix_libre: boolean;
}

export interface TaxeBase {
  nom: string;
  montant_base: number;
  frequence: string;
  description?: string | null;
  prix_libre: boolean;
}

export const taxeApi = {
  /** Fetch all taxes from the database view */
  getView: async (): Promise<TaxeOut[]> => {
    return request('/taxes/view');
  },

  /** Fetch all taxes from the database */
  getAll: async (): Promise<TaxeOut[]> => {
    return request('/taxes/');
  },

  /** Create a new tax in the database */
  create: async (payload: TaxeCreate): Promise<TaxeOut> => {
    return request('/taxes/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
