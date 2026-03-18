import type { ApiEntry } from "./types.js";

const nodeType: ApiEntry = {
  name: "Node",
  kind: "type",
  description: "Represents a node in the flow. Contains position, data, type, dimensions, and behavior flags.",
  importPath: "import type { Node } from '@xyflow/react'",
  props: [
    { name: "id", type: "string", description: "Unique identifier." },
    { name: "position", type: "XYPosition", description: "{ x, y } position on the canvas." },
    { name: "data", type: "Record<string, unknown>", description: "Arbitrary data passed to the node component." },
    { name: "type", type: "string", description: "Node type matching a key in nodeTypes.", default: "'default'" },
    { name: "hidden", type: "boolean", description: "Hide the node." },
    { name: "selected", type: "boolean", description: "Selection state." },
    { name: "draggable", type: "boolean", description: "Override global draggable setting." },
    { name: "selectable", type: "boolean", description: "Override global selectable setting." },
    { name: "connectable", type: "boolean", description: "Override global connectable setting." },
    { name: "deletable", type: "boolean", description: "Override global deletable setting." },
    { name: "parentId", type: "string", description: "Parent node ID for subflows/groups." },
    { name: "extent", type: "CoordinateExtent | 'parent'", description: "Movement boundary. 'parent' constrains to parent node." },
    { name: "expandParent", type: "boolean", description: "Auto-expand parent when dragged to edge." },
    { name: "zIndex", type: "number", description: "Z-index for rendering order." },
    { name: "style", type: "CSSProperties", description: "Inline CSS styles." },
    { name: "className", type: "string", description: "CSS class name." },
    { name: "dragHandle", type: "string", description: "CSS selector for drag handle elements within the node." },
    { name: "origin", type: "NodeOrigin", description: "Origin point [0-1, 0-1] for positioning.", default: "[0, 0]" },
    { name: "measured", type: "{ width?: number; height?: number }", description: "Read-only measured dimensions." },
  ],
  usage: `const node: Node = {
  id: '1',
  type: 'custom',
  position: { x: 100, y: 200 },
  data: { label: 'My Node', status: 'active' },
};`,
  examples: [
    {
      title: "Typed custom node data",
      category: "custom-nodes",
      code: `type MyNodeData = { label: string; status: 'active' | 'inactive' };
type MyNode = Node<MyNodeData, 'statusNode'>;

const node: MyNode = {
  id: '1',
  type: 'statusNode',
  position: { x: 0, y: 0 },
  data: { label: 'Server', status: 'active' },
};`,
    },
  ],
  tips: [
    "Don't set width/height directly — use style or className for sizing.",
    "v12: measured dimensions are at node.measured.width, not node.width.",
    "Default node types: 'default' (both handles), 'input' (source only), 'output' (target only), 'group' (container).",
  ],
  relatedApis: ["Edge", "NodeProps", "Handle"],
};

