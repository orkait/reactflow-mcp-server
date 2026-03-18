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
