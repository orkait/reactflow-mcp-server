# React Flow MCP Server

MCP server that gives AI assistants accurate [React Flow](https://reactflow.dev) (`@xyflow/react`) v12 documentation, API references, enterprise patterns, and code generation.

<p align="center">
  <a href="https://www.npmjs.com/package/@orkait-ai/reactflow-mcp"><img src="https://img.shields.io/npm/v/@orkait-ai/reactflow-mcp" alt="npm" /></a>
  <a href="https://github.com/orkait/reactflow-mcp-server/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@orkait-ai/reactflow-mcp" alt="license" /></a>
</p>

## Tools

| Tool | Description |
|------|-------------|
| `list_apis` | Browse all 55 APIs grouped by kind (components, hooks, utilities, types) |
| `get_api` | Detailed reference for any API — props, usage, examples, tips |
| `search_docs` | Keyword search across all documentation and code examples |
| `get_examples` | Code examples by category (15 categories) |
| `get_pattern` | Enterprise patterns with full implementation (17 patterns) |
| `get_template` | Production-ready templates: custom-node, custom-edge, zustand-store |
| `get_migration_guide` | React Flow v11 to v12 migration guide |
| `generate_flow` | Generate a complete flow component from natural language |

## Resources

| Resource | URI |
|----------|-----|
| Cheatsheet | `reactflow://cheatsheet` |

## Patterns

zustand-store, undo-redo, drag-and-drop, auto-layout-dagre, auto-layout-elk, context-menu, copy-paste, save-restore, prevent-cycles, keyboard-shortcuts, performance, dark-mode, ssr, subflows, edge-reconnection, custom-connection-line, auto-layout-on-mount

## Install

### Claude Code

```bash
claude mcp add reactflow-mcp -- npx -y @orkait-ai/reactflow-mcp
```

### Claude Desktop / Cursor / Windsurf

Add to your MCP config:

```json
{
  "mcpServers": {
    "reactflow-mcp": {
      "command": "npx",
      "args": ["-y", "@orkait-ai/reactflow-mcp"]
    }
  }
}
```

### From source

```bash
git clone https://github.com/orkait/reactflow-mcp-server.git
cd reactflow-mcp-server
npm install
npm run build
npm start
```

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
npm start      # run server
```

## License

MIT
