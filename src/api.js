/* Thin client for the admin API.
   In development, package.json "proxy" forwards /api to :4000. */

const TOKEN_KEY = 'sugi-admin-token';

export const getToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setToken = (token) => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode — the session just won't survive a reload */
  }
};

async function request(url, options = {}) {
  const res = await fetch(url, options);

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = (body && body.error) || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return body;
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

/* ---- public ---- */
export const fetchProducts = () => request('/api/products');
export const fetchSettings = () => request('/api/settings');

/* ---- admin ---- */
export const login = (password) =>
  request('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

export const saveProducts = (products) =>
  request('/api/products', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(products)
  });

export const saveSettings = (settings) =>
  request('/api/settings', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(settings)
  });

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('image', file);

  return request('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` }, // no Content-Type: the browser sets the boundary
    body: form
  });
};
