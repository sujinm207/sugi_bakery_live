import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Admin from './admin/Admin';

// Tiny router: /admin serves the admin panel, everything else the shop.
// Avoids pulling in react-router for two pages.
const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
const isAdmin = path === '/admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isAdmin ? <Admin /> : <App />}
  </React.StrictMode>
);
