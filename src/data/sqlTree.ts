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

export interface LectureSection {
  heading: string;
  body: string;
}

export interface LectureContent {
  duration: string;
  level: string;
  sections: LectureSection[];
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
        body:
          "Start by identifying the process objective, the major disturbances, and the variables available for measurement and actuation. Good control work begins with a clean process description.",
      },
      {
        heading: "Connect Model and Controller",
        body:
          "Relate the process dynamics to controller choice and tuning strategy. The key engineering judgment is matching loop aggressiveness to the time scales and risks in the plant.",
      },
      {
        heading: "Evaluate Performance",
        body:
          "Review the closed-loop response in terms of stability, speed, offset, and robustness. For chemical engineers, the best solution is rarely the fastest one; it is the one that stays reliable under realistic operating conditions.",
      },
    ],
  },
};

export function getLectureContent(moduleId: string) {
  return lectureContentById[moduleId];
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
