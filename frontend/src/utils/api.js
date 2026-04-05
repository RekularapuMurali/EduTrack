import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── API helper functions — use these in Week 2 ──────────
export const studentAPI = {
  getAll:  ()         => api.get('/students'),
  getOne:  (id)       => api.get(`/students/${id}`),
  create:  (data)     => api.post('/students', data),
  update:  (id, data) => api.put(`/students/${id}`, data),
  delete:  (id)       => api.delete(`/students/${id}`),
};

export const volunteerAPI = {
  getAll:  ()         => api.get('/users?role=volunteer'),
  create:  (data)     => api.post('/auth/register', { ...data, role: 'volunteer' }),
};

export const sessionAPI = {
  getAll:  ()         => api.get('/sessions'),
  getMine: ()         => api.get('/sessions/mine'),
  create:  (data)     => api.post('/sessions', data),
  update:  (id, data) => api.put(`/sessions/${id}`, data),
};

export const activityAPI = {
  getAll:  ()         => api.get('/activities'),
  create:  (data)     => api.post('/activities', data),
  verify:  (id)       => api.put(`/activities/${id}`, { verified: true }),
};

export const assessmentAPI = {
  getByStudent: (id)  => api.get(`/assessments?student=${id}`),
  create:       (data) => api.post('/assessments', data),
};

export const authAPI = {
  login:    (email, password) => api.post('/auth/login', { email, password }),
  register: (data)            => api.post('/auth/register', data),
};