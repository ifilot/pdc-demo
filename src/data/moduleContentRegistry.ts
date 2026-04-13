import introTheory from "../modules/01_introduction-to-process-control/theory.md?raw";
import introSummary from "../modules/01_introduction-to-process-control/summary.md?raw";
import introCheckpoint from "../modules/01_introduction-to-process-control/checkpoint";
import tablesTheory from "../modules/02_first-order-process-models/theory.md?raw";
import tablesSummary from "../modules/02_first-order-process-models/summary.md?raw";
import tablesCheckpoint from "../modules/02_first-order-process-models/checkpoint";
import feedbackTheory from "../modules/03_feedback-control-concepts/theory.md?raw";
import feedbackSummary from "../modules/03_feedback-control-concepts/summary.md?raw";
import feedbackCheckpoint from "../modules/03_feedback-control-concepts/checkpoint";
import tuningTheory from "../modules/04_controller-tuning/theory.md?raw";
import tuningSummary from "../modules/04_controller-tuning/summary.md?raw";
import tuningCheckpoint from "../modules/04_controller-tuning/checkpoint";
import performanceTheory from "../modules/05_closed-loop-performance/theory.md?raw";
import performanceSummary from "../modules/05_closed-loop-performance/summary.md?raw";
import performanceCheckpoint from "../modules/05_closed-loop-performance/checkpoint";
import reviewTheory from "../modules/06_control-strategy-review/theory.md?raw";
import reviewSummary from "../modules/06_control-strategy-review/summary.md?raw";
import reviewCheckpoint from "../modules/06_control-strategy-review/checkpoint";
import type { ContentBlock, ModuleCheckpoint, ModuleContent, ModuleQuestion } from "../types/moduleContent";

function parseMarkdownContent(markdown: string): ContentBlock[] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const blocks: ContentBlock[] = [];
  const lines = normalized.split("\n");
  const paragraphLines: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeCaption = "";
  let codeLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }

    const text = paragraphLines.join(" ").trim();
    if (text) {
      blocks.push({ type: "paragraph", text });
    }
    paragraphLines.length = 0;
  }

  function flushCodeBlock() {
    if (codeLanguage && codeLanguage !== "python") {
      paragraphLines.push(codeLines.join("\n"));
      codeLines = [];
      codeLanguage = "";
      codeCaption = "";
      return;
    }

    blocks.push({
      type: "python",
      code: codeLines.join("\n").trimEnd(),
      caption: codeCaption || undefined,
    });
    codeLines = [];
    codeLanguage = "";
    codeCaption = "";
  }

  for (const line of lines) {
    const fenceMatch = line.match(/^```([a-zA-Z0-9_-]+)?(?:\s+\|\s*(.+))?$/);

    if (fenceMatch) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushParagraph();
        inCodeBlock = true;
        codeLanguage = fenceMatch[1] ?? "";
        codeCaption = fenceMatch[2]?.trim() ?? "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const headingText = trimmed.replace(/^#{1,6}\s+/, "");
    paragraphLines.push(headingText);
  }

  if (inCodeBlock) {
    flushCodeBlock();
  } else {
    flushParagraph();
  }

  return blocks;
}

function createModuleContent(
  theory: string,
  summary: string,
  checkpoint: ModuleCheckpoint,
): ModuleContent {
  return {
    theory: parseMarkdownContent(theory),
    summary: parseMarkdownContent(summary),
    questions: checkpoint.questions,
  };
}

const moduleContentById: Record<string, ModuleContent> = {
  "intro-data": createModuleContent(introTheory, introSummary, introCheckpoint),
  tables: createModuleContent(tablesTheory, tablesSummary, tablesCheckpoint),
  "query-basics": createModuleContent(feedbackTheory, feedbackSummary, feedbackCheckpoint),
  "select-rows": createModuleContent(tuningTheory, tuningSummary, tuningCheckpoint),
  "combine-data": createModuleContent(performanceTheory, performanceSummary, performanceCheckpoint),
  "final-project": createModuleContent(reviewTheory, reviewSummary, reviewCheckpoint),
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

export function getModuleContent(moduleId: string) {
  return moduleContentById[moduleId];
}
