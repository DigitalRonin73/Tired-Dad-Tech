import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tired Dad Tech",
  description:
    "Tired Dad Tech is Scott's project vault for PC builds, Linux gaming rigs, homelab gear, local AI experiments, and YouTube build notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="sticky top-0 z-40 mx-auto w-full bg-[#070b12]/95 px-2 py-3 backdrop-blur sm:px-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link className="nav-pill nav-pill-strong" href="/vault">
              <span>Projects</span>
            </Link>
            <Link className="nav-pill nav-pill-strong" href="/pc-builds">
              <span>Builds</span>
            </Link>
            <Link className="nav-pill nav-pill-strong" href="/linux-lab">
              <span>Linux &amp; Homelab</span>
            </Link>
            <Link className="nav-pill nav-pill-strong" href="/war-room">
              <span>About</span>
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
