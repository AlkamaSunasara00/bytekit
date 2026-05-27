import React from "react";
import { ToolProps } from "./ToolInterfaces";

// Converters
import {
  JsonFormatter,
  JsonYamlConverter,
  JsonXmlConverter,
  UnixTimestamp,
  NumberBaseConverter,
  ColorConverter,
  CaseConverter,
  CsvJsonConverter,
} from "./Converters";

// Encoding & Crypto
import {
  Base64Converter,
  UrlConverter,
  HtmlEntityConverter,
  HashGenerator,
  JwtDebugger,
  PasswordGenerator,
  UuidGenerator,
} from "./Encoding";

// Text & Code
import {
  RegexTester,
  TextDiff,
  MarkdownPreview,
  LoremIpsumGenerator,
  WordCounter,
  CodeBeautifier,
  StringEscapeConverter,
} from "./TextCode";

// CSS & Design
import {
  BoxShadowBuilder,
  GradientGenerator,
  BorderRadiusBuilder,
  FlexboxPlayground,
  ColorPaletteGenerator,
  CssUnitConverter,
} from "./CSSDesign";

// Generators
import {
  QrCodeGenerator,
  GitignoreGenerator,
  CronBuilder,
  FakeDataGenerator,
  MetaTagGenerator,
  SqlFormatter,
} from "./Generators";

// Fun
import {
  AsciiGenerator,
  PomodoroTimer,
  HttpStatusReference,
  ColorFinder,
  CommitGenerator,
  VariableSuggester,
} from "./Fun";

export interface ToolDefinition {
  id: number;
  name: string;
  description: string;
  category: "converters" | "encoding" | "text" | "css" | "generators" | "fun";
  component: React.FC<ToolProps>;
}

