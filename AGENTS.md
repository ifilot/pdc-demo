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
    01_intro-data/
      theory.md
      summary.md
      checkpoint.ts
    02_tables/
      theory.md
      summary.md
      checkpoint.ts
    03_query-basics/
      theory.md
      summary.md
      checkpoint.ts
```

Use the stable module ID in the folder name, prefixed with ordering for readability:

- `01_intro-data`
- `02_tables`
- `03_query-basics`

Prefer stable IDs over display titles in filenames and folder names.

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
import introTheory from "../modules/01_intro-data/theory.md?raw";
import introSummary from "../modules/01_intro-data/summary.md?raw";
import introCheckpoint from "../modules/01_intro-data/checkpoint";
```

This is preferred over storing raw string file paths in `sqlTree.ts`.

Do not make `sqlTree.ts` manually reference fragile filesystem strings like:

```ts
theoryFile: "src/modules/01_intro-data/theory.md"
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
- use the stable module ID
- keep filenames exactly:
  - `theory.md`
  - `summary.md`
  - `checkpoint.ts`

## What Codex Should Avoid

- Do not reintroduce a lecture/module split.
- Do not place long educational prose back into `sqlTree.ts` if a per-module file exists.
- Do not duplicate module content across page components.
- Do not use module display titles as primary file identifiers.
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
