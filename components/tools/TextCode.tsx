import React, { useState, useEffect } from "react";
import { ToolProps } from "./ToolInterfaces";
import { useScript } from "./useScript";

// 16. Regex Tester
export const RegexTester: React.FC<ToolProps> = ({ showToast }) => {
  const [pattern, setPattern] = useState("[0-9]+");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("We have 40 amazing tools in ByteKit! Generated in 2026.");
  const [matchCount, setMatchCount] = useState(0);
  const [highlightedText, setHighlightedText] = useState("");

  const testRegex = () => {
    if (!pattern) {
      setHighlightedText(testText);
      setMatchCount(0);
      return;
    }

    try {
      const rx = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      let count = 0;
      
      // Escape HTML in input
      const escaped = testText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      // Replace matches with highlight class
      const highlighted = escaped.replace(rx, (match) => {
        count++;
        return `<span style="background-color: #fef08a; color: #1e293b; padding: 1px 2px; border-radius: 2px; border: 1px solid #facc15">${match}</span>`;
      });

      setMatchCount(count);
      setHighlightedText(highlighted);
    } catch (e) {
      setHighlightedText(`<span style="color:red">Invalid RegExp pattern!</span>`);
      setMatchCount(0);
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Pattern</label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. [a-z]+"
                className="code-font"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Flags</label>
              <select value={flags} onChange={(e) => setFlags(e.target.value)}>
                <option value="g">g (Global)</option>
                <option value="gi">gi (Global + Insensitive)</option>
                <option value="gm">gm (Global + Multiline)</option>
                <option value="gim">gim (All)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Test String</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to match regex against..."
              style={{ height: "160px" }}
            />
          </div>
        </div>

        <div className="pane">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Match Highlighting</label>
            <span className="badge" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
              {matchCount} Matches
            </span>
          </div>
          <div
            className="code-font"
            style={{
              height: "220px",
              padding: "12px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              backgroundColor: "var(--surface)",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: "1.6"
            }}
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        </div>
      </div>
    </div>
  );
};

// 17. Text Diff
interface DiffPart {
  value: string;
  type: "unchanged" | "added" | "removed";
}

export const TextDiff: React.FC<ToolProps> = ({ showToast }) => {
  const [original, setOriginal] = useState("ByteKit has 40 tools\nAll offline\nZero databases");
  const [modified, setModified] = useState("ByteKit has 40+ tools\nAll offline\nNo databases required");
  const [diffs, setDiffs] = useState<DiffPart[]>([]);

  const compareText = () => {
    const lines1 = original.split("\n");
    const lines2 = modified.split("\n");
    const result: DiffPart[] = [];
    
    let i = 0, j = 0;
    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length) {
        if (lines1[i] === lines2[j]) {
          result.push({ value: lines1[i], type: "unchanged" });
          i++;
          j++;
        } else {
          // Lookahead in lines2
          const idx2 = lines2.indexOf(lines1[i], j);
          if (idx2 !== -1 && idx2 - j < 5) {
            for (let k = j; k < idx2; k++) {
              result.push({ value: lines2[k], type: "added" });
            }
            j = idx2;
          } else {
            result.push({ value: lines1[i], type: "removed" });
            i++;
          }
        }
      } else if (i < lines1.length) {
        result.push({ value: lines1[i], type: "removed" });
        i++;
      } else if (j < lines2.length) {
        result.push({ value: lines2[j], type: "added" });
        j++;
      }
    }
    setDiffs(result);
  };

  useEffect(() => {
    compareText();
  }, [original, modified]);

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Original Text</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            style={{ height: "160px" }}
          />
        </div>
        <div className="pane">
          <label>Modified Text</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            style={{ height: "160px" }}
          />
        </div>
      </div>

      <div>
        <label>Diff Comparison</label>
        <div
          className="code-font"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--surface)",
            padding: "16px",
            minHeight: "120px",
            maxHeight: "260px",
            overflowY: "auto",
            lineHeight: "1.6"
          }}
        >
          {diffs.map((d, idx) => {
            if (d.type === "added") {
              return (
                <div key={idx} className="diff-added">
                  + {d.value}
                </div>
              );
            }
            if (d.type === "removed") {
              return (
                <div key={idx} className="diff-removed">
                  - {d.value}
                </div>
              );
            }
            return <div key={idx} style={{ color: "var(--text)", paddingLeft: "14px" }}>&nbsp;&nbsp;{d.value}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// 18. Markdown Preview
export const MarkdownPreview: React.FC<ToolProps> = ({ showToast }) => {
  const [markdown, setMarkdown] = useState("# ByteKit\n\nEvery tool a dev needs, **right in the browser**.\n\n- Zero Backend\n- Fast\n- 40+ Tools");
  const [html, setHtml] = useState("");
  const markedStatus = useScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js");

  useEffect(() => {
    if (markedStatus === "ready") {
      const win = window as any;
      if (win.marked) {
        setHtml(win.marked.parse(markdown));
      }
    } else {
      setHtml("<p>Loading markdown engine...</p>");
    }
  }, [markdown, markedStatus]);

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Raw Markdown</label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            className="code-font"
            style={{ height: "300px" }}
          />
        </div>
        <div className="pane">
          <label>HTML Preview</label>
          <div
            className="markdown-preview-output"
            style={{ height: "300px" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

// 19. Lorem Ipsum Generator
export const LoremIpsumGenerator: React.FC<ToolProps> = ({ showToast }) => {
  const [type, setType] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const wordsList = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
    "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
    "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
    "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
    "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
    "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];

  const generateWords = (num: number) => {
    let list = [];
    for (let i = 0; i < num; i++) {
      list.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
    }
    let res = list.join(" ");
    return res.charAt(0).toUpperCase() + res.slice(1);
  };

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 8) + 6;
    return generateWords(len) + ".";
  };

  const generateParagraph = () => {
    const len = Math.floor(Math.random() * 4) + 3;
    let list = [];
    for (let i = 0; i < len; i++) {
      list.push(generateSentence());
    }
    return list.join(" ");
  };

  const handleGenerate = () => {
    let result = [];
    if (type === "paragraphs") {
      for (let i = 0; i < count; i++) {
        result.push(generateParagraph());
      }
      setOutput(result.join("\n\n"));
    } else if (type === "sentences") {
      for (let i = 0; i < count; i++) {
        result.push(generateSentence());
      }
      setOutput(result.join(" "));
    } else {
      setOutput(generateWords(count));
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [type, count]);

  return (
    <div className="tool-workspace">
      <div className="form-row">
        <div className="form-group">
          <label>Generate Type</label>
          <select value={type} onChange={(e: any) => setType(e.target.value)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div className="form-group">
          <label>Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>Generated Placeholder Text</label>
          <button className="btn btn-outline" onClick={() => {
            navigator.clipboard.writeText(output);
            showToast("Lorem Ipsum copied!");
          }} style={{ height: "32px" }}>Copy</button>
        </div>
        <textarea
          readOnly
          value={output}
          style={{ height: "200px", lineHeight: "1.6", backgroundColor: "var(--bg)" }}
        />
      </div>
    </div>
  );
};

// 20. Word Counter
export const WordCounter: React.FC<ToolProps> = () => {
  const [text, setText] = useState("Enter your text to instantly analyze words, characters, reading times...");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    lines: 0,
    sentences: 0,
    readingTime: 0
  });

  useEffect(() => {
    if (!text) {
      setStats({ words: 0, chars: 0, charsNoSpaces: 0, lines: 0, sentences: 0, readingTime: 0 });
      return;
    }

    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const lines = text.split("\n").length;
    const words = (text.trim().match(/\S+/g) || []).length;
    const sentences = (text.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0);
    const readingTime = Math.ceil(words / 200); // 200 WPM

    setStats({ words, chars, charsNoSpaces, lines, sentences, readingTime });
  }, [text]);

  return (
    <div className="tool-workspace">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste content here..."
        style={{ height: "180px" }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", textAlign: "center" }}>
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "Chars (No Space)", value: stats.charsNoSpaces },
          { label: "Lines", value: stats.lines },
          { label: "Sentences", value: stats.sentences },
          { label: "Reading Time", value: `${stats.readingTime} min` }
        ].map((item) => (
          <div key={item.label} style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)" }}>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--primary)", marginTop: "4px" }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 21. Code Beautifier
export const CodeBeautifier: React.FC<ToolProps> = ({ showToast }) => {
  const [lang, setLang] = useState("js");
  const [input, setInput] = useState('function greet(name){console.log("hello "+name);}');
  const [output, setOutput] = useState("");

  const formatCode = () => {
    if (!input.trim()) return;

    try {
      if (lang === "js") {
        // Simple mock formatting for JS using standard JSON spacing if parseable
        try {
          const parsed = JSON.parse(input);
          setOutput(JSON.stringify(parsed, null, 2));
        } catch {
          // Basic indentation mock logic for JS
          let indent = 0;
          const formatted = input
            .replace(/[;{}]/g, (match) => `${match}\n`)
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => {
              if (line.includes("}")) indent = Math.max(0, indent - 1);
              const spacing = "  ".repeat(indent);
              if (line.includes("{")) indent++;
              return spacing + line;
            })
            .join("\n");
          setOutput(formatted);
        }
      } else if (lang === "css") {
        let indent = 0;
        const formatted = input
          .replace(/[;{}]/g, (match) => `${match}\n`)
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            if (line.includes("}")) indent = Math.max(0, indent - 1);
            const spacing = "  ".repeat(indent);
            if (line.includes("{")) indent++;
            return spacing + line;
          })
          .join("\n");
        setOutput(formatted);
      } else if (lang === "sql") {
        // SQL upper-casing keywords + indentation
        const keywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "AND", "OR", "GROUP BY", "ORDER BY", "INSERT", "INTO", "VALUES", "UPDATE", "SET"];
        let temp = input;
        keywords.forEach((keyword) => {
          const rx = new RegExp(`\\b${keyword}\\b`, "gi");
          temp = temp.replace(rx, `\n${keyword}`);
        });
        const formatted = temp
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n");
        setOutput(formatted);
      } else {
        // HTML basic prettifier
        let indent = 0;
        const formatted = input
          .replace(/(<[^>]+>)/g, "\n$1\n")
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            if (line.startsWith("</")) indent = Math.max(0, indent - 1);
            const spacing = "  ".repeat(indent);
            if (line.startsWith("<") && !line.startsWith("</") && !line.endsWith("/>") && !line.startsWith("<!")) {
              indent++;
            }
            return spacing + line;
          })
          .join("\n");
        setOutput(formatted);
      }
    } catch (e) {
      showToast("Formatter failed! Check code syntax.");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    showToast("Beautified code copied!");
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Language</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="js">Javascript / JSON</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={formatCode} style={{ marginTop: "22px" }}>
              Format Code
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="code-font"
            style={{ height: "240px" }}
          />
        </div>
        <div className="pane">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Beautified Code</label>
            {output && <button className="btn btn-ghost" onClick={handleCopy} style={{ height: "28px" }}>Copy</button>}
          </div>
          <textarea
            readOnly
            value={output}
            className="code-font"
            style={{ height: "28px", flex: 1, backgroundColor: "var(--bg)" }}
          />
        </div>
      </div>
    </div>
  );
};

