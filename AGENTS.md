# AGENTS.md

## Purpose

This repository contains the Process Dynamics and Control course website. Codex should optimize for:

1. Clear, maintainable course-authoring workflows.
2. Safe feature delivery without breaking routing, progress persistence, or curriculum structure.

The repository uses a single, consistent content model:

- Every roadmap node is a `module`.
- A module has three content parts:
  - `theory`
  - `summary`
  - `checkpoint`
- A module is connected to one or more course-level learning goals.
- There is no separate lecture content model.

## Core Rule

`src/data/sqlTree.ts` defines the curriculum graph and metadata.

It should not become a large content dump.

Codex should keep long-form module content outside `sqlTree.ts` in per-module files under `src/modules/`.

## Target Repository Structure

The intended structure for authored module content is:

```text
src/
  data/
    sqlTree.ts
    moduleContentRegistry.ts
  modules/
    01_introduction-to-process-control/
      theory.md
      summary.md
      checkpoint.ts
    02_first-order-process-models/
      theory.md
      summary.md
      checkpoint.ts
    03_feedback-control-concepts/
      theory.md
      summary.md
      checkpoint.ts
```

Use the module title as a readable slug in the folder name, prefixed with ordering for readability:

- `01_introduction-to-process-control`
- `02_first-order-process-models`
- `03_feedback-control-concepts`

Keep the stable module ID in `sqlTree.ts`, but use title-based folder names in `src/modules/` so authors can recognize modules at a glance.

## File Responsibilities

### `src/data/sqlTree.ts`

This file should define only structural curriculum information:

- module `id`
- module `name`
- module `type`
- short `description`
- `prerequisites`
- roadmap positioning
- learning goal links

Do not store long theory text, summary text, or checkpoint definitions inline here once the module-folder structure is in place.

### `src/modules/<module-folder>/theory.md`

Stores the main instructional content for the module.

Use Markdown because it is easier to author, review, and maintain than large TypeScript string objects.

### `src/modules/<module-folder>/summary.md`

Stores the compact recap for the module.

Use Markdown for the same reasons as `theory.md`.

### `src/modules/<module-folder>/checkpoint.ts`

Stores structured checkpoint data.

Use TypeScript because checkpoints are not just prose. They contain structured question definitions and may later include richer validation or interactive behavior.

## Content Model

Each module should resolve to this conceptual shape:

```ts
{
  theory: string,
  summary: string,
  checkpoint: {
    questions: ModuleQuestion[],
  },
  learningGoalIds: string[],
}
```

In practice:

- `theory` comes from `theory.md`
- `summary` comes from `summary.md`
- `checkpoint` comes from `checkpoint.ts`
- `learningGoalIds` are defined in `sqlTree.ts`

## Recommended Loading Pattern

Codex should prefer a central registry file such as `src/data/moduleContentRegistry.ts`.

That registry should:

- import module Markdown files with `?raw`
- import checkpoint definitions from `checkpoint.ts`
- expose a clean lookup function such as `getModuleContent(moduleId)`

Example pattern:

```ts
import introTheory from "../modules/01_introduction-to-process-control/theory.md?raw";
import introSummary from "../modules/01_introduction-to-process-control/summary.md?raw";
import introCheckpoint from "../modules/01_introduction-to-process-control/checkpoint";
```

This is preferred over storing raw string file paths in `sqlTree.ts`.

Do not make `sqlTree.ts` manually reference fragile filesystem strings like:

```ts
theoryFile: "src/modules/01_introduction-to-process-control/theory.md"
```

Prefer import-backed registries because they are safer, type-checkable, and easier to refactor.

## Checkpoint Shape

Checkpoint files should export structured data, not JSX.

Preferred shape:

```ts
import type { ModuleCheckpoint } from "../../types/moduleContent";

const checkpoint: ModuleCheckpoint = {
  questions: [
    {
      id: "intro-data-cv",
      prompt: "Name one controlled variable in a chemical process and explain why it matters.",
      placeholder: "For example: reactor temperature, tank level, distillation pressure...",
      acceptedKeywords: ["temperature", "pressure", "level"],
      hint: "A controlled variable is something the plant wants to hold near a desired value.",
    },
  ],
};

export default checkpoint;
```

