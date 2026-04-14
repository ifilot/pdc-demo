import { access } from "node:fs/promises";
import { spawn } from "node:child_process";

const assetDefinitions = [
  {
    kind: "python-graph",
    name: "Module 2 Example 2.1 concentration plot",
    output: "public/generated/modules/02/example_2_1.svg",
    script: "dev/scripts/modules/02/example_2_1.py",
  },
  {
    kind: "python-graph",
    name: "Module 2 Example 2.2 comparison plot",
    output: "public/generated/modules/02/example_2_2.svg",
    script: "dev/scripts/modules/02/example_2_2.py",
  },
  {
    kind: "python-graph",
    name: "Module 2 linearization comparison plot",
    output: "public/generated/modules/02/example_2_3.svg",
    script: "dev/scripts/modules/02/example_2_3.py",
  },
  {
    kind: "python-graph",
    name: "Module 2 Example 2.6 non-isothermal CSTR plot",
    output: "public/generated/modules/02/example_2_6.svg",
    script: "dev/scripts/modules/02/example_2_6.py",
  },
  {
    kind: "tikz-diagram",
    name: "Module 4 Example 4.4 feedback block diagram",
    output: "public/generated/modules/04/example_4_4_feedback_block_diagram.svg",
    script: "dev/scripts/modules/04/example_4_4_feedback_block_diagram.mjs",
  },
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: "inherit" });

    process.on("error", (error) => reject(error));
    process.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}.`));
    });
  });
}

async function validatePythonEnvironment() {
  const dependencyCheckScript = [
    "-c",
    [
      "import importlib.util, sys",
      "missing = [name for name in ('numpy', 'matplotlib') if importlib.util.find_spec(name) is None]",
      "sys.exit(0 if not missing else 1)",
    ].join("; "),
  ];

  try {
    await runProcess("python3", dependencyCheckScript);
  } catch {
    throw new Error(
      "Python graph dependencies are missing. Run `pip install -r dev/requirements-graphs.txt` and retry.",
    );
  }
}

async function validateTikzEnvironment() {
  const dependencyCheckScript = [
    "-lc",
    [
      "latex='';",
      "for cmd in pdflatex lualatex xelatex; do",
      "  if command -v \"$cmd\" >/dev/null 2>&1; then latex=\"$cmd\"; break; fi",
      "done;",
      "converter='';",
      "for cmd in pdftocairo pdf2svg dvisvgm; do",
      "  if command -v \"$cmd\" >/dev/null 2>&1; then converter=\"$cmd\"; break; fi",
      "done;",
      "[ -n \"$latex\" ] && [ -n \"$converter\" ];",
    ].join(" "),
  ];

  try {
    await runProcess("bash", dependencyCheckScript);
  } catch {
    throw new Error(
      "TikZ diagram dependencies are missing. Install a LaTeX engine (pdflatex, lualatex, or xelatex) and a PDF-to-SVG converter (pdftocairo, pdf2svg, or dvisvgm) and retry.",
    );
  }
}

async function main() {
  const forceRebuild = process.argv.includes("--force");
  const missingAssets = [];

  for (const asset of assetDefinitions) {
    const fileExists = await exists(asset.output);
    if (forceRebuild || !fileExists) {
      missingAssets.push(asset);
    }
  }

  if (missingAssets.length === 0) {
    console.log("All required generated assets already exist.");
    return;
  }

  const requiresPython = missingAssets.some((asset) => asset.kind === "python-graph");
  const requiresTikz = missingAssets.some((asset) => asset.kind === "tikz-diagram");

  if (requiresPython) {
    await validatePythonEnvironment();
  }

  if (requiresTikz) {
    await validateTikzEnvironment();
  }

  console.log(
    forceRebuild
      ? `Rebuilding ${missingAssets.length} generated asset(s)...`
      : `Generating ${missingAssets.length} missing generated asset(s)...`,
  );
  for (const asset of missingAssets) {
    console.log(`• ${asset.name}`);
    if (asset.kind === "python-graph") {
      await runProcess("python3", [asset.script, "--output", asset.output, "--no-show"]);
      continue;
    }
    await runProcess("node", [asset.script, "--output", asset.output]);
  }

  console.log(forceRebuild ? "Generated asset rebuild complete." : "Generated asset creation complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
