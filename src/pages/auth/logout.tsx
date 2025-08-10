import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    const id = setTimeout(() => navigate('/login', { replace: true }), 50);
    return () => clearTimeout(id);
  }, [navigate]);

  return null;
}

export default LogoutPage;
