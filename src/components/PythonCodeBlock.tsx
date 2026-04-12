import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";

export function PythonCodeBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <figure className="code-block-shell">
      {caption && <figcaption className="code-block-caption">{caption}</figcaption>}
      <SyntaxHighlighter language="python" style={coldarkCold} customStyle={{ margin: 0 }}>
        {code}
      </SyntaxHighlighter>
    </figure>
  );
}
