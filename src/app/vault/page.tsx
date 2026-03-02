import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";

export default function VaultPage() {
  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">The Project Vault</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Build logs, technical write-ups, and project outcomes. This is the digital
          garden version of my portfolio.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/vault/${project.slug}`}
              className="rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6 transition hover:border-cyan-300/50 hover:bg-[#0d1729]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">
                {project.category} · {project.status}
              </p>

              {project.imageUrls?.[0] ? (
                <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-cyan-300/20">
                  <Image
                    src={project.imageUrls[0]}
                    alt={`${project.title} thumbnail`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : null}

              <h2 className="mt-3 text-2xl font-semibold">{project.title}</h2>
              <p className="mt-2 text-zinc-300">{project.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
