import type { ApiEntry } from "./types.js";

const useReactFlowHook: ApiEntry = {
  name: "useReactFlow",
  kind: "hook",
  description:
    "Returns a ReactFlowInstance to update nodes/edges, manipulate the viewport, or query flow state. Does NOT cause re-renders on state changes.",
  importPath: "import { useReactFlow } from '@xyflow/react'",
  returns: "ReactFlowInstance",
  usage: `const { getNodes, setNodes, addNodes, getEdges, setEdges, addEdges,
  fitView, zoomIn, zoomOut, getViewport, setViewport,
  screenToFlowPosition, deleteElements, updateNode, updateNodeData,
  getIntersectingNodes, toObject } = useReactFlow();`,
  examples: [
    {
      title: "Add node on button click",
      category: "interaction",
      code: `function AddNodeButton() {
  const { addNodes, screenToFlowPosition } = useReactFlow();
  const onClick = () => {
    addNodes({
      id: crypto.randomUUID(),
      position: screenToFlowPosition({ x: 200, y: 200 }),
      data: { label: 'New Node' },
    });
  };
  return <button onClick={onClick}>Add Node</button>;
}`,
    },
    {
      title: "Delete selected elements",
      category: "interaction",
      code: `function DeleteButton() {
  const { deleteElements, getNodes, getEdges } = useReactFlow();
  const onClick = async () => {
    const selectedNodes = getNodes().filter((n) => n.selected);
    const selectedEdges = getEdges().filter((e) => e.selected);
    await deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  };
  return <button onClick={onClick}>Delete Selected</button>;
}`,
    },
  ],
  tips: [
    "Must be used inside <ReactFlowProvider> or <ReactFlow>.",
    "Unlike useNodes/useEdges, this hook won't cause re-renders on state changes. Query state on demand.",
    "Pass useReactFlow() as dependency to useCallback/useEffect — it's not initialized on first render.",
  ],
  relatedApis: ["ReactFlowProvider", "ReactFlowInstance", "useNodes", "useEdges"],
};

const useNodesStateHook: ApiEntry = {
  name: "useNodesState",
  kind: "hook",
  description:
    "Like React's useState but with a built-in change handler for nodes. Quick prototyping of controlled flows without Zustand.",
  importPath: "import { useNodesState } from '@xyflow/react'",
  returns: "[Node[], setNodes, onNodesChange]",
  usage: `const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

<ReactFlow nodes={nodes} onNodesChange={onNodesChange} />`,
  examples: [
    {
      title: "Minimal controlled flow",
      category: "quickstart",
      code: `import { ReactFlow, useNodesState, useEdgesState, addEdge } from '@xyflow/react';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'B' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
      onConnect={onConnect} fitView
    />
  );
}`,
    },
  ],
  tips: ["For production apps with complex state, prefer Zustand with applyNodeChanges/applyEdgeChanges."],
  relatedApis: ["useEdgesState", "applyNodeChanges", "ReactFlow"],
};

const useEdgesStateHook: ApiEntry = {
  name: "useEdgesState",
  kind: "hook",
  description:
    "Like React's useState but with a built-in change handler for edges. Quick prototyping of controlled flows without Zustand.",
  importPath: "import { useEdgesState } from '@xyflow/react'",
  returns: "[Edge[], setEdges, onEdgesChange]",
  usage: `const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);`,
  examples: [],
  relatedApis: ["useNodesState", "applyEdgeChanges", "addEdge"],
};

const useNodesHook: ApiEntry = {
  name: "useNodes",
  kind: "hook",
  description:
    "Returns the current nodes array. Components using this hook re-render whenever ANY node changes (position, selection, etc).",
  importPath: "import { useNodes } from '@xyflow/react'",
  returns: "Node[]",
  usage: `const nodes = useNodes();`,
  examples: [],
  tips: ["Can cause excessive re-renders. Prefer useReactFlow().getNodes() for on-demand access, or useNodesData for specific node data."],
  relatedApis: ["useEdges", "useReactFlow", "useNodesData"],
};

const useEdgesHook: ApiEntry = {
  name: "useEdges",
  kind: "hook",
  description:
    "Returns the current edges array. Components using this hook re-render whenever any edge changes.",
  importPath: "import { useEdges } from '@xyflow/react'",
  returns: "Edge[]",
  usage: `const edges = useEdges();`,
  examples: [],
  tips: ["Can cause excessive re-renders. Prefer useReactFlow().getEdges() for on-demand access."],
  relatedApis: ["useNodes", "useReactFlow"],
};

