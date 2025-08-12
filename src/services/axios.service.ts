import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
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
