import React from "react";
import { ClockIcon } from "../icons";
import { ToolCard } from "./CategoryView";
import { HistoryToolEntry } from "./types";

interface HistoryViewProps {
  entries: HistoryToolEntry[];
  searchQuery: string;
  wishlistIds: number[];
  onToolSelect: (tool: HistoryToolEntry["tool"]) => void;
  onToggleWishlist: (tool: HistoryToolEntry["tool"]) => void;
  onBrowseTools: () => void;
  onClearSearch: () => void;
  onClearHistory: () => void;
}

const formatLastOpened = (dateString: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));

export const HistoryView: React.FC<HistoryViewProps> = ({
  entries,
  searchQuery,
  wishlistIds,
  onToolSelect,
  onToggleWishlist,
  onBrowseTools,
  onClearSearch,
  onClearHistory,
}) => {
  const isSearchMode = Boolean(searchQuery);

  return (
    <div className="saved-page-view" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        className="saved-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span
            style={{
              color: "var(--accent)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Recent Activity
          </span>
          <h2 style={{ fontSize: "32px", fontFamily: "var(--font-display)" }}>
            {isSearchMode ? `History Results for "${searchQuery}"` : "Recently Opened"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "8px" }}>
            Reopen the tools you were just working in.
          </p>
        </div>
        {entries.length > 0 && (
          <button className="btn btn-ghost saved-page-clear" onClick={onClearHistory}>
            Clear History
          </button>
        )}
      </div>

      {entries.length > 0 ? (
        <div className="tools-grid-layout">
          {entries.map((entry) => (
            <ToolCard
              key={entry.tool.id}
              tool={entry.tool}
              isWishlisted={wishlistIds.includes(entry.tool.id)}
              onToolSelect={onToolSelect}
              onToggleWishlist={onToggleWishlist}
              badgeText={`${entry.openCount}x opened`}
              meta={
                <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                  Last opened {formatLastOpened(entry.lastOpenedAt)}
                </p>
              }
            />
          ))}
        </div>
      ) : (
        <div className="saved-view-empty">
          <div className="saved-view-icon">
            <ClockIcon size={24} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
            {isSearchMode ? "No recent tools matched that search" : "No history yet"}
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, maxWidth: "360px" }}>
            {isSearchMode
              ? "Clear the search to see all recently opened tools."
              : "Open any tool and it will show up here automatically."}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            {isSearchMode && (
              <button className="btn btn-outline" onClick={onClearSearch}>
                Clear Search
              </button>
            )}
            <button className="btn btn-primary" onClick={onBrowseTools}>
              Browse Tools
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
