import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "tables-gain-meaning",
      prompt: "In your own words, what does process gain tell you?",
      placeholder: "Describe how much the output changes for an input change.",
      acceptedKeywords: ["change", "output", "input", "sensitivity", "response"],
      hint: "Your answer should mention that gain links an input change to the size of the output response.",
    },
  ],
};

export default checkpoint;
