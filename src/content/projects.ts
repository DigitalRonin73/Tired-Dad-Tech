export type Project = {
  slug: string;
  title: string;
  category: "Computer Build" | "Homelab" | "Project";
  status: "In Progress" | "Completed" | "Planned";
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
  {
    slug: "bc250-couch-gaming-console",
    title: "BC-250 Couch Gaming Console",
    category: "Project",
    status: "In Progress",
    summary:
      "A BC-250 cooling and usability mod guide: trimmed fins, 120mm fan conversion, SSD + CachyOS install, and OpenClaw setup.",
    stack: ["AMD BC-250", "Arctic P12 Pro", "CachyOS", "OpenClaw", "ATX PSU Mod"],
    publishedAt: "2026-03-01",
    body: [
      "This project documents a practical cooling mod for the AMD BC-250 APU board so it can run desktop and gaming workloads more reliably.",
      "The stock fin stack is trimmed on top to open airflow, then a 120mm fan is installed directly over the heatsink. Arctic P12 Pro is the recommended fan for this setup.",
      "Because many BC-250 builds use standalone ATX power supplies, the 24-pin connector must be jumped (PS_ON to GND) so the PSU can be switched on without a standard front-panel header.",
      "After hardware prep, install an SSD, flash/install CachyOS, and then onboard OpenClaw from terminal to run the local gateway daemon.",
      "Reference documentation and exact terminal commands are included above in this vault entry.",
    ],
    imageUrls: [
      "/images/projects/bc250-couch-gaming/01.jpg",
      "/images/projects/bc250-couch-gaming/02.jpg",
      "/images/projects/bc250-couch-gaming/03.jpg",
      "/images/projects/bc250-couch-gaming/04.jpg",
      "/images/projects/bc250-couch-gaming/05.jpg",
      "/images/projects/bc250-couch-gaming/06.jpg",
      "/images/projects/bc250-couch-gaming/07.jpg",
      "/images/projects/bc250-couch-gaming/08.jpg",
      "/images/projects/bc250-couch-gaming/09.jpg",
      "/images/projects/bc250-couch-gaming/10.jpg",
      "/images/projects/bc250-couch-gaming/11.jpg",
      "/images/projects/bc250-couch-gaming/12.jpg",
      "/images/projects/bc250-couch-gaming/13.jpg",
      "/images/projects/bc250-couch-gaming/14.jpg",
      "/images/projects/bc250-couch-gaming/15.jpg"
    ]
  },
];
