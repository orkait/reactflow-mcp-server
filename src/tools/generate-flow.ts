import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function register(server: McpServer): void {
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
}
