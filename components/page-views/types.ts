import { ToolDefinition } from "../tools/registry";

export type ToolCategory = ToolDefinition["category"];

export type ToolFilter = "all" | ToolCategory | "wishlist" | "history" | "git";

export interface ToolHistoryEntry {
  toolId: number;
  lastOpenedAt: string;
  openCount: number;
}

export interface HistoryToolEntry {
  tool: ToolDefinition;
  lastOpenedAt: string;
  openCount: number;
}
