"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import searchData from "@/data/searchResults.json";
import SearchFilters from "@/components/SearchFilters";
import { DIMENSIONS, FILTER_DATA, type Filters } from "@/lib/search";

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

const siteCategoriesList = [
  "Business", "Crypto", "Education", "Entertainment", "Finance", "Food", "Health",
  "Lifestyle", "Portfolio", "Shopping", "Social", "Technology", "Travel", "Other",
];

const sectionsList = [
  "404", "About", "Blog", "CTA", "Comparison", "Contact", "Downloads", "FAQ",
  "Features", "Footer", "Hero", "How It Works", "Logos", "Navigation", "Newsletter",
  "Pricing", "Roadmap", "Stats", "Team", "Testimonials",
];

const stylesList = [
  "3D", "Black & White", "Bold", "Brutalist", "Colorful", "Dark", "Editorial", "Fun",
  "Glass", "Grid", "Illustration", "Light", "Minimal", "Monochrome", "Motion",
  "Neumorphism", "Playful", "Retro", "Serif", "Vibrant",
];

// Items for each tab — Apps tabs vs Sites tabs.
const TAB_ITEMS: Record<string, string[]> = {
  Categories: allCategories,
  Screens: screensList,
  "UI Elements": uiElementsList,
  Flows: flowsList,
};

const SITE_TAB_ITEMS: Record<string, string[]> = {
  Categories: siteCategoriesList,
  Sections: sectionsList,
  Styles: stylesList,
};

// Sites "Trending" tab content.
const trendingSites = [
  { name: "Midday", color: "#C2F04C" },
  { name: "Vercel", color: "#111111" },
  { name: "Raycast", color: "#C2502E" },
  { name: "Shopify", color: "#5E8E3E" },
  { name: "Framer", color: "#4D3DF7" },
  { name: "Cash App", color: "#00D54B" },
  { name: "Whop", color: "#1A1A1A" },
];
const trendingSiteCategories = ["Business", "Technology", "Shopping", "Portfolio"];
const trendingSiteSections = ["Hero", "Pricing", "Features", "404", "Social Proof", "Footer", "About", "Showcase", "Navigation"];
const trendingSiteStyles = ["Colorful", "Dark", "Minimal", "Illustration", "Motion", "Photography", "Scroll Effects"];

/* ── Search modes (Standard / Deep / Filter extraction) ── */

type SearchMode = "standard" | "deep" | "extract";

function DeepIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8.33398 3.39062C5.50708 3.79498 3.33398 6.22616 3.33398 9.16488C3.33398 12.3865 5.94566 14.9982 9.16732 14.9982C12.1061 14.9982 14.5372 12.8251 14.9416 9.99822" stroke="currentColor" strokeWidth="2" />
      <path d="M16.6667 16.6667L13.375 13.375" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <path d="M13.6667 1.66406H13L12.1667 3.83073L10 4.66406V5.33073L12.1667 6.16406L13 8.33073H13.6667L14.5 6.16406L16.6667 5.33073V4.66406L14.5 3.83073L13.6667 1.66406Z" fill="currentColor" />
    </svg>
  );
}

function ExtractIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 5h14M5 10h10M8 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l1.7 5L17 8.7l-5 1.6L10 16l-2-5.7L3 8.7l5.3-1.7L10 2z" fill="currentColor" />
    </svg>
  );
}