Codex should keep checkpoint logic data-driven and avoid hardcoding question behavior inside page components unless a new interaction pattern is explicitly required.

## Learning Goals

Learning goals are shared course-level definitions and should be defined centrally, not duplicated inside module folders.

Modules should reference them by stable ID.

Codex should:

- keep learning goal definitions centralized
- keep module-to-goal links explicit
- avoid duplicating goal text across modules

## Authoring Rules

When adding or editing a module:

1. Update module structure in `src/data/sqlTree.ts`.
2. Add or update `theory.md`.
3. Add or update `summary.md`.
4. Add or update `checkpoint.ts`.
5. Verify learning goal links.
6. Run the build.

When adding a new module folder:

- use the ordering prefix
- use a readable slug derived from the module title
- keep filenames exactly:
  - `theory.md`
  - `summary.md`
  - `checkpoint.ts`

Module Markdown should preferably be written to an 80-column layout for normal
prose so that authored content remains easy to review in diffs and in plain-text
editors.

Codex should keep this as a preference rather than an absolute rule. Do not
force 80-column wrapping when doing so would make the content worse or risk
breaking rendering, for example in:

- display equations
- inline-heavy mathematical lines
- image references
- fenced code blocks
- code-listing captions
- other syntax where wrapping would reduce clarity or be fragile

## Example Authoring Rules

Worked examples are part of the teaching voice of the module and should be visually distinct from the surrounding explanatory text.

Codex should format numbered examples in module Markdown as blockquote-style callouts using the `>` prefix on every line of the example.

Preferred pattern:

```md
> # Example 2.1: A Stirred-Tank Mixer
>
> Introductory explanation of the example.
>
> $$\tau = \frac{V}{F}$$
>
> Additional interpretation.
>
> ![Example 2.1 concentration response](/generated/modules/02/example_2_1.png "Figure 2.1: ... | width=60%")
```

Codex should:

- keep the example heading inside the callout block
- keep all example prose, equations, bullet lists, and figures inside the same callout block
- leave a blank line between one example callout and the next so they render as separate boxes
- preserve the numbered sequence of examples within the module
- keep the surrounding theory text outside the example callout unless it is truly part of the worked example

### Example Visual Style

The site renders example callouts with:

- a distinct background
- left-side indentation
- a vertical accent line
- slightly smaller typography than the main body text

Codex should treat this as the standard presentation for worked examples and should not invent alternative example containers unless a new style is explicitly requested.

### Example Content Style

Worked examples should read like guided engineering reasoning, not like disconnected calculations.

Codex should:

- begin with a short statement of the physical situation or modelling goal
- present equations in a logical sequence
- explain what the reader should notice physically, not only mathematically
- place parameter values in the example text when they are part of the setup
- keep figure references and interpretation inside the example when the figure belongs to that example

If an example includes a graph, keep the graph filename aligned with the example number whenever possible.

## Code Listing Rules

Short code listings are allowed inside theory modules when they clearly support the teaching point and remain concise.

Codex should embed code listings in Markdown fenced code blocks and use the caption slot after the language tag to provide a numbered listing title.

Preferred pattern:

```md
```python | Listing 2.1: Solving a first-order model with solve_ivp
from scipy.integrate import solve_ivp
```
```

Codex should:

- number listings in the order they appear within the module
- use captions of the form `Listing <chapter>.<number>: ...`
- keep listing titles descriptive but short
- keep listings compact and readable rather than production-heavy
- include only the code needed for the instructional point
- prefer `python` for executable computational examples unless another language is explicitly needed

### Listing Style

Listings should support the surrounding explanation, not replace it.

Codex should:

- introduce the listing in prose before it appears
- explain briefly what the listing demonstrates
- keep important interpretation in the surrounding text rather than in large code comments
- avoid oversized scripts or notebook-style dumps in module Markdown

If a listing is closely tied to a worked example, keep it inside the example callout so it inherits the same visual grouping.

## Graph Authoring Rules

