# ByteKit — Developer Utility Hub

<p align="center">
  <svg width="600" height="150" viewBox="0 0 600 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text-title {
        font-family: 'system-ui', -apple-system, sans-serif;
        font-weight: 800;
        font-size: 52px;
        fill: #534AB7;
        animation: pulseColor 4s infinite alternate;
      }
      .text-subtitle {
        font-family: 'system-ui', -apple-system, sans-serif;
        font-weight: 500;
        font-size: 16px;
        fill: #888780;
      }
      .glow-rect {
        stroke: #534AB7;
        stroke-width: 2;
        stroke-dasharray: 800;
        stroke-dashoffset: 800;
        animation: drawBorder 4s infinite alternate ease-in-out;
      }
      @keyframes pulseColor {
        0% { fill: #534AB7; }
        50% { fill: #3C3489; }
        100% { fill: #1D9E75; }
      }
      @keyframes drawBorder {
        0% { stroke-dashoffset: 800; stroke: #534AB7; }
        50% { stroke: #993356; }
        100% { stroke-dashoffset: 0; stroke: #1D9E75; }
      }
    </style>
    <!-- Background card -->
    <rect x="2" y="2" width="596" height="146" rx="16" fill="#FFFFFF" stroke="#E5E4DD" stroke-width="1.5"/>
    <rect x="8" y="8" width="584" height="134" rx="12" fill="none" class="glow-rect"/>
    
    <!-- Title & Subtitle -->
    <text x="50%" y="75" text-anchor="middle" class="text-title">ByteKit</text>
    <text x="50%" y="110" text-anchor="middle" class="text-subtitle">Every tool a developer needs — local-first & secure</text>
  </svg>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/AlkamaSunasara00/bytekit?color=534AB7&style=flat-square" alt="License" />
  <img src="https://img.shields.io/github/stars/AlkamaSunasara00/bytekit?color=1D9E75&style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/github/issues/AlkamaSunasara00/bytekit?color=D85A30&style=flat-square" alt="Issues" />
  <img src="https://img.shields.io/badge/Next.js-16%20Turbopack-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Security-Local--First-green?style=flat-square" alt="Security" />
</p>

---

## 🚀 Introduction

**ByteKit** is a beautiful, comprehensive, and high-performance collection of developer tools and utility checkers designed to run entirely in your web browser. 

Unlike other online web toolkits that upload your clipboard data to remote servers, ByteKit operates **100% local-first**. Your sensitive inputs (like JWT tokens, passwords, customer JSON databases, and keys) never leave your computer. 

---

## ✨ Core Pillars & Features

* 🔐 **Privacy-First & Zero Tracking:** Zero databases, zero cloud synchronizations. All encoding, formatting, cryptographic generation, and conversions are calculated locally in your browser sandbox.
* 📂 **Page-Wise Categories (Next.js App Router):** Fully-indexed dynamic subpages (`/tools/converters`, `/tools/encoding`, `/tools/text`, etc.) for faster bookmarks and direct navigation.
* ❤️ **Wishlist & History Integrations:** Star your favorite utilities or browse your recently opened logs from a unified history section, equipped with live badge indicators directly in the header navbar.
* 🖥️ **Wider Premium Modals:** A spacious, glassmorphic `1100px` tool modal overlay built with soft ambient drop-shadows and subtle micro-animations for complex side-by-side tasks like Diff views and formatter playgrounds.
* 📶 **Offline & Network Independent:** Ready to work anywhere, anytime. Load the application once, and utilize all 42 utilities completely offline without network connections.

---

## 🛠️ The 42-in-1 Tool Catalog

ByteKit organizes 42 robust tools across 6 distinct page categories:

### 🔄 1. Converters & Parsers (`/tools/converters`)
* **JSON Formatter:** Format, prettify, minify, and validate JSON syntax with color highlights.
* **JSON ↔ YAML:** Live bidirectional converter for JSON structures and YAML templates.
* **JSON ↔ XML:** Synchronous conversion mapping JSON tree nodes to XML tag layers.
* **JSON Path Extractor:** Render collapsible JSON syntax trees and click nodes to copy paths instantly.
* **Unix Timestamp:** Epoch time conversions to human dates with live tick metrics.
* **Number Base Converter:** Live base mapping between Decimal, Hexadecimal, Octal, and Binary.
* **Color Converter:** Convert HEX values to HEXA, RGB, HSL, and HSV swatch outputs.
* **Case Converter:** Transform text casing to UPPER, lower, camelCase, snake_case, kebab-case, or Title Case.
* **CSV ↔ JSON:** Map tabular spreadsheet records to JSON arrays dynamically.

### 🔒 2. Encoding & Cryptography (`/tools/encoding`)
* **Base64 Encoder/Decoder:** Encode/decode files or strings to Base64 instantly.
* **URL Encoder/Decoder:** Safely escape query parameters or decode URL components.
* **HTML Entity Encoder:** Escape raw HTML characters to secure character references.
* **Hash Generator:** Hash inputs with MD5, SHA-1, SHA-256, or SHA-512 hashes.
* **JWT Debugger:** Decode Header, Payload, and Signature nodes, checking unix expirations.
* **Password Generator:** Generate secure keys based on customization rules with entropy strength checks.
* **UUID Generator:** Bulk generate cryptographically secure UUID v4 strings.

### 📝 3. Text & Code Editors (`/tools/text`)
* **Regex Tester:** Live regular expression parsing with pattern-matching captures.
* **Text Diff:** High-contrast line-by-line comparison highlights between original and modified text.
* **Markdown Previewer:** Split-pane editor translating raw markdown into readable formatted HTML.
* **Lorem Ipsum Generator:** Generate filler placeholders by word, paragraph, or sentence structures.
* **Word Counter:** Statistics reporting character, word, sentence, paragraph counts, and reading times.
* **Code Beautifier:** Indent and beautify HTML, CSS, JavaScript, JSON, and SQL blocks.
* **String Escape/Unescape:** Strip or inject escape slashes to prepare JSON strings.
* **SQL Formatter + Explainer:** Clean database queries into UPPERCASE syntax coupled with automated comment explanations.

### 🎨 4. CSS & Design Builders (`/tools/css`)
* **CSS Box Shadow:** Adjust horizontal, vertical offsets, blur radii, spreads, and copy properties.
* **CSS Gradient Builder:** Visual control mapping colors to linear and radial angle gradients.
* **Border Radius Builder:** Curve individual corners to generate complete CSS values.
* **Flexbox Playground:** Align layout blocks live to experiment with wrappers and distributions.
* **Color Palette Generator:** Build harmonious tint scales from 50 to 900 base variables.
* **CSS Unit Converter:** Convert PX, REM, EM, and VW units based on configurable base sizes.

### ⚙️ 5. Content Generators (`/tools/generators`)
* **QR Code Generator:** Convert text/URLs to dynamic QR codes downloadable as PNGs.
* **.gitignore Builder:** Generate standard workspace ignore presets for over 10 environments.
* **Cron Builder:** Build time execution schedules using an intuitive visual picker.
* **Fake Data Generator:** Generate names, emails, addresses, and phone records in JSON blocks.
* **Meta Tag Generator:** Set up OpenGraph and Twitter cards with live preview search results.
* **SQL Formatter:** Prettify database statements on the fly.

### 🎮 6. Developer Utilities (`/tools/fun` & `/tools/git`)
* **ASCII Art:** Transform input text into large retro banners.
* **Pomodoro Timer:** Focus session tracker featuring visual rings and sound prompts.
* **HTTP Catalog:** Searchable catalog reference of status rules and descriptions.
* **Color Name Finder:** Input HEX inputs to discover matching official CSS named swatches.
* **Conventional Commits:** Write clean commit messages according to standards.
* **Variable Suggester:** Describe your variable and receive camel/pascal recommendations.
* **Git CLI Guide:** Visual cheatsheet compiling common Git scenarios and command lines.

---

## 🏗️ Architecture & Project Structure

The project is built on **Next.js App Router (Turbopack)** and runs completely client-side. The file architecture is structured as follows:

```text
├── app/
│   ├── layout.tsx         # Global layout (imports AppLayout client-wrapper)
│   ├── page.tsx           # Home Route (renders Hero & Grid of categories)
│   ├── wishlist/
│   │   └── page.tsx       # Dedicated Wishlist route page (renders WishlistView)
│   ├── history/
│   │   └── page.tsx       # Dedicated History route page (renders HistoryView)
│   └── tools/
│       ├── page.tsx       # Safe redirect file returning traffic back to home
│       └── [category]/
│           └── page.tsx   # Server page compiling dynamic routing segments
├── components/
│   ├── AppLayout.tsx      # Main wrapper orchestrating Navbar, Footer, Modals & Toasts
│   ├── Navbar.tsx         # Upgraded navigation bar with Wishlist & History badges
│   ├── Hero.tsx           # Premium landing hero illustration
│   ├── Modal.tsx          # Expanded 1100px viewport overlay modal
│   ├── tools/
│   │   ├── registry.tsx   # Registry index listing all 42 tool definitions
│   │   └── ...            # Category-wise tool code components
│   └── page-views/        # Subviews for Wishlist, History, and Git guides
├── context/
│   └── AppContext.tsx     # Global React Context syncing storage to localStorage
└── public/                # Static brand logos and assets
```

---

## ⚡ Developer Getting Started

To run the project locally, install dependencies and launch the dev server:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) (v18+ recommended) installed.

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/AlkamaSunasara00/bytekit.git
cd bytekit
```

Install packages:
```bash
npm install
```

### 3. Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Production Build
Verify TypeScript compilation and Next.js static page generation:
```bash
npm run build
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — feel free to customize, host, and distribute it! Built with ❤️ for developers.
