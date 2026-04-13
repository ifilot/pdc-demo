import introTheory from "../modules/01_introduction-to-process-control/theory.md?raw";
import introSummary from "../modules/01_introduction-to-process-control/summary.md?raw";
import introCheckpoint from "../modules/01_introduction-to-process-control/checkpoint";
import modelingTheory from "../modules/02_mathematical-modelling-principles/theory.md?raw";
import modelingSummary from "../modules/02_mathematical-modelling-principles/summary.md?raw";
import modelingCheckpoint from "../modules/02_mathematical-modelling-principles/checkpoint";
import tablesTheory from "../modules/03_first-order-process-models/theory.md?raw";
import tablesSummary from "../modules/03_first-order-process-models/summary.md?raw";
import tablesCheckpoint from "../modules/03_first-order-process-models/checkpoint";
import feedbackTheory from "../modules/04_feedback-control-concepts/theory.md?raw";
import feedbackSummary from "../modules/04_feedback-control-concepts/summary.md?raw";
import feedbackCheckpoint from "../modules/04_feedback-control-concepts/checkpoint";
import tuningTheory from "../modules/05_controller-tuning/theory.md?raw";
import tuningSummary from "../modules/05_controller-tuning/summary.md?raw";
import tuningCheckpoint from "../modules/05_controller-tuning/checkpoint";
import performanceTheory from "../modules/06_closed-loop-performance/theory.md?raw";
import performanceSummary from "../modules/06_closed-loop-performance/summary.md?raw";
import performanceCheckpoint from "../modules/06_closed-loop-performance/checkpoint";
import reviewTheory from "../modules/07_control-strategy-review/theory.md?raw";
import reviewSummary from "../modules/07_control-strategy-review/summary.md?raw";
import reviewCheckpoint from "../modules/07_control-strategy-review/checkpoint";
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

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    paragraphLines.push(trimmed);
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
  "modeling-principles": createModuleContent(
    modelingTheory,
    modelingSummary,
    modelingCheckpoint,
  ),
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

function normalizeForMatching(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toNormalizedTokens(text: string) {
  const normalized = normalizeForMatching(text);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter(Boolean)
    .map((token) => {
      if (token.endsWith("es") && token.length > 4) {
        return token.slice(0, -2);
      }
      if (token.endsWith("s") && token.length > 3) {
        return token.slice(0, -1);
      }
      return token;
    });
}

function getEditDistance(a: string, b: string) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      table[i][j] = Math.min(
        table[i - 1][j] + 1,
        table[i][j - 1] + 1,
        table[i - 1][j - 1] + cost,
      );
    }
  }

  return table[a.length][b.length];
}

function fuzzyTokenMatch(keyword: string, answerTokens: string[]) {
  const keywordTokens = toNormalizedTokens(keyword);
  if (keywordTokens.length === 0) {
    return false;
  }

  return keywordTokens.every((keywordToken) =>
    answerTokens.some((answerToken) => {
      if (answerToken === keywordToken) {
        return true;
      }

      const maxDistance = keywordToken.length >= 9 ? 2 : keywordToken.length >= 5 ? 1 : 0;
      if (maxDistance === 0) {
        return false;
      }

      return getEditDistance(answerToken, keywordToken) <= maxDistance;
    }),
  );
}

export function isQuestionAnswerCorrect(question: ModuleQuestion, answer: string) {
  const normalizedAnswer = normalizeForMatching(answer);
  if (!normalizedAnswer) {
    return false;
  }

  const answerTokens = toNormalizedTokens(normalizedAnswer);
  return question.acceptedKeywords.some((keyword) => {
    const normalizedKeyword = normalizeForMatching(keyword);
    if (!normalizedKeyword) {
      return false;
    }

    return normalizedAnswer.includes(normalizedKeyword) || fuzzyTokenMatch(normalizedKeyword, answerTokens);
  });
}

export function getModuleContent(moduleId: string) {
  return moduleContentById[moduleId];
}
