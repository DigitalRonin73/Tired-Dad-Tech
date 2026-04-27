import type { Metadata } from "next";
import Link from "next/link";
import { pcBuilds } from "@/content/pc-builds";
import PcBuildsBrowser from "./PcBuildsBrowser";

export const metadata: Metadata = {
  title: "PC Builds | Tired Dad Tech",
  description:
    "PC build logs from Tired Dad Tech with parts lists, specs, photos, YouTube walkthroughs, Linux gaming rigs, and budget build notes.",
};

export default function PcBuildsPage() {
  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">PC Builds</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Full build logs with structured spec sheets, photos, and YouTube walkthroughs.
          Search by part, platform, operating system, or the kind of build you want to copy.
        </p>

        <PcBuildsBrowser pcBuilds={pcBuilds} />
      </div>
    </main>
  );
}