const edgeType: ApiEntry = {
  name: "Edge",
  kind: "type",
  description: "Complete description of an edge between two nodes with rendering properties.",
  importPath: "import type { Edge } from '@xyflow/react'",
  props: [
    { name: "id", type: "string", description: "Unique identifier." },
    { name: "source", type: "string", description: "Source node ID." },
    { name: "target", type: "string", description: "Target node ID." },
    { name: "sourceHandle", type: "string | null", description: "Source handle ID (if multiple handles)." },
    { name: "targetHandle", type: "string | null", description: "Target handle ID (if multiple handles)." },
    { name: "type", type: "string", description: "Edge type matching edgeTypes.", default: "'default'" },
    { name: "animated", type: "boolean", description: "Animated dashed edge." },
    { name: "label", type: "ReactNode", description: "Label content on the edge." },
    { name: "labelStyle", type: "CSSProperties", description: "Label CSS styles." },
    { name: "style", type: "CSSProperties", description: "Edge SVG path styles." },
    { name: "hidden", type: "boolean", description: "Hide the edge." },
    { name: "selected", type: "boolean", description: "Selection state." },
    { name: "deletable", type: "boolean", description: "Override deletable setting." },
    { name: "selectable", type: "boolean", description: "Override selectable setting." },
    { name: "reconnectable", type: "boolean | HandleType", description: "Allow reconnecting this edge." },
    { name: "data", type: "Record<string, unknown>", description: "Arbitrary data for custom edges." },
    { name: "markerStart", type: "EdgeMarkerType", description: "Marker at edge start." },
    { name: "markerEnd", type: "EdgeMarkerType", description: "Marker at edge end." },
    { name: "zIndex", type: "number", description: "Z-index." },
    { name: "interactionWidth", type: "number", description: "Width of invisible click target.", default: "20" },
  ],
  usage: `const edge: Edge = {
  id: 'e1-2',
  source: '1',
  target: '2',
  type: 'smoothstep',
  animated: true,
  label: 'connects to',
};`,
  examples: [],
  tips: [
    "Default edge types: 'default' (bezier), 'straight', 'step', 'smoothstep', 'simplebezier'.",
    "SmoothStepEdge variant adds pathOptions: { offset, borderRadius }.",
    "BezierEdge variant adds pathOptions: { curvature }.",
  ],
  relatedApis: ["Node", "EdgeProps", "Connection"],
};

const nodePropsType: ApiEntry = {
  name: "NodeProps",
  kind: "type",
  description: "Props received by custom node components. Generic: NodeProps<NodeType extends Node = Node>. React Flow wraps your component and passes these.",
  importPath: "import type { NodeProps, Node } from '@xyflow/react'",
  props: [
    { name: "id", type: "NodeType['id']", description: "Unique node ID." },
    { name: "data", type: "NodeType['data']", description: "Node data object (typed from your Node generic)." },
    { name: "type", type: "NodeType['type']", description: "Node type." },
    { name: "selected", type: "boolean", description: "Whether node is selected." },
    { name: "isConnectable", type: "boolean", description: "Whether node is connectable." },
    { name: "zIndex", type: "number", description: "Current z-index." },
    { name: "positionAbsoluteX", type: "number", description: "Absolute X position." },
    { name: "positionAbsoluteY", type: "number", description: "Absolute Y position." },
    { name: "dragging", type: "boolean", description: "Whether node is being dragged." },
    { name: "draggable", type: "boolean", description: "Whether node is draggable." },
    { name: "selectable", type: "boolean", description: "Whether node is selectable." },
    { name: "deletable", type: "boolean", description: "Whether node is deletable." },
    { name: "dragHandle", type: "string", description: "CSS selector for drag handle." },
    { name: "parentId", type: "string", description: "Parent node ID." },
    { name: "width", type: "number", description: "Measured width." },
    { name: "height", type: "number", description: "Measured height." },
    { name: "sourcePosition", type: "Position", description: "Source handle position (default nodes only)." },
    { name: "targetPosition", type: "Position", description: "Target handle position (default nodes only)." },
  ],
  usage: `import type { NodeProps, Node } from '@xyflow/react';

// Step 1: Define your node type
type CounterNode = Node<{ initialCount?: number }, 'counter'>;

// Step 2: Use NodeProps<YourNodeType> as the prop type
export default function CounterNode(props: NodeProps<CounterNode>) {
  const [count, setCount] = useState(props.data?.initialCount ?? 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button className="nodrag" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// Step 3: Register in nodeTypes (outside component!)
const nodeTypes = { counter: CounterNode };`,
  examples: [],
  tips: [
    "The generic parameter is a Node type (not raw data). Use Node<MyData, 'myType'> to define it.",
    "Always register custom nodes via the nodeTypes prop on <ReactFlow>, defined outside the component or memoized.",
    "Add 'nodrag' class to interactive elements (buttons, inputs) inside nodes to prevent dragging when clicking them.",
  ],
  relatedApis: ["Node", "EdgeProps", "Handle"],
};

