import { useEffect } from 'react';
import { useLogout } from '@/hooks/use-logout';

export function LogoutPage() {
	const logout = useLogout();

	useEffect(() => {
		logout();
	}, [logout]);

	return null;
}

export default LogoutPage;
