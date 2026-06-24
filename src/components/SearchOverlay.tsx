"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import searchData from "@/data/searchResults.json";

/* ── Icon helpers (inline SVGs from mobbin.com) ── */

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M16.59 16.59L13.2429 13.2424M15 9C15 12.3137 12.3137 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="2" width="10" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
      <path d="M8 3C8 2.44772 8.44772 2 9 2H11C11.5523 2 12 2.44772 12 3C12 3.55228 11.5523 4 11 4H9C8.44772 4 8 3.55228 8 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function DesktopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M19 15H10.9893C10.9451 15.7154 10.7494 16.4027 10.417 17H14V19H7V17C8.06342 17 8.86869 16.2309 8.98438 15H1V2H19V15ZM3 11H17V4H3V11Z" fill="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function SitesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.58633 1.5862C2.35509 0.817445 3.49411 0.942687 4.35 1.18972C5.18855 1.43181 6.14699 1.89851 7.15567 2.52077C8.03941 2.18446 8.99765 1.99935 9.99942 1.99929C14.4177 1.99929 17.9994 5.58101 17.9994 9.99929C17.9994 11.0012 17.8133 11.9592 17.477 12.843C18.1153 13.8777 18.5929 14.8623 18.8295 15.721C19.0597 16.5566 19.1635 17.6613 18.4125 18.4124C17.7487 19.0758 16.8055 19.066 16.0639 18.9124C15.2745 18.7488 14.3767 18.3602 13.4428 17.8323C13.2464 17.7213 13.0469 17.6015 12.8432 17.4759C11.9594 17.8121 11.0012 17.9993 9.99942 17.9993C5.58149 17.999 1.99964 14.4172 1.99942 9.99929C1.99942 8.99731 2.18548 8.03848 2.52188 7.15456C2.39647 6.95127 2.27721 6.75196 2.16641 6.55593C1.63852 5.62196 1.24995 4.72426 1.08633 3.93483C0.93267 3.19319 0.92294 2.25001 1.58633 1.5862ZM16.3354 14.8792C15.9148 15.4243 15.4264 15.9136 14.8813 16.3342C15.5249 16.6657 16.0602 16.8694 16.4701 16.9544C16.7684 17.0161 16.9202 17.0004 16.9848 16.9866C17.0013 16.9125 17.0256 16.7051 16.9008 16.2522C16.795 15.8685 16.6067 15.4065 16.3354 14.8792ZM4.0375 9.32644C4.01288 9.5472 3.99942 9.77195 3.99942 9.99929C3.99964 13.3127 6.68606 15.999 9.99942 15.9993C10.2264 15.9993 10.4508 15.9848 10.6713 15.9602C9.52418 15.074 8.32802 14.0232 7.15176 12.8469C5.97512 11.6703 4.92395 10.4739 4.0375 9.32644ZM9.99942 3.99929C7.78095 3.99946 5.84514 5.20404 4.80703 6.99441C5.7568 8.36845 7.03737 9.90443 8.56582 11.4329C10.0941 12.9611 11.6304 14.241 13.0043 15.1907C14.7945 14.1525 15.9993 12.2176 15.9994 9.99929C15.9994 6.68558 13.3131 3.99929 9.99942 3.99929ZM3.01114 3.01296C2.99732 3.07712 2.98234 3.22909 3.04434 3.52858C3.12925 3.93821 3.33238 4.47336 3.66348 5.11648C4.08389 4.57167 4.57277 4.08277 5.11758 3.66237C4.61459 3.40349 4.16992 3.21976 3.79532 3.11159C3.30649 2.97052 3.08643 2.99609 3.01114 3.01296Z" fill="currentColor" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--muted-strong)]">
      <path d="M18.001 5L10.4852 12.7259L7.35364 9.50677L1.7168 15.3012" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M18.0008 12V5L11 5" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function CategoriesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--muted-strong)]">
      <rect x="3" y="10" width="14" height="8" stroke="currentColor" strokeWidth="2" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
      <path d="M5 6H15" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M7 2H13" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ScreensIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--muted-strong)]">
      <rect x="8" y="6" width="8" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
      <path d="M12 2H4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function UIElementIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--muted-strong)]">
      <path d="M2 10C2 6.68629 4.68629 4 8 4H12C15.3137 4 18 6.68629 18 10C18 13.3137 15.3137 16 12 16H8C4.68629 16 2 13.3137 2 10Z" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle cx="12" cy="10" r="3" fill="currentColor" />
    </svg>
  );
}

function FlowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[var(--muted-strong)]">
      <path d="M4 17C5.65685 17 7 15.6569 7 14C7 12.3431 5.65685 11 4 11C2.34315 11 1 12.3431 1 14C1 15.6569 2.34315 17 4 17Z" fill="currentColor" />
      <path d="M13 3H16H19V6V9H16H13V6V3Z" fill="currentColor" />
      <path d="M4 9V7C4 5.34315 5.34315 4 7 4C8.65685 4 10 5.34315 10 7V13C10 14.6569 11.3431 16 13 16C14.6569 16 16 14.6569 16 13V11" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function TextInScreenshotIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7 9H2" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M7 14H2" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M17 4H2" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M15 13L18.29 16.29" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M13 14C14.6569 14 16 12.6569 16 11C16 9.34315 14.6569 8 13 8C11.3431 8 10 9.34315 10 11C10 12.6569 11.3431 14 13 14Z" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AddCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d="M10 6V10M10 10V14M10 10H6M10 10H14" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ── Data ── */

const recentSearches = [
  { label: "Error", icon: "screens" },
  { label: "Smart defaults", icon: "search" },
  { label: "two step select", icon: "search" },
  { label: "Select", icon: "ui" },
  { label: "Dropdown Menu", icon: "ui" },
  { label: "dropdown group", icon: "search" },
];

const appsTabs = [
  { label: "Trending", icon: TrendingIcon },
  { label: "Categories", icon: CategoriesIcon },
  { label: "Screens", icon: ScreensIcon },
  { label: "UI Elements", icon: UIElementIcon },
  { label: "Flows", icon: FlowIcon },
];

const sitesTabs = [
  { label: "Trending", icon: TrendingIcon },
  { label: "Categories", icon: CategoriesIcon },
  { label: "Sections", icon: ScreensIcon },
  { label: "Styles", icon: UIElementIcon },
];

