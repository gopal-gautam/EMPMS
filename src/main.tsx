import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // optional

// Redirect to root on full browser reloads
try {
  const navEntries = (performance.getEntriesByType?.('navigation') ?? []);
  const navType = navEntries.length
    ? (navEntries[0] as PerformanceNavigationTiming).type
    : (performance as any).navigation?.type;

  // Navigation Timing Level 2 returns 'reload' (string). The deprecated API returns 1 for reload.
  if ((navType === 'reload' || navType === 1) && window.location.pathname !== '/') {
    // Use replace so we don't create an extra history entry
    window.location.replace('/');
  }
} catch (err) {
  // Fallback: if detection fails, don't block app from loading
  console.warn('Reload-detection failed:', err);
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} /> {/* optional */}
    </QueryClientProvider>
  </StrictMode>,
)
