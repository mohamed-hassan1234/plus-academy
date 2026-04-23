import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { DashboardAuthProvider } from './context/DashboardAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DashboardAuthProvider>
      <BrowserRouter>
         <App />
      </BrowserRouter>
    </DashboardAuthProvider>
  </StrictMode>,
)
