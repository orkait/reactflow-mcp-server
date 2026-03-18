import type { ApiEntry } from "./types.js";

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
