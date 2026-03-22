export default function POCMobilePage() {
  return (
    <main className="min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <h1 className="text-xl font-semibold">Mobile POC Dashboard</h1>
        <a
          className="rounded-lg border border-cyan-300/40 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-400/10"
          href="/poc-mobile/index.html"
          target="_blank"
          rel="noreferrer"
        >
          Open standalone ↗
        </a>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-cyan-400/30 bg-[#0a1220]">
          <iframe
            title="Mobile POC Dashboard"
            src="/poc-mobile/index.html"
            className="h-[85vh] w-full"
          />
        </div>
      </div>
    </main>
  );
}
