import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider autoHideDuration={3000} maxSnack={5} anchorOrigin={
      {
        vertical: window.innerWidth < 768 ? 'top' : 'bottom',
        horizontal: window.innerWidth < 768 ? 'center' : 'left'
      }
    }>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SnackbarProvider>
  </StrictMode>,
)
