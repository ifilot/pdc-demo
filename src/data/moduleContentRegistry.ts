import introTheory from "../modules/01_introduction-to-process-control/theory.md?raw";
import introSummary from "../modules/01_introduction-to-process-control/summary.md?raw";
import introCheckpoint from "../modules/01_introduction-to-process-control/checkpoint";
import modelingTheory from "../modules/02_mathematical-modelling-principles/theory.md?raw";
import modelingSummary from "../modules/02_mathematical-modelling-principles/summary.md?raw";
import modelingCheckpoint from "../modules/02_mathematical-modelling-principles/checkpoint";
import laplaceTheory from "../modules/03_laplace-transforms/theory.md?raw";
import laplaceSummary from "../modules/03_laplace-transforms/summary.md?raw";
import laplaceCheckpoint from "../modules/03_laplace-transforms/checkpoint";
import transferTheory from "../modules/04_transfer-functions-and-linearized-models/theory.md?raw";
import transferSummary from "../modules/04_transfer-functions-and-linearized-models/summary.md?raw";
import transferCheckpoint from "../modules/04_transfer-functions-and-linearized-models/checkpoint";
import type { ContentBlock, ModuleCheckpoint, ModuleContent, ModuleQuestion } from "../types/moduleContent";

function parseImageMetadata(rawTitle?: string) {
  if (!rawTitle) {
    return {};
  }

  const parts = rawTitle
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  let caption = "";
  let width: string | undefined;

  for (const part of parts) {
    const widthMatch = part.match(/^width\s*=\s*(\d+(?:\.\d+)?(?:px|%|rem|em|vw)?)$/i);
    if (widthMatch) {
      width = widthMatch[1];
      continue;
    }

    caption = caption ? `${caption} | ${part}` : part;
  }

  return {
    caption: caption || undefined,
    width,
  };
}

function parseTableMetadata(rawText?: string) {
  if (!rawText) {
    return {};
  }

  const parts = rawText
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  let caption = "";
  let width: string | undefined;

  for (const part of parts) {
    const widthMatch = part.match(/^width\s*=\s*(\d+(?:\.\d+)?(?:px|%|rem|em|vw)?)$/i);
    if (widthMatch) {
      width = widthMatch[1];
      continue;
    }

    caption = caption ? `${caption} | ${part}` : part;
  }

  return {
    caption: caption || undefined,
    width,
  };
}

function parseMarkdownContent(markdown: string): ContentBlock[] {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const blocks: ContentBlock[] = [];
  const lines = normalized.split("\n");
  const paragraphLines: string[] = [];
  const listItems: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeCaption = "";
  let codeLines: string[] = [];
  let quoteLines: string[] = [];

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

  function flushList() {
    if (listItems.length === 0) {
      return;
    }

    blocks.push({
      type: "list",
      items: [...listItems],
    });
    listItems.length = 0;
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

  function flushQuoteBlock() {
    if (quoteLines.length === 0) {
      return;
    }

    const quoteContent = quoteLines.join("\n").trim();
    quoteLines = [];

    if (!quoteContent) {
      return;
    }

    blocks.push({
      type: "callout",
      blocks: parseMarkdownContent(quoteContent),
    });
  }

  function isTableLine(value: string) {
    return /^\|.+\|$/.test(value.trim());
  }

  function isTableSeparator(value: string) {
    return /^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(value.trim());
  }

  function parseTableCells(value: string) {
    return value
      .trim()
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());
  }

  function consumeTrailingTableMetadata() {
    if (paragraphLines.length !== 1) {
      return {};
    }

    const candidate = paragraphLines[0].trim();
    if (!/^Table\b/i.test(candidate)) {
      return {};
    }

    paragraphLines.length = 0;
    return parseTableMetadata(candidate);
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
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

    const quoteMatch = line.match(/^\s*>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      continue;
    }

    if (quoteLines.length > 0 && !trimmed) {
      const nextLine = lines[index + 1];
      const nextIsQuote = typeof nextLine === "string" && /^\s*>\s?/.test(nextLine);

      if (nextIsQuote) {
        flushQuoteBlock();
        continue;
      }

      quoteLines.push("");
      continue;
    }

    flushQuoteBlock();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const nextLine = lines[index + 1]?.trim();
    if (isTableLine(trimmed) && nextLine && isTableSeparator(nextLine)) {
      const tableMetadata = consumeTrailingTableMetadata();
      flushParagraph();
      flushList();

      const headers = parseTableCells(trimmed);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length) {
        const rowLine = lines[index].trim();
        if (!isTableLine(rowLine)) {
          index -= 1;
          break;
        }
        rows.push(parseTableCells(rowLine));
        index += 1;
      }

      blocks.push({
        type: "table",
        headers,
        rows,
        caption: tableMetadata.caption,
        width: tableMetadata.width,
      });
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\((\S+)(?:\s+"([^"]+)")?\)$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      const { caption, width } = parseImageMetadata(imageMatch[3]?.trim());
      blocks.push({
        type: "image",
        alt: imageMatch[1].trim(),
        src: imageMatch[2].trim(),
        caption,
        width,
      });
      continue;
    }

    const listMatch = trimmed.match(/^-\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1].trim());
      continue;
    }

    flushList();

    paragraphLines.push(trimmed);
  }

  if (inCodeBlock) {
    flushCodeBlock();
  } else {
    flushQuoteBlock();
    flushList();
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
  "laplace-transforms": createModuleContent(laplaceTheory, laplaceSummary, laplaceCheckpoint),
  "transfer-functions": createModuleContent(transferTheory, transferSummary, transferCheckpoint),
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
