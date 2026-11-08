import assert from "node:assert/strict";
import { test } from "node:test";
import { getLatestYouTubeVideo } from "../src/lib/youtube.ts";

const pinned = {
  title: "I Turned a Gaming PC Into a 4K Console",
  url: "https://www.youtube.com/watch?v=0hBbb16Wsog",
  videoId: "0hBbb16Wsog",
  published: "2026-11-08T21:00:14Z",
};

function entry(videoId, published, title = "Build video") {
  return `<entry><title>${title}</title><yt:videoId>${videoId}</yt:videoId><link href="https://www.youtube.com/watch?v=${videoId}"/><published>${published}</published></entry>`;
}

async function withFeed(t, xml, watchHtml = '"lengthSeconds":"397"') {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (String(url).includes("/feeds/videos.xml")) {
      return new Response(xml, { status: 200 });
    }
    if (String(url).startsWith("https://www.youtube.com/watch?v=")) {
      return new Response(watchHtml, { status: 200 });
    }
    throw new Error(`Unexpected URL: ${url}`);
  });
  return getLatestYouTubeVideo();
}

test("feed failure retains the latest independently verified public video", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  assert.deepEqual(await getLatestYouTubeVideo(), pinned);
});

test("an older feed cannot regress the featured video", async (t) => {
  const result = await withFeed(t, entry("KS0hY3pkjgU", "2026-08-26T21:00:00Z", "XREAL One Pro: A Dad’s Take"));
  assert.deepEqual(result, pinned);
});

test("missing watch-page duration cannot hide the verified pinned video", async (t) => {
  const result = await withFeed(t, entry(pinned.videoId, pinned.published, pinned.title), "Consent page");
  assert.deepEqual(result, pinned);
});

test("a newer long-form upload can supersede the pinned video", async (t) => {
  const result = await withFeed(t, entry("newbuild123", "2026-11-10T21:00:00Z", "Next build"));
  assert.deepEqual(result, {
    title: "Next build",
    url: "https://www.youtube.com/watch?v=newbuild123",
    videoId: "newbuild123",
    published: "2026-11-10T21:00:00Z",
  });
});

test("an undated feed item cannot displace a verified recent upload", async (t) => {
  assert.deepEqual(await withFeed(t, entry("undated1234", "")), pinned);
});

test("newer Shorts do not displace the latest long-form video", async (t) => {
  assert.deepEqual(await withFeed(t, entry("newshort123", "2026-11-10T21:00:00Z"), '"lengthSeconds":"30"'), pinned);
});
