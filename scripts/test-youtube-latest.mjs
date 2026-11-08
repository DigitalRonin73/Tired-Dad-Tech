import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getLatestYouTubeVideo, parseLatestVideo, getLatestVideoStatus, newerVideo,
  isLatestVideoStatus, FALLBACK_LATEST_VIDEO as pinned, YOUTUBE_CHANNEL_ID, YOUTUBE_FEED_URL,
} from "../src/lib/youtube.ts";

const now = Date.parse("2026-11-11T00:00:00Z");
function entry(videoId, published, title = "Build video", options = {}) {
  const url = options.short ? `https://www.youtube.com/shorts/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`;
  return `<entry><title>${title}</title><yt:channelId>${options.channel ?? YOUTUBE_CHANNEL_ID}</yt:channelId><yt:videoId>${videoId}</yt:videoId><link rel="alternate" href="${url}"/><published>${published}</published></entry>`;
}
const fresh = entry("newbuild123", "2026-11-10T21:00:00Z", "Next build");
function withFeed(t, xml) {
  t.mock.method(Date, "now", () => now);
  return t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, YOUTUBE_FEED_URL, "Only the fixed official RSS URL may be fetched");
    assert.ok(options.signal, "Upstream fetch is timeout-bounded");
    return new Response(xml);
  });
}
function memoryCache() {
  const stored = new Map();
  return { async match(key) { return stored.get(key)?.clone(); }, async put(key, value) { stored.set(key, value.clone()); } };
}

test("feed failure retains independently verified public video", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  assert.deepEqual(await getLatestYouTubeVideo(), pinned);
});
test("an older feed cannot regress static fallback", async t => {
  withFeed(t, entry("KS0hY3pkjgU", "2026-08-26T21:00:00Z"));
  assert.deepEqual(await getLatestYouTubeVideo(), pinned);
});
test("pinned video is selected without a watch-page request", async t => {
  const fetch = withFeed(t, entry(pinned.videoId, pinned.published, pinned.title));
  assert.deepEqual(await getLatestYouTubeVideo(), pinned);
  assert.equal(fetch.mock.callCount(), 1);
});
test("a new standard video supersedes fallback without duration scraping", async t => {
  const fetch = withFeed(t, fresh);
  assert.equal((await getLatestYouTubeVideo()).videoId, "newbuild123");
  assert.equal(fetch.mock.callCount(), 1);
});
test("Shorts use official alternate URL classification, not guessed duration", () => {
  assert.equal(parseLatestVideo(entry("newshort123", "2026-11-10T22:00:00Z", "Short", { short: true }) + fresh, now).videoId, "newbuild123");
});
test("publication order wins over feed order, not later updates", () => {
  assert.equal(parseLatestVideo(entry(pinned.videoId, pinned.published) + fresh, now).videoId, "newbuild123");
});
test("undated, future, malformed, wrong-channel and wrong-host entries are rejected", () => {
  for (const xml of [entry("undated1234", ""), entry("future12345", "2030-01-01T00:00:00Z"), entry("bad", pinned.published), entry(pinned.videoId, pinned.published, "Bad", { channel: "another-channel" }), fresh.replace("www.youtube.com/watch", "evil.example/watch"), "<html>Consent page</html>"]) {
    assert.equal(parseLatestVideo(xml, now), null);
  }
});
test("XML entities and CDATA are decoded as text", () => {
  assert.equal(parseLatestVideo(entry(pinned.videoId, pinned.published, "Dad&#39;s &amp; &quot;PC&quot; &#x1f4bb;"), now).title, 'Dad\'s & "PC" 💻');
  assert.equal(parseLatestVideo(entry(pinned.videoId, pinned.published, "<![CDATA[A & B]]>"), now).title, "A & B");
});
test("new upload replaces previous cache after 15 minutes without a rebuild", async t => {
  const cache = memoryCache();
  const fetch = withFeed(t, entry(pinned.videoId, pinned.published));
  const first = await getLatestVideoStatus(cache, now);
  assert.equal(first.source, "youtube-feed");
  assert.equal(first.stale, false);
  const hit = await getLatestVideoStatus(cache, now + 1000);
  assert.equal(hit.source, "cache");
  assert.equal(fetch.mock.callCount(), 1);
  withFeed(t, fresh);
  const next = await getLatestVideoStatus(cache, now + 900001);
  assert.equal(next.video.videoId, "newbuild123");
  assert.equal(next.source, "youtube-feed");
  assert.equal(next.verifiedAt, new Date(now + 900001).toISOString());
});
test("upstream outage preserves last known video and verification time, then recovers", async t => {
  const cache = memoryCache();
  withFeed(t, fresh);
  const good = await getLatestVideoStatus(cache, now);
  t.mock.method(globalThis, "fetch", async () => { throw new DOMException("Timed out", "TimeoutError"); });
  const fail = await getLatestVideoStatus(cache, now + 900001);
  assert.equal(fail.video.videoId, good.video.videoId);
  assert.equal(fail.stale, true);
  assert.equal(fail.verifiedAt, good.verifiedAt);
  assert.equal(Date.parse(fail.nextCheckAt) - Date.parse(fail.checkedAt), 60000);
  withFeed(t, fresh);
  assert.equal((await getLatestVideoStatus(cache, now + 960002)).stale, false);
});
test("malformed or regressed feed cannot replace last known runtime video", async t => {
  for (const xml of ["<html>Consent</html>", entry(pinned.videoId, pinned.published)]) {
    const cache = memoryCache();
    withFeed(t, fresh);
    const good = await getLatestVideoStatus(cache, now);
    withFeed(t, xml);
    const bad = await getLatestVideoStatus(cache, now + 900001);
    assert.equal(bad.video.videoId, good.video.videoId);
    assert.equal(bad.stale, true);
    assert.equal(bad.verifiedAt, good.verifiedAt);
  }
});
test("cold failure returns explicit unconfirmed fallback, never fresh status", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("bad", { status: 503 }));
  const status = await getLatestVideoStatus(undefined, now);
  assert.deepEqual(status.video, pinned);
  assert.equal(status.source, "fallback");
  assert.equal(status.stale, true);
  assert.equal(status.verifiedAt, null);
});
test("cache errors do not discard a good upstream response", async t => {
  withFeed(t, fresh);
  const broken = { async match() { throw new Error("cache read"); }, async put() { throw new Error("cache write"); } };
  assert.equal((await getLatestVideoStatus(broken, now)).video.videoId, "newbuild123");
});
test("client rejects malformed payload and preserves a newer displayed video", async t => {
  withFeed(t, fresh);
  const good = await getLatestVideoStatus(undefined, now);
  assert.equal(isLatestVideoStatus(good), true);
  assert.equal(isLatestVideoStatus({ ...good, video: { ...good.video, url: "javascript:alert(1)" } }), false);
  assert.equal(isLatestVideoStatus({ ...good, stale: "false" }), false);
  assert.equal(isLatestVideoStatus({ ...good, checkedAt: "unknown" }), false);
  assert.equal(newerVideo(good.video, pinned).videoId, good.video.videoId);
});