function MenuCheck() {
  return (
    <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// One query term can map (by synonym) to several filter values.
const SYNONYMS: Record<string, { dim: string; value: string }[]> = {
  popup: [{ dim: "UI Elements", value: "Dialog" }, { dim: "UI Elements", value: "Modal" }],
  modal: [{ dim: "UI Elements", value: "Dialog" }, { dim: "UI Elements", value: "Modal" }],
  dropdown: [{ dim: "UI Elements", value: "Menu" }],
  "sign in": [{ dim: "Screens", value: "Login" }],
  "sign up": [{ dim: "Screens", value: "Signup" }],
  register: [{ dim: "Screens", value: "Signup" }],
};

const DIM_LABELS: Record<string, string> = {
  Categories: "Category",
  Screens: "Screen",
  "UI Elements": "UI Element",
  Flows: "Flow",
  Sections: "Section",
  Styles: "Style",
};

function DimIcon({ dim }: { dim: string }) {
  if (dim === "Categories") return <CategoriesIcon />;
  if (dim === "Screens" || dim === "Sections") return <ScreensIcon />;
  if (dim === "UI Elements" || dim === "Styles") return <UIElementIcon />;
  if (dim === "Flows") return <FlowIcon />;
  return <SearchIcon />;
}

function encodeF(f: Filters) {
  return Object.entries(f)
    .flatMap(([d, vs]) => vs.map((v) => `${d}:${v}`))
    .join("~");
}

// Pull known filter values (and synonym matches) out of a free-text query.
// Tracks how many distinct source terms matched so a single concept can be
// shown as direct match rows while a multi-concept query collapses to one
// extraction block.
function extractFilters(query: string, exp: "apps" | "sites") {
  let remaining = ` ${query.toLowerCase()} `;
  const matches: { dim: string; value: string }[] = [];
  const sources = new Set<string>();

  DIMENSIONS[exp].forEach((dim) => {
    FILTER_DATA[exp][dim].forEach((group) => {
      group.items.forEach((item) => {
        const il = ` ${item.toLowerCase()} `;
        if (remaining.includes(il)) {
          matches.push({ dim, value: item });
          sources.add(item.toLowerCase());
          remaining = remaining.replace(il, "  ");
        }
      });
    });
  });

  Object.entries(SYNONYMS).forEach(([kw, targets]) => {
    if (remaining.includes(` ${kw} `)) {
      const valid = targets.filter((t) => DIMENSIONS[exp].includes(t.dim));
      if (valid.length) {
        valid.forEach((t) => matches.push({ dim: t.dim, value: t.value }));
        sources.add(kw);
        remaining = remaining.replace(` ${kw} `, "  ");
      }
    }
  });

  const seen = new Set<string>();
  const deduped = matches.filter((m) => {
    const k = `${m.dim}|${m.value}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const filters: Record<string, string[]> = {};
  deduped.forEach((m) => (filters[m.dim] ||= []).push(m.value));

  const STOP = new Set(["with", "and", "in", "for", "the", "a", "an", "of", "app", "apps", "site", "sites", "screen", "screens", "page", "that", "match"]);
  const words = remaining.split(/\s+/).filter((w) => w && !STOP.has(w));
  const leftover = words.join(" ");

  return { filters, leftover, valuable: leftover.length >= 3, matches: deduped, sourceCount: sources.size };
}

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
  initialFilters?: Filters;
  allowEditing?: boolean;
}

const EMPTY_FILTERS: Filters = {};

export default function SearchOverlay({
  open,
  onClose,
  initialTab = "Trending",
  experience = "Apps",
  platform = "iOS",
  initialQuery = "",
  initialFilters = EMPTY_FILTERS,
  allowEditing = true,
}: SearchOverlayProps) {
  const [selExp, setSelExp] = useState<"Apps" | "Sites">(experience);
  const [selPlatform, setSelPlatform] = useState<"iOS" | "Web">(platform);
  // Editing an existing search: preserve the page's filters while refining.
  const [editing, setEditing] = useState(false);
  const [editFilters, setEditFilters] = useState<Filters>(initialFilters);

  const sidebarTabs = selExp === "Sites" ? sitesTabs : appsTabs;
  const mobileActive = selExp !== "Sites" && selPlatform === "iOS";
  const desktopActive = selExp !== "Sites" && selPlatform === "Web";
  const sitesActive = selExp === "Sites";

  const router = useRouter();
  const expSlug = selExp === "Sites" ? "sites" : "apps";
  const navigate = useCallback(
    (params: Record<string, string>) => {
      onClose();
      router.push(`/search?${new URLSearchParams(params).toString()}`);
    },
    [onClose, router],
  );
  const goQuery = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      const params: Record<string, string> = { exp: expSlug, q: q.trim() };
      if (selExp !== "Sites") params.platform = selPlatform;
      navigate(params);
    },
    [navigate, expSlug, selExp, selPlatform],
  );
  const goFilter = useCallback(
    (dim: string, value: string) => {
      const params: Record<string, string> = { exp: expSlug };
      if (selExp !== "Sites") params.platform = selPlatform;
      const base: Filters = { ...editFilters };
      base[dim] = Array.from(new Set([...(base[dim] || []), value]));
      const f = encodeF(base);
      if (f) params.f = f;
      navigate(params);
    },
    [navigate, expSlug, selExp, selPlatform, editFilters],
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

  // Reflect the page's lens when the modal opens.
  useEffect(() => {
    if (open) {
      setSelExp(experience);
      setSelPlatform(platform);
    }
  }, [open, experience, platform]);

  const selectLens = useCallback((exp: "Apps" | "Sites", plat?: "iOS" | "Web") => {
    setSelExp(exp);
    if (plat) setSelPlatform(plat);
    setActiveTab((prev) => {
      const tabs = exp === "Sites" ? sitesTabs : appsTabs;
      return tabs.some((t) => t.label === prev) ? prev : "Trending";
    });
  }, []);

  const tabItems = (selExp === "Sites" ? SITE_TAB_ITEMS[activeTab] : TAB_ITEMS[activeTab]) ?? [];

  // Keyboard navigation within the tab content list.
  const [contentIndex, setContentIndex] = useState(0);
  const contentRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  useEffect(() => {
    setContentIndex(0);
  }, [activeTab, selExp, query]);
  useEffect(() => {
    contentRefs.current.get(contentIndex)?.scrollIntoView({ block: "nearest" });
  }, [contentIndex]);

  // Reveal shortcut tooltips while Option (Alt) is held for ~0.5s.
  const [showShortcuts, setShowShortcuts] = useState(false);
  useEffect(() => {
    if (!open) {
      setShowShortcuts(false);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      setShowShortcuts(false);
    };
    const down = (e: KeyboardEvent) => {
      if (e.key === "Alt" && !timer) timer = setTimeout(() => setShowShortcuts(true), 500);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "Alt") clear();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [open]);

  // Search mode — auto-detected from the query, overridable via the ··· menu.
  const [modeOverride, setModeOverride] = useState<SearchMode | null>(null);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const modeMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) setModeOverride(null);
    else setModeMenuOpen(false);
  }, [open]);
  useEffect(() => {
    if (!modeMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) setModeMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [modeMenuOpen]);

  const expKey = selExp === "Sites" ? "sites" : "apps";
  const extracted = useMemo(() => extractFilters(query, expKey), [query, expKey]);
  const autoMode: SearchMode = query.trim().length === 0
    ? "standard"
    : Object.keys(extracted.filters).length
      ? "extract"
      : query.trim().split(/\s+/).length >= 4
        ? "deep"
        : "standard";
  const mode: SearchMode = modeOverride ?? autoMode;
  const extractSummary = Object.values(extracted.filters).flat().join(" · ");
  const extractCount = Object.values(extracted.filters).flat().length;
  // Direct filter-match rows only when a single concept matched and there's no
  // meaningful leftover query. With leftover (e.g. "dashboard finance"), fall to
  // the extract row which applies the filter AND keeps the leftover query.
  const directMatch =
    mode === "extract" &&
    extracted.sourceCount <= 1 &&
    extracted.matches.length > 0 &&
    !extracted.valuable;
  // Number of selectable rows above the results list (for arrow-key nav).
  const topCount = directMatch ? extracted.matches.length + 1 : 1;

  const runSearch = useCallback(() => {
    const params: Record<string, string> = { exp: expSlug };
    if (selExp !== "Sites") params.platform = selPlatform;
    // Start from the filters being edited so they're preserved when refining.
    const base: Filters = { ...editFilters };
    if (mode === "extract" && Object.keys(extracted.filters).length) {
      Object.entries(extracted.filters).forEach(([d, vs]) => {
        base[d] = Array.from(new Set([...(base[d] || []), ...vs]));
      });
      if (extracted.valuable && extracted.leftover) params.q = extracted.leftover;
    } else if (query.trim()) {
      params.q = query.trim();
    }
    const f = encodeF(base);
    if (f) params.f = f;
    navigate(params);
  }, [mode, extracted, expSlug, selExp, selPlatform, navigate, query, editFilters]);

  // Plain keyword search — ignores any extracted filter matches.
  const runPlainSearch = useCallback(() => {
    const params: Record<string, string> = { exp: expSlug };
    if (selExp !== "Sites") params.platform = selPlatform;
    const base: Filters = { ...editFilters };
    if (query.trim()) params.q = query.trim();
    const f = encodeF(base);
    if (f) params.f = f;
    navigate(params);
  }, [expSlug, selExp, selPlatform, navigate, query, editFilters]);

  // Activate whichever top row is currently highlighted (Enter / click).
  const activateSelected = useCallback(() => {
    if (directMatch) {
      if (selectedIndex < extracted.matches.length) {
        const m = extracted.matches[selectedIndex];
        goFilter(m.dim, m.value);
        return;
      }
      if (selectedIndex === extracted.matches.length) {
        runPlainSearch();
        return;
      }
    }
    runSearch();
  }, [directMatch, selectedIndex, extracted, goFilter, runPlainSearch, runSearch]);

  // Begin editing (back arrow / Esc returns to the default modal view).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      wasOpen.current = true;
      // Editing only when there was a query; filters alone start a fresh search.
      const isEditing = allowEditing && initialQuery.trim().length > 0;
      setEditing(isEditing);
      setEditFilters(isEditing ? initialFilters : {});
    } else if (!open) {
      wasOpen.current = false;
    }
  }, [open, initialQuery, initialFilters, allowEditing]);

  const toggleEditFilter = useCallback((dim: string, value: string) => {
    setEditFilters((prev) => {
      const cur = prev[dim] ?? [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      const copy = { ...prev };
      if (next.length) copy[dim] = next;
      else delete copy[dim];
      return copy;
    });
  }, []);
  const clearEditDim = useCallback((dim: string) => {
    setEditFilters((prev) => {
      const copy = { ...prev };
      delete copy[dim];
      return copy;
    });
  }, []);
  const resetEditFilters = useCallback(() => setEditFilters({}), []);
  const exitEditing = useCallback(() => {
    setEditing(false);
    setEditFilters({});
    setQuery("");
  }, []);

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
    // The top rows (free-text search, or filter matches + plain search).
    let count = topCount;
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
  }, [hasQuery, results, topCount]);

  // Compute start indices for each group to map selectedIndex to rows
  const groupStartIndices = useMemo(() => {
    if (!results) return { topResults: topCount, other: topCount, ios: topCount, sites: topCount, requestApp: topCount + 1 };
    let idx = topCount; // after the top rows
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
  }, [results, topCount]);

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
        if (editing) exitEditing();
        else onClose();
        return;
      }

      // Option+1/2/3 → switch lens (use e.code; Option mangles e.key on macOS).
      if (e.altKey && (e.code === "Digit1" || e.code === "Digit2" || e.code === "Digit3")) {
        e.preventDefault();
        if (e.code === "Digit1") selectLens("Apps", "iOS");
        else if (e.code === "Digit2") selectLens("Apps", "Web");
        else selectLens("Sites");
        return;
      }

      // Query results: arrow through the result rows.
      if (hasQuery) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        }
        return;
      }

      // Empty state: Tab cycles sidebar tabs; arrows navigate the tab content.
      if (e.key === "Tab") {
        e.preventDefault();
        const idx = sidebarTabs.findIndex((t) => t.label === activeTab);
        const delta = e.shiftKey ? -1 : 1;
        const next = (idx + delta + sidebarTabs.length) % sidebarTabs.length;
        setActiveTab(sidebarTabs[next].label);
        return;
      }
      if (activeTab !== "Trending") {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setContentIndex((p) => (tabItems.length ? (p + 1) % tabItems.length : 0));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setContentIndex((p) => (tabItems.length ? (p - 1 + tabItems.length) % tabItems.length : 0));
        } else if (e.key === "Enter" && tabItems[contentIndex]) {
          e.preventDefault();
          goFilter(activeTab, tabItems[contentIndex]);
        }
      }
    },
    [open, onClose, hasQuery, totalItems, selectLens, sidebarTabs, activeTab, tabItems, contentIndex, goFilter, editing, exitEditing],
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
        className={`fixed inset-0 z-50 bg-[var(--backdrop)] backdrop-blur-[4px] transition-opacity duration-200 ease-out max-[719px]:hidden ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Dialog — full-screen on mobile, centered modal on desktop */}
      <div
        ref={dialogRef}
        role="dialog"
        className={`theme-dark fixed inset-0 z-50 flex flex-col items-stretch transition-all duration-200 ease-out min-[720px]:inset-auto min-[720px]:top-[120px] min-[720px]:left-1/2 min-[720px]:w-[816px] min-[720px]:max-w-full min-[720px]:-translate-x-1/2 ${visible ? "opacity-100 min-[720px]:translate-y-0 min-[720px]:scale-100" : "opacity-0 min-[720px]:-translate-y-[16px] min-[720px]:scale-[0.98]"}`}
      >
        <div
          className={`relative flex-1 overflow-hidden bg-[var(--background-elevated)] min-[720px]:max-h-[calc(100vh-240px)] min-[720px]:flex-none min-[720px]:rounded-[24px] min-[720px]:bg-[var(--overlay)] min-[720px]:shadow-[0px_12px_80px_rgba(0,0,0,0.16)] min-[720px]:backdrop-blur-[24px] ${
            hasQuery
              ? "grid grid-rows-[auto_1fr]"
              : "grid grid-rows-[auto_auto_1fr]"
          }`}
        >
          {/* ── Search input section ── */}
          <section className="flex flex-col gap-y-[14px] px-[24px] py-[20px] max-[719px]:px-[16px] max-[719px]:pt-[max(16px,env(safe-area-inset-top))]">
            <div className="flex gap-x-[12px]">
            {editing && (
              <button
                onClick={exitEditing}
                aria-label="Back"
                className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
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
                    activateSelected();
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
            <div className="relative flex items-center gap-x-[16px] text-[var(--muted)]">
              <button
                onClick={() => selectLens("Apps", "iOS")}
                className={`hidden min-[720px]:block ${mobileActive ? "text-[var(--foreground)]" : "transition-colors hover:text-[var(--foreground)]"}`}
              >
                <MobileIcon />
              </button>
              <button
                onClick={() => selectLens("Apps", "Web")}
                className={`hidden min-[720px]:block ${desktopActive ? "text-[var(--foreground)]" : "transition-colors hover:text-[var(--foreground)]"}`}
              >
                <DesktopIcon />
              </button>
              <button
                onClick={() => selectLens("Sites")}
                className={`hidden min-[720px]:block ${sitesActive ? "text-[var(--foreground)]" : "transition-colors hover:text-[var(--foreground)]"}`}
              >
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
            </div>
            {editing && Object.keys(editFilters).length > 0 && (
              <SearchFilters
                dimensionsOnly
                dark
                experience={selExp === "Sites" ? "sites" : "apps"}
                onExperienceChange={() => {}}
                platform={selPlatform}
                onPlatformChange={() => {}}
                filters={editFilters}
                onToggleFilter={toggleEditFilter}
                onClearDim={clearEditDim}
                onReset={resetEditFilters}
                sort="Trending"
                onSortChange={() => {}}
                count={0}
                countNoun=""
              />
            )}
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
                          {tabItems.map((item, i) => (
                            <button
                              key={item}
                              ref={(el) => {
                                if (el) contentRefs.current.set(i, el);
                                else contentRefs.current.delete(i);
                              }}
                              onClick={() => goFilter(activeTab, item)}
                              className={`flex items-center justify-between gap-x-[12px] rounded-[12px] px-[12px] py-[10px] text-left transition-colors ${
                                i === contentIndex ? "bg-[var(--fill)]" : "hover:bg-[var(--fill)]"
                              }`}
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
                    ) : selExp === "Sites" ? (
                      <>
                        <div className="flex gap-x-[8px] overflow-x-auto pr-[16px] scrollbar-none min-[720px]:pr-[0px]">
                          {trendingSites.map((site) => (
                            <button
                              key={site.name}
                              onClick={() => goQuery(site.name)}
                              className="size-[64px] shrink-0 rounded-[18px] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]"
                              style={{ backgroundColor: site.color }}
                              aria-label={site.name}
                            />
                          ))}
                        </div>

                        <div className="flex flex-col gap-y-[12px]">
                          <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">Categories</h4>
                          <div className="grid grid-cols-2 gap-[8px] pr-[16px] min-[720px]:grid-cols-4 min-[720px]:pr-[0px]">
                            {trendingSiteCategories.map((c) => (
                              <button
                                key={c}
                                onClick={() => goFilter("Categories", c)}
                                className="relative flex aspect-[4/5] flex-col overflow-hidden rounded-[16px] bg-[var(--fill)] p-[12px] text-left transition-colors hover:bg-[var(--fill-hover)]"
                              >
                                <span className="relative z-10 text-[16px] font-semibold leading-[24px] text-[var(--foreground)]">{c}</span>
                                <div className="absolute inset-x-[12px] bottom-0 top-[48px] overflow-hidden rounded-t-[10px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-y-[12px]">
                          <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">Sections</h4>
                          <div className="flex flex-wrap gap-[8px] pr-[16px] min-[720px]:pr-[0px]">
                            {trendingSiteSections.map((s) => (
                              <button key={s} onClick={() => goFilter("Sections", s)} className="cursor-pointer rounded-full bg-[var(--fill)] px-[16px] py-[8px] text-[16px] font-semibold leading-[24px] text-[var(--foreground)] transition-colors hover:bg-[var(--fill-hover)]">
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-y-[12px]">
                          <h4 className="text-[14px] font-semibold leading-[20px] text-[var(--muted-strong)]">Styles</h4>
                          <div className="flex flex-wrap gap-[8px] pr-[16px] min-[720px]:pr-[0px]">
                            {trendingSiteStyles.map((s) => (
                              <button key={s} onClick={() => goFilter("Styles", s)} className="cursor-pointer rounded-full bg-[var(--fill)] px-[16px] py-[8px] text-[16px] font-semibold leading-[24px] text-[var(--foreground)] transition-colors hover:bg-[var(--fill-hover)]">
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
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
                  {/* Single concept (no leftover query) → direct filter match rows */}
                  {directMatch ? (
                    <>
                    {extracted.matches.map((m, i) => (
                      <div
                        key={`${m.dim}-${m.value}`}
                        ref={(el: HTMLDivElement | null) => {
                          if (el) rowRefs.current.set(i, el);
                          else rowRefs.current.delete(i);
                        }}
                        onClick={() => goFilter(m.dim, m.value)}
                        className={`flex h-[56px] cursor-pointer items-center gap-x-[12px] rounded-[16px] px-[8px] text-[var(--foreground)] transition-colors ${
                          selectedIndex === i ? "bg-[var(--fill)]" : "hover:bg-[var(--fill)]"
                        }`}
                      >
                        <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--fill)]">
                          <DimIcon dim={m.dim} />
                        </div>
                        <div className="flex grow flex-col overflow-hidden">
                          <span className="truncate text-[16px] font-semibold leading-[24px]">{m.value}</span>
                          <span className="truncate text-[14px] leading-[20px] text-[var(--muted-strong)]">{DIM_LABELS[m.dim]}</span>
                        </div>
                      </div>
                    ))}
                    {/* Always allow a plain keyword search, even when filters match. */}
                    <div
                      ref={(el: HTMLDivElement | null) => {
                        const idx = extracted.matches.length;
                        if (el) rowRefs.current.set(idx, el);
                        else rowRefs.current.delete(idx);
                      }}
                      onClick={runPlainSearch}
                      className={`flex h-[56px] cursor-pointer items-center gap-x-[12px] rounded-[16px] px-[8px] text-[var(--foreground)] transition-colors ${
                        selectedIndex === extracted.matches.length ? "bg-[var(--fill)]" : "hover:bg-[var(--fill)]"
                      }`}
                    >
                      <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--fill)]">
                        <SearchIcon />
                      </div>
                      <div className="flex grow flex-col overflow-hidden">
                        <span className="truncate text-[16px] font-semibold leading-[24px]">{query}</span>
                        <span className="truncate text-[14px] leading-[20px] text-[var(--muted-strong)]">Search</span>
                      </div>
                    </div>
                    </>
                  ) : (
                  <div
                    ref={(el: HTMLDivElement | null) => {
                      if (el) rowRefs.current.set(0, el);
                      else rowRefs.current.delete(0);
                    }}
                    onClick={runSearch}
                    className={`relative flex h-[56px] cursor-pointer items-center gap-x-[12px] rounded-[16px] px-[8px] text-[var(--foreground)] transition-colors ${
                      selectedIndex === 0 ? "bg-[var(--fill)]" : "hover:bg-[var(--fill)]"
                    }`}
                  >
                    <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--fill)]">
                      {mode === "deep" ? <DeepIcon /> : mode === "extract" ? <ExtractIcon /> : <SearchIcon />}
                    </div>
                    <div className="flex grow flex-col overflow-hidden">
                      <span className="truncate text-[16px] font-semibold leading-[24px]">
                        {mode === "deep"
                          ? "Deep Search"
                          : mode === "extract" && extracted.valuable && extracted.leftover
                            ? extracted.leftover
                            : query}
                      </span>
                      {mode === "deep" && (
                        <span className="truncate text-[14px] leading-[20px] text-[var(--muted-strong)]">{query}</span>
                      )}
                      {mode === "extract" && extractSummary && (
                        <span className="truncate text-[14px] leading-[20px] text-[var(--muted-strong)]">in {extractSummary}</span>
                      )}
                    </div>

                    {mode === "extract" && extractCount > 0 && (
                      <div className="flex shrink-0 items-center gap-x-[8px]">
                        <span className="text-[14px] leading-[20px] text-[var(--muted-strong)]">Filters</span>
                        <span className="flex h-[24px] min-w-[24px] items-center justify-center rounded-full bg-[var(--fill)] px-[7px] text-[13px] font-semibold leading-none text-[var(--foreground)]">
                          {extractCount}
                        </span>
                      </div>
                    )}

                    <div ref={modeMenuRef} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setModeMenuOpen((o) => !o)}
                        aria-label="Search mode"
                        className="flex size-[32px] items-center justify-center rounded-full text-[var(--muted-strong)] transition-colors hover:bg-[var(--fill-hover)] hover:text-[var(--foreground)]"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="4" cy="10" r="1.6" fill="currentColor" />
                          <circle cx="10" cy="10" r="1.6" fill="currentColor" />
                          <circle cx="16" cy="10" r="1.6" fill="currentColor" />
                        </svg>
                      </button>
                      {modeMenuOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[280px] rounded-[16px] border border-[var(--border)] bg-[var(--overlay)] p-[8px] shadow-[0px_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-[24px]">
                          <div className="px-[12px] py-[6px] text-[13px] font-semibold text-[var(--muted)]">Search mode</div>
                          {([
                            ["deep", "Deep", <DeepIcon key="d" />],
                            ["standard", "Standard", <SparkIcon key="s" />],
                            ["extract", "Filter extraction", <ExtractIcon key="e" />],
                          ] as const).map(([m, label, icon]) => (
                            <button
                              key={m}
                              onClick={() => {
                                setModeOverride(m);
                                setModeMenuOpen(false);
                              }}
                              className={`flex w-full items-center gap-x-[8px] rounded-[10px] px-[12px] py-[8px] text-left text-[15px] transition-colors hover:bg-[var(--fill)] ${
                                mode === m ? "text-[var(--foreground)]" : "text-[var(--muted-strong)]"
                              }`}
                            >
                              {icon}
                              <span className="font-medium">{label}</span>
                              {m === "deep" && (
                                <span className="rounded-full border border-[var(--border-strong)] px-[6px] py-[1px] text-[11px] font-semibold text-[var(--muted-strong)]">
                                  BETA
                                </span>
                              )}
                              {mode === m && <MenuCheck />}
                            </button>
                          ))}
                          <p className="px-[12px] pb-[6px] pt-[8px] text-[13px] leading-[18px] text-[var(--muted)]">
                            Deep Search is automatically enabled for longer, more complex queries. May result in longer loading times.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  )}

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
                        selected={selectedIndex === groupStartIndices.topResults}
                        rowRef={(el: HTMLDivElement | null) => {
                          const idx = groupStartIndices.topResults;
                          if (el) rowRefs.current.set(idx, el);
                          else rowRefs.current.delete(idx);
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

          {showShortcuts && (
            <div className="pointer-events-none absolute bottom-[16px] left-[24px] z-30 hidden flex-col items-start gap-y-[4px] text-[12px] leading-[16px] text-[var(--muted)] min-[720px]:flex">
              <span>⇥ Switch filters</span>
              <span>↑ ↓ Navigate</span>
              <span>↵ Select</span>
              <span>⌥1 / ⌥2 / ⌥3 — iOS · Web · Sites</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
