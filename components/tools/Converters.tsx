import React, { useState, useEffect } from "react";
import { ToolProps } from "./ToolInterfaces";
import { useScript } from "./useScript";

// Helper to highlight JSON syntax
export function highlightJson(json: string): string {
  if (!json) return "";
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "mockup-json-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "mockup-json-key";
        } else {
          cls = "mockup-json-string";
        }
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// 1. JSON Formatter
export const JsonFormatter: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [highlighted, setHighlighted] = useState("");

  const handlePrettify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      setHighlighted(highlightJson(pretty));
    } catch (e: any) {
      showToast("Error: Invalid JSON syntax!");
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const mini = JSON.stringify(parsed);
      setOutput(mini);
      setHighlighted(highlightJson(mini));
    } catch (e: any) {
      showToast("Error: Invalid JSON syntax!");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    showToast("JSON copied to clipboard!");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Raw JSON Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...\ne.g. {"name":"ByteKit", "type":"offline"}'
            className="code-font"
            style={{ height: "300px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={handlePrettify} style={{ flex: 1 }}>
              Prettify
            </button>
            <button className="btn btn-outline" onClick={handleMinify} style={{ flex: 1 }}>
              Minify
            </button>
          </div>
        </div>
        <div className="pane">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Formatted Output</label>
            {output && (
              <button className="btn btn-ghost" onClick={handleCopy} style={{ height: "30px", padding: "0 10px" }}>
                Copy Output
              </button>
            )}
          </div>
          {highlighted ? (
            <pre className="output-pre" style={{ height: "300px" }} dangerouslySetInnerHTML={{ __html: highlighted }} />
          ) : (
            <textarea
              readOnly
              placeholder="Output will appear here..."
              className="code-font"
              style={{ height: "300px", backgroundColor: "var(--bg)" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 2. JSON ↔ YAML
export const JsonYamlConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [jsonText, setJsonText] = useState("");
  const [yamlText, setYamlText] = useState("");
  const yamlStatus = useScript("https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js");

  const convertJsonToYaml = () => {
    if (yamlStatus !== "ready") {
      showToast("Loading library, please try again...");
      return;
    }
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      const win = window as any;
      if (win.jsyaml) {
        const yaml = win.jsyaml.dump(parsed);
        setYamlText(yaml);
      }
    } catch (e) {
      showToast("Invalid JSON!");
    }
  };

  const convertYamlToJson = () => {
    if (yamlStatus !== "ready") {
      showToast("Loading library, please try again...");
      return;
    }
    try {
      if (!yamlText.trim()) return;
      const win = window as any;
      if (win.jsyaml) {
        const parsed = win.jsyaml.load(yamlText);
        setJsonText(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      showToast("Invalid YAML!");
    }
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>JSON</label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"name": "ByteKit"}'
            className="code-font"
            style={{ height: "260px" }}
          />
          <button className="btn btn-primary" onClick={convertJsonToYaml}>
            Convert to YAML →
          </button>
        </div>
        <div className="pane">
          <label>YAML</label>
          <textarea
            value={yamlText}
            onChange={(e) => setYamlText(e.target.value)}
            placeholder="name: ByteKit"
            className="code-font"
            style={{ height: "260px" }}
          />
          <button className="btn btn-outline" onClick={convertYamlToJson}>
            ← Convert to JSON
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper for XML conversion
function xmlToObj(xml: Node): any {
  const obj: any = {};
  if (xml.nodeType === 1) { // element
    if ((xml as Element).attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < (xml as Element).attributes.length; j++) {
        const attribute = (xml as Element).attributes.item(j);
        if (attribute) {
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    }
  } else if (xml.nodeType === 3) { // text
    return xml.nodeValue?.trim() || "";
  }

  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (nodeName === "#text") {
        const txt = item.nodeValue?.trim();
        if (txt) return txt;
        continue;
      }
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToObj(item);
      } else {
        if (typeof obj[nodeName].push === "undefined") {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToObj(item));
      }
    }
  }
  return obj;
}

function objToXml(obj: any, rootName = "root"): string {
  let xml = "";
  if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (Array.isArray(val)) {
          for (const item of val) {
            xml += `<${key}>${objToXml(item, "")}</${key}>`;
          }
        } else if (typeof val === "object") {
          xml += `<${key}>${objToXml(val, "")}</${key}>`;
        } else {
          xml += `<${key}>${val}</${key}>`;
        }
      }
    }
  } else {
    xml += obj;
  }
  return rootName ? `<${rootName}>${xml}</${rootName}>` : xml;
}

// 3. JSON ↔ XML
export const JsonXmlConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [jsonText, setJsonText] = useState("");
  const [xmlText, setXmlText] = useState("");

  const convertJsonToXml = () => {
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + objToXml(parsed, "root");
      setXmlText(xml);
    } catch (e) {
      showToast("Invalid JSON!");
    }
  };

  const convertXmlToJson = () => {
    try {
      if (!xmlText.trim()) return;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        showToast("Invalid XML Syntax!");
        return;
      }
      const converted = xmlToObj(xmlDoc.documentElement);
      setJsonText(JSON.stringify(converted, null, 2));
    } catch (e) {
      showToast("XML Parsing Error!");
    }
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>JSON</label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"name": "ByteKit"}'
            className="code-font"
            style={{ height: "260px" }}
          />
          <button className="btn btn-primary" onClick={convertJsonToXml}>
            Convert to XML →
          </button>
        </div>
        <div className="pane">
          <label>XML</label>
          <textarea
            value={xmlText}
            onChange={(e) => setXmlText(e.target.value)}
            placeholder="<root><name>ByteKit</name></root>"
            className="code-font"
            style={{ height: "260px" }}
          />
          <button className="btn btn-outline" onClick={convertXmlToJson}>
            ← Convert to JSON
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Unix Timestamp
export const UnixTimestamp: React.FC<ToolProps> = ({ showToast }) => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [epochInput, setEpochInput] = useState("");
  const [humanDateOutput, setHumanDateOutput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [epochOutput, setEpochOutput] = useState("");

  useEffect(() => {
    setCurrentEpoch(Math.floor(Date.now() / 1000));
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEpochToDate = () => {
    const parsed = parseInt(epochInput);
    if (isNaN(parsed)) {
      showToast("Invalid Timestamp!");
      return;
    }
    // Handle milliseconds or seconds
    const date = new Date(parsed < 10000000000 ? parsed * 1000 : parsed);
    setHumanDateOutput(date.toString());
  };

  const handleDateToEpoch = () => {
    if (!dateInput) return;
    const epoch = Math.floor(new Date(dateInput).getTime() / 1000);
    if (isNaN(epoch)) {
      showToast("Invalid Date!");
      return;
    }
    setEpochOutput(epoch.toString());
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--primary-light)", padding: "16px", borderRadius: "8px" }}>
        <h4 style={{ margin: 0, color: "var(--primary)" }}>Current Unix Epoch Time:</h4>
        <span style={{ fontSize: "20px", fontWeight: "bold", fontFamily: "var(--font-mono)", color: "var(--text)" }}>{currentEpoch}</span>
      </div>

      <div className="pane-container" style={{ marginTop: "12px" }}>
        {/* Epoch to Date */}
        <div className="pane" style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "8px" }}>
          <label style={{ fontSize: "14px" }}>Epoch Timestamp to Date</label>
          <input
            type="text"
            placeholder="e.g. 1779951600"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleEpochToDate}>
            Convert Epoch
          </button>
          {humanDateOutput && (
            <div style={{ marginTop: "8px", padding: "10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", wordBreak: "break-all" }}>
              <strong>Date:</strong> {humanDateOutput}
            </div>
          )}
        </div>

        {/* Date to Epoch */}
        <div className="pane" style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "8px" }}>
          <label style={{ fontSize: "14px" }}>Date to Epoch Timestamp</label>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            style={{ fontFamily: "inherit" }}
          />
          <button className="btn btn-outline" onClick={handleDateToEpoch}>
            Convert Date
          </button>
          {epochOutput && (
            <div style={{ marginTop: "8px", padding: "10px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px" }}>
              <strong>Epoch (seconds):</strong> {epochOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Number Base Converter
export const NumberBaseConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [dec, setDec] = useState("");
  const [hex, setHex] = useState("");
  const [oct, setOct] = useState("");
  const [bin, setBin] = useState("");

  const updateAll = (val: string, base: 2 | 8 | 10 | 16) => {
    if (!val.trim()) {
      setDec("");
      setHex("");
      setOct("");
      setBin("");
      return;
    }

    try {
      const parsed = parseInt(val, base);
      if (isNaN(parsed)) return;

      if (base !== 10) setDec(parsed.toString(10));
      if (base !== 16) setHex(parsed.toString(16).toUpperCase());
      if (base !== 8) setOct(parsed.toString(8));
      if (base !== 2) setBin(parsed.toString(2));
    } catch (e) {
      showToast("Conversion error!");
    }
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div className="form-group">
          <label>Decimal (Base 10)</label>
          <input
            type="text"
            className="code-font"
            value={dec}
            placeholder="e.g. 255"
            onChange={(e) => {
              setDec(e.target.value);
              updateAll(e.target.value, 10);
            }}
          />
        </div>
        <div className="form-group">
          <label>Hexadecimal (Base 16)</label>
          <input
            type="text"
            className="code-font"
            value={hex}
            placeholder="e.g. FF"
            onChange={(e) => {
              setHex(e.target.value);
              updateAll(e.target.value, 16);
            }}
          />
        </div>
        <div className="form-group">
          <label>Octal (Base 8)</label>
          <input
            type="text"
            className="code-font"
            value={oct}
            placeholder="e.g. 377"
            onChange={(e) => {
              setOct(e.target.value);
              updateAll(e.target.value, 8);
            }}
          />
        </div>
        <div className="form-group">
          <label>Binary (Base 2)</label>
          <input
            type="text"
            className="code-font"
            value={bin}
            placeholder="e.g. 11111111"
            onChange={(e) => {
              setBin(e.target.value);
              updateAll(e.target.value, 2);
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 6. Color Converter
export const ColorConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [hexInput, setHexInput] = useState("#534ab7");
  const [rgbText, setRgbText] = useState("rgb(83, 74, 183)");
  const [hslText, setHslText] = useState("hsl(245, 45%, 50%)");
  const [hsvText, setHsvText] = useState("hsv(245, 60%, 72%)");

  const convertColor = (hex: string) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) return;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    setRgbText(`rgb(${r}, ${g}, ${b})`);

    // RGB to HSL
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h = Math.round(h * 60);
    }
    setHslText(`hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`);

    // RGB to HSV
    const maxVal = max;
    const dVal = max - min;
    const sVal = maxVal === 0 ? 0 : dVal / maxVal;
    setHsvText(`hsv(${h}, ${Math.round(sVal * 100)}%, ${Math.round(maxVal * 100)}%)`);
  };

  useEffect(() => {
    convertColor(hexInput);
  }, [hexInput]);

  const copyVal = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied: ${text}`);
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane" style={{ gap: "12px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <input
                type="color"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                style={{ width: "100%", height: "100%", border: "none", cursor: "pointer", padding: 0 }}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>HEX Input</label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => {
                  setHexInput(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="color-swatch" style={{ backgroundColor: hexInput, color: "#FFFFFF" }}>
            Preview Swatch
          </div>
        </div>

        <div className="pane" style={{ gap: "12px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>RGB</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" readOnly value={rgbText} className="code-font" />
              <button className="btn btn-primary" onClick={() => copyVal(rgbText)}>Copy</button>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>HSL</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" readOnly value={hslText} className="code-font" />
              <button className="btn btn-primary" onClick={() => copyVal(hslText)}>Copy</button>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>HSV</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" readOnly value={hsvText} className="code-font" />
              <button className="btn btn-primary" onClick={() => copyVal(hsvText)}>Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Case Converter
export const CaseConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [text, setText] = useState("");

  const transform = (mode: "upper" | "lower" | "title" | "camel" | "snake" | "kebab") => {
    if (!text.trim()) return;

    let res = "";
    const words = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [text];

    switch (mode) {
      case "upper":
        res = text.toUpperCase();
        break;
      case "lower":
        res = text.toLowerCase();
        break;
      case "title":
        res = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case "camel":
        res = words
          .map((w, idx) => (idx === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()))
          .join("");
        break;
      case "snake":
        res = words.map((w) => w.toLowerCase()).join("_");
        break;
      case "kebab":
        res = words.map((w) => w.toLowerCase()).join("-");
        break;
    }
    setText(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    showToast("Text copied!");
  };

  return (
    <div className="tool-workspace">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to convert cases..."
        style={{ height: "200px" }}
      />
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => transform("upper")}>UPPERCASE</button>
        <button className="btn btn-primary" onClick={() => transform("lower")}>lowercase</button>
        <button className="btn btn-primary" onClick={() => transform("title")}>Title Case</button>
        <button className="btn btn-primary" onClick={() => transform("camel")}>camelCase</button>
        <button className="btn btn-primary" onClick={() => transform("snake")}>snake_case</button>
        <button className="btn btn-primary" onClick={() => transform("kebab")}>kebab-case</button>
        <button className="btn btn-outline" onClick={handleCopy} style={{ marginLeft: "auto" }}>Copy</button>
      </div>
    </div>
  );
};

// 8. CSV ↔ JSON
export const CsvJsonConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");

  const handleCsvToJson = () => {
    try {
      if (!csvText.trim()) return;
      const lines = csvText.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
      if (lines.length === 0) return;

      const headers = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const currentline = lines[i].split(",");
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
          let val = currentline[j] ? currentline[j].replace(/^["']|["']$/g, "").trim() : "";
          // Parse number if appropriate
          if (val !== "" && !isNaN(Number(val))) {
            obj[headers[j]] = Number(val);
          } else if (val === "true" || val === "false") {
            obj[headers[j]] = val === "true";
          } else {
            obj[headers[j]] = val;
          }
        }
        result.push(obj);
      }
      setJsonText(JSON.stringify(result, null, 2));
    } catch (e) {
      showToast("Error converting CSV to JSON!");
    }
  };

  const handleJsonToCsv = () => {
    try {
      if (!jsonText.trim()) return;
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) return;

      const replacer = (key: string, value: any) => (value === null ? "" : value);
      const header = Object.keys(items[0]);
      const csv = [
        header.join(","), // header row
        ...items.map((row) =>
          header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(",")
        ),
      ].join("\n");

      setCsvText(csv);
    } catch (e) {
      showToast("Invalid JSON array!");
    }
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>CSV Input/Output</label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="name,type,version\nByteKit,tools,1.0"
            className="code-font"
            style={{ height: "260px" }}
          />
          <button className="btn btn-primary" onClick={handleCsvToJson}>
            Convert CSV to JSON →
          </button>
        </div>
        <div className="pane">
          <label>JSON Input/Output</label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[{"name":"ByteKit","type":"tools"}]'
            className="code-font"
            style={{ height: "260px" }}
          />
          <button className="btn btn-outline" onClick={handleJsonToCsv}>
            ← Convert JSON to CSV
          </button>
        </div>
      </div>
    </div>
  );
};
