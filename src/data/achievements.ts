import { moduleList } from "./sqlTree";

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  {
    id: "first-principles",
    title: "First Principles",
    description: "Complete your first topic in the roadmap.",
  },
  {
    id: "steady-progress",
    title: "Steady Progress",
    description: "Complete any three topics in the course.",
  },
  {
    id: "applied-thinker",
    title: "Applied Thinker",
    description: "Complete both applied topics in the current roadmap.",
  },
  {
    id: "roadmap-complete",
    title: "Roadmap Complete",
    description: "Complete every topic in the roadmap.",
  },
];

export function getUnlockedAchievementIds(completedIds: string[]) {
  const completed = new Set(completedIds);
  const unlocked: string[] = [];

  if (completedIds.length >= 1) {
    unlocked.push("first-principles");
  }

  if (completedIds.length >= 3) {
    unlocked.push("steady-progress");
  }

  if (completed.has("select-rows") && completed.has("combine-data")) {
    unlocked.push("applied-thinker");
  }

  if (moduleList.every((module) => completed.has(module.id))) {
    unlocked.push("roadmap-complete");
  }

  return unlocked;
}
