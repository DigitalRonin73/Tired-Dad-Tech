export type NowTestingItem = {
  title: string;
  status: "Awaiting Parts" | "On The Bench" | "Testing" | "Editing Notes";
  summary: string;
  nextStep: string;
  tags: string[];
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
];
