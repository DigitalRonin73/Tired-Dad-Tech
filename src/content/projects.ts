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
