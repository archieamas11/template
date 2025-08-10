import { api } from '@/services/axios.service';

export type User = {
  id: number;
  username: string;
  isAdmin: number;
  avatar: string;
};

export const AuthService = {
  async login(data: { username: string; password: string }) {
    const res = await api.post('auth/login.php', data);
    return res.data as { token: string; user: User };
  },
  async me() {
    const res = await api.get('auth/me.php');
    return res.data as { user: User };
  },
};