const useNodesDataHook: ApiEntry = {
  name: "useNodesData",
  kind: "hook",
  description:
    "Subscribe to data changes of specific nodes by ID. More efficient than useNodes when you only need certain nodes' data.",
  importPath: "import { useNodesData } from '@xyflow/react'",
  returns: "Pick<Node, 'id' | 'data' | 'type'>[]",
  usage: `const nodesData = useNodesData(['node-1', 'node-2']);
// or single node:
const nodeData = useNodesData('node-1');`,
  examples: [
    {
      title: "Display connected node data",
      category: "custom-nodes",
      code: `function DisplayNode({ id }) {
  const connections = useHandleConnections({ type: 'target' });
  const sourceIds = connections.map((c) => c.source);
  const sourcesData = useNodesData(sourceIds);

  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <div>Connected sources: {sourcesData.map((d) => d.data.label).join(', ')}</div>
    </div>
  );
}`,
    },
  ],
  relatedApis: ["useNodes", "useHandleConnections", "useNodeConnections"],
};

const useNodeIdHook: ApiEntry = {
  name: "useNodeId",
  kind: "hook",
  description:
    "Returns the ID of the node it is used inside. Useful deep in the render tree without prop drilling.",
  importPath: "import { useNodeId } from '@xyflow/react'",
  returns: "string | null",
  usage: `function DeepChildComponent() {
  const nodeId = useNodeId();
  return <span>Node: {nodeId}</span>;
}`,
  examples: [],
  relatedApis: ["useInternalNode", "useNodesData"],
};

const useConnectionHook: ApiEntry = {
  name: "useConnection",
  kind: "hook",
  description:
    "Returns the current connection state during an active connection interaction. Returns null properties when no connection is active. Useful for colorizing handles based on validity.",
  importPath: "import { useConnection } from '@xyflow/react'",
  returns: "ConnectionState",
  usage: `const connection = useConnection();
// connection.inProgress, connection.fromNode, connection.fromHandle, etc.`,
  examples: [
    {
      title: "Colorize handle during connection",
      category: "connections",
      code: `function CustomHandle({ type, position, id }) {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode?.id !== useNodeId();

  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={{ background: isTarget ? '#22c55e' : '#6b7280' }}
    />
  );
}`,
    },
  ],
  relatedApis: ["useHandleConnections", "Handle"],
};

const useHandleConnectionsHook: ApiEntry = {
  name: "useHandleConnections",
  kind: "hook",
  description:
    "Returns an array of connections for a specific handle. Re-renders when edge changes affect the handle.",
  importPath: "import { useHandleConnections } from '@xyflow/react'",
  returns: "HandleConnection[]",
  usage: `const connections = useHandleConnections({ type: 'target', id: 'my-handle' });`,
  examples: [],
  relatedApis: ["useNodeConnections", "useConnection", "Handle"],
};

const useNodeConnectionsHook: ApiEntry = {
  name: "useNodeConnections",
  kind: "hook",
  description: "Returns an array of connections for a node. Can filter by handle type and ID.",
  importPath: "import { useNodeConnections } from '@xyflow/react'",
  returns: "NodeConnection[]",
  usage: `const connections = useNodeConnections({ type: 'target', handleId: 'input-a' });`,
  examples: [],
  relatedApis: ["useHandleConnections", "useConnection"],
};

const useOnSelectionChangeHook: ApiEntry = {
  name: "useOnSelectionChange",
  kind: "hook",
  description: "Listen for changes to both node and edge selection.",
  importPath: "import { useOnSelectionChange } from '@xyflow/react'",
  usage: `useOnSelectionChange({
  onChange: ({ nodes, edges }) => {
    console.log('Selected nodes:', nodes);
    console.log('Selected edges:', edges);
  },
});`,
  examples: [],
  relatedApis: ["useReactFlow", "ReactFlow"],
};

const useOnViewportChangeHook: ApiEntry = {
  name: "useOnViewportChange",
  kind: "hook",
  description:
    "Listen for viewport changes (pan, zoom). Provides callbacks for start, change, and end phases.",
  importPath: "import { useOnViewportChange } from '@xyflow/react'",
  usage: `useOnViewportChange({
  onStart: (viewport) => console.log('move start', viewport),
  onChange: (viewport) => console.log('moving', viewport),
  onEnd: (viewport) => console.log('move end', viewport),
});`,
  examples: [],
  relatedApis: ["useViewport", "useReactFlow"],
};

const useViewportHook: ApiEntry = {
  name: "useViewport",
  kind: "hook",
  description: "Returns the current viewport { x, y, zoom }. Re-renders on every viewport change.",
  importPath: "import { useViewport } from '@xyflow/react'",
  returns: "Viewport",
  usage: `const { x, y, zoom } = useViewport();`,
  examples: [],
  tips: ["Causes re-render on every pan/zoom. Use useOnViewportChange for event-based approach, or useReactFlow().getViewport() for on-demand."],
  relatedApis: ["useOnViewportChange", "useReactFlow"],
};

