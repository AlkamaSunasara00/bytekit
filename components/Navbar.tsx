import React from "react";
import { SearchIcon, CloseIcon, GitBranchIcon } from "./icons";
import { ToolFilter } from "./page-views/types";

interface NavbarProps {
  activeFilter: ToolFilter;
  onFilterSelect: (filter: ToolFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeFilter,
  onFilterSelect,
  searchQuery,
  onSearchChange,
}) => {
  const handleGitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterSelect("git");
    window.location.hash = "git";
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterSelect("all");
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="navbar-container" style={{ zIndex: 999 }}>
      {/* Desktop Navbar (Width > 768px) */}
      <div className="container desktop-navbar" style={{ height: "64px", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* LEFT: Logo "DevKit" */}
        <a
          href="#"
          onClick={handleLogoClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "22px",
            fontFamily: "var(--font-display)",
            color: "var(--primary)",
            fontWeight: "bold",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <img
            src="/bytekit-logo.png"
            alt="DevKit Logo"
            style={{
              width: "30px",
              height: "30px",
              objectFit: "contain",
              borderRadius: "6px",
            }}
          />
          <span style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 700 }}>DevKit</span>
        </a>

        {/* CENTER: Search Bar */}
        <div style={{ position: "relative", width: "380px" }}>
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888780",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search 40+ tools..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="navbar-search-input"
            style={{
              width: "100%",
              height: "40px",
              padding: "0 36px 0 38px",
              background: "#FAFAFA",
              border: "1px solid #E5E4DD",
              borderRadius: "8px",
              fontSize: "14px",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: "4px",
                cursor: "pointer",
                color: "#888780",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>

        {/* RIGHT: Git Guide Button */}
        <button
          onClick={handleGitClick}
          className="git-guide-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#534AB7",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: "8px",
            height: "38px",
            padding: "0 18px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <GitBranchIcon size={16} />
          <span>Git Guide</span>
        </button>
      </div>

      {/* Mobile Navbar (Width <= 768px) */}
      <div className="container mobile-navbar" style={{ display: "none", flexDirection: "column", padding: "12px 16px", gap: "12px" }}>
        {/* Row 1: Logo left + "Git Guide" button right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <a
            href="#"
            onClick={handleLogoClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "20px",
              fontFamily: "var(--font-display)",
              color: "var(--text)",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            <img
              src="/bytekit-logo.png"
              alt="DevKit Logo"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                borderRadius: "6px",
              }}
            />
            <span style={{ color: "var(--text)", fontFamily: "var(--font-body)", fontWeight: 700 }}>DevKit</span>
          </a>

          <button
            onClick={handleGitClick}
            className="git-guide-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#534AB7",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              borderRadius: "8px",
              height: "34px",
              padding: "0 14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <GitBranchIcon size={14} />
            <span>Git Guide</span>
          </button>
        </div>

        {/* Row 2: Search bar full width */}
        <div style={{ position: "relative", width: "100%" }}>
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888780",
              display: "flex",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search 40+ tools..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="navbar-search-input"
            style={{
              width: "100%",
              height: "40px",
              padding: "0 36px 0 38px",
              background: "#FAFAFA",
              border: "1px solid #E5E4DD",
              borderRadius: "8px",
              fontSize: "14px",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: "4px",
                cursor: "pointer",
                color: "#888780",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .navbar-container {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E4DD;
          width: 100%;
        }

        .desktop-navbar {
          display: flex;
        }

        .mobile-navbar {
          display: none;
        }

        .navbar-search-input::placeholder {
          color: #888780 !important;
          opacity: 1;
        }

        .navbar-search-input:focus {
          border: 1.5px solid #534AB7 !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 3px #EEEDFE !important;
          outline: none !important;
        }

        .git-guide-btn:hover {
          background: #3C3489 !important;
        }

        @media (max-width: 768px) {
          .desktop-navbar {
            display: none !important;
          }
          .mobile-navbar {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};
