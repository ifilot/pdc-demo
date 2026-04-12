import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dump as toYaml, load as parseYaml } from "js-yaml";
import { achievements, getUnlockedAchievementIds } from "../data/achievements";
import { moduleList, type Module, validQuestionIds } from "../data/sqlTree";

const STORAGE_KEY = "pdc-course-progress";
const ANSWERS_STORAGE_KEY = "pdc-course-question-answers";
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

function sanitizeQuestionAnswers(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([questionId, answer]) => {
      return validQuestionIds.has(questionId) && typeof answer === "string";
    }),
  );
}

function loadInitialAnswers() {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem(ANSWERS_STORAGE_KEY);
  if (!stored) {
    return {};
  }

  try {
    return sanitizeQuestionAnswers(JSON.parse(stored));
  } catch {
    return {};
  }
}

function persistQuestionAnswers(answers: Record<string, string>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
}

interface ProgressFileData {
  schemaVersion: number;
  exportedAt: string;
  course: string;
  completedIds: string[];
  questionAnswers: Record<string, string>;
}

function createProgressSnapshot(
  completedIds: string[],
  questionAnswers: Record<string, string>,
): ProgressFileData {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    course: "Process Dynamics and Control",
    completedIds: sanitizeCompletedIds(completedIds),
    questionAnswers: sanitizeQuestionAnswers(questionAnswers),
  };
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function parseImportedProgress(content: string, formatHint?: "json" | "yaml") {
  const trimmed = content.trim();
  const parsed =
    formatHint === "json"
      ? JSON.parse(trimmed)
      : formatHint === "yaml"
        ? parseYaml(trimmed)
        : trimmed.startsWith("{")
          ? JSON.parse(trimmed)
          : parseYaml(trimmed);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("The selected file does not contain valid progress data.");
  }

  const completedIds = sanitizeCompletedIds((parsed as { completedIds?: unknown }).completedIds);
  const questionAnswers = sanitizeQuestionAnswers(
    (parsed as { questionAnswers?: unknown }).questionAnswers,
  );
  return { completedIds, questionAnswers };
}

interface LearningProgressValue {
  completedIds: string[];
  questionAnswers: Record<string, string>;
  isCompleted: (moduleId: string) => boolean;
  isReadyToLearn: (module: Module) => boolean;
  getQuestionAnswer: (questionId: string) => string;
  setQuestionAnswer: (questionId: string, value: string) => void;
  toggleCompleted: (moduleId: string) => void;
  resetProgress: () => void;
  exportProgressJson: () => void;
  exportProgressYaml: () => void;
  importProgressFile: (file: File) => Promise<void>;
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
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>(loadInitialAnswers);

  useEffect(() => {
    const syncProgressFromStorage = () => {
      setCompletedIds(loadInitialState());
      setQuestionAnswers(loadInitialAnswers());
    };
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

  function getQuestionAnswer(questionId: string) {
    return questionAnswers[questionId] ?? "";
  }

  function setQuestionAnswer(questionId: string, value: string) {
    setQuestionAnswers((currentAnswers) => {
      const nextAnswers = {
        ...currentAnswers,
        [questionId]: value,
      };
      persistQuestionAnswers(nextAnswers);
      return nextAnswers;
    });
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
    persistQuestionAnswers({});
    setQuestionAnswers({});
  }

  function exportProgressJson() {
    const snapshot = createProgressSnapshot(completedIds, questionAnswers);
    downloadTextFile(
      "pdc-progress.json",
      `${JSON.stringify(snapshot, null, 2)}\n`,
      "application/json",
    );
  }

  function exportProgressYaml() {
    const snapshot = createProgressSnapshot(completedIds, questionAnswers);
    downloadTextFile("pdc-progress.yaml", toYaml(snapshot), "application/yaml");
  }

  async function importProgressFile(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const formatHint =
      extension === "json" ? "json" : extension === "yaml" || extension === "yml" ? "yaml" : undefined;
    const content = await file.text();
    const { completedIds: nextIds, questionAnswers: nextAnswers } = parseImportedProgress(
      content,
      formatHint,
    );
    persistCompletedIds(nextIds);
    persistQuestionAnswers(nextAnswers);
    setCompletedIds(nextIds);
    setQuestionAnswers(nextAnswers);
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
    questionAnswers,
    isCompleted,
    isReadyToLearn,
    getQuestionAnswer,
    setQuestionAnswer,
    toggleCompleted,
    resetProgress,
    exportProgressJson,
    exportProgressYaml,
    importProgressFile,
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
