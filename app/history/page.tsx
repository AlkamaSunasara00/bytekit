"use client";

import React from "react";
import { ToolsGrid } from "../../components/ToolsGrid";
import { useAppContext } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { ToolFilter } from "../../components/page-views/types";

export default function HistoryPage() {
  const {
    wishlistIds,
    historyEntries,
    searchQuery,
    setSearchQuery,
    openTool,
    toggleWishlist,
    clearWishlist,
    clearHistory,
    setActiveFilter,
  } = useAppContext();

  const router = useRouter();

  const handleFilterSelect = (filter: ToolFilter) => {
    setActiveFilter(filter);
    if (filter === "all") {
      router.push("/");
    } else if (filter === "wishlist") {
      router.push("/wishlist");
    } else if (filter === "history") {
      router.push("/history");
    } else {
      router.push(`/tools/${filter}`);
    }
  };

  return (
    <div style={{ paddingTop: "24px" }}>
      <ToolsGrid
        activeFilter="history"
        onFilterSelect={handleFilterSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToolSelect={openTool}
        wishlistIds={wishlistIds}
        historyEntries={historyEntries}
        onToggleWishlist={toggleWishlist}
        onClearWishlist={clearWishlist}
        onClearHistory={clearHistory}
      />
    </div>
  );
}
