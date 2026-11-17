import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Admin.css';
import {
  fetchProducts, fetchSettings, login, saveProducts, saveSettings,
  uploadImage, getToken, setToken, fetchPublishStatus, publish
} from '../api';

const LIVE_URL = 'https://sugibakery.netlify.app';

const BADGE_STYLES = [
  { value: 'hot', label: 'Hot / Spicy (red)' },
  { value: 'crispy', label: 'Crispy (gold)' },
  { value: 'classic', label: 'Classic (dark)' }
];

const blankProduct = () => ({
  id: Date.now(),
  name: 'New snack',
  emoji: '🥨',
  tag: '',
  tagStyle: 'classic',
  description: '',
  image: '',
  sizes: [
    { name: '250g', price: 60 },
    { name: '500g', price: 120 },
    { name: '1kg', price: 240 }
  ]
});

/* ============================================================
   Login
   ============================================================ */

function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token } = await login(password);
      setToken(token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark">🥨</span>
        <h1>Sugi Bakery</h1>
        <p>Admin panel</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          autoFocus
          autoComplete="current-password"
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

/* ============================================================
   Product editor
   ============================================================ */

/** Upload / preview / clear one image or GIF. */
function MediaPicker({ id, label, hint, value, onChange, fallback, accept }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const { path } = await uploadImage(file);
      onChange(path);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="field">
      <span>{label}</span>
      <div className="photo-row">
        <div className="photo-preview">
          {value ? <img src={value} alt="" /> : <span className="photo-empty">{fallback}</span>}
        </div>

        <div className="photo-actions">
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            id={id}
            className="file-input"
            onChange={handleFile}
          />

          <div className="photo-buttons">
            <label htmlFor={id} className="btn btn-ghost">
              {uploading ? 'Uploading…' : value ? '⬆ Replace' : '⬆ Upload'}
            </label>
            {value && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange('')}>
                Remove
              </button>
            )}
          </div>

          <input
            className="photo-path"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/example.webp"
          />
          {error && <div className="field-error">{error}</div>}
          <small>{hint}</small>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ product, onChange }) {
  const set = (key, value) => onChange({ ...product, [key]: value });

  const setSize = (index, key, value) => {
    const sizes = product.sizes.map((s, i) =>
      i === index ? { ...s, [key]: key === 'price' ? value.replace(/[^\d]/g, '') : value } : s
    );
    set('sizes', sizes);
  };

  const addSize = () => set('sizes', [...product.sizes, { name: '', price: 0 }]);

  const removeSize = (index) =>
    set('sizes', product.sizes.filter((_, i) => i !== index));

  return (
    <div className="editor">
      <div className="editor-head">
        <h2>{product.name || 'Untitled'}</h2>
        <span className="editor-id">ID {product.id}</span>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input value={product.name} onChange={(e) => set('name', e.target.value)} />
        </label>

        <label className="field field-sm">
          <span>Emoji (fallback)</span>
          <input
            value={product.emoji}
            onChange={(e) => set('emoji', e.target.value)}
            maxLength={4}
          />
        </label>
      </div>

      <label className="field">
        <span>Description</span>
        <textarea
          rows={3}
          value={product.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Badge text <em>(leave empty for none)</em></span>
          <input
            value={product.tag}
            onChange={(e) => set('tag', e.target.value)}
            placeholder="e.g. Bestseller"
          />
        </label>

        <label className="field">
          <span>Badge colour</span>
          <select value={product.tagStyle} onChange={(e) => set('tagStyle', e.target.value)}>
            {BADGE_STYLES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </label>
      </div>

      <MediaPicker
        id={`img-${product.id}`}
        label="Photo"
        hint="JPG, PNG, WebP or AVIF · up to 15 MB"
        value={product.image || ''}
        onChange={(v) => set('image', v)}
        fallback={product.emoji}
        accept="image/*"
      />

      <MediaPicker
        id={`gif-${product.id}`}
        label="Hover animation (optional)"
        hint="Plays when a customer hovers the card — tap to play on phones. Keep it under ~2 MB and a couple of seconds long, or the page will feel slow."
        value={product.gif || ''}
        onChange={(v) => set('gif', v)}
        fallback="🎞"
        accept="image/gif,image/webp,image/apng"
      />

      <div className="field">
        <span>Sizes &amp; prices</span>
        <div className="sizes">
          {product.sizes.map((size, i) => (
            <div className="size-row" key={i}>
              <input
                value={size.name}
                onChange={(e) => setSize(i, 'name', e.target.value)}
                placeholder="250g"
              />
              <div className="price-input">
                <span>₹</span>
                <input
                  value={size.price}
                  onChange={(e) => setSize(i, 'price', e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => removeSize(i)}
                disabled={product.sizes.length === 1}
                title={product.sizes.length === 1 ? 'A product needs at least one size' : 'Remove size'}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={addSize}>
            + Add size
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Settings editor
   ============================================================ */

function SettingsForm({ settings, onChange }) {
  const set = (key, value) => onChange({ ...settings, [key]: value });

  const setPromo = (i, value) =>
    set('promo', settings.promo.map((p, idx) => (idx === i ? value : p)));

  return (
    <div className="editor">
      <div className="editor-head">
        <h2>Shop settings</h2>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Shop name</span>
          <input value={settings.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className="field">
          <span>Tagline</span>
          <input value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </label>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Phone (as displayed)</span>
          <input value={settings.phone} onChange={(e) => set('phone', e.target.value)} />
        </label>
        <label className="field">
          <span>WhatsApp number <em>(digits only, with country code)</em></span>
          <input
            value={settings.phoneRaw}
            onChange={(e) => set('phoneRaw', e.target.value.replace(/[^\d]/g, ''))}
            placeholder="919677494302"
          />
        </label>
      </div>

      <label className="field">
        <span>Address <em>(one line per row)</em></span>
        <textarea rows={2} value={settings.address} onChange={(e) => set('address', e.target.value)} />
      </label>

      <label className="field">
        <span>Opening hours <em>(one line per row)</em></span>
        <textarea rows={2} value={settings.hours} onChange={(e) => set('hours', e.target.value)} />
      </label>

      <label className="field field-sm">
        <span>Free delivery above (₹)</span>
        <input
          value={settings.freeDeliveryAbove}
          inputMode="numeric"
          onChange={(e) => set('freeDeliveryAbove', e.target.value.replace(/[^\d]/g, ''))}
        />
      </label>

      <div className="field">
        <span>Scrolling banner messages</span>
        <div className="sizes">
          {(settings.promo || []).map((line, i) => (
            <div className="size-row" key={i}>
              <input value={line} onChange={(e) => setPromo(i, e.target.value)} />
              <button
                type="button"
                className="icon-btn"
                onClick={() => set('promo', settings.promo.filter((_, idx) => idx !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => set('promo', [...(settings.promo || []), ''])}
          >
            + Add message
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Admin shell
   ============================================================ */

export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const dragIndex = useRef(null);

  // How much is saved locally but not yet on the live site.
  const refreshPending = useCallback(async () => {
    try {
      setPending(await fetchPublishStatus());
    } catch {
      setPending(null); // git unavailable — the button just stays quiet
    }
  }, []);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([fetchProducts(), fetchSettings()]);
    setProducts(p);
    setSettings({ ...s, promo: s.promo || [] });
    setSelectedId((prev) => prev ?? (p[0] && p[0].id));
    setDirty(false);
    refreshPending();
  }, [refreshPending]);

  useEffect(() => {
    if (authed) load().catch((e) => setStatus({ type: 'error', text: e.message }));
  }, [authed, load]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!dirty) return undefined;
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;
  if (!products || !settings) return <div className="admin-loading">Loading…</div>;

  const selected = products.find((p) => p.id === selectedId);

  const updateProduct = (next) => {
    setProducts((prev) => prev.map((p) => (p.id === next.id ? next : p)));
    setDirty(true);
  };

  const addProduct = () => {
    const product = blankProduct();
    setProducts((prev) => [...prev, product]);
    setSelectedId(product.id);
    setTab('products');
    setDirty(true);
  };

  const deleteProduct = (id) => {
    const product = products.find((p) => p.id === id);
    if (!window.confirm(`Delete "${product.name}"? This can't be undone once you save.`)) return;

    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (id === selectedId) setSelectedId(next[0] ? next[0].id : null);
      return next;
    });
    setDirty(true);
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= products.length) return;
    setProducts((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  };

  const onDrop = (index) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === index) return;

    setProducts((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const [savedProducts, savedSettings] = await Promise.all([
        saveProducts(products),
        saveSettings({ ...settings, freeDeliveryAbove: Number(settings.freeDeliveryAbove) || 0 })
      ]);
      setProducts(savedProducts);
      setSettings({ ...savedSettings, promo: savedSettings.promo || [] });
      setDirty(false);
      setStatus({ type: 'ok', text: 'Saved. Press Publish to put it on the live site.' });
      refreshPending();
    } catch (err) {
      if (err.status === 401) {
        setToken('');
        setAuthed(false);
        return;
      }
      setStatus({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const doPublish = async () => {
    if (dirty) {
      setStatus({ type: 'error', text: 'Save your changes first, then publish.' });
      return;
    }
    if (!window.confirm('This updates the live website that customers see. Continue?')) return;

    setPublishing(true);
    setStatus(null);
    try {
      const result = await publish();
      setStatus({
        type: result.status === 'nothing' ? 'ok' : 'ok',
        text: result.message
      });
      refreshPending();
    } catch (err) {
      if (err.status === 401) {
        setToken('');
        setAuthed(false);
        return;
      }
      setStatus({ type: 'error', text: err.message });
    } finally {
      setPublishing(false);
    }
  };

  const pendingCount = pending
    ? (pending.files ? pending.files.length : 0) + (pending.unpushed || 0)
    : 0;

  const signOut = () => {
    if (dirty && !window.confirm('You have unsaved changes. Sign out anyway?')) return;
    setToken('');
    setAuthed(false);
  };

  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="admin-brand">
          <span className="logo-mark">🥨</span>
          <div>
            <strong>Sugi Bakery</strong>
            <small>Admin</small>
          </div>
        </div>

        <nav className="admin-tabs">
          <button
            className={tab === 'products' ? 'active' : ''}
            onClick={() => setTab('products')}
          >
            Products <span className="count">{products.length}</span>
          </button>
          <button
            className={tab === 'settings' ? 'active' : ''}
            onClick={() => setTab('settings')}
          >
            Shop settings
          </button>
        </nav>

        <div className="admin-actions">
          {dirty && <span className="dirty-dot">Unsaved changes</span>}

          <button className="btn btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>

          <button
            className="btn btn-publish"
            onClick={doPublish}
            disabled={publishing || dirty || pendingCount === 0}
            title={
              dirty ? 'Save your changes first'
                : pendingCount === 0 ? 'The live site is already up to date'
                : `${pendingCount} change${pendingCount === 1 ? '' : 's'} ready to publish`
            }
          >
            {publishing ? 'Publishing…' : '🌐 Publish to live site'}
            {pendingCount > 0 && !publishing && <span className="count">{pendingCount}</span>}
          </button>

          <a className="btn btn-ghost btn-sm" href={LIVE_URL} target="_blank" rel="noopener noreferrer">
            View live ↗
          </a>
          <button className="btn btn-ghost btn-sm" onClick={signOut}>Sign out</button>
        </div>
      </header>

      {status && (
        <div className={`admin-status ${status.type}`} onAnimationEnd={() => setStatus(null)}>
          {status.text}
        </div>
      )}

      {tab === 'products' ? (
        <div className="admin-body">
          <aside className="product-list">
            <div className="list-head">
              <span>Menu order</span>
              <button className="btn btn-primary btn-sm" onClick={addProduct}>+ Add</button>
            </div>

            <p className="list-hint">Drag to reorder — this is the order customers see.</p>

            <ul>
              {products.map((p, i) => (
                <li
                  key={p.id}
                  className={p.id === selectedId ? 'selected' : ''}
                  draggable
                  onDragStart={() => { dragIndex.current = i; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className="grip" title="Drag to reorder">⠿</span>

                  <span className="thumb">
                    {p.image ? <img src={p.image} alt="" /> : p.emoji}
                  </span>

                  <span className="list-text">
                    <strong>{p.name}</strong>
                    <small>
                      {p.sizes.length} size{p.sizes.length === 1 ? '' : 's'} · from ₹
                      {Math.min(...p.sizes.map((s) => Number(s.price) || 0))}
                    </small>
                  </span>

                  <span className="list-tools">
                    <button
                      className="icon-btn"
                      onClick={(e) => { e.stopPropagation(); move(i, -1); }}
                      disabled={i === 0}
                      title="Move up"
                    >↑</button>
                    <button
                      className="icon-btn"
                      onClick={(e) => { e.stopPropagation(); move(i, 1); }}
                      disabled={i === products.length - 1}
                      title="Move down"
                    >↓</button>
                    <button
                      className="icon-btn danger"
                      onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}
                      title="Delete"
                    >🗑</button>
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <main className="editor-pane">
            {selected ? (
              <ProductForm product={selected} onChange={updateProduct} />
            ) : (
              <div className="empty-editor">
                <p>No products yet.</p>
                <button className="btn btn-primary" onClick={addProduct}>+ Add your first product</button>
              </div>
            )}
          </main>
        </div>
      ) : (
        <div className="admin-body single">
          <main className="editor-pane">
            <SettingsForm
              settings={settings}
              onChange={(next) => { setSettings(next); setDirty(true); }}
            />
          </main>
        </div>
      )}
    </div>
  );
}
