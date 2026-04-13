import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "intro-data-definition",
      prompt: "How would you define process control in one sentence?",
      placeholder: "Describe maintaining desired conditions by adjusting selected variables.",
      acceptedKeywords: ["maintaining desired conditions", "desired conditions", "adjusting selected variables", "physical system", "maintain", "adjusting variables"],
      hint: "Use the module's central definition: maintaining desired conditions in a physical system by adjusting selected variables.",
    },
    {
      id: "intro-data-variables",
      prompt: "What is the difference between a controlled variable and a manipulated variable?",
      placeholder: "Explain what we want to hold near target and what we directly adjust.",
      acceptedKeywords: ["controlled variable", "manipulated variable", "target", "adjust", "measured", "input", "output"],
      hint: "The controlled variable is the quantity we want near its target. The manipulated variable is the quantity the controller changes.",
    },
    {
      id: "intro-data-feedback",
      prompt: "Why is feedback control especially valuable in a real plant?",
      placeholder: "Connect feedback to disturbances, model error, or correcting based on actual behavior.",
      acceptedKeywords: ["disturbance", "model", "actual", "measured", "correct", "correction", "reality", "prediction"],
      hint: "Feedback uses measured plant behavior to correct for disturbances and mismatches between prediction and reality.",
    },
    {
      id: "intro-data-objective",
      prompt: "Which of the seven control objectives is most important in your view, and why?",
      placeholder: "Choose one objective such as safety, quality, equipment protection, or profit.",
      acceptedKeywords: ["safety", "quality", "profit", "environment", "equipment", "monitoring", "smooth", "production"],
      hint: "The module lists seven objectives. Pick one and explain how it supports real plant operation.",
    },
  ],
};

export default checkpoint;
