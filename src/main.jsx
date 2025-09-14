import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { UIProvider } from './context/UIContext.jsx'
import ScrollToTop from './components/ScrollToTop.jsx';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter basename="/dash-board">
        <UIProvider>
          <ScrollToTop />
          <App />
        </UIProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )
});