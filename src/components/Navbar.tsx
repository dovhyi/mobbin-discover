"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DiscoverGrid from "@/components/DiscoverGrid";

const SEARCH_PLACEHOLDERS = ["Search iOS", "Search Web", "Search Sites"];

interface NavbarProps {
  onSearchClick?: () => void;
  activePage?: "discover" | "community" | "none";
  query?: string;
  // Discovery menu (home page): the chevron appears once the in-page grid is
  // scrolled past, and toggles a mega menu with the same grid.
  showDiscoverChevron?: boolean;
  discoverMenuOpen?: boolean;
  onDiscoverToggle?: () => void;
  // A border appears once the page is scrolled past the grid's resting spot.
  bordered?: boolean;
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 3C11.6569 3 13 4.34315 13 6V9.33301L13.2002 9.59961L16 13.332V14H12.2361H7.76389H4V13.332L6.7998 9.59961L7 9.33301V6C7 4.34315 8.34315 3 10 3ZM7 16H2V12.667L2.2002 12.4004L5 8.66699V6C5 3.23858 7.23858 1 10 1C12.7614 1 15 3.23858 15 6V8.66699L17.7998 12.4004L18 12.667V16H13C13 17.6569 11.6569 19 10 19C8.34315 19 7 17.6569 7 16Z" fill="currentColor" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar({
  onSearchClick,
  activePage = "discover",
  query,
  showDiscoverChevron = false,
  discoverMenuOpen = false,
  onDiscoverToggle,
  bordered = false,
}: NavbarProps) {
  const [phIndex, setPhIndex] = useState(0);
  useEffect(() => {
    if (query) return;
    const id = setInterval(
      () => setPhIndex((i) => (i + 1) % SEARCH_PLACEHOLDERS.length),
      2400,
    );
    return () => clearInterval(id);
  }, [query]);

  const linkClass = (page: string) =>
    `text-[16px] font-semibold leading-[22px] tracking-[0.2px] transition-colors ${
      activePage === page ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <header className="sticky top-0 z-11">
      <nav
        className={`bg-[var(--background)] transition-[border-color] ${
          discoverMenuOpen
            ? "" // merge seamlessly into the open mega menu below
            : bordered
              ? "border-b border-[var(--border)]"
              : "border-b border-[var(--border)] min-[1160px]:border-0"
        }`}
      >
        <div className="relative">
          <div
            className="mx-auto grid w-full grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[1fr_auto] items-center gap-x-[8px] min-[720px]:gap-x-[12px] min-[1160px]:grid-cols-[1fr_minmax(auto,520px)_1fr] min-[1160px]:grid-rows-1 min-[1160px]:py-[4px]"
            style={{
              maxWidth:
                "calc(var(--max-content-width) + var(--container-x-padding) * 2)",
              paddingLeft: "var(--container-x-padding)",
              paddingRight: "var(--container-x-padding)",
            }}
          >
            {/* Left: Logo + Nav (desktop) */}
            <div className="flex items-center gap-x-[16px] min-[1160px]:gap-x-[32px]">
              <Link href="/" className="shrink-0">
                <Image
                  src="/assets/logo.svg"
                  alt="Mobbin"
                  width={43}
                  height={20}
                  className="asset-invert"
                />
              </Link>
              {/* Desktop nav links */}
              <div className="hidden min-[1160px]:block">
                <div className="flex items-center gap-x-[16px] min-[1160px]:gap-x-[24px]">
                  <div className="flex items-center">
                    <Link href="/" className={linkClass("discover")}>
                      Discover
                    </Link>
                    <button
                      onClick={onDiscoverToggle}
                      aria-label="Toggle discovery menu"
                      aria-expanded={discoverMenuOpen}
                      aria-hidden={!showDiscoverChevron}
                      tabIndex={showDiscoverChevron ? 0 : -1}
                      className={`flex items-center overflow-hidden text-[var(--muted)] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-[var(--foreground)] ${
                        showDiscoverChevron
                          ? "ml-[6px] w-[16px] scale-100 opacity-100 blur-0"
                          : "pointer-events-none ml-0 w-0 scale-50 opacity-0 blur-[3px]"
                      }`}
                    >
                      <Chevron open={discoverMenuOpen} />
                    </button>
                  </div>
                  <Link href="#" className={linkClass("community")}>
                    Community
                  </Link>
                </div>
              </div>
            </div>

            {/* Center: Search */}
            <div className="overflow-hidden px-[4px] py-[8px]">
              <div className="group relative">
                <button onClick={onSearchClick} className="relative flex h-[40px] w-full min-w-0 cursor-pointer items-center justify-start gap-x-[8px] rounded-[24px] bg-[var(--surface)] px-[16px] text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] min-[1160px]:h-[48px] min-[1160px]:gap-x-[12px] min-[1160px]:px-[20px]">
                  <Image
                    src="/assets/search-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="asset-invert shrink-0 min-[1160px]:h-[20px] min-[1160px]:w-[20px]"
                  />
                  <span className="truncate text-[16px] font-normal leading-[24px]">
                    {query ? (
                      <span className="text-[var(--foreground)]">{query}</span>
                    ) : (
                      <span key={phIndex} className="animate-placeholder inline-block">
                        {SEARCH_PLACEHOLDERS[phIndex]}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="shrink-0 pl-[0px] min-[720px]:px-0">
              <div className="flex flex-row items-center gap-x-[16px] min-[720px]:justify-end">
                <div className="flex flex-row items-center gap-x-[8px]">
                  {/* Bookmark icon — hidden below 1024 */}
                  <div className="hidden min-[1024px]:inline-flex">
                    <a href="#" className="p-[4px]">
                      <div className="h-[28px] w-[28px]">
                        <Image
                          src="/assets/bookmark-icon.png"
                          alt="Saved"
                          width={28}
                          height={28}
                          className="asset-invert"
                        />
                      </div>
                    </a>
                  </div>
                  {/* Notifications (bell) — hidden below 1024 */}
                  <div className="hidden min-[1024px]:inline-flex">
                    <a href="#" className="p-[4px] text-[var(--foreground)]">
                      <div className="flex h-[28px] w-[28px] items-center justify-center">
                        <BellIcon />
                      </div>
                    </a>
                  </div>
                </div>
                {/* Invite & earn — hidden below 1024 */}
                <div className="hidden items-center justify-center min-[1024px]:flex">
                  <button className="relative h-[36px] cursor-pointer rounded-full border border-[var(--border-strong)] px-[12px] text-[14px] font-semibold leading-[20px] text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]">
                    <span className="flex items-center justify-center gap-x-[8px]">
                      <span className="truncate">Invite &amp; earn</span>
                    </span>
                  </button>
                </div>
                {/* Avatar */}
                <button className="transition-opacity hover:opacity-90">
                  <div className="relative">
                    <span className="relative block shrink-0 overflow-hidden rounded-full bg-[var(--background)]" style={{ width: 36, height: 36 }}>
                      <Image
                        src="/assets/avatar.png"
                        alt="Profile"
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile: Nav tabs on second row — hidden at 1160+ */}
            <div className="col-span-full row-start-2 min-[1160px]:hidden">
              <div className="flex h-[44px] items-center gap-x-[16px] py-[4px] min-[1160px]:gap-x-[24px] min-[1160px]:py-0">
                <Link href="/" className={linkClass("discover")}>
                  Discover
                </Link>
                <Link href="#" className={linkClass("community")}>
                  Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega menu — mirrors the in-page discovery grid. */}
      {discoverMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-0 -z-10 bg-[var(--backdrop)] backdrop-blur-[2px]"
            onClick={onDiscoverToggle}
          />
          <div className="absolute inset-x-0 top-full border-b border-[var(--border)] bg-[var(--background)]">
            <div
              className="mx-auto w-full py-[32px]"
              style={{
                maxWidth: "calc(var(--max-content-width) + var(--container-x-padding) * 2)",
                paddingLeft: "var(--container-x-padding)",
                paddingRight: "var(--container-x-padding)",
              }}
            >
              <DiscoverGrid onNavigate={onDiscoverToggle} />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
