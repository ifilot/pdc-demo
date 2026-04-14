import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "laplace-purpose",
      prompt: "Why is the Laplace transform so useful in process-control analysis?",
      placeholder:
        "Explain what it does to linear differential equations and why that helps.",
      acceptedKeywords: ["algebraic", "differential", "equations", "solve", "simplify", "s"],
      hint: "A strong answer should mention that it converts linear differential equations into algebraic equations in the Laplace domain.",
    },
    {
      id: "laplace-derivative",
      prompt: "What happens to a time derivative under the Laplace transform?",
      placeholder: "Describe the role of s and the initial condition.",
      acceptedKeywords: ["s", "initial", "condition", "f(0)", "derivative"],
      hint: "For a first derivative, the transform becomes s times the transformed function minus the initial value.",
    },
  ],
};

export default checkpoint;
