import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "query-basics-cv",
      prompt: "Give one example of a controlled variable in a chemical process.",
      placeholder: "For example: reactor temperature, distillation pressure, tank level...",
      acceptedKeywords: ["temperature", "pressure", "level", "concentration", "ph"],
      hint: "A controlled variable is the quantity you want to keep near target, such as level, pressure, or temperature.",
    },
    {
      id: "query-basics-mv",
      prompt: "Give one example of a manipulated variable that could influence it.",
      placeholder: "For example: steam valve opening, reflux flow, coolant flow...",
      acceptedKeywords: ["valve", "flow", "steam", "coolant", "reflux", "heat"],
      hint: "A manipulated variable is something the controller can move directly, often a valve position, heat input, or flow rate.",
    },
  ],
};

export default checkpoint;
