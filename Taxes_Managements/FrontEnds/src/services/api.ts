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
