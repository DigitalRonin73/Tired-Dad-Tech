import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';

// Isolated real Workers runtime. All outbound requests use fixtures; no uploads,
// production data, API credentials or account changes are involved.
const directory = '.programlist-local/test-worker';
const file = (await readdir(directory)).find(name => name.endsWith('.js'));
const fixture = `<?xml version="1.0"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"><entry><yt:videoId>0hBbb16Wsog</yt:videoId><yt:channelId>UCkWdWRPKcen8EMR_Xn6S8qw</yt:channelId><title>I Turned a Gaming PC Into a 4K Console</title><link rel="alternate" href="https://www.youtube.com/watch?v=0hBbb16Wsog"/><published>2026-11-08T21:00:14Z</published></entry></feed>`;
function runtime(outboundService) {
  return new Miniflare(convertV4MiniflareOptions({
    name: 'youtube-runtime-test', modules: true, scriptPath: `${directory}/${file}`,
    compatibilityDate: '2026-09-24', outboundService,
  }));
}
let calls = 0;
const mf = runtime(async request => {
  calls++;
  assert.equal(request.url, 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkWdWRPKcen8EMR_Xn6S8qw');
  return new Response(fixture, { headers: { 'content-type': 'text/xml' } });
});
try {
  const response = await mf.dispatchFetch('https://tireddadtech.test/api/youtube/latest?url=https://evil.example/');
  assert.equal(response.status, 200, 'A runtime endpoint must exist, not frozen build HTML');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json();
  assert.equal(body.video.videoId, '0hBbb16Wsog');
  assert.equal(body.source, 'youtube-feed');
  assert.equal(body.stale, false);
  assert.ok(body.checkedAt);
  const cached = await mf.dispatchFetch('https://tireddadtech.test/api/youtube/latest');
  assert.equal((await cached.json()).source, 'cache');
  assert.equal(calls, 1, 'Edge cache prevents redundant upstream requests');
  assert.equal((await mf.dispatchFetch('https://tireddadtech.test/api/youtube/latest', { method: 'POST' })).status, 405);
  assert.equal(await (await mf.dispatchFetch('https://tireddadtech.test/api/youtube/latest', { method: 'HEAD' })).text(), '');
} finally { await mf.dispose(); }
const unavailable = runtime(async () => new Response('Unavailable', { status: 503 }));
try {
  const response = await unavailable.dispatchFetch('https://tireddadtech.test/api/youtube/latest');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.video.videoId, '0hBbb16Wsog');
  assert.equal(body.source, 'fallback');
  assert.equal(body.stale, true);
  assert.equal(body.verifiedAt, null);
} finally { await unavailable.dispose(); }
console.log('PASS: runtime route, fixed upstream, cache, read-only methods and cold outage in isolated Workers.');
