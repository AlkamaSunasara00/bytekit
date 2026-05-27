import React from "react";
import { SearchIcon, CloseIcon, GitBranchIcon, HeartIcon, ClockIcon } from "./icons";
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
  wishlistCount = 0,
  historyCount = 0,
}) => {
  const handleGitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterSelect("git");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterSelect("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterSelect("wishlist");
  };

  const handleHistoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFilterSelect("history");
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
              width: "100px",
              height: "100px",
              objectFit: "contain",
              borderRadius: "6px",
            }}
          />
        </a>

        {/* CENTER: Search Bar */}
        <div style={{ position: "relative", width: "340px" }}>
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

        {/* RIGHT: Navigation Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* History Button */}
          <button
            onClick={handleHistoryClick}
            className={`navbar-action-btn ${activeFilter === "history" ? "active" : ""}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              height: "38px",
              padding: "0 14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "1px solid",
              borderColor: activeFilter === "history" ? "rgba(83, 74, 183, 0.2)" : "#E5E4DD",
              background: activeFilter === "history" ? "var(--primary-light)" : "transparent",
              color: activeFilter === "history" ? "var(--primary)" : "var(--text)",
            }}
          >
            <ClockIcon size={16} />
            <span>History</span>
            {historyCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "var(--primary)",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  lineHeight: "1",
                }}
              >
                {historyCount}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`navbar-action-btn ${activeFilter === "wishlist" ? "active" : ""}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              height: "38px",
              padding: "0 14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "1px solid",
              borderColor: activeFilter === "wishlist" ? "rgba(83, 74, 183, 0.2)" : "#E5E4DD",
              background: activeFilter === "wishlist" ? "var(--primary-light)" : "transparent",
              color: activeFilter === "wishlist" ? "var(--primary)" : "var(--text)",
            }}
          >
            <HeartIcon size={16} fill={activeFilter === "wishlist" ? "currentColor" : "none"} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "var(--primary)",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  lineHeight: "1",
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Git Guide Button */}
          <button
            onClick={handleGitClick}
            className={`git-guide-btn ${activeFilter === "git" ? "active" : ""}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: activeFilter === "git" ? "var(--primary-light)" : "#534AB7",
              color: activeFilter === "git" ? "var(--primary)" : "#FFFFFF",
              border: activeFilter === "git" ? "1px solid rgba(83, 74, 183, 0.2)" : "none",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              height: "38px",
              padding: "0 16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <GitBranchIcon size={16} />
            <span>Git Guide</span>
          </button>
        </div>
      </div>

      {/* Mobile Navbar (Width <= 768px) */}
      <div className="container mobile-navbar" style={{ display: "none", flexDirection: "column", padding: "12px 16px", gap: "12px" }}>
        {/* Row 1: Logo left + Action buttons right */}
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

          {/* Action Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* History Mobile Icon */}
            <button
              onClick={handleHistoryClick}
              title="History"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: activeFilter === "history" ? "rgba(83, 74, 183, 0.2)" : "#E5E4DD",
                background: activeFilter === "history" ? "var(--primary-light)" : "transparent",
                color: activeFilter === "history" ? "var(--primary)" : "var(--text)",
                position: "relative",
              }}
            >
              <ClockIcon size={16} />
              {historyCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    background: "var(--primary)",
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                  }}
                >
                  {historyCount}
                </span>
              )}
            </button>

            {/* Wishlist Mobile Icon */}
            <button
              onClick={handleWishlistClick}
              title="Wishlist"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: activeFilter === "wishlist" ? "rgba(83, 74, 183, 0.2)" : "#E5E4DD",
                background: activeFilter === "wishlist" ? "var(--primary-light)" : "transparent",
                color: activeFilter === "wishlist" ? "var(--primary)" : "var(--text)",
                position: "relative",
              }}
            >
              <HeartIcon size={16} fill={activeFilter === "wishlist" ? "currentColor" : "none"} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    background: "var(--primary)",
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Git Mobile Icon */}
            <button
              onClick={handleGitClick}
              title="Git Guide"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: activeFilter === "git" ? "var(--primary-light)" : "#534AB7",
                color: activeFilter === "git" ? "var(--primary)" : "#FFFFFF",
                border: activeFilter === "git" ? "1px solid rgba(83, 74, 183, 0.2)" : "none",
              }}
            >
              <GitBranchIcon size={16} />
            </button>
          </div>
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
          color: #FFFFFF !important;
        }
        
        .git-guide-btn.active:hover {
          background: var(--primary-light) !important;
          color: var(--primary) !important;
        }

        .navbar-action-btn:hover {
          background: #F6F5F0 !important;
          border-color: #C8C7BE !important;
        }

        .navbar-action-btn.active:hover {
          background: var(--primary-light) !important;
          border-color: rgba(83, 74, 183, 0.2) !important;
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