const useStoreHook: ApiEntry = {
  name: "useStore",
  kind: "hook",
  description:
    "Subscribe to internal React Flow Zustand store. Re-exported from Zustand. Use selectors to minimize re-renders.",
  importPath: "import { useStore } from '@xyflow/react'",
  usage: `const nodes = useStore((state) => state.nodes);
const zoom = useStore((state) => state.transform[2]);`,
  examples: [],
  tips: ["Always use a selector function to avoid re-rendering on every state change.", "For most use cases, prefer useReactFlow, useNodes, or useEdges instead."],
  relatedApis: ["useStoreApi", "useReactFlow"],
};

const useStoreApiHook: ApiEntry = {
  name: "useStoreApi",
  kind: "hook",
  description:
    "Returns the Zustand store object directly for on-demand state access without causing re-renders.",
  importPath: "import { useStoreApi } from '@xyflow/react'",
  returns: "StoreApi",
  usage: `const store = useStoreApi();
// Access state on demand:
const nodes = store.getState().nodes;`,
  examples: [],
  relatedApis: ["useStore", "useReactFlow"],
};

const useNodesInitializedHook: ApiEntry = {
  name: "useNodesInitialized",
  kind: "hook",
  description:
    "Returns whether all nodes have been measured and given width/height. Returns false when new nodes are added, then true once measured.",
  importPath: "import { useNodesInitialized } from '@xyflow/react'",
  returns: "boolean",
  usage: `const initialized = useNodesInitialized();

useEffect(() => {
  if (initialized) {
    // Safe to run layout algorithms or fitView
  }
}, [initialized]);`,
  examples: [
    {
      title: "Auto-layout on mount",
      category: "layout",
      code: `function LayoutFlow() {
  const { fitView } = useReactFlow();
  const initialized = useNodesInitialized();

  useEffect(() => {
    if (initialized) {
      // Run Dagre/ELK layout here, then fitView
      fitView({ duration: 300 });
    }
  }, [initialized, fitView]);

  return <ReactFlow nodes={nodes} edges={edges} />;
}`,
    },
  ],
  relatedApis: ["useReactFlow"],
};

const useUpdateNodeInternalsHook: ApiEntry = {
  name: "useUpdateNodeInternals",
  kind: "hook",
  description:
    "Notify React Flow when you programmatically add/remove handles or change handle positions on a node.",
  importPath: "import { useUpdateNodeInternals } from '@xyflow/react'",
  returns: "(nodeId: string | string[]) => void",
  usage: `const updateNodeInternals = useUpdateNodeInternals();
// After modifying handles:
updateNodeInternals('node-1');`,
  examples: [],
  tips: ["Call this after dynamically adding/removing Handle components inside a custom node."],
  relatedApis: ["Handle"],
};

const useKeyPressHook: ApiEntry = {
  name: "useKeyPress",
  kind: "hook",
  description: "Listen for specific key codes and returns whether they are currently pressed.",
  importPath: "import { useKeyPress } from '@xyflow/react'",
  returns: "boolean",
  usage: `const shiftPressed = useKeyPress('Shift');
const ctrlZ = useKeyPress(['Control+z', 'Meta+z']);`,
  examples: [],
  relatedApis: ["ReactFlow"],
};

const useInternalNodeHook: ApiEntry = {
  name: "useInternalNode",
  kind: "hook",
  description: "Returns an InternalNode object with additional computed properties like positionAbsolute and measured dimensions.",
  importPath: "import { useInternalNode } from '@xyflow/react'",
  returns: "InternalNode | undefined",
  usage: `const internalNode = useInternalNode('node-1');
// internalNode.internals.positionAbsolute, internalNode.measured.width, etc.`,
  examples: [],
  relatedApis: ["useReactFlow", "useNodeId"],
};

export const HOOK_APIS: ApiEntry[] = [
  useReactFlowHook,
  useNodesStateHook,
  useEdgesStateHook,
  useNodesHook,
  useEdgesHook,
  useNodesDataHook,
  useNodeIdHook,
  useConnectionHook,
  useHandleConnectionsHook,
  useNodeConnectionsHook,
  useOnSelectionChangeHook,
  useOnViewportChangeHook,
  useViewportHook,
  useStoreHook,
  useStoreApiHook,
  useNodesInitializedHook,
  useUpdateNodeInternalsHook,
  useKeyPressHook,
  useInternalNodeHook,
];
