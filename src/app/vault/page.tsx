import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/content/projects";
import ProjectVaultBrowser from "./ProjectVaultBrowser";

export const metadata: Metadata = {
  title: "Project Vault | Tired Dad Tech",
  description:
    "Build logs, command notes, homelab projects, local AI experiments, and practical repair trails from Tired Dad Tech.",
};

export default function VaultPage() {
  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">The Project Vault</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Build logs, technical write-ups, and project outcomes from the after-hours lab.
          This is where I keep the steps, commands, lessons learned, and fixes that made
          the projects worth sharing.
        </p>

        <ProjectVaultBrowser projects={projects} />
      </div>
    </main>
  );
}
