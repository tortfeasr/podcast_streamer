# Wavelength

A dark-themed podcast app UI, built as a small late-night-radio inspired listening experience — plum-black background, amber dial-glow accent, and animated waveform bars used throughout as the visual signature.

## Features

- Home feed with a "Continue listening" hero and horizontal show shelves (placeholder content)
- Real podcast search via the iTunes Search API — find and open any actual podcast
- Library of followed shows (follow/unfollow from any show page; placeholder shows only)
- Show pages listing all episodes
- Dedicated episode detail pages with full show notes, like button, and a live waveform progress view
- Persistent bottom player bar with play/pause/skip, volume, like, and an "Up Next" queue drawer
- Responsive down to mobile

The Home feed and Library are original placeholder content — no real podcasts there. The **Search** tab is real: it queries the iTunes Search API, and opening a result fetches that show's actual RSS feed and plays real episode audio.

### About real episode playback

Browsers block cross-origin fetches to RSS feeds that don't send CORS headers (most don't), so real playback depends on a CORS proxy. By default the app falls back through a few free public proxies, which are **not reliably available** — in testing they were frequently down, rate-limited, or capped below typical feed sizes, so episode loading will often show an error.

For reliable playback, deploy your own proxy:

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → paste in the contents of [`cloudflare-worker/rss-proxy.js`](cloudflare-worker/rss-proxy.js) → **Deploy** (free tier).
2. Update `ALLOWED_ORIGINS` in that file to match where you host this app, then redeploy.
3. Copy the resulting `*.workers.dev` URL into `OWN_CORS_PROXY` near the top of `src/App.jsx`.

Once set, your own Worker is tried first, before the public fallbacks.

## Running locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys automatically on every push to `main`.

To enable it after pushing this repo to GitHub:

1. Go to the repo's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push (or re-run the workflow from the **Actions** tab).
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

## Tech

- React 18 + Vite
- Tailwind CSS
- [lucide-react](https://lucide.dev/) icons
