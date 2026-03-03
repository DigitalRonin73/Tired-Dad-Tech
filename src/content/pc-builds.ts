export type PcBuild = {
  slug: string;
  title: string;
  summary: string;
  videoUrl?: string;
  imageUrls: string[];
  specs: {
    motherboard: string;
    processor: string;
    ram: string;
    gpu: string;
    psu: string;
    case: string;
    cooler: string;
    details: string;
  };
};

const placeholderImage = "/images/card-computer-builds.jpg";

// Template-friendly data source. Auto-imported from channel descriptions where possible.
export const pcBuilds: PcBuild[] = [
  {
    slug: "war-room-main-rig",
    title: "War Room Main Rig",
    summary:
      "Primary War Room desktop build focused on performance, thermals, and clean aesthetics.",
    videoUrl: undefined,
    imageUrls: [
      "/images/pc-builds/placeholder-war-room-rig/file_16---5011758c-67af-423a-95e2-0b74073455bc.jpg",
      "/images/pc-builds/placeholder-war-room-rig/file_17---e11f5587-cfe9-4c8f-9853-9ae8750ca2a8.jpg",
      "/images/pc-builds/placeholder-war-room-rig/file_15---fa5cf9f2-d4d6-4fa7-ab16-e72c28a07b70.jpg",
      "/images/pc-builds/placeholder-war-room-rig/file_14---394aa4f0-3a1d-4490-beb9-2ca464503b37.jpg",
      "/images/pc-builds/placeholder-war-room-rig/file_13---396684f8-2cfa-453d-8f08-eca7f1d96644.jpg",
      "/images/pc-builds/placeholder-war-room-rig/file_11---66175388-71b7-481a-a34e-f0148085b29a.jpg",
      "/images/pc-builds/placeholder-war-room-rig/file_12---834349fe-b1af-4ae4-93b3-e122b8b37927.jpg"
    ],
    specs: {
      motherboard: "ASUS Prime B650 WiFi",
      processor: "Ryzen 7 7800X3D",
      ram: "32GB DDR5 CL30 6000MHz",
      gpu: "ASUS RX4090",
      psu: "Corsair RM1000x",
      case: "Lian Li Lancool 217",
      cooler: "NZXT 360 AIO",
      details:
        "Main daily driver in the War Room. More tuning notes, benchmarks, and revision history coming soon.",
    },
  },
  {
    slug: "subscriber-pc-build",
    title: "Subscriber PC Build",
    summary:
      "High-performance subscriber build with strong airflow, RGB presentation, and creator/gaming-focused specs.",
    videoUrl: "https://youtu.be/E97maYtus_k?si=Di6bKa6pEXP8MWmf",
    imageUrls: [
      "/images/pc-builds/subscriber-pc-build/file_18---5804918b-f9e6-4030-8322-71d5a8f29edb.jpg"
    ],
    specs: {
      motherboard: "Gigabyte Aorus X870E",
      processor: "AMD Ryzen 7 7800X3D",
      ram: "32GB DDR5 6000MHz CL30",
      gpu: "XFX Radeon RX 9070 XT",
      psu: "Corsair RM850e",
      case: "Lian Li O11D Mini V2 Flow",
      cooler: "NZXT Kraken AIO liquid cooler",
      details:
        "Built for a long-time subscriber with a focus on real-world gaming performance, thermals, and longevity. Storage: 2TB NVMe M.2 SSD. Fans: Lian Li wireless RGB fans.",
    },
  },
  {
    slug: "bc250-cooling-mod-bazzite",
    title: "AMD BC250 Cooling Mod + Bazzite Build",
    summary:
      "SteamOS-style compact gaming build with cooling and BIOS mods on AMD BC250 hardware.",
    videoUrl: "https://www.youtube.com/watch?v=08ZUIO7Bz5U",
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
    ],
    specs: {
      motherboard: "AMD BC250 board",
      processor: "AMD BC250 APU",
      ram: "16GB unified RAM",
      gpu: "Integrated (BC250 platform)",
      psu: "Apevia 400W (modded, Noctua fan swap)",
      case: "Custom 3D printed case (NextGen3D)",
      cooler: "Noctua cooling mod",
      details:
        "BIOS flash + Bazzite install with Steam Big Picture workflow. Pairs with GameSir controllers for couch gaming.",
    },
  },


  {
    slug: "christmas-build-7500f-9060xt",
    title: "Christmas Build (Ryzen 5 7500F + RX 9060 XT)",
    summary:
      "A festive performance-focused gaming build with AM5 platform efficiency.",
    videoUrl: "https://www.youtube.com/watch?v=j88aHoyi63s",
    imageUrls: [
      "/images/pc-builds/christmas-build-7500f-9060xt/01.jpg",
      "/images/pc-builds/christmas-build-7500f-9060xt/02.jpg",
      "/images/pc-builds/christmas-build-7500f-9060xt/03.jpg"
    ],
    specs: {
      motherboard: "MSI B850",
      processor: "Ryzen 5 7500F",
      ram: "32GB DDR5 CL32 6000MHz",
      gpu: "ASUS RX 9060 XT 16GB",
      psu: "Thermalright 750W 80+ Gold",
      case: "PC Coolers case",
      cooler: "DeepCool AK500 Digital",
      details:
        "Family-focused holiday build with balanced performance and clean presentation.",
    },
  },
  {
    slug: "steam-machine-2025-5600x-6600",
    title: "Steam Machine 2025 (5600X + RX 6600)",
    summary:
      "SteamOS-like living room machine running Bazzite with controller-first UX.",
    videoUrl: "https://www.youtube.com/watch?v=57ZpE0kT9MA",
    imageUrls: [
      "/images/pc-builds/steam-machine-2025-5600x-6600/01.jpg",
      "/images/pc-builds/steam-machine-2025-5600x-6600/02.jpg",
      "/images/pc-builds/steam-machine-2025-5600x-6600/03.jpg",
      "/images/pc-builds/steam-machine-2025-5600x-6600/04.jpg",
      "/images/pc-builds/steam-machine-2025-5600x-6600/05.jpg"
    ],
    specs: {
      motherboard: "ASRock DeskMeet AM4",
      processor: "Ryzen 5 5600X",
      ram: "16GB DDR4",
      gpu: "Radeon RX 6600",
      psu: "DeskMeet included 500W PSU",
      case: "ASRock DeskMeet",
      cooler: "Thermalright low-profile cooler",
      details:
        "Configured for couch play with Bazzite Deck image and clean controller navigation.",
    },
  },
  {
    slug: "budget-500-z390-rx7600",
    title: "$500 Budget Gaming PC (Z390 + RX 7600)",
    summary:
      "Sub-$500 value build aimed at strong 1080p performance and upgrade flexibility.",
    videoUrl: "https://www.youtube.com/watch?v=ypttXhxb4RU",
    imageUrls: [
      "/images/pc-builds/budget-500-z390-rx7600/01.jpg",
      "/images/pc-builds/budget-500-z390-rx7600/02.jpg",
      "/images/pc-builds/budget-500-z390-rx7600/03.jpg",
      "/images/pc-builds/budget-500-z390-rx7600/04.jpg",
      "/images/pc-builds/budget-500-z390-rx7600/05.jpg"
    ],
    specs: {
      motherboard: "Gigabyte Z390 ATX",
      processor: "Intel CPU (exact model TBD)",
      ram: "16GB DDR4",
      gpu: "ASUS RX 7600",
      psu: "Thermalright 750W 80+ Gold",
      case: "MSI MAG Forge 130A",
      cooler: "Cooler Master",
      details:
        "1TB NVMe M.2 SSD included. Tuned for smooth high-setting 1080p gameplay on a strict budget.",
    },
  },
  {
    slug: "ch160-mini-itx-build",
    title: "DeepCool CH160 Mini-ITX Build",
    summary:
      "Compact mITX build focused on airflow challenges and real-world small-form-factor compromises.",
    videoUrl: "https://www.youtube.com/watch?v=FQNJZFXnXYI",
    imageUrls: [
      "/images/pc-builds/ch160-mini-itx-build/01.jpg",
      "/images/pc-builds/ch160-mini-itx-build/02.jpg",
      "/images/pc-builds/ch160-mini-itx-build/03.jpg",
      "/images/pc-builds/ch160-mini-itx-build/04.jpg"
    ],
    specs: {
      motherboard: "MaxSun B650i",
      processor: "Ryzen 5 7500F",
      ram: "32GB DDR5 CL32 6000MHz",
      gpu: "RX 9060 XT 16GB",
      psu: "Thermalright 750W",
      case: "DeepCool CH160",
      cooler: "DeepCool AK500 Digital",
      details:
        "Covers cable constraints, thermal tradeoffs, and compact-build assembly pitfalls.",
    },
  },
  {
    slug: "am5-build-with-my-son",
    title: "Budget AM5 Build with My Son",
    summary:
      "Father-son AM5 build targeting practical 1440p performance without overspending.",
    videoUrl: "https://www.youtube.com/watch?v=_6sgajp1-Sw",
    imageUrls: [
      "/images/pc-builds/am5-build-with-my-son/01.jpg",
      "/images/pc-builds/am5-build-with-my-son/02.jpg",
      "/images/pc-builds/am5-build-with-my-son/03.jpg"
    ],
    specs: {
      motherboard: "MSI B650M (mATX AM5)",
      processor: "Ryzen 5 7500F",
      ram: "32GB DDR5 CL32 6000MHz",
      gpu: "RX 6800 16GB",
      psu: "Corsair RM850x",
      case: "DarkFlash fishtank-style mATX",
      cooler: "Thermalright AIO 360mm water cooler",
      details:
        "Family build story with practical component choices and value-focused tuning.",
    },
  },
  {
    slug: "under-budget-5700x-2080super",
    title: "Under-Budget Build (5700X + RTX 2080 Super)",
    summary:
      "Value-focused gaming rig using a liquid-cooled 2080 Super for strong 1440p results.",
    videoUrl: "https://www.youtube.com/watch?v=X_PzKSQP4m0",
    imageUrls: [placeholderImage],
    specs: {
      motherboard: "TBD",
      processor: "AMD Ryzen 7 5700X",
      ram: "16GB DDR4",
      gpu: "MSI RTX 2080 Super (liquid-cooled)",
      psu: "EVGA 850W 80+ Gold",
      case: "Jonsbo D32 Pro",
      cooler: "Liquid-cooled GPU loop + system cooling",
      details:
        "2TB Samsung Pro M.2 SSD build with strong value-to-performance ratio in 2025 hardware market.",
    },
  },
  {
    slug: "facebook-200pc-2700x-3060",
    title: "$200 Facebook PC Refresh (2700X + RTX 3060)",
    summary:
      "Marketplace rescue build turned into a usable gaming platform with targeted upgrades.",
    videoUrl: "https://www.youtube.com/watch?v=Z_ecfRa0y40",
    imageUrls: [placeholderImage],
    specs: {
      motherboard: "TBD",
      processor: "Ryzen 7 2700X",
      ram: "TBD",
      gpu: "RTX 3060 12GB",
      psu: "750W PSU",
      case: "TBD",
      cooler: "TBD",
      details:
        "500GB M.2 SSD base build; focuses on what to keep, what to replace, and where value can still be found.",
    },
  },
  {
    slug: "i5-9600k-rx7600-bazzite",
    title: "Bazzite Upgrade Build (i5-9600K + RX 7600)",
    summary:
      "Older Intel platform refreshed with Linux Bazzite for strong real-world gaming performance.",
    videoUrl: "https://www.youtube.com/watch?v=J0CH_QQPbKo",
    imageUrls: [
      "/images/pc-builds/i5-9600k-rx7600-bazzite/01.jpg",
      "/images/pc-builds/i5-9600k-rx7600-bazzite/02.jpg"
    ],
    specs: {
      motherboard: "Z370 motherboard",
      processor: "Intel i5-9600K",
      ram: "16GB DDR4",
      gpu: "Radeon RX 7600",
      psu: "Thermalright 750W Gold",
      case: "Montech case (mixed fans)",
      cooler: "Cooler Master",
      details:
        "Bazzite-focused upgrade to test how far older hardware can be pushed in modern gaming. More final spec details can be added as needed.",
    },
  },

  {
    slug: "am4-mitx-metalfish-t60",
    title: "AM4 mITX | Metal Fish T60 SFF",
    summary:
      "Compact SFF build packing a Ryzen 9 3900X into a Metal Fish T60 mITX case.",
    videoUrl: "https://www.youtube.com/watch?v=L15_5LZN6BY",
    imageUrls: [
      "/images/pc-builds/am4-mitx-metalfish-t60/01.jpg",
      "/images/pc-builds/am4-mitx-metalfish-t60/02.jpg",
      "/images/pc-builds/am4-mitx-metalfish-t60/03.jpg"
    ],
    specs: {
      motherboard: "AM4 mITX motherboard (model TBD)",
      processor: "Ryzen 9 3900X",
      ram: "32GB DDR4",
      gpu: "RX 9060 XT 8GB",
      psu: "Thermalright 750W SFX Gold",
      case: "Metal Fish T60 mITX",
      cooler: "Thermalright low profile cooler",
      details:
        "SFF build completed with Aaron. 12-core/24-thread AM4 platform packed into a compact Metal Fish chassis.",
    },
  },

];
