"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/content/projects";

type Props = {
  projects: Project[];
};

const categoryFilters = ["All", "Project", "Homelab", "Computer Build"] as const;

export default function ProjectVaultBrowser({ projects }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categoryFilters)[number]>("All");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === "All" || project.category === category;
      const searchable = [
        project.title,
        project.summary,
        project.status,
        project.category,
        ...project.stack,
        ...project.body,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, projects, query]);

  return (
    <>
      <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/90 p-5">
        <label className="block text-sm font-semibold text-cyan-200" htmlFor="project-search">
          Search the vault
        </label>
        <input
          id="project-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try BC250, Jarvis, CachyOS, Home Assistant..."
          className="mt-3 w-full rounded-lg border border-cyan-300/20 bg-[#07101d] px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-300/60"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {categoryFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setCategory(filter)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                category === filter
                  ? "border-cyan-300/70 bg-cyan-400/15 text-cyan-50"
                  : "border-zinc-700 bg-black/20 text-zinc-300 hover:border-cyan-300/40"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
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

      {!filteredProjects.length ? (
        <p className="mt-8 rounded-xl border border-cyan-400/20 bg-[#0a1220]/90 p-5 text-zinc-300">
          Nothing matched that search yet. The lab shelves are full, but not that full.
        </p>
      ) : null}
    </>
  );
}
