# JEM Roofing Co. — Website Overhaul

Static site (no build step) for **JEM Roofing Co.**, Wilmington NC.
Two design directions are included so the client can pick one:

| Page | Concept | Vibe |
|------|---------|------|
| `index.html` | **A — "Stormproof"** | Bold, dark, cinematic. Big type, live rain hero, high-contrast CTAs. |
| `concept-b.html` | **B — "Coastal Clean"** | Bright, airy, premium-residential. Photo-forward, soft cards. |

A floating switcher (bottom-right) flips between the two on any device.

## Publish as a GitHub Page

1. Merge this branch into `main` (or set the Pages source to this branch).
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys on every push to `main`.
   You can also trigger it manually from the **Actions** tab.
4. The site will be live at `https://<owner>.github.io/<repo>/`.

Alternative with no workflow: **Source: Deploy from a branch → `main` / `(root)`**. Both work; the site is plain HTML/CSS/JS.

## Drop in the real photos

Photos from the current site live at `www.jemroofingco.com` (Squarespace). Save them into
`assets/img/` using the exact filenames below — the pages pick them up automatically.
Until a file exists, each slot falls back to a styled gradient / initials block, so
nothing looks broken while you collect them.

See [`assets/img/README.md`](assets/img/README.md) for the full list.

## Brand tokens

All colors and fonts live in one place: the `:root` block at the top of `css/base.css`.
Swap the hex values there and both concepts update.

## Contact form

The form posts to Formspree. Replace `YOUR_FORM_ID` in the `<form action="…">` on both
pages with a real endpoint (free at formspree.io), or point it at any form backend.

## Previews

Screenshots from the QA pass live in [`previews/`](previews/) (desktop hero, services, storm band, and mobile heroes for both concepts).
