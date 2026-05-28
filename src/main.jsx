import React from 'react'
import ReactDOM from 'react-dom/client'
import { validateEnvironment } from './config/env'
import App from './App'
import './index.css'

// Validate environment variables at startup
validateEnvironment()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
