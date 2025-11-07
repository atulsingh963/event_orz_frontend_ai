import API from '../utils/api';

export const talentService = {
  getTalents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const { data } = await API.get(`/talents?${params}`);
    return data;
  },
  getTalentProfile: async (id) => {
    const { data } = await API.get(`/talents/${id}`);
    return data;
  }
};
