"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import TabsBar, { sortOptionsFor } from "@/components/TabsBar";
import AppCardsGrid from "@/components/AppCardsGrid";
import SearchOverlay from "@/components/SearchOverlay";

type Experience = "Apps" | "Sites";
type Platform = "iOS" | "Web";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTab, setSearchTab] = useState("Trending");
  const [experience, setExperience] = useState<Experience>("Apps");
  const [platform, setPlatform] = useState<Platform>("iOS");
  const [filter, setFilter] = useState("Trending");
  const [sort, setSort] = useState("Latest");

  const openSearch = useCallback(() => {
    setSearchTab("Trending");
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Open the search modal on the tab matching the current page filter.
  const openFilters = useCallback(() => {
    setSearchTab(filter);
    setSearchOpen(true);
  }, [filter]);

  // Hydrate selections from the URL on first mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const exp = params.get("experience");
    if (exp === "Apps" || exp === "Sites") setExperience(exp);
    const plat = params.get("platform");
    if (plat === "iOS" || plat === "Web") setPlatform(plat);
    const f = params.get("filter");
    if (f) setFilter(f);
    const s = params.get("sort");
    if (s) setSort(s);
  }, []);

  // Reflect selections back into the URL (skip the initial render).
  const firstWrite = useRef(true);
  useEffect(() => {
    if (firstWrite.current) {
      firstWrite.current = false;
      return;
    }
    const params = new URLSearchParams();
    params.set("experience", experience);
    if (experience === "Apps") params.set("platform", platform);
    params.set("filter", filter);
    params.set("sort", sort);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [experience, platform, filter, sort]);

  // Switching experience resets filter/sort, since the options differ.
  const changeExperience = useCallback((value: Experience) => {
    setExperience(value);
    setFilter("Trending");
    setSort(sortOptionsFor(value, "Trending")[0]);
  }, []);

  // Switching filter keeps sort valid (the available sort options differ).
  const changeFilter = useCallback(
    (value: string) => {
      setFilter(value);
      setSort((prev) => {
        const options = sortOptionsFor(experience, value);
        return options.includes(prev) ? prev : options[0];
      });
    },
    [experience],
  );

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
      <SearchOverlay open={searchOpen} onClose={closeSearch} initialTab={searchTab} />
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
          <TabsBar
            experience={experience}
            onExperienceChange={changeExperience}
            platform={platform}
            onPlatformChange={setPlatform}
            filter={filter}
            onFilterChange={changeFilter}
            onFilterHeaderClick={openFilters}
            sort={sort}
            onSortChange={setSort}
          />
          <AppCardsGrid
            experience={experience}
            platform={platform}
            filter={filter}
            sort={sort}
          />
        </div>
      </main>
    </div>
  );
}
