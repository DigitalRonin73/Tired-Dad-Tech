# Automatic homepage video

The site is a Next.js static export hosted by Cloudflare Pages. `next.revalidate`
inside a build-time fetch cannot update an already exported homepage. Earlier
fixes changed parsers and pinned fallbacks without fixing that architecture.

The static HTML still includes a usable video. After hydration,
`LatestYouTubeVideo` requests the same-origin `/api/youtube/latest` Pages Function.
The function reads only the official RSS feed for Tired Dad Tech's fixed channel
ID. Future public standard-video uploads therefore do not need a site rebuild.
The client checks on page load, when a hidden tab becomes visible, and at the
endpoint's next check time while visible. Healthy edge checks are cached for
15 minutes. Updates also depend on when YouTube publishes them to its feed.

The current official feed explicitly links Shorts as `/shorts/ID`; standard
videos have `/watch?v=ID`. We use that distinction rather than scraping watch-page
duration, which fails on consent/bot-check pages. The old three-minute heuristic
is removed: a normal video is not excluded solely because it is short. Publication
(not metadata-update) time controls ordering. Channel, video ID, canonical link,
and dates are validated. A changed upstream format fails safely.

## Failure behavior

- Seven-second upstream timeout; ten-second client timeout.
- Unavailable/malformed/regressed feed keeps the last known video, marks the
  response stale, and retries after a minute rather than silently claiming success.
- `checkedAt` is the latest attempt time; `verifiedAt` remains the last successful
  feed verification, or null for the pinned fallback.
- Existing video remains visible if the endpoint or JSON fails. A short status
  message discloses the failed latest-upload check. A direct YouTube link remains
  available if the embedded player is blocked.
- Cache API retains last-known state for up to seven days, but it is evictable
  and local to a Cloudflare data center. It is **not durable storage**. A cold
  cache plus YouTube outage uses the independently verified pinned video.
- With JavaScript disabled, the exported build-time video remains and a note
  directs visitors to the channel for current uploads.

No YouTube credentials, new Cloudflare bindings, D1 changes, cron jobs, scheduled
site rebuilds, or third-party CORS proxies are required. The function must be
included in Cloudflare Pages deployments; plain static-only hosting won't run it.

## Checks

Requires Node 22+ (native TypeScript stripping) and the project's installed tools:

```sh
node --test scripts/test-youtube-latest.mjs
pnpm exec wrangler pages functions build --outdir=.programlist-local/test-worker
node scripts/test-youtube-runtime.mjs
node scripts/test-programlist.mjs
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Unit tests exercise simulated future uploads, Shorts, bad feed data, cache expiry,
upstream timeout/outage, retained verification dates, regression, recovery and
cache errors. Runtime tests exercise the actual compiled Pages route in isolated
Miniflare, with all upstream requests mocked. No test publishes to YouTube.

For production verification, read `/api/youtube/latest`: expect the actual public
video, `stale: false`, a recent `verifiedAt`, and `source: youtube-feed` or `cache`.
Check the homepage embed/title/direct link and fallback status. A future real
upload is the end-to-end rollover confirmation; local fixtures prove behavior
without manufacturing an upload. If the endpoint is stale, inspect the current
RSS response before changing a pinned fallback.