const edgePropsType: ApiEntry = {
  name: "EdgeProps",
  kind: "type",
  description: "Props received by custom edge components. Generic: EdgeProps<EdgeType extends Edge = Edge>.",
  importPath: "import type { EdgeProps, Edge } from '@xyflow/react'",
  props: [
    { name: "id", type: "string", description: "Edge ID." },
    { name: "source", type: "string", description: "Source node ID." },
    { name: "target", type: "string", description: "Target node ID." },
    { name: "sourceHandleId", type: "string | null", description: "Source handle ID." },
    { name: "targetHandleId", type: "string | null", description: "Target handle ID." },
    { name: "sourceX", type: "number", description: "Source X coordinate." },
    { name: "sourceY", type: "number", description: "Source Y coordinate." },
    { name: "targetX", type: "number", description: "Target X coordinate." },
    { name: "targetY", type: "number", description: "Target Y coordinate." },
    { name: "sourcePosition", type: "Position", description: "Source handle position." },
    { name: "targetPosition", type: "Position", description: "Target handle position." },
    { name: "data", type: "EdgeType['data']", description: "Edge data object (typed from your Edge generic)." },
    { name: "type", type: "EdgeType['type']", description: "Edge type." },
    { name: "selected", type: "boolean", description: "Whether edge is selected." },
    { name: "selectable", type: "boolean", description: "Whether edge is selectable." },
    { name: "deletable", type: "boolean", description: "Whether edge is deletable." },
    { name: "animated", type: "boolean", description: "Whether edge is animated." },
    { name: "label", type: "ReactNode", description: "Edge label." },
    { name: "labelStyle", type: "CSSProperties", description: "Label CSS styles." },
    { name: "labelShowBg", type: "boolean", description: "Show background behind label." },
    { name: "labelBgStyle", type: "CSSProperties", description: "Label background styles." },
    { name: "labelBgPadding", type: "[number, number]", description: "Label background padding." },
    { name: "labelBgBorderRadius", type: "number", description: "Label background border radius." },
    { name: "markerStart", type: "string", description: "Start marker URL." },
    { name: "markerEnd", type: "string", description: "End marker URL." },
    { name: "pathOptions", type: "any", description: "Path-specific options (curvature, borderRadius, etc)." },
    { name: "style", type: "CSSProperties", description: "Edge SVG path styles." },
    { name: "interactionWidth", type: "number", description: "Width of invisible click target." },
  ],
  usage: `import type { EdgeProps, Edge } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';

// Step 1: Define your edge type (optional)
type CustomEdgeType = Edge<{ weight: number }, 'weighted'>;

// Step 2: Use EdgeProps<YourEdgeType>
function WeightedEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, style }: EdgeProps<CustomEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      <text x={labelX} y={labelY} textAnchor="middle">{data?.weight}</text>
    </>
  );
}

// Step 3: Register in edgeTypes (outside component!)
const edgeTypes = { weighted: WeightedEdge };`,
  examples: [],
  tips: [
    "The generic parameter is an Edge type (not raw data). Use Edge<MyData, 'myType'> to define it.",
    "Use BaseEdge to get the invisible interaction path and marker handling for free.",
    "For complex HTML labels, use EdgeLabelRenderer instead of SVG text.",
  ],
  relatedApis: ["Edge", "NodeProps", "BaseEdge", "EdgeLabelRenderer"],
};

const connectionType: ApiEntry = {
  name: "Connection",
  kind: "type",
  description: "Minimal description of an edge between two nodes. The addEdge util upgrades a Connection to an Edge.",
  importPath: "import type { Connection } from '@xyflow/react'",
  props: [
    { name: "source", type: "string", description: "Source node ID." },
    { name: "target", type: "string", description: "Target node ID." },
    { name: "sourceHandle", type: "string | null", description: "Source handle ID." },
    { name: "targetHandle", type: "string | null", description: "Target handle ID." },
  ],
  usage: `const onConnect = (connection: Connection) => {
  setEdges((eds) => addEdge(connection, eds));
};`,
  examples: [],
  relatedApis: ["Edge", "addEdge", "useConnection"],
};

