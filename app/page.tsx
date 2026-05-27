"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { StatsBar } from "../components/StatsBar";
import { ToolsGrid } from "../components/ToolsGrid";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { Toast, ToastItem } from "../components/Toast";
import { ToolDefinition } from "../components/tools/registry";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Persistent URL Hash filter sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validCategories = ["all", "converters", "encoding", "text", "css", "generators", "fun"];
      if (validCategories.includes(hash)) {
        setActiveCategory(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    window.location.hash = category;
  };

  // Toast helper
  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);

    // Auto dismiss after 2s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)" }}>
      {/* Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Header */}
      <Hero />

      {/* Stats highlight bar */}
      <StatsBar />

      {/* Grid containing all tools */}
      <ToolsGrid
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToolSelect={setActiveTool}
      />

      {/* Suggestions / Footer */}
      <Footer onCategorySelect={handleCategorySelect} showToast={showToast} />

      {/* Modal overlay popup representing open tools */}
      <Modal
        isOpen={activeTool !== null}
        onClose={() => setActiveTool(null)}
        title={activeTool?.name || ""}
      >
        {activeTool && (
          <activeTool.component showToast={showToast} />
        )}
      </Modal>

      {/* Dynamic toaster notifier */}
      <Toast toasts={toasts} />
    </div>
  );
}
