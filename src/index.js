import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Tiny router: /admin serves the admin panel, everything else the shop.
// Avoids pulling in react-router for two pages.
const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
const isAdmin = path === '/admin';

// The admin is a separate chunk, so customers never download it.
const Admin = lazy(() => import('./admin/Admin'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div style={{ padding: '3rem', fontFamily: 'Poppins, sans-serif', color: '#9fb' }}>Loading admin…</div>}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
