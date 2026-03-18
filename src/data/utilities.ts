import type { ApiEntry } from "./types.js";

const addEdgeUtil: ApiEntry = {
  name: "addEdge",
  kind: "utility",
  description:
    "Convenience function to add a new edge to an array. Validates and prevents duplicates.",
  importPath: "import { addEdge } from '@xyflow/react'",
  returns: "Edge[]",
  usage: `const onConnect = useCallback(
  (connection) => setEdges((eds) => addEdge(connection, eds)),
  [setEdges],
);`,
  examples: [],
  relatedApis: ["ReactFlow", "useEdgesState"],
};

const applyNodeChangesUtil: ApiEntry = {
  name: "applyNodeChanges",
  kind: "utility",
  description:
    "Apply an array of NodeChange objects to your nodes array. Used in Zustand stores for controlled flows.",
  importPath: "import { applyNodeChanges } from '@xyflow/react'",
  returns: "Node[]",
  usage: `onNodesChange: (changes) => {
  set({ nodes: applyNodeChanges(changes, get().nodes) });
},`,
  examples: [],
  relatedApis: ["applyEdgeChanges", "useNodesState"],
};

const applyEdgeChangesUtil: ApiEntry = {
  name: "applyEdgeChanges",
  kind: "utility",
  description:
    "Apply an array of EdgeChange objects to your edges array. Used in Zustand stores for controlled flows.",
  importPath: "import { applyEdgeChanges } from '@xyflow/react'",
  returns: "Edge[]",
  usage: `onEdgesChange: (changes) => {
  set({ edges: applyEdgeChanges(changes, get().edges) });
},`,
  examples: [],
  relatedApis: ["applyNodeChanges", "useEdgesState"],
};

const getBezierPathUtil: ApiEntry = {
  name: "getBezierPath",
  kind: "utility",
  description: "Returns SVG path string and label position for a bezier edge between two points.",
  importPath: "import { getBezierPath } from '@xyflow/react'",
  returns: "[path: string, labelX: number, labelY: number, offsetX: number, offsetY: number]",
  usage: `const [edgePath, labelX, labelY] = getBezierPath({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  curvature: 0.25, // optional
});`,
  examples: [],
  relatedApis: ["getSmoothStepPath", "getStraightPath", "getSimpleBezierPath", "BaseEdge"],
};

const getSmoothStepPathUtil: ApiEntry = {
  name: "getSmoothStepPath",
  kind: "utility",
  description: "Returns SVG path string for a stepped/rounded edge with configurable border radius.",
  importPath: "import { getSmoothStepPath } from '@xyflow/react'",
  returns: "[path, labelX, labelY, offsetX, offsetY]",
  usage: `const [edgePath, labelX, labelY] = getSmoothStepPath({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  borderRadius: 8, // rounded corners
  offset: 25, // step offset
});`,
  examples: [],
  relatedApis: ["getBezierPath", "getStraightPath"],
};

const getStraightPathUtil: ApiEntry = {
  name: "getStraightPath",
  kind: "utility",
  description: "Calculates a straight line path between two points.",
  importPath: "import { getStraightPath } from '@xyflow/react'",
  returns: "[path, labelX, labelY]",
  usage: `const [edgePath, labelX, labelY] = getStraightPath({
  sourceX, sourceY, targetX, targetY,
});`,
  examples: [],
  relatedApis: ["getBezierPath", "getSmoothStepPath"],
};

const getSimpleBezierPathUtil: ApiEntry = {
  name: "getSimpleBezierPath",
  kind: "utility",
  description: "Returns SVG path for a simple bezier curve (less pronounced curve than getBezierPath).",
  importPath: "import { getSimpleBezierPath } from '@xyflow/react'",
  returns: "[path, labelX, labelY, offsetX, offsetY]",
  usage: `const [edgePath] = getSimpleBezierPath({
  sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
});`,
  examples: [],
  relatedApis: ["getBezierPath"],
};

