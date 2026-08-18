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
    title: "Jarvis V2",
    status: "On The Bench",
    summary:
      "The next version of my home voice assistant, rebuilt around GPT Real Time 2.5 for a faster, more natural back-and-forth conversation.",
    nextStep:
      "Finish the voice loop, package the setup, and publish the repo so you can git pull the project, install it, and make your own.",
    tags: ["GPT Real Time 2.5", "Voice Assistant", "Open Source", "DIY"],
    image: {
      src: "/images/projects/jarvis/03.jpg",
      alt: "Jarvis voice assistant prototype with a speakerphone and Raspberry Pi",
      credit: "Project photo from the original Jarvis build",
      sourceUrl: "/vault/jarvis-self-hosted-assistant",
    },
  },
];
