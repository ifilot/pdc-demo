# Developer Notes

This folder explains how to extend the Process Dynamics and Control course site.

## Main Files

- `src/data/sqlTree.ts`
  Holds the roadmap node definitions, their prerequisite links, positions in the tree, and lecture content for terminal nodes.

- `src/data/achievements.ts`
  Holds achievement definitions and the logic that determines when they unlock.

- `src/pages/HomePage.tsx`
  Landing page for the course.

- `src/pages/LearnPage.tsx`
  Roadmap page that renders the learning tree.

- `src/pages/ModulePage.tsx`
  Topic page for non-terminal nodes.

- `src/pages/LecturePage.tsx`
  Lecture page for terminal nodes.

## Add More Nodes

Edit `src/data/sqlTree.ts`.

### 1. Add a module entry

Inside `moduleIndexRaw`, add a new object:

```ts
{
  id: "pid-control",
  name: "PID Control",
  type: "skill",
  description: "Study proportional, integral, and derivative control action.",
  prerequisites: ["feedback-control"],
}
```

Rules:

- `id` must be unique.
- `type` must be `"concept"` or `"skill"`.
- `prerequisites` must reference existing node IDs.

### 2. Add a tree position

Inside `positionsRaw`, add coordinates for the same `id`:

```ts
"pid-control": { x: x3, y: y4 },
```

If a node exists in `moduleIndexRaw` but not in `positionsRaw`, it will not appear in the roadmap.

### 3. Decide whether it should open a lecture

Terminal nodes are nodes with no follow-ups.

If you want a terminal node to open a lecture page, add content to `lectureContentById`:

```ts
"pid-control": {
  duration: "14 min",
  level: "Core Topic",
  sections: [
    {
      heading: "Why PID matters",
      body: "PID control remains a practical baseline in many industrial loops.",
    },
    {
      heading: "Tuning tradeoffs",
      body: "Aggressive tuning improves speed but can reduce robustness.",
    },
  ],
},
```

If a terminal node has no lecture content, it will still behave like a normal module page until you add that content.

## Draft Lecture Content

Lecture content lives in `src/data/sqlTree.ts` under `lectureContentById`.

Each lecture uses:

- `duration`
- `level`
- `sections`

Each section has:

- `heading`
- `body`

The lecture page renders:

- a `Theory` tab using the sections
- a `Summary` tab using the shared page template

If you want richer topic-specific summaries later, the cleanest path is to add a `summary` field to each lecture entry and render that in `src/pages/LecturePage.tsx`.

## Adjust Module Page Content

Non-terminal topic pages are rendered in `src/pages/ModulePage.tsx`.

Right now they use:

- a `Theory` tab
- a `Summary` tab

If you want module-specific writing instead of generic placeholder copy, a good next step is:

1. Add `theory` and `summary` fields to each module in `src/data/sqlTree.ts`.
2. Render those fields in `src/pages/ModulePage.tsx`.

## Define Achievements

Achievements live in `src/data/achievements.ts`.

### 1. Add a new achievement definition

```ts
{
  id: "loop-specialist",
  title: "Loop Specialist",
  description: "Complete all controller-focused topics.",
}
```

### 2. Add unlock logic

Inside `getUnlockedAchievementIds`, add a rule:

```ts
if (completed.has("controller-tuning") && completed.has("closed-loop-performance")) {
  unlocked.push("loop-specialist");
}
```

Achievements appear in two places:

- the landing page achievement panel
- the completion modal when a newly completed topic unlocks one

## Styling

Most site styling is in `src/index.css`.

Useful areas:

- landing page and layout
- roadmap card styles
- tabbed content panel styles
- completion modal and celebration effects
- achievement panel styles

## Suggested Workflow

When expanding the site:

1. Add or edit nodes in `src/data/sqlTree.ts`.
2. Update positions in `positionsRaw`.
3. Add lecture content for terminal topics.
4. Update achievements in `src/data/achievements.ts` if needed.
5. Run:

```bash
npm run build
```

## Good Next Improvements

- Move module content out of page components and into structured data.
- Add automated tests for routing, reset behavior, and achievement unlocks.
- Replace emoji trophy/badges with a custom icon set if you want a stricter visual language.
