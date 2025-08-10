import { useEffect, useMemo, useState } from 'react';
import type { RouteObject } from 'react-router-dom';
import { BrowserRouter, Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/login';
import LogoutPage from '@/pages/auth/logout';
import { AdminDashboardPage } from '@/pages/dashboard/admin/admin';
import AdminIntermentCustomerPage from '@/pages/dashboard/admin/interment/customer';
import AdminIntermentDeceasedPage from '@/pages/dashboard/admin/interment/deceased';
import AdminIntermentLotOwnerPage from '@/pages/dashboard/admin/interment/lot-owner';
import AdminSettingsPage from '@/pages/dashboard/admin/settings';
import AdminUsersPage from '@/pages/dashboard/admin/users';
import { UserDashboardPage } from '@/pages/dashboard/user/user';
import { LandingPage } from '@/pages/public/landing';
import { UnauthorizedPage } from '@/pages/public/unauthorized';
import { AuthService } from '@/services/auth.api';

function useAuth() {
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState<{ id: number; username: string; isAdmin: number | string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return;
    }
    AuthService.me()
      .then((data) => {
        if (!cancelled) {
          setAuthUser(data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('token');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAuthLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { authLoading, authUser };
}

function ProtectedRoute() {
  const { authUser, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) {
    return null;
  }
  if (!authUser) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  return <Outlet />;
}

function AdminRoute() {
  const { authUser, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) {
    return null;
  }
  if (!authUser) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  if (Number(authUser.isAdmin) !== 1) {
    return <Navigate replace to="/unauthorized" />;
  }
  return <Outlet />;
}

function UserRoute() {
  const { authUser, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) {
    return null;
  }
  if (!authUser) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }
  // Only non-admins can access user dashboard
  if (Number(authUser.isAdmin) === 1) {
    return <Navigate replace to="/unauthorized" />;
  }
  return <Outlet />;
}

function RoleRedirect() {
  const { authUser } = useAuth();
  if (!authUser) {
    return <Navigate replace to="/login" />;
  }
  return Number(authUser.isAdmin) === 1 ? <Navigate replace to="/admin" /> : <Navigate replace to="/dashboard" />;
}

function LoginGate() {
  const { authUser, authLoading } = useAuth();
  if (authLoading) {
    return null;
  }
  if (authUser) {
    return <RoleRedirect />;
  }
  return <LoginPage />;
}

function RoutesContainer() {
  const routes: RouteObject[] = useMemo(
    () => [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginGate /> },
      { path: '/logout', element: <LogoutPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'interment/customer', element: <AdminIntermentCustomerPage /> },
          { path: 'interment/lot-owner', element: <AdminIntermentLotOwnerPage /> },
          { path: 'interment/deceased', element: <AdminIntermentDeceasedPage /> },
        ],
      },
      {
        path: '/dashboard',
        element: <UserRoute />,
        children: [{ index: true, element: <UserDashboardPage /> }],
      },
      // Protected generic app entry that redirects based on role
      { path: '/app', element: <ProtectedRoute />, children: [{ index: true, element: <RoleRedirect /> }] },
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
