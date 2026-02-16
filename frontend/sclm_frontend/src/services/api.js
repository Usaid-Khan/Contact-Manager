import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Contact API calls
export const contactAPI = {
  getAllContacts: (page = 0, size = 9, sortBy = 'firstName', sortDir = 'asc') => {
    return api.get(`/contacts?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },
  searchContacts: (query, page = 0, size = 9) => {
    return api.get(`/contacts/search?query=${query}&page=${page}&size=${size}`);
  },
  getContactById: (id) => {
    return api.get(`/contacts/${id}`);
  },
  createContact: (contactData) => {
    return api.post('/contacts', contactData);
  },
  updateContact: (id, contactData) => {
    return api.put(`/contacts/${id}`, contactData);
  },
  deleteContact: (id) => {
    return api.delete(`/contacts/${id}`);
  },
};

export default api;