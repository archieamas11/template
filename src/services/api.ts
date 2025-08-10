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
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
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

export type Resident = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  age: number;
  gender: 'Male' | 'Female';
  address: string;
  barangay: string;
  contact_number: string | null;
  occupation: string | null;
  civil_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  created_by: number;
  created_at: string | null;
  updated_at: string | null;
};

export type ResidentsQuery = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Resident;
  sortDir?: 'asc' | 'desc';
  gender?: 'Male' | 'Female';
  barangay?: string;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export const ResidentsService = {
  async list(params: ResidentsQuery) {
    const res = await api.get('/residents/index.php', { params });
    return res.data as Paginated<Resident>;
  },
  async create(payload: Omit<Resident, 'id' | 'created_at' | 'updated_at'>) {
    const res = await api.post('/residents/create.php', payload);
    return res.data as { message: string; resident: Resident };
  },
  async update(id: number, payload: Partial<Omit<Resident, 'id' | 'created_at' | 'updated_at'>>) {
    const res = await api.put(`/residents/update.php?id=${id}`, payload);
    return res.data as { message: string; resident: Resident };
  },
  async delete(id: number) {
    const res = await api.delete(`/residents/delete.php?id=${id}`);
    return res.data as { message: string };
  },
};

export default api;
