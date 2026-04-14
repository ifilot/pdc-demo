import { mkdtemp, mkdir, rm, copyFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const texSource = path.join(__dirname, "example_4_4_feedback_block_diagram.tex");

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}.`));
    });
  });
}

async function commandExists(command) {
  try {
    await runProcess("bash", ["-lc", `command -v ${command}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function findLatexEngine() {
  for (const command of ["pdflatex", "lualatex", "xelatex"]) {
    if (await commandExists(command)) {
      return command;
    }
  }
  throw new Error(
    "No LaTeX engine found. Install pdflatex, lualatex, or xelatex to build TikZ diagrams.",
  );
}

async function findSvgConverter() {
  for (const command of ["pdftocairo", "pdf2svg", "dvisvgm"]) {
    if (await commandExists(command)) {
      return command;
    }
  }
  throw new Error(
    "No PDF-to-SVG converter found. Install pdftocairo, pdf2svg, or dvisvgm to build TikZ diagrams.",
  );
}

function parseArgs() {
  const args = process.argv.slice(2);
  let output = "public/generated/modules/04/example_4_4_feedback_block_diagram.svg";

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--output" && args[index + 1]) {
      output = args[index + 1];
      index += 1;
    }
  }

  return {
    output: path.resolve(process.cwd(), output),
  };
}

async function buildDiagram(outputPath) {
  const latexEngine = await findLatexEngine();
  const svgConverter = await findSvgConverter();
  const workDir = await mkdtemp(path.join(tmpdir(), "pdc-tikz-"));
  const texFile = path.join(workDir, path.basename(texSource));
  const pdfFile = path.join(workDir, "example_4_4_feedback_block_diagram.pdf");

  try {
    await copyFile(texSource, texFile);

    await runProcess(
      latexEngine,
      [
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-output-directory",
        workDir,
        texFile,
      ],
      { cwd: workDir },
    );

    await mkdir(path.dirname(outputPath), { recursive: true });

    if (svgConverter === "pdftocairo") {
      await runProcess(svgConverter, ["-svg", pdfFile, outputPath]);
      return;
    }

    if (svgConverter === "pdf2svg") {
      await runProcess(svgConverter, [pdfFile, outputPath]);
      return;
    }

    await runProcess(svgConverter, ["--pdf", pdfFile, "-n", "-o", outputPath]);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

async function main() {
  const { output } = parseArgs();
  await buildDiagram(output);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
