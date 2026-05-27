"use client";

import React from "react";
import { ToolsGrid } from "./ToolsGrid";
import { GitGuideView } from "./page-views/GitGuideView";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { ToolFilter } from "./page-views/types";

interface CategoryPageClientProps {
  category: string;
}

export const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ category }) => {
  const {
    wishlistIds,
    historyEntries,
    searchQuery,
    setSearchQuery,
    openTool,
    toggleWishlist,
    clearWishlist,
    clearHistory,
    showToast,
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

  const activeCategory = category as ToolFilter;

  if (activeCategory === "git") {
    return (
      <div style={{ paddingTop: "24px" }}>
        <GitGuideView onBack={() => handleFilterSelect("all")} showToast={showToast} />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "24px" }}>
      <ToolsGrid
        activeFilter={activeCategory}
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
};
