import API from '../utils/api';

export const authService = {
  login: async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    return data;
  },

  register: async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    return data;
  },

  getMe: async () => {
    const { data } = await API.get('/auth/me');
    return data;
  },

  updateProfile: async (userData) => {
    const { data } = await API.put('/auth/profile', userData);
    return data;
  }
};
