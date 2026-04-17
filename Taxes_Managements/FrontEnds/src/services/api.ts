export const API_URL = 'http://localhost:8000';

/**
 * Base request function to handle common logic like headers and error responses.
 */
export async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Une erreur est survenue');
  }

  return data;
}

export const authApi = {
  login: async (identifier: string, password: string) => {
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
    return request('/users/register', {
      method: 'POST',
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
  },
  checkEmail: async (email: string) => {
    return request(`/users/check-email?email=${encodeURIComponent(email)}`);
  },
  forgotPassword: async (email: string) => {
    return request('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  resetPasswordWithToken: async (token: string, newPassword: string) => {
    return request('/users/reset-password-with-token', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  },
  getMe: async () => {
    return request('/users/me');
  }
};

export const signalementsApi = {
  getAll: async () => {
    return request('/signalements/');
  },
  create: async (payload: { sujet: string; description: string }) => {
    return request('/signalements/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateStatus: async (id: number, statut: string) => {
    return request(`/signalements/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    });
  }
};
