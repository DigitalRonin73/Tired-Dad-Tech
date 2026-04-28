export type Project = {
  slug: string;
  title: string;
  category: "Computer Build" | "Homelab" | "Project";
  status: "In Progress" | "Completed" | "Planned";
  buildType?: "AI Lab" | "Homelab" | "PC Build" | "Linux" | "Local AI" | "War Room";
  outcome?: string;
  difficulty?: "Easy" | "Medium" | "Painful" | "Unknown";
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
  mistakeLog?: Array<{
    title: string;
    whatHappened: string;
    fix: string;
    lesson: string;
  }>;
};

// Easy to edit later: add, remove, or update project objects here.
export const projects: Project[] = [
  {
    slug: "running-gemma-4-on-amd-bc250-with-ollama",
    title: "Running Gemma 4 on an AMD BC-250 with Ollama",
    category: "Project",
    status: "Completed",
    buildType: "AI Lab",
    outcome: "Gemma 4 E2B ran locally and produced repeatable llama-benchy results.",
    difficulty: "Medium",
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
    mistakeLog: [
      {
        title: "SSH was blocked before the real work started",
        whatHappened:
          "The BC-250 was reachable on the network, but the first remote workflow stalled because the firewall was blocking SSH.",
        fix:
          "Opened SSH through the firewall, reloaded UFW, confirmed the machine IP, and then connected from the main machine.",
        lesson:
          "Remote lab work starts with boring network plumbing. Confirm SSH before blaming the AI stack.",
      },
      {
        title: "The first Gemma pulls were the wrong fit",
        whatHappened:
          "The first pull attempt failed because the model manifest did not exist, then the larger E4B download proved too big for the BC-250's 8GB VRAM split.",
        fix:
          "Dropped down to Gemma 4 E2B, which landed at roughly 7.2GB and fit the hardware better.",
        lesson:
          "Model names and VRAM math matter. On this box, the useful answer was the model that fit, not the model that sounded biggest.",
      },
      {
        title: "Ollama fell back to CPU before Vulkan was enabled",
        whatHappened:
          "The first status check showed zero VRAM use because experimental Vulkan support was disabled, so Ollama was not using the BC-250 integrated GPU.",
        fix:
          "Enabled Vulkan support and checked Ollama status again before treating the benchmark numbers as meaningful.",
        lesson:
          "A model can run and still be using the wrong hardware. Always verify VRAM/GPU use before benchmarking.",
      },
      {
        title: "The BC-250 went to sleep and killed the SSH session",
        whatHappened:
          "The machine slept during setup and would not wake back up cleanly, which dropped the SSH session mid-project.",
        fix:
          "Restarted the BC-250, reconnected over SSH, and continued after disabling sleep became an obvious follow-up task.",
        lesson:
          "Headless test boxes need sleep settings handled early. Otherwise the lab machine quietly leaves the lab.",
      },
      {
        title: "Benchmark tooling needed a package mirror refresh",
        whatHappened:
          "Installing the Python and uv tooling did not go cleanly at first because the CachyOS package mirrors were out of sync.",
        fix:
          "Synced the package database first, then installed Python, Git, and uv before cloning and syncing llama-benchy.",
        lesson:
          "If an install command fails on a rolling distro, refresh the package database before rewriting the whole plan.",
      },
      {
        title: "The benchmark needed context, not just numbers",
        whatHappened:
          "llama-benchy produced several timing values, including a cold first-token delay around 38 seconds and warmed-up generation around 17 tokens per second.",
        fix:
          "Kept the clean results table for quick reading and the original terminal screenshot as proof of the run.",
        lesson:
          "Local AI results are easier to trust when the table explains the takeaway and the screenshot preserves the messy evidence.",
      },
    ],
  },
  {
    slug: "jarvis-self-hosted-assistant",
    title: "Jarvis: The Private Voice Assistant",
    category: "Project",
    status: "Completed",
    buildType: "Homelab",
    outcome: "Private local voice assistant architecture documented.",
    difficulty: "Medium",
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
    ],
    youtube: {
      videoId: "IA1D5KUmFJU",
      title: "Your Smart Speaker is Spying. I Built a Fix.",
    },
    guide: {
      intro:
        "This is the architecture walkthrough from the video: a local voice assistant stack built from hardware that was already sitting around the house.",
      prerequisites: [
        "Home Assistant running on a mini PC or Proxmox host",
        "Mac mini M1 or another local machine for the LLM side",
        "Raspberry Pi 4 for the physical voice satellite",
        "Jabra speakerphone or another good USB speaker/microphone",
        "openWakeWord, Wyoming satellite, Whisper, and Piper configured through Home Assistant",
      ],
      steps: [
        {
          title: "1) Map the voice assistant stack",
          description:
            "The Raspberry Pi acts as the room device, Home Assistant handles the smart-home routing, and the Mac mini acts as the heavier local brain when a question needs more than a simple automation.",
        },
        {
          title: "2) Set up the Raspberry Pi as the satellite",
          description:
            "Run the Pi as the always-on voice satellite with openWakeWord listening for the wake phrase and Wyoming satellite sending captured audio back into Home Assistant.",
        },
        {
          title: "3) Keep speech processing local",
          description:
            "Use Whisper for speech-to-text and Piper for text-to-speech so the voice loop can stay inside the home network instead of leaning on Siri or another cloud assistant.",
        },
        {
          title: "4) Route commands before questions",
          description:
            "Simple commands like turning lights or the TV on and off should be handled directly by Home Assistant. More open-ended questions can be routed to the Mac mini LLM and then spoken back through the Pi.",
        },
        {
          title: "5) Mount the hardware where it can actually hear",
          description:
            "The Jabra speakerphone was mounted with a 3D printed Raspberry Pi stand, powered over USB, and placed where it could hear from the kitchen or living room without needing to speak right into it.",
        },
        {
          title: "6) Tune audio, wake word, and latency",
          description:
            "The first working version still needed tuning: crackly audio had to be cleaned up, false wake-word triggers had to be reduced, and the LLM voice path still had a long pause compared with direct terminal use.",
        },
      ],
      results: {
        summary: [
          "Voice commands could control Home Assistant devices locally.",
          "The Jabra speakerphone picked up voice clearly from across the room.",
          "The local LLM path worked, but still had a 20-30 second delay through the full voice pipeline.",
          "The build reused an M1 Mac mini, Raspberry Pi, Home Assistant, and 3D printed mounting hardware.",
        ],
        table: [
          { Piece: "Raspberry Pi 4", Role: "Voice satellite running wake word and Wyoming satellite" },
          { Piece: "Home Assistant", Role: "Smart-home routing, speech-to-text, and text-to-speech hub" },
          { Piece: "Mac mini M1", Role: "Local LLM brain for open-ended questions" },
          { Piece: "Jabra speakerphone", Role: "Room microphone and speaker" },
        ],
      },
    },
    mistakeLog: [
      {
        title: "The speakerphone worked almost too well",
        whatHappened:
          "The Jabra speakerphone picked up voice clearly across the room, but that sensitivity also caused false wake-word triggers.",
        fix:
          "Tuned the wake-word settings down inside Home Assistant until Jarvis stopped waking up at the wrong time.",
        lesson:
          "Great microphones are not automatically great smart-home microphones. Sensitivity has to match the room.",
      },
      {
        title: "Audio came through crackly at first",
        whatHappened:
          "The speaker itself was good, but the first voice responses came through rough and crackled enough to make the setup feel unfinished.",
        fix:
          "Adjusted the voice/audio settings until the response audio came through cleanly.",
        lesson:
          "Local voice assistants are a full audio pipeline, not just an AI model. Bad audio can make a good setup feel broken.",
      },
      {
        title: "The LLM path still has a long pause",
        whatHappened:
          "Responses were quick from the Mac mini terminal, but routing the same kind of question through Jarvis introduced a 20-30 second delay.",
        fix:
          "Kept the local pipeline working while marking latency as the next problem to chase across Home Assistant, Whisper/Piper, Wyoming, and the Mac mini LLM path.",
        lesson:
          "A fast model in the terminal does not guarantee a fast voice assistant. Every handoff adds time.",
      },
      {
        title: "The hardware choice was overkill, but it worked",
        whatHappened:
          "The conference speakerphone was more hardware than the project really needed, but it solved the room pickup and speaker clarity problem.",
        fix:
          "Mounted it with a 3D printed Raspberry Pi stand and reused old hardware already sitting around the house.",
        lesson:
          "Overkill is not always bad if it turns spare gear into a reliable build.",
      },
    ],
  },
  {
    slug: "bc250-couch-gaming-console",
    title: "BC-250 Couch Gaming Console",
    category: "Project",
    status: "Completed",
    buildType: "Linux",
    outcome: "BC-250 repurposed into a couch-gaming Linux console.",
    difficulty: "Painful",
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
    buildType: "Local AI",
    outcome: "BC-250 hardware modded and onboarded into OpenClaw.",
    difficulty: "Painful",
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
    youtube: {
      videoId: "N4EEEwr5T-g",
      title: "I Turned a BC250 into an AI Agent with OpenClaw",
    },
    guide: {
      intro:
        "This is the BC-250 OpenClaw path from the video: hardware prep first, CachyOS on the board, then OpenClaw installed and tested through Telegram.",
      prerequisites: [
        "AMD BC-250 board",
        "M.2 NVMe SSD",
        "ATX power supply with a safe PS_ON to GND jumper or switch harness",
        "120mm fan and 3D printed fan shroud",
        "CachyOS installed on the BC-250",
        "Node.js 22 or newer, npm, and internet access",
        "OpenAI authorization or another supported OpenClaw provider",
        "Telegram setup if you want to test the agent from a phone",
      ],
      steps: [
        {
          title: "1) Prep the BC-250 hardware",
          description:
            "Cut the top of the stock cooling fins, install the SSD, flash BIOS, install CachyOS, and mount the 120mm fan with the 3D printed shroud so air is forced through the opened fins.",
        },
        {
          title: "2) Power it safely on the bench",
          description:
            "Use a PSU jumper or small switch harness to connect PS_ON to ground on the 24-pin ATX connector, then power the board with the oversized bench PSU or your final PSU.",
        },
        {
          title: "3) Install Node.js, npm, and build tools",
          description:
            "OpenClaw requires Node.js 22 or newer. On CachyOS/Arch-style systems, install the Node and build tooling before installing OpenClaw.",
          commands: [
            { title: "Install Node.js, npm, and build tools", code: "sudo pacman -S nodejs npm git base-devel" },
            { title: "Verify Node and npm", code: "node --version\nnpm --version" },
          ],
        },
        {
          title: "4) Install OpenClaw",
          description:
            "Install the OpenClaw CLI globally with npm. The video install needed retries, so rerun the install if the first attempt fails without changing anything else.",
          commands: [
            { title: "Install OpenClaw CLI", code: "npm install -g openclaw@latest" },
          ],
        },
        {
          title: "5) Run the OpenClaw quick start",
          description:
            "Use the OpenClaw quick start prompts to choose the provider, complete browser authorization, select Telegram, choose Google search, skip skills for the first pass, enable session memory, and reinstall the gateway when prompted.",
        },
        {
          title: "6) Test from Telegram",
          description:
            "Ask the agent if it is active, run a search prompt about OpenClaw on the BC-250, then ask it to generate a small proof-of-concept dashboard or code artifact.",
        },
        {
          title: "7) Decide if the BC-250 is worth it",
          description:
            "The proof of concept worked, but the video called out the cost tradeoff: once an NVMe drive and other parts are included, a used laptop may be a better dedicated OpenClaw host.",
        },
      ],
      results: {
        summary: [
          "CachyOS ran on the BC-250 without major OS trouble.",
          "OpenClaw installed and worked on the BC-250.",
          "Telegram control worked from the phone.",
          "The agent generated and posted a proof-of-concept dashboard.",
          "The BC-250 is fun and capable, but not automatically the best value for OpenClaw alone.",
        ],
        table: [
          { Check: "CachyOS", Result: "Installed and running" },
          { Check: "OpenClaw", Result: "Installed after retries" },
          { Check: "Telegram", Result: "Connected and responding" },
          { Check: "Proof of concept", Result: "Generated a dashboard and pushed it live" },
          { Check: "Value call", Result: "Used laptop may be simpler if OpenClaw is the only goal" },
        ],
      },
    },
    mistakeLog: [
      {
        title: "The cooling mod was simple, but tedious",
        whatHappened:
          "The BC-250 needed the stock cooling fins cut down before the 120mm fan setup could slide over and force air through the heatsink.",
        fix:
          "Trimmed the fins, installed the SSD, flashed BIOS, installed CachyOS, and used a 3D printed fan shroud to guide airflow.",
        lesson:
          "The hard part was not complexity. It was patience. Some hardware mods are just slow bench work.",
      },
      {
        title: "Screen recording failed during the first install",
        whatHappened:
          "The setup had to be repeated because OBS was not recording during one pass, and another attempt hit an install error.",
        fix:
          "Repeated the install flow, captured the npm setup, and moved faster through parts that had already been done multiple times.",
        lesson:
          "Content builds need the same checklist as tech builds. If recording matters, verify it before doing the once-per-project steps.",
      },
      {
        title: "The OpenClaw install needed retries",
        whatHappened:
          "The npm install flow had already worked before, then failed during the recorded attempt before working on retry.",
        fix:
          "Retried the OpenClaw install and continued once the quick start came up cleanly.",
        lesson:
          "If a package install fails once after working before, retry cleanly before tearing apart the whole machine.",
      },
      {
        title: "OAuth and Telegram setup happened partly off-camera",
        whatHappened:
          "The OpenAI authorization opened a browser window that was not visible in the recording, and Telegram had already been set up from earlier attempts.",
        fix:
          "Completed the authorization, kept the current model, selected Telegram, Google search, session memory, and reinstalled the gateway to be safe.",
        lesson:
          "Agent setup crosses terminal, browser, and phone workflows. The written notes need to cover what the video cannot show clearly.",
      },
      {
        title: "The BC-250 worked, but value was complicated",
        whatHappened:
          "OpenClaw ran on the BC-250, but the total cost changes once you add an NVMe drive, power, fan hardware, and setup time.",
        fix:
          "Tested the proof of concept anyway, then compared the total cost against a used ThinkPad that could run OpenClaw more simply.",
        lesson:
          "A weird board can be fun and capable, but that does not automatically make it the best dedicated OpenClaw host.",
      },
    ],
  },
];
