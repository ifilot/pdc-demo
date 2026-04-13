import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "modeling-principles-goal",
      prompt: "Why is it important to define the modelling goal before writing equations?",
      placeholder: "Connect the model form to the engineering question, accuracy, or decision being supported.",
      acceptedKeywords: [
        "goal",
        "question",
        "accuracy",
        "decision",
        "purpose",
        "what kind of model",
        "engineering question",
      ],
      hint: "A model should be matched to the question being asked, including the accuracy needed.",
    },
    {
      id: "modeling-principles-time-constant",
      prompt: "For a stirred tank, what do volume and flow rate do to the time constant?",
      placeholder: "Explain how changing V or F changes response speed.",
      acceptedKeywords: [
        "volume",
        "flow",
        "time constant",
        "larger volume slower",
        "larger flow faster",
        "v over f",
      ],
      hint: "Use the relation tau = V/F to explain how response speed changes.",
    },
    {
      id: "modeling-principles-linearization",
      prompt: "Why do engineers linearize nonlinear models around an operating point?",
      placeholder: "Describe simplification, local approximation, or extracting gain and time constant.",
      acceptedKeywords: [
        "linearize",
        "operating point",
        "approximation",
        "simpler",
        "gain",
        "time constant",
        "control analysis",
      ],
      hint: "Linearization gives a simpler local model that is easier to analyze for control work.",
    },
    {
      id: "modeling-principles-validation",
      prompt: "What does it mean to validate a model for engineering use?",
      placeholder: "Connect validation to comparing predictions with data and judging whether the model is good enough.",
      acceptedKeywords: [
        "compare",
        "data",
        "prediction",
        "good enough",
        "range of conditions",
        "measured",
        "validation",
      ],
      hint: "Validation is about whether the model matches reality well enough for its intended use.",
    },
  ],
};

export default checkpoint;
