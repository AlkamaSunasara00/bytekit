import React, { useState, useEffect, useRef } from "react";
import { ToolProps } from "./ToolInterfaces";
import { useScript } from "./useScript";

// CSS Colors dictionary for Color Name Finder
const COLOR_NAMES: Record<string, string> = {
  "Alice Blue": "#F0F8FF", "Antique White": "#FAEBD7", "Aqua": "#00FFFF", "Aquamarine": "#7FFFD4", "Azure": "#F0FFFF",
  "Beige": "#F5F5DC", "Bisque": "#FFE4C4", "Black": "#000000", "Blanched Almond": "#FFEBCD", "Blue": "#0000FF",
  "Blue Violet": "#8A2BE2", "Brown": "#A52A2A", "Burly Wood": "#DEB887", "Cadet Blue": "#5F9EA0", "Chartreuse": "#7FFF00",
  "Chocolate": "#D2691E", "Coral": "#FF7F50", "Cornflower Blue": "#6495ED", "Cornsilk": "#FFF8DC", "Crimson": "#DC143C",
  "Cyan": "#00FFFF", "Dark Blue": "#00008B", "Dark Cyan": "#008B8B", "Dark Goldenrod": "#B8860B", "Dark Gray": "#A9A9A9",
  "Dark Green": "#006400", "Dark Khaki": "#BDB76B", "Dark Magenta": "#8B008B", "Dark Olive Green": "#556B2F",
  "Dark Orange": "#FF8C00", "Dark Orchid": "#9932CC", "Dark Red": "#8B0000", "Dark Salmon": "#E9967A",
  "Dark Sea Green": "#8FBC8F", "Dark Slate Blue": "#483D8B", "Dark Slate Gray": "#2F4F4F", "Dark Turquoise": "#00CED1",
  "Dark Violet": "#9400D3", "Deep Pink": "#FF1493", "Deep Sky Blue": "#00BFFF", "Dim Gray": "#696969",
  "Dodger Blue": "#1E90FF", "Firebrick": "#B22222", "Floral White": "#FFFAF0", "Forest Green": "#228B22",
  "Fuchsia": "#FF00FF", "Gainsboro": "#DCDCDC", "Ghost White": "#F8F8FF", "Gold": "#FFD700", "Goldenrod": "#DAA520",
  "Gray": "#808080", "Green": "#008000", "Green Yellow": "#ADFF2F", "Honeydew": "#F0FFF0", "Hot Pink": "#FF69B4",
  "Indian Red": "#CD5C5C", "Indigo": "#4B0082", "Ivory": "#FFFFF0", "Khaki": "#E6E6FA", "Lavender": "#E6E6FA",
  "Lavender Blush": "#FFF0F5", "Lawn Green": "#7CFC00", "Lemon Chiffon": "#FFFACD", "Light Blue": "#ADD8E6",
  "Light Coral": "#F08088", "Light Cyan": "#E0FFFF", "Light Goldenrod": "#FAFAD2", "Light Gray": "#D3D3D3",
  "Light Green": "#90EE90", "Light Pink": "#FFB6C1", "Light Salmon": "#FFA07A", "Light Sea Green": "#20B2AA",
  "Light Sky Blue": "#87CEFA", "Light Slate Gray": "#778899", "Light Steel Blue": "#B0C4DE", "Light Yellow": "#FFFFE0",
  "Lime": "#00FF00", "Lime Green": "#32CD32", "Linen": "#FAF0E6", "Magenta": "#FF00FF", "Maroon": "#800000",
  "Medium Aquamarine": "#66CDAA", "Medium Blue": "#0000CD", "Medium Orchid": "#BA55D3", "Medium Purple": "#9370DB",
  "Medium Sea Green": "#3CB371", "Medium Slate Blue": "#7B68EE", "Medium Spring Green": "#00FA9A", "Medium Turquoise": "#48D1CC",
  "Medium Violet Red": "#C71585", "Midnight Blue": "#191970", "Mint Cream": "#F5FFFA", "Misty Rose": "#FFE4E1",
  "Moccasin": "#FFE4B5", "Navajo White": "#FFDEAD", "Navy": "#000080", "Old Lace": "#FDF5E6", "Olive": "#808000",
  "Olive Drab": "#6B8E23", "Orange": "#FFA500", "Orange Red": "#FF4500", "Orchid": "#DA70D6", "Pale Goldenrod": "#EEE8AA",
  "Pale Green": "#98FB98", "Pale Turquoise": "#AFEEEE", "Pale Violet Red": "#DB7093", "Papaya Whip": "#FFEFD5",
  "Peach Puff": "#FFDAB9", "Peru": "#CD853F", "Pink": "#FFC0CB", "Plum": "#DDA0DD", "Powder Blue": "#B0E0E6",
  "Purple": "#800080", "Red": "#FF0000", "Rosy Brown": "#BC8F8F", "Royal Blue": "#4169E1", "Saddle Brown": "#8B4513",
  "Salmon": "#FA8072", "Sandy Brown": "#F4A460", "Sea Green": "#2E8B57", "Seashell": "#FFF5EE", "Sienna": "#A0522D",
  "Silver": "#C0C0C0", "Sky Blue": "#87CEEB", "Slate Blue": "#6A5ACD", "Slate Gray": "#708090", "Snow": "#FFFAFA",
  "Spring Green": "#00FF7F", "Steel Blue": "#4682B4", "Tan": "#D2B48C", "Teal": "#008080", "Thistle": "#D8BFD8",
  "Tomato": "#FF6347", "Turquoise": "#40E0D0", "Violet": "#EE82EE", "Wheat": "#F5DEB3", "White": "#FFFFFF",
  "White Smoke": "#F5F5F5", "Yellow": "#FFFF00", "Yellow Green": "#9ACD32"
};

