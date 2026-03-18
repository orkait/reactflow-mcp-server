import type { ApiEntry } from "./types.js";
import { COMPONENT_APIS } from "./components.js";
import { HOOK_APIS } from "./hooks.js";
import { UTILITY_APIS } from "./utilities.js";
import { TYPE_APIS } from "./api-types.js";

export const ALL_APIS: ApiEntry[] = [
  ...COMPONENT_APIS,
  ...HOOK_APIS,
  ...UTILITY_APIS,
  ...TYPE_APIS,
];