export const TOOLS: ToolDefinition[] = [
  // Converters
  {
    id: 1,
    name: "JSON Formatter",
    description: "Format, prettify, minify, and validate JSON syntax with color highlighting.",
    category: "converters",
    component: JsonFormatter,
  },
  {
    id: 2,
    name: "JSON ↔ YAML",
    description: "Live conversion between JSON and YAML. Bidirectional sync.",
    category: "converters",
    component: JsonYamlConverter,
  },
  {
    id: 3,
    name: "JSON ↔ XML",
    description: "Convert JSON syntax tree to XML tags or reverse parse bidirectional.",
    category: "converters",
    component: JsonXmlConverter,
  },
  {
    id: 4,
    name: "Unix Timestamp",
    description: "Epoch timestamp to human-readable date conversion and current live time.",
    category: "converters",
    component: UnixTimestamp,
  },
  {
    id: 5,
    name: "Number Base Converter",
    description: "Input decimal, hexadecimal, octal, or binary to see all bases synchronously.",
    category: "converters",
    component: NumberBaseConverter,
  },
  {
    id: 6,
    name: "Color Converter",
    description: "Pick color or enter HEX to convert to RGB, HSL, and HSV swatch values.",
    category: "converters",
    component: ColorConverter,
  },
  {
    id: 7,
    name: "Case Converter",
    description: "Transform text casing instantly into UPPER, lower, camel, snake, or kebab.",
    category: "converters",
    component: CaseConverter,
  },
  {
    id: 8,
    name: "CSV ↔ JSON",
    description: "Convert tabular CSV files to JSON object arrays or vice-versa easily.",
    category: "converters",
    component: CsvJsonConverter,
  },

  // Encoding & Crypto
  {
    id: 9,
    name: "Base64 Encode/Decode",
    description: "Encode or decode strings and binary file uploads into Base64 format.",
    category: "encoding",
    component: Base64Converter,
  },
  {
    id: 10,
    name: "URL Encode/Decode",
    description: "Encode or decode URL characters safely with live percent conversion.",
    category: "encoding",
    component: UrlConverter,
  },
  {
    id: 11,
    name: "HTML Entity Encoder",
    description: "Safely escape HTML syntax characters to entities and back to raw code.",
    category: "encoding",
    component: HtmlEntityConverter,
  },
  {
    id: 12,
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.",
    category: "encoding",
    component: HashGenerator,
  },
  {
    id: 13,
    name: "JWT Debugger",
    description: "Decode JWT token payload, header tokens, and check unix expiration.",
    category: "encoding",
    component: JwtDebugger,
  },
  {
    id: 14,
    name: "Password Generator",
    description: "Generate cryptographically secure passwords with entropy strength meters.",
    category: "encoding",
    component: PasswordGenerator,
  },
  {
    id: 15,
    name: "UUID Generator",
    description: "Generate single or bulk v4 cryptographically secure UUIDs instantly.",
    category: "encoding",
    component: UuidGenerator,
  },

  // Text & Code
  {
    id: 16,
    name: "Regex Tester",
    description: "Test regular expressions with real-time match count and highlighting.",
    category: "text",
    component: RegexTester,
  },
  {
    id: 17,
    name: "Text Diff",
    description: "Line-by-line comparison highlight comparing original and modified text.",
    category: "text",
    component: TextDiff,
  },
  {
    id: 18,
    name: "Markdown Preview",
    description: "Split-pane preview rendering raw Markdown into HTML styled code.",
    category: "text",
    component: MarkdownPreview,
  },
  {
    id: 19,
    name: "Lorem Ipsum Generator",
    description: "Generate standard placeholder text by paragraph, word, or sentences.",
    category: "text",
    component: LoremIpsumGenerator,
  },
  {
    id: 20,
    name: "Word Counter",
    description: "Live word, character, sentence, paragraph counts, and reading times.",
    category: "text",
    component: WordCounter,
  },
  {
    id: 21,
    name: "Code Beautifier",
    description: "Beautify and indent Javascript, JSON, CSS, HTML, and SQL queries.",
    category: "text",
    component: CodeBeautifier,
  },
  {
    id: 22,
    name: "String Escape/Unescape",
    description: "Escape or unescape backslashes in Javascript and JSON strings.",
    category: "text",
    component: StringEscapeConverter,
  },

  // CSS & Design
  {
    id: 23,
    name: "CSS Box Shadow",
    description: "Interactive slider customizer generating complete shadow properties.",
    category: "css",
    component: BoxShadowBuilder,
  },
  {
    id: 24,
    name: "CSS Gradient Builder",
    description: "Build angled/radial gradients with 2-4 color stops live visually.",
    category: "css",
    component: GradientGenerator,
  },
  {
    id: 25,
    name: "Border Radius Builder",
    description: "Curves 4 individual corners generating copyable CSS border radii.",
    category: "css",
    component: BorderRadiusBuilder,
  },
  {
    id: 26,
    name: "Flexbox Playground",
    description: "Test alignment, wrap properties, and flex layouts live visually.",
    category: "css",
    component: FlexboxPlayground,
  },
  {
    id: 27,
    name: "Color Palette Generator",
    description: "Input hex base to generate a 50-900 tint scale as CSS variables.",
    category: "css",
    component: ColorPaletteGenerator,
  },
  {
    id: 28,
    name: "CSS Unit Converter",
    description: "Convert px, rem, em, and vw sizes dynamically with custom bases.",
    category: "css",
    component: CssUnitConverter,
  },

  // Generators
  {
    id: 29,
    name: "QR Code Generator",
    description: "Convert text or URLs into instant QR code image files downloadable as PNG.",
    category: "generators",
    component: QrCodeGenerator,
  },
  {
    id: 30,
    name: ".gitignore Generator",
    description: "Generate clean workspace ignore configuration files for 10+ environments.",
    category: "generators",
    component: GitignoreGenerator,
  },
  {
    id: 31,
    name: "Cron Builder",
    description: "Visual time scheduler showing readable explanations and run executions.",
    category: "generators",
    component: CronBuilder,
  },
  {
    id: 32,
    name: "Fake Data Generator",
    description: "Bulk generate names, emails, addresses, and phone records in JSON arrays.",
    category: "generators",
    component: FakeDataGenerator,
  },
  {
    id: 33,
    name: "Meta Tag Generator",
    description: "Configure primary OpenGraph and Twitter cards showing search result previews.",
    category: "generators",
    component: MetaTagGenerator,
  },
  {
    id: 34,
    name: "SQL Formatter",
    description: "Format database queries raising SQL keywords to clean uppercase layout.",
    category: "generators",
    component: SqlFormatter,
  },

  // Fun
  {
    id: 35,
    name: "ASCII Art Generator",
    description: "Convert normal typography strings into large banner styled monospace ASCII art.",
    category: "fun",
    component: AsciiGenerator,
  },
  {
    id: 36,
    name: "Pomodoro Timer",
    description: "25/5 focus interval timer with rings, completion audio, and sessions.",
    category: "fun",
    component: PomodoroTimer,
  },
  {
    id: 37,
    name: "HTTP Status Catalog",
    description: "Complete searchable database reference of standard HTTP code rules.",
    category: "fun",
    component: HttpStatusReference,
  },
  {
    id: 38,
    name: "Color Name Finder",
    description: "Input hex color values to matching closer official CSS named swatches.",
    category: "fun",
    component: ColorFinder,
  },
  {
    id: 39,
    name: "Commit Message Conventional",
    description: "Draft clean Conventional Commits featuring scopes and standard types.",
    category: "fun",
    component: CommitGenerator,
  },
  {
    id: 40,
    name: "Variable Suggester",
    description: "Describe what a variable represents to obtain Pascal/camel suggestions.",
    category: "fun",
    component: VariableSuggester,
  },
];
