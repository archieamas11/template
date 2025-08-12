import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppRoutes } from '@/routes';
import queryClient from '@/store/query-client';

const rootEl = document.getElementById('root');
if (rootEl) {
	createRoot(rootEl).render(
		<StrictMode>
			<ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
				<QueryClientProvider client={queryClient}>
					<AppRoutes />
					<Toaster position="top-right" richColors />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</ThemeProvider>
		</StrictMode>,
	);
}
