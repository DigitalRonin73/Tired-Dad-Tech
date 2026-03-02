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
    title: "Jarvis: The Private Voice Assistant",
    category: "Project",
    status: "In Progress",
    summary:
      "A fully local, privacy-first alternative to cloud voice assistants where voice data stays on the home network.",
    stack: ["Home Assistant", "Proxmox", "Mac mini M1", "Raspberry Pi", "openWakeWord"],
    publishedAt: "2026-03-01",
    body: [
      "This project is a fully local, privacy-first alternative to cloud-based voice assistants. By hosting intelligence on-site, voice data never leaves the home network while still delivering modern AI response speeds.",
      "Infrastructure is distributed for performance and reliability: a Proxmox VM running Home Assistant acts as the central command center; a Mac mini (M1, 16GB RAM) provides local LLM compute; and a Raspberry Pi serves as the physical interface in a custom 3D-printed mount.",
      "Core technologies include local LLM integration for natural language understanding, openWakeWord for on-device 'Hey Jarvis' wake detection, and a Jabra Speak 4 for microphone pickup and response output.",
      "Key benefits: near-zero latency from local processing, full data sovereignty for voice and smart-home telemetry, and sustainable reuse of existing hardware into a high-performance automation suite.",
    ],
    imageUrls: [
      "/images/projects/jarvis/01.jpg",
      "/images/projects/jarvis/02.jpg",
      "/images/projects/jarvis/03.jpg",
      "/images/projects/jarvis/04.jpg"
    ]
  },
];
