/**
 * API Service Functions
 * All API calls organized by feature
 */

import api from './axios';

// ── AUTH ───────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ── USER / PROFILE ─────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getNotifications: () => api.get('/users/notifications'),
  markRead: (id) => api.put(`/users/notifications/${id}/read`),
  markAllRead: () => api.put('/users/notifications/read-all'),
  getAllUsers: (params) => api.get('/users/all', { params }),
  getStats: () => api.get('/users/stats'),
};

// ── ASSESSMENTS ────────────────────────────────────────────────
export const assessmentAPI = {
  start: () => api.get('/assessments/start'),
  submit: (id, answers) => api.post(`/assessments/${id}/submit`, { answers }),
  getMyResults: () => api.get('/assessments/my-results'),
  getResult: (id) => api.get(`/assessments/${id}/result`),
};

// ── RECOMMENDATIONS ────────────────────────────────────────────
export const recommendationAPI = {
  generate: () => api.post('/recommendations/generate'),
  getMy: () => api.get('/recommendations/my'),
  getStreams: () => api.get('/recommendations/streams'),
};

// ── COLLEGES ──────────────────────────────────────────────────
export const collegeAPI = {
  getAll: (params) => api.get('/colleges', { params }),
  getOne: (id) => api.get(`/colleges/${id}`),
  getFilters: () => api.get('/colleges/filters/options'),
  getByStream: (stream) => api.get(`/colleges/stream/${stream}`),
};