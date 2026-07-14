"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import DiscoverGrid from "@/components/DiscoverGrid";
import DiscoverSections from "@/components/DiscoverSections";
import SearchOverlay from "@/components/SearchOverlay";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Once the in-page discovery grid scrolls under the nav, reveal the chevron
  // and nav border; scrolling back up hides them and closes the mega menu.
  useEffect(() => {
    const onScroll = () => {
      const el = gridRef.current;
      if (!el) return;
      const past = el.getBoundingClientRect().bottom <= 64;
      setScrolled(past);
      if (!past) setMenuOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Escape closes the mega menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // CMD+K / Ctrl+K toggles search.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="bg-[var(--background)]">
      <Navbar
        onSearchClick={openSearch}
        showDiscoverChevron={scrolled}
        discoverMenuOpen={menuOpen}
        onDiscoverToggle={() => setMenuOpen((o) => !o)}
        bordered={scrolled}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={closeSearch}
        experience="Apps"
        platform="iOS"
        allowEditing={false}
      />
      <main
        className="mx-auto flex w-full grow flex-col"
        style={{
          maxWidth: "calc(var(--max-content-width) + var(--container-x-padding) * 2)",
        }}
      >
        <div
          className="flex flex-col gap-y-[56px] py-[32px]"
          style={{
            paddingLeft: "var(--container-x-padding)",
            paddingRight: "var(--container-x-padding)",
          }}
        >
          {/* Discovery grid — navigation only; it no longer drives the cards. */}
          <div ref={gridRef}>
            <DiscoverGrid />
          </div>

          <DiscoverSections />
        </div>
      </main>
    </div>
  );
}
