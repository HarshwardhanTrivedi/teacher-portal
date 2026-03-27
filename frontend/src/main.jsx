import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1c2e',
            color: '#d8d8de',
            border: '1px solid #28283c',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1c1c2e' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#1c1c2e' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