// 35. ASCII Art Generator
export const AsciiGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [text, setText] = useState("ByteKit");
  const [font, setFont] = useState("Standard");
  const [output, setOutput] = useState("");
  const figletStatus = useScript("https://cdn.jsdelivr.net/npm/figlet/lib/figlet.js");

  useEffect(() => {
    if (figletStatus !== "ready") {
      setOutput("Loading Figlet engine...");
      return;
    }

    const win = window as any;
    if (win.figlet) {
      // Configure fonts
      win.figlet.text(text, { font: font }, (err: any, data: string) => {
        if (err) {
          setOutput("Formatting error!");
          return;
        }
        setOutput(data);
      });
    }
  }, [text, font, figletStatus]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showToast("ASCII Art copied!");
  };

  return (
    <div className="tool-workspace">
      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Banner Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type art text..." />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Font</label>
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option value="Standard">Standard</option>
            <option value="Slant">Slant</option>
            <option value="Banner">Banner</option>
            <option value="Block">Block</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>ASCII Preview</label>
          <button className="btn btn-outline" onClick={handleCopy} style={{ height: "30px" }}>Copy</button>
        </div>
        <pre
          className="code-font"
          style={{
            padding: "16px",
            backgroundColor: "#1E1E2E",
            color: "#CDD6F4",
            borderRadius: "8px",
            overflowX: "auto",
            fontSize: "12px",
            lineHeight: "1.1",
            maxHeight: "300px"
          }}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

// 36. Pomodoro Timer
export const PomodoroTimer: React.FC<ToolProps> = ({ showToast }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [sessionCount, setSessionCount] = useState(0);

  const totalSeconds = mode === "work" ? 25 * 60 : 5 * 60;
  const elapsedSeconds = totalSeconds - (minutes * 60 + seconds);
  const progressPercent = (elapsedSeconds / totalSeconds) * 100;

  // Synthesize sound on finish using native browser web audio synthesis
  const playAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("AudioContext synthesis failed", e);
    }
  };

  useEffect(() => {
    let interval: any = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished!
          playAlarm();
          setIsActive(false);
          if (mode === "work") {
            showToast("Work session finished! Take a break.");
            setMode("break");
            setMinutes(5);
            setSessionCount(prev => prev + 1);
          } else {
            showToast("Break finished! Get back to work.");
            setMode("work");
            setMinutes(25);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setMode("work");
    setMinutes(25);
    setSeconds(0);
  };

  // SVG ring calculations
  const radius = 70;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="tool-workspace" style={{ alignItems: "center", textAlign: "center" }}>
      <div className="pomo-circle-container">
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="90" cy="90" r={radius} className="pomo-circle-bg" />
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="pomo-circle-progress"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ stroke: mode === "work" ? "var(--primary)" : "var(--accent)" }}
          />
        </svg>
        <div className="pomo-time-text">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>

      <div style={{ marginTop: "12px" }}>
        <h4 style={{ textTransform: "capitalize", fontWeight: "bold", fontSize: "18px" }}>
          {mode === "work" ? "💻 Focus Time" : "☕ Break Time"}
        </h4>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>Sessions completed: {sessionCount}</span>
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px" }}>
        <button className="btn btn-primary" onClick={handleStartPause} style={{ minWidth: "100px" }}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button className="btn btn-outline" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

