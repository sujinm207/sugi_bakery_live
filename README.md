# Sugi Bakery

Storefront + admin panel for Sugi Bakery, Kanyakumari.

- **Live shop:** https://sugibakery.netlify.app
- **Admin:** runs on your own computer (see below)

## How this works

The live site is **static** — Netlify serves plain files, which is why it's fast and
free. The menu is baked into the site when Netlify builds it.

So editing the shop is a two-step rhythm, both done in the admin:

1. Make your changes and press **Save changes** — the local site updates at once
2. Press **Publish to live site** — Netlify rebuilds and the live site updates in
   about a minute

The Publish button shows a number: how many changes are saved on your computer but
not yet live. When it reads zero, the live site matches what you see.

Your product data is stored in `src/data/` and versioned in git, so every change is
saved forever and you can always go back.

## Running it

```bash
npm install
npm start
```

| URL                          | What it is      |
| ---------------------------- | --------------- |
| http://localhost:3000        | The shop        |
| http://localhost:3000/admin  | The admin panel |
| http://localhost:4000        | The local API   |

To run them separately: `npm run web` (shop only) and `npm run server` (API only).

> Changes under `src/` reload instantly. If you edit anything in `server/`, stop and
> restart — Node doesn't hot-reload.

## The admin panel

Open **http://localhost:3000/admin** and sign in with the password from `.env`.

- **Edit products** — name, description, badge text and colour, sizes and prices
- **Add, delete and reorder** — drag in the left list (or use ↑ ↓) to set the order
  customers see
- **Upload photos** — saved into `public/uploads/`
- **Add a hover animation** — upload a GIF and the card plays it on hover
- **Edit shop settings** — WhatsApp number, address, opening hours, free-delivery
  threshold, and the scrolling banner messages

Click **Save changes** and the local site updates immediately. To put it on the live
site, double-click `publish.bat`.

### Hover animations (GIFs)

Each product can have an optional GIF over its still photo:

- hovering the card cross-fades from the photo to the GIF
- a small **GIF** hint badge appears on cards that have one
- on phones, where there is no hover, **tapping the photo** plays it
- the file is only downloaded on first hover, never on page load

Keep GIFs small — around 2 MB and a couple of seconds. The upload limit is 15 MB.

### The password

The admin password lives in `.env` in the project root:

```
ADMIN_PASSWORD=your-password-here
```

`.env` is in `.gitignore`, so it stays on your machine and never reaches GitHub.
Change the password by editing that line and restarting.

Because the admin only ever runs on your own computer, it isn't exposed to the
internet — the live Netlify site has no admin and no API.

## Where the data lives

| Path                     | Contents                                     |
| ------------------------ | -------------------------------------------- |
| `src/data/products.json` | The menu — **the source of truth**            |
| `src/data/settings.json` | Shop details, banner messages                 |
| `public/uploads/`        | Photos and GIFs uploaded through the admin    |
| `.env`                   | Admin password — **never committed**          |

These live inside the app on purpose: the build imports them directly, so what you
save in the admin is exactly what gets published. No second copy to keep in sync.

They're committed to git, so your menu history is your backup.

## Publishing

Press **Publish to live site** in the admin. It commits your menu and uploads, pushes
to GitHub, and Netlify rebuilds automatically.

It only ever publishes `src/data/` and `public/uploads/` — your menu and your photos.
Code changes are deliberately left alone, so the button can never push a half-finished
edit. Those still go through GitHub Desktop or `git push`.

### If Publish asks you to sign in

The first time, GitHub may refuse because the server has no saved credentials. Two
ways to fix it permanently:

**Easiest:** open GitHub Desktop once and press **Push origin**.

**Most reliable:** give the server its own token.

1. Go to https://github.com/settings/personal-access-tokens/new
2. **Token name:** `sugi-bakery-publish`
3. **Expiration:** 90 days (or whatever you prefer — you'll just repeat this when it runs out)
4. **Repository access:** *Only select repositories* → pick **sugi_bakery_live**
5. **Permissions** → *Repository permissions* → **Contents** → **Read and write**
6. **Generate token**, then copy it — GitHub shows it only once
7. Open `.env` in Notepad and paste it after `GITHUB_TOKEN=`
8. Restart the server (`Ctrl+C` in the terminal, then `npm start`)

This token can only touch this one repository's files — it can't read your other
repos, change settings or delete anything. If it ever leaks, revoke it on the same
page and make a new one.

`.env` is git-ignored, so the token stays on your computer. After that, Publish works
on its own with nothing to click through.

### Doing it by hand

`publish.bat` (double-click) or:

```bash
git add -A
git commit -m "Update shop menu"
git push
```

## Changing the colours

The whole palette comes from one block of channel tokens at the top of `src/App.css`:

```css
--primary-rgb: 21, 128, 61;    /* forest green */
--primary-2-rgb: 101, 163, 13; /* olive-lime   */
--accent-rgb: 234, 179, 8;     /* gold         */
```

Edit those and the entire site re-themes — buttons, glows, borders, badges and prices.

## If you ever want the admin online

Right now the admin is local-only, which is free and keeps it private. Putting it on
the internet means running the Node server on a host like Render, Railway or Fly.io,
because it needs to write files. Two things to know before doing that: free tiers wipe
uploaded files whenever the server restarts, so you'd need a paid persistent disk
(around $7/month); and the admin would then be reachable from the internet, so the
password would need to be strong and served over HTTPS.

## Project layout

```
server/
  index.js            Local API (auth, products, settings, uploads)
src/
  App.js              the shop
  api.js              API client (development only)
  constants.js        shop-settings context
  defaultData.js      imports src/data/*.json into the build
  data/               products.json + settings.json  <- your menu
  components/         storefront components
  admin/              the admin panel (separate bundle)
public/
  images/             original product photos
  uploads/            photos and GIFs added via the admin
```
