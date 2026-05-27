import React, { useState } from "react";
import { TerminalIcon, HamburgerIcon, CloseIcon, SearchIcon } from "./icons";

interface NavbarProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);

  const navLinks = [
    { label: "Tools", value: "all" },
    { label: "Converters", value: "converters" },
    { label: "Generators", value: "generators" },
    { label: "CSS", value: "css" },
    { label: "Fun", value: "fun" },
  ];

  const handleLinkClick = (value: string) => {
    onCategorySelect(value);
    setMobileMenuOpen(false);
    
    // Smooth scroll to tools section
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
        }}
      >
        {/* Left: Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("all");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "24px",
            fontFamily: "var(--font-display)",
            color: "var(--primary)",
            fontWeight: "bold",
          }}
        >
          <TerminalIcon size={22} stroke="var(--primary)" />
          <span>ByteKit</span>
        </a>

        {/* Center: Nav links (Desktop) */}
        <div
          className="desktop-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            height: "100%",
          }}
        >
          {navLinks.map((link) => {
            const isActive =
              (link.value === "all" && activeCategory === "all") ||
              (link.value !== "all" && activeCategory === link.value);
            return (
              <a
                key={link.label}
                href={`#${link.value}`}
                onClick={(e) => {
                  e.preventDefault();
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

        {/* Right Actions (Desktop) */}
        <div
          className="desktop-only"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Search Icon / Input */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {desktopSearchOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
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

        {/* Mobile Hamburger & Actions */}
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

      {/* Mobile menu dropdown */}
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
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.value);
                }}
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color:
                    activeCategory === link.value ? "var(--primary)" : "var(--text)",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                }}
              >
                {link.label}
              </a>
            ))}
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

      {/* CSS overrides for desktop/mobile viewport responsiveness */}
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
