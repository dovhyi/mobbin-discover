"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

interface Patch {
  experience?: Experience;
  platform?: Platform;
  sort?: string;
  query?: string;
  filters?: Filters;
}

function SearchPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [searchOpen, setSearchOpen] = useState(false);

  // CMD+K / Ctrl+K toggles the search modal.
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

  // The URL is the source of truth so re-searches (incl. from the modal) update.
  const experience: Experience = params.get("exp") === "sites" ? "sites" : "apps";
  const platform: Platform = params.get("platform") === "Web" ? "Web" : "iOS";
  const sort = params.get("sort") || "Trending";
  const query = params.get("q") || "";
  const filters = decodeFilters(params.get("f") || "");

  const commit = useCallback(
    (patch: Patch) => {
      const exp = patch.experience ?? experience;
      const plat = patch.platform ?? platform;
      const srt = patch.sort ?? sort;
      const q = patch.query ?? query;
      const f = patch.filters ?? filters;
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      p.set("exp", exp);
      if (exp === "apps") p.set("platform", plat);
      if (srt !== "Trending") p.set("sort", srt);
      const fe = encodeFilters(f);
      if (fe) p.set("f", fe);
      router.replace(`${pathname}?${p.toString()}`);
    },
    [experience, platform, sort, query, filters, router, pathname],
  );

  const toggleFilter = useCallback(
    (dim: string, value: string) => {
      const cur = filters[dim] ?? [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      const nf = { ...filters };
      if (next.length) nf[dim] = next;
      else delete nf[dim];
      commit({ filters: nf });
    },
    [filters, commit],
  );

  const clearDim = useCallback(
    (dim: string) => {
      const nf = { ...filters };
      delete nf[dim];
      commit({ filters: nf });
    },
    [filters, commit],
  );

  const type = resultTypeFor(experience, filters);
  const count = resultCount(type);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar onSearchClick={() => setSearchOpen(true)} activePage="none" query={query} />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        experience={experience === "sites" ? "Sites" : "Apps"}
        platform={platform}
        initialQuery={query}
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
            onExperienceChange={(value) => commit({ experience: value, filters: {} })}
            platform={platform}
            onPlatformChange={(value) => commit({ platform: value })}
            filters={filters}
            onToggleFilter={toggleFilter}
            onClearDim={clearDim}
            onReset={() => commit({ filters: {} })}
            sort={sort}
            onSortChange={(value) => commit({ sort: value })}
            count={count}
            countNoun={type}
          />

          <SearchResults
            experience={experience}
            platform={platform}
            type={type}
            filters={filters}
            query={query}
          />
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <SearchPageInner />
    </Suspense>
  );
}
