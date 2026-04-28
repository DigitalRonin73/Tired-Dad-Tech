type LatestVideo = {
  title: string;
  url: string;
  videoId: string;
  published: string;
};

const FALLBACK_LATEST_VIDEO: LatestVideo = {
  title: "Gemma 4 AI on a $140 BC250 It Got Messy",
  url: "https://www.youtube.com/watch?v=C4PqnPw-w7E",
  videoId: "C4PqnPw-w7E",
  published: "2026-04-21T12:08:02+00:00",
};

// A realistic browser UA avoids YouTube returning consent/bot-check pages
// when requests originate from Cloudflare edge IPs.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function debugLog(message: string) {
  if (process.env.YOUTUBE_DEBUG === "1") {
    console.log(message);
  }
}

function extractTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.trim();
}

function extractHref(xml: string) {
  const match = xml.match(/<link[^>]*href="([^"]+)"/);
  return match?.[1]?.trim();
}

function extractLengthSeconds(html: string) {
  const patterns = [
    /"lengthSeconds":"(\d+)"/,
    /"lengthSeconds":(\d+)/,
    /"duration":"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match) continue;

    if (pattern.source.includes("duration")) {
      const hours = Number(match[1] ?? 0);
      const minutes = Number(match[2] ?? 0);
      const seconds = Number(match[3] ?? 0);
      return hours * 3600 + minutes * 60 + seconds;
    }

    return Number(match[1]);
  }

  return null;
}

async function resolveChannelIdFromHandle(handle: string) {
  const clean = handle.startsWith("@") ? handle : `@${handle}`;
  const url = `https://www.youtube.com/${clean}/videos`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      debugLog(`[youtube] resolveChannelIdFromHandle: fetch failed — ${res.status} ${res.statusText} (${url})`);
      return null;
    }

    const html = await res.text();
    const match = html.match(/"channelId":"(UC[\w-]{20,})"/);

    if (!match?.[1]) {
      debugLog(`[youtube] resolveChannelIdFromHandle: channelId pattern not found in page HTML`);
      return null;
    }

    return match[1];
  } catch (err) {
    debugLog(`[youtube] resolveChannelIdFromHandle: unexpected error: ${String(err)}`);
    return null;
  }
}

async function isLongFormVideo(videoId: string): Promise<boolean> {
  const minSeconds = Number(process.env.YOUTUBE_MIN_LONGFORM_SECONDS ?? 180);
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      debugLog(`[youtube] isLongFormVideo(${videoId}): fetch failed — ${res.status} ${res.statusText}`);
      return false;
    }

    const html = await res.text();

    if (html.includes(`https://www.youtube.com/shorts/${videoId}`) || html.includes(`/shorts/${videoId}`)) {
      debugLog(`[youtube] isLongFormVideo(${videoId}): detected as Short via canonical URL`);
      return false;
    }

    const lengthSeconds = extractLengthSeconds(html);
    if (lengthSeconds === null) {
      debugLog(`[youtube] isLongFormVideo(${videoId}): duration not found in page HTML`);
      return false;
    }

    debugLog(`[youtube] isLongFormVideo(${videoId}): ${lengthSeconds}s (min: ${minSeconds}s)`);
    return lengthSeconds >= minSeconds;
  } catch (err) {
    debugLog(`[youtube] isLongFormVideo(${videoId}): unexpected error: ${String(err)}`);
    return false;
  }
}

export async function getLatestYouTubeVideo(): Promise<LatestVideo | null> {
  const explicitChannelId = process.env.YOUTUBE_CHANNEL_ID;
  const defaultChannelId = "UCkWdWRPKcen8EMR_Xn6S8qw";
  const channelHandle = process.env.YOUTUBE_HANDLE ?? "@TiredDadTech";

  const channelIds = [explicitChannelId, defaultChannelId].filter(
    (channelId, index, ids): channelId is string => Boolean(channelId) && ids.indexOf(channelId) === index
  );

  if (!channelIds.length) {
    const resolvedChannelId = await resolveChannelIdFromHandle(channelHandle);
    if (resolvedChannelId) {
      channelIds.push(resolvedChannelId);
    }
  }

  for (const channelId of channelIds) {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    try {
      const feedRes = await fetch(feedUrl, {
        headers: { "User-Agent": BROWSER_UA },
        next: { revalidate: 900 },
      });

      if (!feedRes.ok) {
        debugLog(`[youtube] getLatestYouTubeVideo: RSS feed fetch failed — ${feedRes.status} ${feedRes.statusText} (${feedUrl})`);
        continue;
      }

      const xml = await feedRes.text();
      const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

      if (!entries.length) {
        debugLog(`[youtube] getLatestYouTubeVideo: RSS feed returned no entries — feed length: ${xml.length} chars`);
        continue;
      }

      debugLog(`[youtube] getLatestYouTubeVideo: ${entries.length} entries found in feed`);

      for (const entry of entries) {
        const title = extractTag(entry, "title") ?? "Latest Video";
        const videoId = extractTag(entry, "yt:videoId") ?? "";
        const url = extractHref(entry) ?? (videoId ? `https://youtu.be/${videoId}` : "");
        const published = extractTag(entry, "published") ?? "";

        if (!videoId && !url) {
          debugLog(`[youtube] getLatestYouTubeVideo: skipping entry with no videoId or url`);
          continue;
        }

        if (videoId) {
          const longForm = await isLongFormVideo(videoId);
          if (!longForm) {
            debugLog(`[youtube] getLatestYouTubeVideo: skipping Short — ${videoId} "${title}"`);
            continue;
          }
        }

        debugLog(`[youtube] getLatestYouTubeVideo: returning video ${videoId} "${title}"`);
        return { title, url, videoId, published };
      }

      debugLog(`[youtube] getLatestYouTubeVideo: all ${entries.length} entries were filtered out (all Shorts?)`);
    } catch (err) {
      debugLog(`[youtube] getLatestYouTubeVideo: unexpected error: ${String(err)}`);
    }
  }

  console.warn(`[youtube] getLatestYouTubeVideo: falling back to pinned latest video`);
  return FALLBACK_LATEST_VIDEO;
}
