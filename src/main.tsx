import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider } from '@/contexts/AuthContext'
import { SiteProvider } from '@/contexts/SiteContext'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <SiteProvider>
            <App />
          </SiteProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
