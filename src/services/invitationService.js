import API from '../utils/api';

export const invitationService = {
  getTalents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const { data } = await API.get(`/invitations/talents?${params}`);
    return data;
  },

  sendInvitation: async (invitationData) => {
    const { data } = await API.post('/invitations', invitationData);
    return data;
  },

  getEventInvitations: async (eventId) => {
    const { data } = await API.get(`/invitations/event/${eventId}`);
    return data;
  },

  getMyInvitations: async () => {
    const { data } = await API.get('/invitations/my-invitations');
    return data;
  },

  respondToInvitation: async (id, status) => {
    const { data } = await API.put(`/invitations/${id}/respond`, { status });
    return data;
  },

  removeOrReplaceTalent: async (id, replacementTalentId = null) => {
    const { data } = await API.put(`/invitations/${id}/remove`, { replacementTalentId });
    return data;
  }
};
