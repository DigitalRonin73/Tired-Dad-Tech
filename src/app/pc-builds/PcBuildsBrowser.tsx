"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PcBuild } from "@/content/pc-builds";

type Props = {
  pcBuilds: PcBuild[];
};

const buildFilters = ["All", "AM5", "AM4", "Intel", "Linux", "Budget", "Small Form Factor"] as const;

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

function isPlaceholderImage(src: string) {
  return src.includes("/images/card-computer-builds.jpg");
}

function hasRealGallery(build: PcBuild) {
  return build.imageUrls.some((img) => !isPlaceholderImage(img));
}

function matchesFilter(build: PcBuild, filter: (typeof buildFilters)[number]) {
  if (filter === "All") return true;

  const haystack = [
    build.title,
    build.summary,
    build.specs.motherboard,
    build.specs.processor,
    build.specs.ram,
    build.specs.gpu,
    build.specs.case,
    build.specs.cooler,
    build.specs.details,
  ]
    .join(" ")
    .toLowerCase();

  if (filter === "Linux") return /linux|bazzite|steamos|zorin/.test(haystack);
  if (filter === "Budget") return /budget|under-budget|500|200|value|facebook/.test(haystack);
  if (filter === "Small Form Factor") return /mitx|mini-itx|sff|small-form|compact|deskmeet|ch160|metal fish/.test(haystack);

  return haystack.includes(filter.toLowerCase());
}

export default function PcBuildsBrowser({ pcBuilds }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof buildFilters)[number]>("All");

  const filteredBuilds = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pcBuilds.filter((build) => {
      const searchable = [
        build.title,
        build.summary,
        build.videoUrl,
        ...Object.values(build.specs),
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter(build, filter) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, pcBuilds, query]);

  const activeBuild = useMemo(
    () => pcBuilds.find((build) => build.slug === activeSlug) ?? null,
    [activeSlug, pcBuilds]
  );

  return (
    <>
      <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/90 p-5">
        <label className="block text-sm font-semibold text-cyan-200" htmlFor="build-search">
          Search PC builds
        </label>
        <input
          id="build-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try Bazzite, AM5, 7800X3D, budget, mini-ITX..."
          className="mt-3 w-full rounded-lg border border-cyan-300/20 bg-[#07101d] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-300/60"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {buildFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === item
                  ? "border-cyan-300/70 bg-cyan-400/15 text-cyan-50"
                  : "border-zinc-700 bg-black/20 text-zinc-300 hover:border-cyan-300/40"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {filteredBuilds.map((build) => (
          <button
            key={build.slug}
            onClick={() => {
              setZoomImage(null);
              setActiveSlug(build.slug);
            }}
            className="rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-5 text-left transition hover:border-cyan-300/50 hover:bg-[#0d1729]"
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

      {!filteredBuilds.length ? (
        <p className="mt-8 rounded-xl border border-cyan-400/20 bg-[#0a1220]/90 p-5 text-zinc-300">
          No builds matched that search. Try a part name, platform, or operating system.
        </p>
      ) : null}

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
                  Close x
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

              {hasRealGallery(activeBuild) ? (
                <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-5">
                  <h3 className="text-xl font-semibold">Build Gallery</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {activeBuild.imageUrls.filter((img) => !isPlaceholderImage(img)).map((img, idx) => (
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
              ) : null}

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
                  Close x
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
    </>
  );
}