const trendingApps = [
  { name: "Claude", color: "#5A47A8" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Attio", color: "#1A1A1A" },
  { name: "Notion", color: "#FFFFFF" },
  { name: "Airbnb", color: "#FF5A5F" },
  { name: "Revolut", color: "#0D0D0D" },
  { name: "Intercom", color: "#1F8DED" },
];

const trendingScreens = [
  "Signup", "Login", "Home", "Dashboard",
  "Checkout", "Error", "Search", "Filter & Sort",
];

const uiElements = [
  "Table", "Card", "Dialog", "Stepper", "Button",
  "Side Navigation", "Banner", "Progress Indicator",
];

const flows = ["Onboarding", "Editing Profile", "Filtering & Sorting", "Browsing Tutorial"];

const textInScreenshot = ['"Forgot Password"', '"Contact Sales"', '"Bluetooth"'];

const allCategories = [
  "AI", "Business", "Collaboration", "Communication", "CRM",
  "Developer Tools", "Education", "Entertainment", "Finance", "Food & Drink",
  "Graphics & Design", "Health & Fitness", "Jobs & Recruitment", "Lifestyle",
];

const screensList = [
  "Onboarding", "Sign Up", "Log In", "Home", "Dashboard", "Search",
  "Checkout", "Settings", "Profile", "Paywall", "Verification", "Empty State",
];

const uiElementsList = [
  "Button", "Card", "Dialog", "Table", "Stepper", "Banner",
  "Side Navigation", "Progress Indicator", "Toggle", "Avatar", "Tooltip", "Tab Bar",
];

const flowsList = [
  "Onboarding", "Editing Profile", "Filtering & Sorting",
  "Browsing Tutorial", "Logging In", "Adding to Cart",
];

const sectionsList = [
  "Hero", "Features", "Pricing", "Testimonials", "FAQ", "Footer", "CTA", "Newsletter",
];

const stylesList = [
  "Minimal", "Bold", "Playful", "Brutalist", "Corporate", "Gradient", "Dark", "Monochrome",
];

// Items shown in the content area for each (non-Trending) sidebar tab.
const TAB_ITEMS: Record<string, string[]> = {
  Categories: allCategories,
  Screens: screensList,
  "UI Elements": uiElementsList,
  Flows: flowsList,
  Sections: sectionsList,
  Styles: stylesList,
};

// Deterministic per-item count so the list looks populated without real data.
function countFor(label: string): number {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return (h % 180) + 3;
}

/* ── Small icon for recent pills ── */
function RecentIcon({ type }: { type: string }) {
  if (type === "screens") return <ScreensIcon />;
  if (type === "ui") return <UIElementIcon />;
  return <SearchIcon className="text-[var(--foreground)]" />;
}

/* ── Flow icons (simplified) ── */
function FlowCardIcon({ name }: { name: string }) {
  const iconMap: Record<string, string> = {
    Onboarding: "\u{1F441}",
    "Editing Profile": "✏",
    "Filtering & Sorting": "⇅",
    "Browsing Tutorial": "\u{1F4AC}",
  };
  return <span className="text-[20px] opacity-40">{iconMap[name] || "•"}</span>;
}

/* ── Result row icon based on type ── */
function ResultIcon({ type }: { type: string }) {
  if (type === "screen") return <ScreensIcon />;
  if (type === "uiElement") return <UIElementIcon />;
  if (type === "flow") return <FlowIcon />;
  if (type === "textInScreenshot") return <TextInScreenshotIcon />;
  if (type === "addCircle") return <AddCircleIcon />;
  return <SearchIcon />;
}

/* ── Search result row ── */
interface SearchResultItem {
  type: string;
  name: string;
  description?: string;
  color?: string;
}

function ResultRow({ item, selected, rowRef }: { item: SearchResultItem; selected?: boolean; rowRef?: React.Ref<HTMLDivElement> }) {
  const isApp = item.type === "app";
  return (
    <div
      ref={rowRef}
      className={`flex h-[56px] cursor-pointer items-center gap-x-[12px] rounded-[16px] px-[8px] text-[var(--foreground)] transition-colors ${
        selected ? "bg-[var(--fill)]" : "hover:bg-[var(--fill)]"
      }`}
    >
      <div className="shrink-0">
        {isApp ? (
          <div
            className="size-[40px] shrink-0 rounded-[30%]"
            style={{ backgroundColor: item.color || "#333" }}
          />
        ) : (
          <div className="flex size-[40px] items-center justify-center rounded-[12px] bg-[var(--fill)]">
            <ResultIcon type={item.type} />
          </div>
        )}
      </div>
      <div className="flex grow flex-col overflow-hidden">
        <span className="truncate text-[16px] font-semibold leading-[24px]">{item.name}</span>
        {item.description && (
          <span className="truncate text-[14px] leading-[20px] text-[var(--muted-strong)]">{item.description}</span>
        )}
      </div>
    </div>
  );
}

/* ── Search results group with heading ── */
function ResultGroup({
  heading,
  items,
  selectedIndex,
  startIndex,
  rowRefs,
}: {
  heading: string;
  items: SearchResultItem[];
  selectedIndex: number;
  startIndex: number;
  rowRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="px-[8px] pb-[4px] text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">
        {heading}
      </div>
      <div>
        {items.map((item, i) => (
          <ResultRow
            key={item.name}
            item={item}
            selected={selectedIndex === startIndex + i}
            rowRef={(el: HTMLDivElement | null) => {
              if (el) rowRefs.current.set(startIndex + i, el);
              else rowRefs.current.delete(startIndex + i);
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ── */

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  initialTab?: string;
  experience?: "Apps" | "Sites";
  platform?: "iOS" | "Web";
  initialQuery?: string;
}

export default function SearchOverlay({
  open,
  onClose,
  initialTab = "Trending",
  experience = "Apps",
  platform = "iOS",
  initialQuery = "",
}: SearchOverlayProps) {
  const sidebarTabs = experience === "Sites" ? sitesTabs : appsTabs;
  const mobileActive = experience !== "Sites" && platform === "iOS";
  const desktopActive = experience !== "Sites" && platform === "Web";
  const sitesActive = experience === "Sites";

  const router = useRouter();
  const expSlug = experience === "Sites" ? "sites" : "apps";
  const navigate = useCallback(
    (params: Record<string, string>) => {
      onClose();
      router.push(`/search?${new URLSearchParams(params).toString()}`);
    },
    [onClose, router],
  );
  const goQuery = useCallback(
    (q: string) => {
      if (q.trim()) navigate({ q: q.trim(), exp: expSlug });
    },
    [navigate, expSlug],
  );
  const goFilter = useCallback(
    (dim: string, value: string) => navigate({ exp: expSlug, f: `${dim}:${value}` }),
    [navigate, expSlug],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync the active sidebar tab to the requested tab each time the modal opens.
  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  // Pre-fill the search field with the current query when the modal opens.
  useEffect(() => {
    if (open) setQuery(initialQuery);
  }, [open, initialQuery]);

  const tabItems = TAB_ITEMS[activeTab] ?? [];

  // Animation: mount/unmount with transition
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const hasQuery = query.trim().length > 0;

  // Find matching search results from our dataset
  const results = useMemo(() => {
    if (!hasQuery) return null;
    const q = query.trim().toLowerCase();
    const data = searchData as Record<string, {
      topResults: SearchResultItem[];
      other: SearchResultItem[];
      ios: SearchResultItem[];
      sites: SearchResultItem[];
    }>;
    const exactMatch = data[q];
    if (exactMatch) return exactMatch;
    const keys = Object.keys(data);
    const partialKey = keys.find((k) => k.startsWith(q) || q.startsWith(k));
    if (partialKey) return data[partialKey];
    return null;
  }, [query, hasQuery]);

  // Build flat list of total navigable items for arrow key navigation
  const totalItems = useMemo(() => {
    if (!hasQuery) return 0;
    // Index 0: Free text search
    let count = 1;
    if (results) {
      count += results.topResults.length;
      count += results.other.length;
      count += results.ios.length;
      count += results.sites.length;
    } else {
      // Text in Screenshot fallback
      count += 1;
    }
    // Request app row
    count += 1;
    return count;
  }, [hasQuery, results]);

  // Compute start indices for each group to map selectedIndex to rows
  const groupStartIndices = useMemo(() => {
    if (!results) return { topResults: 1, other: 2, ios: 2, sites: 2, requestApp: 2 };
    let idx = 1; // after free text search (0)
    const topResults = idx;
    idx += results.topResults.length;
    const other = idx;
    idx += results.other.length;
    const ios = idx;
    idx += results.ios.length;
    const sites = idx;
    idx += results.sites.length;
    const requestApp = idx;
    return { topResults, other, ios, sites, requestApp };
  }, [results]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = rowRefs.current.get(selectedIndex);
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (open) {
      // Focus immediately (helps mobile keep user-gesture context)
      inputRef.current?.focus();
      // Fallback with rAF for cases where DOM isn't ready yet
      requestAnimationFrame(() => inputRef.current?.focus());
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Delay body scroll restoration until exit animation finishes (200ms)
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, 200);
      setQuery("");
      setSelectedIndex(0);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (!hasQuery) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    },
    [open, onClose, hasQuery, totalItems],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop overlay — hidden on mobile (full-screen modal covers everything) */}
      <div
        className={`fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-[4px] transition-opacity duration-200 ease-out max-[719px]:hidden ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Dialog — full-screen on mobile, centered modal on desktop */}
      <div
        ref={dialogRef}
        role="dialog"
        className={`fixed inset-0 z-50 flex flex-col items-stretch transition-all duration-200 ease-out min-[720px]:inset-auto min-[720px]:top-[120px] min-[720px]:left-1/2 min-[720px]:w-[816px] min-[720px]:max-w-full min-[720px]:-translate-x-1/2 ${visible ? "opacity-100 min-[720px]:translate-y-0 min-[720px]:scale-100" : "opacity-0 min-[720px]:-translate-y-[16px] min-[720px]:scale-[0.98]"}`}
      >
        <div
          className={`flex-1 overflow-hidden bg-[var(--background-elevated)] min-[720px]:max-h-[calc(100vh-240px)] min-[720px]:flex-none min-[720px]:rounded-[24px] min-[720px]:bg-[var(--overlay)] min-[720px]:shadow-[0px_12px_80px_rgba(0,0,0,0.16)] min-[720px]:backdrop-blur-[24px] ${
            hasQuery
              ? "grid grid-rows-[auto_1fr]"
              : "grid grid-rows-[auto_auto_1fr]"
          }`}
        >
          {/* ── Search input section ── */}
          <section className="flex gap-x-[12px] px-[24px] py-[20px] max-[719px]:px-[16px] max-[719px]:pt-[max(16px,env(safe-area-inset-top))]">
            <div className="flex grow items-center gap-x-[8px]">
              <input
                ref={inputRef}
                className="grow bg-transparent text-[16px] font-[456] leading-[24px] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
                placeholder="Web Apps, Screens, UI Elements, Flows or Keywords..."
                type="text"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    goQuery(query);
                  }
                }}
              />
              {hasQuery && (
                <button
                  onClick={() => setQuery("")}
                  className="shrink-0 text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19ZM6.0009 7.41414L8.58379 9.99703L6.0009 12.5799L7.41511 13.9941L9.99801 11.4112L12.5809 13.9941L13.9951 12.5799L11.4122 9.99703L13.9951 7.41414L12.5809 5.99992L9.99801 8.58282L7.41511 5.99992L6.0009 7.41414Z" fill="currentColor" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-x-[16px] text-[var(--muted)]">
              <button className={`hidden min-[720px]:block ${mobileActive ? "text-[var(--foreground)]" : "transition-colors hover:text-[var(--foreground)]"}`}>
                <MobileIcon />
              </button>
              <button className={`hidden min-[720px]:block ${desktopActive ? "text-[var(--foreground)]" : "transition-colors hover:text-[var(--foreground)]"}`}>
                <DesktopIcon />
              </button>
              <button className={`hidden min-[720px]:block ${sitesActive ? "text-[var(--foreground)]" : "transition-colors hover:text-[var(--foreground)]"}`}>
                <SitesIcon />
              </button>
              {/* Mobile cancel button */}
              <button
                onClick={onClose}
                className="shrink-0 text-[14px] font-medium text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)] min-[720px]:hidden"
              >
                Cancel
              </button>
            </div>
          </section>

          {/* ── When no query: Recent searches + Trending content ── */}
          {!hasQuery && (
            <>
              {/* Recent searches row */}
              <section className="scrollbar-none flex w-full flex-nowrap gap-x-[8px] overflow-x-auto px-[20px] pb-[16px] pt-[8px]">
                {recentSearches.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => goQuery(item.label)}
                    className="group flex shrink-0 items-center gap-x-[8px] rounded-full bg-[var(--fill)] px-[12px] py-[8px] transition-colors hover:bg-[var(--fill-hover)]"
                  >
                    <div className="size-[20px] shrink-0 text-[var(--foreground)]">
                      <RecentIcon type={item.icon} />
                    </div>
                    <span className="whitespace-nowrap text-[14px] font-semibold leading-[20px] text-[var(--foreground)]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </section>

              {/* Sidebar + Trending content */}
              <section className="row-start-3 flex overflow-hidden pl-[20px]">
                <aside className="hidden w-[240px] shrink-0 flex-col justify-between pb-[20px] pt-[8px] min-[720px]:flex">
                  <div className="flex flex-col gap-y-[1px]">
                    {sidebarTabs.map((tab) => (
                      <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`flex items-center gap-x-[8px] rounded-[12px] px-[12px] py-[8px] text-[var(--foreground)] transition-colors ${
                          activeTab === tab.label
                            ? "bg-[var(--fill)]"
                            : "hover:bg-[var(--fill)]"
                        }`}
                      >
                        <tab.icon />
                        <span className="text-[16px] font-semibold leading-[24px]">
                          {tab.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </aside>

                <div className="h-full grow overflow-y-auto pb-[40px] pl-[0px] pr-[0px] pt-[8px] min-[720px]:pl-[16px] min-[720px]:pr-[20px]">
                  <div className="flex flex-col gap-y-[24px] overflow-hidden">
                    {activeTab !== "Trending" ? (
                      <div className="flex flex-col gap-y-[8px]">
                        <h4 className="px-[12px] text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">
                          {activeTab}
                        </h4>
                        <div className="flex flex-col pr-[16px] min-[720px]:pr-[0px]">
                          {tabItems.map((item) => (
                            <button
                              key={item}
                              onClick={() => goFilter(activeTab, item)}
                              className="flex items-center justify-between gap-x-[12px] rounded-[12px] px-[12px] py-[10px] text-left transition-colors hover:bg-[var(--fill)]"
                            >
                              <span className="truncate text-[16px] font-semibold leading-[24px] text-[var(--foreground)]">
                                {item}
                              </span>
                              <span className="shrink-0 text-[14px] leading-[20px] text-[var(--muted-strong)]">
                                {countFor(item)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                    <div className="flex gap-x-[8px] pr-[16px] min-[720px]:pr-[0px] overflow-x-auto scrollbar-none">
                      {trendingApps.map((app) => (
                        <button
                          key={app.name}
                          onClick={() => goQuery(app.name)}
                          className="group flex w-[64px] shrink-0 cursor-pointer flex-col items-center gap-y-[4px]"
                        >
                          <div
                            className="size-[64px] shrink-0 rounded-[30%]"
                            style={{ backgroundColor: app.color }}
                          />
                          <span className="w-full truncate text-center text-[12px] font-semibold leading-[16px] text-[var(--foreground)]">
                            {app.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-y-[12px]">
                      <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">Screens</h4>
                      <div className="grid grid-cols-4 gap-[8px] pr-[16px] min-[720px]:pr-[0px]">
                        {trendingScreens.map((screen) => (
                          <button
                            key={screen}
                            onClick={() => goFilter("Screens", screen)}
                            className="relative flex aspect-square cursor-pointer items-start overflow-hidden rounded-[16px] bg-[var(--fill)] p-[12px] text-left text-[16px] font-semibold leading-[24px] text-[var(--foreground)] transition-colors hover:bg-[var(--fill-hover)]"
                          >
                            {screen}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-[12px]">
                      <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">UI Elements</h4>
                      <div className="flex flex-wrap gap-[8px] pr-[16px] min-[720px]:pr-[0px]">
                        {uiElements.map((el) => (
                          <button
                            key={el}
                            onClick={() => goFilter("UI Elements", el)}
                            className="cursor-pointer rounded-full bg-[var(--fill)] px-[16px] py-[8px] text-[16px] font-semibold leading-[24px] text-[var(--foreground)] transition-colors hover:bg-[var(--fill-hover)]"
                          >
                            {el}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-[12px]">
                      <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">Flows</h4>
                      <div className="grid grid-cols-4 gap-[8px] pr-[16px] min-[720px]:pr-[0px]">
                        {flows.map((flow) => (
                          <button
                            key={flow}
                            onClick={() => goFilter("Flows", flow)}
                            className="flex aspect-square cursor-pointer flex-col justify-between overflow-hidden rounded-[16px] bg-[var(--fill)] p-[12px] text-left transition-colors hover:bg-[var(--fill-hover)]"
                          >
                            <span className="text-[16px] font-semibold leading-[24px] text-[var(--foreground)]">{flow}</span>
                            <FlowCardIcon name={flow} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-y-[12px]">
                      <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">Text in Screenshot</h4>
                      <div className="flex flex-wrap gap-[8px] pr-[16px] min-[720px]:pr-[0px]">
                        {textInScreenshot.map((text) => (
                          <button
                            key={text}
                            onClick={() => goQuery(text)}
                            className="cursor-pointer rounded-full bg-[var(--fill)] px-[16px] py-[8px] text-[16px] font-semibold leading-[24px] text-[var(--foreground)] transition-colors hover:bg-[var(--fill-hover)]"
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </div>
                      </>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── When query exists: Search results ── */}
          {hasQuery && (
            <section className="overflow-hidden">
              <div className="h-full overflow-y-auto px-[20px] pb-[20px] pt-[8px]">
                <div className="flex flex-col gap-y-[12px]">
                  {/* Free text search row (index 0) */}
                  <div onClick={() => goQuery(query)}>
                    <ResultRow
                      item={{ type: "search", name: query }}
                      selected={selectedIndex === 0}
                      rowRef={(el: HTMLDivElement | null) => {
                        if (el) rowRefs.current.set(0, el);
                        else rowRefs.current.delete(0);
                      }}
                    />
                  </div>

                  {results ? (
                    <>
                      {/* Top results (no heading) */}
                      {results.topResults.length > 0 && (
                        <div>
                          {results.topResults.map((item, i) => (
                            <ResultRow
                              key={item.name}
                              item={item}
                              selected={selectedIndex === groupStartIndices.topResults + i}
                              rowRef={(el: HTMLDivElement | null) => {
                                const idx = groupStartIndices.topResults + i;
                                if (el) rowRefs.current.set(idx, el);
                                else rowRefs.current.delete(idx);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Other group */}
                      <ResultGroup
                        heading="Other"
                        items={results.other}
                        selectedIndex={selectedIndex}
                        startIndex={groupStartIndices.other}
                        rowRefs={rowRefs}
                      />

                      {/* iOS group */}
                      <ResultGroup
                        heading="iOS"
                        items={results.ios}
                        selectedIndex={selectedIndex}
                        startIndex={groupStartIndices.ios}
                        rowRefs={rowRefs}
                      />

                      {/* Sites group */}
                      <ResultGroup
                        heading="Sites"
                        items={results.sites}
                        selectedIndex={selectedIndex}
                        startIndex={groupStartIndices.sites}
                        rowRefs={rowRefs}
                      />
                    </>
                  ) : (
                    /* No matching dataset — show "Text in Screenshot" fallback */
                    <div>
                      <ResultRow
                        item={{
                          type: "textInScreenshot",
                          name: `"${query}"`,
                          description: "Text in Screenshot",
                        }}
                        selected={selectedIndex === 1}
                        rowRef={(el: HTMLDivElement | null) => {
                          if (el) rowRefs.current.set(1, el);
                          else rowRefs.current.delete(1);
                        }}
                      />
                    </div>
                  )}

                  {/* Looking for something else? */}
                  <div>
                    <div className="px-[8px] pb-[4px] text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">
                      Looking for something else?
                    </div>
                    <ResultRow
                      item={{ type: "addCircle", name: "Request app" }}
                      selected={selectedIndex === groupStartIndices.requestApp}
                      rowRef={(el: HTMLDivElement | null) => {
                        if (el) rowRefs.current.set(groupStartIndices.requestApp, el);
                        else rowRefs.current.delete(groupStartIndices.requestApp);
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
