import { BlockMath, InlineMath } from "react-katex";

type Segment =
  | { type: "text"; value: string }
  | { type: "inline-math"; value: string }
  | { type: "block-math"; value: string };

function parseMathSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let index = 0;

  while (index < text.length) {
    const blockStart = text.indexOf("$$", index);
    const inlineStart = text.indexOf("$", index);

    let nextStart = -1;
    let mode: "block" | "inline" | null = null;

    if (blockStart !== -1 && (inlineStart === -1 || blockStart <= inlineStart)) {
      nextStart = blockStart;
      mode = "block";
    } else if (inlineStart !== -1) {
      nextStart = inlineStart;
      mode = "inline";
    }

    if (nextStart === -1 || mode === null) {
      segments.push({ type: "text", value: text.slice(index) });
      break;
    }

    if (nextStart > index) {
      segments.push({ type: "text", value: text.slice(index, nextStart) });
    }

    if (mode === "block") {
      const end = text.indexOf("$$", nextStart + 2);
      if (end === -1) {
        segments.push({ type: "text", value: text.slice(nextStart) });
        break;
      }
      segments.push({ type: "block-math", value: text.slice(nextStart + 2, end).trim() });
      index = end + 2;
      continue;
    }

    const end = text.indexOf("$", nextStart + 1);
    if (end === -1) {
      segments.push({ type: "text", value: text.slice(nextStart) });
      break;
    }
    segments.push({ type: "inline-math", value: text.slice(nextStart + 1, end).trim() });
    index = end + 1;
  }

  return segments;
}

export function MathParagraph({ text }: { text: string }) {
  const segments = parseMathSegments(text);

  return (
    <p>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={index}>{segment.value}</span>;
        }

        if (segment.type === "inline-math") {
          return <InlineMath key={index} math={segment.value} />;
        }

        return (
          <span key={index} className="inline-block-math">
            <BlockMath math={segment.value} />
          </span>
        );
      })}
    </p>
  );
}

export function MathContent({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <MathParagraph key={index} text={paragraph} />
      ))}
    </>
  );
}
