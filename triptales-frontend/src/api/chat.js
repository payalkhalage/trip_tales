import axios from "axios";
const API = "http://localhost:5000/api/chat";

export const startConversation = (token, { postId, otherUserId }) =>
  axios.post(`${API}/start`, { postId, otherUserId }, { headers: { Authorization: `Bearer ${token}` } });

export const listConversations = (token) =>
  axios.get(API, { headers: { Authorization: `Bearer ${token}` } });

export const getMessages = (token, conversationId) =>
  axios.get(`${API}/${conversationId}/messages`, { headers: { Authorization: `Bearer ${token}` } });

export const sendMessage = (token, conversationId, body) =>
  axios.post(`${API}/${conversationId}/message`, { body }, { headers: { Authorization: `Bearer ${token}` } });

export const markRead = (token, conversationId) =>
  axios.post(`${API}/${conversationId}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
