import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, capitalize, API_KINDS } from "../data/index.js";

export function register(server: McpServer): void {
  server.tool(
    "list_apis",
    "List all React Flow v12 APIs — components, hooks, utilities, and types",
    {
      kind: z
        .enum(["all", "component", "hook", "utility", "type"] as const)
        .optional()
        .describe("Filter by API kind: component, hook, utility, type"),
    },
    async ({ kind }) => {
      const apis =
        kind && kind !== "all"
          ? ALL_APIS.filter((a) => a.kind === kind)
          : ALL_APIS;

      const grouped: Record<string, string[]> = {};
      for (const api of apis) {
        const k = api.kind;
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(`${api.name} — ${api.description.split(".")[0]}`);
      }

      let text = "# React Flow v12 — API Reference\n\n";
      text += `Import from \`@xyflow/react\`\n\n`;
      for (const [kind, items] of Object.entries(grouped)) {
        text += `## ${capitalize(kind)}s (${items.length})\n`;
        for (const item of items) {
          text += `- ${item}\n`;
        }
        text += "\n";
      }
      text += `\n**Total:** ${apis.length} APIs`;
      return { content: [{ type: "text", text }] };
    },
  );
}
