// ---------------------------------------------------------------------------
// React Flow MCP — Data Layer
// All API documentation, examples, patterns, and templates for @xyflow/react v12
// ---------------------------------------------------------------------------

export interface ApiEntry {
  name: string;
  kind: ApiKind;
  description: string;
  importPath: string;
  props?: PropEntry[];
  returns?: string;
  usage: string;
  examples: Example[];
  tips?: string[];
  relatedApis?: string[];
}

export interface PropEntry {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface Example {
  title: string;
  code: string;
  description?: string;
  category: Category;
}

export interface SearchResult {
  api: ApiEntry;
  matchingExamples: Example[];
}

export const CATEGORIES = [
  "quickstart",
  "custom-nodes",
  "custom-edges",
  "layout",
  "drag-and-drop",
  "state-management",
  "viewport",
  "connections",
  "interaction",
  "subflows",
  "performance",
  "styling",
  "undo-redo",
  "save-restore",
  "accessibility",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const API_KINDS = ["component", "hook", "utility", "type"] as const;
export type ApiKind = (typeof API_KINDS)[number];

export const PATTERN_SECTIONS = [
  "zustand-store",
  "undo-redo",
  "drag-and-drop",
  "auto-layout-dagre",
  "auto-layout-elk",
  "context-menu",
  "copy-paste",
  "save-restore",
  "prevent-cycles",
  "keyboard-shortcuts",
  "performance",
  "dark-mode",
  "ssr",
  "subflows",
  "edge-reconnection",
  "custom-connection-line",
  "auto-layout-on-mount",
] as const;

export type PatternSection = (typeof PATTERN_SECTIONS)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatExample(ex: Example, headingLevel = 3): string {
  const prefix = "#".repeat(headingLevel);
  let out = `${prefix} ${ex.title}\n`;
  if (ex.description) out += `${ex.description}\n\n`;
  out += `\`\`\`tsx\n${ex.code}\n\`\`\`\n\n`;
  return out;
}

export function formatApiReference(api: ApiEntry): string {
  let text = `# ${api.name} (${api.kind})\n\n`;
  text += `${api.description}\n\n`;
  text += `**Import:** \`${api.importPath}\`\n\n`;

  if (api.returns) {
    text += `**Returns:** \`${api.returns}\`\n\n`;
  }

  if (api.props && api.props.length > 0) {
    text += `## Props / Parameters\n\n`;
    text += `| Name | Type | Default | Description |\n`;
    text += `|------|------|---------|-------------|\n`;
    for (const p of api.props) {
      text += `| ${p.name} | \`${p.type}\` | ${p.default ?? "—"} | ${p.description} |\n`;
    }
    text += "\n";
  }

  text += `## Usage\n\n\`\`\`tsx\n${api.usage}\n\`\`\`\n\n`;

  if (api.examples.length > 0) {
    text += `## Examples\n\n`;
    for (const ex of api.examples) {
      text += formatExample(ex);
    }
  }

  if (api.tips && api.tips.length > 0) {
    text += `## Tips\n\n`;
    for (const tip of api.tips) {
      text += `- ${tip}\n`;
    }
    text += "\n";
  }

  if (api.relatedApis && api.relatedApis.length > 0) {
    text += `## Related APIs\n\n${api.relatedApis.join(", ")}\n`;
  }

  return text;
}

export function searchApis(query: string): SearchResult[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const api of ALL_APIS) {
    const haystack = [
      api.name,
      api.description,
      api.kind,
      api.usage,
      ...(api.tips ?? []),
      ...api.examples.map((e) => `${e.title} ${e.description ?? ""} ${e.code}`),
    ]
      .join(" ")
      .toLowerCase();

    const score = tokens.reduce((s, t) => s + (haystack.includes(t) ? 1 : 0), 0);
    if (score > 0) {
      const matchingExamples = api.examples.filter((ex) => {
        const exHay = `${ex.title} ${ex.description ?? ""} ${ex.code}`.toLowerCase();
        return tokens.some((t) => exHay.includes(t));
      });
      results.push({ api, matchingExamples });
    }
  }

  results.sort((a, b) => {
    const aScore = tokens.reduce(
      (s, t) => s + (`${a.api.name} ${a.api.description}`.toLowerCase().includes(t) ? 2 : 0),
      0,
    );
    const bScore = tokens.reduce(
      (s, t) => s + (`${b.api.name} ${b.api.description}`.toLowerCase().includes(t) ? 2 : 0),
      0,
    );
    return bScore - aScore;
  });

  return results;
}

export function getApiByName(name: string): ApiEntry | undefined {
  const normalized = name.toLowerCase().replace(/[<>/()]/g, "").trim();
  return ALL_APIS.find(
    (a) =>
      a.name.toLowerCase() === normalized ||
      a.name.toLowerCase().replace(/[<>/()]/g, "") === normalized,
  );
}

export function getExamplesByCategory(category: string): Example[] {
  const cat = category.toLowerCase().trim();
  const examples: Example[] = [];
  for (const api of ALL_APIS) {
    for (const ex of api.examples) {
      if (ex.category === cat) {
        examples.push(ex);
      }
    }
  }
  return examples;
}

// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

const reactFlowComponent: ApiEntry = {
  name: "ReactFlow",
  kind: "component",
  description:
    "The heart of your React Flow application. Renders nodes and edges, handles user interaction, and can manage its own state if used as an uncontrolled flow.",
  importPath: "import { ReactFlow } from '@xyflow/react'",
  props: [
    { name: "nodes", type: "Node[]", description: "Array of nodes to render in a controlled flow.", default: "[]" },
    { name: "edges", type: "Edge[]", description: "Array of edges to render in a controlled flow.", default: "[]" },
    { name: "defaultNodes", type: "Node[]", description: "Initial nodes for an uncontrolled flow." },
    { name: "defaultEdges", type: "Edge[]", description: "Initial edges for an uncontrolled flow." },
    { name: "nodeTypes", type: "NodeTypes", description: "Custom node types. React Flow matches a node's type to a component in this object.", default: "{ input, default, output, group }" },
    { name: "edgeTypes", type: "EdgeTypes", description: "Custom edge types. React Flow matches an edge's type to a component in this object.", default: "{ default: BezierEdge, straight, step, smoothstep, simplebezier }" },
    { name: "onNodesChange", type: "OnNodesChange", description: "Called on node drag, select, and move. Use to add interactivity to controlled flow." },
    { name: "onEdgesChange", type: "OnEdgesChange", description: "Called on edge select and remove. Use to add interactivity to controlled flow." },
    { name: "onConnect", type: "OnConnect", description: "Fired when a connection line is completed and two nodes are connected." },
    { name: "onInit", type: "(instance: ReactFlowInstance) => void", description: "Called when the viewport is initialized." },
    { name: "onNodeClick", type: "NodeMouseHandler", description: "Called when a user clicks on a node." },
    { name: "onNodeDrag", type: "OnNodeDrag", description: "Called when a user drags a node." },
    { name: "onNodeDragStop", type: "OnNodeDrag", description: "Called when a user stops dragging a node." },
    { name: "onEdgeClick", type: "(event, edge) => void", description: "Called when a user clicks on an edge." },
    { name: "onPaneClick", type: "(event) => void", description: "Called when user clicks inside the pane." },
    { name: "onPaneContextMenu", type: "(event) => void", description: "Called when user right-clicks inside the pane." },
    { name: "onSelectionChange", type: "OnSelectionChangeFunc", description: "Called when group of selected elements changes." },
    { name: "onDelete", type: "OnDelete", description: "Called when a node or edge is deleted." },
    { name: "onBeforeDelete", type: "OnBeforeDelete", description: "Called before nodes/edges are deleted, allowing abort by returning false." },
    { name: "onReconnect", type: "OnReconnect", description: "Called when source/target of a reconnectable edge is dragged." },
    { name: "isValidConnection", type: "IsValidConnection", description: "Validate a new connection. Return false to prevent the edge." },
    { name: "fitView", type: "boolean", description: "Zoom and pan to fit all nodes on initial render." },
    { name: "fitViewOptions", type: "FitViewOptions", description: "Options for the initial fitView call." },
    { name: "minZoom", type: "number", description: "Minimum zoom level.", default: "0.5" },
    { name: "maxZoom", type: "number", description: "Maximum zoom level.", default: "2" },
    { name: "defaultViewport", type: "Viewport", description: "Initial viewport position and zoom.", default: "{ x: 0, y: 0, zoom: 1 }" },
    { name: "snapToGrid", type: "boolean", description: "Nodes snap to grid when dragged." },
    { name: "snapGrid", type: "SnapGrid", description: "Grid size for snapping: [x, y]." },
    { name: "nodesDraggable", type: "boolean", description: "Whether all nodes are draggable.", default: "true" },
    { name: "nodesConnectable", type: "boolean", description: "Whether all nodes are connectable.", default: "true" },
    { name: "nodesFocusable", type: "boolean", description: "Tab-focusable nodes for keyboard navigation.", default: "true" },
    { name: "elementsSelectable", type: "boolean", description: "Elements selectable by clicking.", default: "true" },
    { name: "panOnDrag", type: "boolean | number[]", description: "Pan viewport by clicking and dragging.", default: "true" },
    { name: "panOnScroll", type: "boolean", description: "Pan viewport by scrolling.", default: "false" },
    { name: "zoomOnScroll", type: "boolean", description: "Zoom viewport by scrolling.", default: "true" },
    { name: "zoomOnPinch", type: "boolean", description: "Zoom by pinch gesture.", default: "true" },
    { name: "zoomOnDoubleClick", type: "boolean", description: "Zoom on double click.", default: "true" },
    { name: "connectOnClick", type: "boolean", description: "Click source then target handle to connect.", default: "true" },
    { name: "connectionMode", type: "ConnectionMode", description: "'strict' only source→target; 'loose' allows source→source too.", default: "'strict'" },
    { name: "connectionLineType", type: "ConnectionLineType", description: "Path type for connection lines.", default: "ConnectionLineType.Bezier" },
    { name: "connectionRadius", type: "number", description: "Drop radius for connection lines.", default: "20" },
    { name: "selectionMode", type: "SelectionMode", description: "'full' or 'partial' node selection in selection box.", default: "'full'" },
    { name: "colorMode", type: "ColorMode", description: "Color scheme: 'light', 'dark', or 'system'.", default: "'light'" },
    { name: "deleteKeyCode", type: "KeyCode | null", description: "Key to delete selected elements.", default: "'Backspace'" },
    { name: "selectionKeyCode", type: "KeyCode | null", description: "Key to draw selection box.", default: "'Shift'" },
    { name: "elevateNodesOnSelect", type: "boolean", description: "Raise z-index of selected nodes.", default: "true" },
    { name: "elevateEdgesOnSelect", type: "boolean", description: "Raise z-index of selected edges.", default: "false" },
    { name: "translateExtent", type: "CoordinateExtent", description: "Boundary for viewport panning.", default: "[[-Infinity, -Infinity], [Infinity, Infinity]]" },
    { name: "nodeExtent", type: "CoordinateExtent", description: "Boundary for node placement." },
    { name: "nodeOrigin", type: "NodeOrigin", description: "Origin point for node positioning.", default: "[0, 0]" },
    { name: "nodeDragThreshold", type: "number", description: "Pixels to drag before triggering drag event.", default: "1" },
    { name: "onlyRenderVisibleElements", type: "boolean", description: "Only render visible nodes/edges for performance.", default: "false" },
    { name: "edgesReconnectable", type: "boolean", description: "Allow edges to be reconnected by dragging.", default: "true" },
    { name: "reconnectRadius", type: "number", description: "Radius for edge reconnection trigger.", default: "10" },
    { name: "autoPanOnConnect", type: "boolean", description: "Pan viewport when creating connections near edge.", default: "true" },
    { name: "autoPanOnNodeDrag", type: "boolean", description: "Pan viewport when dragging nodes near edge.", default: "true" },
  ],
  usage: `import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
];
const edges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}`,
  examples: [
    {
      title: "Controlled flow with Zustand",
      category: "state-management",
      code: `import { ReactFlow } from '@xyflow/react';
import useFlowStore from './store';

const selector = (s) => ({
  nodes: s.nodes, edges: s.edges,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export default function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore(selector);
  return (
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    />
  );
}`,
    },
    {
      title: "Uncontrolled flow",
      category: "quickstart",
      code: `import { ReactFlow } from '@xyflow/react';

const defaultNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Hello' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'World' } },
];
const defaultEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
  return <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView />;
}`,
    },
  ],
  tips: [
    "The parent container must have explicit width and height — React Flow fills its parent.",
    "Always import '@xyflow/react/dist/style.css' once at your app root.",
    "Define event handlers outside the component or with useCallback to prevent infinite re-render loops.",
    "nodeTypes and edgeTypes must be defined outside the component or memoized.",
    "v12 uses @xyflow/react (named exports) — not the legacy 'reactflow' package.",
  ],
  relatedApis: ["ReactFlowProvider", "Background", "Controls", "MiniMap", "useReactFlow"],
};

const backgroundComponent: ApiEntry = {
  name: "Background",
  kind: "component",
  description:
    "Renders different background types common in node-based UIs. Comes with three variants: lines, dots, and cross.",
  importPath: "import { Background, BackgroundVariant } from '@xyflow/react'",
  props: [
    { name: "variant", type: "BackgroundVariant", description: "Background pattern type.", default: "BackgroundVariant.Dots" },
    { name: "gap", type: "number | [number, number]", description: "Gap between pattern elements.", default: "20" },
    { name: "size", type: "number", description: "Size of pattern dots/lines.", default: "1" },
    { name: "color", type: "string", description: "Pattern color." },
    { name: "lineWidth", type: "number", description: "Stroke width for lines/cross variant.", default: "1" },
  ],
  usage: `<ReactFlow nodes={nodes} edges={edges}>
  <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
</ReactFlow>`,
  examples: [
    {
      title: "Cross pattern background",
      category: "styling",
      code: `import { Background, BackgroundVariant } from '@xyflow/react';

<Background variant={BackgroundVariant.Cross} gap={24} size={2} color="#ddd" />`,
    },
  ],
  relatedApis: ["ReactFlow", "MiniMap", "Controls"],
};

const controlsComponent: ApiEntry = {
  name: "Controls",
  kind: "component",
  description:
    "Renders a small panel with zoom in, zoom out, fit view, and lock viewport buttons.",
  importPath: "import { Controls, ControlButton } from '@xyflow/react'",
  props: [
    { name: "showZoom", type: "boolean", description: "Show zoom buttons.", default: "true" },
    { name: "showFitView", type: "boolean", description: "Show fit view button.", default: "true" },
    { name: "showInteractive", type: "boolean", description: "Show lock button.", default: "true" },
    { name: "position", type: "PanelPosition", description: "Corner position.", default: "'bottom-left'" },
    { name: "orientation", type: "'horizontal' | 'vertical'", description: "Layout direction.", default: "'vertical'" },
  ],
  usage: `<ReactFlow nodes={nodes} edges={edges}>
  <Controls position="bottom-left" />
</ReactFlow>`,
  examples: [
    {
      title: "Custom control button",
      category: "interaction",
      code: `import { Controls, ControlButton } from '@xyflow/react';

<Controls>
  <ControlButton onClick={() => console.log('custom action')}>
    <Icon />
  </ControlButton>
</Controls>`,
    },
  ],
  relatedApis: ["ReactFlow", "ControlButton", "Panel"],
};

const miniMapComponent: ApiEntry = {
  name: "MiniMap",
  kind: "component",
  description:
    "Renders an overview of your flow. Each node appears as an SVG element showing the current viewport position relative to the full flow.",
  importPath: "import { MiniMap } from '@xyflow/react'",
  props: [
    { name: "nodeColor", type: "string | ((node: Node) => string)", description: "Color of minimap nodes." },
    { name: "nodeStrokeColor", type: "string | ((node: Node) => string)", description: "Stroke color of minimap nodes." },
    { name: "nodeStrokeWidth", type: "number", description: "Stroke width.", default: "2" },
    { name: "maskColor", type: "string", description: "Color of the area outside the viewport." },
    { name: "position", type: "PanelPosition", description: "Corner position.", default: "'bottom-right'" },
    { name: "pannable", type: "boolean", description: "Allow panning via minimap.", default: "false" },
    { name: "zoomable", type: "boolean", description: "Allow zooming via minimap.", default: "false" },
  ],
  usage: `<ReactFlow nodes={nodes} edges={edges}>
  <MiniMap nodeColor={(n) => n.type === 'input' ? '#6366f1' : '#94a3b8'} pannable zoomable />
</ReactFlow>`,
  examples: [],
  relatedApis: ["ReactFlow", "Background", "Controls"],
};

const panelComponent: ApiEntry = {
  name: "Panel",
  kind: "component",
  description: "Positions content above the viewport. Used internally by MiniMap and Controls.",
  importPath: "import { Panel } from '@xyflow/react'",
  props: [
    { name: "position", type: "PanelPosition", description: "Corner or side position. E.g. 'top-left', 'top-right', 'bottom-left', 'bottom-right'." },
  ],
  usage: `<ReactFlow nodes={nodes} edges={edges}>
  <Panel position="top-left">
    <h3>Flow Title</h3>
  </Panel>
</ReactFlow>`,
  examples: [],
  relatedApis: ["ReactFlow", "Controls", "MiniMap"],
};

const handleComponent: ApiEntry = {
  name: "Handle",
  kind: "component",
  description:
    "Used in custom nodes to define connection points. Handles can be sources (outgoing) or targets (incoming).",
  importPath: "import { Handle, Position } from '@xyflow/react'",
  props: [
    { name: "type", type: "'source' | 'target'", description: "Whether this is an input or output handle.", default: "'source'" },
    { name: "position", type: "Position", description: "Side of the node: Position.Top, Bottom, Left, Right.", default: "Position.Top" },
    { name: "id", type: "string", description: "Handle ID, needed when a node has multiple handles of the same type." },
    { name: "isConnectable", type: "boolean", description: "Whether connections can be made to/from this handle.", default: "true" },
    { name: "isConnectableStart", type: "boolean", description: "Whether a connection can start from this handle.", default: "true" },
    { name: "isConnectableEnd", type: "boolean", description: "Whether a connection can end on this handle.", default: "true" },
    { name: "isValidConnection", type: "IsValidConnection", description: "Custom validation logic for connections to this handle." },
    { name: "onConnect", type: "OnConnect", description: "Callback when connection is made to this handle." },
  ],
  usage: `import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}`,
  examples: [
    {
      title: "Multiple handles",
      category: "custom-nodes",
      code: `function MultiHandleNode({ data }) {
  return (
    <div className="p-4 border rounded bg-white">
      <Handle type="target" position={Position.Top} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Right} id="d" />
    </div>
  );
}`,
    },
  ],
  tips: [
    "Use the id prop when a node has multiple source or target handles.",
    "Prefer isValidConnection on <ReactFlow> over per-handle validation for performance.",
    "Add 'nodrag' class to interactive elements inside a node to prevent drag when clicking them.",
  ],
  relatedApis: ["ReactFlow", "NodeResizer", "NodeToolbar"],
};

const nodeResizerComponent: ApiEntry = {
  name: "NodeResizer",
  kind: "component",
  description: "Adds resize handles around a custom node, allowing users to resize it by dragging.",
  importPath: "import { NodeResizer } from '@xyflow/react'",
  props: [
    { name: "minWidth", type: "number", description: "Minimum width.", default: "10" },
    { name: "minHeight", type: "number", description: "Minimum height.", default: "10" },
    { name: "maxWidth", type: "number", description: "Maximum width." },
    { name: "maxHeight", type: "number", description: "Maximum height." },
    { name: "isVisible", type: "boolean", description: "Control visibility of resize handles.", default: "true" },
    { name: "color", type: "string", description: "Color of resize handles." },
    { name: "handleStyle", type: "CSSProperties", description: "Style the resize handles." },
    { name: "lineStyle", type: "CSSProperties", description: "Style the resize border lines." },
    { name: "keepAspectRatio", type: "boolean", description: "Maintain aspect ratio when resizing.", default: "false" },
  ],
  usage: `import { NodeResizer } from '@xyflow/react';

function ResizableNode({ data, selected }) {
  return (
    <>
      <NodeResizer isVisible={selected} minWidth={100} minHeight={50} />
      <div className="p-4">{data.label}</div>
    </>
  );
}`,
  examples: [
    {
      title: "Resizable node with handles",
      category: "custom-nodes",
      code: `function ResizableNode({ data, selected }) {
  return (
    <>
      <NodeResizer isVisible={selected} minWidth={150} minHeight={80} />
      <Handle type="target" position={Position.Left} />
      <div className="p-4 h-full flex items-center justify-center">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}`,
    },
  ],
  relatedApis: ["NodeResizeControl", "Handle"],
};

const nodeToolbarComponent: ApiEntry = {
  name: "NodeToolbar",
  kind: "component",
  description:
    "Renders a toolbar/tooltip to one side of a custom node. Does not scale with viewport — always readable.",
  importPath: "import { NodeToolbar } from '@xyflow/react'",
  props: [
    { name: "isVisible", type: "boolean", description: "Control visibility. Defaults to showing when node is selected." },
    { name: "position", type: "Position", description: "Side of node.", default: "Position.Top" },
    { name: "align", type: "Align", description: "Alignment: 'start', 'center', 'end'.", default: "'center'" },
    { name: "offset", type: "number", description: "Distance from node.", default: "10" },
    { name: "nodeId", type: "string | string[]", description: "Attach to specific node(s)." },
  ],
  usage: `import { NodeToolbar, Position } from '@xyflow/react';

function ToolbarNode({ data }) {
  return (
    <>
      <NodeToolbar position={Position.Top}>
        <button>Edit</button>
        <button>Delete</button>
      </NodeToolbar>
      <div className="p-4">{data.label}</div>
    </>
  );
}`,
  examples: [],
  relatedApis: ["EdgeToolbar", "Handle"],
};

const edgeLabelRendererComponent: ApiEntry = {
  name: "EdgeLabelRenderer",
  kind: "component",
  description:
    "Portal for rendering complex HTML labels on edges. Since edges are SVG, this provides a div-based renderer positioned on top of edges.",
  importPath: "import { EdgeLabelRenderer } from '@xyflow/react'",
  usage: `import { EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeLabelRenderer>
        <div style={{ position: 'absolute', transform: \`translate(-50%, -50%) translate(\${labelX}px,\${labelY}px)\`, pointerEvents: 'all' }}
             className="nodrag nopan">
          <button onClick={() => console.log('delete', id)}>x</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}`,
  examples: [
    {
      title: "Edge with delete button",
      category: "custom-edges",
      code: `function ButtonEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  });
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <div style={{
          position: 'absolute',
          transform: \`translate(-50%, -50%) translate(\${labelX}px,\${labelY}px)\`,
          pointerEvents: 'all',
        }} className="nodrag nopan">
          <button onClick={() => setEdges((es) => es.filter((e) => e.id !== id))}>
            Delete
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}`,
    },
  ],
  relatedApis: ["BaseEdge", "getBezierPath", "EdgeToolbar"],
};

const baseEdgeComponent: ApiEntry = {
  name: "BaseEdge",
  kind: "component",
  description:
    "Used internally for all edges. Use inside custom edges to get the invisible helper path and edge label handling for free.",
  importPath: "import { BaseEdge } from '@xyflow/react'",
  props: [
    { name: "path", type: "string", description: "SVG path string." },
    { name: "labelX", type: "number", description: "X position of the label." },
    { name: "labelY", type: "number", description: "Y position of the label." },
    { name: "label", type: "ReactNode", description: "Edge label content." },
    { name: "interactionWidth", type: "number", description: "Width of invisible click target.", default: "20" },
  ],
  usage: `import { BaseEdge, getStraightPath } from '@xyflow/react';

function CustomEdge({ sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge path={edgePath} />;
}`,
  examples: [],
  relatedApis: ["EdgeLabelRenderer", "getBezierPath", "getSmoothStepPath"],
};

const viewportPortalComponent: ApiEntry = {
  name: "ViewportPortal",
  kind: "component",
  description:
    "Renders components in the same viewport coordinate system as nodes and edges. Content zooms and pans with the flow.",
  importPath: "import { ViewportPortal } from '@xyflow/react'",
  usage: `<ReactFlow nodes={nodes} edges={edges}>
  <ViewportPortal>
    <div style={{ position: 'absolute', transform: 'translate(100px, 100px)' }}>
      I move with the flow!
    </div>
  </ViewportPortal>
</ReactFlow>`,
  examples: [],
  relatedApis: ["ReactFlow", "Panel"],
};

const edgeToolbarComponent: ApiEntry = {
  name: "EdgeToolbar",
  kind: "component",
  description:
    "Renders a toolbar/tooltip to one side of a custom edge. Does not scale with viewport.",
  importPath: "import { EdgeToolbar } from '@xyflow/react'",
  props: [
    { name: "position", type: "Position", description: "Side of edge.", default: "Position.Top" },
  ],
  usage: `import { EdgeToolbar } from '@xyflow/react';

function CustomEdge(props) {
  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeToolbar>
        <button>Edit</button>
      </EdgeToolbar>
    </>
  );
}`,
  examples: [],
  relatedApis: ["NodeToolbar", "EdgeLabelRenderer"],
};

const nodeResizeControlComponent: ApiEntry = {
  name: "NodeResizeControl",
  kind: "component",
  description:
    "A lower-level alternative to NodeResizer for creating custom resize UIs. Accepts children (like icons) as the resize handle.",
  importPath: "import { NodeResizeControl } from '@xyflow/react'",
  props: [
    { name: "nodeId", type: "string", description: "ID of the node to resize." },
    { name: "position", type: "ControlLinePosition | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", description: "Position of the control." },
    { name: "variant", type: "ResizeControlVariant", description: "Variant of the control.", default: "'handle'" },
    { name: "minWidth", type: "number", description: "Minimum width.", default: "10" },
    { name: "minHeight", type: "number", description: "Minimum height.", default: "10" },
    { name: "maxWidth", type: "number", description: "Maximum width.", default: "Number.MAX_VALUE" },
    { name: "maxHeight", type: "number", description: "Maximum height.", default: "Number.MAX_VALUE" },
    { name: "keepAspectRatio", type: "boolean", description: "Keep aspect ratio when resizing.", default: "false" },
    { name: "shouldResize", type: "(event, params) => boolean", description: "Callback to determine if node should resize." },
    { name: "onResizeStart", type: "OnResizeStart", description: "Callback when resizing starts." },
    { name: "onResize", type: "OnResize", description: "Callback when resizing." },
    { name: "onResizeEnd", type: "OnResizeEnd", description: "Callback when resizing ends." },
    { name: "color", type: "string", description: "Color of the resize handle." },
    { name: "autoScale", type: "boolean", description: "Scale controls with zoom level.", default: "true" },
    { name: "resizeDirection", type: "'horizontal' | 'vertical'", description: "Constrain resize direction." },
  ],
  usage: `import { NodeResizeControl } from '@xyflow/react';
import { GripVertical } from 'lucide-react';

function ResizableNode({ data, selected }) {
  return (
    <>
      <NodeResizeControl minWidth={100} minHeight={50}>
        <GripVertical className="w-3 h-3" />
      </NodeResizeControl>
      <div className="p-4">{data.label}</div>
    </>
  );
}`,
  examples: [],
  tips: [
    "Use NodeResizeControl when you need a custom resize UI (icon, button, etc).",
    "Use NodeResizer for the standard resize handles around the node.",
  ],
  relatedApis: ["NodeResizer", "Handle"],
};

const controlButtonComponent: ApiEntry = {
  name: "ControlButton",
  kind: "component",
  description:
    "Add custom buttons to the Controls panel. Pass as a child to the <Controls /> component. Accepts any HTML button attributes.",
  importPath: "import { Controls, ControlButton } from '@xyflow/react'",
  props: [
    { name: "...props", type: "ButtonHTMLAttributes<HTMLButtonElement>", description: "Any valid HTML button props." },
  ],
  usage: `import { Controls, ControlButton } from '@xyflow/react';

<Controls>
  <ControlButton onClick={() => alert('Magic!')} title="Do magic">
    <span>✨</span>
  </ControlButton>
</Controls>`,
  examples: [
    {
      title: "Custom control with layout button",
      category: "interaction",
      code: `import { Controls, ControlButton } from '@xyflow/react';

function FlowControls({ onLayout }) {
  return (
    <Controls>
      <ControlButton onClick={() => onLayout('TB')} title="Vertical layout">
        ↕
      </ControlButton>
      <ControlButton onClick={() => onLayout('LR')} title="Horizontal layout">
        ↔
      </ControlButton>
    </Controls>
  );
}`,
    },
  ],
  relatedApis: ["Controls", "Panel"],
};

const reactFlowProviderComponent: ApiEntry = {
  name: "ReactFlowProvider",
  kind: "component",
  description:
    "Provides the React Flow context to child components. Required when using hooks like useReactFlow outside of the ReactFlow component.",
  importPath: "import { ReactFlowProvider } from '@xyflow/react'",
  usage: `import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
      <Sidebar />  {/* Can use useReactFlow() here */}
    </ReactFlowProvider>
  );
}`,
  examples: [],
  tips: [
    "If you render <ReactFlow> and need to use hooks like useReactFlow in sibling or parent components, wrap everything in <ReactFlowProvider>.",
    "The <ReactFlow> component creates its own provider internally — you only need <ReactFlowProvider> when using hooks outside <ReactFlow>.",
  ],
  relatedApis: ["ReactFlow", "useReactFlow"],
};

// ---------------------------------------------------------------------------
// HOOKS
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// UTILITIES
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// ALL APIS REGISTRY
// ---------------------------------------------------------------------------

export const ALL_APIS: ApiEntry[] = [
  // Components
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
  // Hooks
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
  // Utilities
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
  // Types
  nodeType,
  edgeType,
  nodePropsType,
  edgePropsType,
  connectionType,
  viewportType,
  reactFlowInstanceType,
];

// ---------------------------------------------------------------------------
// PATTERNS
// ---------------------------------------------------------------------------

export const PATTERNS: Record<PatternSection, string> = {
  "zustand-store": `# Zustand Store Architecture for React Flow

\`\`\`ts
import { create } from 'zustand';
import {
  type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect,
  applyNodeChanges, applyEdgeChanges, addEdge,
} from '@xyflow/react';

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<Record<string, unknown>>) => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  removeNode: (id) => set({
    nodes: get().nodes.filter((n) => n.id !== id),
    edges: get().edges.filter((e) => e.source !== id && e.target !== id),
  }),
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
  }),
}));

export default useFlowStore;
\`\`\`

**Usage with stable selectors (prevents re-renders):**
\`\`\`tsx
const selector = (s: FlowState) => ({
  nodes: s.nodes, edges: s.edges,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

function Flow() {
  const store = useFlowStore(selector);
  return <ReactFlow {...store} fitView />;
}
\`\`\``,

  "undo-redo": `# Undo / Redo with Zundo

\`\`\`bash
npm install zundo
\`\`\`

\`\`\`ts
import { create } from 'zustand';
import { temporal } from 'zundo';

const useFlowStore = create<FlowState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
      onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
      onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
    }),
    {
      // Only track meaningful changes, not every drag pixel
      equality: (past, current) =>
        JSON.stringify(past.nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))) ===
        JSON.stringify(current.nodes.map(n => ({ id: n.id, position: n.position, data: n.data }))),
      limit: 50,
    }
  )
);

// Hook for undo/redo
export function useFlowHistory() {
  return useFlowStore.temporal.getState();
}
\`\`\`

**Usage:**
\`\`\`tsx
function UndoRedoControls() {
  const { undo, redo, pastStates, futureStates } = useFlowHistory();
  return (
    <Panel position="top-right">
      <button onClick={() => undo()} disabled={pastStates.length === 0}>Undo</button>
      <button onClick={() => redo()} disabled={futureStates.length === 0}>Redo</button>
    </Panel>
  );
}
\`\`\``,

  "drag-and-drop": `# Drag & Drop from Sidebar

\`\`\`tsx
function Sidebar() {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div draggable onDragStart={(e) => onDragStart(e, 'customNode')}>
        Custom Node
      </div>
    </aside>
  );
}

function Flow() {
  const { screenToFlowPosition, addNodes } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNodes({
      id: crypto.randomUUID(),
      type,
      position,
      data: { label: \`New \${type}\` },
    });
  }, [screenToFlowPosition, addNodes]);

  return (
    <ReactFlow onDragOver={onDragOver} onDrop={onDrop} ... />
  );
}
\`\`\``,

  "auto-layout-dagre": `# Auto Layout with Dagre

\`\`\`bash
npm install @dagrejs/dagre
\`\`\`

\`\`\`tsx
import Dagre from '@dagrejs/dagre';

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: node.measured?.width ?? 172,
      height: node.measured?.height ?? 36,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - (node.measured?.width ?? 172) / 2,
        y: pos.y - (node.measured?.height ?? 36) / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
\`\`\``,

  "auto-layout-elk": `# Auto Layout with ELK

\`\`\`bash
npm install elkjs
\`\`\`

\`\`\`tsx
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

async function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    },
    children: nodes.map((n) => ({
      id: n.id,
      width: n.measured?.width ?? 172,
      height: n.measured?.height ?? 36,
    })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  };

  const layout = await elk.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const elkNode = layout.children?.find((n) => n.id === node.id);
      return { ...node, position: { x: elkNode?.x ?? 0, y: elkNode?.y ?? 0 } };
    }),
    edges,
  };
}
\`\`\``,

  "context-menu": `# Context Menu

\`\`\`tsx
function Flow() {
  const [menu, setMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);
  const { deleteElements, getNode } = useReactFlow();

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY });
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
  }, []);

  return (
    <>
      <ReactFlow
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={() => setMenu(null)}
      />
      {menu && (
        <div style={{ position: 'fixed', left: menu.x, top: menu.y }} className="bg-white shadow rounded p-2">
          {menu.nodeId && (
            <button onClick={() => { deleteElements({ nodes: [{ id: menu.nodeId! }] }); setMenu(null); }}>
              Delete Node
            </button>
          )}
        </div>
      )}
    </>
  );
}
\`\`\``,

  "copy-paste": `# Copy & Paste Nodes

\`\`\`tsx
function useCopyPaste() {
  const { getNodes, getEdges, addNodes, addEdges, screenToFlowPosition } = useReactFlow();
  const clipboard = useRef<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

  const copy = useCallback(() => {
    const selected = getNodes().filter((n) => n.selected);
    const selectedIds = new Set(selected.map((n) => n.id));
    const connectedEdges = getEdges().filter(
      (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
    );
    clipboard.current = { nodes: selected, edges: connectedEdges };
  }, [getNodes, getEdges]);

  const paste = useCallback(() => {
    const { nodes: copiedNodes, edges: copiedEdges } = clipboard.current;
    if (copiedNodes.length === 0) return;

    const idMap = new Map<string, string>();
    const newNodes = copiedNodes.map((n) => {
      const newId = crypto.randomUUID();
      idMap.set(n.id, newId);
      return { ...n, id: newId, position: { x: n.position.x + 50, y: n.position.y + 50 }, selected: true };
    });

    const newEdges = copiedEdges.map((e) => ({
      ...e,
      id: crypto.randomUUID(),
      source: idMap.get(e.source) ?? e.source,
      target: idMap.get(e.target) ?? e.target,
    }));

    addNodes(newNodes);
    addEdges(newEdges);
  }, [addNodes, addEdges]);

  return { copy, paste };
}
\`\`\``,

  "save-restore": `# Save & Restore Flow

\`\`\`tsx
function SaveRestore() {
  const { toObject, setNodes, setEdges, setViewport } = useReactFlow();

  const onSave = useCallback(() => {
    const flow = toObject();
    localStorage.setItem('flow', JSON.stringify(flow));
  }, [toObject]);

  const onRestore = useCallback(() => {
    const json = localStorage.getItem('flow');
    if (!json) return;
    const flow = JSON.parse(json);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (flow.viewport) {
      setViewport(flow.viewport);
    }
  }, [setNodes, setEdges, setViewport]);

  return (
    <Panel position="top-right">
      <button onClick={onSave}>Save</button>
      <button onClick={onRestore}>Restore</button>
    </Panel>
  );
}
\`\`\``,

  "prevent-cycles": `# Prevent Cycles (DAG Validation)

\`\`\`tsx
import { getOutgoers } from '@xyflow/react';

function hasCycle(node: Node, target: Node, nodes: Node[], edges: Edge[], visited = new Set<string>()): boolean {
  if (visited.has(node.id)) return false;
  visited.add(node.id);
  if (node.id === target.id) return true;

  for (const outgoer of getOutgoers(node, nodes, edges)) {
    if (hasCycle(outgoer, target, nodes, edges, visited)) return true;
  }
  return false;
}

// Use as isValidConnection:
<ReactFlow
  isValidConnection={(connection) => {
    const nodes = getNodes();
    const edges = getEdges();
    const target = nodes.find((n) => n.id === connection.target);
    const source = nodes.find((n) => n.id === connection.source);
    if (!target || !source) return false;
    return !hasCycle(target, source, nodes, edges);
  }}
/>
\`\`\``,

  "keyboard-shortcuts": `# Keyboard Shortcuts

\`\`\`tsx
function KeyboardShortcuts() {
  const { undo, redo } = useFlowHistory();
  const { copy, paste } = useCopyPaste();
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (mod && e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      if (mod && e.key === 'c') { copy(); }
      if (mod && e.key === 'v') { paste(); }
      if (mod && e.key === '=') { e.preventDefault(); zoomIn(); }
      if (mod && e.key === '-') { e.preventDefault(); zoomOut(); }
      if (mod && e.key === '0') { e.preventDefault(); fitView({ duration: 300 }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, copy, paste, fitView, zoomIn, zoomOut]);

  return null;
}
\`\`\``,

  "performance": `# Performance Optimization

## Rules
1. **Define nodeTypes/edgeTypes outside the component** or useMemo — never inline.
2. **Use stable selectors** with Zustand to prevent unnecessary re-renders.
3. **Avoid useNodes/useEdges** in components that don't need the full array — use useNodesData(ids) instead.
4. **Enable onlyRenderVisibleElements** for large graphs (1000+ nodes).
5. **Use useReactFlow().getNodes()** for on-demand access instead of subscribing.

\`\`\`tsx
// BAD: re-renders on every node change
const nodes = useNodes();

// GOOD: only re-renders when specific node data changes
const nodeData = useNodesData('node-1');

// GOOD: on-demand access, no re-renders
const { getNodes } = useReactFlow();
const handleClick = () => {
  const nodes = getNodes();
};
\`\`\`

## Large graph settings
\`\`\`tsx
<ReactFlow
  onlyRenderVisibleElements
  minZoom={0.1}
  maxZoom={4}
  elevateNodesOnSelect={false}
  elevateEdgesOnSelect={false}
/>
\`\`\``,

  "dark-mode": `# Dark Mode with Tailwind

React Flow v12 supports \`colorMode\` prop:

\`\`\`tsx
<ReactFlow colorMode="dark" ... />
// or follow system:
<ReactFlow colorMode="system" ... />
\`\`\`

For Tailwind + shadcn, map CSS variables:
\`\`\`css
.react-flow.dark {
  --xy-background-color: hsl(var(--background));
  --xy-node-background-color: hsl(var(--card));
  --xy-node-border-color: hsl(var(--border));
  --xy-node-color: hsl(var(--card-foreground));
  --xy-edge-stroke: hsl(var(--muted-foreground));
  --xy-minimap-background: hsl(var(--card));
  --xy-controls-button-background: hsl(var(--card));
  --xy-controls-button-color: hsl(var(--card-foreground));
}
\`\`\``,

  ssr: `# SSR / SSG Setup

React Flow requires the DOM for measurement. For Next.js or other SSR frameworks:

\`\`\`tsx
'use client'; // Next.js app dir

import dynamic from 'next/dynamic';

const Flow = dynamic(() => import('./Flow'), { ssr: false });

export default function Page() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Flow />
    </div>
  );
}
\`\`\`

Or with React.lazy:
\`\`\`tsx
import { Suspense, lazy } from 'react';
const Flow = lazy(() => import('./Flow'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading flow...</div>}>
      <Flow />
    </Suspense>
  );
}
\`\`\``,

  subflows: `# SubFlows (Parent/Child Nodes)

\`\`\`tsx
const nodes = [
  {
    id: 'group-1',
    type: 'group',
    position: { x: 0, y: 0 },
    style: { width: 400, height: 300 },
    data: {},
  },
  {
    id: 'child-1',
    parentId: 'group-1',
    extent: 'parent' as const,  // constrain to parent bounds
    expandParent: true,          // auto-expand parent if needed
    position: { x: 20, y: 40 }, // relative to parent
    data: { label: 'Child 1' },
  },
  {
    id: 'child-2',
    parentId: 'group-1',
    extent: 'parent' as const,
    position: { x: 200, y: 40 },
    data: { label: 'Child 2' },
  },
];
\`\`\`

**Rules:**
- Parent nodes must appear before children in the nodes array.
- Child positions are relative to the parent.
- Use \`extent: 'parent'\` to keep children inside the parent bounds.
- Use \`expandParent: true\` for auto-expanding group.
- Set \`zIndexMode="auto"\` on ReactFlow for proper z-ordering in sub-flows.`,

  "edge-reconnection": `# Edge Reconnection

\`\`\`tsx
import { reconnectEdge } from '@xyflow/react';

function Flow() {
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  return (
    <ReactFlow
      edges={edges}
      onEdgesChange={onEdgesChange}
      edgesReconnectable
      onReconnect={onReconnect}
      onReconnectStart={(_, edge, handleType) => console.log('reconnect start', edge.id, handleType)}
      onReconnectEnd={(_, edge, handleType) => console.log('reconnect end', edge.id, handleType)}
    />
  );
}
\`\`\``,

  "custom-connection-line": `# Custom Connection Line

\`\`\`tsx
import type { ConnectionLineComponentProps } from '@xyflow/react';

function CustomConnectionLine({
  fromX, fromY, toX, toY, connectionStatus,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke={connectionStatus === 'valid' ? '#22c55e' : '#ef4444'}
        strokeWidth={2}
        d={\`M\${fromX},\${fromY} C \${fromX} \${toY} \${fromX} \${toY} \${toX},\${toY}\`}
      />
      <circle cx={toX} cy={toY} r={4} fill={connectionStatus === 'valid' ? '#22c55e' : '#ef4444'} />
    </g>
  );
}

// Usage:
<ReactFlow connectionLineComponent={CustomConnectionLine} />
\`\`\`

The \`connectionStatus\` is 'valid' when hovering over a compatible handle.`,

  "auto-layout-on-mount": `# Auto Layout on Mount

Use \`useNodesInitialized\` to wait for all nodes to be measured before running layout:

\`\`\`tsx
function LayoutFlow({ initialNodes, initialEdges }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const initialized = useNodesInitialized();

  useEffect(() => {
    if (!initialized) return;

    // Run layout (e.g., Dagre)
    const { nodes: layouted } = getLayoutedElements(nodes, edges, 'TB');
    setNodes(layouted);

    // Fit after layout settles
    requestAnimationFrame(() => fitView({ duration: 300 }));
  }, [initialized]);

  return (
    <ReactFlow
      nodes={nodes} edges={edges}
      onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
      fitView
    />
  );
}
\`\`\``,
};

// ---------------------------------------------------------------------------
// TEMPLATES
// ---------------------------------------------------------------------------

export const TEMPLATES = {
  "custom-node": `import { memo } from 'react';
import { Handle, Position, NodeToolbar, type NodeProps, type Node } from '@xyflow/react';

type CustomNodeData = {
  label: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'inactive' | 'error';
};

type CustomNodeType = Node<CustomNodeData, 'custom'>;

const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeType>) => {
  const statusColor = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    error: 'bg-red-500',
  }[data.status ?? 'inactive'];

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <button className="px-2 py-1 text-xs bg-white border rounded shadow">Edit</button>
        <button className="px-2 py-1 text-xs bg-red-50 border border-red-200 rounded shadow ml-1">Delete</button>
      </NodeToolbar>

      <Handle type="target" position={Position.Left} />

      <div className={\`px-4 py-3 rounded-lg border shadow-sm bg-white \${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}\`}>
        <div className="flex items-center gap-2">
          <div className={\`w-2 h-2 rounded-full \${statusColor}\`} />
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        {data.description && (
          <p className="text-xs text-gray-500 mt-1">{data.description}</p>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </>
  );
});

CustomNode.displayName = 'CustomNode';
export default CustomNode;`,

  "custom-edge": `import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow, type EdgeProps } from '@xyflow/react';

export default function CustomEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, style, markerEnd, selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
  });
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: \`translate(-50%, -50%) translate(\${labelX}px,\${labelY}px)\`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button
              className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
              onClick={() => setEdges((es) => es.filter((e) => e.id !== id))}
            >
              x
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}`,

  "zustand-store": `import { create } from 'zustand';
import {
  type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect,
  applyNodeChanges, applyEdgeChanges, addEdge,
} from '@xyflow/react';

export type FlowState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<Record<string, unknown>>) => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  removeNode: (id) => set({
    nodes: get().nodes.filter((n) => n.id !== id),
    edges: get().edges.filter((e) => e.source !== id && e.target !== id),
  }),
  updateNodeData: (id, data) => set({
    nodes: get().nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
  }),
}));

// Stable selector — use to prevent re-renders
export const flowSelector = (s: FlowState) => ({
  nodes: s.nodes,
  edges: s.edges,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect: s.onConnect,
});

export default useFlowStore;`,
};

// ---------------------------------------------------------------------------
// V12 MIGRATION GUIDE
// ---------------------------------------------------------------------------

export const V12_MIGRATION = `# React Flow v12 Migration Guide (from v11)

## Package Change
\`\`\`bash
# Remove old package
npm uninstall reactflow

# Install v12
npm install @xyflow/react
\`\`\`

## Import Changes
\`\`\`tsx
// v11 (OLD)
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// v12 (NEW)
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
\`\`\`

## Key Breaking Changes

| v11 | v12 |
|-----|-----|
| \`node.width\` / \`node.height\` | \`node.measured.width\` / \`node.measured.height\` |
| \`nodeInternals\` | \`nodeLookup\` |
| \`project()\` | \`screenToFlowPosition()\` |
| \`getNode(id)\` returns \`null\` | \`getNode(id)\` returns \`undefined\` |
| \`getEdge(id)\` returns \`null\` | \`getEdge(id)\` returns \`undefined\` |
| Default export | Named export: \`{ ReactFlow }\` |
| \`onEdgeUpdate\` | \`onReconnect\` |
| \`edgesUpdatable\` | \`edgesReconnectable\` |
| \`updateEdge()\` util | \`reconnectEdge()\` util |

## Type Changes
\`\`\`tsx
// v11: generic data in Node type
type MyNode = Node<{ label: string }>;

// v12: data AND type in generic
type MyNode = Node<{ label: string }, 'customType'>;
\`\`\`
`;
