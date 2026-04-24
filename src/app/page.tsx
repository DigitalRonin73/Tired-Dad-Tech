import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import LatestVideo from "@/components/LatestVideo";

export default function HomePage() {
  const featured = projects.slice(0, 3);

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

      <section className="reveal-section reveal-delay-1 px-4 pt-16 pb-10 text-center sm:px-6 md:pt-24 md:pb-12">
        <h1 className="max-w-4xl mx-auto text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
          The Lab Opens When the House Goes Quiet.
        </h1>
      </section>

      <section className="reveal-section reveal-delay-2 mx-auto max-w-6xl px-4 pb-10 sm:px-6 md:pb-14">
        <LatestVideo />
      </section>

      <section className="reveal-section reveal-delay-3 mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold">Featured Projects</h2>
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
