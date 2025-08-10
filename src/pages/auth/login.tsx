import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthService } from '@/services/auth.api';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // If token exists, validate and redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const promise = AuthService.me();
    toast.promise(promise, {
      loading: 'Checking session…',
      success: 'Already signed in',
      error: 'Session expired, please login',
    });

    promise
      .then(({ user }) => {
        if (Number(user?.isAdmin) === 1) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
  }, [navigate]);

  const onSubmit = async (values: FormValues) => {
    setErrorMessage(null);

    const promise = AuthService.login(values);

    toast.promise(promise, {
      loading: 'Signing in…',
      success: 'Welcome back',
      error: 'Login failed. Please try again.',
    });

    try {
      const { token, user } = await promise;
      localStorage.setItem('token', token);
      if (Number(user?.isAdmin) === 1) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      let message = 'Login failed. Please try again.';
      if (typeof error === 'object' && error !== null) {
        const maybeAxiosErr = error as { response?: { data?: { message?: string } } };
        if (maybeAxiosErr.response?.data?.message) {
          message = String(maybeAxiosErr.response.data.message);
        }
      }
      setErrorMessage(message);
    }
  };

  return (
    <div className="mx-auto grid max-w-sm gap-6 p-6">
      <h1 className="text-center font-bold text-2xl">Login</h1>
      {errorMessage && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">{errorMessage}</div>}
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="grid gap-1">
          <span>Username</span>
          <input aria-label="username" autoComplete="username" className="h-10 rounded-md border px-3" type="text" {...register('username')} />
          {errors.username && <span className="text-destructive text-sm">{errors.username.message}</span>}
        </label>
        <label className="grid gap-1">
          <span>Password</span>
          <input
            aria-label="password"
            autoComplete="current-password"
            className="h-10 rounded-md border px-3"
            type="password"
            {...register('password')}
          />
          {errors.password && <span className="text-destructive text-sm">{errors.password.message}</span>}
        </label>
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground text-sm"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
