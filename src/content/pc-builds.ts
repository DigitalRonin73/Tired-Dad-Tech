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

// Template-friendly data source. Add new builds here one-by-one.
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
        "Built for a long-time subscriber with a focus on real-world gaming performance, thermals, and longevity. Balanced part selection for 1440p/4K gaming, high refresh esports titles, and clean airflow. Storage: 2TB NVMe M.2 SSD. Fans: Lian Li wireless RGB fans.",
    },
  },
];