const viewportType: ApiEntry = {
  name: "Viewport",
  kind: "type",
  description: "Describes the current viewport position and zoom level of the flow canvas.",
  importPath: "import type { Viewport } from '@xyflow/react'",
  props: [
    { name: "x", type: "number", description: "X offset." },
    { name: "y", type: "number", description: "Y offset." },
    { name: "zoom", type: "number", description: "Zoom level." },
  ],
  usage: `const viewport: Viewport = { x: 0, y: 0, zoom: 1 };`,
  examples: [],
  relatedApis: ["useViewport", "useReactFlow"],
};

const reactFlowInstanceType: ApiEntry = {
  name: "ReactFlowInstance",
  kind: "type",
  description: "Collection of methods to query and manipulate flow state. Returned by useReactFlow() hook.",
  importPath: "import type { ReactFlowInstance } from '@xyflow/react'",
  props: [
    { name: "getNodes()", type: "() => Node[]", description: "Get all nodes." },
    { name: "setNodes()", type: "(nodes | updater) => void", description: "Replace or update nodes array." },
    { name: "addNodes()", type: "(node | nodes) => void", description: "Add one or more nodes." },
    { name: "getNode()", type: "(id) => Node | undefined", description: "Get node by ID." },
    { name: "updateNode()", type: "(id, update) => void", description: "Partially update a node." },
    { name: "updateNodeData()", type: "(id, data) => void", description: "Update node's data object." },
    { name: "getEdges()", type: "() => Edge[]", description: "Get all edges." },
    { name: "setEdges()", type: "(edges | updater) => void", description: "Replace or update edges array." },
    { name: "addEdges()", type: "(edge | edges) => void", description: "Add one or more edges." },
    { name: "getEdge()", type: "(id) => Edge | undefined", description: "Get edge by ID." },
    { name: "updateEdge()", type: "(id, update) => void", description: "Partially update an edge." },
    { name: "deleteElements()", type: "(params) => Promise", description: "Delete nodes and edges." },
    { name: "toObject()", type: "() => ReactFlowJsonObject", description: "Export flow as JSON." },
    { name: "fitView()", type: "(options?) => Promise<boolean>", description: "Fit viewport to nodes." },
    { name: "zoomIn()", type: "(options?) => Promise<boolean>", description: "Zoom in by 1.2x." },
    { name: "zoomOut()", type: "(options?) => Promise<boolean>", description: "Zoom out by 1/1.2x." },
    { name: "zoomTo()", type: "(level, options?) => Promise<boolean>", description: "Zoom to specific level." },
    { name: "getViewport()", type: "() => Viewport", description: "Get current viewport." },
    { name: "setViewport()", type: "(viewport, options?) => Promise<boolean>", description: "Set viewport." },
    { name: "setCenter()", type: "(x, y, options?) => Promise<boolean>", description: "Center viewport on position." },
    { name: "fitBounds()", type: "(bounds, options?) => Promise<boolean>", description: "Fit viewport to rectangle." },
    { name: "screenToFlowPosition()", type: "(pos) => XYPosition", description: "Convert screen coords to flow coords." },
    { name: "flowToScreenPosition()", type: "(pos) => XYPosition", description: "Convert flow coords to screen coords." },
    { name: "getIntersectingNodes()", type: "(node, partially?) => Node[]", description: "Find nodes intersecting with given node/rect." },
    { name: "isNodeIntersecting()", type: "(node, area, partially?) => boolean", description: "Check if node intersects area." },
    { name: "getNodesBounds()", type: "(nodes) => Rect", description: "Get bounding box of nodes." },
  ],
  usage: `const reactFlow = useReactFlow();

// Add a node
reactFlow.addNodes({ id: 'new', position: { x: 100, y: 100 }, data: { label: 'New' } });

// Fit view with animation
reactFlow.fitView({ duration: 500, padding: 0.2 });

// Export flow
const json = reactFlow.toObject();`,
  examples: [],
  relatedApis: ["useReactFlow", "ReactFlowProvider"],
};

export const TYPE_APIS: ApiEntry[] = [
  nodeType,
  edgeType,
  nodePropsType,
  edgePropsType,
  connectionType,
  viewportType,
  reactFlowInstanceType,
];
