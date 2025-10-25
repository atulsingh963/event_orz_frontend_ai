import API from '../utils/api';

export const venueService = {
  getVenues: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const { data } = await API.get(`/venues?${params}`);
    return data;
  },

  getVenueById: async (id) => {
    const { data } = await API.get(`/venues/${id}`);
    return data;
  },

  createVenue: async (venueData) => {
    const { data } = await API.post('/venues', venueData);
    return data;
  }
};
