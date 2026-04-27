import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Linux & Homelab | Tired Dad Tech",
  description:
    "Beginner-friendly Linux command practice, homelab notes, official distro links, and practical terminal basics from Tired Dad Tech.",
};

export default function LinuxLabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
