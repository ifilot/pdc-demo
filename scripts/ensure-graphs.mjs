import { access } from "node:fs/promises";
import { spawn } from "node:child_process";

const graphDefinitions = [
  {
    name: "Module 2 Example 2.1 concentration plot",
    output: "public/generated/modules/02/example_2_1.svg",
    script: "dev/scripts/modules/02/example_2_1.py",
  },
  {
    name: "Module 2 Example 2.2 comparison plot",
    output: "public/generated/modules/02/example_2_2.svg",
    script: "dev/scripts/modules/02/example_2_2.py",
  },
  {
    name: "Module 2 linearization comparison plot",
    output: "public/generated/modules/02/example_2_3.svg",
    script: "dev/scripts/modules/02/example_2_3.py",
  },
  {
    name: "Module 2 Example 2.6 non-isothermal CSTR plot",
    output: "public/generated/modules/02/example_2_6.svg",
    script: "dev/scripts/modules/02/example_2_6.py",
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

async function main() {
  const forceRebuild = process.argv.includes("--force");
  const missingGraphs = [];

  for (const graph of graphDefinitions) {
    const fileExists = await exists(graph.output);
    if (forceRebuild || !fileExists) {
      missingGraphs.push(graph);
    }
  }

  if (missingGraphs.length === 0) {
    console.log("All required graphs already exist.");
    return;
  }

  await validatePythonEnvironment();

  console.log(
    forceRebuild
      ? `Rebuilding ${missingGraphs.length} graph(s)...`
      : `Generating ${missingGraphs.length} missing graph(s)...`,
  );
  for (const graph of missingGraphs) {
    console.log(`• ${graph.name}`);
    await runProcess("python3", [graph.script, "--output", graph.output, "--no-show"]);
  }

  console.log(forceRebuild ? "Graph rebuild complete." : "Graph generation complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
