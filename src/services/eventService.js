import API from '../utils/api';

export const eventService = {
  createEvent: async (eventData) => {
    const { data } = await API.post('/events', eventData);
    return data;
  },

  getEvents: async () => {
    const { data } = await API.get('/events');
    return data;
  },

  getEventById: async (id) => {
    const { data } = await API.get(`/events/${id}`);
    return data;
  },

  updateEvent: async (id, eventData) => {
    const { data } = await API.put(`/events/${id}`, eventData);
    return data;
  },

  deleteEvent: async (id) => {
    const { data } = await API.delete(`/events/${id}`);
    return data;
  },


  addEventAddOns: async (eventId, addOns) => {
    const { data } = await API.post(`/events/${eventId}/addons`, { addOns });
    return data;
  },

  updateEventStatus: async (eventId, status) => {
    const { data } = await API.put(`/events/${eventId}/status`, { status });
    return data;
  }
};
