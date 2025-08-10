import { useEffect, useMemo, useState } from 'react';
import type { RouteObject } from 'react-router-dom';
import { BrowserRouter, Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/login';
import { AdminDashboardPage } from '@/pages/dashboard/admin';
import { UserDashboardPage } from '@/pages/dashboard/user';
import { LandingPage } from '@/pages/public/landing';
import { UnauthorizedPage } from '@/pages/public/unauthorized';
import { AuthService } from '@/services/api';

function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: number; username: string; isAdmin: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    AuthService.me()
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('token');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, user };
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  return <Outlet />;
}

function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  if (user.isAdmin !== 1) {
    return <Navigate replace to="/unauthorized" />;
  }
  return <Outlet />;
}

function UserRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  // Only non-admins can access user dashboard
  if (user.isAdmin === 1) {
    return <Navigate replace to="/unauthorized" />;
  }
  return <Outlet />;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate replace to="/login" />;
  }
  return user.isAdmin === 1 ? <Navigate replace to="/admin" /> : <Navigate replace to="/dashboard" />;
}

function LoginGate() {
  const { user, loading } = useAuth();
  if (loading) {
    return null;
  }
  if (user) {
    return <RoleRedirect />;
  }
  return <LoginPage />;
}

function RoutesContainer() {
  const routes: RouteObject[] = useMemo(
    () => [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginGate /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <RoleRedirect /> },
          { path: 'admin', element: <AdminRoute />, children: [{ index: true, element: <AdminDashboardPage /> }] },
          { path: 'dashboard', element: <UserRoute />, children: [{ index: true, element: <UserDashboardPage /> }] },
        ],
      },
      { path: '/admin', element: <AdminRoute />, children: [{ index: true, element: <AdminDashboardPage /> }] },
      { path: '/dashboard', element: <UserRoute />, children: [{ index: true, element: <UserDashboardPage /> }] },
      { path: '*', element: <Navigate replace to="/" /> },
    ],
    []
  );

  const element = useRoutes(routes);
  return element;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <RoutesContainer />
    </BrowserRouter>
  );
}
