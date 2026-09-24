'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SiteNavigation() {
  const pathname = usePathname();
  if (pathname === '/programlist' || pathname.startsWith('/programlist/')) return null;
  return (
    <nav className="relative z-40 mx-auto w-full bg-[#070b12]/95 px-2 py-3 backdrop-blur sm:px-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Link className="nav-pill nav-pill-strong" href="/vault"><span>Projects</span></Link>
        <Link className="nav-pill nav-pill-strong" href="/pc-builds"><span>Builds</span></Link>
        <Link className="nav-pill nav-pill-strong" href="/linux-lab"><span>Linux &amp; Homelab</span></Link>
        <Link className="nav-pill nav-pill-strong" href="/war-room"><span>About</span></Link>
      </div>
    </nav>
  );
}
