import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Search,
  Home,
  Library,
  Volume2,
  VolumeX,
  ListMusic,
  Heart,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const C = {
  void: "#15111C",
  surface: "#1F1926",
  elevated: "#2A2332",
  elevated2: "#332B3D",
  amber: "#E8A34D",
  coral: "#D6664F",
  cream: "#F2EDE2",
  muted: "#948B9E",
  faint: "#5C5468",
  hairline: "#332B3D",
};

const SHOWS = [
  {
    id: "night-signal",
    title: "Night Signal",
    host: "Mara Voss",
    genre: "Mystery",
    palette: ["#E8A34D", "#D6664F"],
    description:
      "A weekly investigation into the odd, half-reported stories that slip through the cracks of the evening news — vanishings, coincidences, and things that were never quite explained.",
    episodes: [
      { id: "ns-47", title: "Episode 47 — The Vanishing at Pier 9", duration: 3242, publishedAt: "Jul 10", description: "A cargo inspector clocks out at midnight and is never seen again. Mara pieces together dock logs, weather reports, and one water-damaged notebook to ask what actually happened at Pier 9." },
      { id: "ns-46", title: "Episode 46 — The House That Kept Moving", duration: 2960, publishedAt: "Jul 3", description: "Neighbors on Ash Lane insist their street has changed shape three times in ten years. A look at land surveys, old maps, and the limits of memory." },
      { id: "ns-45", title: "Episode 45 — Static on Channel 9", duration: 3110, publishedAt: "Jun 26", description: "For six minutes in 1994, a local news broadcast cut to something no one can explain. Thirty years later, Mara tracks down the engineer who was on shift that night." },
    ],
  },
  {
    id: "long-take",
    title: "The Long Take",
    host: "Desmond Ochoa",
    genre: "Film & Culture",
    palette: ["#6B5B95", "#E8A34D"],
    description:
      "Long, unhurried conversations about the films that reshaped how we watch — with directors, editors, and the odd projectionist who's seen it all twice.",
    episodes: [
      { id: "lt-112", title: "Episode 112 — The Long Goodbye, Revisited", duration: 2870, publishedAt: "Jul 9", description: "Desmond sits down with a veteran film editor to talk about pacing, silence, and why the slowest scene in the film is also the loudest." },
      { id: "lt-111", title: "Episode 111 — Sound Before Picture", duration: 2650, publishedAt: "Jul 2", description: "A conversation with a sound designer about the three seconds of audio that can make or break a scene." },
      { id: "lt-110", title: "Episode 110 — The Cutting Room Floor", duration: 3005, publishedAt: "Jun 25", description: "What actually gets left out of a film, and why the deleted scene is sometimes the whole point." },
    ],
  },
  {
    id: "field-notes",
    title: "Field Notes",
    host: "Priya Anand",
    genre: "Nature & Science",
    palette: ["#4A7A6A", "#E8A34D"],
    description:
      "Field recordings and quiet dispatches from the places most of us never get to stand — glaciers, rainforests, ocean trenches, and the researchers who study them.",
    episodes: [
      { id: "fn-8", title: "Episode 8 — The Sound of a Glacier Calving", duration: 1980, publishedAt: "Jul 6", description: "Priya travels to Southeast Alaska to record the moment a slab of ice the size of a building breaks free — and talks to the glaciologists tracking how fast it's happening." },
      { id: "fn-7", title: "Episode 7 — What the Coral Remembers", duration: 2140, publishedAt: "Jun 29", description: "Coral skeletons hold a record of ocean temperature going back centuries. A marine biologist explains how to read it." },
      { id: "fn-6", title: "Episode 6 — Nightfall in the Understory", duration: 1870, publishedAt: "Jun 22", description: "As the sun sets in a Costa Rican rainforest, the entire soundscape changes shift. A recordist explains why dusk is the loudest ten minutes of the day." },
    ],
  },
  {
    id: "after-hours",
    title: "After Hours",
    host: "Jonas Wray",
    genre: "Interviews",
    palette: ["#D6664F", "#8C5A8C"],
    description:
      "Unhurried, late-night interviews with musicians, producers, and the people who work just outside the spotlight.",
    episodes: [
      { id: "ah-63", title: "Episode 63 — A Conversation with Lior Adem", duration: 4120, publishedAt: "Jul 11", description: "The producer behind three of the year's most talked-about records on knowing when a song is finished." },
      { id: "ah-62", title: "Episode 62 — The Session Player's Life", duration: 3560, publishedAt: "Jul 4", description: "Thirty years of studio work, and a case for why the best musicians in the room are often the ones you've never heard of." },
      { id: "ah-61", title: "Episode 61 — Building a Label from a Garage", duration: 3800, publishedAt: "Jun 27", description: "Two founders on the early, unglamorous years of running an independent label." },
    ],
  },
  {
    id: "static-stars",
    title: "Static & Stars",
    host: "Dr. Elena Kade",
    genre: "Space & Physics",
    palette: ["#3E5C76", "#E8A34D"],
    description:
      "The universe, explained slowly and out loud — from the physics of a black hole to the quiet static still arriving from the edge of the solar system.",
    episodes: [
      { id: "ss-21", title: "Episode 21 — What Voyager Still Hears", duration: 2650, publishedAt: "Jul 8", description: "Elena talks to the engineers still listening to a 47-year-old spacecraft, and what its faint signal can still tell us." },
      { id: "ss-20", title: "Episode 20 — The Weight of Nothing", duration: 2410, publishedAt: "Jul 1", description: "A gentle explainer on vacuum energy and why empty space isn't actually empty." },
      { id: "ss-19", title: "Episode 19 — A Year Without a Sunset", duration: 2790, publishedAt: "Jun 24", description: "What happens to the human body — and mind — during six months of polar night." },
    ],
  },
  {
    id: "quiet-hour",
    title: "The Quiet Hour",
    host: "Tomas Lindgren",
    genre: "Sleep & Calm",
    palette: ["#5C5468", "#948B9E"],
    description: "Low, slow stories and soundscapes built for the last twenty minutes before sleep.",
    episodes: [
      { id: "qh-90", title: "Episode 90 — The Lighthouse Keeper", duration: 3600, publishedAt: "Jul 5", description: "A slow, fictional wind-down story following one keeper's last winter on a remote coastal light." },
      { id: "qh-89", title: "Episode 89 — Rain Over the Orchard", duration: 3300, publishedAt: "Jun 28", description: "Ambient rain, distant thunder, and a soft narration meant to be only half-listened to." },
      { id: "qh-88", title: "Episode 88 — The Night Train", duration: 3450, publishedAt: "Jun 21", description: "A gentle story told from a sleeper car somewhere between two cities you won't be told the names of." },
    ],
  },
  {
    id: "wavelength-fm",
    title: "Wavelength FM",
    host: "Ruth Okafor",
    genre: "Music Discovery",
    palette: ["#E8A34D", "#4A7A6A"],
    description: "New and overlooked music, one hour at a time — b-sides, basement recordings, and the songs that never quite made the playlist.",
    episodes: [
      { id: "wf-34", title: "Episode 34 — Basement Tapes, Vol. 3", duration: 2210, publishedAt: "Jul 7", description: "Ruth digs through listener-submitted home recordings for the ones worth hearing twice." },
      { id: "wf-33", title: "Episode 33 — The Long Fade Out", duration: 2050, publishedAt: "Jun 30", description: "A set built entirely around outros, codas, and songs that don't know how to end." },
      { id: "wf-32", title: "Episode 32 — First Pressings", duration: 2380, publishedAt: "Jun 23", description: "Debut singles from bands that either broke up or broke through — no in-between." },
    ],
  },
  {
    id: "midnight-freq",
    title: "Midnight Frequency",
    host: "Cole Ibarra",
    genre: "Urban Legends",
    palette: ["#8C5A8C", "#D6664F"],
    description: "The stories your town tells after dark — half history, half rumor, fully unresolved.",
    episodes: [
      { id: "mf-15", title: "Episode 15 — The Bridge That Isn't There", duration: 3005, publishedAt: "Jul 10", description: "Cole investigates a bridge that appears on three separate 1970s maps and nowhere else." },
      { id: "mf-14", title: "Episode 14 — The Room Above the Diner", duration: 2870, publishedAt: "Jul 3", description: "A decades-old rumor about a locked room, and the diner owner who finally opens it on tape." },
      { id: "mf-13", title: "Episode 13 — The Whistle in Merrow Woods", duration: 3140, publishedAt: "Jun 26", description: "Generations of hikers report the same low whistle in the same stretch of forest. Cole spends a night there to find out why." },
    ],
  },
];

