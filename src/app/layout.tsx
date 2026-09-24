import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteNavigation from "@/components/SiteNavigation";
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
        <SiteNavigation />
        {children}
      </body>
    </html>
  );
}
