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
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Contact API calls
export const contactAPI = {
  // Get all contacts with pagination
  getAllContacts: (page = 0, size = 9, sortBy = 'firstName', sortDir = 'asc') => {
    return api.get(`/contacts?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  },

  // Search contacts
  searchContacts: (query, page = 0, size = 9) => {
    return api.get(`/contacts/search?query=${query}&page=${page}&size=${size}`);
  },

  // Get single contact
  getContactById: (id) => {
    return api.get(`/contacts/${id}`);
  },

  // Create contact
  createContact: (contactData) => {
    return api.post('/contacts', contactData);
  },

  // Update contact
  updateContact: (id, contactData) => {
    return api.put(`/contacts/${id}`, contactData);
  },

  // Delete contact
  deleteContact: (id) => {
    return api.delete(`/contacts/${id}`);
  },
};

export default api;