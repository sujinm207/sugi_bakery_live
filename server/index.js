/* ============================================================
   Sugi Bakery — admin API
   Stores products + shop settings as JSON files on disk and
   serves uploaded product photos. Start with: npm run server
   ============================================================ */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* Load .env from the project root (no dependency needed).
   A real environment variable always wins, so hosts like Render
   or Railway can set ADMIN_PASSWORD in their dashboard instead. */
function loadEnv() {
  const file = path.join(__dirname, '..', '.env');
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    return; // no .env — fall back to real env vars
  }

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const eq = trimmed.indexOf('=');
    if (eq === -1) return;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    // Strip surrounding quotes if present, but keep characters like @ and $ as-is.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

loadEnv();

const PORT = Number(process.env.API_PORT) || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sugi-admin';

/* Data and uploads live inside the app source on purpose.
   The React build imports src/data/*.json directly and copies
   public/uploads/* into build/, so whatever you save in the admin is
   exactly what gets published to Netlify — no second copy to keep in
   sync, and everything is versioned in git. */
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const BUILD_DIR = path.join(__dirname, '..', 'build');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

if (ADMIN_PASSWORD === 'sugi-admin') {
  console.warn(
    '\n  ⚠  Using the DEFAULT admin password ("sugi-admin").\n' +
    '     Before putting this online, set your own:\n' +
    '       Windows : $env:ADMIN_PASSWORD="your-password"; npm run server\n' +
    '       Mac/Linux: ADMIN_PASSWORD="your-password" npm run server\n'
  );
}

/* ---------- storage helpers ---------- */

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Could not read ${path.basename(file)}:`, err.message);
    }
    return fallback;
  }
}

// Write to a temp file then rename, so a crash mid-write can't
// leave a half-written (unparseable) products.json behind.
function writeJson(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

/* ---------- validation ----------
   The admin is trusted, but a malformed payload would break the
   storefront for every visitor, so shape-check before persisting. */

function cleanSizes(sizes) {
  if (!Array.isArray(sizes)) return [];
  return sizes
    .filter((s) => s && typeof s.name === 'string' && s.name.trim())
    .map((s) => ({
      name: String(s.name).trim().slice(0, 40),
      price: Math.max(0, Math.round(Number(s.price) || 0))
    }));
}

function cleanProducts(input) {
  if (!Array.isArray(input)) throw new Error('products must be an array');

  const seen = new Set();
  return input.map((p, i) => {
    if (!p || typeof p !== 'object') throw new Error(`product ${i} is not an object`);
    if (!String(p.name || '').trim()) throw new Error(`product ${i} needs a name`);

    const sizes = cleanSizes(p.sizes);
    if (sizes.length === 0) throw new Error(`"${p.name}" needs at least one size`);

    let id = Number(p.id);
    if (!Number.isFinite(id) || seen.has(id)) id = Date.now() + i;
    seen.add(id);

    return {
      id,
      name: String(p.name).trim().slice(0, 80),
      emoji: String(p.emoji || '🥨').slice(0, 8),
      tag: String(p.tag || '').trim().slice(0, 40),
      tagStyle: ['hot', 'crispy', 'classic'].includes(p.tagStyle) ? p.tagStyle : 'classic',
      description: String(p.description || '').trim().slice(0, 300),
      image: String(p.image || '').trim().slice(0, 300),
      gif: String(p.gif || '').trim().slice(0, 300), // optional hover animation
      sizes
    };
  });
}

function cleanSettings(input) {
  if (!input || typeof input !== 'object') throw new Error('settings must be an object');

  const str = (v, max, fallback = '') =>
    String(v === undefined || v === null ? fallback : v).trim().slice(0, max);

  const phoneRaw = str(input.phoneRaw, 20).replace(/[^\d]/g, '');
  if (!phoneRaw) throw new Error('WhatsApp number is required');

  return {
    name: str(input.name, 80, 'Sugi Bakery'),
    tagline: str(input.tagline, 140),
    phone: str(input.phone, 40),
    phoneRaw,
    address: str(input.address, 300),
    hours: str(input.hours, 300),
    freeDeliveryAbove: Math.max(0, Math.round(Number(input.freeDeliveryAbove) || 0)),
    promo: Array.isArray(input.promo)
      ? input.promo.map((p) => str(p, 160)).filter(Boolean).slice(0, 10)
      : []
  };
}

/* ---------- auth ----------
   Opaque random tokens held in memory. Restarting the server logs
   admins out, which is fine for a single-shop admin panel. */

const sessions = new Map();
const SESSION_MS = 1000 * 60 * 60 * 8; // 8 hours

function issueToken() {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + SESSION_MS);
  return token;
}

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const expires = sessions.get(token);

  if (!expires || expires < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Not signed in' });
  }
  return next();
}

// Constant-time compare so the password can't be guessed by timing.
function passwordMatches(candidate) {
  const a = Buffer.from(String(candidate || ''));
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/* ---------- uploads ---------- */

const ALLOWED = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif'
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const ext = ALLOWED[file.mimetype] || '.jpg';
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
  }),
  // Generous enough for an animated GIF; still bounded so one
  // upload can't fill the disk.
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED[file.mimetype]) return cb(null, true);
    return cb(new Error('Only JPG, PNG, WebP, GIF or AVIF images are allowed'));
  }
});

/* ---------- app ---------- */

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '1y' }));

app.post('/api/login', (req, res) => {
  if (!passwordMatches(req.body && req.body.password)) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  return res.json({ token: issueToken() });
});

app.post('/api/logout', requireAuth, (req, res) => {
  const token = (req.get('authorization') || '').slice(7);
  sessions.delete(token);
  res.json({ ok: true });
});

// Public: the storefront reads these.
app.get('/api/products', (req, res) => res.json(readJson(PRODUCTS_FILE, [])));
app.get('/api/settings', (req, res) => res.json(readJson(SETTINGS_FILE, {})));

app.put('/api/products', requireAuth, (req, res) => {
  try {
    const products = cleanProducts(req.body);
    writeJson(PRODUCTS_FILE, products);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/settings', requireAuth, (req, res) => {
  try {
    const settings = cleanSettings(req.body);
    writeJson(SETTINGS_FILE, settings);
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/upload', requireAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No image received' });
    return res.json({ path: `/uploads/${req.file.filename}` });
  });
});

// Serve the production build when it exists (npm run build),
// so one process serves both the shop and the admin.
if (fs.existsSync(BUILD_DIR)) {
  app.use(express.static(BUILD_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(BUILD_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n  Sugi Bakery API running on http://localhost:${PORT}`);
  console.log(`  Admin panel:  http://localhost:3000/admin  (while developing)\n`);
});
