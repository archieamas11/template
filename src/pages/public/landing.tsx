import { Link } from 'react-router-dom';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';

export function LandingPage() {
	return (
		<div className="relative min-h-screen w-full">
			{/* Midnight Mist */}
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage: `
            radial-gradient(circle at 50% 100%, var(--gradient-layer-1) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, var(--gradient-layer-2) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, var(--gradient-layer-3) 0%, transparent 80%)
          `,
				}}
			/>
			<div className="relative z-10 flex min-h-screen flex-col">
				<header className="border-b">
					<nav className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4">
						<div className="flex flex-1 items-center">
							<Link className="font-bold text-lg" to="/">
								Acme
							</Link>
						</div>
						<ul className="hidden flex-1 items-center justify-center gap-6 md:flex">
							<li>
								<a className="hover:underline" href="#features">
									Features
								</a>
							</li>
							<li>
								<a className="hover:underline" href="#pricing">
									Pricing
								</a>
							</li>
							<li>
								<a className="hover:underline" href="#about">
									About
								</a>
							</li>
						</ul>
						<div className="flex flex-1 items-center justify-end gap-2">
							<ThemeToggleButton buttonClassName="mr-2 rounded-full" buttonVariant={'outline'} start="top-right" variant="circle-blur" />
							<Link className="inline-flex h-9 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm" to="/login">
								Login
							</Link>
						</div>
					</nav>
				</header>
				<main className="flex flex-1 items-center justify-center">
					<section className="mx-auto max-w-6xl px-4 py-20 text-center">
						<h1 className="font-extrabold text-4xl tracking-tight md:text-5xl">Build modern dashboards fast</h1>
						<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
							Starter template with React, TypeScript, Tailwind, and a PHP backend. Secure auth and protected routes included.
						</p>
						<div className="mt-8 flex items-center justify-center gap-3">
							<Link className="inline-flex h-10 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground text-sm" to="/login">
								Get Started
							</Link>
							<a className="inline-flex h-10 items-center rounded-md border px-5 font-medium text-sm" href="#features">
								Learn more
							</a>
						</div>
					</section>
				</main>
				<footer className="border-t">
					<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-muted-foreground text-sm">
						<p>© {new Date().getFullYear()} Acme Inc.</p>
						<div className="flex items-center gap-4">
							<a className="hover:underline" href="#privacy">
								Privacy
							</a>
							<a className="hover:underline" href="#terms">
								Terms
							</a>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
