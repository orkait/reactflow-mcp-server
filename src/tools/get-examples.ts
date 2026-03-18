import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, CATEGORIES, getExamplesByCategory, formatExample, capitalize } from "../data/index.js";

export function register(server: McpServer): void {
  server.tool(
    "get_examples",
    "Get code examples for a specific React Flow category",
    {
      category: z
        .string()
        .describe(`Category: ${CATEGORIES.join(", ")}`),
    },
    async ({ category }) => {
      const examples = getExamplesByCategory(category, ALL_APIS);
      if (examples.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No examples for category "${category}". Available: ${CATEGORIES.join(", ")}`,
            },
          ],
        };
      }

      let text = `# ${capitalize(category)} Examples\n\n`;
      for (const ex of examples) {
        text += formatExample(ex, 2);
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
