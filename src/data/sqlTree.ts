export type ModuleType = "concept" | "skill";

interface ModuleRaw {
  id: string;
  name: string;
  type: ModuleType;
  description: string;
  prerequisites: string[];
}

export interface Module extends ModuleRaw {
  followUps: string[];
}

export interface ModuleContent {
  theory: ContentBlock[];
  summary: ContentBlock[];
  questions?: ModuleQuestion[];
}

export interface LectureSection {
  heading: string;
  body: ContentBlock[];
}

export interface LectureContent {
  duration: string;
  level: string;
  sections: LectureSection[];
  summary: ContentBlock[];
}

export interface TextBlock {
  type: "paragraph";
  text: string;
}

export interface PythonBlock {
  type: "python";
  code: string;
  caption?: string;
}

export type ContentBlock = TextBlock | PythonBlock;

export interface ModuleQuestion {
  id: string;
  prompt: string;
  placeholder: string;
  helpText?: string;
  acceptedKeywords: string[];
  hint: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface PositionedModule {
  id: string;
  position: Position;
  prerequisitesPathOrder: string[];
  followUpsPathOrder: string[];
}

const moduleIndexRaw: ModuleRaw[] = [
  {
    id: "intro-data",
    name: "Dynamic Process Foundations",
    type: "concept",
    description: "Introduce dynamic systems, states, disturbances, and manipulated variables.",
    prerequisites: [],
  },
  {
    id: "tables",
    name: "First-Order Process Models",
    type: "concept",
    description: "Build intuition for gains, time constants, and process response.",
    prerequisites: ["intro-data"],
  },
  {
    id: "query-basics",
    name: "Feedback Control Concepts",
    type: "concept",
    description: "Frame controlled, manipulated, and measured variables in loop design.",
    prerequisites: ["tables"],
  },
  {
    id: "select-rows",
    name: "Controller Tuning",
    type: "skill",
    description: "Apply practical tuning logic for stable and responsive closed-loop behavior.",
    prerequisites: ["query-basics"],
  },
  {
    id: "combine-data",
    name: "Closed-Loop Performance",
    type: "skill",
    description: "Interpret overshoot, settling, robustness, and disturbance rejection.",
    prerequisites: ["query-basics"],
  },
  {
    id: "final-project",
    name: "Control Strategy Review",
    type: "skill",
    description: "Integrate the core concepts into a compact Process Dynamics and Control case review.",
    prerequisites: ["select-rows", "combine-data"],
  },
];

export const modules: Record<string, Module> = Object.fromEntries(
  moduleIndexRaw.map((item) => [item.id, { ...item, followUps: [] }]),
);

Object.values(modules).forEach((module) => {
  module.prerequisites.forEach((prerequisiteId) => {
    modules[prerequisiteId]?.followUps.push(module.id);
  });
});

export const moduleList = Object.values(modules);

export const cardWidth = 160;
export const cardHeight = 80;

const margin = 20;
const dy = cardHeight * 1.7;
const y1 = margin + cardHeight / 2;
const y2 = y1 + dy;
const y3 = y2 + dy;
const y4 = y3 + dy;

const dx = cardWidth * 1.7;
const x1 = margin + cardWidth / 2;
const x2 = x1 + dx;
const x3 = x2 + dx;

const positionsRaw: Record<string, Position> = {
  "intro-data": { x: x2, y: y1 },
  tables: { x: x2, y: y2 },
  "query-basics": { x: x2, y: y3 },
  "select-rows": { x: x1, y: y4 },
  "combine-data": { x: x3, y: y4 },
  "final-project": { x: x2, y: y4 + dy },
};

function angleFromVertical(dxValue: number, dyValue: number) {
  return Math.atan2(dxValue, dyValue);
}

export const positionedModules: Record<string, PositionedModule> = Object.fromEntries(
  Object.entries(positionsRaw).map(([id, position]) => [
    id,
    {
      id,
      position,
      prerequisitesPathOrder: [],
      followUpsPathOrder: [],
    },
  ]),
);

Object.values(positionedModules).forEach((positionedModule) => {
  const module = modules[positionedModule.id];
  const prerequisiteRef = {
    x: positionedModule.position.x,
    y: positionedModule.position.y - cardHeight / 2,
  };

  positionedModule.prerequisitesPathOrder = module.prerequisites
    .filter((id) => Boolean(positionsRaw[id]))
    .map((id) => {
      const ref = positionedModules[id].position;
      const dxValue = ref.x - prerequisiteRef.x;
      const dyValue = prerequisiteRef.y - (ref.y + cardHeight / 2);
      return { id, angle: angleFromVertical(dxValue, dyValue) };
    })
    .sort((a, b) => a.angle - b.angle)
    .map((entry) => entry.id);

  const followUpRef = {
    x: positionedModule.position.x,
    y: positionedModule.position.y + cardHeight / 2,
  };

  positionedModule.followUpsPathOrder = module.followUps
    .filter((id) => Boolean(positionsRaw[id]))
    .map((id) => {
      const ref = positionedModules[id].position;
      const dxValue = ref.x - followUpRef.x;
      const dyValue = ref.y - cardHeight / 2 - followUpRef.y;
      return { id, angle: angleFromVertical(dxValue, dyValue) };
    })
    .sort((a, b) => a.angle - b.angle)
    .map((entry) => entry.id);
});

const maxPathSpace = cardWidth * 0.9;
const initialPathSpacing = 16;
const maxVerticalOffset = 16;
const minVerticalOffset = 10;

function getHorizontalPathOffset(index: number, numPaths: number) {
  if (numPaths === 1) {
    return 0;
  }
  const spaceUsed = (maxPathSpace * numPaths) / (numPaths + maxPathSpace / initialPathSpacing);
  const pathSpacing = spaceUsed / (numPaths - 1);
  return (index - (numPaths - 1) / 2) * pathSpacing;
}

function getVerticalPathOffset(index: number, numPaths: number) {
  if (numPaths <= 2) {
    return maxVerticalOffset;
  }
  const numGaps = numPaths - 1;
  const delta = (index - numGaps / 2) / (numGaps / 2);
  return maxVerticalOffset + (minVerticalOffset - maxVerticalOffset) * delta ** 2;
}

export interface Connector {
  from: string;
  to: string;
  d: string;
}

export const connectors: Connector[] = Object.values(positionedModules).flatMap((targetModule) =>
  targetModule.prerequisitesPathOrder.map((prerequisiteId) => {
    const sourceModule = positionedModules[prerequisiteId];
    const toIndex = targetModule.prerequisitesPathOrder.indexOf(prerequisiteId);
    const fromIndex = sourceModule.followUpsPathOrder.indexOf(targetModule.id);

    const startHorizontalOffset = getHorizontalPathOffset(
      fromIndex,
      sourceModule.followUpsPathOrder.length,
    );
    const endHorizontalOffset = getHorizontalPathOffset(
      toIndex,
      targetModule.prerequisitesPathOrder.length,
    );
    const startVerticalOffset = getVerticalPathOffset(
      fromIndex,
      sourceModule.followUpsPathOrder.length,
    );
    const endVerticalOffset = getVerticalPathOffset(
      toIndex,
      targetModule.prerequisitesPathOrder.length,
    );

    const startX = sourceModule.position.x + startHorizontalOffset;
    const startY = sourceModule.position.y + cardHeight / 2;
    const cp1X = startX;
    const cp1Y = startY + startVerticalOffset;
    const endX = targetModule.position.x + endHorizontalOffset;
    const endY = targetModule.position.y - cardHeight / 2;
    const cp2X = endX;
    const cp2Y = endY - endVerticalOffset;

    return {
      from: prerequisiteId,
      to: targetModule.id,
      d: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
    };
  }),
);

export const treeBounds = {
  width: x3 + cardWidth / 2 + margin + 80,
  height: y4 + dy + cardHeight / 2 + margin + 80,
};

export const leafModuleIds = new Set(
  moduleList.filter((module) => module.followUps.length === 0).map((module) => module.id),
);

const lectureContentById: Record<string, LectureContent> = {
  "final-project": {
    duration: "12 min",
    level: "Course Review",
    sections: [
      {
        heading: "Frame the Process",
        body: [
          {
            type: "paragraph",
            text: "Start by identifying the process objective, the major disturbances, and the variables available for measurement and actuation. Good control work begins with a clean process description.",
          },
          {
            type: "python",
            caption: "A small Python sketch for organizing process variables",
            code: `process_case = {
    "controlled_variable": "reactor temperature",
    "manipulated_variable": "coolant flow rate",
    "measured_variable": "temperature transmitter",
    "main_disturbance": "feed composition swing",
}

for label, value in process_case.items():
    print(f"{label}: {value}")`,
          },
        ],
      },
      {
        heading: "Connect Model and Controller",
        body: [
          {
            type: "paragraph",
            text: "Relate the process dynamics to controller choice and tuning strategy. The key engineering judgment is matching loop aggressiveness to the time scales and risks in the plant.",
          },
        ],
      },
      {
        heading: "Evaluate Performance",
        body: [
          {
            type: "paragraph",
            text: "Review the closed-loop response in terms of stability, speed, offset, and robustness. For chemical engineers, the best solution is rarely the fastest one; it is the one that stays reliable under realistic operating conditions.",
          },
        ],
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "A useful control strategy begins with a clean process definition, including disturbances, measurements, and manipulated variables.",
      },
      {
        type: "paragraph",
        text: "For many practical loops, we connect dynamic behavior to a compact first-order-plus-dead-time view such as $G_p(s)=\\dfrac{K e^{-\\theta s}}{\\tau s + 1}$.",
      },
      {
        type: "paragraph",
        text: "Final judgment comes from balancing speed, robustness, and operability rather than optimizing only one metric.",
      },
    ],
  },
};

const moduleContentById: Record<string, ModuleContent> = {
  "intro-data": {
    theory: [
      {
        type: "paragraph",
        text: "Process Dynamics and Control starts with the idea that chemical processes evolve over time. Inventories, temperatures, concentrations, and pressures respond to inputs, disturbances, and initial conditions.",
      },
      {
        type: "paragraph",
        text: "A dynamic variable is often described through a state balance. In compact form we can write $\\dfrac{dx}{dt}=f(x,u,d)$ where $x$ is the process state, $u$ the manipulated input, and $d$ the disturbance.",
      },
      {
        type: "paragraph",
        text: "$$\\text{Accumulation} = \\text{In} - \\text{Out} + \\text{Generation} - \\text{Consumption}$$",
      },
      {
        type: "python",
        caption: "Toy state update for a stirred tank inventory",
        code: `level = 1.2
qin = 0.18
qout = 0.15
dt = 1.0

for minute in range(5):
    level += (qin - qout) * dt
    print(f"minute={minute + 1}, level={level:.2f}")`,
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "Dynamic analysis explains how process variables move over time rather than only where they settle.",
      },
      {
        type: "paragraph",
        text: "State, input, and disturbance language gives students a foundation for later control reasoning.",
      },
      {
        type: "paragraph",
        text: "Mass and energy balances are the natural starting point for many process models.",
      },
    ],
    questions: [
      {
        id: "intro-data-state-variable",
        prompt: "Name one process state variable you would track in a mixing tank.",
        placeholder: "For example: liquid level, concentration, or temperature.",
        acceptedKeywords: ["level", "concentration", "temperature", "inventory"],
        hint: "Think of a quantity that stores material or energy inside the vessel.",
      },
      {
        id: "intro-data-disturbance",
        prompt: "Describe one likely disturbance entering that same process.",
        placeholder: "Write a short sentence about a feed or environmental disturbance.",
        acceptedKeywords: ["feed", "inlet", "composition", "temperature", "disturbance", "flow"],
        hint: "A disturbance is something entering from outside the controller's direct command, such as feed composition or inlet flow changes.",
      },
    ],
  },
  tables: {
    theory: [
      {
        type: "paragraph",
        text: "Many process units can be approximated as first-order systems over a useful operating region. This gives an intuitive bridge between physics and control design.",
      },
      {
        type: "paragraph",
        text: "The two most recognizable parameters are process gain $K$ and time constant $\\tau$. Together they explain how far and how fast the output responds.",
      },
      {
        type: "paragraph",
        text: "$$G_p(s)=\\frac{K}{\\tau s + 1}$$",
      },
      {
        type: "python",
        caption: "Generate a first-order step response sample",
        code: `import math

K = 2.0
tau = 5.0

for t in range(0, 21, 5):
    y = K * (1 - math.exp(-t / tau))
    print(f"t={t:>2} min -> y={y:.3f}")`,
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "First-order models are simple enough to reason with and rich enough to guide controller choices.",
      },
      {
        type: "paragraph",
        text: "Gain captures sensitivity and the time constant captures response speed.",
      },
      {
        type: "paragraph",
        text: "These models are often the first approximation before dead time and higher-order effects are added.",
      },
    ],
    questions: [
      {
        id: "tables-gain-meaning",
        prompt: "In your own words, what does process gain tell you?",
        placeholder: "Describe how much the output changes for an input change.",
        acceptedKeywords: ["change", "output", "input", "sensitivity", "response"],
        hint: "Your answer should mention that gain links an input change to the size of the output response.",
      },
    ],
  },
  "query-basics": {
    theory: [
      {
        type: "paragraph",
        text: "Feedback control compares a measured process variable to a target and acts on the process to reduce the error.",
      },
      {
        type: "paragraph",
        text: "A standard loop uses the error $e(t)=r(t)-y(t)$ where $r(t)$ is the setpoint and $y(t)$ is the measured output.",
      },
      {
        type: "paragraph",
        text: "$$u(t)=K_c e(t)$$",
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "Feedback organizes measurement, decision, and action into one loop.",
      },
      {
        type: "paragraph",
        text: "Controlled, measured, and manipulated variables should always be named clearly.",
      },
      {
        type: "paragraph",
        text: "Error-based thinking prepares students for tuning and performance assessment.",
      },
    ],
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
  },
  "select-rows": {
    theory: [
      {
        type: "paragraph",
        text: "Controller tuning is the practical task of choosing parameters that deliver acceptable speed, stability, and robustness.",
      },
      {
        type: "paragraph",
        text: "Even when a formal rule is used, the engineer still judges the operating context, actuator limits, and disturbance environment.",
      },
      {
        type: "paragraph",
        text: "A common proportional-integral-derivative form is $$u(t)=K_c\\left(e(t)+\\frac{1}{\\tau_I}\\int e(t)dt + \\tau_D \\frac{de}{dt}\\right).$$",
      },
      {
        type: "python",
        caption: "A compact PID calculation loop",
        code: `Kc = 2.5
tau_i = 4.0
tau_d = 0.5
dt = 1.0
integral = 0.0
last_error = 0.0

for error in [1.2, 0.8, 0.3, 0.1]:
    integral += error * dt
    derivative = (error - last_error) / dt
    u = Kc * (error + integral / tau_i + tau_d * derivative)
    print(f"error={error:.2f}, controller_output={u:.2f}")
    last_error = error`,
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "Tuning is not only a formula exercise; it is an engineering tradeoff.",
      },
      {
        type: "paragraph",
        text: "Good tuning respects both the process dynamics and the operating risks.",
      },
      {
        type: "paragraph",
        text: "PID parameters should be interpreted in terms of what behavior they encourage.",
      },
    ],
    questions: [
      {
        id: "select-rows-tuning-goal",
        prompt: "What is one tuning tradeoff you would watch in a real plant?",
        placeholder: "Example: overshoot versus settling time, or speed versus valve wear.",
        acceptedKeywords: ["overshoot", "settling", "speed", "stability", "robust", "wear", "oscillation"],
        hint: "Common tuning tradeoffs include speed versus stability, overshoot versus settling time, or aggressiveness versus robustness.",
      },
    ],
  },
  "combine-data": {
    theory: [
      {
        type: "paragraph",
        text: "Closed-loop performance is judged through metrics such as overshoot, settling time, oscillation, offset, and disturbance rejection.",
      },
      {
        type: "paragraph",
        text: "A loop may be fast but fragile, or robust but sluggish. Performance always has to be interpreted in context.",
      },
      {
        type: "paragraph",
        text: "For setpoint tracking we often discuss the transient response of $y(t)$ and whether it remains acceptable for plant operation and safety.",
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "Performance metrics translate raw responses into operational judgment.",
      },
      {
        type: "paragraph",
        text: "A useful controller is stable, understandable, and appropriate for the process objective.",
      },
      {
        type: "paragraph",
        text: "Engineers should evaluate both setpoint tracking and disturbance rejection.",
      },
    ],
    questions: [
      {
        id: "combine-data-metric",
        prompt: "Which performance metric would matter most for a safety-critical loop, and why?",
        placeholder: "Write a short reflection in one or two sentences.",
        acceptedKeywords: ["stability", "overshoot", "robust", "robustness", "oscillation", "safety"],
        hint: "For safety-critical loops, think about metrics that prevent dangerous excursions, such as stability, overshoot, or robustness.",
      },
    ],
  },
  "final-project": {
    theory: [
      {
        type: "paragraph",
        text: "This final placeholder topic combines process modeling, feedback logic, and performance evaluation into one compact review.",
      },
      {
        type: "paragraph",
        text: "Students should be able to interpret a model, reason about a loop structure, and defend a practical control decision.",
      },
      {
        type: "paragraph",
        text: "$$\\text{Good control} = \\text{model insight} + \\text{loop reasoning} + \\text{operational judgment}$$",
      },
    ],
    summary: [
      {
        type: "paragraph",
        text: "The final review pulls together the main language of Process Dynamics and Control.",
      },
      {
        type: "paragraph",
        text: "Students should be able to move from process description to controller reasoning with confidence.",
      },
      {
        type: "paragraph",
        text: "The most important habit is not memorization but disciplined interpretation of process behavior.",
      },
    ],
    questions: [
      {
        id: "final-project-loop-choice",
        prompt: "Describe one control loop from a chemical plant and justify why it should be feedback-controlled.",
        placeholder: "Name the loop, the controlled variable, and your reasoning.",
        acceptedKeywords: ["loop", "temperature", "pressure", "level", "feedback", "disturbance", "controller"],
        hint: "Name a real loop, identify the controlled variable, and mention how feedback helps reject disturbances or hold a target.",
      },
    ],
  },
};

export const validQuestionIds = new Set(
  Object.values(moduleContentById)
    .flatMap((moduleContent) => moduleContent.questions ?? [])
    .map((question) => question.id),
);

export function isQuestionAnswerCorrect(question: ModuleQuestion, answer: string) {
  const normalizedAnswer = answer.toLowerCase();
  return question.acceptedKeywords.some((keyword) => normalizedAnswer.includes(keyword.toLowerCase()));
}

export function getLectureContent(moduleId: string) {
  return lectureContentById[moduleId];
}

export function getModuleContent(moduleId: string) {
  return moduleContentById[moduleId];
}

export function getPrerequisites(moduleId: string, visited = new Set<string>()) {
  const module = modules[moduleId];
  if (!module) {
    return visited;
  }

  module.prerequisites.forEach((prerequisiteId) => {
    if (!visited.has(prerequisiteId)) {
      visited.add(prerequisiteId);
      getPrerequisites(prerequisiteId, visited);
    }
  });

  return visited;
}

export function getModuleById(moduleId: string) {
  return modules[moduleId];
}

export function getAccessibleModuleIds(completedIds: string[]) {
  const completed = new Set(completedIds);

  return moduleList
    .filter(
      (module) =>
        !completed.has(module.id) &&
        module.prerequisites.every((prerequisiteId) => completed.has(prerequisiteId)),
    )
    .map((module) => module.id);
}

export function getNextAccessibleModuleIds(completedIds: string[], currentModuleId: string) {
  const accessibleIds = new Set(getAccessibleModuleIds(completedIds));
  const currentModule = modules[currentModuleId];

  const prioritized = [
    ...currentModule.followUps.filter((id) => accessibleIds.has(id)),
    ...moduleList
      .map((module) => module.id)
      .filter((id) => id !== currentModuleId && accessibleIds.has(id) && !currentModule.followUps.includes(id)),
  ];

  return prioritized.slice(0, 3);
}
