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

      // Fetch and store user profile
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        });
        localStorage.setItem('user', JSON.stringify(profileResponse.data));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('credentials');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('credentials');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Fetch fresh user data from backend
  fetchUserProfile: async () => {
    try {
      const credentials = authService.getCredentials();
      if (!credentials) return null;

      const token = btoa(`${credentials.email}:${credentials.password}`);
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Get stored credentials
  getCredentials: () => {
    const credentials = localStorage.getItem('credentials');
    return credentials ? JSON.parse(credentials) : null;
  },
};

export default authService;