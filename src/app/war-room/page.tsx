import Link from "next/link";

const stack = [
  "Proxmox",
  "Docker",
  "Cloudflare",
  "Tailscale",
  "Networking",
  "Backups",
  "Observability",
  "Automation",
];

export default function WarRoomPage() {
  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Home
        </Link>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">The War Room</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Home lab architecture, active systems, and infrastructure notes. This is where
          I document what runs, why it runs, and how I maintain it.
        </p>

        <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
          <h2 className="text-2xl font-semibold">Current Stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-cyan-300/30 px-3 py-1 text-sm text-cyan-100"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-5">
            <h3 className="font-semibold">Infra Goals</h3>
            <p className="mt-2 text-sm text-zinc-300">High availability, fast recovery, and clear observability.</p>
          </article>
          <article className="rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-5">
            <h3 className="font-semibold">Service Inventory</h3>
            <p className="mt-2 text-sm text-zinc-300">Placeholder for running services and internal dependencies.</p>
          </article>
          <article className="rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-5">
            <h3 className="font-semibold">Change Log</h3>
            <p className="mt-2 text-sm text-zinc-300">Placeholder for updates, incidents, and lessons learned.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