const DEFAULT_FOLLOWED = ["night-signal", "long-take", "static-stars", "wavelength-fm", "quiet-hour"];

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function coverBackground(show) {
  return show.artworkUrl
    ? { backgroundImage: `url(${show.artworkUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `linear-gradient(145deg, ${show.palette[0]}, ${show.palette[1]})` };
}

function parseDurationToSeconds(raw) {
  if (!raw) return 0;
  const trimmed = raw.trim();
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  const parts = trimmed.split(":").map((p) => parseInt(p, 10));
  if (parts.some((p) => Number.isNaN(p))) return 0;
  return parts.reduceRight((acc, val, i, arr) => acc + val * Math.pow(60, arr.length - 1 - i), 0);
}

function formatPubDate(raw) {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").trim();
}

// RSS feeds mostly don't send CORS headers, so feed fetches are routed through a proxy.
// Deploy cloudflare-worker/rss-proxy.js (free tier) and paste its *.workers.dev URL here for
// reliable fetching. Public proxies below are kept only as a best-effort fallback — in testing
// they were frequently down, rate-limited, or capped well under typical feed sizes.
const OWN_CORS_PROXY = ""; // e.g. "https://rss-proxy.your-subdomain.workers.dev"

const CORS_PROXIES = [
  ...(OWN_CORS_PROXY ? [(url) => `${OWN_CORS_PROXY}?url=${encodeURIComponent(url)}`] : []),
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

async function fetchViaCorsProxy(url) {
  let lastError = new Error("All CORS proxies failed");
  for (const buildProxyUrl of CORS_PROXIES) {
    try {
      const res = await fetch(buildProxyUrl(url));
      if (!res.ok) throw new Error(`Proxy responded ${res.status}`);
      const text = await res.text();
      if (!text || text.length < 20) throw new Error("Empty proxy response");
      return text;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

async function searchPodcasts(term) {
  const url = `https://itunes.apple.com/search?media=podcast&limit=24&term=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Podcast search failed");
  const data = await res.json();
  return (data.results || [])
    .filter((r) => r.feedUrl)
    .map((r) => ({
      id: `itunes-${r.collectionId}`,
      source: "itunes",
      title: r.collectionName,
      host: r.artistName,
      genre: r.primaryGenreName || "Podcast",
      artworkUrl: r.artworkUrl600 || r.artworkUrl100,
      feedUrl: r.feedUrl,
      description: "",
      episodes: [],
      feedStatus: "idle",
    }));
}

async function fetchShowFeed(feedUrl, showId) {
  const xmlText = await fetchViaCorsProxy(feedUrl);
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Feed parse failed");
  const channelDescription = doc.querySelector("channel > description")?.textContent || "";
  const items = Array.from(doc.querySelectorAll("item")).slice(0, 20);
  const episodes = items
    .map((item, i) => {
      const audioUrl = item.querySelector("enclosure")?.getAttribute("url") || "";
      const durationRaw =
        item.getElementsByTagName("itunes:duration")[0]?.textContent ||
        item.querySelector("duration")?.textContent;
      const descRaw =
        item.getElementsByTagName("itunes:summary")[0]?.textContent ||
        item.querySelector("description")?.textContent ||
        "";
      return {
        id: item.querySelector("guid")?.textContent || `${showId}-${i}`,
        title: item.querySelector("title")?.textContent?.trim() || `Episode ${i + 1}`,
        publishedAt: formatPubDate(item.querySelector("pubDate")?.textContent),
        duration: parseDurationToSeconds(durationRaw),
        description: stripHtml(descRaw),
        audioUrl,
      };
    })
    .filter((ep) => ep.audioUrl);
  return { description: stripHtml(channelDescription), episodes };
}

function WaveBars({ progress, playing, barCount = 48, activeColor = C.amber, idleColor = C.elevated2, height = 28 }) {
  const heights = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const base = Math.abs(Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.31) * 0.3);
      return 0.28 + base * 0.72;
    });
  }, [barCount]);

  const filledCount = Math.round(progress * barCount);

  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {heights.map((h, i) => {
        const isFilled = i < filledCount;
        return (
          <div
            key={i}
            style={{
              width: 3,
              height: `${h * height}px`,
              background: isFilled ? activeColor : idleColor,
              borderRadius: 2,
              opacity: isFilled ? 1 : 0.6,
              animation: playing ? "waveBounce 0.9s ease-in-out infinite" : "none",
              animationDelay: `${(i % 12) * 0.06}s`,
              animationPlayState: playing ? "running" : "paused",
              transition: "background 0.2s, opacity 0.2s",
            }}
          />
        );
      })}
    </div>
  );
}

