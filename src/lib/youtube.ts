type LatestVideo = {
  title: string;
  url: string;
  videoId: string;
  published: string;
};

// A realistic browser UA avoids YouTube returning consent/bot-check pages
// when requests originate from Cloudflare edge IPs.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

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
  const url = `https://www.youtube.com/${clean}/videos`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA },
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      console.error(`[youtube] resolveChannelIdFromHandle: fetch failed — ${res.status} ${res.statusText} (${url})`);
      return null;
    }

    const html = await res.text();
    const match = html.match(/"channelId":"(UC[\w-]{20,})"/);

    if (!match?.[1]) {
      console.error(`[youtube] resolveChannelIdFromHandle: channelId pattern not found in page HTML`);
      return null;
    }

    return match[1];
  } catch (err) {
    console.error(`[youtube] resolveChannelIdFromHandle: unexpected error`, err);
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
      console.error(`[youtube] isLongFormVideo(${videoId}): fetch failed — ${res.status} ${res.statusText}`);
      // Fail open so the page still renders something.
      return true;
    }

    const html = await res.text();

    if (html.includes(`https://www.youtube.com/shorts/${videoId}`)) {
      console.log(`[youtube] isLongFormVideo(${videoId}): detected as Short via canonical URL`);
      return false;
    }

    const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
    if (!lengthMatch) {
      console.error(`[youtube] isLongFormVideo(${videoId}): lengthSeconds not found in page HTML — YouTube may have returned a bot-check or consent page (${html.length} chars, starts with: ${html.slice(0, 120)})`);
      // Fail open.
      return true;
    }

    const lengthSeconds = Number(lengthMatch[1]);
    console.log(`[youtube] isLongFormVideo(${videoId}): ${lengthSeconds}s (min: ${minSeconds}s)`);
    return lengthSeconds >= minSeconds;
  } catch (err) {
    console.error(`[youtube] isLongFormVideo(${videoId}): unexpected error`, err);
    return true;
  }
}

export async function getLatestYouTubeVideo(): Promise<LatestVideo | null> {
  const explicitChannelId = process.env.YOUTUBE_CHANNEL_ID ?? "UCkWdWRPKcen8EMR_Xn6S8qw";
  const channelHandle = process.env.YOUTUBE_HANDLE ?? "@TiredDadTech";

  const channelId =
    explicitChannelId ?? (await resolveChannelIdFromHandle(channelHandle));

  if (!channelId) {
    console.error(`[youtube] getLatestYouTubeVideo: could not resolve channel ID`);
    return null;
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

  try {
    const feedRes = await fetch(feedUrl, {
      headers: { "User-Agent": BROWSER_UA },
      next: { revalidate: 900 },
    });

    if (!feedRes.ok) {
      console.error(`[youtube] getLatestYouTubeVideo: RSS feed fetch failed — ${feedRes.status} ${feedRes.statusText} (${feedUrl})`);
      return null;
    }

    const xml = await feedRes.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

    if (!entries.length) {
      console.error(`[youtube] getLatestYouTubeVideo: RSS feed returned no entries — feed length: ${xml.length} chars`);
      return null;
    }

    console.log(`[youtube] getLatestYouTubeVideo: ${entries.length} entries found in feed`);

    for (const entry of entries) {
      const title = extractTag(entry, "title") ?? "Latest Video";
      const videoId = extractTag(entry, "yt:videoId") ?? "";
      const url = extractHref(entry) ?? (videoId ? `https://youtu.be/${videoId}` : "");
      const published = extractTag(entry, "published") ?? "";

      if (!videoId && !url) {
        console.log(`[youtube] getLatestYouTubeVideo: skipping entry with no videoId or url`);
        continue;
      }

      if (videoId) {
        const longForm = await isLongFormVideo(videoId);
        if (!longForm) {
          console.log(`[youtube] getLatestYouTubeVideo: skipping Short — ${videoId} "${title}"`);
          continue;
        }
      }

      console.log(`[youtube] getLatestYouTubeVideo: returning video ${videoId} "${title}"`);
      return { title, url, videoId, published };
    }

    console.error(`[youtube] getLatestYouTubeVideo: all ${entries.length} entries were filtered out (all Shorts?)`);
    return null;
  } catch (err) {
    console.error(`[youtube] getLatestYouTubeVideo: unexpected error`, err);
    return null;
  }
}
