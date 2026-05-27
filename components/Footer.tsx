import React, { useState } from "react";
import { TerminalIcon } from "./icons";

interface FooterProps {
  onCategorySelect: (category: string) => void;
  showToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect, showToast }) => {
  const [suggestion, setSuggestion] = useState("");

  const categories = [
    { label: "Converters", value: "converters" },
    { label: "Encoding & Crypto", value: "encoding" },
    { label: "Text & Code", value: "text" },
    { label: "CSS & Design", value: "css" },
    { label: "Generators", value: "generators" },
    { label: "Fun", value: "fun" },
  ];

  const handleCategoryClick = (val: string, e: React.MouseEvent) => {
    e.preventDefault();
    onCategorySelect(val);
    const element = document.getElementById("tools-grid-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    
    // Simulate suggestion save
    showToast(`Tool suggestion "${suggestion.trim()}" sent! Thank you.`);
    setSuggestion("");
  };

  return (
    <footer
      style={{
        backgroundColor: "#2C2C2A",
        color: "#F1EFE8",
        padding: "64px 0 24px 0",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1.5fr",
          gap: "48px",
          paddingBottom: "48px",
          borderBottom: "1px solid rgba(241, 239, 232, 0.1)",
        }}
      >
        {/* Left: Branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "24px",
              fontFamily: "var(--font-display)",
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
          >
            <TerminalIcon size={22} stroke="#FFFFFF" />
            <span>ByteKit</span>
          </a>
          <p style={{ color: "#888780", fontSize: "14px", maxWidth: "280px", lineHeight: "1.6" }}>
            Every tool a dev needs, right in the browser. Fast, 100% client-side, and privacy-first.
          </p>
          <span style={{ fontSize: "12px", color: "var(--accent)" }}>
            Built with love for devs ♥
          </span>
        </div>

        {/* Center: Quick links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Quick Links
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {categories.map((cat) => (
              <a
                key={cat.value}
                href={`#${cat.value}`}
                onClick={(e) => handleCategoryClick(cat.value, e)}
                style={{
                  fontSize: "14px",
                  color: "#888780",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888780")}
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Suggest a Tool */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h4
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Suggest a Tool
          </h4>
          <p style={{ color: "#888780", fontSize: "14px", lineHeight: "1.5" }}>
            Missing something? Tell us what utility you need, and we'll build it.
          </p>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <input
              type="text"
              placeholder="e.g. JWT Generator, Hex to RGB..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(241, 239, 232, 0.15)",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "14px",
                outline: "none",
                flex: 1,
              }}
            />
            <button
              type="submit"
              className="btn btn-accent"
              style={{
                borderRadius: "8px",
                height: "38px",
                padding: "0 16px",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
          fontSize: "13px",
          color: "#888780",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <span>ByteKit © 2025 · Free forever · Open Source</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="#" style={{ color: "inherit" }}>
            Privacy Policy
          </a>
          <a href="#" style={{ color: "inherit" }}>
            Terms of Use
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container:first-child {
            grid-template-columns: 1fr !important;
            gap: 36px;
          }
        }
      `}</style>
    </footer>
  );
};
