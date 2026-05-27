"use client";

import React from "react";
import { AppContextProvider, useAppContext } from "../context/AppContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Modal } from "./Modal";
import { Toast } from "./Toast";
import { HeartIcon } from "./icons";
import { useRouter, usePathname } from "next/navigation";
import { ToolFilter } from "./page-views/types";

const AppLayoutInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    wishlistIds,
    historyEntries,
    toasts,
    activeTool,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    showToast,
    closeTool,
    toggleWishlist,
  } = useAppContext();

  const router = useRouter();
  const pathname = usePathname();

  const activeToolIsWishlisted = activeTool ? wishlistIds.includes(activeTool.id) : false;

  // Sync activeFilter with the current pathname on path changes
  React.useEffect(() => {
    if (pathname === "/") {
      setActiveFilter("all");
    } else if (pathname === "/wishlist") {
      setActiveFilter("wishlist");
    } else if (pathname === "/history") {
      setActiveFilter("history");
    } else if (pathname.startsWith("/tools/")) {
      const cat = pathname.replace("/tools/", "") as ToolFilter;
      setActiveFilter(cat);
    }
  }, [pathname, setActiveFilter]);

  const handleFilterSelect = (filter: ToolFilter) => {
    setActiveFilter(filter);
    
    // Perform standard client-side router navigation
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
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg)",
      }}
    >
      <Navbar
        activeFilter={activeFilter}
        onFilterSelect={handleFilterSelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistCount={wishlistIds.length}
        historyCount={historyEntries.length}
      />

      <main style={{ flex: "1 0 auto" }}>
        {children}
      </main>

      <Footer onFilterSelect={handleFilterSelect} showToast={showToast} />

      <Modal
        isOpen={activeTool !== null}
        onClose={closeTool}
        title={activeTool?.name || ""}
        actions={
          activeTool ? (
            <button
              type="button"
              onClick={() => toggleWishlist(activeTool)}
              className="btn btn-ghost"
              aria-label={
                activeToolIsWishlisted
                  ? `Remove ${activeTool.name} from wishlist`
                  : `Add ${activeTool.name} to wishlist`
              }
              style={{
                height: "36px",
                padding: "0 14px",
                border: "1px solid",
                borderColor: activeToolIsWishlisted ? "rgba(83, 74, 183, 0.2)" : "var(--border)",
                backgroundColor: activeToolIsWishlisted ? "var(--primary-light)" : "transparent",
                color: activeToolIsWishlisted ? "var(--primary)" : "var(--muted)",
              }}
            >
              <HeartIcon size={15} fill={activeToolIsWishlisted ? "currentColor" : "none"} />
              {activeToolIsWishlisted ? "Saved" : "Save"}
            </button>
          ) : null
        }
      >
        {activeTool && <activeTool.component showToast={showToast} />}
      </Modal>

      <Toast toasts={toasts} />
    </div>
  );
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppContextProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AppContextProvider>
  );
};
