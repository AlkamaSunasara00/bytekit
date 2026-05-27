"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { StatsBar } from "../components/StatsBar";
import { ToolsGrid } from "../components/ToolsGrid";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { Toast, ToastItem } from "../components/Toast";
import { HeartIcon } from "../components/icons";
import { ToolFilter, ToolHistoryEntry } from "../components/page-views/types";
import { ToolDefinition, TOOLS } from "../components/tools/registry";
import { GitGuideView } from "../components/page-views/GitGuideView";

const STORAGE_KEYS = {
  wishlist: "bytekit:wishlist",
  history: "bytekit:history",
} as const;

const HISTORY_LIMIT = 12;
const VALID_TOOL_IDS = new Set(TOOLS.map((tool) => tool.id));

const VALID_FILTERS: ToolFilter[] = [
  "all",
  "converters",
  "encoding",
  "text",
  "css",
  "generators",
  "fun",
  "wishlist",
  "history",
  "git",
];

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

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<ToolFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [historyEntries, setHistoryEntries] = useState<ToolHistoryEntry[]>([]);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as ToolFilter;
      if (VALID_FILTERS.includes(hash)) {
        setActiveFilter(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

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

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistIds));
  }, [hasLoadedStorage, wishlistIds]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyEntries));
  }, [hasLoadedStorage, historyEntries]);

  const handleFilterSelect = (filter: ToolFilter) => {
    setActiveFilter(filter);
    window.location.hash = filter;
  };

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2000);
  };

  const handleToolSelect = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setHistoryEntries((prev) => updateHistory(prev, tool.id));
  };

  const handleToggleWishlist = (tool: ToolDefinition) => {
    const isSaved = wishlistIds.includes(tool.id);

    setWishlistIds((prev) =>
      isSaved ? prev.filter((toolId) => toolId !== tool.id) : [tool.id, ...prev]
    );
    showToast(isSaved ? `${tool.name} removed from wishlist.` : `${tool.name} saved to wishlist.`);
  };

  const handleClearWishlist = () => {
    setWishlistIds([]);
    showToast("Wishlist cleared.");
  };

  const handleClearHistory = () => {
    setHistoryEntries([]);
    showToast("History cleared.");
  };

  const activeToolIsWishlisted = activeTool ? wishlistIds.includes(activeTool.id) : false;

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg)",
      }}
    >
      <Navbar
        activeFilter={activeFilter}
        onFilterSelect={handleFilterSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistCount={wishlistIds.length}
        historyCount={historyEntries.length}
      />

      {activeFilter === "git" ? (
        <GitGuideView onBack={() => handleFilterSelect("all")} showToast={showToast} />
      ) : (
        <>
          <Hero />
          <StatsBar />

          <ToolsGrid
            activeFilter={activeFilter}
            onFilterSelect={handleFilterSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToolSelect={handleToolSelect}
            wishlistIds={wishlistIds}
            historyEntries={historyEntries}
            onToggleWishlist={handleToggleWishlist}
            onClearWishlist={handleClearWishlist}
            onClearHistory={handleClearHistory}
          />
        </>
      )}

      <Footer onFilterSelect={handleFilterSelect} showToast={showToast} />

      <Modal
        isOpen={activeTool !== null}
        onClose={() => setActiveTool(null)}
        title={activeTool?.name || ""}
        actions={
          activeTool ? (
            <button
              type="button"
              onClick={() => handleToggleWishlist(activeTool)}
              className="btn btn-ghost"
              aria-label={
                activeToolIsWishlisted
                  ? `Remove ${activeTool.name} from wishlist`
                  : `Add ${activeTool.name} to wishlist`
              }
              style={{
                height: "36px",
                padding: "0 14px",
                border: "1px solid",
                borderColor: activeToolIsWishlisted ? "rgba(83, 74, 183, 0.2)" : "var(--border)",
                backgroundColor: activeToolIsWishlisted ? "var(--primary-light)" : "transparent",
                color: activeToolIsWishlisted ? "var(--primary)" : "var(--muted)",
              }}
            >
              <HeartIcon size={15} fill={activeToolIsWishlisted ? "currentColor" : "none"} />
              {activeToolIsWishlisted ? "Saved" : "Save"}
            </button>
          ) : null
        }
      >
        {activeTool && <activeTool.component showToast={showToast} />}
      </Modal>

      <Toast toasts={toasts} />
    </div>
  );
}
