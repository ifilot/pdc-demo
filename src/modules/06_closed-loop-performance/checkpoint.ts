import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "combine-data-metric",
      prompt: "Which performance metric would matter most for a safety-critical loop, and why?",
      placeholder: "Write a short reflection in one or two sentences.",
      acceptedKeywords: ["stability", "overshoot", "robust", "robustness", "oscillation", "safety"],
      hint: "For safety-critical loops, think about metrics that prevent dangerous excursions, such as stability, overshoot, or robustness.",
    },
  ],
};

export default checkpoint;
