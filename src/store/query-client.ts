import { QueryClient } from '@tanstack/react-query';

// Create a singleton QueryClient with sensible defaults
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// staleTime: 30_000,
			// gcTime: 5 * 60_000,
			// retry: 1,
			// refetchOnWindowFocus: false,

			staleTime: 0, // data becomes stale immediately
			gcTime: 5 * 60 * 1000, // garbage collect after 5 minutes
			retry: 3, // retry failed queries 3 times
			refetchOnWindowFocus: true, // refetch when window/tab gains focus
			refetchOnReconnect: true, // refetch when regaining network connection
			refetchOnMount: true, // refetch when a component mounts
		},
		mutations: {
			retry: 0,
		},
	},
});

export default queryClient;
