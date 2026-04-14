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

        if (block.type === "heading") {
          const HeadingTag = `h${block.level}` as const;
          return <HeadingTag key={index}>{block.text}</HeadingTag>;
        }

        if (block.type === "image") {
          return (
            <figure
              key={index}
              className="content-image-shell"
              style={block.width ? { maxWidth: block.width, marginInline: "auto" } : undefined}
            >
              <img className="content-image" src={block.src} alt={block.alt} loading="lazy" />
              {block.caption && <figcaption className="content-image-caption">{block.caption}</figcaption>}
            </figure>
          );
        }

        if (block.type === "callout") {
          return (
            <blockquote key={index} className="content-callout">
              <RichContent blocks={block.blocks} />
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="content-list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <MathParagraph text={item} />
                </li>
              ))}
            </ul>
          );
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
