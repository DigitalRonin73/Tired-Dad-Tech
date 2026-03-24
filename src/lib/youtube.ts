type LatestVideo = {
  title: string;
  url: string;
  videoId: string;
  published: string;
};

function extractTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1]?.trim();
}

function extractHref(xml: string) {
  const match = xml.match(/<link[^>]*href="([^"]+)"/);
  return match?.[1]?.trim();
}

async function resolveChannelIdFromHandle(handle: string) {
  const clean = handle.startsWith("@") ? handle : `@${handle}`;
  const res = await fetch(`https://www.youtube.com/${clean}/videos`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/"channelId":"(UC[\w-]{20,})"/);
  return match?.[1] ?? null;
}

async function isLongFormVideo(videoId: string) {
  // 3 minutes is a practical floor to avoid Shorts.
  const minSeconds = Number(process.env.YOUTUBE_MIN_LONGFORM_SECONDS ?? 180);

  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    next: { revalidate: 900 },
  });

  if (!res.ok) return true;

  const html = await res.text();

  // Extra guard: YouTube marks shorts with a canonical shorts URL.
  if (html.includes(`https://www.youtube.com/shorts/${videoId}`)) return false;

  const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
  const lengthSeconds = Number(lengthMatch?.[1] ?? 0);

  // If we can't parse duration, fail open so the page still renders something.
  if (!Number.isFinite(lengthSeconds) || lengthSeconds <= 0) return true;

  return lengthSeconds >= minSeconds;
}

export async function getLatestYouTubeVideo(): Promise<LatestVideo | null> {
  // Replace via env in production if channel changes.
  const explicitChannelId = process.env.YOUTUBE_CHANNEL_ID ?? "UCkWdWRPKcen8EMR_Xn6S8qw";
  const channelHandle = process.env.YOUTUBE_HANDLE ?? "@TiredDadTech";

  const channelId =
    explicitChannelId ?? (await resolveChannelIdFromHandle(channelHandle));

  if (!channelId) return null;

  const feedRes = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    { next: { revalidate: 900 } }
  );

  if (!feedRes.ok) return null;

  const xml = await feedRes.text();
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  if (!entries.length) return null;

  for (const entry of entries) {
    const title = extractTag(entry, "title") ?? "Latest Video";
    const videoId = extractTag(entry, "yt:videoId") ?? "";
    const url = extractHref(entry) ?? (videoId ? `https://youtu.be/${videoId}` : "");
    const published = extractTag(entry, "published") ?? "";

    if (!videoId && !url) continue;

    if (videoId) {
      const longForm = await isLongFormVideo(videoId);
      if (!longForm) continue;
    }

    return { title, url, videoId, published };
  }

  return null;
}
