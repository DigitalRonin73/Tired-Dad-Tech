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
  youtube?: {
    videoId: string;
    title: string;
  };
  guide?: {
    intro?: string;
    prerequisites?: string[];
    steps: Array<{
      title: string;
      description?: string;
      commands?: Array<{ title: string; code: string }>;
    }>;
    results?: {
      summary: string[];
      image?: {
        src: string;
        alt: string;
        caption?: string;
      };
      table: Array<Record<string, string>>;
    };
  };
};

// Easy to edit later: add, remove, or update project objects here.
export const projects: Project[] = [
  {
    slug: "running-gemma-4-on-amd-bc250-with-ollama",
    title: "Running Gemma 4 on an AMD BC-250 with Ollama",
    category: "Project",
    status: "Completed",
    summary:
      "A practical path for running Gemma 4 E2B locally on an AMD BC-250 mini PC with CachyOS, Ollama, and llama-benchy.",
    stack: ["AMD BC-250", "CachyOS", "Ollama", "Gemma 4 E2B", "llama-benchy", "SSH"],
    publishedAt: "2026-04-27",
    body: [
      "This guide covers the exact local AI flow: enable SSH on the BC-250, connect from a main machine, install Ollama, pull Gemma 4 E2B, and benchmark the result with llama-benchy.",
      "The BC-250 is a strange but useful little lab box. With CachyOS installed and 8GB of shared VRAM available to the integrated GPU, Gemma 4 E2B lands in the sweet spot for a small local model test.",
      "The goal here is not a cloud-scale AI rig. The goal is a repeatable after-hours lab setup that proves what this hardware can actually do.",
    ],
    youtube: {
      videoId: "C4PqnPw-w7E",
      title: "Gemma 4 AI on a $140 BC250 It Got Messy",
    },
    guide: {
      intro:
        "Run these steps from the BC-250 unless the step specifically says to connect from your main machine.",
      prerequisites: [
        "AMD BC-250 running CachyOS",
        "SSH access from a remote machine",
        "Internet connection",
      ],
      steps: [
        {
          title: "1) Enable SSH on the BC-250",
          description:
            "Install OpenSSH, start the daemon, allow SSH through UFW if you use it, then check the machine IP address.",
          commands: [
            { title: "Install OpenSSH", code: "sudo pacman -S openssh" },
            { title: "Enable and start SSH", code: "sudo systemctl enable --now sshd" },
            { title: "Allow SSH through UFW", code: "sudo ufw allow ssh\nsudo ufw reload" },
            { title: "Find the BC-250 IP address", code: "ip a" },
          ],
        },
        {
          title: "2) Connect from your main machine",
          description:
            "Replace the username and IP address with the account and address from your BC-250.",
          commands: [
            { title: "SSH into the BC-250", code: "ssh username@192.168.x.x" },
          ],
        },
        {
          title: "3) Install Ollama",
          description:
            "Install Ollama and enable the service so it is ready for local model serving.",
          commands: [
            { title: "Install Ollama", code: "curl -fsSL https://ollama.com/install.sh | sh" },
            { title: "Enable and start Ollama", code: "sudo systemctl enable --now ollama" },
          ],
        },
        {
          title: "4) Pull Gemma 4 E2B",
          description:
            "Gemma 4 E2B is a 7.2GB Mixture of Experts model, which fits the BC-250's 8GB shared VRAM allocation better than larger local models.",
          commands: [
            { title: "Pull the model", code: "ollama pull gemma4:e2b" },
          ],
        },
        {
          title: "5) Test the model",
          description:
            "Run a quick prompt before benchmarking so you know the model is installed and responding.",
          commands: [
            {
              title: "Run a quick test prompt",
              code: 'ollama run gemma4:e2b "Explain how a CPU and GPU work together when running an AI model. Keep it concise."',
            },
          ],
        },
        {
          title: "6) Install llama-benchy",
          description:
            "Install the tooling, clone llama-benchy, and sync the Python environment with uv.",
          commands: [
            { title: "Install Python, Git, and uv", code: "sudo pacman -Syu python git uv --noconfirm" },
            { title: "Clone llama-benchy", code: "git clone https://github.com/eugr/llama-benchy.git" },
            { title: "Sync the benchmark environment", code: "cd llama-benchy\nuv sync" },
          ],
        },
        {
          title: "7) Run the benchmark",
          description:
            "Point llama-benchy at Ollama's OpenAI-compatible local endpoint and test Gemma 4 E2B.",
          commands: [
            {
              title: "Benchmark Gemma 4 E2B",
              code: "uv run llama-benchy --base-url http://localhost:11434/v1 --model gemma4:e2b",
            },
          ],
        },
      ],
      results: {
        summary: [
          "Average API latency: 2.85 ms",
          "Prompt processing: 49 tokens per second",
          "Token generation: 17 tokens per second",
          "Hardware: AMD BC-250 integrated GPU with 8GB shared VRAM",
        ],
        image: {
          src: "/images/projects/gemma4-bc250/benchmark.jpg",
          alt: "llama-benchy terminal benchmark results for Gemma 4 E2B on the AMD BC-250",
          caption: "llama-benchy 0.3.5 benchmark output captured from the BC-250 test run.",
        },
        table: [
          {
            Model: "gemma4:e2b",
            Test: "pp2048",
            Speed: "49.08 t/s",
            Peak: "-",
            Notes: "Prompt processing",
          },
          {
            Model: "gemma4:e2b",
            Test: "tg32",
            Speed: "17.07 t/s",
            Peak: "17.67 t/s",
            Notes: "Token generation",
          },
        ],
      },
    },
  },
  {
    slug: "jarvis-self-hosted-assistant",
    title: "Jarvis: The Private Voice Assistant",
    category: "Project",
    status: "Completed",
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
    status: "Completed",
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
