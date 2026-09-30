export const storeCategories = ["All", "T-Shirts", "Hoodies", "Mugs", "Accessories"] as const;
export type StoreCategory = (typeof storeCategories)[number];

export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  category: Exclude<StoreCategory, "All">;
  productType: string;
  image: { src: string; alt: string } | null;
  price: string | null;
  colors: { name: string; hex: string }[];
  printifyUrl: string | null;
  placeholder: string;
};

const darkColors = [{ name: "Black", hex: "#151515" }, { name: "Charcoal", hex: "#525252" }];
const defaults = { image: null, price: null, printifyUrl: null };

// Images live in public/images/store. Set price and printifyUrl only when confirmed.
// Colors are planned options until the Printify products are finalized.
export const storeProducts: StoreProduct[] = [
  {
    ...defaults, id: "coffee-tee", name: "sudo make coffee", category: "T-Shirts", productType: "T-shirt",
    description: "A retro terminal, a familiar command, and one essential dependency: coffee.",
    colors: darkColors, placeholder: "sudo make coffee",
    image: { src: "/images/store/sudo-make-coffee-shirt.jpg", alt: "Charcoal T-shirt with a retro CRT computer and Tired Dad Tech coffee mug graphic" },
  },
  {
    ...defaults, id: "404-tee", name: "404: Free Time Not Found", category: "T-Shirts", productType: "T-shirt",
    description: "The request was reasonable. The free time was unavailable.", colors: darkColors, placeholder: "404",
    image: { src: "/images/store/404-free-time-shirt.jpg", alt: "Black T-shirt with a retro 404 Free Time Not Found browser graphic" },
  },
  {
    ...defaults, id: "microslop-tee", name: "Microslop", category: "T-Shirts", productType: "T-shirt",
    description: "A little nostalgia. A little frustration. A very familiar computing experience.",
    colors: [{ name: "White", hex: "#f4f4f5" }, { name: "Light gray", hex: "#b9bdc1" }], placeholder: "Microslop",
    image: { src: "/images/store/microslop-shirt.jpg", alt: "White T-shirt with a colorful pixelated Microslop graphic" },
  },
  {
    ...defaults, id: "coffee-hoodie", name: "sudo make coffee", category: "Hoodies", productType: "Hoodie",
    description: "The coffee command, lined up for late nights at the workbench.",
    colors: [...darkColors, { name: "Heather gray", hex: "#a1a1aa" }], placeholder: "sudo make coffee",
  },
  {
    ...defaults, id: "404-hoodie", name: "404: Free Time Not Found", category: "Hoodies", productType: "Hoodie",
    description: "Same ideas. Less sleep. The hoodie version of a recurring error.",
    colors: darkColors, placeholder: "404",
  },
  {
    ...defaults, id: "tdt-mug", name: "Tired Dad Tech 15oz Coffee Mug", category: "Mugs", productType: "15oz coffee mug",
    description: "A black 15oz mug with the Tired Dad Tech design. For coffee refills between builds.",
    colors: [darkColors[0]], placeholder: "TIRED DAD TECH",
    image: { src: "/images/store/tired-dad-tech-15oz-mug.png", alt: "Black 15oz coffee mug with a cyan and white Tired Dad Tech design and handle on the right" },
  },
  {
    ...defaults, id: "linux-design", name: "From the terminal", category: "T-Shirts", productType: "T-shirt · design in progress",
    description: "Room for the next Linux-inspired design. Still at the drawing board.", colors: [], placeholder: "~/next-design",
  },
  {
    ...defaults, id: "homelab-design", name: "After-hours lab", category: "T-Shirts", productType: "T-shirt · design in progress",
    description: "A future design for the projects that somehow become another weekend project.", colors: [], placeholder: "WORK IN PROGRESS",
  },
  {
    ...defaults, id: "tdt-stickers", name: "Tired Dad Tech Stickers", category: "Accessories", productType: "Stickers",
    description: "A little TDT for the laptop, toolbox, or homelab. Artwork in progress.", colors: [], placeholder: "TDT / STICKERS",
  },
  {
    ...defaults, id: "tdt-keychain", name: "Tired Dad Tech Keychain", category: "Accessories", productType: "Keychain",
    description: "A small piece of the lab to take with you. Design in progress.", colors: [], placeholder: "TDT / EVERYDAY",
  },
];
