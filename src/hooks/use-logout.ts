import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    // 🧹 Clear authentication token
    localStorage.removeItem('token');
    
    // 📢 Notify localStorage change to trigger reactive hooks
    window.dispatchEvent(new Event('localStorage-change'));
    
    // 🧹 Clear all React Query cache
    queryClient.clear();
    
    // 🏠 Navigate to home/login
    navigate('/', { replace: true });
  };

  return logout;
}
