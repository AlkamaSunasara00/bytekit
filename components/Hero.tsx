import React, { useState } from "react";

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"json" | "base64" | "uuid">("json");

  const handleExploreClick = () => {
    const element = document.getElementById("tools-grid-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-bg">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "560px",
          width: "100%",
          paddingTop: "64px",
          paddingBottom: "64px",
          gap: "48px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Left Side (60%) */}
        <div
          style={{
            flex: "0 0 58%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
          }}
        >
          {/* Badge */}
          <div
            className="badge"
            style={{
              backgroundColor: "rgba(29, 158, 117, 0.1)",
              color: "var(--accent)",
              border: "1px solid rgba(29, 158, 117, 0.2)",
              padding: "6px 12px",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            100% Free · No Login · No DB
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "52px",
              lineHeight: "1.15",
              color: "var(--text)",
              fontFamily: "var(--font-display)",
              margin: 0,
            }}
          >
            Every tool a dev
            <br />
            needs — right <span className="hero-wavy-underline">here</span>.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            JSON, Base64, Regex, UUID, CSS tools and more. All run directly in your
            browser. Zero backend tracking.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={handleExploreClick}
              className="btn btn-primary"
              style={{
                height: "48px",
                padding: "0 28px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
            >
              Explore Tools
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{
                height: "48px",
                padding: "0 28px",
                fontSize: "16px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              View on GitHub
            </a>
          </div>

          {/* Trust Line */}
          <div
            style={{
              fontSize: "13px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <span>40+ tools</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>Works offline</span>
            <span style={{ color: "var(--border)" }}>·</span>
            <span>Open source</span>
          </div>
        </div>

        {/* Right Side (40%) */}
        <div
          className="hero-visuals-container"
          style={{
            flex: "0 0 38%",
          }}
        >
          {/* Floating code card mockup */}
          <div
            className="float-mockup"
            style={{
              backgroundColor: "#1E1E2E",
              border: "1px solid #3a3a5c",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "420px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Terminal Window Header */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #2a2a3f",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#181824",
              }}
            >
              {/* Window buttons */}
              <div style={{ display: "flex", gap: "6px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#FF5F56",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#FFBD2E",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#27C93F",
                    display: "inline-block",
                  }}
                />
              </div>

              {/* Fake tab bar */}
              <div style={{ display: "flex", gap: "8px" }}>
                {(["json", "base64", "uuid"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "2px 8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        borderRadius: "4px",
                        backgroundColor: isActive ? "#2C2C4E" : "transparent",
                        color: isActive ? "#C9C7FD" : "#6E6D8F",
                        border: "1px solid",
                        borderColor: isActive ? "var(--primary)" : "transparent",
                        boxShadow: isActive ? "0 0 6px rgba(83, 74, 183, 0.4)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      {tab.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terminal Body */}
            <div
              style={{
                padding: "20px",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                lineHeight: "1.6",
                minHeight: "150px",
              }}
            >
              {activeTab === "json" && (
                <div>
                  <span style={{ color: "#89DCEB" }}>{"{"}</span>
                  <div style={{ paddingLeft: "16px" }}>
                    <span className="mockup-json-key">"status"</span>:{" "}
                    <span className="mockup-json-string">"success"</span>,
                    <br />
                    <span className="mockup-json-key">"clientSide"</span>:{" "}
                    <span className="mockup-json-number">true</span>,
                    <br />
                    <span className="mockup-json-key">"tools"</span>:{" "}
                    <span className="mockup-json-number">40</span>,
                    <br />
                    <span className="mockup-json-key">"db"</span>:{" "}
                    <span className="mockup-json-string">"none"</span>
                  </div>
                  <span style={{ color: "#89DCEB" }}>{"}"}</span>
                </div>
              )}

              {activeTab === "base64" && (
                <div>
                  <span style={{ color: "#6E6D8F" }}>// Encode string</span>
                  <br />
                  <span style={{ color: "#C6A0F6" }}>const</span> encoded ={" "}
                  <span className="mockup-json-string">"Qnl0ZUtpdA=="</span>;
                  <br />
                  <br />
                  <span style={{ color: "#6E6D8F" }}>// Decodes to</span>
                  <br />
                  <span style={{ color: "#8BD5CA" }}>"ByteKit"</span>
                </div>
              )}

              {activeTab === "uuid" && (
                <div>
                  <span style={{ color: "#6E6D8F" }}>// Bulk v4 UUIDs</span>
                  <br />
                  <span style={{ color: "#E06C75" }}>
                    8f42d2a1-ef4b-489e-9988-1c4b9d03828d
                  </span>
                  <br />
                  <span style={{ color: "#E06C75" }}>
                    b6d92cc9-9a74-4b53-b26a-9311e9fdfcf4
                  </span>
                  <br />
                  <span style={{ color: "#E06C75" }}>
                    3c5f4bfa-4001-4475-a8de-6b22b10a26cc
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          h1 {
            font-size: 38px !important;
          }
          p {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
};
