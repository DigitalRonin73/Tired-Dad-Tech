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
      "A custom AMD BC-250 APU gaming build tuned for couch use with Linux Bazzite and Steam Big Picture.",
    stack: ["AMD BC-250", "Bazzite Linux", "Steam Big Picture", "Noctua Cooling", "3D Printed Case"],
    publishedAt: "2026-03-01",
    body: [
      "This build repurposes an AMD BC-250 APU platform into a compact couch-gaming machine with custom thermals and clean presentation.",
      "Hardware mods include cooling-fin updates with a Noctua fan, an Apevia 400W PSU with a swapped Noctua fan and cable modifications, and a 1TB SSD for game storage.",
      "The system BIOS was flashed and Linux Bazzite OS was installed to boot directly into Steam Big Picture mode for a console-like experience.",
      "A custom 3D-printed case designed by NextGen 3D includes a custom-wired power button and USB dock. Primary use case is couch gaming with GameSir controllers.",
      "YouTube build link will be added when provided.",
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
  {
    slug: "i-turned-a-bc250-into-an-ai-agent-with-openclaw",
    title: "I Turned a BC250 into an AI Agent with OpenClaw",
    category: "Project",
    status: "Completed",
    summary:
      "Full BC-250 mod and software flow: trim heatsink fins, mount an Arctic P12 Pro 120mm fan, jump ATX 24-pin, install SSD + CachyOS, then onboard OpenClaw.",
    stack: ["AMD BC-250", "Arctic P12 Pro", "ATX 24-pin jumper", "CachyOS", "OpenClaw"],
    publishedAt: "2026-03-24",
    body: [
      "This project documents the exact BC-250 mod path from stock mining board to usable AI lab machine.",
      "Hardware: trim the top of the stock fins to open airflow and fit a 120mm fan. Arctic P12 Pro is recommended for static pressure and value.",
      "Power: jumper ATX 24-pin PS_ON to GND so the PSU can turn on without standard motherboard controls.",
      "Storage/OS: install SSD, then install CachyOS and complete base setup using the BC-250 community docs.",
      "AI stack: install OpenClaw from terminal, onboard daemon, and validate gateway status.",
    ],
    imageUrls: ["/images/projects/bc250-openclaw-agent/01.jpg"],
  },
];
