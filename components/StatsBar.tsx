import React from "react";

export const StatsBar: React.FC = () => {
  const stats = [
    { value: "40+", label: "Developer Tools" },
    { value: "100%", label: "Free & Open Source" },
    { value: "0", label: "Sign-ups or Databases" },
    { value: "Offline", label: "Ready & Secure" },
  ];

  return (
    <section
      style={{
        backgroundColor: "var(--primary)",
        color: "#FFFFFF",
        padding: "32px 0",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              borderRight: idx < stats.length - 1 ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
              padding: "0 16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "36px",
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 0;
          }
          div:nth-child(2) {
            border-right: none !important;
          }
          div {
            border-right: none !important;
          }
        }
        @media (max-width: 480px) {
          .container {
            grid-template-columns: 1fr !important;
            gap: 20px 0;
          }
        }
      `}</style>
    </section>
  );
};
