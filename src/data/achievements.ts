import { moduleList } from "./sqlTree";

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: "steady-state-starter",
    title: "Steady-State Starter",
    description: "Complete your first topic in the roadmap.",
  },
  {
    id: "transient-explorer",
    title: "Transient Explorer",
    description: "Complete any two topics in the course.",
  },
  {
    id: "loop-tuner",
    title: "Loop Tuner",
    description: "Complete the Controller Tuning topic.",
  },
  {
    id: "disturbance-detective",
    title: "Disturbance Detective",
    description: "Complete the Closed-Loop Performance topic.",
  },
  {
    id: "stability-scout",
    title: "Stability Scout",
    description: "Complete the Feedback Control Concepts topic.",
  },
  {
    id: "reactor-whisperer",
    title: "Reactor Whisperer",
    description: "Complete any four topics in the roadmap.",
  },
  {
    id: "process-guardian",
    title: "Process Guardian",
    description: "Complete all applied topics in the current roadmap.",
  },
  {
    id: "chemical-control-champion",
    title: "Chemical Control Champion",
    description: "Complete every topic in the roadmap.",
  },
];

export function getUnlockedAchievementIds(completedIds: string[]) {
  const completed = new Set(completedIds);
  const unlocked: string[] = [];

  if (completedIds.length >= 1) {
    unlocked.push("steady-state-starter");
  }

  if (completedIds.length >= 2) {
    unlocked.push("transient-explorer");
  }

  if (completed.has("select-rows")) {
    unlocked.push("loop-tuner");
  }

  if (completed.has("combine-data")) {
    unlocked.push("disturbance-detective");
  }

  if (completed.has("query-basics")) {
    unlocked.push("stability-scout");
  }

  if (completedIds.length >= 4) {
    unlocked.push("reactor-whisperer");
  }

  const appliedTopicIds = moduleList
    .filter((module) => module.type === "skill")
    .map((module) => module.id);

  if (appliedTopicIds.every((id) => completed.has(id))) {
    unlocked.push("process-guardian");
  }

  if (moduleList.every((module) => completed.has(module.id))) {
    unlocked.push("chemical-control-champion");
  }

  return unlocked;
}
