# Wavelength

A dark-themed podcast app UI, built as a small late-night-radio inspired listening experience — plum-black background, amber dial-glow accent, and animated waveform bars used throughout as the visual signature.

## Features

- Home feed with a "Continue listening" hero and horizontal show shelves
- Search by show, host, or genre
- Library of followed shows (follow/unfollow from any show page)
- Show pages listing all episodes
- Dedicated episode detail pages with full show notes, like button, and a live waveform progress view
- Persistent bottom player bar with play/pause/skip, volume, like, and an "Up Next" queue drawer
- Responsive down to mobile

All show and episode content is original placeholder content — no real podcasts, hosts, or audio are used.

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
