import React, { useState, useEffect } from "react";
import { ToolProps } from "./ToolInterfaces";

// Helper to convert hex to rgb
function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

// Helper to interpolate shades for palette
function getShade(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  // Mix with white (for tints) or black (for shades)
  let newR, newG, newB;
  if (percent > 0) {
    // Tint (lighten)
    newR = Math.round(r + (255 - r) * percent);
    newG = Math.round(g + (255 - g) * percent);
    newB = Math.round(b + (255 - b) * percent);
  } else {
    // Shade (darken)
    const factor = 1 + percent;
    newR = Math.round(r * factor);
    newG = Math.round(g * factor);
    newB = Math.round(b * factor);
  }
  
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`.toUpperCase();
}

// 23. CSS Box Shadow Builder
export const BoxShadowBuilder: React.FC<ToolProps> = ({ showToast }) => {
  const [x, setX] = useState(4);
  const [y, setY] = useState(8);
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(0.15);
  const [color, setColor] = useState("#000000");

  const { r, g, b } = hexToRgb(color);
  const shadowValue = `${x}px ${y}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${opacity})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowValue};`);
    showToast("Box shadow CSS copied!");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane" style={{ gap: "12px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>X Offset ({x}px)</label>
            <input type="range" min="-50" max="50" value={x} onChange={(e) => setX(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Y Offset ({y}px)</label>
            <input type="range" min="-50" max="50" value={y} onChange={(e) => setY(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Blur Radius ({blur}px)</label>
            <input type="range" min="0" max="80" value={blur} onChange={(e) => setBlur(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Spread Radius ({spread}px)</label>
            <input type="range" min="-30" max="30" value={spread} onChange={(e) => setSpread(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Opacity ({Math.round(opacity * 100)}%)</label>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Shadow Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: 0, height: "40px", cursor: "pointer" }} />
          </div>
        </div>

        <div className="pane" style={{ justifyContent: "space-between" }}>
          <div>
            <label>Live Preview</label>
            <div style={{
              height: "220px",
              backgroundColor: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "8px"
            }}>
              <div style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                boxShadow: shadowValue
              }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>CSS Code</label>
              <button className="btn btn-primary" onClick={handleCopy} style={{ height: "30px", padding: "0 10px" }}>Copy CSS</button>
            </div>
            <textarea
              readOnly
              value={`box-shadow: ${shadowValue};`}
              className="code-font"
              style={{ height: "60px", minHeight: "60px", backgroundColor: "#1E1E2E", color: "#CDD6F4", border: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 24. CSS Gradient Generator
export const GradientGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState("#534ab7");
  const [color2, setColor2] = useState("#1d9e75");
  const [stop1, setStop1] = useState(0);
  const [stop2, setStop2] = useState(100);

  const getGradientString = () => {
    if (type === "linear") {
      return `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
    }
    if (type === "radial") {
      return `radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
    }
    return `conic-gradient(from ${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
  };

  const gradient = getGradientString();

  const handleCopy = () => {
    navigator.clipboard.writeText(`background: ${gradient};`);
    showToast("Gradient CSS copied!");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane" style={{ gap: "10px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Gradient Type</label>
            <select value={type} onChange={(e: any) => setType(e.target.value)}>
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic (Circular)</option>
            </select>
          </div>

          {type !== "radial" && (
            <div className="form-group" style={{ margin: 0 }}>
              <label>Angle ({angle}°)</label>
              <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
            </div>
          )}

          <div className="form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label>Color Stop 1</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ padding: 0, width: "40px", cursor: "pointer" }} />
                <input type="number" min="0" max="100" value={stop1} onChange={(e) => setStop1(Number(e.target.value))} style={{ width: "60px" }} />
                <span style={{ alignSelf: "center" }}>%</span>
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Color Stop 2</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ padding: 0, width: "40px", cursor: "pointer" }} />
                <input type="number" min="0" max="100" value={stop2} onChange={(e) => setStop2(Number(e.target.value))} style={{ width: "60px" }} />
                <span style={{ alignSelf: "center" }}>%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pane" style={{ justifyContent: "space-between" }}>
          <div>
            <label>Live Preview</label>
            <div style={{
              height: "180px",
              background: gradient,
              borderRadius: "8px",
              border: "1px solid var(--border)",
              marginTop: "8px"
            }} />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>CSS Code</label>
              <button className="btn btn-primary" onClick={handleCopy} style={{ height: "30px", padding: "0 10px" }}>Copy CSS</button>
            </div>
            <textarea
              readOnly
              value={`background: ${gradient};`}
              className="code-font"
              style={{ height: "60px", minHeight: "60px", backgroundColor: "#1E1E2E", color: "#CDD6F4", border: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 25. Border Radius Builder
export const BorderRadiusBuilder: React.FC<ToolProps> = ({ showToast }) => {
  const [tl, setTl] = useState(12);
  const [tr, setTr] = useState(12);
  const [br, setBr] = useState(12);
  const [bl, setBl] = useState(12);

  const radiusString = `${tl}px ${tr}px ${br}px ${bl}px`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`border-radius: ${radiusString};`);
    showToast("Border radius CSS copied!");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane" style={{ gap: "10px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Top-Left Radius ({tl}px)</label>
            <input type="range" min="0" max="150" value={tl} onChange={(e) => setTl(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Top-Right Radius ({tr}px)</label>
            <input type="range" min="0" max="150" value={tr} onChange={(e) => setTr(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Bottom-Right Radius ({br}px)</label>
            <input type="range" min="0" max="150" value={br} onChange={(e) => setBr(Number(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Bottom-Left Radius ({bl}px)</label>
            <input type="range" min="0" max="150" value={bl} onChange={(e) => setBl(Number(e.target.value))} />
          </div>
        </div>

        <div className="pane" style={{ justifyContent: "space-between" }}>
          <div>
            <label>Live Preview</label>
            <div style={{
              height: "180px",
              backgroundColor: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "8px"
            }}>
              <div style={{
                width: "100px",
                height: "100px",
                backgroundColor: "var(--primary)",
                borderRadius: radiusString
              }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>CSS Code</label>
              <button className="btn btn-primary" onClick={handleCopy} style={{ height: "30px", padding: "0 10px" }}>Copy CSS</button>
            </div>
            <textarea
              readOnly
              value={`border-radius: ${radiusString};`}
              className="code-font"
              style={{ height: "55px", minHeight: "55px", backgroundColor: "#1E1E2E", color: "#CDD6F4", border: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 26. CSS Flexbox Playground
export const FlexboxPlayground: React.FC = () => {
  const [direction, setDirection] = useState("row");
  const [wrap, setWrap] = useState("nowrap");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("flex-start");

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        {/* Sliders and properties controls */}
        <div className="pane" style={{ gap: "10px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>flex-direction</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="row">row</option>
              <option value="row-reverse">row-reverse</option>
              <option value="column">column</option>
              <option value="column-reverse">column-reverse</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>flex-wrap</label>
            <select value={wrap} onChange={(e) => setWrap(e.target.value)}>
              <option value="nowrap">nowrap</option>
              <option value="wrap">wrap</option>
              <option value="wrap-reverse">wrap-reverse</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>justify-content</label>
            <select value={justify} onChange={(e) => setJustify(e.target.value)}>
              <option value="flex-start">flex-start</option>
              <option value="center">center</option>
              <option value="flex-end">flex-end</option>
              <option value="space-between">space-between</option>
              <option value="space-around">space-around</option>
              <option value="space-evenly">space-evenly</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>align-items</label>
            <select value={align} onChange={(e) => setAlign(e.target.value)}>
              <option value="flex-start">flex-start</option>
              <option value="center">center</option>
              <option value="flex-end">flex-end</option>
              <option value="stretch">stretch</option>
              <option value="baseline">baseline</option>
            </select>
          </div>
        </div>

        {/* Dynamic preview block */}
        <div className="pane">
          <label>Flexbox Live Visualizer</label>
          <div style={{
            display: "flex",
            flexDirection: direction as any,
            flexWrap: wrap as any,
            justifyContent: justify as any,
            alignItems: align as any,
            height: "220px",
            backgroundColor: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "12px",
            gap: "8px",
            marginTop: "8px"
          }}>
            <div style={{ padding: "16px", background: "var(--color-css)", color: "#FFFFFF", fontWeight: "bold", borderRadius: "6px", textAlign: "center", minWidth: "48px", minHeight: "48px" }}>1</div>
            <div style={{ padding: "24px 16px", background: "var(--color-converters)", color: "#FFFFFF", fontWeight: "bold", borderRadius: "6px", textAlign: "center", minWidth: "48px", minHeight: "48px" }}>2</div>
            <div style={{ padding: "16px", background: "var(--color-text)", color: "#FFFFFF", fontWeight: "bold", borderRadius: "6px", textAlign: "center", minWidth: "48px", minHeight: "48px" }}>3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 27. Color Palette Generator
export const ColorPaletteGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [baseColor, setBaseColor] = useState("#534AB7");
  const [shades, setShades] = useState<{ name: string; hex: string }[]>([]);

  useEffect(() => {
    // Generate beautiful 50-900 scale
    // 50 (lightest tint) -> 500 (base) -> 900 (darkest shade)
    const scale = [
      { name: "50", percent: 0.9 },
      { name: "100", percent: 0.75 },
      { name: "200", percent: 0.5 },
      { name: "300", percent: 0.3 },
      { name: "400", percent: 0.15 },
      { name: "500", percent: 0 },
      { name: "600", percent: -0.15 },
      { name: "700", percent: -0.3 },
      { name: "800", percent: -0.5 },
      { name: "900", percent: -0.7 }
    ];

    const generated = scale.map((item) => ({
      name: item.name,
      hex: getShade(baseColor, item.percent)
    }));

    setShades(generated);
  }, [baseColor]);

  const handleCopyVars = () => {
    const vars = shades.map(s => `  --color-primary-${s.name}: ${s.hex};`).join("\n");
    navigator.clipboard.writeText(`:root {\n${vars}\n}`);
    showToast("CSS variables copied!");
  };

  return (
    <div className="tool-workspace">
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <input
          type="color"
          value={baseColor}
          onChange={(e) => setBaseColor(e.target.value)}
          style={{ width: "64px", height: "40px", cursor: "pointer", padding: 0 }}
        />
        <div className="form-group" style={{ margin: 0, flex: 1 }}>
          <input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            placeholder="#534AB7"
          />
        </div>
        <button className="btn btn-primary" onClick={handleCopyVars}>Copy CSS Variables</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginTop: "12px" }}>
        {shades.map((shade) => (
          <div key={shade.name} style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", textAlign: "center" }}>
            <div style={{ backgroundColor: shade.hex, height: "48px" }} />
            <div style={{ padding: "8px 4px" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--text)" }}>{shade.name}</div>
              <div style={{ fontSize: "10px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{shade.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 28. CSS Unit Converter
export const CssUnitConverter: React.FC = () => {
  const [val, setVal] = useState<number>(16);
  const [fromUnit, setFromUnit] = useState<"px" | "rem" | "em" | "vw">("px");
  const [base, setBase] = useState<number>(16);

  const [equivalents, setEquivalents] = useState({
    px: 0,
    rem: 0,
    em: 0,
    vw: 0
  });

  useEffect(() => {
    let pxVal = val;
    
    // Normalize to px
    if (fromUnit === "rem" || fromUnit === "em") {
      pxVal = val * base;
    } else if (fromUnit === "vw") {
      // Mock assumes standard 1920 viewport width for VW calculation
      pxVal = val * (1920 / 100);
    }

    setEquivalents({
      px: Number(pxVal.toFixed(2)),
      rem: Number((pxVal / base).toFixed(3)),
      em: Number((pxVal / base).toFixed(3)),
      vw: Number((pxVal / (1920 / 100)).toFixed(2))
    });
  }, [val, fromUnit, base]);

  return (
    <div className="tool-workspace">
      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Value</label>
          <input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>From Unit</label>
          <select value={fromUnit} onChange={(e: any) => setFromUnit(e.target.value)}>
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="vw">vw</option>
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Base Font (px)</label>
          <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", textAlign: "center", marginTop: "8px" }}>
        {Object.entries(equivalents).map(([unit, value]) => (
          <div key={unit} style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase" }}>{unit}</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--primary)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
