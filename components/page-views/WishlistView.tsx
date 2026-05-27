import React from "react";
import { HeartIcon } from "../icons";
import { ToolDefinition } from "../tools/registry";
import { ToolCard } from "./CategoryView";

interface WishlistViewProps {
  tools: ToolDefinition[];
  searchQuery: string;
  onToolSelect: (tool: ToolDefinition) => void;
  onToggleWishlist: (tool: ToolDefinition) => void;
  onBrowseTools: () => void;
  onClearSearch: () => void;
  onClearWishlist: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  tools,
  searchQuery,
  onToolSelect,
  onToggleWishlist,
  onBrowseTools,
  onClearSearch,
  onClearWishlist,
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
              color: "var(--primary)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Saved Tools
          </span>
          <h2 style={{ fontSize: "32px", fontFamily: "var(--font-display)" }}>
            {isSearchMode ? `Wishlist Results for "${searchQuery}"` : "Your Wishlist"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "8px" }}>
            Keep your most-used tools one tap away.
          </p>
        </div>
        {tools.length > 0 && (
          <button className="btn btn-ghost saved-page-clear" onClick={onClearWishlist}>
            Clear Wishlist
          </button>
        )}
      </div>

      {tools.length > 0 ? (
        <div className="tools-grid-layout">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isWishlisted
              onToolSelect={onToolSelect}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="saved-view-empty">
          <div className="saved-view-icon">
            <HeartIcon size={24} fill="none" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
            {isSearchMode ? "No saved tools matched that search" : "Your wishlist is empty"}
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, maxWidth: "360px" }}>
            {isSearchMode
              ? "Try a different keyword or clear the search to see all saved tools."
              : "Tap the heart on any tool card to save it here for quick access later."}
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
