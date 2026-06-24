"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TabsBar from "@/components/TabsBar";
import AppCardsGrid from "@/components/AppCardsGrid";
import SearchOverlay from "@/components/SearchOverlay";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // CMD+K / Ctrl+K shortcut to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-[var(--background)]">
      <Navbar onSearchClick={openSearch} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <main
        className="mx-auto flex w-full grow flex-col"
        style={{
          maxWidth:
            "calc(var(--max-content-width) + var(--container-x-padding) * 2)",
        }}
      >
        {/* Cards section */}
        <div
          className="flex flex-col gap-y-[80px] py-[32px]"
          style={{
            paddingLeft: "var(--container-x-padding)",
            paddingRight: "var(--container-x-padding)",
          }}
        >
          <TabsBar />
          <AppCardsGrid />
        </div>
      </main>
    </div>
  );
}
