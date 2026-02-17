import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/user';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);

    return response.data;
  },

  // Login user (HTTP Basic verification)
  login: async (credentials) => {
    const token = btoa(`${credentials.emailOrPhone}:${credentials.password}`);

    const response = await axios.get(
      `${API_BASE_URL}/test`,   // protected endpoint
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // Store credentials (since you're intentionally using Basic)
      const authCredentials = {
        email: credentials.emailOrPhone,
        password: credentials.password,
      };

      localStorage.setItem('credentials', JSON.stringify(authCredentials));
    }

    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('credentials');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('credentials');
  },

  // Get stored credentials
  getCredentials: () => {
    const credentials = localStorage.getItem('credentials');
    return credentials ? JSON.parse(credentials) : null;
  },
};

export default authService;