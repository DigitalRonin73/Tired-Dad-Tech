"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { pcBuilds } from "@/content/pc-builds";

function toYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;

      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx >= 0 && parts[idx + 1]) {
        return `https://www.youtube.com/embed/${parts[idx + 1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function PcBuildsPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const activeBuild = useMemo(
    () => pcBuilds.find((build) => build.slug === activeSlug) ?? null,
    [activeSlug]
  );

  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">PC Builds</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Full build logs with structured spec sheets, photos, and YouTube walkthroughs.
          Click any card to open details in a popup window.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {pcBuilds.map((build) => (
            <button
              key={build.slug}
              onClick={() => {
                setZoomImage(null);
                setActiveSlug(build.slug);
              }}
              className="text-left rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-5 transition hover:border-cyan-300/50 hover:bg-[#0d1729]"
            >
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-cyan-300/20">
                <Image
                  src={build.imageUrls[0]}
                  alt={build.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold">{build.title}</h2>
              <p className="mt-2 text-zinc-300">{build.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {activeBuild && (
        <>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            onClick={() => {
              setZoomImage(null);
              setActiveSlug(null);
            }}
          >
            <div
              className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-cyan-400/25 bg-[#07121f] p-5 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">{activeBuild.title}</h2>
                <p className="mt-2 text-zinc-300">{activeBuild.summary}</p>
              </div>
              <button
                onClick={() => {
                  setZoomImage(null);
                  setActiveSlug(null);
                }}
                className="rounded-lg border border-cyan-300/40 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-400/10"
              >
                Close ✕
              </button>
            </div>

            <section className="rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-5">
              <h3 className="text-xl font-semibold">Spec Sheet</h3>
              <dl className="mt-4 grid gap-3 md:grid-cols-2">
                <div><dt className="text-cyan-300">Motherboard</dt><dd className="text-zinc-200">{activeBuild.specs.motherboard}</dd></div>
                <div><dt className="text-cyan-300">Processor</dt><dd className="text-zinc-200">{activeBuild.specs.processor}</dd></div>
                <div><dt className="text-cyan-300">Ram</dt><dd className="text-zinc-200">{activeBuild.specs.ram}</dd></div>
                <div><dt className="text-cyan-300">GPU</dt><dd className="text-zinc-200">{activeBuild.specs.gpu}</dd></div>
                <div><dt className="text-cyan-300">PSU</dt><dd className="text-zinc-200">{activeBuild.specs.psu}</dd></div>
                <div><dt className="text-cyan-300">Case</dt><dd className="text-zinc-200">{activeBuild.specs.case}</dd></div>
                <div><dt className="text-cyan-300">Cooler</dt><dd className="text-zinc-200">{activeBuild.specs.cooler}</dd></div>
              </dl>
              <div className="mt-5">
                <h4 className="text-cyan-300">Details</h4>
                <p className="mt-1 text-zinc-200">{activeBuild.specs.details}</p>
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-5">
              <h3 className="text-xl font-semibold">Build Gallery</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {activeBuild.imageUrls.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setZoomImage(img)}
                    className="relative aspect-video overflow-hidden rounded-lg border border-cyan-300/20"
                    title="Open image"
                  >
                    <Image
                      src={img}
                      alt={`${activeBuild.title} image ${idx + 1}`}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-5">
              <h3 className="text-xl font-semibold">YouTube Build Video</h3>
              {activeBuild.videoUrl && toYouTubeEmbedUrl(activeBuild.videoUrl) ? (
                <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-cyan-300/20">
                  <iframe
                    className="h-full w-full"
                    src={toYouTubeEmbedUrl(activeBuild.videoUrl) ?? undefined}
                    title={`${activeBuild.title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : activeBuild.videoUrl ? (
                <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-amber-100">
                  Embed unavailable in this browser. Open video directly:{" "}
                  <a className="underline" href={activeBuild.videoUrl} target="_blank" rel="noreferrer">
                    Watch on YouTube
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-zinc-300">No video linked yet.</p>
              )}
            </section>
            </div>
          </div>

          {zoomImage && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
              onClick={() => setZoomImage(null)}
            >
              <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setZoomImage(null)}
                  className="absolute -top-12 right-0 rounded-lg border border-cyan-300/40 px-3 py-1 text-sm text-cyan-100 hover:bg-cyan-400/10"
                >
                  Close ✕
                </button>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-cyan-300/30 bg-black">
                  <Image
                    src={zoomImage}
                    alt="Build image full view"
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
