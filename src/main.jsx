import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AdminProvider } from './lib/admin.jsx';
import { applyTheme } from './lib/applyTheme.js';
import { theme } from './data/theme.js';
import './styles.css';

applyTheme(theme);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </React.StrictMode>,
);
