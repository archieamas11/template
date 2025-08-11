import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const logout = () => {
		localStorage.removeItem('token');
		window.dispatchEvent(new Event('localStorage-change'));
		queryClient.clear();
		navigate('/', { replace: true });
	};

	return logout;
}
