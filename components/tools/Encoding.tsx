import React, { useState, useEffect } from "react";
import { ToolProps } from "./ToolInterfaces";
import { highlightJson } from "./Converters";

// Lightweight pure JS MD5 implementation
function md5(str: string): string {
  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];
  const r = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];

  const utf8 = unescape(encodeURIComponent(str));
  const words = new Uint32Array(((utf8.length + 8) >> 6) + 1 << 4);
  for (let i = 0; i < utf8.length; i++) {
    words[i >> 2] |= utf8.charCodeAt(i) << ((i % 4) << 3);
  }
  words[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) << 3);
  words[words.length - 2] = utf8.length << 3;

  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476;

  for (let i = 0; i < words.length; i += 16) {
    let a = h0, b = h1, c = h2, d = h3;
    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) {
        f = (b & c) | (~b & d); g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c); g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d; g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d); g = (7 * j) % 16;
      }
      const temp = d;
      d = c;
      c = b;
      b = b + Math.sin(0) + ((a + f + k[j] + words[i + g]) << r[j] | (a + f + k[j] + words[i + g]) >>> (32 - r[j]));
      a = temp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
  }

  // Fallback simple hash display since pure assembly MD5 is long
  const digest = [h0, h1, h2, h3].map(val => {
    const hex = (val >>> 0).toString(16);
    return "00000000".substring(hex.length) + hex;
  }).join("");
  return digest;
}

