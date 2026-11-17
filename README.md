# Sugi Bakery

Storefront + admin panel for Sugi Bakery, Kanyakumari.

## Running it

```bash
npm install
npm start
```

That starts both processes at once:

| URL                              | What it is                              |
| -------------------------------- | --------------------------------------- |
| http://localhost:3000            | The shop                                |
| http://localhost:3000/admin      | The admin panel                         |
| http://localhost:4000            | The API (the shop talks to this)        |

To run them separately: `npm run web` (shop only) and `npm run server` (API only).

## The admin panel

Open **http://localhost:3000/admin** and sign in with the password from `.env`.

From there you can:

- **Edit products** — name, description, badge text and colour, sizes and prices
- **Add, delete and reorder** — drag a product in the left list (or use ↑ ↓) to change
  the order customers see
- **Upload photos** — replaces the product image; files land in `server/uploads/`
- **Add a hover animation** — upload a GIF under "Hover animation" and the card plays it
  when a customer hovers (see below)
- **Edit shop settings** — WhatsApp number, address, opening hours, the free-delivery
  threshold, and the scrolling banner messages

Changes go live for everyone as soon as you hit **Save changes**.

### Hover animations (GIFs)

Each product can have an optional GIF on top of its still photo. Upload one in the
admin under **Hover animation**, and on the shop:

- hovering the card cross-fades from the photo to the GIF
- a small **GIF** hint badge appears on cards that have one
- on phones, where there is no hover, **tapping the photo** plays it
- the file is only downloaded the first time someone hovers, never on page load

Keep GIFs small — around 2 MB and a couple of seconds. A GIF is many times larger than
a photo, and a heavy one makes the first hover feel sluggish. The upload limit is 15 MB.
Leave the field empty for products that shouldn't animate.

### The password

The admin password lives in the `.env` file in the project root:

```
ADMIN_PASSWORD=your-password-here
```

`npm start` reads it automatically. To change the password, edit that one line and
restart the server.

**`.env` is listed in `.gitignore`** — keep it that way, and never commit or share it.
If no `.env` exists the password falls back to `sugi-admin` and the server prints a
warning on startup.

When deploying, most hosts (Render, Railway, Fly.io) let you set `ADMIN_PASSWORD` as an
environment variable in their dashboard instead of uploading `.env`. A real environment
variable always takes priority over the file.

## Where the data lives

| File                          | Contents                                  |
| ----------------------------- | ----------------------------------------- |
| `server/data/products.json`   | The live menu — **the source of truth**    |
| `server/data/settings.json`   | Shop details, banner messages              |
| `server/uploads/`             | Photos uploaded through the admin          |
| `src/defaultData.js`          | Offline fallback, bundled at build time    |
| `.env`                        | Admin password — **never commit this**     |

Back up `server/data/` and `server/uploads/` — that's your whole shop.

`src/defaultData.js` is only used if the API can't be reached, so the shop shows a menu
instead of an empty page. It is a snapshot, so it can drift from the live data; it is
not used when the server is running.

## Going live

The shop needs a host that runs **Node**, not static hosting, because the admin writes
to disk. Render, Railway, Fly.io or any small VPS will do.

```bash
npm run build          # builds the shop into build/
ADMIN_PASSWORD=... node server/index.js
```

When `build/` exists the API server also serves the shop, so one process handles
everything on one port.

Before going live:

1. Make sure `ADMIN_PASSWORD` is set (via `.env` or your host's dashboard).
2. Serve over **HTTPS** — the admin password is sent in the request body.
3. Point the two absolute URLs in `public/index.html` (`og:image`, `og:url`) at your
   real domain, or WhatsApp link previews won't render.

## Changing the colours

The whole palette comes from one block of channel tokens at the top of `src/App.css`:

```css
--primary-rgb: 21, 128, 61;    /* forest green */
--primary-2-rgb: 101, 163, 13; /* olive-lime   */
--accent-rgb: 234, 179, 8;     /* gold         */
```

Edit those and the entire site re-themes — buttons, glows, borders, badges and prices.

## Project layout

```
server/
  index.js            Express API (auth, products, settings, uploads)
  data/               JSON storage
  uploads/            uploaded photos
src/
  App.js              the shop
  api.js              API client
  constants.js        shop-settings context
  defaultData.js      offline fallback
  components/         storefront components
  admin/              the admin panel
```
