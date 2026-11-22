import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WriteApp from './WriteApp.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import './write.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <WriteApp />
    </ErrorBoundary>
  </StrictMode>,
)
