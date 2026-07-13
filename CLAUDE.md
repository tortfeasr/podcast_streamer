# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Wavelength — a dark-themed podcast app UI, originally a static design/UX showcase (late-night-radio aesthetic: plum-black background, amber accent, animated waveform bars as the visual signature). Home and Library still run entirely on hardcoded placeholder content with simulated playback (a `setInterval`, no real audio). The **Search** tab is real: it hits the iTunes Search API and plays actual episode audio from the show's RSS feed. The two data worlds coexist in the same component tree — see Architecture below.

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
- **`SHOWS`** — the hardcoded placeholder catalog (shows → nested episodes) that powers Home and Library. No fetching, no API, no persistence.
- **Real-show objects** (`show.source === "itunes"`) come from the iTunes Search API / RSS feeds instead of `SHOWS`, but are shaped compatibly (`id`, `title`, `host`, `genre`, `episodes`) so the same presentational components render either kind. Distinguishing fields: `artworkUrl` (real cover image, vs. placeholder shows' `palette` gradient — see `coverBackground()`), `feedUrl`, `feedStatus` (`idle`/`loading`/`loaded`/`error`), and per-episode `audioUrl`. `id`s are prefixed `itunes-<collectionId>` so `viewingShowId.startsWith("itunes-")` can route lookups to the right store (`realShows` state vs. the static `SHOWS` array) — see `viewingShow` in `PodcastApp`.
- **Search flow**: a debounced `useEffect` in `PodcastApp` calls `searchPodcasts()` (iTunes Search API, no auth, CORS-friendly) as the user types, and merges results into the `realShows` map (keyed by id) — merging preserves any already-loaded `episodes`/`description`/`feedStatus` for a show seen in an earlier search rather than clobbering it with the fresh empty stub.
- **Feed loading**: opening a real show (`openShow`) triggers `loadFeed()` → `fetchShowFeed()`, which fetches the show's RSS XML through `fetchViaCorsProxy()` and parses it with `DOMParser`. Most RSS hosts don't send CORS headers, so this can't hit the feed directly from the browser — see `CORS_PROXIES` / `OWN_CORS_PROXY` below.
- **`PodcastApp`** (default export, bottom of file) — the root component and sole owner of state: current view (`active`: home/search/library; `page`: list/show/episode), the currently playing show/episode, followed shows, liked episodes, volume, queue-drawer open state, plus the real-data state (`realShows`, `searchResultIds`, `searchStatus`, `audioDuration`). There is no router — navigation is plain state (`page`, `viewingShowId`, `viewingEpisodeId`) with back handlers, not URL-driven.
- **Playback has two parallel mechanisms**, switched on whether `currentEpisode.audioUrl` is set: placeholder episodes advance `currentTime` via a `setInterval` (no real audio, as before); real episodes play through an actual hidden `<audio>` element (`audioRef`, mounted once in `PodcastApp`'s JSX) whose `timeupdate`/`loadedmetadata`/`ended` events drive `currentTime`/`audioDuration`/stop. `effectiveDuration` in `PodcastApp` picks the right duration source for progress/display in either mode.
- Presentational components (`WaveBars`, `ShowCard`, `Shelf`, `Sidebar`, `MobileNav`, `EpisodeRow`, `ShowPage`, `EpisodePage`, `PlayerBar`, `QueueDrawer`) are all defined above `PodcastApp` in the same file and take data/callbacks as props from it — none manage their own domain state beyond local UI state (e.g. hover). `coverBackground(show)` is the shared helper for rendering either a real `artworkUrl` image or a placeholder `palette` gradient as a cover.
- `WaveBars` is the recurring waveform-bars visual (browsed shows, player bar, episode detail progress) — bar heights are deterministic (derived from a sine-based formula per index, not random), and animation is toggled via `playing`/`animationPlayState` rather than mounting/unmounting.
- Real shows are not followable/queueable — `Follow` is hidden on `ShowPage` for `source === "itunes"` shows (following/library/the "Up Next" queue are still `SHOWS`-only), since there's nowhere in placeholder-driven Home/Library for a real show to actually show up.

### CORS proxy for RSS feeds

`CORS_PROXIES` in `App.jsx` is an ordered list of proxy-URL builders; `fetchViaCorsProxy()` tries each until one succeeds. `OWN_CORS_PROXY` (empty by default) is tried first when set — point it at a deployed instance of `cloudflare-worker/rss-proxy.js` (a small Worker that fetches a feed server-side and adds CORS headers) for reliable playback. The free public proxies after it (allorigins, codetabs, corsproxy.io) are a best-effort fallback only — live testing found them frequently down, rate-limited, or capped below typical feed sizes, so expect `ShowPage`'s "Couldn't load episodes" error state to show up often without `OWN_CORS_PROXY` set.

When adding a new show/episode field or a new view, follow the existing pattern: extend `SHOWS`/state in `PodcastApp`, thread new props down through the relevant presentational component(s) — there's no separate data layer or context to update.
