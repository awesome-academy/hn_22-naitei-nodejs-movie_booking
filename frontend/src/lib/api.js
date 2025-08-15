import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const permissionAPI = {
  getAll: (params = {}) => api.get('/permissions', { params }),
  getById: (id) => api.get(`/permissions/${id}`),
  create: (data) => api.post('/permissions', data),
  update: (id, data) => api.put(`/permissions/${id}`, data),
  delete: (id) => api.delete(`/permissions/${id}`),
};

export const movieAPI = {
  getAll: (params = {}) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id, confirm = false) => api.delete(`/movies/${id}`, { data: { confirm } }),
  getCategories: () => api.get('/movies/categories'),
};

export const cinemaAPI = {
  getAll: (params = {}) => api.get('/cinemas', { params }),
  getById: (id) => api.get(`/cinemas/${id}`),
  create: (data) => api.post('/cinemas', data),
  update: (id, data) => api.put(`/cinemas/${id}`, data),
  delete: (id) => api.delete(`/cinemas/${id}`),
};

export const roomAPI = {
  getAll: (params = {}) => api.get('/cinema/rooms', { params }),
  getById: (id) => api.get(`/cinema/rooms/${id}`),
  create: (data) => api.post('/cinema/rooms', data),
  update: (id, data) => api.put(`/cinema/rooms/${id}`, data),
  delete: (id) => api.delete(`/cinema/rooms/${id}`),
};

export const scheduleAPI = {
  getById: (id) => api.get(`/schedules/${id}`),
  getByMovieId: (movieId, params = {}) => api.get(`/schedules/movie/${movieId}`, { params }),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

export default api;
