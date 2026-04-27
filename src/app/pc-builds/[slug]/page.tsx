import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pcBuilds } from "@/content/pc-builds";

type Props = { params: Promise<{ slug: string }> };

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

export async function generateStaticParams() {
  return pcBuilds.map((build) => ({ slug: build.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const build = pcBuilds.find((item) => item.slug === slug);

  if (!build) {
    return {
      title: "PC Build | Tired Dad Tech",
    };
  }

  return {
    title: `${build.title} | Tired Dad Tech`,
    description: `${build.summary} Parts: ${build.specs.processor}, ${build.specs.gpu}, ${build.specs.case}.`,
  };
}

export default async function PcBuildDetailPage({ params }: Props) {
  const { slug } = await params;
  const build = pcBuilds.find((item) => item.slug === slug);
  if (!build) notFound();
  const realImages = build.imageUrls.filter((img) => !isPlaceholderImage(img));

  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/pc-builds" className="text-cyan-300 hover:text-cyan-200">
          ← Back to PC Builds
        </Link>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{build.title}</h1>
        <p className="mt-3 max-w-4xl text-zinc-300">{build.summary}</p>

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-6">
          <h2 className="text-2xl font-semibold">Spec Sheet</h2>
          <dl className="mt-5 grid gap-3 md:grid-cols-2">
            <div><dt className="text-cyan-300">Motherboard</dt><dd className="text-zinc-200">{build.specs.motherboard}</dd></div>
            <div><dt className="text-cyan-300">Processor</dt><dd className="text-zinc-200">{build.specs.processor}</dd></div>
            <div><dt className="text-cyan-300">Ram</dt><dd className="text-zinc-200">{build.specs.ram}</dd></div>
            <div><dt className="text-cyan-300">GPU</dt><dd className="text-zinc-200">{build.specs.gpu}</dd></div>
            <div><dt className="text-cyan-300">PSU</dt><dd className="text-zinc-200">{build.specs.psu}</dd></div>
            <div><dt className="text-cyan-300">Case</dt><dd className="text-zinc-200">{build.specs.case}</dd></div>
            <div><dt className="text-cyan-300">Cooler</dt><dd className="text-zinc-200">{build.specs.cooler}</dd></div>
          </dl>

          <div className="mt-6">
            <h3 className="text-cyan-300">Details</h3>
            <p className="mt-1 text-zinc-200">{build.specs.details}</p>
          </div>
        </section>

        {realImages.length ? (
          <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-6">
            <h2 className="text-2xl font-semibold">Build Gallery</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {realImages.map((img, idx) => (
                <div key={`${img}-${idx}`} className="relative aspect-video overflow-hidden rounded-lg border border-cyan-300/20">
                  <Image src={img} alt={`${build.title} image ${idx + 1}`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-6">
          <h2 className="text-2xl font-semibold">YouTube Build Video</h2>
          {build.videoUrl && toYouTubeEmbedUrl(build.videoUrl) ? (
            <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-cyan-300/20">
              <iframe
                className="h-full w-full"
                src={toYouTubeEmbedUrl(build.videoUrl) ?? undefined}
                title={`${build.title} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : build.videoUrl ? (
            <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-amber-100">
              Embed unavailable in this browser. Open video directly:{" "}
              <a className="underline" href={build.videoUrl} target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </div>
          ) : (
            <p className="mt-3 text-zinc-300">No video linked yet.</p>
          )}
        </section>
      </article>
    </main>
  );
}
