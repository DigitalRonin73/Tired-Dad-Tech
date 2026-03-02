export type Project = {
  slug: string;
  title: string;
  category: "Computer Build" | "Homelab" | "Project";
  status: "In Progress" | "Shipped" | "Planned";
  summary: string;
  stack: string[];
  publishedAt: string;
  body: string[];
  imageUrls?: string[];
};

// Easy to edit later: add, remove, or update project objects here.
export const projects: Project[] = [
  {
    slug: "war-room-v1",
    title: "War Room v1: Homelab Foundation",
    category: "Homelab",
    status: "In Progress",
    summary:
      "Baseline architecture for services, backups, networking, and observability in my home lab.",
    stack: ["Proxmox", "Docker", "Tailscale", "Cloudflare", "GitHub Actions"],
    publishedAt: "2026-02-28",
    body: [
      "This page is a placeholder for the full build log.",
      "I will document decisions, mistakes, and improvements as the lab evolves.",
      "Goal: stable, reproducible infra with clear monitoring and backup strategy.",
    ],
  },
  {
    slug: "pc-build-quiet-gaming-rig",
    title: "Quiet Gaming + Editing Rig",
    category: "Computer Build",
    status: "Shipped",
    summary:
      "A quiet, high-efficiency PC build optimized for gaming, editing, and daily workflow.",
    stack: ["Ryzen", "NVIDIA", "DDR5", "NVMe", "Fractal Case"],
    publishedAt: "2026-02-20",
    body: [
      "This is a placeholder write-up for component selection and tuning.",
      "Final post will include thermals, noise profile, BIOS settings, and benchmarks.",
    ],
  },
  {
    slug: "project-vault-site",
    title: "Tired Dad Tech Site + Project Vault",
    category: "Project",
    status: "In Progress",
    summary:
      "A digital garden and portfolio for builds, homelab work, and technical write-ups.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Cloudflare"],
    publishedAt: "2026-02-28",
    body: [
      "This project tracks how the site is designed and shipped.",
      "Will include architecture notes, deployment setup, and future roadmap.",
    ],
  },
  {
    slug: "jarvis-self-hosted-assistant",
    title: "Jarvis: Self-Hosted AI Assistant",
    category: "Project",
    status: "In Progress",
    summary:
      "A custom self-hosted voice assistant running on Raspberry Pi with Jabra Speak 40 hardware integration.",
    stack: ["Raspberry Pi", "Jabra Speak 40", "Self-Hosted AI", "Voice Interface"],
    publishedAt: "2026-03-01",
    body: [
      "Jarvis is my custom, self-hosted AI assistant project focused on local-first control and practical voice interaction.",
      "This build uses a Jabra Speak 40 speakerphone paired with a Raspberry Pi as the core hardware platform.",
      "I’ll continue adding architecture details, software stack notes, and lessons learned as the project evolves.",
    ],
    imageUrls: [
      "/images/projects/jarvis/01.jpg",
      "/images/projects/jarvis/02.jpg",
      "/images/projects/jarvis/03.jpg",
      "/images/projects/jarvis/04.jpg"
    ]
  },
];
