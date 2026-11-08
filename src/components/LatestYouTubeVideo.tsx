"use client";

import { useEffect, useState } from "react";
import { isLatestVideoStatus, newerVideo, REFRESH_INTERVAL_MS, type LatestVideo } from "@/lib/youtube";

export default function LatestYouTubeVideo({ initialVideo }: { initialVideo: LatestVideo }) {
  const [{ video, stale }, setDisplay] = useState({ video: initialVideo, stale: false });

  useEffect(() => {
    let stopped = false;
    let active = false;
    let controller: AbortController | undefined;
    let timer: ReturnType<typeof setTimeout>;

    async function refresh() {
      if (stopped || active || document.visibilityState === "hidden") return;
      active = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 10000);
      let delay = 60000;
      try {
        const response = await fetch("/api/youtube/latest", { cache: "no-store", signal: controller.signal });
        const status: unknown = response.ok ? await response.json() : null;
        if (!isLatestVideoStatus(status)) throw new Error("Latest video is unavailable");
        if (!stopped) {
          setDisplay(current => ({
            video: newerVideo(current.video, status.video),
            stale: status.stale || Date.parse(status.video.published) < Date.parse(current.video.published),
          }));
        }
        delay = Math.max(1000, Math.min(status.stale ? 60000 : REFRESH_INTERVAL_MS, Date.parse(status.nextCheckAt) - Date.now()));
      } catch {
        if (!stopped) setDisplay(current => ({ ...current, stale: true }));
      } finally {
        clearTimeout(timeout);
        active = false;
        if (!stopped) timer = setTimeout(refresh, delay);
      }
    }
    function onVisible() {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        void refresh();
      }
    }
    void refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      controller?.abort();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <>
      <div className="aspect-video overflow-hidden rounded-xl border border-cyan-300/20 bg-black/40 shadow-2xl shadow-cyan-950/30">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-lg font-medium">{video.title}</p>
      <a className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200" href={video.url} target="_blank" rel="noreferrer">
        Watch on YouTube →
      </a>
      {stale && <p role="status" className="mt-2 text-sm text-zinc-400">Latest upload check is temporarily unavailable. Showing the last known video.</p>}
      <noscript><p className="mt-2 text-sm text-zinc-400">Enable JavaScript for automatic updates, or visit the channel for the newest uploads.</p></noscript>
    </>
  );
}
