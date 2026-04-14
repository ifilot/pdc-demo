import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "transfer-function-meaning",
      prompt: "What does a transfer function represent in process control?",
      placeholder:
        "Describe it as an input-output relation and mention the Laplace domain.",
      acceptedKeywords: ["input", "output", "laplace", "ratio", "linear", "system"],
      hint: "A good answer should say that it is the Laplace-domain ratio between output and input for a linear system.",
    },
    {
      id: "linearization-purpose",
      prompt: "Why do engineers linearize nonlinear process models before classical control analysis?",
      placeholder: "Explain why a local linear approximation is useful.",
      acceptedKeywords: ["linear", "approximation", "local", "analysis", "control"],
      hint: "Classical transfer-function and Laplace-domain methods work best with linear models, so nonlinear models are approximated near an operating point.",
    },
  ],
};

export default checkpoint;
