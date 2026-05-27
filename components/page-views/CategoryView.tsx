import React from "react";
import { HeartIcon, IconMap, SearchIcon } from "../icons";
import { TOOLS, ToolDefinition } from "../tools/registry";
import { ToolCategory } from "./types";

interface ToolCardProps {
  tool: ToolDefinition;
  isWishlisted: boolean;
  onToolSelect: (tool: ToolDefinition) => void;
  onToggleWishlist: (tool: ToolDefinition) => void;
  meta?: React.ReactNode;
  badgeText?: string;
}

interface CategoryViewProps {
  activeCategory: "all" | ToolCategory;
  searchQuery: string;
  onCategorySelect: (category: "all" | ToolCategory) => void;
  onSearchChange: (query: string) => void;
  onToolSelect: (tool: ToolDefinition) => void;
  wishlistIds: number[];
  onToggleWishlist: (tool: ToolDefinition) => void;
}

const categoryTitles: Record<ToolCategory, string> = {
  converters: "Converters & Parsers",
  encoding: "Encoding & Cryptography",
  text: "Text & Code Utilities",
  css: "CSS & Design Builders",
  generators: "Content Generators",
  fun: "Developer Fun Utilities",
};

export const getCategoryColor = (category: ToolCategory) => {
  switch (category) {
    case "converters":
      return "var(--color-converters)";
    case "encoding":
      return "var(--color-encoding)";
    case "text":
      return "var(--color-text)";
    case "css":
      return "var(--color-css)";
    case "generators":
      return "var(--color-generators)";
    case "fun":
      return "var(--color-fun)";
    default:
      return "var(--primary)";
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isWishlisted,
  onToolSelect,
  onToggleWishlist,
  meta,
  badgeText,
}) => {
  const Icon = IconMap[tool.category];
  const color = getCategoryColor(tool.category);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToolSelect(tool);
    }
  };

  return (
    <div
      className="tool-card"
      role="button"
      tabIndex={0}
      onClick={() => onToolSelect(tool)}
      onKeyDown={handleKeyDown}
    >
      <span className="tool-card-top-line" style={{ backgroundColor: color }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          gap: "12px",
        }}
      >
        <div className="tool-card-icon-wrapper" style={{ backgroundColor: color }}>
          <Icon size={20} stroke="#FFFFFF" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            className="badge"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              color: "var(--muted)",
              fontSize: "10px",
              border: "1px solid var(--border)",
            }}
          >
            {badgeText || tool.category}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleWishlist(tool);
            }}
            aria-label={isWishlisted ? `Remove ${tool.name} from wishlist` : `Add ${tool.name} to wishlist`}
            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className="wishlist-button"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "999px",
              border: "1px solid",
              borderColor: isWishlisted ? "rgba(83, 74, 183, 0.28)" : "var(--border)",
              backgroundColor: isWishlisted ? "rgba(83, 74, 183, 0.1)" : "transparent",
              color: isWishlisted ? "var(--primary)" : "var(--muted)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HeartIcon size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <h3
              className="tool-card-title"
              style={{
                fontSize: "16px",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              margin: "0 0 6px 0",
            }}
          >
            {tool.name}
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              lineHeight: "1.4",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tool.description}
          </p>
        </div>
        {meta}
      </div>

      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--primary)",
          alignSelf: "flex-start",
        }}
      >
        Open Tool -&gt;
      </span>
    </div>
  );
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  activeCategory,
  searchQuery,
  onCategorySelect,
  onSearchChange,
  onToolSelect,
  wishlistIds,
  onToggleWishlist,
}) => {
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (activeCategory === "all" && !searchQuery) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
        {Object.entries(categoryTitles).map(([categoryKey, title]) => {
          const category = categoryKey as ToolCategory;
          const categoryTools = TOOLS.filter((tool) => tool.category === category);
          const color = getCategoryColor(category);

          return (
            <div key={category} className="tool-section-block" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="tool-section-heading">
                <span
                  style={{
                    color,
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {category}
                </span>
                <h2 style={{ fontSize: "32px", fontFamily: "var(--font-display)" }}>{title}</h2>
              </div>

              <div className="tools-grid-layout">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isWishlisted={wishlistIds.includes(tool.id)}
                    onToolSelect={onToolSelect}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="tool-section-heading">
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
          Filtered List
        </span>
        <h2 style={{ fontSize: "32px", fontFamily: "var(--font-display)" }}>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : activeCategory === "all"
              ? "Developer Tools"
              : categoryTitles[activeCategory]}
        </h2>
      </div>

      {filteredTools.length > 0 ? (
        <div className="tools-grid-layout">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isWishlisted={wishlistIds.includes(tool.id)}
              onToolSelect={onToolSelect}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="saved-view-empty">
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "999px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SearchIcon size={24} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
            No tools matched your search
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, maxWidth: "360px" }}>
            Try searching for keywords like Base64, JSON, Shadow, UUID, or Regex.
          </p>
          <button
            className="btn btn-outline"
            onClick={() => {
              onSearchChange("");
              onCategorySelect("all");
            }}
            style={{ marginTop: "8px" }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
