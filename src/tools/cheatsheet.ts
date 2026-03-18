import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register(server: McpServer): void {
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
}
