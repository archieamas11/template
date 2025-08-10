import { api } from '@/services/axios.service';

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
    const res = await api.get('residents/index.php', { params });
    return res.data as Paginated<Resident>;
  },
  async create(payload: Omit<Resident, 'id' | 'created_at' | 'updated_at'>) {
    const res = await api.post('residents/create.php', payload);
    return res.data as { message: string; resident: Resident };
  },
  async update(id: number, payload: Partial<Omit<Resident, 'id' | 'created_at' | 'updated_at'>>) {
    const res = await api.put(`residents/update.php?id=${id}`, payload);
    return res.data as { message: string; resident: Resident };
  },
  async delete(id: number) {
    const res = await api.delete(`residents/delete.php?id=${id}`);
    return res.data as { message: string };
  },
};