Instructional graphs are part of the authored teaching material and should be built in a consistent, reproducible way.

### Graph Source of Truth

Codex should generate instructional graphs from code, not draw them manually.

Use a dedicated Python script with `matplotlib` for each graph.

Store graph-generation scripts under:

```text
dev/scripts/modules/<module-number>/
```

Store generated graph assets under:

```text
public/generated/modules/<module-number>/
```

### Graph Naming

When a graph belongs to a numbered example, use the example number as the canonical filename.

Preferred pattern:

- script: `example_<chapter>_<number>.py`
- output: `example_<chapter>_<number>.png`

Examples:

- `example_2_1.py`
- `example_2_1.png`
- `example_2_2.py`
- `example_2_2.png`

Do not add extra suffixes such as `_comparison`, `_final`, or `_v2` unless there is a real need for multiple distinct figures tied to the same example.

If multiple graphs are genuinely needed for the same example, add one short descriptive suffix consistently to both files, for example:

- `example_2_4_temperature.py`
- `example_2_4_temperature.png`

### Graph Content and Style

Each graph should support a specific teaching point in the surrounding text.

Codex should:

- keep graph styling simple, technical, and publication-like
- keep visual style broadly consistent within a module
- use similar figure sizes, line widths, font sizes, grid styling, and annotation style across related figures
- use legends, labels, and annotations only when they improve instructional clarity
- avoid overcrowding a single figure with too many ideas

The script should include a short docstring that states:

- what the graph shows
- which model is being plotted
- what disturbance or scenario is being simulated

Use parameter values from the module text whenever they are explicitly given.

If a parameter value is illustrative rather than taken directly from the text, state that clearly in the script and, when helpful for the reader, also state it in the module prose.

### Graph Integration in Module Text

Reference graphs from module Markdown using standard Markdown image syntax.

Use generated asset paths of the form:

```md
![Alt text](/generated/modules/02/example_2_2.png "Figure 2.2: ...")
```

If a narrower figure is needed, use the supported width metadata in the title string:

```md
![Alt text](/generated/modules/02/example_2_2.png "Figure 2.2: ... | width=68%")
```

Codex should:

- place the figure close to the paragraph where it is first discussed
- introduce the figure in prose before the image appears
- use alt text that describes the figure content, not the filename
- give the figure a clear caption in the Markdown title string
- explain in the prose what the reader should notice in the graph

### Graph Build Workflow

Every required graph should be registered in:

```text
scripts/ensure-graphs.mjs
```

When adding or changing a graph, Codex should:

1. add or update the Python script
2. generate or regenerate the PNG
3. update the Markdown reference if needed
4. update `scripts/ensure-graphs.mjs`
5. run `npm run build`

### Graph Maintenance

Codex should keep graph scripts readable and easy to adjust.

Prefer explicit constants near the top of the script for:

- physical parameters
- time ranges
- disturbance magnitudes
- plotting settings

Preserve stable filenames when the conceptual role of the graph has not changed.

If a graph file is renamed, update all connected references, including:

- the Python script filename
- the generated PNG filename
- `scripts/ensure-graphs.mjs`
- the Markdown image reference

## What Codex Should Avoid

- Do not reintroduce a lecture/module split.
- Do not place long educational prose back into `sqlTree.ts` if a per-module file exists.
- Do not duplicate module content across page components.
- Do not use opaque internal IDs as folder names when a readable title slug is available.
- Do not invent ad hoc folder/file naming patterns for new modules.

## Safe Change Guidance

When changing this repository, preserve:

- hash-based routing
- browser local-storage progress behavior
- question persistence
- achievement logic
- stable module IDs

Module IDs and question IDs act as durable keys. Change them only when explicitly intended, and call out the impact if they change.

## Verification

After meaningful changes, run:

```bash
npm run build
```

At minimum, verify:

- the build succeeds
- roadmap navigation still works
- module pages still render
- checkpoints still render and validate
- progress persistence still works if affected

## Final Response Expectations

When finishing work, Codex should briefly report:

- what changed
- whether module structure or IDs changed
- whether content files were added or moved
- whether `npm run build` succeeded
- any remaining risks
