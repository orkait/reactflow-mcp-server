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
