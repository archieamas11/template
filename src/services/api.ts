import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/backend',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  async login(data: { username: string; password: string }) {
    const res = await api.post('/auth/login.php', data);
    return res.data as { token: string; user: { id: number; username: string; isAdmin: number } };
  },
  async me() {
    const res = await api.get('/auth/me.php');
    return res.data as { user: { id: number; username: string; isAdmin: number } };
  },
};

export default api;
