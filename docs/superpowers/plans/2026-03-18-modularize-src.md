# Modularize src/ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monolithic `src/data.ts` (2557 lines) and `src/index.ts` (596 lines) into a clean module structure where each file has one responsibility and stays under 400 lines.

**Architecture:** Extract data into `src/data/` modules by API kind (components, hooks, utilities, types) plus patterns, templates, and migration. Extract tools into `src/tools/` with one file per tool. Entry point `src/index.ts` becomes a thin bootstrap that imports and registers everything.

**Tech Stack:** TypeScript, @modelcontextprotocol/sdk, zod (from SDK)

---

## File Structure

```
src/
  index.ts                    — Server bootstrap: create McpServer, import tool registrations, connect transport (~30 lines)
  data/
    types.ts                  — ApiEntry, PropEntry, Example, SearchResult interfaces + Category/ApiKind/PatternSection constants + helper functions (capitalize, formatExample, formatApiReference, searchApis, getApiByName, getExamplesByCategory)
    components.ts             — 16 component ApiEntry[] export
    hooks.ts                  — 19 hook ApiEntry[] export
    utilities.ts              — 15 utility ApiEntry[] export
    api-types.ts              — 7 type ApiEntry[] export
    registry.ts               — imports all 4 arrays, exports ALL_APIS combined array
    patterns.ts               — PATTERNS record + PATTERN_SECTIONS
    templates.ts              — TEMPLATES object
    migration.ts              — V12_MIGRATION string
    index.ts                  — barrel re-export of everything
  tools/
    list-apis.ts              — list_apis tool registration function
    get-api.ts                — get_api tool registration function
    search-docs.ts            — search_docs tool registration function
    get-examples.ts           — get_examples tool registration function
    get-pattern.ts            — get_pattern tool registration function
    get-template.ts           — get_template tool registration function
    get-migration-guide.ts    — get_migration_guide tool registration function
    generate-flow.ts          — generate_flow tool registration function
    cheatsheet.ts             — cheatsheet resource registration function
    index.ts                  — barrel that calls all registration functions
```

**Convention:** Each tool file exports a single function `register(server: McpServer): void` that registers its tool/resource on the server instance.

---

### Task 1: Create `src/data/types.ts` — shared interfaces and helpers

**Files:**
- Create: `src/data/types.ts`
- Source: `src/data.ts:1-203` (interfaces, constants, helper functions)

- [ ] **Step 1: Create the file**

Move lines 1-203 from `src/data.ts` into `src/data/types.ts`. This includes:
- `ApiEntry`, `PropEntry`, `Example`, `SearchResult` interfaces
- `CATEGORIES` const + `Category` type
- `API_KINDS` const + `ApiKind` type
- `PATTERN_SECTIONS` const + `PatternSection` type
- Helper functions: `capitalize`, `formatExample`, `formatApiReference`, `searchApis`, `getApiByName`, `getExamplesByCategory`

The `searchApis`, `getApiByName`, and `getExamplesByCategory` functions reference `ALL_APIS`. Change these to accept `ALL_APIS` as a parameter instead of importing it (avoids circular dependency):

```ts
export function searchApis(query: string, allApis: ApiEntry[]): SearchResult[] { ... }
export function getApiByName(name: string, allApis: ApiEntry[]): ApiEntry | undefined { ... }
export function getExamplesByCategory(category: string, allApis: ApiEntry[]): Example[] { ... }
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit src/data/types.ts` (or full build later)

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "refactor: extract shared types and helpers to data/types.ts"
```

---

### Task 2: Create `src/data/components.ts` — 16 component entries

**Files:**
- Create: `src/data/components.ts`
- Source: `src/data.ts:205-796` (all `const *Component: ApiEntry` definitions)

- [ ] **Step 1: Create the file**

Move all 16 component `ApiEntry` definitions. Import `ApiEntry` from `./types.js`. Export a single array:

```ts
import type { ApiEntry } from "./types.js";

const reactFlowComponent: ApiEntry = { ... };
// ... all 16 components ...

