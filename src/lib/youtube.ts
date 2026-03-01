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
  const entryMatch = xml.match(/<entry>[\s\S]*?<\/entry>/);
  if (!entryMatch) return null;

  const entry = entryMatch[0];
  const title = extractTag(entry, "title") ?? "Latest Video";
  const videoId = extractTag(entry, "yt:videoId") ?? "";
  const url = extractHref(entry) ?? (videoId ? `https://youtu.be/${videoId}` : "");
  const published = extractTag(entry, "published") ?? "";

  if (!videoId && !url) return null;

  return { title, url, videoId, published };
}
