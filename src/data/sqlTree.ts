import {
  getModuleContent as getRegisteredModuleContent,
  isQuestionAnswerCorrect,
  validQuestionIds,
} from "./moduleContentRegistry";
import type { ModuleContent } from "../types/moduleContent";

export { isQuestionAnswerCorrect, validQuestionIds } from "./moduleContentRegistry";

export type ModuleType = "concept" | "skill";

interface ModuleRaw {
  id: string;
  name: string;
  type: ModuleType;
  description: string;
  prerequisites: string[];
  learningGoalIds: string[];
}

export interface Module extends ModuleRaw {
  followUps: string[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
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
    name: "Introduction to Process Control",
    type: "concept",
    description:
      "Define process control, feedback, desired values, and the plant objectives that justify control.",
    prerequisites: [],
    learningGoalIds: [
      "interpret-dynamic-process-behavior",
      "reason-about-feedback-control",
      "communicate-control-problems-clearly",
    ],
  },
  {
    id: "modeling-principles",
    name: "Mathematical Modelling Principles",
    type: "concept",
    description:
      "Use balances, assumptions, linearization, and numerical methods to relate process physics to dynamic behavior.",
    prerequisites: ["intro-data"],
    learningGoalIds: [
      "interpret-dynamic-process-behavior",
      "work-with-simple-dynamic-models",
      "bridge-theory-and-practice",
    ],
  },
  {
    id: "laplace-transforms",
    name: "Laplace Transforms",
    type: "concept",
    description:
      "Introduce Laplace transforms as the bridge from differential equations to algebraic process analysis.",
    prerequisites: [],
    learningGoalIds: [
      "interpret-dynamic-process-behavior",
      "work-with-simple-dynamic-models",
      "communicate-control-problems-clearly",
      "bridge-theory-and-practice",
    ],
  },
  {
    id: "transfer-functions",
    name: "Transfer Functions and Linearized Process Models",
    type: "concept",
    description:
      "Use Laplace-domain input-output models, series combinations, and linearization to analyze process dynamics.",
    prerequisites: ["modeling-principles", "laplace-transforms"],
    learningGoalIds: [
      "interpret-dynamic-process-behavior",
      "work-with-simple-dynamic-models",
      "communicate-control-problems-clearly",
      "bridge-theory-and-practice",
    ],
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

const dx = cardWidth * 1.7;
const x1 = margin + cardWidth / 2;
const x2 = x1 + dx;
const x3 = x2 + dx;

const positionsRaw: Record<string, Position> = {
  "intro-data": { x: x2, y: y1 },
  "modeling-principles": { x: x3, y: y2 },
  "laplace-transforms": { x: x1, y: y2 },
  "transfer-functions": { x: x2, y: y3 },
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
  height: y3 + cardHeight / 2 + margin + 80,
};

export const learningGoals: LearningGoal[] = [
  {
    id: "interpret-dynamic-process-behavior",
    title: "Interpret dynamic process behavior",
    description:
      "Understand why process variables respond over time, recognize common transient patterns, and explain what those responses mean for physical systems.",
  },
  {
    id: "work-with-simple-dynamic-models",
    title: "Work with simple dynamic models",
    description:
      "Relate first-principles thinking and simple model forms to process behavior, time constants, gains, and delays that appear in control analysis.",
  },
  {
    id: "reason-about-feedback-control",
    title: "Reason about feedback control",
    description:
      "Explain the role of feedback, compare controller actions, and judge how control choices influence disturbance rejection and setpoint tracking.",
  },
  {
    id: "communicate-control-problems-clearly",
    title: "Communicate clearly about control problems",
    description:
      "Describe process-control issues using the right vocabulary and connect engineering observations to model-based explanations.",
  },
  {
    id: "approach-tuning-and-performance-thoughtfully",
    title: "Approach tuning and performance more thoughtfully",
    description:
      "Build the intuition needed to judge whether a loop is sluggish, oscillatory, robust, or sensitive, and what adjustments might improve it.",
  },
  {
    id: "bridge-theory-and-practice",
    title: "Bridge theory and chemical engineering practice",
    description:
      "Connect equations and diagrams to practical decisions in reactors, separators, heat exchangers, and other process systems.",
  },
];

const learningGoalsById: Record<string, LearningGoal> = Object.fromEntries(
  learningGoals.map((goal) => [goal.id, goal]),
);

export function getModuleContent(moduleId: string) {
  return getRegisteredModuleContent(moduleId);
}

export function getLearningGoalsForModule(moduleId: string) {
  const module = modules[moduleId];
  if (!module) {
    return [];
  }

  return module.learningGoalIds
    .map((goalId) => learningGoalsById[goalId])
    .filter((goal): goal is LearningGoal => Boolean(goal));
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
