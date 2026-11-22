import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import settings from '../settings.js'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './styles/global.css'

document.title = settings.siteTitle
if (settings.overlayBackground) document.documentElement.style.setProperty('--ovbg', settings.overlayBackground)
if (settings.overlayText) document.documentElement.style.setProperty('--ovtx', settings.overlayText)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
