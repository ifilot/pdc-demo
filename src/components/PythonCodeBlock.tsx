import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";

export function PythonCodeBlock({ code, caption }: { code: string; caption?: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyState === "idle") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopyState("idle"), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <figure className="code-block-shell">
      <div className="code-block-topbar">
        {caption ? <figcaption className="code-block-caption">{caption}</figcaption> : <div />}
        <button type="button" className="code-block-copy-button" onClick={handleCopy}>
          {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter language="python" style={coldarkCold} customStyle={{ margin: 0 }}>
        {code}
      </SyntaxHighlighter>
    </figure>
  );
}
