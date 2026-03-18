#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  ALL_APIS,
  API_KINDS,
  CATEGORIES,
  PATTERNS,
  PATTERN_SECTIONS,
  TEMPLATES,
  V12_MIGRATION,
  searchApis,
  getApiByName,
  getExamplesByCategory,
  formatApiReference,
  formatExample,
  capitalize,
} from "./data.js";

const server = new McpServer({
  name: "reactflow-mcp",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: list_apis
// ---------------------------------------------------------------------------
server.tool(
  "list_apis",
  "List all React Flow v12 APIs — components, hooks, utilities, and types",
  {
    kind: z
      .enum(["all", "component", "hook", "utility", "type"] as const)
      .optional()
      .describe("Filter by API kind: component, hook, utility, type"),
  },
  async ({ kind }) => {
    const apis =
      kind && kind !== "all"
        ? ALL_APIS.filter((a) => a.kind === kind)
        : ALL_APIS;

    const grouped: Record<string, string[]> = {};
    for (const api of apis) {
      const k = api.kind;
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(`${api.name} — ${api.description.split(".")[0]}`);
    }

    let text = "# React Flow v12 — API Reference\n\n";
    text += `Import from \`@xyflow/react\`\n\n`;
    for (const [kind, items] of Object.entries(grouped)) {
      text += `## ${capitalize(kind)}s (${items.length})\n`;
      for (const item of items) {
        text += `- ${item}\n`;
      }
      text += "\n";
    }
    text += `\n**Total:** ${apis.length} APIs`;
    return { content: [{ type: "text", text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_api
// ---------------------------------------------------------------------------
server.tool(
  "get_api",
  "Get detailed API reference for a specific React Flow component, hook, utility, or type. Includes props, usage, examples, and tips.",
  {
    name: z
      .string()
      .describe(
        "API name (e.g., 'ReactFlow', 'useReactFlow', 'Handle', 'addEdge', 'Node', 'Edge', 'NodeProps')",
      ),
  },
  async ({ name }) => {
    const api = getApiByName(name);
    if (!api) {
      const suggestions = searchApis(name)
        .slice(0, 5)
        .map((r) => r.api.name);
      return {
        content: [
          {
            type: "text",
            text: `API "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nAvailable APIs: ${ALL_APIS.map((a) => a.name).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: formatApiReference(api) }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: search_docs
// ---------------------------------------------------------------------------
server.tool(
  "search_docs",
  "Search React Flow documentation by keyword. Searches API names, descriptions, code examples, and tips.",
  {
    query: z
      .string()
      .describe(
        "Search query (e.g., 'custom node', 'drag and drop', 'viewport zoom', 'edge reconnect', 'zustand')",
      ),
  },
  async ({ query }) => {
    const results = searchApis(query);
    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results for "${query}". Try broader terms.\n\nAvailable categories: ${CATEGORIES.join(", ")}\nAvailable patterns: ${PATTERN_SECTIONS.join(", ")}`,
          },
        ],
      };
    }

    let text = `# Search results for "${query}"\n\n`;
    text += `Found ${results.length} API(s):\n\n`;
    for (const { api, matchingExamples } of results.slice(0, 10)) {
      text += `## ${api.name} (${api.kind})\n`;
      text += `${api.description}\n`;
      text += `Import: \`${api.importPath}\`\n\n`;

      if (matchingExamples.length > 0) {
        text += "**Relevant examples:**\n";
        for (const ex of matchingExamples.slice(0, 3)) {
          text += formatExample(ex);
        }
      }
      text += "---\n\n";
    }
    return { content: [{ type: "text", text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_examples
// ---------------------------------------------------------------------------
server.tool(
  "get_examples",
  "Get code examples for a specific React Flow category",
  {
    category: z
      .string()
      .describe(`Category: ${CATEGORIES.join(", ")}`),
  },
  async ({ category }) => {
    const examples = getExamplesByCategory(category);
    if (examples.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No examples for category "${category}". Available: ${CATEGORIES.join(", ")}`,
          },
        ],
      };
    }

    let text = `# ${capitalize(category)} Examples\n\n`;
    for (const ex of examples) {
      text += formatExample(ex, 2);
    }
    return { content: [{ type: "text", text }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_pattern
// ---------------------------------------------------------------------------
server.tool(
  "get_pattern",
  "Get an enterprise React Flow pattern with full implementation code. Patterns include store architecture, undo/redo, drag-and-drop, auto-layout, context menus, copy/paste, save/restore, DAG validation, keyboard shortcuts, performance, dark mode, SSR, subflows, edge reconnection, and more.",
  {
    pattern: z
      .string()
      .describe(`Pattern name: ${PATTERN_SECTIONS.join(", ")}`),
  },
  async ({ pattern }) => {
    const key = pattern.toLowerCase().trim() as typeof PATTERN_SECTIONS[number];
    const content = PATTERNS[key];
    if (!content) {
      return {
        content: [
          {
            type: "text",
            text: `Pattern "${pattern}" not found. Available patterns:\n${PATTERN_SECTIONS.map((p) => `- ${p}`).join("\n")}`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: content }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_template
// ---------------------------------------------------------------------------
server.tool(
  "get_template",
  "Get a production-ready code template: custom-node (Tailwind + toolbar + handles + status), custom-edge (delete button + BaseEdge), or zustand-store (full store with selectors)",
  {
    template: z
      .enum(["custom-node", "custom-edge", "zustand-store"] as const)
      .describe("Template name"),
  },
  async ({ template }) => {
    const code = TEMPLATES[template];
    return {
      content: [
        {
          type: "text",
          text: `# ${capitalize(template.replace(/-/g, " "))} Template\n\n\`\`\`tsx\n${code}\n\`\`\``,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Tool: get_migration_guide
// ---------------------------------------------------------------------------
server.tool(
  "get_migration_guide",
  "Get the React Flow v11 to v12 migration guide with all breaking changes, import changes, and type changes",
  {},
  async () => {
    return { content: [{ type: "text", text: V12_MIGRATION }] };
  },
);

// ---------------------------------------------------------------------------
// Tool: generate_flow
// ---------------------------------------------------------------------------
server.tool(
  "generate_flow",
  "Generate a React Flow component from a natural-language description. Returns ready-to-use TSX with proper imports.",
  {
    description: z
      .string()
      .describe(
        "Describe the flow you want (e.g., 'simple two-node flow with drag and drop sidebar', 'DAG pipeline editor with custom nodes', 'mind map with auto layout', 'workflow builder with undo/redo')",
      ),
    controlled: z
      .boolean()
      .optional()
      .describe("Use controlled flow with Zustand store (default: true)"),
  },
  async ({ description, controlled }) => {
    const useStore = controlled !== false;
    const desc = description.toLowerCase();

    const imports = new Set(["ReactFlow"]);
    const xyflowImports = new Set<string>();
    const extraImports: string[] = [];
    let storeCode = "";
    let beforeReturn = "";
    let flowProps: string[] = ["nodes={nodes}", "edges={edges}", "fitView"];
    let children = "";
    let wrapperStart = "";
    let wrapperEnd = "";
    let additionalComponents = "";

    // Always need Background
    imports.add("Background");
    children += "        <Background />\n";

    // Controls
    if (!desc.includes("no controls")) {
      imports.add("Controls");
      children += "        <Controls />\n";
    }

    // MiniMap
    if (desc.includes("minimap") || desc.includes("overview") || desc.includes("mini map")) {
      imports.add("MiniMap");
      children += "        <MiniMap />\n";
    }

    // Custom nodes
    if (desc.includes("custom node") || desc.includes("custom-node")) {
      imports.add("Handle");
      imports.add("Position");
      additionalComponents += `
type CustomNodeData = { label: string };
type CustomNodeType = Node<CustomNodeData, 'custom'>;

const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeType>) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div className={\`px-4 py-2 rounded border shadow-sm bg-white \${selected ? 'border-blue-500' : 'border-gray-200'}\`}>
      {data.label}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
));
CustomNode.displayName = 'CustomNode';

const nodeTypes = { custom: CustomNode };
`;
      extraImports.push("import { memo } from 'react';");
      xyflowImports.add("type NodeProps");
      xyflowImports.add("type Node");
      flowProps.push("nodeTypes={nodeTypes}");
    }

    // Drag and drop
    if (desc.includes("drag") && desc.includes("drop") || desc.includes("sidebar")) {
      xyflowImports.add("useReactFlow");
      beforeReturn += `
  const { screenToFlowPosition, addNodes } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addNodes({ id: crypto.randomUUID(), type, position, data: { label: 'New Node' } });
  }, [screenToFlowPosition, addNodes]);
`;
      extraImports.push("import { useCallback } from 'react';");
      flowProps.push("onDragOver={onDragOver}", "onDrop={onDrop}");
    }

    // Dark mode
    if (desc.includes("dark")) {
      flowProps.push('colorMode="dark"');
    }

    // Connection validation
    if (desc.includes("dag") || desc.includes("cycle") || desc.includes("pipeline")) {
      xyflowImports.add("getOutgoers");
      xyflowImports.add("useReactFlow");
      beforeReturn += `
  const { getNodes, getEdges } = useReactFlow();

  const isValidConnection = useCallback((connection: Connection) => {
    const allNodes = getNodes();
    const allEdges = getEdges();
    const target = allNodes.find((n) => n.id === connection.target);
    const source = allNodes.find((n) => n.id === connection.source);
    if (!target || !source) return false;
    // Prevent cycles
    const hasCycle = (node: Node, visited = new Set<string>()): boolean => {
      if (visited.has(node.id)) return false;
      visited.add(node.id);
      if (node.id === source.id) return true;
      for (const outgoer of getOutgoers(node, allNodes, allEdges)) {
        if (hasCycle(outgoer, visited)) return true;
      }
      return false;
    };
    return !hasCycle(target);
  }, [getNodes, getEdges]);
`;
      xyflowImports.add("type Connection");
      xyflowImports.add("type Node");
      extraImports.push("import { useCallback } from 'react';");
      flowProps.push("isValidConnection={isValidConnection}");
    }

    // Store vs useState
    if (useStore) {
      flowProps.push(
        "onNodesChange={onNodesChange}",
        "onEdgesChange={onEdgesChange}",
        "onConnect={onConnect}",
      );
      storeCode = `
// --- store.ts ---
import { create } from 'zustand';
import { type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'Node 2' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];

type FlowState = {
  nodes: Node[]; edges: Edge[];
  onNodesChange: OnNodesChange; onEdgesChange: OnEdgesChange; onConnect: OnConnect;
};

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
}));

const selector = (s: FlowState) => s;
export { useFlowStore, selector };
`;
      beforeReturn =
        `  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector);\n` +
        beforeReturn;
      extraImports.push("import { useFlowStore, selector } from './store';");
    } else {
      imports.add("useNodesState");
      imports.add("useEdgesState");
      imports.add("addEdge");
      extraImports.push("import { useCallback } from 'react';");
      beforeReturn =
        `  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: '2', position: { x: 250, y: 100 }, data: { label: 'Node 2' } },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'e1-2', source: '1', target: '2' },
  ]);
  const onConnect = useCallback((conn) => setEdges((eds) => addEdge(conn, eds)), [setEdges]);
` + beforeReturn;
      flowProps.push(
        "onNodesChange={onNodesChange}",
        "onEdgesChange={onEdgesChange}",
        "onConnect={onConnect}",
      );
    }

    // Provider wrapper needed for useReactFlow
    if (xyflowImports.has("useReactFlow")) {
      imports.add("ReactFlowProvider");
      wrapperStart = `function FlowWrapper() {\n  return (\n    <ReactFlowProvider>\n      <Flow />\n    </ReactFlowProvider>\n  );\n}\n\n`;
      wrapperEnd = `\nexport default FlowWrapper;`;
    } else {
      wrapperEnd = `\nexport default Flow;`;
    }

    // Build imports (deduplicate)
    const allXyImports = [...imports, ...xyflowImports];
    const uniqueExtraImports = [...new Set(extraImports)];
    let code = `import { ${allXyImports.join(", ")} } from '@xyflow/react';\nimport '@xyflow/react/dist/style.css';\n`;
    for (const imp of uniqueExtraImports) {
      code += `${imp}\n`;
    }

    if (storeCode) {
      code += `\n/*\n${storeCode}*/\n`;
    }

    if (additionalComponents) {
      code += additionalComponents;
    }

    code += `\n${wrapperStart}function Flow() {\n${beforeReturn}\n  return (\n    <div style={{ width: '100%', height: '100vh' }}>\n      <ReactFlow\n        ${flowProps.join("\n        ")}\n      >\n${children}      </ReactFlow>\n    </div>\n  );\n}${wrapperEnd}`;

    return {
      content: [
        {
          type: "text",
          text: `\`\`\`tsx\n${code}\n\`\`\`\n\nCustomize the node types, edge types, and initial data as needed.`,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Resource: cheatsheet
// ---------------------------------------------------------------------------
server.resource(
  "cheatsheet",
  "reactflow://cheatsheet",
  {
    description: "React Flow v12 quick reference cheatsheet",
    mimeType: "text/markdown",
  },
  async () => {
    const text = `# React Flow v12 — Cheatsheet

## Install & Import
\`\`\`bash
npm install @xyflow/react zustand
\`\`\`
\`\`\`tsx
import { ReactFlow, Background, Controls, MiniMap, Handle, Position,
  useReactFlow, useNodesState, useEdgesState, addEdge,
  applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
\`\`\`

## Minimal Flow
\`\`\`tsx
const nodes = [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Hello' } }];
const edges = [{ id: 'e1-2', source: '1', target: '2' }];

<div style={{ width: '100%', height: '100vh' }}>
  <ReactFlow nodes={nodes} edges={edges} fitView>
    <Background /> <Controls />
  </ReactFlow>
</div>
\`\`\`

## Custom Node
\`\`\`tsx
type MyNode = Node<{ label: string }, 'myNode'>;

function MyNode({ data }: NodeProps<MyNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
const nodeTypes = { myNode: MyNode }; // define OUTSIDE component
\`\`\`

## Controlled Flow (Zustand)
\`\`\`tsx
const useStore = create((set, get) => ({
  nodes: [], edges: [],
  onNodesChange: (c) => set({ nodes: applyNodeChanges(c, get().nodes) }),
  onEdgesChange: (c) => set({ edges: applyEdgeChanges(c, get().edges) }),
  onConnect: (conn) => set({ edges: addEdge(conn, get().edges) }),
}));
\`\`\`

## Key Hooks
| Hook | Use |
|------|-----|
| \`useReactFlow()\` | Imperative API — getNodes, setNodes, fitView, screenToFlowPosition |
| \`useNodesState()\` | Quick prototyping — [nodes, setNodes, onNodesChange] |
| \`useNodesData(ids)\` | Subscribe to specific node data changes |
| \`useConnection()\` | Active connection state during drag |
| \`useNodesInitialized()\` | Wait for all nodes to be measured |

## Node Types
- \`"default"\` — both handles
- \`"input"\` — source handle only
- \`"output"\` — target handle only
- \`"group"\` — container for sub-flows

## Edge Types
- \`"default"\` — bezier curve
- \`"straight"\` — straight line
- \`"step"\` — right-angle steps
- \`"smoothstep"\` — rounded steps
- \`"simplebezier"\` — simple curve

## CSS Classes
- \`nodrag\` — prevent drag on elements inside nodes
- \`nopan\` — prevent pan when clicking element
- \`nowheel\` — prevent zoom on scroll

## v12 Key Changes (from v11)
- Package: \`reactflow\` → \`@xyflow/react\`
- Import: default → named exports
- \`node.width\` → \`node.measured.width\`
- \`project()\` → \`screenToFlowPosition()\`
- \`onEdgeUpdate\` → \`onReconnect\`
`;
    return {
      contents: [
        {
          uri: "reactflow://cheatsheet",
          mimeType: "text/markdown",
          text,
        },
      ],
    };
  },
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start MCP server:", err);
  process.exit(1);
});
