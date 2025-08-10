import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🧹 Clear auth state then redirect
    localStorage.removeItem('token');
    const id = setTimeout(() => navigate('/login', { replace: true }), 50);
    return () => clearTimeout(id);
  }, [navigate]);

  return null;
}

export default LogoutPage;
