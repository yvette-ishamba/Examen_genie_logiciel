const API_URL = 'http://localhost:8000'; // Replace with the actual FastAPI backend URL if different

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

export const usersApi = {
  register: async (payload: any) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        role: payload.role, 
        full_name: payload.fullName, 
        phone_number: payload.phoneNumber,
        email: payload.email,
        password: payload.password,
        identifiant_national: payload.identifiantNational,
        emplacement: payload.emplacement
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du compte');
    }

    return response.json();
  },
  checkEmail: async (email: string) => {
    const response = await fetch(`${API_URL}/users/check-email?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error('Erreur lors de la vérification de l\'email');
    }
    return response.json();
  },
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erreur lors de la demande de réinitialisation');
    }
    return response.json();
  },
  resetPasswordWithToken: async (token: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/users/reset-password-with-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, new_password: newPassword }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erreur lors de la réinitialisation du mot de passe');
    }
    return response.json();
  }
};