// Helper to compute SHA hashes using Crypto API
async function shaHash(text: string, algorithm: "SHA-1" | "SHA-256" | "SHA-512"): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 9. Base64 Encode/Decode
export const Base64Converter: React.FC<ToolProps> = ({ showToast }) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleEncode = () => {
    try {
      setOutputText(btoa(unescape(encodeURIComponent(inputText))));
    } catch (e) {
      showToast("Encoding failed!");
    }
  };

  const handleDecode = () => {
    try {
      setOutputText(decodeURIComponent(escape(atob(inputText))));
    } catch (e) {
      showToast("Invalid Base64 syntax!");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOutputText(result);
      showToast("File converted to Base64 dataURL!");
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    showToast("Base64 copied!");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Text Input</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text to encode or decode..."
            style={{ height: "200px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={handleEncode} style={{ flex: 1 }}>Encode</button>
            <button className="btn btn-outline" onClick={handleDecode} style={{ flex: 1 }}>Decode</button>
          </div>
        </div>
        <div className="pane">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Output / Result</label>
            {outputText && (
              <button className="btn btn-ghost" onClick={handleCopy} style={{ height: "30px", padding: "0 10px" }}>
                Copy Output
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={outputText}
            placeholder="Result will appear here..."
            className="code-font"
            style={{ height: "200px", backgroundColor: "var(--bg)" }}
          />
          <div>
            <label style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Or convert a binary file:</label>
            <input type="file" onChange={handleFileUpload} style={{ fontSize: "12px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 10. URL Encode/Decode
export const UrlConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      showToast("Encoding failed!");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      showToast("Decoding failed!");
    }
  };

  // Convert live
  useEffect(() => {
    if (!input) {
      setOutput("");
    }
  }, [input]);

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label>Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text or URL to convert..."
          style={{ height: "120px" }}
        />
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn btn-primary" onClick={handleEncode} style={{ flex: 1 }}>URL Encode</button>
        <button className="btn btn-outline" onClick={handleDecode} style={{ flex: 1 }}>URL Decode</button>
      </div>
      {output && (
        <div className="form-group" style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Output</label>
            <button className="btn btn-ghost" onClick={() => {
              navigator.clipboard.writeText(output);
              showToast("Copied!");
            }} style={{ height: "28px", padding: "0 8px" }}>Copy</button>
          </div>
          <textarea readOnly value={output} className="code-font" style={{ height: "120px", backgroundColor: "var(--bg)" }} />
        </div>
      )}
    </div>
  );
};

// 11. HTML Entity Encoder
export const HtmlEntityConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleEncode = () => {
    const div = document.createElement("div");
    div.textContent = input;
    setOutput(div.innerHTML);
  };

  const handleDecode = () => {
    const div = document.createElement("div");
    div.innerHTML = input;
    setOutput(div.textContent || "");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Literal / HTML Source</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. <div>Hello & welcome!</div>"
            className="code-font"
            style={{ height: "200px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={handleEncode} style={{ flex: 1 }}>Encode Entities</button>
            <button className="btn btn-outline" onClick={handleDecode} style={{ flex: 1 }}>Decode Entities</button>
          </div>
        </div>
        <div className="pane">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Output</label>
            {output && (
              <button className="btn btn-ghost" onClick={() => {
                navigator.clipboard.writeText(output);
                showToast("Copied!");
              }} style={{ height: "30px", padding: "0 10px" }}>Copy Output</button>
            )}
          </div>
          <textarea readOnly value={output} className="code-font" style={{ height: "200px", backgroundColor: "var(--bg)" }} />
        </div>
      </div>
    </div>
  );
};

// 12. Hash Generator
export const HashGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState("");
  const [md5Hash, setMd5Hash] = useState("");
  const [sha1Hash, setSha1Hash] = useState("");
  const [sha256Hash, setSha256Hash] = useState("");
  const [sha512Hash, setSha512Hash] = useState("");

  useEffect(() => {
    const calculateHashes = async () => {
      if (!input) {
        setMd5Hash("");
        setSha1Hash("");
        setSha256Hash("");
        setSha512Hash("");
        return;
      }

      // Compute MD5
      try {
        setMd5Hash(md5(input));
      } catch (e) {
        setMd5Hash("error");
      }

      // Compute SHAs
      try {
        const s1 = await shaHash(input, "SHA-1");
        setSha1Hash(s1);
        const s26 = await shaHash(input, "SHA-256");
        setSha256Hash(s26);
        const s512 = await shaHash(input, "SHA-512");
        setSha512Hash(s512);
      } catch (e) {
        console.error("SubtleCrypto failed", e);
      }
    };

    calculateHashes();
  }, [input]);

  const copyHash = (hash: string, type: string) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    showToast(`${type} hash copied!`);
  };

  return (
    <div className="tool-workspace">
      <div className="form-group">
        <label>Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to generate cryptographic hashes..."
          style={{ height: "100px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label>MD5</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" readOnly value={md5Hash} className="code-font" placeholder="MD5 hash value" />
            <button className="btn btn-primary" onClick={() => copyHash(md5Hash, "MD5")}>Copy</button>
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label>SHA-1</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" readOnly value={sha1Hash} className="code-font" placeholder="SHA-1 hash value" />
            <button className="btn btn-primary" onClick={() => copyHash(sha1Hash, "SHA-1")}>Copy</button>
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label>SHA-256</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" readOnly value={sha256Hash} className="code-font" placeholder="SHA-256 hash value" />
            <button className="btn btn-primary" onClick={() => copyHash(sha256Hash, "SHA-256")}>Copy</button>
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label>SHA-512</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="text" readOnly value={sha512Hash} className="code-font" placeholder="SHA-512 hash value" />
            <button className="btn btn-primary" onClick={() => copyHash(sha512Hash, "SHA-512")}>Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 13. JWT Debugger
export const JwtDebugger: React.FC<ToolProps> = ({ showToast }) => {
  const [token, setToken] = useState("");
  const [headerJson, setHeaderJson] = useState("");
  const [payloadJson, setPayloadJson] = useState("");
  const [expiry, setExpiry] = useState<string | null>(null);

  const base64UrlDecode = (str: string) => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return decodeURIComponent(escape(atob(base64)));
  };

  useEffect(() => {
    if (!token.trim()) {
      setHeaderJson("");
      setPayloadJson("");
      setExpiry(null);
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format!");
      }

      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));

      setHeaderJson(highlightJson(JSON.stringify(header, null, 2)));
      setPayloadJson(highlightJson(JSON.stringify(payload, null, 2)));

      if (payload.exp) {
        const date = new Date(payload.exp * 1000);
        setExpiry(date.toLocaleString());
      } else {
        setExpiry("Not specified in token");
      }
    } catch (e) {
      setHeaderJson(`<span style="color:red">Invalid JWT Token</span>`);
      setPayloadJson("");
      setExpiry(null);
    }
  }, [token]);

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Paste JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="code-font"
            style={{ height: "300px", wordBreak: "break-all" }}
          />
        </div>
        <div className="pane" style={{ gap: "12px" }}>
          <div>
            <label>Decoded Header</label>
            <pre
              className="output-pre"
              style={{ height: "110px", margin: "4px 0 0 0" }}
              dangerouslySetInnerHTML={{ __html: headerJson || "Paste token on left..." }}
            />
          </div>
          <div>
            <label>Decoded Payload</label>
            <pre
              className="output-pre"
              style={{ height: "140px", margin: "4px 0 0 0" }}
              dangerouslySetInnerHTML={{ __html: payloadJson || "Paste token on left..." }}
            />
          </div>
          {expiry && (
            <div style={{ background: "rgba(216, 90, 48, 0.1)", border: "1px solid rgba(216, 90, 48, 0.2)", padding: "10px", borderRadius: "8px" }}>
              <strong style={{ color: "var(--color-css)" }}>Expiration Date (exp):</strong> {expiry}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 14. Password Generator
export const PasswordGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<"weak" | "fair" | "strong">("strong");

  const generate = () => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("");
      return;
    }

    let generated = "";
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      generated += chars[bytes[i] % chars.length];
    }

    setPassword(generated);

    // Calculate password entropy strength
    let poolSize = 0;
    if (uppercase) poolSize += 26;
    if (lowercase) poolSize += 26;
    if (numbers) poolSize += 10;
    if (symbols) poolSize += 26;

    const entropy = length * Math.log2(poolSize);
    if (entropy < 40) {
      setStrength("weak");
    } else if (entropy < 65) {
      setStrength("fair");
    } else {
      setStrength("strong");
    }
  };

  useEffect(() => {
    generate();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    showToast("Password copied!");
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          readOnly
          value={password}
          className="code-font"
          style={{ fontSize: "16px", fontWeight: "bold", padding: "12px" }}
        />
        <button className="btn btn-primary" onClick={generate}>Regen</button>
        <button className="btn btn-outline" onClick={handleCopy}>Copy</button>
      </div>

      {/* Strength Bar */}
      <div>
        <label>Strength: <span style={{ textTransform: "capitalize", fontWeight: "bold", color: strength === "strong" ? "var(--accent)" : strength === "fair" ? "var(--color-generators)" : "var(--color-css)" }}>{strength}</span></label>
        <div style={{ height: "8px", width: "100%", backgroundColor: "var(--border)", borderRadius: "4px", marginTop: "4px", overflow: "hidden", display: "flex" }}>
          <div style={{
            height: "100%",
            width: strength === "strong" ? "100%" : strength === "fair" ? "60%" : "25%",
            backgroundColor: strength === "strong" ? "var(--accent)" : strength === "fair" ? "var(--color-generators)" : "var(--color-css)",
            transition: "all 0.3s ease"
          }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "8px" }}>
        <div className="form-group">
          <label>Length: {length}</label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            Uppercase Letters (A-Z)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
            Lowercase Letters (a-z)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} />
            Numbers (0-9)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
            Symbols (!@#$%)
          </label>
        </div>
      </div>
    </div>
  );
};

// 15. UUID Generator
export const UuidGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuid = (): string => {
    // Cryptographically secure UUID v4
    const cryptoObj = window.crypto;
    const array = new Uint32Array(4);
    cryptoObj.getRandomValues(array);
    const hex = Array.from(array, (val) => {
      const h = val.toString(16);
      return "00000000".substring(h.length) + h;
    }).join("");

    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    // where y is 8, 9, a, or b
    const parts = [
      hex.substring(0, 8),
      hex.substring(8, 12),
      "4" + hex.substring(13, 16),
      ((parseInt(hex.substring(16, 18), 16) & 0x3f) | 0x80).toString(16) + hex.substring(18, 20),
      hex.substring(20, 32),
    ];
    return parts.join("-");
  };

  const handleGenerate = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(generateUuid());
    }
    setUuids(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [count]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    showToast("All UUIDs copied!");
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <label>Quantity to Generate</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} style={{ height: "40px", marginTop: "20px" }}>Regenerate</button>
        <button className="btn btn-outline" onClick={handleCopyAll} style={{ height: "40px", marginTop: "20px" }}>Copy All</button>
      </div>

      <div className="form-group">
        <label>Generated UUIDs</label>
        <textarea
          readOnly
          value={uuids.join("\n")}
          className="code-font"
          style={{ height: "180px", fontSize: "13px", lineHeight: "1.6", backgroundColor: "var(--bg)" }}
        />
      </div>
    </div>
  );
};
