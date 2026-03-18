import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, searchApis, getApiByName, formatApiReference } from "../data/index.js";

export function register(server: McpServer): void {
  server.tool(
    "get_api",
    "Get detailed API reference for a specific React Flow component, hook, utility, or type. Includes props, usage, examples, and tips.",
    {
      name: z
        .string()
        .describe(
          "API name (e.g., 'ReactFlow', 'useReactFlow', 'Handle', 'addEdge', 'Node', 'Edge', 'NodeProps')",
        ),
    },
    async ({ name }) => {
      const api = getApiByName(name, ALL_APIS);
      if (!api) {
        const suggestions = searchApis(name, ALL_APIS)
          .slice(0, 5)
          .map((r) => r.api.name);
        return {
          content: [
            {
              type: "text",
              text: `API "${name}" not found.${suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nAvailable APIs: ${ALL_APIS.map((a) => a.name).join(", ")}`,
            },
          ],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: formatApiReference(api) }] };
    },
  );
}
