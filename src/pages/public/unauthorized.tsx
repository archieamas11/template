import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-lg p-6 text-center">
      <h1 className="font-bold text-2xl">Unauthorized</h1>
      <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link className="inline-flex h-10 items-center rounded-md border px-5 font-medium text-sm" to="/">
          Go home
        </Link>
        <Link className="inline-flex h-10 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground text-sm" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
