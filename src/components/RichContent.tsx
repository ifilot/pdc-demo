import { lazy, Suspense } from "react";
import type { ContentBlock } from "../types/moduleContent";
import { MathParagraph } from "./MathContent";

const PythonCodeBlock = lazy(() =>
  import("./PythonCodeBlock").then((module) => ({ default: module.PythonCodeBlock })),
);

export function RichContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <MathParagraph key={index} text={block.text} />;
        }

        return (
          <Suspense
            key={index}
            fallback={
              <figure className="code-block-shell">
                {block.caption && <figcaption className="code-block-caption">{block.caption}</figcaption>}
                <pre className="code-block-fallback">
                  <code>{block.code}</code>
                </pre>
              </figure>
            }
          >
            <PythonCodeBlock code={block.code} caption={block.caption} />
          </Suspense>
        );
      })}
    </>
  );
}
