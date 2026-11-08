export type LatestVideo = {
  title: string;
  url: string;
  videoId: string;
  published: string;
};

export type LatestVideoStatus = {
  video: LatestVideo;
  source: "youtube-feed" | "cache" | "fallback";
  stale: boolean;
  checkedAt: string;
  verifiedAt: string | null;
  nextCheckAt: string;
};

export const YOUTUBE_CHANNEL_ID = "UCkWdWRPKcen8EMR_Xn6S8qw";
export const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
export const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
export const FALLBACK_LATEST_VIDEO: LatestVideo = {
  title: "I Turned a Gaming PC Into a 4K Console",
  url: "https://www.youtube.com/watch?v=0hBbb16Wsog",
  videoId: "0hBbb16Wsog",
  published: "2026-11-08T21:00:14Z",
};

const CACHE_KEY = "https://www.tireddadtech.com/api/youtube/latest-cache-v1";
const RETRY_INTERVAL_MS = 60 * 1000;
type VideoCache = Pick<Cache, "match" | "put">;

function decodeXml(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, value: string) => {
    const named: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
    if (named[value]) return named[value];
    const point = value.toLowerCase().startsWith("#x") ? parseInt(value.slice(2), 16) : parseInt(value.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
}

function tag(xml: string, name: string): string {
  const value = xml.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`))?.[1]?.trim() ?? "";
  if (value.startsWith("<![CDATA[") && value.endsWith("]]>")) return value.slice(9, -3);
  return decodeXml(value);
}

export function isLatestVideo(value: unknown): value is LatestVideo {
  if (!value || typeof value !== "object") return false;
  const video = value as Partial<LatestVideo>;
  return typeof video.videoId === "string" && /^[\w-]{11}$/.test(video.videoId)
    && typeof video.title === "string" && video.title.trim().length > 0 && video.title.length <= 500
    && video.url === `https://www.youtube.com/watch?v=${video.videoId}`
    && typeof video.published === "string" && Number.isFinite(Date.parse(video.published));
}

export function isLatestVideoStatus(value: unknown): value is LatestVideoStatus {
  if (!value || typeof value !== "object") return false;
  const status = value as Partial<LatestVideoStatus>;
  return isLatestVideo(status.video) && typeof status.stale === "boolean"
    && ["youtube-feed", "cache", "fallback"].includes(status.source ?? "")
    && typeof status.checkedAt === "string" && Number.isFinite(Date.parse(status.checkedAt))
    && typeof status.nextCheckAt === "string" && Number.isFinite(Date.parse(status.nextCheckAt))
    && (status.verifiedAt === null || (typeof status.verifiedAt === "string" && Number.isFinite(Date.parse(status.verifiedAt))));
}

export function newerVideo(current: LatestVideo, candidate: LatestVideo): LatestVideo {
  return Date.parse(candidate.published) >= Date.parse(current.published) ? candidate : current;
}

// YouTube's official feed distinguishes Shorts using /shorts/ in the alternate
// link. No watch-page scraping, duration guessing, API key or client-side CORS proxy.
export function parseLatestVideo(xml: string, now = Date.now()): LatestVideo | null {
  const videos: LatestVideo[] = [];
  for (const entry of xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/g) ?? []) {
    if (tag(entry, "yt:channelId") !== YOUTUBE_CHANNEL_ID) continue;
    const videoId = tag(entry, "yt:videoId");
    const links = entry.match(/<link\b[^>]*>/g) ?? [];
    const alternate = links.find(link => /\brel\s*=\s*["']alternate["']/.test(link));
    const url = decodeXml(alternate?.match(/\bhref\s*=\s*["']([^"']+)["']/)?.[1] ?? "");
    const video = { videoId, title: tag(entry, "title"), published: tag(entry, "published"), url };
    if (isLatestVideo(video) && Date.parse(video.published) <= now) videos.push(video);
  }
  return videos.sort((a, b) => Date.parse(b.published) - Date.parse(a.published))[0] ?? null;
}

async function fetchLatestVideo(now: number): Promise<LatestVideo> {
  const response = await fetch(YOUTUBE_FEED_URL, {
    headers: { Accept: "application/atom+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(7000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`YouTube feed returned ${response.status}`);
  const video = parseLatestVideo(await response.text(), now);
  if (!video) throw new Error("YouTube feed has no valid public standard video");
  return video;
}

// Used only to seed static HTML; the Pages Function and client handle future uploads.
export async function getLatestYouTubeVideo(): Promise<LatestVideo> {
  try {
    return newerVideo(FALLBACK_LATEST_VIDEO, await fetchLatestVideo(Date.now()));
  } catch {
    return FALLBACK_LATEST_VIDEO;
  }
}

export async function getLatestVideoStatus(cache?: VideoCache, now = Date.now()): Promise<LatestVideoStatus> {
  let previous: LatestVideoStatus | undefined;
  try {
    const response = await cache?.match(CACHE_KEY);
    const stored: unknown = response ? await response.json() : undefined;
    if (isLatestVideoStatus(stored)) previous = stored;
  } catch { /* Cache failure must not prevent a fresh upstream check. */ }

  if (previous && now < Date.parse(previous.nextCheckAt)) {
    return { ...previous, source: previous.source === "fallback" ? "fallback" : "cache" };
  }

  const known = previous ? newerVideo(FALLBACK_LATEST_VIDEO, previous.video) : FALLBACK_LATEST_VIDEO;
  const checkedAt = new Date(now).toISOString();
  let result: LatestVideoStatus;
  try {
    const video = await fetchLatestVideo(now);
    if (Date.parse(video.published) < Date.parse(known.published)) throw new Error("Upstream feed regressed");
    result = {
      video, source: "youtube-feed", stale: false, checkedAt, verifiedAt: checkedAt,
      nextCheckAt: new Date(now + REFRESH_INTERVAL_MS).toISOString(),
    };
  } catch {
    result = {
      video: known, source: previous?.verifiedAt ? "cache" : "fallback", stale: true, checkedAt,
      verifiedAt: previous?.verifiedAt ?? null,
      nextCheckAt: new Date(now + RETRY_INTERVAL_MS).toISOString(),
    };
  }
  try {
    // Best-effort last known good state. Cache API is per data center and evictable;
    // this is not durable storage and never presented as a fresh check on failure.
    await cache?.put(CACHE_KEY, new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=604800" },
    }));
  } catch { /* A cache write failure must not discard a valid upstream response. */ }
  return result;
}

export async function handleLatestVideoRequest({ request }: { request: Request }): Promise<Response> {
  if (!["GET", "HEAD"].includes(request.method)) {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  let cache: Cache | undefined;
  try { cache = await caches.open("youtube-latest-v1"); } catch { /* Optional edge cache. */ }
  const status = await getLatestVideoStatus(cache);
  return new Response(request.method === "HEAD" ? null : JSON.stringify(status), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
