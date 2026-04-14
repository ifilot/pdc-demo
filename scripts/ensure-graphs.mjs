import { access } from "node:fs/promises";
import { spawn } from "node:child_process";

const graphDefinitions = [
  {
    name: "Module 2 Example 2.1 concentration plot",
    output: "public/generated/module-02-example-2-1-concentration.png",
    script: "dev/module2_example_2_1_concentration_plot.py",
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
  const missingGraphs = [];

  for (const graph of graphDefinitions) {
    const fileExists = await exists(graph.output);
    if (!fileExists) {
      missingGraphs.push(graph);
    }
  }

  if (missingGraphs.length === 0) {
    console.log("All required graphs already exist.");
    return;
  }

  await validatePythonEnvironment();

  console.log(`Generating ${missingGraphs.length} missing graph(s)...`);
  for (const graph of missingGraphs) {
    console.log(`• ${graph.name}`);
    await runProcess("python3", [graph.script, "--output", graph.output, "--no-show"]);
  }

  console.log("Graph generation complete.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
