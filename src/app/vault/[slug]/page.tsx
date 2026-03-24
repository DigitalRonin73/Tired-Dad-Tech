import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import ProjectGallery from "@/components/ProjectGallery";
import CopyCodeBlock from "@/components/CopyCodeBlock";
import { getLatestYouTubeVideo } from "@/lib/youtube";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  const isBc250CoolingGuide =
    project.slug === "i-turned-a-bc250-into-an-ai-agent-with-openclaw";
  const latestVideo = isBc250CoolingGuide ? await getLatestYouTubeVideo() : null;

  const openClawInstallCommands = `# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# Run onboarding + install daemon service
openclaw onboard --install-daemon

# Verify and start gateway daemon
openclaw gateway status
openclaw gateway start

# Confirm full status
openclaw status`;

  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/vault" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Project Vault
        </Link>

        <p className="mt-5 text-xs uppercase tracking-[0.16em] text-cyan-300">
          {project.category} · {project.status}
        </p>
        <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{project.title}</h1>
        <p className="mt-4 text-zinc-300">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.imageUrls?.length ? (
          <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
            <h2 className="text-2xl font-semibold">Project Gallery</h2>
            <ProjectGallery title={project.title} imageUrls={project.imageUrls} />
          </section>
        ) : null}

        {isBc250CoolingGuide ? (
          <section className="mt-10 space-y-5 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
            <h2 className="text-2xl font-semibold">BC-250 Cooling Mod + CachyOS + OpenClaw</h2>

            {latestVideo?.videoId ? (
              <div className="aspect-video overflow-hidden rounded-xl border border-cyan-300/20">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${latestVideo.videoId}`}
                  title={latestVideo.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}

            <ol className="list-decimal space-y-2 pl-5 text-zinc-300">
              <li>Cut/remove the top section of the stock heatsink fins to open up airflow over the APU block.</li>
              <li>Mount a 120mm fan directly over the fin stack. Recommended: <strong>Arctic P12 Pro</strong>.</li>
              <li>Jump the ATX 24-pin connector so the PSU can power on without a motherboard front-panel signal.</li>
              <li>Install SSD storage, then install CachyOS and proceed with OpenClaw setup from terminal.</li>
            </ol>

            <div className="rounded-xl border border-cyan-300/20 bg-[#07101d] p-4">
              <h3 className="text-lg font-semibold">ATX 24-pin jump (paperclip method)</h3>
              <p className="mt-2 text-zinc-300">
                On a standard ATX 24-pin connector, jumper <strong>PS_ON (green wire, pin 16)</strong> to any
                <strong> GND (black wire)</strong>. This allows the PSU to start when switched on.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-700/80 bg-black/30 p-3 text-sm text-zinc-100">
                <code>{`Top view (clip/latch side up)

13 14 15 16 17 18 19 20 21 22 23 24
 1  2  3  4  5  6  7  8  9 10 11 12

Pin 16 = PS_ON (green)  ---> jumper ---> any GND pin (black)
Example GND options: pins 15, 17, 18, 19, 24 (wire color can vary by PSU)`}</code>
              </pre>
              <p className="mt-2 text-xs text-zinc-400">
                Always disconnect AC power first, verify pinout for your PSU model, and insulate the jumper.
              </p>
            </div>

            <div className="space-y-2 text-zinc-300">
              <h3 className="text-lg font-semibold">Reference links</h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  BC-250 docs: <a className="text-cyan-300 underline" href="https://elektricm.github.io/amd-bc250-docs/getting-started/introduction/" target="_blank" rel="noreferrer">elektricm.github.io/amd-bc250-docs</a>
                </li>
                <li>
                  Official CachyOS: <a className="text-cyan-300 underline" href="https://cachyos.org/" target="_blank" rel="noreferrer">cachyos.org</a>
                </li>
              </ul>
            </div>

            <CopyCodeBlock title="Install OpenClaw + run onboard daemon" code={openClawInstallCommands} />
          </section>
        ) : null}

        <section className="mt-10 space-y-4 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
          <h2 className="text-2xl font-semibold">Build Notes</h2>
          {project.body.map((paragraph) => (
            <p key={paragraph} className="text-zinc-300">
              {paragraph}
            </p>
          ))}
        </section>
      </article>
    </main>
  );
}
