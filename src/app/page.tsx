import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { getLatestYouTubeVideo } from "@/lib/youtube";

export default async function HomePage() {
  const latestVideo = await getLatestYouTubeVideo();
  const featured = projects.slice(0, 3);

  return (
    <main className="tech-bg relative z-0 min-h-screen bg-[#070b12] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/images/hero-lab-console.jpg"
          alt="Tired Dad Tech lab hero"
          fill
          priority
          sizes="100vw"
          className="parallax-hero object-cover object-center opacity-72"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b12]/35 via-[#070b12]/60 to-[#070b12]/92" />
      </div>

      <section className="reveal-section reveal-delay-1 relative isolate border-b border-cyan-400/20">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-28">
          <nav className="mb-8 flex flex-col gap-4 text-sm text-zinc-200">
            <Image
              src="/images/brand-banner.jpg"
              alt="Tired Dad Tech banner"
              width={2400}
              height={800}
              className="h-auto max-h-[180px] w-full rounded-xl border border-cyan-300/40 object-cover shadow-[0_8px_24px_rgba(34,211,238,0.18)] sm:max-h-[200px]"
              priority
            />
            <div className="flex flex-wrap gap-3 sm:justify-center">
              <Link className="nav-pill" href="/war-room">
                <span>The War Room</span>
                <span aria-hidden>↗</span>
              </Link>
              <Link className="nav-pill" href="/vault">
                <span>The Project Vault</span>
                <span aria-hidden>↗</span>
              </Link>
              <Link className="nav-pill" href="/pc-builds">
                <span>PC Builds</span>
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </nav>

          <div className="mb-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-cyan-300">
            <span className="rounded-full border border-cyan-400/40 px-3 py-1">Homelab</span>
            <span className="rounded-full border border-cyan-400/40 px-3 py-1">Computer Builds</span>
            <span className="rounded-full border border-cyan-400/40 px-3 py-1">Project Vault</span>
          </div>

          <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
            Build smarter systems. Ship better projects. Document everything.
          </h1>

          <p className="mt-5 max-w-3xl text-base text-zinc-200 sm:text-lg">
            I document real computer builds, homelab systems, and hands-on projects with
            actionable detail—so you can see exactly how it was built, tuned, and shipped.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/vault"
              className="cta-sheen rounded-xl bg-cyan-400 px-5 py-3 text-center font-medium text-[#07121f] hover:bg-cyan-300"
            >
              Explore the Project Vault
            </Link>
            <Link
              href="/war-room"
              className="cta-sheen rounded-xl border border-cyan-300/40 px-5 py-3 text-center font-medium text-cyan-100 hover:bg-cyan-400/10"
            >
              Enter The War Room
            </Link>
          </div>
        </div>
      </section>

      <section className="reveal-section reveal-delay-2 mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:gap-8 md:py-14 md:grid-cols-[1.4fr_1fr]">
        <article className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#0a1220]/85 p-6">
          <Image
            src="/images/section-latest-video.jpg"
            alt="Latest video section background"
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover opacity-38"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#081321]/58 via-[#0a1220]/72 to-[#0a1220]/86" />
          <div className="relative z-10">
            <h2 className="mb-4 text-2xl font-semibold">Latest YouTube Upload</h2>

            {latestVideo ? (
              <>
                <div className="aspect-video overflow-hidden rounded-xl border border-zinc-700/90 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${latestVideo.videoId}`}
                    title={latestVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-lg font-medium">{latestVideo.title}</p>
                <a
                  className="mt-2 inline-block text-cyan-300 hover:text-cyan-200"
                  href={latestVideo.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on YouTube →
                </a>
              </>
            ) : (
              <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-200">
                Could not auto-load latest video yet. Set <code>YOUTUBE_CHANNEL_ID</code> in
                environment for guaranteed feed detection.
              </div>
            )}
          </div>
        </article>

        <aside className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#0a1220]/90 p-6">
          <Image
            src="/images/graphic-dashboard.jpg"
            alt="Dashboard graphic"
            fill
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover opacity-36"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#081321]/56 via-[#0a1220]/70 to-[#0a1220]/86" />
          <div className="relative z-10">
            <h3 className="mb-4 text-xl font-semibold">Mission Control Snapshot</h3>
            <ul className="space-y-2 text-zinc-200">
              <li>• Homelab systems and service architecture</li>
              <li>• Computer build guides and performance tuning</li>
              <li>• Project postmortems and implementation notes</li>
              <li>• Resume-grade technical portfolio</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="reveal-section reveal-delay-3 mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold">Featured Projects</h2>
          <Link className="text-cyan-300 hover:text-cyan-200" href="/vault">
            View all →
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
    </main>
  );
}
