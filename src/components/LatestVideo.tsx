"use client";

import { useEffect, useState } from "react";

type VideoData = {
  title: string;
  videoId: string;
};

export default function LatestVideo() {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<VideoData>;
      })
      .then(setVideo)
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <p className="text-zinc-400">Latest long-form video unavailable right now.</p>
    );
  }

  if (!video) {
    return (
      <p className="text-zinc-400">Loading...</p>
    );
  }

  return (
    <>
      <div className="aspect-video overflow-hidden rounded-xl">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-lg font-medium">{video.title}</p>
    </>
  );
}