// HTTP status mock reference
const HTTP_CODES = [
  { code: 200, title: "OK", type: "2xx", desc: "The request has succeeded. Standard response for successful HTTP requests." },
  { code: 201, title: "Created", type: "2xx", desc: "The request has been fulfilled and resulted in a new resource being created." },
  { code: 204, title: "No Content", type: "2xx", desc: "The server successfully processed the request, but is not returning any content." },
  { code: 301, title: "Moved Permanently", type: "3xx", desc: "This and all future requests should be directed to the given URI." },
  { code: 302, title: "Found", type: "3xx", desc: "Temporary redirect. The resource resides temporarily under a different URI." },
  { code: 400, title: "Bad Request", type: "4xx", desc: "The server cannot or will not process the request due to an apparent client error." },
  { code: 401, title: "Unauthorized", type: "4xx", desc: "Authentication is required and has failed or has not yet been provided." },
  { code: 403, title: "Forbidden", type: "4xx", desc: "The request was valid, but the server is refusing action. The user might not have standard permissions." },
  { code: 404, title: "Not Found", type: "4xx", desc: "The requested resource could not be found but may be available in the future." },
  { code: 405, title: "Method Not Allowed", type: "4xx", desc: "A request method is not supported for the requested resource." },
  { code: 429, title: "Too Many Requests", type: "4xx", desc: "The user has sent too many requests in a given amount of time ('rate limiting')." },
  { code: 500, title: "Internal Server Error", type: "5xx", desc: "A generic error message, given when an unexpected condition was encountered." },
  { code: 502, title: "Bad Gateway", type: "5xx", desc: "The server was acting as a gateway or proxy and received an invalid response." },
  { code: 503, title: "Service Unavailable", type: "5xx", desc: "The server cannot handle the request (normally because it is overloaded or down for maintenance)." }
];

// 37. HTTP Status Reference
export const HttpStatusReference: React.FC = () => {
  const [query, setQuery] = useState("");

  const filtered = HTTP_CODES.filter(item =>
    item.code.toString().includes(query) ||
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="tool-workspace">
      <input
        type="text"
        placeholder="Search status code (e.g. 404, Unauthorized)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "12px" }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "260px", overflowY: "auto" }}>
        {filtered.map((item) => {
          const color = item.type.startsWith("2") ? "var(--color-converters)" :
                        item.type.startsWith("3") ? "var(--color-text)" :
                        item.type.startsWith("4") ? "var(--color-css)" : "var(--color-fun)";
          return (
            <div key={item.code} style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="badge" style={{ backgroundColor: color, color: "#FFFFFF" }}>{item.code}</span>
                <strong style={{ fontSize: "14px" }}>{item.title}</strong>
                <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "auto" }}>{item.type}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>{item.desc}</p>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ color: "var(--muted)", textAlign: "center", padding: "20px" }}>No status codes matched.</div>}
      </div>
    </div>
  );
};

// 38. Color Name Finder
export const ColorFinder: React.FC = () => {
  const [hexVal, setHexVal] = useState("#534AB7");
  const [closestName, setClosestName] = useState("");
  const [closestHex, setClosestHex] = useState("");

  const hexToRgbTuple = (hex: string) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  };

  useEffect(() => {
    try {
      const [r1, g1, b1] = hexToRgbTuple(hexVal);
      let minDistance = Infinity;
      let closest = "";
      let clHex = "";

      Object.entries(COLOR_NAMES).forEach(([name, hex]) => {
        const [r2, g2, b2] = hexToRgbTuple(hex);
        // Calculate standard Euclidean distance in 3D color coordinates
        const d = Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
        if (d < minDistance) {
          minDistance = d;
          closest = name;
          clHex = hex;
        }
      });

      setClosestName(closest);
      setClosestHex(clHex);
    } catch {
      // Ignore conversion failures
    }
  }, [hexVal]);

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>HEX Input</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="color" value={hexVal} onChange={(e) => setHexVal(e.target.value)} style={{ padding: 0, width: "50px", height: "40px", cursor: "pointer" }} />
            <input type="text" value={hexVal} onChange={(e) => setHexVal(e.target.value)} placeholder="#534AB7" style={{ flex: 1 }} />
          </div>
        </div>

        <div className="pane" style={{ justifyContent: "center" }}>
          <label>Closest Named Match</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", marginTop: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: closestHex }} />
            <div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{closestName}</div>
              <div style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{closestHex}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 39. Commit Message Generator
