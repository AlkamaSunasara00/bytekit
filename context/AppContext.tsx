"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ToolDefinition, TOOLS } from "../components/tools/registry";
import { ToolFilter, ToolHistoryEntry } from "../components/page-views/types";
import { ToastItem } from "../components/Toast";

interface AppContextType {
  wishlistIds: number[];
  historyEntries: ToolHistoryEntry[];
  toasts: ToastItem[];
  activeTool: ToolDefinition | null;
  searchQuery: string;
  activeFilter: ToolFilter;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: ToolFilter) => void;
  showToast: (message: string) => void;
  openTool: (tool: ToolDefinition) => void;
  closeTool: () => void;
  toggleWishlist: (tool: ToolDefinition) => void;
  clearWishlist: () => void;
  clearHistory: () => void;
}

const STORAGE_KEYS = {
  wishlist: "bytekit:wishlist",
  history: "bytekit:history",
} as const;

const HISTORY_LIMIT = 12;
const VALID_TOOL_IDS = new Set(TOOLS.map((tool) => tool.id));

const AppContext = createContext<AppContextType | undefined>(undefined);

const isValidHistoryEntry = (value: unknown): value is ToolHistoryEntry => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const entry = value as Partial<ToolHistoryEntry>;
  return (
    typeof entry.toolId === "number" &&
    typeof entry.lastOpenedAt === "string" &&
    typeof entry.openCount === "number"
  );
};

const updateHistory = (entries: ToolHistoryEntry[], toolId: number): ToolHistoryEntry[] => {
  const existingEntry = entries.find((entry) => entry.toolId === toolId);
  const nextEntry: ToolHistoryEntry = {
    toolId,
    lastOpenedAt: new Date().toISOString(),
    openCount: existingEntry ? existingEntry.openCount + 1 : 1,
  };
  return [nextEntry, ...entries.filter((entry) => entry.toolId !== toolId)].slice(0, HISTORY_LIMIT);
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFilter, setActiveFilterState] = useState<ToolFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [historyEntries, setHistoryEntries] = useState<ToolHistoryEntry[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // Sync route hashes back to activeFilter on mount/hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as ToolFilter;
      const VALID_FILTERS: ToolFilter[] = ["all", "converters", "encoding", "text", "css", "generators", "fun", "wishlist", "history", "git"];
      if (VALID_FILTERS.includes(hash)) {
        setActiveFilterState(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Load from localStorage
  useEffect(() => {
    let nextWishlist: number[] = [];
    let nextHistory: ToolHistoryEntry[] = [];

    try {
      const savedWishlist = window.localStorage.getItem(STORAGE_KEYS.wishlist);
      const savedHistory = window.localStorage.getItem(STORAGE_KEYS.history);

      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          nextWishlist = parsedWishlist.filter(
            (toolId): toolId is number => typeof toolId === "number" && VALID_TOOL_IDS.has(toolId)
          );
        }
      }

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          nextHistory = parsedHistory.filter(
            (entry): entry is ToolHistoryEntry =>
              isValidHistoryEntry(entry) && VALID_TOOL_IDS.has(entry.toolId)
          );
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEYS.wishlist);
      window.localStorage.removeItem(STORAGE_KEYS.history);
    }

    const frame = window.requestAnimationFrame(() => {
      setWishlistIds(nextWishlist);
      setHistoryEntries(nextHistory);
      setHasLoadedStorage(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    if (!hasLoadedStorage) return;
    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistIds));
  }, [hasLoadedStorage, wishlistIds]);

  // Save history to localStorage
  useEffect(() => {
    if (!hasLoadedStorage) return;
    window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyEntries));
  }, [hasLoadedStorage, historyEntries]);

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  const openTool = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setHistoryEntries((prev) => updateHistory(prev, tool.id));
  };

  const closeTool = () => {
    setActiveTool(null);
  };

  const toggleWishlist = (tool: ToolDefinition) => {
    const isSaved = wishlistIds.includes(tool.id);
    setWishlistIds((prev) =>
      isSaved ? prev.filter((toolId) => toolId !== tool.id) : [tool.id, ...prev]
    );
    showToast(isSaved ? `${tool.name} removed from wishlist.` : `${tool.name} saved to wishlist.`);
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast("Wishlist cleared.");
  };

  const clearHistory = () => {
    setHistoryEntries([]);
    showToast("History cleared.");
  };

  const setActiveFilter = (filter: ToolFilter) => {
    setActiveFilterState(filter);
  };

  return (
    <AppContext.Provider
      value={{
        wishlistIds,
        historyEntries,
        toasts,
        activeTool,
        searchQuery,
        activeFilter,
        setSearchQuery,
        setActiveFilter,
        showToast,
        openTool,
        closeTool,
        toggleWishlist,
        clearWishlist,
        clearHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
