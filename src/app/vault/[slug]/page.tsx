import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

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
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {project.imageUrls.map((img, idx) => (
                <div key={`${img}-${idx}`} className="relative aspect-video overflow-hidden rounded-xl border border-cyan-300/20">
                  <Image
                    src={img}
                    alt={`${project.title} image ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
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
