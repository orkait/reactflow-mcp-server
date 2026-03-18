import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { register as listApis } from "./list-apis.js";
import { register as getApi } from "./get-api.js";
import { register as searchDocs } from "./search-docs.js";
import { register as getExamples } from "./get-examples.js";
import { register as getPattern } from "./get-pattern.js";
import { register as getTemplate } from "./get-template.js";
import { register as getMigrationGuide } from "./get-migration-guide.js";
import { register as generateFlow } from "./generate-flow.js";
import { register as cheatsheet } from "./cheatsheet.js";

export function registerAll(server: McpServer): void {
  listApis(server);
  getApi(server);
  searchDocs(server);
  getExamples(server);
  getPattern(server);
  getTemplate(server);
  getMigrationGuide(server);
  generateFlow(server);
  cheatsheet(server);
}
