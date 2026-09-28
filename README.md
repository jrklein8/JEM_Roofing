# JEM Roofing Co. — Website Overhaul

Static site (no build step) for **JEM Roofing Co.**, Wilmington NC.
Bold, near-black design with the JEM forest-green palette: live rain hero, service cards,
storm-response band, team, before/after slider, real dark service-area map, and a quote form.

## Publish as a GitHub Page

1. Merge this branch into `main` (or set the Pages source to this branch).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys on every push to `main`.
   You can also trigger it manually from the **Actions** tab.
4. The site will be live at `https://<owner>.github.io/<repo>/`.

Alternative with no workflow: **Source: Deploy from a branch → `main` / `(root)`**. Both work; the site is plain HTML/CSS/JS.

## Drop in the real photos

Photos from the current site live at `www.jemroofingco.com` (Squarespace). Save them into
`assets/img/` using the exact filenames below — the page picks them up automatically.
Until a file exists, each slot falls back to a styled gradient / initials block, so
nothing looks broken while you collect them.

See [`assets/img/README.md`](assets/img/README.md) for the full list.

## Brand tokens

All colors and fonts live in one place: the `:root` block at the top of `css/base.css`.
The palette is pulled from the JEM logo: forest green `#0F4A17`, sage green `#5A7D55`,
sage grey `#A9B1A9`, near-black `#0A0F0B`. A brighter green `#2E8B3E` is used only for
buttons and highlights on dark backgrounds. Swap the hex values there and the whole site updates.

The real logo is `assets/img/logo.png`. Its built-in white outline lets it sit on both the
light and dark backgrounds, so the same file is used everywhere.

## Service area map

Leaflet (vendored in `assets/vendor/leaflet/`) on Esri's free World Dark Gray basemap, with
automatic fallbacks to OpenStreetMap and then to a drawn coastline if tile hosts are blocked.
Town coordinates live in `js/map.js`.

## Contact form

The form posts to Formspree. Replace `YOUR_FORM_ID` in the `<form action="…">` in
`index.html` with a real endpoint (free at formspree.io), or point it at any form backend.

## Previews

Screenshots from the QA pass live in [`previews/`](previews/).

## Cache busting

Stylesheet and script links in `index.html` carry a `?v=N` query string. Bump the number
whenever you change CSS or JS so phones and browsers fetch the new files instead of a cached copy.
