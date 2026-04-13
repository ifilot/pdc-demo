import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "select-rows-tuning-goal",
      prompt: "What is one tuning tradeoff you would watch in a real plant?",
      placeholder: "Example: overshoot versus settling time, or speed versus valve wear.",
      acceptedKeywords: ["overshoot", "settling", "speed", "stability", "robust", "wear", "oscillation"],
      hint: "Common tuning tradeoffs include speed versus stability, overshoot versus settling time, or aggressiveness versus robustness.",
    },
  ],
};

export default checkpoint;
