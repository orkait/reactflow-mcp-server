import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PATTERNS, PATTERN_SECTIONS } from "../data/index.js";

export function register(server: McpServer): void {
  server.tool(
    "get_pattern",
    "Get an enterprise React Flow pattern with full implementation code. Patterns include store architecture, undo/redo, drag-and-drop, auto-layout, context menus, copy/paste, save/restore, DAG validation, keyboard shortcuts, performance, dark mode, SSR, subflows, edge reconnection, and more.",
    {
      pattern: z
        .string()
        .describe(`Pattern name: ${PATTERN_SECTIONS.join(", ")}`),
    },
    async ({ pattern }) => {
      const key = pattern.toLowerCase().trim() as typeof PATTERN_SECTIONS[number];
      const content = PATTERNS[key];
      if (!content) {
        return {
          content: [
            {
              type: "text",
              text: `Pattern "${pattern}" not found. Available patterns:\n${PATTERN_SECTIONS.map((p) => `- ${p}`).join("\n")}`,
            },
          ],
          isError: true,
        };
      }
      return { content: [{ type: "text", text: content }] };
    },
  );
}
