import React from "react";
import { TOOLS, ToolDefinition } from "./tools/registry";
import { IconMap, SearchIcon } from "./icons";

interface ToolsGridProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToolSelect: (tool: ToolDefinition) => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({
  activeCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  onToolSelect,
}) => {
  const categories = [
    { label: "All", value: "all" },
    { label: "Converters", value: "converters" },
    { label: "Encoding", value: "encoding" },
    { label: "Text", value: "text" },
    { label: "CSS", value: "css" },
    { label: "Generators", value: "generators" },
    { label: "Fun", value: "fun" },
  ];

  // Map category values to display titles
  const categoryTitles: Record<string, string> = {
    converters: "Converters & Parsers",
    encoding: "Encoding & Cryptography",
    text: "Text & Code Utilities",
    css: "CSS & Design Builders",
    generators: "Content Generators",
    fun: "Developer Fun Utilities",
  };

  // Filter tools based on selected category and live search query
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
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

  return (
    <section id="tools-grid-section" style={{ padding: "64px 0", backgroundColor: "var(--bg)" }}>
      {/* Category Filter Tabs (Sticky below nav) */}
      <div className="sticky-filter-bar">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div className="filter-tabs-scroll" style={{ width: "100%" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onCategorySelect(cat.value)}
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
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.03)";
                      e.currentTarget.style.color = "var(--text)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--muted)";
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Search Bar */}
      <div className="mobile-search-container" style={{ marginTop: "16px", display: "none" }}>
        <div className="container">
          <div style={{ position: "relative", width: "100%" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              placeholder="Search all developer tools..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "14px",
                backgroundColor: "var(--surface)"
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="container" style={{ marginTop: "40px" }}>
        {/* Render segmented list if viewing "All" and no search query */}
        {activeCategory === "all" && !searchQuery ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
            {Object.keys(categoryTitles).map((catKey) => {
              const catTools = TOOLS.filter((t) => t.category === catKey);
              const color = getCategoryColor(catKey);

              return (
                <div key={catKey} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <span
                      style={{
                        color: color,
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      {catKey}
                    </span>
                    <h2 style={{ fontSize: "32px", fontFamily: "var(--font-display)" }}>
                      {categoryTitles[catKey]}
                    </h2>
                  </div>

                  <div className="tools-grid-layout">
                    {catTools.map((tool) => {
                      const Icon = IconMap[tool.category];
                      return (
                        <div key={tool.id} className="tool-card" onClick={() => onToolSelect(tool)}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                            <div className="tool-card-icon-wrapper" style={{ backgroundColor: color }}>
                              <Icon size={20} stroke="#FFFFFF" />
                            </div>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.03)",
                                color: "var(--muted)",
                                fontSize: "10px",
                                border: "1px solid var(--border)",
                              }}
                            >
                              {tool.category}
                            </span>
                          </div>
                          <div>
                            <h3 style={{ fontSize: "16px", fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--text)", margin: "0 0 6px 0" }}>
                              {tool.name}
                            </h3>
                            <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.4", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {tool.description}
                            </p>
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", alignSelf: "flex-start" }}>
                            Open Tool →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Filtered Flat Grid View */
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                Filtered List
              </span>
              <h2 style={{ fontSize: "32px", fontFamily: "var(--font-display)" }}>
                {searchQuery ? `Search Results for "${searchQuery}"` : categoryTitles[activeCategory] || "Developer Tools"}
              </h2>
            </div>

            {filteredTools.length > 0 ? (
              <div className="tools-grid-layout">
                {filteredTools.map((tool) => {
                  const Icon = IconMap[tool.category];
                  const color = getCategoryColor(tool.category);
                  return (
                    <div key={tool.id} className="tool-card" onClick={() => onToolSelect(tool)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                        <div className="tool-card-icon-wrapper" style={{ backgroundColor: color }}>
                          <Icon size={20} stroke="#FFFFFF" />
                        </div>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            color: "var(--muted)",
                            fontSize: "10px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {tool.category}
                        </span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--text)", margin: "0 0 6px 0" }}>
                          {tool.name}
                        </h3>
                        <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: "1.4", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {tool.description}
                        </p>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", alignSelf: "flex-start" }}>
                        Open Tool →
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No matching results alert state */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "64px 24px",
                  borderRadius: "10px",
                  border: "1px dashed var(--border)",
                  backgroundColor: "var(--surface)",
                  textAlign: "center",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "32px" }}>🔍</div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>No tools matched your search</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, maxWidth: "340px" }}>
                  Try searching for keywords like "Base64", "JSON", "Shadow", "UUID", or "Regex".
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
        )}
      </div>

      <style jsx global>{`
        .tools-grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
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
