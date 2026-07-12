# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Wavelength — a dark-themed, static-data podcast app UI (no backend, no real audio). It's a design/UX showcase: a late-night-radio aesthetic (plum-black background, amber accent, animated waveform bars used throughout as the visual signature). All shows/episodes are placeholder content defined in-code; there is no audio playback, only a simulated progress timer.

## Commands

```bash
npm install       # install deps
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # production build
npm run preview   # preview the production build locally
```

There is no test suite and no lint script configured in this repo.

## Deployment

GitHub Pages via GitHub Actions, triggered on push to `main` (see README for the enable-once-per-repo steps in Settings → Pages). `vite.config.js` uses `base: "./"` (relative asset paths) to support being served from a repo subpath.

## Architecture

The entire app lives in one file: `src/App.jsx`. `src/main.jsx` just mounts `<PodcastApp />` from it into `#root`; `src/index.css` is Tailwind's three `@tailwind` directives plus a full-height reset.

Inside `App.jsx`:

- **`C`** — the color palette object (void/surface/elevated/amber/coral/cream/muted/faint/hairline). All color usage in the app goes through this object via inline `style={{ color: C.x }}`, not Tailwind color classes. Tailwind is used only for layout utilities (flex, spacing, sizing); visuals/colors are inline styles.
- **`SHOWS`** — the single hardcoded array that is the app's entire data model (shows → nested episodes). There is no fetching, no API, no persistence; everything derives from this array plus a few pieces of `useState` in the root component (followed show ids, liked episode ids, current playback state).
- **`PodcastApp`** (default export, bottom of file) — the root component and sole owner of state: current view (`active`: home/search/library; `page`: list/show/episode), the currently playing show/episode, `currentTime` (advanced by a `setInterval` in a `useEffect` to simulate playback progress — there is no real `<audio>` element), followed shows, liked episodes, volume, and queue-drawer open state. There is no router — navigation is plain state (`page`, `viewingShowId`, `viewingEpisodeId`) with back handlers, not URL-driven.
- Presentational components (`WaveBars`, `ShowCard`, `Shelf`, `Sidebar`, `MobileNav`, `EpisodeRow`, `ShowPage`, `EpisodePage`, `PlayerBar`, `QueueDrawer`) are all defined above `PodcastApp` in the same file and take data/callbacks as props from it — none manage their own domain state beyond local UI state (e.g. hover).
- `WaveBars` is the recurring waveform-bars visual (browsed shows, player bar, episode detail progress) — bar heights are deterministic (derived from a sine-based formula per index, not random), and animation is toggled via `playing`/`animationPlayState` rather than mounting/unmounting.

When adding a new show/episode field or a new view, follow the existing pattern: extend `SHOWS`/state in `PodcastApp`, thread new props down through the relevant presentational component(s) — there's no separate data layer or context to update.
