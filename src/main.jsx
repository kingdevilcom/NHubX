import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/site.css'
import { startMonthlyTheme } from './monthlyTheme.js'

const stopTheme = startMonthlyTheme()
import.meta.hot?.dispose(stopTheme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