// 22. String Escape/Unescape
export const StringEscapeConverter: React.FC<ToolProps> = ({ showToast }) => {
  const [input, setInput] = useState('Hello \\n \\t \\"ByteKit\\"!');
  const [output, setOutput] = useState("");

  const handleEscape = () => {
    try {
      setOutput(JSON.stringify(input).slice(1, -1));
    } catch {
      showToast("Escape failed!");
    }
  };

  const handleUnescape = () => {
    try {
      // Unescapes string safe using JSON.parse wrapper
      setOutput(JSON.parse(`"${input}"`));
    } catch {
      showToast("Unescape failed! Ensure correct formatting.");
    }
  };

  return (
    <div className="tool-workspace">
      <div className="pane-container">
        <div className="pane">
          <label>Source String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="code-font"
            style={{ height: "200px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-primary" onClick={handleEscape} style={{ flex: 1 }}>Escape JS String</button>
            <button className="btn btn-outline" onClick={handleUnescape} style={{ flex: 1 }}>Unescape JS String</button>
          </div>
        </div>
        <div className="pane">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label>Output</label>
            {output && <button className="btn btn-ghost" onClick={() => {
              navigator.clipboard.writeText(output);
              showToast("Copied!");
            }} style={{ height: "28px" }}>Copy</button>}
          </div>
          <textarea readOnly value={output} className="code-font" style={{ height: "200px", backgroundColor: "var(--bg)" }} />
        </div>
      </div>
    </div>
  );
};
