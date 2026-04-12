import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { achievements, getUnlockedAchievementIds } from "../data/achievements";
import { moduleList, type Module } from "../data/sqlTree";

const STORAGE_KEY = "pdc-course-progress";
const validModuleIds = new Set(moduleList.map((module) => module.id));

const defaultCompletedIds: string[] = [];

function sanitizeCompletedIds(ids: unknown) {
  if (!Array.isArray(ids)) {
    return defaultCompletedIds;
  }

  const uniqueValidIds = ids.filter(
    (id): id is string => typeof id === "string" && validModuleIds.has(id),
  );

  return uniqueValidIds.length > 0 ? Array.from(new Set(uniqueValidIds)) : defaultCompletedIds;
}

function loadInitialState() {
  if (typeof window === "undefined") {
    return defaultCompletedIds;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultCompletedIds;
  }

  try {
    const parsed = JSON.parse(stored);
    return sanitizeCompletedIds(parsed);
  } catch {
    return defaultCompletedIds;
  }
}

function persistCompletedIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

interface LearningProgressValue {
  completedIds: string[];
  isCompleted: (moduleId: string) => boolean;
  isReadyToLearn: (module: Module) => boolean;
  toggleCompleted: (moduleId: string) => void;
  resetProgress: () => void;
  counts: {
    completed: number;
    ready: number;
    locked: number;
  };
  unlockedAchievementIds: string[];
  unlockedAchievements: typeof achievements;
}

const LearningProgressContext = createContext<LearningProgressValue | null>(null);

export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const [completedIds, setCompletedIds] = useState<string[]>(loadInitialState);

  useEffect(() => {
    const syncProgressFromStorage = () => setCompletedIds(loadInitialState());
    window.addEventListener("storage", syncProgressFromStorage);
    return () => {
      window.removeEventListener("storage", syncProgressFromStorage);
    };
  }, []);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  function isCompleted(moduleId: string) {
    return completedSet.has(moduleId);
  }

  function isReadyToLearn(module: Module) {
    return (
      !completedSet.has(module.id) &&
      module.prerequisites.every((prerequisiteId) => completedSet.has(prerequisiteId))
    );
  }

  function toggleCompleted(moduleId: string) {
    setCompletedIds((currentIds) => {
      const nextIds = currentIds.includes(moduleId)
        ? currentIds.filter((id) => id !== moduleId)
        : [...currentIds, moduleId];

      persistCompletedIds(nextIds);
      return nextIds;
    });
  }

  function resetProgress() {
    const nextIds = [...defaultCompletedIds];
    persistCompletedIds(nextIds);
    setCompletedIds(nextIds);
  }

  const counts = moduleList.reduce(
    (acc, module) => {
      if (completedSet.has(module.id)) {
        acc.completed += 1;
      } else if (isReadyToLearn(module)) {
        acc.ready += 1;
      } else {
        acc.locked += 1;
      }
      return acc;
    },
    { completed: 0, ready: 0, locked: 0 },
  );

  const unlockedAchievementIds = getUnlockedAchievementIds(completedIds);
  const unlockedAchievements = achievements.filter((achievement) =>
    unlockedAchievementIds.includes(achievement.id),
  );

  const value: LearningProgressValue = {
    completedIds,
    isCompleted,
    isReadyToLearn,
    toggleCompleted,
    resetProgress,
    counts,
    unlockedAchievementIds,
    unlockedAchievements,
  };

  return createElement(LearningProgressContext.Provider, { value }, children);
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);

  if (!context) {
    throw new Error("useLearningProgress must be used inside LearningProgressProvider");
  }

  return context;
}
