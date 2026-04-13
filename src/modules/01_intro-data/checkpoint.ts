import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "intro-data-cv",
      prompt: "Name one controlled variable in a chemical process and explain why it matters.",
      placeholder: "For example: reactor temperature, tank level, distillation pressure...",
      acceptedKeywords: ["temperature", "pressure", "level", "concentration", "quality", "safety"],
      hint: "A controlled variable is something the plant wants to hold near a desired value because it affects operation, quality, or safety.",
    },
    {
      id: "intro-data-objective",
      prompt: "Which control objective do you think is most fundamental in a plant, and why?",
      placeholder: "Choose one objective such as safety, quality, equipment protection, or profit.",
      acceptedKeywords: ["safety", "quality", "profit", "environment", "equipment", "monitoring", "smooth"],
      hint: "The source chapter lists seven objectives. Pick one and connect it to real plant operation.",
    },
  ],
};

export default checkpoint;
