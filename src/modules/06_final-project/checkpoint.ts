import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "final-project-loop-choice",
      prompt: "Describe one control loop from a chemical plant and justify why it should be feedback-controlled.",
      placeholder: "Name the loop, the controlled variable, and your reasoning.",
      acceptedKeywords: ["loop", "temperature", "pressure", "level", "feedback", "disturbance", "controller"],
      hint: "Name a real loop, identify the controlled variable, and mention how feedback helps reject disturbances or hold a target.",
    },
  ],
};

export default checkpoint;
