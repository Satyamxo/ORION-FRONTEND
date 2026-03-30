import axios from "axios";

const API_URL = import.meta.env.VITE_EVENT_API;

// GET all events
export const getEventsApi = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// CREATE event
export const createEventApi = async (token, payload) => {
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// GET event responses
export const getEventResponsesApi = async (token, eventId) => {
  const res = await axios.get(
    `${API_URL}/${eventId}/responses`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data.responses;
};

// RESPOND to event
export const respondEventApi = async (token, eventId, response) => {
  const res = await axios.post(
    `${API_URL}/${eventId}/respond`,
    { response },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};