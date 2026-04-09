import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
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

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login:          (email, password)              => api.post('/auth/login', { email, password }),
  register:       (data)                         => api.post('/auth/register', data),
  me:             ()                             => api.get('/auth/me'),
  updatePassword: (currentPassword, newPassword) => api.put('/auth/update-password', { currentPassword, newPassword }),
};

export const studentAPI = {
  getAll:  ()                => api.get('/students'),
  getOne:  (id)              => api.get(`/students/${id}`),
  create:  (data)            => api.post('/students', data),
  update:  (id, data)        => api.put(`/students/${id}`, data),
  delete:  (id)              => api.delete(`/students/${id}`),
  assign:  (id, volunteerId) => api.put(`/students/${id}/assign`, { volunteerId }),
};

export const userAPI = {
  getAll:        (params = {})  => api.get('/users', { params }),
  getVolunteers: ()             => api.get('/users', { params: { role: 'volunteer' } }),
  getOne:        (id)           => api.get(`/users/${id}`),
  update:        (id, data)     => api.put(`/users/${id}`, data),
  setStatus:     (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  delete:        (id)           => api.delete(`/users/${id}`),
};

export const assessmentAPI = {
  getByStudent: (studentId) => api.get('/assessments', { params: { student: studentId } }),
  getOne:       (id)        => api.get(`/assessments/${id}`),
  create:       (data)      => api.post('/assessments', data),
  update:       (id, data)  => api.put(`/assessments/${id}`, data),
  delete:       (id)        => api.delete(`/assessments/${id}`),
};

export const activityAPI = {
  getAll:  (params = {}) => api.get('/activities', { params }),
  getOne:  (id)          => api.get(`/activities/${id}`),
  create:  (data)        => api.post('/activities', data),
  update:  (id, data)    => api.put(`/activities/${id}`, data),
  verify:  (id)          => api.put(`/activities/${id}/verify`),
  delete:  (id)          => api.delete(`/activities/${id}`),
};

export const sessionAPI = {
  getAll:   (params = {}) => api.get('/sessions', { params }),
  getOne:   (id)          => api.get(`/sessions/${id}`),
  create:   (data)        => api.post('/sessions', data),
  update:   (id, data)    => api.put(`/sessions/${id}`, data),
  complete: (id, data)    => api.put(`/sessions/${id}/complete`, data),
  cancel:   (id, notes)   => api.put(`/sessions/${id}/cancel`, { notes }),
  delete:   (id)          => api.delete(`/sessions/${id}`),
};