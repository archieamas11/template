import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/auth.api';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  });

  const { isSubmitting } = form.formState;

  // If token exists, validate and redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const promise = AuthService.me();

    toast.promise(promise, {
      loading: 'Checking session…',
      success: (data) => {
        const { user } = data;
        if (Number(user?.isAdmin) === 1) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return 'Already signed in';
      },
      error: (_error) => {
        localStorage.removeItem('token');
        return 'Session expired, please login';
      },
    });
  }, [navigate]);

  const onSubmit = async (values: FormValues) => {
    // 🕒 Await the promise so this async function contains an await expression
    await toast.promise(
      AuthService.login(values)
        .then(({ token, user }) => {
          localStorage.setItem('token', token);
          if (Number(user?.isAdmin) === 1) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
          return { token, user };
        })
        .catch((error) => {
          if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError.response?.data?.message) {
              throw new Error(axiosError.response.data.message);
            }
          }
          throw new Error('Login failed. Please try again.');
        }),
      {
        loading: 'Signing in…',
        success: () => 'Welcome back',
        duration: 500,
        error: (error) => error.message,
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-sm p-8">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        checked={field.value}
                        className="h-4 w-4"
                        id="remember"
                        onChange={(e) => field.onChange(e.target.checked)}
                        type="checkbox"
                      />
                    </FormControl>
                    <FormLabel className="mb-0 cursor-pointer text-muted-foreground" htmlFor="remember">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <a className="text-muted-foreground text-sm hover:underline" href="/forgot-password" tabIndex={0}>
                Forgot password?
              </a>
            </div>

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Signing in…' : 'Login'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
