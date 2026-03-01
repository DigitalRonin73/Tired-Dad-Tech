import Image from "next/image";
import Link from "next/link";

export default function WarRoomPage() {
  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back to Home
        </Link>

        <header className="mt-4 border-b border-cyan-400/20 pb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">The War Room</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">
            Inside the office: the setup, the workflow, and the infrastructure behind Tired Dad Tech.
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            This is the working environment where builds are planned, tested, filmed, and documented.
            Think of it as a living magazine feature for the desk, the rig, and the systems that support the channel.
          </p>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-[1.25fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-cyan-400/25">
            <Image
              src="/images/pc-builds/placeholder-war-room-rig/file_16---5011758c-67af-423a-95e2-0b74073455bc.jpg"
              alt="War Room main rig"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <aside className="rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-5">
            <h2 className="text-2xl font-semibold">Main Setup</h2>
            <p className="mt-3 text-zinc-300">
              The main workstation is tuned for all-day responsiveness, quiet thermals, and enough GPU headroom
              for gaming, editing, and workflow experiments.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li><span className="text-cyan-300">Motherboard:</span> ASUS Prime B650 WiFi</li>
              <li><span className="text-cyan-300">CPU:</span> Ryzen 7 7800X3D</li>
              <li><span className="text-cyan-300">RAM:</span> 32GB DDR5 CL30 6000MHz</li>
              <li><span className="text-cyan-300">GPU:</span> ASUS RX4090</li>
              <li><span className="text-cyan-300">PSU:</span> Corsair RM1000x</li>
              <li><span className="text-cyan-300">Case:</span> Lian Li Lancool 217</li>
              <li><span className="text-cyan-300">Cooler:</span> NZXT 360 AIO</li>
            </ul>
          </aside>
        </section>

        <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-6">
          <h2 className="text-2xl font-semibold">Display + Peripherals</h2>
          <p className="mt-3 text-zinc-300 leading-7">
            The desk experience is built around a single immersive panel and reliable daily drivers.
            The monitor anchors the workspace while the peripherals are chosen for speed, comfort,
            and consistency during long sessions.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-cyan-300/20 bg-[#0e1727] p-4">
              <h3 className="font-semibold text-cyan-200">Monitor</h3>
              <p className="mt-2 text-zinc-200">Samsung 49" Ultrawide OLED</p>
            </div>

            <div className="rounded-xl border border-cyan-300/20 bg-[#0e1727] p-4">
              <h3 className="font-semibold text-cyan-200">Peripherals</h3>
              <ul className="mt-2 space-y-1 text-zinc-200 text-sm">
                <li>Logitech G502x wireless mouse</li>
                <li>Epomaker TH80 mechanical keyboard</li>
                <li>Edifier M60 speakers</li>
                <li>Stream Deck</li>
                <li>Bose Comfort Fit headphones</li>
                <li>HyperX QuadCast 2 microphone</li>
                <li>Elgato boom arm</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-6">
            <h2 className="text-2xl font-semibold">Desk + Furniture</h2>
            <p className="mt-3 text-zinc-300 leading-7">
              Everything sits on a FlexiSpot 60" top, supported by IKEA Alex storage on both sides:
              drawers on the right and an Alex cabinet on the left. It keeps the layout clean while
              hiding cable runs, accessories, and the compact rack footprint.
            </p>
            <div className="mt-4 rounded-xl border border-dashed border-cyan-300/30 bg-[#0e1727] p-4 text-sm text-zinc-300">
              Photo placeholder: desk wide shot (to be added)
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-[#0a1220]/95 p-6">
            <h2 className="text-2xl font-semibold">10" Server Rack (Cabinet)</h2>
            <p className="mt-3 text-zinc-300 leading-7">
              The side cabinet houses a compact 10" rack that supports the lab side of the room.
              This section will track devices, networking roles, and service responsibilities as
              the War Room evolves.
            </p>
            <div className="mt-4 rounded-xl border border-dashed border-cyan-300/30 bg-[#0e1727] p-4 text-sm text-zinc-300">
              Photo placeholder: 10" rack front view (to be added)
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-cyan-300/30 bg-[#0e1727] p-4 text-sm text-zinc-300">
              Photo placeholder: cabinet interior/cable management (to be added)
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
