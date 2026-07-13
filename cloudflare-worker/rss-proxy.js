// Minimal CORS proxy for fetching podcast RSS feeds from the browser.
//
// Deploy: dash.cloudflare.com -> Workers & Pages -> Create -> paste this file's
// contents into the editor -> Deploy. Copy the resulting *.workers.dev URL into
// OWN_CORS_PROXY in src/App.jsx.
//
// Update ALLOWED_ORIGINS below to match where the app is actually hosted.
const ALLOWED_ORIGINS = [
  "https://tortfeasr.github.io",
  "http://localhost:5173",
];

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin");
    const corsHeaders = buildCorsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response("Origin not allowed", { status: 403, headers: corsHeaders });
    }

    const target = new URL(request.url).searchParams.get("url");
    if (!target) {
      return new Response("Missing url param", { status: 400, headers: corsHeaders });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Invalid url param", { status: 400, headers: corsHeaders });
    }
    if (targetUrl.protocol !== "https:" && targetUrl.protocol !== "http:") {
      return new Response("Unsupported protocol", { status: 400, headers: corsHeaders });
    }

    let upstream;
    try {
      upstream = await fetch(targetUrl.toString(), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; WavelengthRssProxy/1.0)" },
      });
    } catch {
      return new Response("Upstream fetch failed", { status: 502, headers: corsHeaders });
    }

    const body = await upstream.arrayBuffer();
    corsHeaders.set("Content-Type", upstream.headers.get("Content-Type") || "application/xml");
    return new Response(body, { status: upstream.status, headers: corsHeaders });
  },
};

function buildCorsHeaders(origin) {
  return new Headers({
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    Vary: "Origin",
  });
}