export const CommitGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [type, setType] = useState("feat");
  const [scope, setScope] = useState("");
  const [desc, setDesc] = useState("add oauth authentication workflow");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const scopeStr = scope.trim() ? `(${scope.trim()})` : "";
    setOutput(`${type}${scopeStr}: ${desc.trim().toLowerCase()}`);
  }, [type, scope, desc]);

  return (
    <div className="tool-workspace">
      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="feat">feat (Feature)</option>
            <option value="fix">fix (Bug Fix)</option>
            <option value="docs">docs (Documentation)</option>
            <option value="style">style (Formatting/Colors)</option>
            <option value="refactor">refactor (Rewrite/Cleanup)</option>
            <option value="test">test (Adding unit tests)</option>
            <option value="chore">chore (Maintenance/Dependencies)</option>
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Scope (Optional)</label>
          <input type="text" value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g. auth, ui, core" />
        </div>
      </div>

      <div className="form-group">
        <label>Commit Description</label>
        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this commit change..." />
      </div>

      <div className="form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>Conventional Commit String</label>
          <button className="btn btn-primary" onClick={() => {
            navigator.clipboard.writeText(output);
            showToast("Commit message copied!");
          }} style={{ height: "30px" }}>Copy Message</button>
        </div>
        <input type="text" readOnly value={output} className="code-font" style={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "var(--bg)" }} />
      </div>
    </div>
  );
};

// Variable suggestions mapping
const VARIABLE_DICTS: Record<string, string[]> = {
  auth: ["authSession", "isAuthenticated", "loginPayload", "currentUserToken", "authorizeUser", "authHeaders"],
  timer: ["countdownSeconds", "timerIntervalId", "elapsedDuration", "startStopwatch", "pomoSessionTimer", "resetTimer"],
  user: ["userDataRecord", "memberProfileInfo", "currentClientProfile", "fetchAccountDetails", "isGuestVisitor", "updatedUserMail"],
  api: ["fetchRemoteData", "networkResponsePayload", "endpointRouteUrl", "isRequestPending", "apiServiceInstance", "axiosRequestOptions"]
};

// 40. Variable Name Suggester
export const VariableSuggester: React.FC = () => {
  const [desc, setDesc] = useState("auth");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const key = desc.toLowerCase().trim();
    if (!key) {
      setResults([]);
      return;
    }

    // Check custom synonyms
    let synonyms = VARIABLE_DICTS[key] || ["tempVal", "dataPayload", "queryHandler", "sessionContext", "stateController", "resultRecord"];
    setResults(synonyms);
  }, [desc]);

  const convertCase = (str: string, mode: "camel" | "pascal" | "snake" | "upper") => {
    const words = str.match(/[A-Z]?[a-z]+/g) || [str];
    if (mode === "camel") {
      return words.map((w, idx) => idx === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()).join("");
    }
    if (mode === "pascal") {
      return words.map((w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()).join("");
    }
    if (mode === "snake") {
      return words.map((w) => w.toLowerCase()).join("_");
    }
    return words.map((w) => w.toUpperCase()).join("_");
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label>Variable Description (e.g. auth, timer, user, api)</label>
        <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What does this variable represent..." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {results.map((item, idx) => (
          <div key={idx} style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "bold" }}>Suggestion #{idx + 1}</div>
            <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div className="code-font" style={{ fontSize: "13px" }}><strong>camel:</strong> <span style={{ color: "var(--primary)" }}>{convertCase(item, "camel")}</span></div>
              <div className="code-font" style={{ fontSize: "13px" }}><strong>snake:</strong> <span style={{ color: "var(--color-css)" }}>{convertCase(item, "snake")}</span></div>
              <div className="code-font" style={{ fontSize: "13px" }}><strong>Pascal:</strong> <span style={{ color: "var(--color-converters)" }}>{convertCase(item, "pascal")}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
