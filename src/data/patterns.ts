import type { PatternSection } from "./types.js";

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
