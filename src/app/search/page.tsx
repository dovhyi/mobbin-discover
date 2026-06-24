"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchOverlay from "@/components/SearchOverlay";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";
import {
  resultCount,
  resultTypeFor,
  type Experience,
  type Filters,
  type Platform,
} from "@/lib/search";

function encodeFilters(filters: Filters): string {
  const parts: string[] = [];
  Object.keys(filters).forEach((dim) => {
    filters[dim].forEach((v) => parts.push(`${dim}:${v}`));
  });
  return parts.join("~");
}

function decodeFilters(raw: string): Filters {
  const out: Filters = {};
  raw.split("~").forEach((seg) => {
    const i = seg.indexOf(":");
    if (i < 0) return;
    const dim = seg.slice(0, i);
    const val = seg.slice(i + 1);
    if (!dim || !val) return;
    (out[dim] ||= []).push(val);
  });
  return out;
}

export default function SearchPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [experience, setExperience] = useState<Experience>("apps");
  const [platform, setPlatform] = useState<Platform>("iOS");
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState("Trending");
  const [query, setQuery] = useState("");

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Hydrate from URL on mount.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const exp = p.get("exp");
    if (exp === "apps" || exp === "sites") setExperience(exp);
    const plat = p.get("platform");
    if (plat === "iOS" || plat === "Web") setPlatform(plat);
    const s = p.get("sort");
    if (s) setSort(s);
    const q = p.get("q");
    if (q) setQuery(q);
    const f = p.get("f");
    if (f) setFilters(decodeFilters(f));
  }, []);

  // Reflect to URL (skip first render).
  const firstWrite = useRef(true);
  useEffect(() => {
    if (firstWrite.current) {
      firstWrite.current = false;
      return;
    }
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    p.set("exp", experience);
    if (experience === "apps") p.set("platform", platform);
    if (sort !== "Trending") p.set("sort", sort);
    const f = encodeFilters(filters);
    if (f) p.set("f", f);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [query, experience, platform, sort, filters]);

  const changeExperience = useCallback((value: Experience) => {
    setExperience(value);
    setFilters({});
  }, []);

  const toggleFilter = useCallback((dim: string, value: string) => {
    setFilters((prev) => {
      const cur = prev[dim] ?? [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      const copy = { ...prev };
      if (next.length) copy[dim] = next;
      else delete copy[dim];
      return copy;
    });
  }, []);

  const clearDim = useCallback((dim: string) => {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[dim];
      return copy;
    });
  }, []);

  const reset = useCallback(() => setFilters({}), []);

  const type = resultTypeFor(experience, filters);
  const count = resultCount(type);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar onSearchClick={openSearch} />
      <SearchOverlay
        open={searchOpen}
        onClose={closeSearch}
        experience={experience === "sites" ? "Sites" : "Apps"}
      />
      <main
        className="mx-auto flex w-full flex-col"
        style={{
          maxWidth: "calc(var(--max-content-width) + var(--container-x-padding) * 2)",
        }}
      >
        <div
          className="flex flex-col gap-y-[20px] py-[20px]"
          style={{
            paddingLeft: "var(--container-x-padding)",
            paddingRight: "var(--container-x-padding)",
          }}
        >
          {query && (
            <h1 className="text-[24px] font-[652] leading-[32px] text-[var(--foreground)]">
              {query}
            </h1>
          )}

          <SearchFilters
            experience={experience}
            onExperienceChange={changeExperience}
            platform={platform}
            onPlatformChange={setPlatform}
            filters={filters}
            onToggleFilter={toggleFilter}
            onClearDim={clearDim}
            onReset={reset}
            sort={sort}
            onSortChange={setSort}
            count={count}
            countNoun={type}
          />

          <SearchResults
            experience={experience}
            platform={platform}
            type={type}
            filters={filters}
          />
        </div>
      </main>
    </div>
  );
}