const getConnectedEdgesUtil: ApiEntry = {
  name: "getConnectedEdges",
  kind: "utility",
  description: "Given nodes and all edges, returns edges that connect any of the given nodes together.",
  importPath: "import { getConnectedEdges } from '@xyflow/react'",
  returns: "Edge[]",
  usage: `const connected = getConnectedEdges(selectedNodes, allEdges);`,
  examples: [],
  relatedApis: ["getIncomers", "getOutgoers"],
};

const getIncomersUtil: ApiEntry = {
  name: "getIncomers",
  kind: "utility",
  description: "Returns nodes connected to the given node as the source of an edge (upstream nodes).",
  importPath: "import { getIncomers } from '@xyflow/react'",
  returns: "Node[]",
  usage: `const incomers = getIncomers(node, nodes, edges);`,
  examples: [],
  relatedApis: ["getOutgoers", "getConnectedEdges"],
};

const getOutgoersUtil: ApiEntry = {
  name: "getOutgoers",
  kind: "utility",
  description: "Returns nodes connected to the given node as the target of an edge (downstream nodes).",
  importPath: "import { getOutgoers } from '@xyflow/react'",
  returns: "Node[]",
  usage: `const outgoers = getOutgoers(node, nodes, edges);`,
  examples: [],
  relatedApis: ["getIncomers", "getConnectedEdges"],
};

const getNodesBoundsUtil: ApiEntry = {
  name: "getNodesBounds",
  kind: "utility",
  description: "Returns the bounding box containing all given nodes. Useful with getViewportForBounds.",
  importPath: "import { getNodesBounds } from '@xyflow/react'",
  returns: "Rect",
  usage: `const bounds = getNodesBounds(nodes);`,
  examples: [],
  relatedApis: ["getViewportForBounds"],
};

const getViewportForBoundsUtil: ApiEntry = {
  name: "getViewportForBounds",
  kind: "utility",
  description: "Returns the viewport to fit given bounds. Useful for server-side viewport calculation or custom fit-view logic.",
  importPath: "import { getViewportForBounds } from '@xyflow/react'",
  returns: "Viewport",
  usage: `const viewport = getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding);`,
  examples: [],
  relatedApis: ["getNodesBounds", "useReactFlow"],
};

const reconnectEdgeUtil: ApiEntry = {
  name: "reconnectEdge",
  kind: "utility",
  description: "Reconnect an existing edge with new source/target. Used in onReconnect handlers.",
  importPath: "import { reconnectEdge } from '@xyflow/react'",
  returns: "Edge[]",
  usage: `const onReconnect = useCallback((oldEdge, newConnection) => {
  setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
}, []);`,
  examples: [
    {
      title: "Edge reconnection",
      category: "connections",
      code: `<ReactFlow
  edgesReconnectable
  onReconnect={(oldEdge, newConnection) =>
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
  }
  onReconnectStart={() => setIsReconnecting(true)}
  onReconnectEnd={() => setIsReconnecting(false)}
/>`,
    },
  ],
  relatedApis: ["addEdge", "ReactFlow"],
};

const isNodeUtil: ApiEntry = {
  name: "isNode",
  kind: "utility",
  description: "Type guard to check if an object is a valid Node.",
  importPath: "import { isNode } from '@xyflow/react'",
  returns: "boolean",
  usage: `if (isNode(element)) { /* element is Node */ }`,
  examples: [],
  relatedApis: ["isEdge"],
};

const isEdgeUtil: ApiEntry = {
  name: "isEdge",
  kind: "utility",
  description: "Type guard to check if an object is a valid Edge.",
  importPath: "import { isEdge } from '@xyflow/react'",
  returns: "boolean",
  usage: `if (isEdge(element)) { /* element is Edge */ }`,
  examples: [],
  relatedApis: ["isNode"],
};

export const UTILITY_APIS: ApiEntry[] = [
  addEdgeUtil,
  applyNodeChangesUtil,
  applyEdgeChangesUtil,
  getBezierPathUtil,
  getSmoothStepPathUtil,
  getStraightPathUtil,
  getSimpleBezierPathUtil,
  getConnectedEdgesUtil,
  getIncomersUtil,
  getOutgoersUtil,
  getNodesBoundsUtil,
  getViewportForBoundsUtil,
  reconnectEdgeUtil,
  isNodeUtil,
  isEdgeUtil,
];
