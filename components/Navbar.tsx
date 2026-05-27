import React, { useState } from "react";
import { CloseIcon, SearchIcon, HamburgerIcon, HeartIcon, ClockIcon } from "./icons";
import { ToolFilter } from "./page-views/types";

interface NavbarProps {
  activeFilter: ToolFilter;
  onFilterSelect: (filter: ToolFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  historyCount: number;
}

const navLinks: Array<{ label: string; value: ToolFilter }> = [
  { label: "Tools", value: "all" },
  { label: "Converters", value: "converters" },
  { label: "Generators", value: "generators" },
  { label: "CSS", value: "css" },
  { label: "Fun", value: "fun" },
];

const quickViews = [
  { label: "Wishlist", value: "wishlist", icon: HeartIcon },
  { label: "History", value: "history", icon: ClockIcon },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  activeFilter,
  onFilterSelect,
  searchQuery,
  onSearchChange,
  wishlistCount,
  historyCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const handleLinkClick = (value: ToolFilter) => {
    onFilterSelect(value);
    setMobileMenuOpen(false);

    const element = document.getElementById("tools-grid-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="navbar-sticky" style={{ zIndex: 999 }}>
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          position: "relative",
          gap: "16px",
        }}
      >
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            handleLinkClick("all");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "24px",
            fontFamily: "var(--font-display)",
            color: "#FFFFFF",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          <img
            src="/bytekit-logo.png"
            alt="ByteKit Logo"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </a>

        <div
          className="desktop-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            height: "100%",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {navLinks.map((link) => {
            const isActive = activeFilter === link.value;
            return (
              <a
                key={link.label}
                href={`#${link.value}`}
                onClick={(event) => {
                  event.preventDefault();
                  handleLinkClick(link.value);
                }}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isActive ? "var(--primary)" : "var(--text)",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  padding: "0 4px",
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "var(--primary)",
                    }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div
          className="desktop-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          {quickViews.map((view) => {
            const isActive = activeFilter === view.value;
            const Icon = view.icon;
            const count = view.value === "wishlist" ? wishlistCount : historyCount;

            return (
              <button
                key={view.value}
                onClick={() => handleLinkClick(view.value)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "1px solid",
                  borderColor: isActive ? "rgba(83, 74, 183, 0.2)" : "var(--border)",
                  backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--muted)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <Icon size={15} fill={view.value === "wishlist" && isActive ? "currentColor" : "none"} />
                <span>{view.label}</span>
                <span
                  style={{
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "999px",
                    backgroundColor: isActive ? "rgba(83, 74, 183, 0.12)" : "rgba(0, 0, 0, 0.05)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 6px",
                    color: "inherit",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {desktopSearchOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  autoFocus
                  style={{
                    width: "180px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                />
                <button
                  onClick={() => {
                    setDesktopSearchOpen(false);
                    onSearchChange("");
                  }}
                  style={{ color: "var(--muted)" }}
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDesktopSearchOpen(true)}
                style={{
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  borderRadius: "50%",
                }}
                aria-label="Search Tools"
              >
                <SearchIcon size={20} />
              </button>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => handleLinkClick("all")}
            style={{ borderRadius: "8px", height: "38px" }}
          >
            All Tools
          </button>
        </div>

        <div
          className="mobile-only"
          style={{
            display: "none",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: "var(--text)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <CloseIcon size={24} /> : <HamburgerIcon size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-only"
          style={{
            position: "absolute",
            top: "56px",
            left: 0,
            right: 0,
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.value}`}
                onClick={(event) => {
                  event.preventDefault();
                  handleLinkClick(link.value);
                }}
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: activeFilter === link.value ? "var(--primary)" : "var(--text)",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                }}
              >
                {link.label}
              </a>
            ))}
            {quickViews.map((view) => {
              const count = view.value === "wishlist" ? wishlistCount : historyCount;

              return (
                <a
                  key={view.value}
                  href={`#${view.value}`}
                  onClick={(event) => {
                    event.preventDefault();
                    handleLinkClick(view.value);
                  }}
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: activeFilter === view.value ? "var(--primary)" : "var(--text)",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span>{view.label}</span>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>{count}</span>
                </a>
              );
            })}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => handleLinkClick("all")}
            style={{ width: "100%" }}
          >
            All Tools
          </button>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 769px) {
          .desktop-only {
            display: flex !important;
          }

          .mobile-only {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};
