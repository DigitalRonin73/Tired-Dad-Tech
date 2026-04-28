import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
};

const statusLabels: Record<Project["status"], string> = {
  Completed: "Built",
  "In Progress": "In Progress",
  Planned: "Planned",
};

export default function ProjectCard({ project }: Props) {
  const thumbnailUrl =
    project.imageUrls?.[0] ??
    (project.youtube ? `https://img.youtube.com/vi/${project.youtube.videoId}/hqdefault.jpg` : null);
  const watchUrl = project.youtube
    ? `https://www.youtube.com/watch?v=${project.youtube.videoId}`
    : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0a1220] transition hover:border-cyan-300/50 hover:bg-[#0d1729]">
      {thumbnailUrl ? (
        <div className="relative aspect-video border-b border-cyan-400/15">
          <Image
            src={thumbnailUrl}
            alt={`${project.title} build log thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-90 transition group-hover:opacity-100"
            unoptimized={thumbnailUrl.startsWith("https://")}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07101d] to-transparent p-3">
            <span className="inline-flex rounded-md border border-cyan-300/35 bg-[#07101d]/85 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-cyan-100">
              Build Log
            </span>
          </div>
        </div>
      ) : null}

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-100">
            {statusLabels[project.status]}
          </span>
          <span className="rounded-full border border-zinc-700 bg-black/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-zinc-300">
            {project.category}
          </span>
          {project.buildType ? (
            <span className="rounded-full border border-orange-400/35 bg-orange-400/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-orange-100">
              {project.buildType}
            </span>
          ) : null}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-zinc-100">{project.title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{project.summary}</p>
        </div>

        {(project.outcome || project.difficulty) ? (
          <dl className="grid gap-3 rounded-xl border border-cyan-300/15 bg-black/20 p-3 text-sm sm:grid-cols-2">
            {project.outcome ? (
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-cyan-300">
                  Outcome
                </dt>
                <dd className="mt-1 text-zinc-300">{project.outcome}</dd>
              </div>
            ) : null}
            {project.difficulty ? (
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-cyan-300">
                  Difficulty
                </dt>
                <dd className="mt-1 text-zinc-300">{project.difficulty}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-cyan-400/15 pt-4">
          {watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-orange-400/60 bg-orange-400/10 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-orange-100 transition hover:bg-orange-400/20"
            >
              Watch Build
            </a>
          ) : (
            <span className="rounded-lg border border-zinc-700 bg-black/20 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
              Watch Pending
            </span>
          )}
          <Link
            href={`/vault/${project.slug}`}
            className="rounded-lg border border-cyan-300/50 bg-cyan-400/10 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-cyan-100 transition hover:bg-cyan-400/20"
          >
            Read Notes
          </Link>
        </div>
      </div>
    </article>
  );
}
