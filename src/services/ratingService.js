import API from '../utils/api';

export const ratingService = {
  createRating: async (ratingData) => {
    const { data } = await API.post('/ratings', ratingData);
    return data;
  },

  getTalentRatings: async (talentId) => {
    const { data } = await API.get(`/ratings/talent/${talentId}`);
    return data;
  },

  getEventRatings: async (eventId) => {
    const { data } = await API.get(`/ratings/event/${eventId}`);
    return data;
  },

  updateRating: async (id, ratingData) => {
    const { data } = await API.put(`/ratings/${id}`, ratingData);
    return data;
  }
};