export const COMPONENT_APIS: ApiEntry[] = [
  reactFlowComponent,
  reactFlowProviderComponent,
  backgroundComponent,
  controlsComponent,
  miniMapComponent,
  panelComponent,
  handleComponent,
  nodeResizerComponent,
  nodeToolbarComponent,
  edgeLabelRendererComponent,
  edgeToolbarComponent,
  baseEdgeComponent,
  viewportPortalComponent,
  nodeResizeControlComponent,
  controlButtonComponent,
];
```

Note: `reactFlowProviderComponent` is at line 774, after the other components. Move it here with the rest.

- [ ] **Step 2: Commit**

```bash
git add src/data/components.ts
git commit -m "refactor: extract component API entries to data/components.ts"
```

---

### Task 3: Create `src/data/hooks.ts` — 19 hook entries

**Files:**
- Create: `src/data/hooks.ts`
- Source: `src/data.ts:798-1172` (all `const *Hook: ApiEntry` definitions)

- [ ] **Step 1: Create the file**

Move all 19 hook definitions. Export as `HOOK_APIS: ApiEntry[]`.

```ts
import type { ApiEntry } from "./types.js";

const useReactFlowHook: ApiEntry = { ... };
// ... all 19 hooks ...

export const HOOK_APIS: ApiEntry[] = [
  useReactFlowHook, useNodesStateHook, useEdgesStateHook,
  useNodesHook, useEdgesHook, useNodesDataHook, useNodeIdHook,
  useConnectionHook, useHandleConnectionsHook, useNodeConnectionsHook,
  useOnSelectionChangeHook, useOnViewportChangeHook, useViewportHook,
  useStoreHook, useStoreApiHook, useNodesInitializedHook,
  useUpdateNodeInternalsHook, useKeyPressHook, useInternalNodeHook,
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/hooks.ts
git commit -m "refactor: extract hook API entries to data/hooks.ts"
```

---

### Task 4: Create `src/data/utilities.ts` — 15 utility entries

**Files:**
- Create: `src/data/utilities.ts`
- Source: `src/data.ts:1174-1379` (all `const *Util: ApiEntry` definitions)

- [ ] **Step 1: Create the file**

Move all 15 utility definitions. Export as `UTILITY_APIS: ApiEntry[]`.

- [ ] **Step 2: Commit**

```bash
git add src/data/utilities.ts
git commit -m "refactor: extract utility API entries to data/utilities.ts"
```

---

### Task 5: Create `src/data/api-types.ts` — 7 type entries

**Files:**
- Create: `src/data/api-types.ts`
- Source: `src/data.ts:1381-1680` (all type `ApiEntry` definitions: nodeType, edgeType, nodePropsType, edgePropsType, connectionType, viewportType, reactFlowInstanceType)

- [ ] **Step 1: Create the file**

Move all 7 type definitions. Export as `TYPE_APIS: ApiEntry[]`.

- [ ] **Step 2: Commit**

```bash
git add src/data/api-types.ts
git commit -m "refactor: extract type API entries to data/api-types.ts"
```

---

### Task 6: Create `src/data/patterns.ts`, `src/data/templates.ts`, `src/data/migration.ts`

**Files:**
- Create: `src/data/patterns.ts` — Source: `src/data.ts:1749-2369` (`PATTERNS` record). Also move `PATTERN_SECTIONS` constant here from types.ts (it's only used by patterns). Export both.
- Create: `src/data/templates.ts` — Source: `src/data.ts:2371-2507` (`TEMPLATES` object)
- Create: `src/data/migration.ts` — Source: `src/data.ts:2509-2557` (`V12_MIGRATION` string)

- [ ] **Step 1: Create all three files**

`src/data/patterns.ts`:
```ts
import type { PatternSection } from "./types.js";

export const PATTERNS: Record<PatternSection, string> = { ... };
```

`src/data/templates.ts`:
```ts
export const TEMPLATES: Record<string, string> = { ... };
```

`src/data/migration.ts`:
```ts
export const V12_MIGRATION = `...`;
```

- [ ] **Step 2: Commit**

```bash
git add src/data/patterns.ts src/data/templates.ts src/data/migration.ts
git commit -m "refactor: extract patterns, templates, and migration guide"
```

---

### Task 7: Create `src/data/registry.ts` and `src/data/index.ts`

**Files:**
- Create: `src/data/registry.ts` — combines all API arrays into `ALL_APIS`
- Create: `src/data/index.ts` — barrel re-export

- [ ] **Step 1: Create registry.ts**

```ts
import type { ApiEntry } from "./types.js";
import { COMPONENT_APIS } from "./components.js";
import { HOOK_APIS } from "./hooks.js";
import { UTILITY_APIS } from "./utilities.js";
import { TYPE_APIS } from "./api-types.js";

export const ALL_APIS: ApiEntry[] = [
  ...COMPONENT_APIS,
  ...HOOK_APIS,
  ...UTILITY_APIS,
  ...TYPE_APIS,
];
```

- [ ] **Step 2: Create data/index.ts barrel**

```ts
export * from "./types.js";
export { COMPONENT_APIS } from "./components.js";
export { HOOK_APIS } from "./hooks.js";
export { UTILITY_APIS } from "./utilities.js";
export { TYPE_APIS } from "./api-types.js";
export { ALL_APIS } from "./registry.js";
export { PATTERNS } from "./patterns.js";
export { TEMPLATES } from "./templates.js";
export { V12_MIGRATION } from "./migration.js";
```

- [ ] **Step 3: Commit**

```bash
git add src/data/registry.ts src/data/index.ts
git commit -m "refactor: add API registry and data barrel export"
```

---

### Task 8: Create `src/tools/` — one file per tool

**Files:**
- Create: `src/tools/list-apis.ts` — Source: `src/index.ts:27-64`
- Create: `src/tools/get-api.ts` — Source: `src/index.ts:66-97`
- Create: `src/tools/search-docs.ts` — Source: `src/index.ts:99-142`
- Create: `src/tools/get-examples.ts` — Source: `src/index.ts:144-174`
- Create: `src/tools/get-pattern.ts` — Source: `src/index.ts:176-203`
- Create: `src/tools/get-template.ts` — Source: `src/index.ts:205-227`
- Create: `src/tools/get-migration-guide.ts` — Source: `src/index.ts:229-239`
- Create: `src/tools/generate-flow.ts` — Source: `src/index.ts:241-475`
- Create: `src/tools/cheatsheet.ts` — Source: `src/index.ts:477-583`
- Create: `src/tools/index.ts` — barrel that registers all tools

- [ ] **Step 1: Create each tool file**

Each tool file follows this pattern:

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, searchApis, getApiByName, capitalize } from "../data/index.js";

export function register(server: McpServer): void {
  server.tool(
    "tool_name",
    "description",
    { /* schema */ },
    async (args) => { /* handler */ },
  );
}
```

**Important:** The helper functions `searchApis`, `getApiByName`, `getExamplesByCategory` were changed in Task 1 to accept `allApis` as a parameter. Each tool must pass `ALL_APIS` to these functions:
```ts
const results = searchApis(query, ALL_APIS);
const api = getApiByName(name, ALL_APIS);
const examples = getExamplesByCategory(category, ALL_APIS);
```

- [ ] **Step 2: Create tools/index.ts barrel**

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { register as listApis } from "./list-apis.js";
import { register as getApi } from "./get-api.js";
import { register as searchDocs } from "./search-docs.js";
import { register as getExamples } from "./get-examples.js";
import { register as getPattern } from "./get-pattern.js";
import { register as getTemplate } from "./get-template.js";
import { register as getMigrationGuide } from "./get-migration-guide.js";
import { register as generateFlow } from "./generate-flow.js";
import { register as cheatsheet } from "./cheatsheet.js";

export function registerAll(server: McpServer): void {
  listApis(server);
  getApi(server);
  searchDocs(server);
  getExamples(server);
  getPattern(server);
  getTemplate(server);
  getMigrationGuide(server);
  generateFlow(server);
  cheatsheet(server);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/tools/
git commit -m "refactor: extract tools into individual modules"
```

---

### Task 9: Rewrite `src/index.ts` as thin bootstrap

**Files:**
- Modify: `src/index.ts` (replace entire contents)
- Delete: `src/data.ts` (old monolith)

- [ ] **Step 1: Replace src/index.ts**

```ts
#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAll } from "./tools/index.js";

const server = new McpServer({
  name: "reactflow-mcp",
  version: "1.0.0",
});

registerAll(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Delete old data.ts**

```bash
rm src/data.ts
```

- [ ] **Step 3: Build and verify**

Run: `npx tsc`
Expected: clean build, no errors

- [ ] **Step 4: Test server responds correctly**

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node dist/index.js 2>/dev/null
```

Expected: 8 tools listed, same as before.

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"list_apis","arguments":{"kind":"all"}}}' | node dist/index.js 2>/dev/null
```

Expected: 56 APIs listed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: replace monolithic src/ with modular structure"
```

---

### Task 10: Final verification and push

- [ ] **Step 1: Clean build**

```bash
rm -rf dist && npx tsc
```

- [ ] **Step 2: Run full integration test**

Test each tool responds correctly:
```bash
# Test list_apis
echo '...' | node dist/index.js

# Test get_api
echo '...' | node dist/index.js

# Test get_pattern
echo '...' | node dist/index.js

# Test generate_flow
echo '...' | node dist/index.js
```

- [ ] **Step 3: Push**

```bash
git push
```

- [ ] **Step 4: Verify CI passes**

```bash
gh run list --repo orkait/reactflow-mcp-server --limit 1
```

Expected: CI status `success`
