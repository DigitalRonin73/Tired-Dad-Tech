import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { getLatestYouTubeVideo } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Tired Dad Tech | PC Builds, Linux, Homelab, and Local AI",
  description:
    "Scott's Tired Dad Tech project vault for PC builds, Linux gaming rigs, homelab gear, local AI experiments, YouTube videos, and repeatable build notes.",
};

const startHereLinks = [
  {
    title: "Project Vault",
    description: "Build logs, commands, notes, and the weird little fixes that made each project work.",
    href: "/vault",
    label: "Browse projects",
  },
  {
    title: "PC Builds",
    description: "Parts lists, photos, specs, and YouTube walkthroughs for gaming rigs and budget rescues.",
    href: "/pc-builds",
    label: "See the builds",
  },
  {
    title: "Linux & Homelab",
    description: "Beginner-friendly Linux practice, homelab notes, and self-hosted experiments.",
    href: "/linux-lab",
    label: "Open the lab",
  },
  {
    title: "The War Room",
    description: "The office, rack, desk setup, tools, and workflow behind Tired Dad Tech.",
    href: "/war-room",
    label: "Tour the setup",
  },
];

export default async function HomePage() {
  const featured = projects.slice(0, 3);
  const latestVideo = await getLatestYouTubeVideo();

  return (
    <main className="tech-bg relative z-0 min-h-screen bg-[#070b12] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/heroimage.png"
          alt="Tired Dad Tech lab hero"
          fill
          priority
          sizes="100vw"
          className="parallax-hero object-cover object-center opacity-72"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b12]/30 via-[#070b12]/50 to-[#070b12]/85" />
      </div>

      <section className="reveal-section reveal-delay-1 mx-auto max-w-5xl px-4 pt-16 pb-8 text-center sm:px-6 md:pt-24 md:pb-10">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-cyan-300/20 bg-black/35 shadow-2xl shadow-cyan-950/30">
          <Image
            src="/images/brand-banner.jpg"
            alt="Tired Dad Tech"
            width={1280}
            height={511}
            priority
            className="h-auto w-full"
          />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Retired Vet • Dad • Late-Night Builder
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
          The Lab Opens When the House Goes Quiet.
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
          I&apos;m Scott: a retired vet, dad, and late-night builder. I make PC projects, Linux gaming rigs, homelab gear, and local AI experiments after dad duty winds down, then document the steps so someone else can follow the trail.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/vault"
            className="inline-flex w-full items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/25 sm:w-auto"
          >
            Start with the project vault
          </Link>
          <Link
            href="/war-room"
            className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-600/80 bg-black/20 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-cyan-300/50 hover:text-cyan-100 sm:w-auto"
          >
            See the War Room
          </Link>
        </div>
      </section>

      <section className="reveal-section reveal-delay-2 mx-auto max-w-6xl px-4 pb-10 sm:px-6 md:pb-14">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Latest from YouTube
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Watch the newest build</h2>
          </div>
          <a
            className="text-cyan-300 hover:text-cyan-200"
            href="https://www.youtube.com/@TiredDadTech"
            target="_blank"
            rel="noreferrer"
          >
            Visit the channel →
          </a>
        </div>
        {latestVideo?.videoId && (
          <>
            <div className="aspect-video overflow-hidden rounded-xl border border-cyan-300/20 bg-black/40 shadow-2xl shadow-cyan-950/30">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${latestVideo.videoId}`}
                title={latestVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-lg font-medium">{latestVideo.title}</p>
          </>
        )}
      </section>

      <section className="reveal-section reveal-delay-3 mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Start here
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Pick your rabbit hole</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {startHereLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-cyan-400/20 bg-[#0a1220]/90 p-5 transition hover:border-cyan-300/50 hover:bg-[#0d1729]"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300 md:min-h-[6rem]">{item.description}</p>
                <p className="mt-4 text-sm font-semibold text-cyan-300">{item.label} →</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Build notes
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Featured Projects</h2>
          </div>
          <Link className="text-cyan-300 hover:text-cyan-200" href="/vault">
            Get the details →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/vault/${project.slug}`}
              className="rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-5 transition hover:border-cyan-300/50 hover:bg-[#0d1729]"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-cyan-300">
                {project.category} · {project.status}
              </p>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{project.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl border border-cyan-400/20 bg-[#0a1220]/80 p-5 text-zinc-300">
          <p className="text-sm uppercase tracking-[0.16em] text-cyan-300">Tired Dad Note</p>
          <p className="mt-2 text-sm leading-6">
            Built between real life, late nights, and coffee refills. Not perfect. Always improving.
          </p>
          <p className="mt-3 text-cyan-200/80" style={{ fontFamily: "'Comic Sans MS', 'Marker Felt', cursive" }}>
            ~~~ keep building, keep improving ~~~
          </p>
          <a
            href="mailto:Scott@TiredDadTech.com"
            className="mt-4 inline-flex items-center rounded-lg border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/20"
          >
            Contact Me: Scott@TiredDadTech.com
          </a>
        </div>
      </footer>
    </main>
  );
}
