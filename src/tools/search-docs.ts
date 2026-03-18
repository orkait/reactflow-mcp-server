import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ALL_APIS, CATEGORIES, PATTERN_SECTIONS, searchApis, formatExample } from "../data/index.js";

export function register(server: McpServer): void {
  server.tool(
    "search_docs",
    "Search React Flow documentation by keyword. Searches API names, descriptions, code examples, and tips.",
    {
      query: z
        .string()
        .describe(
          "Search query (e.g., 'custom node', 'drag and drop', 'viewport zoom', 'edge reconnect', 'zustand')",
        ),
    },
    async ({ query }) => {
      const results = searchApis(query, ALL_APIS);
      if (results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No results for "${query}". Try broader terms.\n\nAvailable categories: ${CATEGORIES.join(", ")}\nAvailable patterns: ${PATTERN_SECTIONS.join(", ")}`,
            },
          ],
        };
      }

      let text = `# Search results for "${query}"\n\n`;
      text += `Found ${results.length} API(s):\n\n`;
      for (const { api, matchingExamples } of results.slice(0, 10)) {
        text += `## ${api.name} (${api.kind})\n`;
        text += `${api.description}\n`;
        text += `Import: \`${api.importPath}\`\n\n`;

        if (matchingExamples.length > 0) {
          text += "**Relevant examples:**\n";
          for (const ex of matchingExamples.slice(0, 3)) {
            text += formatExample(ex);
          }
        }
        text += "---\n\n";
      }
      return { content: [{ type: "text", text }] };
    },
  );
}
