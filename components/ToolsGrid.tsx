import React from "react";
import { SearchIcon } from "./icons";
import { CategoryView } from "./page-views/CategoryView";
import { HistoryView } from "./page-views/HistoryView";
import { WishlistView } from "./page-views/WishlistView";
import { ToolFilter, ToolHistoryEntry } from "./page-views/types";
import { ToolDefinition, TOOLS } from "./tools/registry";

interface ToolsGridProps {
  activeFilter: ToolFilter;
  onFilterSelect: (filter: ToolFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToolSelect: (tool: ToolDefinition) => void;
  wishlistIds: number[];
  historyEntries: ToolHistoryEntry[];
  onToggleWishlist: (tool: ToolDefinition) => void;
  onClearWishlist: () => void;
  onClearHistory: () => void;
}

const categories: Array<{ label: string; value: ToolFilter }> = [
  { label: "All", value: "all" },
  { label: "Converters", value: "converters" },
  { label: "Encoding", value: "encoding" },
  { label: "Text", value: "text" },
  { label: "CSS", value: "css" },
  { label: "Generators", value: "generators" },
  { label: "Fun", value: "fun" },
  { label: "Wishlist", value: "wishlist" },
  { label: "History", value: "history" },
];

export const ToolsGrid: React.FC<ToolsGridProps> = ({
  activeFilter,
  onFilterSelect,
  searchQuery,
  onSearchChange,
  onToolSelect,
  wishlistIds,
  historyEntries,
  onToggleWishlist,
  onClearWishlist,
  onClearHistory,
}) => {
  const normalizedQuery = searchQuery.toLowerCase();

  const wishlistTools = TOOLS.filter((tool) => wishlistIds.includes(tool.id)).filter((tool) => {
    if (!searchQuery) {
      return true;
    }

    return (
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery)
    );
  });

  const historyTools = historyEntries
    .map((entry) => {
      const tool = TOOLS.find((candidate) => candidate.id === entry.toolId);
      return tool ? { tool, lastOpenedAt: entry.lastOpenedAt, openCount: entry.openCount } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .filter((entry) => {
      if (!searchQuery) {
        return true;
      }

      return (
        entry.tool.name.toLowerCase().includes(normalizedQuery) ||
        entry.tool.description.toLowerCase().includes(normalizedQuery)
      );
    });

  const activeCategory: "all" | "converters" | "encoding" | "text" | "css" | "generators" | "fun" =
    activeFilter === "git" || activeFilter === "wishlist" || activeFilter === "history"
      ? "all"
      : activeFilter;

  return (
    <section id="tools-grid-section" style={{ padding: "64px 0", backgroundColor: "var(--bg)" }}>
      <div className="sticky-filter-bar">
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}
        >
          <div className="filter-tabs-scroll" style={{ width: "100%" }}>
            {categories.map((category) => {
              const isActive = activeFilter === category.value;
              const countLabel =
                category.value === "wishlist"
                  ? wishlistIds.length
                  : category.value === "history"
                    ? historyEntries.length
                    : null;

              return (
                <button
                  key={category.value}
                  onClick={() => onFilterSelect(category.value)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "50px",
                    fontWeight: 600,
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    backgroundColor: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#FFFFFF" : "var(--muted)",
                    border: "1px solid",
                    borderColor: isActive ? "var(--primary)" : "var(--border)",
                  }}
                  onMouseEnter={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.03)";
                      event.currentTarget.style.color = "var(--text)";
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isActive) {
                      event.currentTarget.style.backgroundColor = "transparent";
                      event.currentTarget.style.color = "var(--muted)";
                    }
                  }}
                >
                  {category.label}
                  {countLabel !== null ? ` (${countLabel})` : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mobile-search-container" style={{ marginTop: "16px", display: "none" }}>
        <div className="container">
          <div style={{ position: "relative", width: "100%" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted)",
              }}
            >
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              placeholder="Search developer tools..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "var(--surface)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "40px" }}>
        {activeFilter === "wishlist" ? (
          <WishlistView
            tools={wishlistTools}
            searchQuery={searchQuery}
            onToolSelect={onToolSelect}
            onToggleWishlist={onToggleWishlist}
            onBrowseTools={() => onFilterSelect("all")}
            onClearSearch={() => onSearchChange("")}
            onClearWishlist={onClearWishlist}
          />
        ) : activeFilter === "history" ? (
          <HistoryView
            entries={historyTools}
            searchQuery={searchQuery}
            wishlistIds={wishlistIds}
            onToolSelect={onToolSelect}
            onToggleWishlist={onToggleWishlist}
            onBrowseTools={() => onFilterSelect("all")}
            onClearSearch={() => onSearchChange("")}
            onClearHistory={onClearHistory}
          />
        ) : (
          <CategoryView
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onCategorySelect={onFilterSelect}
            onSearchChange={onSearchChange}
            onToolSelect={onToolSelect}
            wishlistIds={wishlistIds}
            onToggleWishlist={onToggleWishlist}
          />
        )}
      </div>

      <style jsx global>{`
        .tools-grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .saved-view-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 24px;
          border-radius: 10px;
          border: 1px dashed var(--border);
          background-color: var(--surface);
          text-align: center;
          gap: 12px;
        }

        .saved-view-icon {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 992px) {
          .tools-grid-layout {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .tools-grid-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .mobile-search-container {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
};
