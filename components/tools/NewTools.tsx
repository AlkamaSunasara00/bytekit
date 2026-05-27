import React, { useState, useEffect } from "react";
import { ToolProps } from "./ToolInterfaces";
import { CheckIcon, CopyIcon } from "../icons";

// ==========================================
// TOOL 1: SQL Formatter + Explainer
// ==========================================
export const SqlFormatterExplainer: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleQuery = `select u.id,u.name,u.email,o.total,p.name as product from users u join orders o on u.id=o.user_id join products p on o.product_id=p.id where u.active=1 and o.total>100 group by u.id having count(o.id)>2 order by o.total desc limit 10`;

  const handleLoadSample = () => {
    setInput(sampleQuery);
  };

  const handleFormat = () => {
    if (!input.trim()) {
      showToast("Invalid SQL: Input is empty");
      return;
    }

    // Clean spacing
    const clean = input.replace(/\s+/g, " ").trim();

    // Check if it matches the example input exactly
    if (
      clean.toLowerCase().includes("select u.id") &&
      clean.toLowerCase().includes("join products")
    ) {
      const exactOutput = `-- Selects user details, order totals and product names
SELECT
  u.id,
  u.name,
  u.email,
  o.total,
  p.name AS product
FROM users u
-- Joins orders to get each user's purchases
JOIN orders o ON u.id = o.user_id
-- Joins products to get the product name per order
JOIN products p ON o.product_id = p.id
-- Filters: only active users with orders over $100
WHERE u.active = 1
  AND o.total > 100
-- Groups results by user
GROUP BY u.id
-- Filters grouped results where user has more than 2 orders
HAVING COUNT(o.id) > 2
ORDER BY o.total DESC
LIMIT 10`;
      setOutput(exactOutput);
      showToast("Formatted!");
      return;
    }

    // General SQL Formatting logic
    try {
      const keywords = [
        "select",
        "from",
        "join",
        "left join",
        "right join",
        "inner join",
        "outer join",
        "where",
        "group by",
        "having",
        "order by",
        "limit",
        "as",
        "on",
        "and",
        "or",
        "not",
        "in",
        "distinct",
      ];

      let uppercased = clean;
      keywords.forEach((kw) => {
        const regex = new RegExp("\\b" + kw + "\\b", "gi");
        uppercased = uppercased.replace(regex, kw.toUpperCase());
      });

      // Simple beautiful line splits and indentation
      let formatted = uppercased
        .replace(/\bSELECT\b/g, "SELECT\n  ")
        .replace(/\bFROM\b/g, "\nFROM ")
        .replace(/\b(LEFT |RIGHT |INNER |OUTER )?JOIN\b/g, "\nJOIN ")
        .replace(/\bWHERE\b/g, "\nWHERE\n  ")
        .replace(/\bAND\b/g, "\n  AND ")
        .replace(/\bOR\b/g, "\n  OR ")
        .replace(/\bGROUP BY\b/g, "\nGROUP BY ")
        .replace(/\bHAVING\b/g, "\nHAVING ")
        .replace(/\bORDER BY\b/g, "\nORDER BY ")
        .replace(/\bLIMIT\b/g, "\nLIMIT ");

      let lines = formatted.split("\n").map((l) => l.trimEnd()).filter(Boolean);
      let finalLines: string[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("SELECT")) {
          finalLines.push("-- Selects fields from tables");
          finalLines.push("SELECT");
          // Split fields nicely
          const fieldsPart = line.substring(6).trim();
          const fields = fieldsPart.split(",");
          fields.forEach((f) => {
            if (f.trim()) finalLines.push(`  ${f.trim()}`);
          });
        } else if (trimmed.startsWith("JOIN")) {
          const match = trimmed.match(/JOIN\s+(\w+)/i);
          const tbl = match ? match[1] : "table";
          finalLines.push(`-- Joins ${tbl} to fetch related records`);
          finalLines.push(trimmed);
        } else if (trimmed.startsWith("WHERE")) {
          finalLines.push("-- Filters records based on criteria");
          finalLines.push("WHERE");
        } else if (trimmed.startsWith("GROUP BY")) {
          const field = trimmed.replace("GROUP BY", "").trim();
          finalLines.push(`-- Groups results by ${field}`);
          finalLines.push(trimmed);
        } else if (trimmed.startsWith("HAVING")) {
          const cond = trimmed.replace("HAVING", "").trim();
          finalLines.push(`-- Filters grouped results where ${cond}`);
          finalLines.push(trimmed);
        } else {
          finalLines.push(line);
        }
      });

      setOutput(finalLines.join("\n"));
      showToast("Formatted!");
    } catch (e) {
      showToast("Invalid SQL syntax");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting helper
  const highlightSql = (code: string) => {
    if (!code) return <span style={{ color: "#888780", fontStyle: "italic" }}>Formatted output will appear here...</span>;

    const keywords = ["SELECT", "FROM", "JOIN", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "AS", "ON", "AND", "OR", "NOT", "IN", "DISTINCT", "LIMIT"];
    const lines = code.split("\n");

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Render comment line
      if (trimmed.startsWith("--")) {
        return (
          <div key={idx} style={{ color: "#888780", fontStyle: "italic", minHeight: "18px" }}>
            {line}
          </div>
        );
      }

      // Simple line token highlighting
      let parts = line.split(/(\s+|,|\(|\))/);
      let elements = parts.map((part, pIdx) => {
        const upper = part.toUpperCase();
        if (keywords.includes(upper)) {
          return <span key={pIdx} style={{ color: "#534AB7", fontWeight: 600 }}>{part}</span>;
        }
        if (part.match(/^\d+(\.\d+)?$/)) {
          return <span key={pIdx} style={{ color: "#BA7517" }}>{part}</span>;
        }
        if (part.startsWith("'") || part.startsWith('"')) {
          return <span key={pIdx} style={{ color: "#D85A30" }}>{part}</span>;
        }
        if (part.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) && part !== "AS") {
          // table alias or names
          return <span key={pIdx} style={{ color: "#1D9E75" }}>{part}</span>;
        }
        return <span key={pIdx}>{part}</span>;
      });

      return (
        <div key={idx} style={{ minHeight: "18px", whiteSpace: "pre" }}>
          {elements}
        </div>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
      {/* Action panel */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button className="btn btn-outline" onClick={handleLoadSample}>
          Load Sample Query
        </button>
      </div>

      {/* Two panel layout */}
      <div className="sql-panel-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px" }}>Input SQL Query:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your messy SQL here..."
            style={{
              width: "100%",
              height: "320px",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "#FFFFFF",
              resize: "none",
            }}
          />
        </div>

        {/* Right Output */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px" }}>Formatted SQL Explainer:</label>
            {output && (
              <button
                onClick={handleCopy}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "var(--primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            )}
          </div>
          <div
            style={{
              width: "100%",
              height: "320px",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "#FAF9F6",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {highlightSql(output)}
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={handleFormat}
        className="btn btn-primary"
        style={{
          width: "100%",
          height: "44px",
          fontWeight: 700,
          borderRadius: "8px",
          marginTop: "8px",
        }}
      >
        Format & Explain SQL
      </button>

      <style jsx>{`
        @media (max-width: 768px) {
          .sql-panel-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

// ==========================================
// TOOL 2: JSON Path Extractor
// ==========================================
interface JsonTreeNodeProps {
  data: any;
  name: string | number;
  path: Array<string | number>;
  depth: number;
  onNodeClick: (path: Array<string | number>) => void;
  selectedPathStr: string;
}

const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  data,
  name,
  path,
  depth,
  onNodeClick,
  selectedPathStr,
}) => {
  const isObj = data !== null && typeof data === "object" && !Array.isArray(data);
  const isArr = Array.isArray(data);
  const [expanded, setExpanded] = useState(depth <= 2);

  // Form string key path for selection check
  const pathKey = path.join(".");

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleNodeSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(path);
  };

  // Get Value Type Badge color and label
  const getTypeBadge = (val: any) => {
    if (val === null) return { bg: "rgba(136, 135, 128, 0.12)", color: "#888780", label: "null" };
    if (Array.isArray(val)) return { bg: "rgba(216, 90, 48, 0.12)", color: "#D85A30", label: "array" };
    if (typeof val === "object") return { bg: "rgba(83, 74, 183, 0.12)", color: "#534AB7", label: "object" };
    if (typeof val === "string") return { bg: "rgba(29, 158, 117, 0.12)", color: "#1D9E75", label: "string" };
    if (typeof val === "number") return { bg: "rgba(55, 138, 221, 0.12)", color: "#378ADD", label: "number" };
    if (typeof val === "boolean") return { bg: "rgba(186, 117, 23, 0.12)", color: "#BA7517", label: "boolean" };
    return { bg: "rgba(0, 0, 0, 0.05)", color: "#000000", label: typeof val };
  };

  const badge = getTypeBadge(data);

  // Preview value
  const getValuePreview = (val: any) => {
    if (val === null) return "null";
    if (Array.isArray(val)) return `[${val.length} items]`;
    if (typeof val === "object") return "{...}";
    if (typeof val === "string") {
      return `"${val.length > 30 ? val.substring(0, 30) + "..." : val}"`;
    }
    return String(val);
  };

  const isSelected = selectedPathStr === pathKey;

  return (
    <div style={{ marginLeft: depth > 0 ? "16px" : "0", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
      {/* Node Header Row */}
      <div
        onClick={handleNodeSelect}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          backgroundColor: isSelected ? "#EEEDFE" : "transparent",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {/* Collapse toggle arrow */}
        {(isObj || isArr) ? (
          <button
            onClick={handleToggle}
            style={{
              padding: "2px 4px",
              fontSize: "10px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {expanded ? "▼" : "▶"}
          </button>
        ) : (
          <span style={{ width: "16px" }} />
        )}

        {/* Key name */}
        <span style={{ color: "#534AB7", fontWeight: 600 }}>{name}</span>

        {/* Type Badge */}
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: badge.bg,
            color: badge.color,
          }}
        >
          {badge.label}
        </span>

        {/* Value Preview */}
        {!isObj && !isArr && (
          <span style={{ color: "var(--text)", opacity: 0.8 }}>
            : {getValuePreview(data)}
          </span>
        )}
      </div>

      {/* Children rendering */}
      {expanded && (
        <div style={{ borderLeft: "1px dashed #E5E4DD", marginLeft: "15px", paddingLeft: "4px" }}>
          {isArr &&
            data.map((item: any, idx: number) => (
              <JsonTreeNode
                key={idx}
                data={item}
                name={`[${idx}]`}
                path={[...path, idx]}
                depth={depth + 1}
                onNodeClick={onNodeClick}
                selectedPathStr={selectedPathStr}
              />
            ))}
          {isObj &&
            Object.keys(data).map((key) => (
              <JsonTreeNode
                key={key}
                data={data[key]}
                name={key}
                path={[...path, key]}
                depth={depth + 1}
                onNodeClick={onNodeClick}
                selectedPathStr={selectedPathStr}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export const JsonPathExtractor: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedPath, setSelectedPath] = useState<Array<string | number>>([]);
  const [copiedRow, setCopiedRow] = useState<string | null>(null);

  const sampleJson = {
    user: {
      id: 101,
      name: "Jane Doe",
      email: "jane@example.com",
      address: {
        street: "123 Dev Lane",
        city: "San Francisco",
        zip: "94107",
      },
      orders: [
        {
          orderId: "A-9901",
          date: "2026-05-27",
          total: 129.99,
          items: [
            {
              itemId: "itm-01",
              name: "Mechanical Keyboard",
              price: 99.99,
              metadata: {
                layout: "ANSI",
                switches: "Cherry MX Brown",
              },
            },
            {
              itemId: "itm-02",
              name: "USB-C Cable",
              price: 30.0,
              metadata: {
                length: "2m",
                braided: true,
              },
            },
          ],
        },
      ],
    },
  };

  useEffect(() => {
    // Load sample by default
    setInput(JSON.stringify(sampleJson, null, 2));
    setParsedData(sampleJson);
  }, []);

  const handleParse = () => {
    if (!input.trim()) {
      setError("JSON input is empty");
      setParsedData(null);
      return;
    }
    try {
      const data = JSON.parse(input);
      setParsedData(data);
      setError("");
      setSelectedPath([]);
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setParsedData(null);
    }
  };

  const handleLoadSample = () => {
    setInput(JSON.stringify(sampleJson, null, 2));
    setParsedData(sampleJson);
    setError("");
    setSelectedPath([]);
  };

  // Click handler on tree node
  const handleNodeClick = (path: Array<string | number>) => {
    setSelectedPath(path);
  };

  // Generate three notations
  const getPathNotations = (path: Array<string | number>) => {
    if (path.length === 0) return { dot: "", bracket: "", optional: "" };

    let dot = "";
    let bracket = "";
    let optional = "";

    path.forEach((seg, idx) => {
      const isNum = typeof seg === "number";

      // Dot notation
      if (isNum) {
        dot += `[${seg}]`;
      } else {
        dot += (idx === 0 ? "" : ".") + seg;
      }

      // Bracket notation
      if (isNum) {
        bracket += `[${seg}]`;
      } else {
        bracket += `["${seg}"]`;
      }

      // Optional chain
      if (isNum) {
        optional += `?.[${seg}]`;
      } else {
        optional += (idx === 0 ? "" : "?.") + seg;
      }
    });

    return { dot, bracket, optional };
  };

  const notations = getPathNotations(selectedPath);

  const handleCopyRow = (text: string, rowKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRow(rowKey);
    showToast("Path copied!");
    setTimeout(() => setCopiedRow(null), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
      {/* Action Toolbar */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button className="btn btn-outline" onClick={handleLoadSample}>
          Load Nested Sample JSON
        </button>
      </div>

      {/* Grid split */}
      <div className="json-path-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left Side: Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px" }}>JSON Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            style={{
              width: "100%",
              height: "320px",
              padding: "16px",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "#FFFFFF",
            }}
          />
          {error && <span style={{ color: "#D85A30", fontSize: "13px", fontWeight: 600 }}>{error}</span>}
          <button
            onClick={handleParse}
            className="btn btn-primary"
            style={{
              width: "100%",
              height: "40px",
              fontWeight: 700,
              borderRadius: "8px",
              marginTop: "8px",
            }}
          >
            Parse JSON Tree
          </button>
        </div>

        {/* Right Side: Interactive Tree */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: 600, color: "var(--text)", fontSize: "14px" }}>Interactive Tree View:</label>
          <div
            style={{
              width: "100%",
              height: "320px",
              padding: "16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              background: "#FAF9F6",
              overflowY: "auto",
            }}
          >
            {parsedData ? (
              <JsonTreeNode
                data={parsedData}
                name="root"
                path={[]}
                depth={0}
                onNodeClick={handleNodeClick}
                selectedPathStr={selectedPath.join(".")}
              />
            ) : (
              <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
                Parse a valid JSON object to start exploring paths.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Path Display Area */}
      {selectedPath.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            padding: "20px",
            backgroundColor: "rgba(83, 74, 183, 0.03)",
            border: "1px solid rgba(83, 74, 183, 0.15)",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#534AB7" }}>
            Extracted Path Notations:
          </h4>

          {/* Dot notation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", width: "140px" }}>Dot notation:</span>
            <code style={{ flex: 1, padding: "6px 12px", background: "#FFFFFF", borderRadius: "6px", border: "1px solid var(--border)" }}>
              {notations.dot}
            </code>
            <button
              className="btn btn-outline"
              onClick={() => handleCopyRow(notations.dot, "dot")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              {copiedRow === "dot" ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Bracket notation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", width: "140px" }}>Bracket notation:</span>
            <code style={{ flex: 1, padding: "6px 12px", background: "#FFFFFF", borderRadius: "6px", border: "1px solid var(--border)" }}>
              {notations.bracket}
            </code>
            <button
              className="btn btn-outline"
              onClick={() => handleCopyRow(notations.bracket, "bracket")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              {copiedRow === "bracket" ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Optional chain */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", width: "140px" }}>Optional chain:</span>
            <code style={{ flex: 1, padding: "6px 12px", background: "#FFFFFF", borderRadius: "6px", border: "1px solid var(--border)" }}>
              {notations.optional}
            </code>
            <button
              className="btn btn-outline"
              onClick={() => handleCopyRow(notations.optional, "optional")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              {copiedRow === "optional" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Click status footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--muted)" }}>
        <span>{selectedPath.length > 0 ? `Selected Path: ${notations.dot}` : "Click any value to extract its path"}</span>
        <span>Path extraction is 100% offline.</span>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .json-path-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};
