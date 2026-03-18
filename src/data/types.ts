// ---------------------------------------------------------------------------
// React Flow MCP — Data Layer
// All API documentation, examples, patterns, and templates for @xyflow/react v12
// ---------------------------------------------------------------------------

export interface ApiEntry {
  name: string;
  kind: ApiKind;
  description: string;
  importPath: string;
  props?: PropEntry[];
  returns?: string;
  usage: string;
  examples: Example[];
  tips?: string[];
  relatedApis?: string[];
}

export interface PropEntry {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface Example {
  title: string;
  code: string;
  description?: string;
  category: Category;
}

export interface SearchResult {
  api: ApiEntry;
  matchingExamples: Example[];
}

export const CATEGORIES = [
  "quickstart",
  "custom-nodes",
  "custom-edges",
  "layout",
  "drag-and-drop",
  "state-management",
  "viewport",
  "connections",
  "interaction",
  "subflows",
  "performance",
  "styling",
  "undo-redo",
  "save-restore",
  "accessibility",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const API_KINDS = ["component", "hook", "utility", "type"] as const;
export type ApiKind = (typeof API_KINDS)[number];

export const PATTERN_SECTIONS = [
  "zustand-store",
  "undo-redo",
  "drag-and-drop",
  "auto-layout-dagre",
  "auto-layout-elk",
  "context-menu",
  "copy-paste",
  "save-restore",
  "prevent-cycles",
  "keyboard-shortcuts",
  "performance",
  "dark-mode",
  "ssr",
  "subflows",
  "edge-reconnection",
  "custom-connection-line",
  "auto-layout-on-mount",
] as const;

export type PatternSection = (typeof PATTERN_SECTIONS)[number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatExample(ex: Example, headingLevel = 3): string {
  const prefix = "#".repeat(headingLevel);
  let out = `${prefix} ${ex.title}\n`;
  if (ex.description) out += `${ex.description}\n\n`;
  out += `\`\`\`tsx\n${ex.code}\n\`\`\`\n\n`;
  return out;
}

export function formatApiReference(api: ApiEntry): string {
  let text = `# ${api.name} (${api.kind})\n\n`;
  text += `${api.description}\n\n`;
  text += `**Import:** \`${api.importPath}\`\n\n`;

  if (api.returns) {
    text += `**Returns:** \`${api.returns}\`\n\n`;
  }

  if (api.props && api.props.length > 0) {
    text += `## Props / Parameters\n\n`;
    text += `| Name | Type | Default | Description |\n`;
    text += `|------|------|---------|-------------|\n`;
    for (const p of api.props) {
      text += `| ${p.name} | \`${p.type}\` | ${p.default ?? "—"} | ${p.description} |\n`;
    }
    text += "\n";
  }

  text += `## Usage\n\n\`\`\`tsx\n${api.usage}\n\`\`\`\n\n`;

  if (api.examples.length > 0) {
    text += `## Examples\n\n`;
    for (const ex of api.examples) {
      text += formatExample(ex);
    }
  }

  if (api.tips && api.tips.length > 0) {
    text += `## Tips\n\n`;
    for (const tip of api.tips) {
      text += `- ${tip}\n`;
    }
    text += "\n";
  }

  if (api.relatedApis && api.relatedApis.length > 0) {
    text += `## Related APIs\n\n${api.relatedApis.join(", ")}\n`;
  }

  return text;
}

export function searchApis(query: string, allApis: ApiEntry[]): SearchResult[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const api of allApis) {
    const haystack = [
      api.name,
      api.description,
      api.kind,
      api.usage,
      ...(api.tips ?? []),
      ...api.examples.map((e) => `${e.title} ${e.description ?? ""} ${e.code}`),
    ]
      .join(" ")
      .toLowerCase();

    const score = tokens.reduce((s, t) => s + (haystack.includes(t) ? 1 : 0), 0);
    if (score > 0) {
      const matchingExamples = api.examples.filter((ex) => {
        const exHay = `${ex.title} ${ex.description ?? ""} ${ex.code}`.toLowerCase();
        return tokens.some((t) => exHay.includes(t));
      });
      results.push({ api, matchingExamples });
    }
  }

  results.sort((a, b) => {
    const aScore = tokens.reduce(
      (s, t) => s + (`${a.api.name} ${a.api.description}`.toLowerCase().includes(t) ? 2 : 0),
      0,
    );
    const bScore = tokens.reduce(
      (s, t) => s + (`${b.api.name} ${b.api.description}`.toLowerCase().includes(t) ? 2 : 0),
      0,
    );
    return bScore - aScore;
  });

  return results;
}

export function getApiByName(name: string, allApis: ApiEntry[]): ApiEntry | undefined {
  const normalized = name.toLowerCase().replace(/[<>/()]/g, "").trim();
  return allApis.find(
    (a) =>
      a.name.toLowerCase() === normalized ||
      a.name.toLowerCase().replace(/[<>/()]/g, "") === normalized,
  );
}

export function getExamplesByCategory(category: string, allApis: ApiEntry[]): Example[] {
  const cat = category.toLowerCase().trim();
  const examples: Example[] = [];
  for (const api of allApis) {
    for (const ex of api.examples) {
      if (ex.category === cat) {
        examples.push(ex);
      }
    }
  }
  return examples;
}
