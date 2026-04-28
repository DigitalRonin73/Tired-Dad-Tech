export type NowTestingItem = {
  title: string;
  status: "Awaiting Parts" | "Collab Incoming" | "On The Bench" | "Testing" | "Editing Notes";
  summary: string;
  nextStep: string;
  tags: string[];
  image?: {
    src: string;
    alt: string;
    credit: string;
    sourceUrl: string;
  };
};

export const nowTesting: NowTestingItem[] = [
  {
    title: "Conversational Desk Robot",
    status: "Awaiting Parts",
    summary:
      "A chat robot with a 3D printed body, expressive eyes, and Gemini 3.1 Flash Live for more natural back-and-forth conversation.",
    nextStep: "Parts are on the way. First bench test will focus on the eyes, voice loop, and whether the conversation feels responsive enough to be useful.",
    tags: ["3D Printing", "Gemini 3.1 Flash Live", "Robot Body", "Conversation Test"],
  },
  {
    title: "HBADA E3 Pro Chair Review",
    status: "Collab Incoming",
    summary:
      "A gifted HBADA E3 Pro is coming into the War Room for a practical desk-chair test: assembly, comfort, adjustability, and whether it holds up during real editing and build nights.",
    nextStep:
      "Unbox it, build it, sit in it for real work sessions, and call out the good, the weird, and anything that feels more showroom than Tired Dad Tech.",
    tags: ["Collab Gifted", "Desk Setup", "Ergonomics", "Review"],
    image: {
      src: "/images/now-testing/hbada-e3-pro.png",
      alt: "HBADA E3 Pro ergonomic office chair",
      credit: "Stock product image from HBADA",
      sourceUrl: "https://hbada.com/products/hbada-e3-pro-ergonomic-office-chair",
    },
  },
];