function ShowCard({ show, onOpen, onPlayToggle, isCurrentPlaying }) {
  const [hover, setHover] = useState(false);
  const accent = show.palette ? show.palette[0] : C.amber;
  const hasEpisodes = show.episodes && show.episodes.length > 0;
  return (
    <div
      className="flex-shrink-0 cursor-pointer select-none"
      style={{ width: 168 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(show)}
    >
      <div
        className="relative rounded-xl overflow-hidden flex items-end p-3"
        style={{
          width: "100%",
          height: 168,
          ...coverBackground(show),
          boxShadow: hover ? `0 14px 28px -10px ${accent}77` : "0 4px 12px -6px rgba(0,0,0,0.5)",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.25s ease",
        }}
      >
        {!show.artworkUrl && (
          <>
            <div style={{ position: "absolute", top: -32, right: -32, width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
            <div style={{ position: "absolute", top: -10, right: -10, width: 78, height: 78, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)" }} />
          </>
        )}
        {show.artworkUrl && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
        )}
        <span className="relative text-xs font-semibold uppercase tracking-wide" style={{ color: show.artworkUrl ? C.cream : "rgba(0,0,0,0.62)" }}>
          {show.genre}
        </span>
        {hover && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(21,17,28,0.45)", cursor: hasEpisodes ? "pointer" : "default" }}
            onClick={(e) => { e.stopPropagation(); if (hasEpisodes) onPlayToggle(show, show.episodes[0]); }}
          >
            {hasEpisodes && (
              <div className="rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: C.amber, boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>
                {isCurrentPlaying ? (
                  <Pause size={20} color={C.void} fill={C.void} />
                ) : (
                  <Play size={22} color={C.void} fill={C.void} style={{ marginLeft: 2 }} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium truncate" style={{ color: C.cream }}>{show.title}</p>
        <p className="text-xs truncate" style={{ color: C.muted }}>{show.host}</p>
      </div>
    </div>
  );
}

function Shelf({ title, shows, onOpen, onPlayToggle, currentEpisodeId, isPlaying }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: C.cream }}>{title}</h3>
        <button className="text-xs flex items-center gap-1 focus-visible:outline-none" style={{ color: C.muted }}>
          See all <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {shows.map((show) => (
          <ShowCard
            key={show.id}
            show={show}
            onOpen={onOpen}
            onPlayToggle={onPlayToggle}
            isCurrentPlaying={isPlaying && show.episodes?.[0]?.id === currentEpisodeId}
          />
        ))}
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, followed, onOpenShow }) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "library", label: "Library", icon: Library },
  ];
  return (
    <div className="hidden md:flex flex-col flex-shrink-0" style={{ width: 232, background: C.void, borderRight: `1px solid ${C.hairline}` }}>
      <div className="flex items-center gap-2 px-6 pt-6 pb-8">
        <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${C.amber}`, position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: C.amber }} />
        </div>
        <span className="text-lg" style={{ fontFamily: "Fraunces, serif", color: C.cream, fontWeight: 600 }}>Wavelength</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: isActive ? C.elevated : "transparent", color: isActive ? C.cream : C.muted, fontWeight: isActive ? 600 : 500 }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <p className="text-xs uppercase tracking-wider mt-8 mb-3 px-6" style={{ color: C.faint, letterSpacing: "0.08em" }}>Following</p>
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-1 pb-4">
        {followed.map((show) => (
          <button key={show.id} className="flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors focus-visible:outline-none" onClick={() => onOpenShow(show)}>
            <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, ...coverBackground(show) }} />
            <span className="text-sm truncate" style={{ color: C.muted }}>{show.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileNav({ active, setActive }) {
  const items = [
    { id: "home", icon: Home },
    { id: "search", icon: Search },
    { id: "library", icon: Library },
  ];
  return (
    <div className="flex md:hidden items-center gap-2 px-6 pb-3">
      {items.map(({ id, icon: Icon }) => (
        <button key={id} onClick={() => setActive(id)} className="p-2 rounded-lg focus-visible:outline-none" style={{ background: active === id ? C.elevated : "transparent", color: active === id ? C.amber : C.muted }}>
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}

function EpisodeRow({ show, episode, isCurrent, isPlayingThis, onPlayToggle, onOpen }) {
  return (
    <div className="flex items-start gap-4 px-2 py-4" style={{ borderBottom: `1px solid ${C.hairline}` }}>
      <button
        onClick={() => onPlayToggle(show, episode)}
        className="rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 focus-visible:outline-none"
        style={{ width: 34, height: 34, background: isCurrent ? C.amber : "transparent", border: isCurrent ? "none" : `1px solid ${C.hairline}` }}
      >
        {isPlayingThis ? (
          <Pause size={14} color={C.void} fill={C.void} />
        ) : (
          <Play size={14} color={isCurrent ? C.void : C.cream} fill={isCurrent ? C.void : C.cream} style={{ marginLeft: 1 }} />
        )}
      </button>
      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpen(show, episode)}>
        <p className="text-sm font-medium truncate mb-1" style={{ color: isCurrent ? C.amber : C.cream }}>{episode.title}</p>
        <p className="text-xs mb-2" style={{ color: C.muted }}>{episode.publishedAt} · {fmtTime(episode.duration)}</p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: C.muted, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {episode.description}
        </p>
      </div>
    </div>
  );
}

function ShowPage({ show, following, onToggleFollow, onBack, onPlayToggle, onOpenEpisode, currentEpisodeId, isPlaying }) {
  const isFollowing = following.includes(show.id);
  const isReal = show.source === "itunes";
  const feedStatus = isReal ? show.feedStatus || "idle" : "loaded";
  const hasEpisodes = show.episodes && show.episodes.length > 0;
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 focus-visible:outline-none" style={{ color: C.muted }}>
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
        <div className="rounded-2xl flex-shrink-0" style={{ width: 176, height: 176, ...coverBackground(show) }} />
        <div>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, letterSpacing: "0.1em" }}>{show.genre}</p>
          <h1 className="text-3xl mb-2" style={{ fontFamily: "Fraunces, serif", color: C.cream, fontWeight: 600 }}>{show.title}</h1>
          <p className="text-sm mb-4" style={{ color: C.muted }}>Hosted by {show.host}</p>
          <p className="text-sm max-w-xl leading-relaxed mb-5" style={{ color: C.muted }}>
            {feedStatus === "loading" ? "Loading show details…" : show.description}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => hasEpisodes && onPlayToggle(show, show.episodes[0])}
              disabled={!hasEpisodes}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 focus-visible:outline-none"
              style={{ background: C.amber, color: C.void, fontWeight: 600, fontSize: 14, opacity: hasEpisodes ? 1 : 0.5, cursor: hasEpisodes ? "pointer" : "default" }}
            >
              <Play size={15} fill={C.void} /> {feedStatus === "loading" ? "Loading…" : "Play latest"}
            </button>
            {!isReal && (
              <button
                onClick={() => onToggleFollow(show.id)}
                className="rounded-full px-5 py-2.5 text-sm font-medium focus-visible:outline-none"
                style={{ border: `1px solid ${isFollowing ? C.amber : C.hairline}`, color: isFollowing ? C.amber : C.cream }}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.faint, letterSpacing: "0.08em" }}>Episodes</p>
      {feedStatus === "loading" && <p className="text-sm mb-4" style={{ color: C.faint }}>Loading episodes…</p>}
      {feedStatus === "error" && (
        <p className="text-sm mb-4" style={{ color: C.faint }}>
          Couldn't load episodes for this show — its feed may not allow fetching from a browser.
        </p>
      )}
      {feedStatus === "loaded" && !hasEpisodes && <p className="text-sm mb-4" style={{ color: C.faint }}>No episodes found.</p>}
      <div>
        {show.episodes.map((ep) => (
          <EpisodeRow
            key={ep.id}
            show={show}
            episode={ep}
            isCurrent={ep.id === currentEpisodeId}
            isPlayingThis={ep.id === currentEpisodeId && isPlaying}
            onPlayToggle={onPlayToggle}
            onOpen={onOpenEpisode}
          />
        ))}
      </div>
    </div>
  );
}

function EpisodePage({ show, episode, onBack, isPlaying, isCurrent, onPlayToggle, progress, currentTime, liveDuration, liked, onToggleLike, moreEpisodes, onOpenEpisode }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-6 focus-visible:outline-none" style={{ color: C.muted }}>
        <ArrowLeft size={16} /> Back to {show.title}
      </button>
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="rounded-2xl flex-shrink-0" style={{ width: 200, height: 200, ...coverBackground(show) }} />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, letterSpacing: "0.1em" }}>{show.title} · {episode.publishedAt}</p>
          <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: "Fraunces, serif", color: C.cream, fontWeight: 600 }}>{episode.title}</h1>
          <p className="text-sm mb-5" style={{ color: C.muted }}>Hosted by {show.host} · {fmtTime(episode.duration)}</p>
          <p className="text-sm max-w-2xl leading-relaxed mb-6" style={{ color: C.muted }}>{episode.description}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlayToggle(show, episode)}
              className="flex items-center gap-2 rounded-full px-6 py-3 focus-visible:outline-none"
              style={{ background: C.amber, color: C.void, fontWeight: 600, fontSize: 14 }}
            >
              {isCurrent && isPlaying ? <Pause size={16} fill={C.void} /> : <Play size={16} fill={C.void} />}
              {isCurrent && isPlaying ? "Pause" : "Play episode"}
            </button>
            <button onClick={() => onToggleLike(episode.id)} className="focus-visible:outline-none">
              <Heart size={20} color={liked ? C.coral : C.faint} fill={liked ? C.coral : "none"} />
            </button>
          </div>
          {isCurrent && (
            <div className="mt-6 max-w-xl">
              <WaveBars progress={progress} playing={isPlaying} barCount={70} height={26} />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: C.faint, fontFamily: "JetBrains Mono, monospace" }}>{fmtTime(currentTime)}</span>
                <span className="text-xs" style={{ color: C.faint, fontFamily: "JetBrains Mono, monospace" }}>{fmtTime(liveDuration || episode.duration)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.faint, letterSpacing: "0.08em" }}>More from {show.title}</p>
      <div>
        {moreEpisodes.map((ep) => (
          <EpisodeRow key={ep.id} show={show} episode={ep} isCurrent={false} isPlayingThis={false} onPlayToggle={onPlayToggle} onOpen={onOpenEpisode} />
        ))}
      </div>
    </div>
  );
}

function PlayerBar({ episode, show, isPlaying, onToggle, progress, currentTime, duration, liked, onToggleLike, onQueueToggle, volume, setVolume, onNext, onPrev }) {
  if (!episode) {
    return (
      <div className="flex items-center justify-center px-6" style={{ height: 88, background: C.surface, borderTop: `1px solid ${C.hairline}` }}>
        <p className="text-sm" style={{ color: C.faint }}>Choose something to listen to</p>
      </div>
    );
  }
  return (
    <div className="flex items-center px-4 md:px-6 gap-4 md:gap-6" style={{ height: 88, background: C.surface, borderTop: `1px solid ${C.hairline}` }}>
      <div className="flex items-center gap-3 min-w-0" style={{ width: 220 }}>
        <div className="rounded-lg flex-shrink-0" style={{ width: 52, height: 52, ...coverBackground(show) }} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isPlaying && <span className="rounded-full flex-shrink-0" style={{ width: 6, height: 6, background: C.amber, animation: "pulseDot 1.6s infinite" }} />}
            <p className="text-sm font-medium truncate" style={{ color: C.cream }}>{episode.title}</p>
          </div>
          <p className="text-xs truncate" style={{ color: C.muted }}>{show.title}</p>
        </div>
        <button onClick={onToggleLike} className="flex-shrink-0 ml-1 focus-visible:outline-none">
          <Heart size={16} color={liked ? C.coral : C.faint} fill={liked ? C.coral : "none"} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
        <div className="flex items-center gap-4">
          <button onClick={onPrev} style={{ color: C.muted }} className="focus-visible:outline-none"><SkipBack size={18} /></button>
          <button onClick={onToggle} className="rounded-full flex items-center justify-center focus-visible:outline-none" style={{ width: 36, height: 36, background: C.amber }}>
            {isPlaying ? <Pause size={16} color={C.void} fill={C.void} /> : <Play size={16} color={C.void} fill={C.void} style={{ marginLeft: 2 }} />}
          </button>
          <button onClick={onNext} style={{ color: C.muted }} className="focus-visible:outline-none"><SkipForward size={18} /></button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-xl">
          <span className="text-xs hidden sm:block" style={{ color: C.faint, fontFamily: "JetBrains Mono, monospace", width: 38 }}>{fmtTime(currentTime)}</span>
          <div className="flex-1">
            <WaveBars progress={progress} playing={isPlaying} barCount={60} height={24} />
          </div>
          <span className="text-xs hidden sm:block" style={{ color: C.faint, fontFamily: "JetBrains Mono, monospace", width: 38 }}>{fmtTime(duration || episode.duration)}</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3" style={{ width: 150 }}>
        <button onClick={onQueueToggle} style={{ color: C.muted }} className="focus-visible:outline-none"><ListMusic size={18} /></button>
        <button onClick={() => setVolume(volume > 0 ? 0 : 0.7)} style={{ color: C.muted }} className="focus-visible:outline-none">
          {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: 70 }} />
      </div>
    </div>
  );
}

function QueueDrawer({ open, onClose, queue, onPlay, currentId }) {
  if (!open) return null;
  return (
    <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width: 300, background: C.surface, borderLeft: `1px solid ${C.hairline}` }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.hairline}` }}>
        <p className="text-sm font-semibold" style={{ color: C.cream }}>Up Next</p>
        <button onClick={onClose} style={{ color: C.muted }} className="focus-visible:outline-none"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col gap-1">
        {queue.map(({ show, episode }) => {
          const isCurrent = episode.id === currentId;
          return (
            <button key={episode.id} onClick={() => onPlay(show, episode)} className="flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-white/5 focus-visible:outline-none" style={{ background: isCurrent ? C.elevated : "transparent" }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, ...coverBackground(show) }} />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: isCurrent ? C.amber : C.cream }}>{episode.title}</p>
                <p className="text-xs truncate" style={{ color: C.muted }}>{show.title} · {fmtTime(episode.duration)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PodcastApp() {
  const [active, setActive] = useState("home");
  const [page, setPage] = useState("list"); // 'list' | 'show' | 'episode'
  const [viewingShowId, setViewingShowId] = useState(null);
  const [viewingEpisodeId, setViewingEpisodeId] = useState(null);
  const [query, setQuery] = useState("");
  const [followingIds, setFollowingIds] = useState(DEFAULT_FOLLOWED);
  const [currentShow, setCurrentShow] = useState(SHOWS[0]);
  const [currentEpisode, setCurrentEpisode] = useState(SHOWS[0].episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(1284);
  const [liked, setLiked] = useState({});
  const [volume, setVolume] = useState(0.7);
  const [queueOpen, setQueueOpen] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const [realShows, setRealShows] = useState({}); // itunes-<id> -> show, accumulated across searches
  const [searchResultIds, setSearchResultIds] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle | loading | error
  const [audioDuration, setAudioDuration] = useState(0); // live duration of the real <audio> element

  const followed = SHOWS.filter((s) => followingIds.includes(s.id));
  const queue = useMemo(
    () => SHOWS.filter((s) => s.id !== "night-signal").slice(0, 5).map((s) => ({ show: s, episode: s.episodes[0] })),
    []
  );

  useEffect(() => {
    if (currentEpisode?.audioUrl) return; // real playback drives currentTime via <audio> events instead
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= currentEpisode.duration) {
            setIsPlaying(false);
            return currentEpisode.duration;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentEpisode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentEpisode?.audioUrl) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }
    if (audio.src !== currentEpisode.audioUrl) {
      audio.src = currentEpisode.audioUrl;
      setAudioDuration(0);
    }
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentEpisode, isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (active !== "search" || !query.trim()) {
      setSearchResultIds([]);
      setSearchStatus("idle");
      return;
    }
    setSearchStatus("loading");
    const handle = setTimeout(() => {
      searchPodcasts(query.trim())
        .then((results) => {
          setRealShows((prev) => {
            const next = { ...prev };
            results.forEach((r) => {
              // keep any already-fetched episodes/description/feedStatus for shows seen before
              next[r.id] = prev[r.id] ? { ...r, ...prev[r.id] } : r;
            });
            return next;
          });
          setSearchResultIds(results.map((r) => r.id));
          setSearchStatus("idle");
        })
        .catch(() => setSearchStatus("error"));
    }, 400);
    return () => clearTimeout(handle);
  }, [query, active]);

  function playEpisode(show, episode) {
    setCurrentShow(show);
    setCurrentEpisode(episode);
    setCurrentTime(0);
    setIsPlaying(true);
  }

  function handlePlayToggle(show, episode) {
    if (currentEpisode && currentEpisode.id === episode.id) {
      setIsPlaying((p) => !p);
    } else {
      playEpisode(show, episode);
    }
  }

  function loadFeed(show) {
    setRealShows((prev) => ({ ...prev, [show.id]: { ...prev[show.id], feedStatus: "loading" } }));
    fetchShowFeed(show.feedUrl, show.id)
      .then(({ description, episodes }) => {
        setRealShows((prev) => ({
          ...prev,
          [show.id]: { ...prev[show.id], description, episodes, feedStatus: "loaded" },
        }));
      })
      .catch(() => {
        setRealShows((prev) => ({ ...prev, [show.id]: { ...prev[show.id], feedStatus: "error" } }));
      });
  }

  function openShow(show) {
    setViewingShowId(show.id);
    setPage("show");
    if (show.source === "itunes" && (!show.feedStatus || show.feedStatus === "idle")) {
      loadFeed(show);
    }
  }

  function openEpisode(show, episode) {
    setViewingShowId(show.id);
    setViewingEpisodeId(episode.id);
    setPage("episode");
  }

  function backToList() {
    setPage("list");
  }

  function backToShow() {
    setPage("show");
  }

  function toggleFollow(showId) {
    setFollowingIds((prev) => (prev.includes(showId) ? prev.filter((id) => id !== showId) : [...prev, showId]));
  }

  function toggleLike(episodeId) {
    setLiked((l) => ({ ...l, [episodeId]: !l[episodeId] }));
  }

  function handleNext() {
    const idx = queue.findIndex((q) => q.episode.id === currentEpisode.id);
    const next = queue[(idx + 1 + queue.length) % queue.length] || queue[0];
    playEpisode(next.show, next.episode);
  }

  function handlePrev() {
    if (currentEpisode?.audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTime(0);
    }
  }

  const effectiveDuration = currentEpisode?.audioUrl ? audioDuration || currentEpisode.duration || 0 : currentEpisode?.duration || 0;
  const progress = currentEpisode && effectiveDuration ? Math.min(currentTime / effectiveDuration, 1) : 0;

  const shelvesA = SHOWS.slice(0, 5);
  const shelvesB = [...SHOWS].reverse().slice(0, 5);
  const lateNight = SHOWS.filter((s) => ["Mystery", "Sleep & Calm", "Urban Legends"].includes(s.genre));

  const viewingShow = viewingShowId
    ? viewingShowId.startsWith("itunes-")
      ? realShows[viewingShowId]
      : SHOWS.find((s) => s.id === viewingShowId)
    : null;
  const viewingEpisode = viewingShow && viewingEpisodeId ? viewingShow.episodes.find((e) => e.id === viewingEpisodeId) : null;

  return (
    <div className="flex flex-col" style={{ height: "100vh", background: C.void, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes waveBounce { 0%, 100% { transform: scaleY(0.55); } 50% { transform: scaleY(1); } }
        @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(232,163,77,0.55); } 70% { box-shadow: 0 0 0 7px rgba(232,163,77,0); } 100% { box-shadow: 0 0 0 0 rgba(232,163,77,0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="range"] { -webkit-appearance: none; height: 3px; background: ${C.elevated2}; border-radius: 999px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 11px; height: 11px; border-radius: 50%; background: ${C.amber}; cursor: pointer; }
      `}</style>

      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => {
          if (Number.isFinite(e.target.duration)) setAudioDuration(e.target.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(currentEpisode?.duration || 0);
        }}
        style={{ display: "none" }}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar active={active} setActive={(id) => { setActive(id); setPage("list"); }} followed={followed} onOpenShow={openShow} />

        <div className="flex-1 flex flex-col min-w-0">
          {page === "list" && (
            <>
              <div className="flex items-center justify-between px-6 md:px-10 pt-5">
                {active === "search" ? (
                  <div className="flex items-center gap-3 w-full max-w-md rounded-full px-4 py-2" style={{ background: C.surface, border: `1px solid ${C.hairline}` }}>
                    <Search size={16} color={C.muted} />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search real podcasts…"
                      className="bg-transparent outline-none text-sm flex-1"
                      style={{ color: C.cream }}
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl" style={{ fontFamily: "Fraunces, serif", color: C.cream, fontWeight: 600 }}>
                    {active === "home" ? "Good evening" : "Your library"}
                  </h1>
                )}
              </div>
              <MobileNav active={active} setActive={(id) => { setActive(id); setPage("list"); }} />
            </>
          )}

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-10 pb-8 pt-4">
            {page === "list" && active === "home" && (
              <>
                <div
                  className="relative rounded-2xl overflow-hidden p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
                  style={{ background: `linear-gradient(120deg, ${C.elevated}, ${C.surface})`, border: `1px solid ${C.hairline}` }}
                >
                  <div style={{ position: "absolute", inset: 0, opacity: 0.6, background: `radial-gradient(circle at 85% 20%, ${C.amber}22, transparent 60%)`, pointerEvents: "none" }} />
                  <div className="relative flex items-center gap-5 cursor-pointer" onClick={() => openEpisode(SHOWS[0], SHOWS[0].episodes[0])}>
                    <div className="rounded-xl flex-shrink-0" style={{ width: 96, height: 96, background: `linear-gradient(145deg, ${SHOWS[0].palette[0]}, ${SHOWS[0].palette[1]})` }} />
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.amber, letterSpacing: "0.1em" }}>Continue listening</p>
                      <h2 className="text-xl md:text-2xl mb-1" style={{ fontFamily: "Fraunces, serif", color: C.cream, fontWeight: 600 }}>{SHOWS[0].episodes[0].title}</h2>
                      <p className="text-sm" style={{ color: C.muted }}>{SHOWS[0].title} · {SHOWS[0].host}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlayToggle(SHOWS[0], SHOWS[0].episodes[0])}
                    className="relative flex items-center gap-2 rounded-full px-5 py-3 flex-shrink-0 focus-visible:outline-none"
                    style={{ background: C.amber, color: C.void, fontWeight: 600, fontSize: 14 }}
                  >
                    <Play size={16} fill={C.void} /> Resume · {fmtTime(SHOWS[0].episodes[0].duration - 1284)} left
                  </button>
                </div>

                <Shelf title="New episodes this week" shows={shelvesA} onOpen={openShow} onPlayToggle={handlePlayToggle} currentEpisodeId={currentEpisode?.id} isPlaying={isPlaying} />
                <Shelf title="Trending shows" shows={shelvesB} onOpen={openShow} onPlayToggle={handlePlayToggle} currentEpisodeId={currentEpisode?.id} isPlaying={isPlaying} />
                <Shelf title="Late night picks" shows={lateNight} onOpen={openShow} onPlayToggle={handlePlayToggle} currentEpisodeId={currentEpisode?.id} isPlaying={isPlaying} />
              </>
            )}

            {page === "list" && active === "library" && (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))" }}>
                {followed.map((show) => (
                  <ShowCard key={show.id} show={show} onOpen={openShow} onPlayToggle={handlePlayToggle} isCurrentPlaying={isPlaying && show.episodes[0].id === currentEpisode?.id} />
                ))}
              </div>
            )}

            {page === "list" && active === "search" && (
              <div>
                {query.trim() === "" ? (
                  <p className="text-sm" style={{ color: C.faint }}>Search for a real podcast by show name, host, or topic.</p>
                ) : searchStatus === "loading" ? (
                  <p className="text-sm" style={{ color: C.faint }}>Searching…</p>
                ) : searchStatus === "error" ? (
                  <p className="text-sm" style={{ color: C.faint }}>Search failed. Try again in a moment.</p>
                ) : searchResultIds.length === 0 ? (
                  <p className="text-sm" style={{ color: C.faint }}>No shows found for "{query}".</p>
                ) : (
                  <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))" }}>
                    {searchResultIds.map((id) => {
                      const show = realShows[id];
                      if (!show) return null;
                      return (
                        <ShowCard
                          key={show.id}
                          show={show}
                          onOpen={openShow}
                          onPlayToggle={handlePlayToggle}
                          isCurrentPlaying={isPlaying && show.episodes?.[0]?.id === currentEpisode?.id}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {page === "show" && viewingShow && (
              <ShowPage
                show={viewingShow}
                following={followingIds}
                onToggleFollow={toggleFollow}
                onBack={backToList}
                onPlayToggle={handlePlayToggle}
                onOpenEpisode={openEpisode}
                currentEpisodeId={currentEpisode?.id}
                isPlaying={isPlaying}
              />
            )}

            {page === "episode" && viewingShow && viewingEpisode && (
              <EpisodePage
                show={viewingShow}
                episode={viewingEpisode}
                onBack={backToShow}
                isPlaying={isPlaying}
                isCurrent={currentEpisode?.id === viewingEpisode.id}
                onPlayToggle={handlePlayToggle}
                progress={progress}
                currentTime={currentTime}
                liveDuration={effectiveDuration}
                liked={!!liked[viewingEpisode.id]}
                onToggleLike={toggleLike}
                moreEpisodes={viewingShow.episodes.filter((e) => e.id !== viewingEpisode.id)}
                onOpenEpisode={openEpisode}
              />
            )}
          </div>
        </div>

        <QueueDrawer open={queueOpen} onClose={() => setQueueOpen(false)} queue={queue} onPlay={playEpisode} currentId={currentEpisode?.id} />
      </div>

      <PlayerBar
        episode={currentEpisode}
        show={currentShow}
        isPlaying={isPlaying}
        onToggle={() => setIsPlaying((p) => !p)}
        progress={progress}
        currentTime={currentTime}
        duration={effectiveDuration}
        liked={!!liked[currentEpisode?.id]}
        onToggleLike={() => toggleLike(currentEpisode.id)}
        onQueueToggle={() => setQueueOpen((o) => !o)}
        volume={volume}
        setVolume={setVolume}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
