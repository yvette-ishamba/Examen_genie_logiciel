const API_URL = 'http://127.0.0.1:8000'; // Using IP instead of localhost for reliability

export const authApi = {
  login: async (identifier: string, password: string) => {
    // FastAPI often uses form-urlencoded for its default OAuth2 setup
    const formData = new URLSearchParams();
    formData.append('username', identifier);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Identifiant ou mot de passe incorrect');
    }

    return response.json();
  }
};

export const userApi = {
  create: async (userData: any) => {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erreur lors de la création de l\'utilisateur');
    }

    return response.json();
  }
};

export const demandeApi = {
  create: async (data: any) => {
    const response = await fetch(`${API_URL}/demandes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de la demande');
    return response.json();
  },
  
  getPending: async () => {
    const response = await fetch(`${API_URL}/demandes/`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des demandes');
    return response.json();
  },
  
  updateStatus: async (id: number, status: string) => {
    // status: "Acceptee" | "Refusee"
    const response = await fetch(`${API_URL}/demandes/${id}/statut?statut=${status}`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la demande');
    return response.json();
  }
};
