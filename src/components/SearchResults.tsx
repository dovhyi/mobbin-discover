"use client";

import Link from "next/link";
import {
  BareScreenCard,
  FlowCard,
  LoaderDots,
  PlaceholderCard,
  RealAppCard,
} from "@/components/AppCardsGrid";
import {
  iosAppScreens,
  webAppScreens,
  siteScreens,
  type RealScreen,
} from "@/data/mobbinScreens";
import { brandFor } from "@/data/brands";
import { BrandBanner } from "@/components/BrandSpotlight";
import {
  DIMENSIONS,
  FILTER_DATA,
  type Experience,
  type Filters,
  type Platform,
  type ResultType,
} from "@/lib/search";

function filterHref(experience: Experience, platform: Platform, dim: string, value: string) {
  const p = new URLSearchParams();
  if (experience === "sites") {
    p.set("exp", "sites");
  } else {
    p.set("exp", "apps");
    p.set("platform", platform);
  }
  p.set("f", `${dim}:${value}`);
  return `/search?${p.toString()}`;
}

type Variant = "ios" | "web";
type Lens = "ios" | "web" | "sites";

/* ── Lens helpers ── */

function activeLens(experience: Experience, platform: Platform): Lens {
  if (experience === "sites") return "sites";
  return platform === "iOS" ? "ios" : "web";
}

const LENS_LABEL: Record<Lens, string> = { ios: "iOS Apps", web: "Web Apps", sites: "Sites" };

// Label that reflects the result granularity (screens/flows), not just apps —
// e.g. "Site Sections that match ..." rather than "Sites that match ...".
function lensLabel(lens: Lens, type: ResultType): string {
  if (type === "screens") {
    return lens === "ios" ? "iOS screens" : lens === "web" ? "Web screens" : "Site Sections";
  }
  if (type === "flows") {
    return lens === "ios" ? "iOS flows" : lens === "web" ? "Web flows" : "Site flows";
  }
  return LENS_LABEL[lens];
}
const LENS_VARIANT: Record<Lens, Variant> = { ios: "ios", web: "web", sites: "web" };

const NEIGHBORS = ["Crypto & Web3", "Productivity", "Finance", "Social", "Health & Fitness", "Communication"];
function adjacentCategory(cat?: string) {
  return NEIGHBORS.find((c) => c !== cat) ?? "Productivity";
}

// Deterministic hash so alternating picks (e.g. iOS vs Web) stay stable per query.
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function encodeFilters(filters: Filters): string {
  const parts: string[] = [];
  Object.keys(filters).forEach((dim) => filters[dim].forEach((v) => parts.push(`${dim}:${v}`)));
  return parts.join("~");
}

function lensParams(lens: Lens): { exp: string; platform?: string } {
  if (lens === "sites") return { exp: "sites" };
  return { exp: "apps", platform: lens === "ios" ? "iOS" : "Web" };
}

// Which experience a lens lives in.
function lensExperience(lens: Lens): Experience {
  return lens === "sites" ? "sites" : "apps";
}

// Keep only filter values that actually exist in the target experience, so
// crossing apps↔sites never carries over a filter the target can't honour.
function filtersForTarget(target: Lens, filters: Filters): Filters {
  const exp = lensExperience(target);
  const out: Filters = {};
  DIMENSIONS[exp].forEach((dim) => {
    const vals = (filters[dim] ?? []).filter((v) =>
      FILTER_DATA[exp][dim].some((g) => g.items.includes(v)),
    );
    if (vals.length) out[dim] = vals;
  });
  return out;
}

// A category value only if it exists in the target experience (Finance maps,
// "Crypto & Web3" / "Portfolio" don't cross over).
function catForTarget(target: Lens, filters: Filters): string | undefined {
  const cat = filters["Categories"]?.[0];
  if (!cat) return undefined;
  const exp = lensExperience(target);
  return FILTER_DATA[exp]["Categories"].some((g) => g.items.includes(cat)) ? cat : undefined;
}

function subValue(filters: Filters) {
  return (
    filters["Screens"]?.[0] ??
    filters["Flows"]?.[0] ??
    filters["UI Elements"]?.[0] ??
    filters["Sections"]?.[0] ??
    filters["Styles"]?.[0]
  );
}

// The sub-filter, but only when it's meaningful in the target experience.
function subForTarget(target: Lens, filters: Filters): string | undefined {
  const sub = subValue(filters);
  if (!sub) return undefined;
  const exp = lensExperience(target);
  const ok = DIMENSIONS[exp].some((dim) => FILTER_DATA[exp][dim].some((g) => g.items.includes(sub)));
  return ok ? sub : undefined;
}

function targetHref(target: Lens, filters: Filters, query: string) {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  const { exp, platform } = lensParams(target);
  p.set("exp", exp);
  if (platform) p.set("platform", platform);
  const f = encodeFilters(filtersForTarget(target, filters));
  if (f) p.set("f", f);
  return `/search?${p.toString()}`;
}

function hasFilters(filters: Filters) {
  return Object.values(filters).some((v) => v.length > 0);
}

/* ── Cross-content-type reach (first injection block) ── */

// Apps reach into Sites / Site Sections; Sites reach into apps (platform picked
// deterministically); Flows have no site equivalent, so they reach across the
// other app platform instead.
function reachTarget(lens: Lens, type: ResultType, seed: string): Lens {
  if (lens === "sites") return hashStr(seed) % 2 === 0 ? "ios" : "web";
  if (type === "flows") return lens === "ios" ? "web" : "ios";
  return "sites";
}

interface ReachBlock {
  title: string;
  target: Lens;
  href: string;
  action: string;
}

function reachBlock(lens: Lens, filters: Filters, query: string, type: ResultType): ReachBlock | null {
  const seed = query || filters["Categories"]?.[0] || subValue(filters) || "";
  const target = reachTarget(lens, type, seed);
  const label = lensLabel(target, type);
  const cat = catForTarget(target, filters);
  const sub = subForTarget(target, filters);

  let title: string | null = null;
  if (query) title = `${label} that match "${query}"`;
  else if (cat && sub) title = `${label} with ${sub} in ${cat}`;
  else if (cat) title = `${label} in ${cat}`;
  else if (sub) title = `${label} with ${sub}`;
  if (!title) return null;

  return { title, target, href: targetHref(target, filters, query), action: `View ${label}` };
}

/* ── Depth / breadth (second injection block) ── */

type DepthBlock =
  | { variant: "similar"; title: string; action: string; href: string }
  | { variant: "shelf"; title: string; cardKind: "screen" | "flow" | "web"; action: string; href: string }
  | { variant: "reach"; title: string; target: Lens; reachType: ResultType; action: string; href: string };

function depthBlock(
  lens: Lens,
  filters: Filters,
  query: string,
  reachT: Lens,
): DepthBlock | null {
  const cat = filters["Categories"]?.[0];
  const screen = filters["Screens"]?.[0];
  const ui = filters["UI Elements"]?.[0];
  const flow = filters["Flows"]?.[0];
  const section = filters["Sections"]?.[0];
  const style = filters["Styles"]?.[0];

  // Same-experience link (depth stays on the active lens).
  const depthHref = (f: Filters) => {
    const p = new URLSearchParams();
    const { exp, platform } = lensParams(lens);
    p.set("exp", exp);
    if (platform) p.set("platform", platform);
    const fe = encodeFilters(f);
    if (fe) p.set("f", fe);
    return `/search?${p.toString()}`;
  };

  // Cross-platform app reach — "Web Apps that match ..." / "iOS Apps that match ...".
  const crossApps = (target: Lens): DepthBlock => ({
    variant: "reach",
    target,
    reachType: "apps",
    title: `${LENS_LABEL[target]} that match "${query}"`,
    action: `View ${LENS_LABEL[target]}`,
    href: targetHref(target, filters, query),
  });

  if (lens === "sites") {
    if (style && cat)
      return { variant: "shelf", cardKind: "web", title: `${style} Sites in ${cat}`, action: "View sites", href: depthHref({ Styles: [style], Categories: [cat] }) };
    if (section && cat)
      return { variant: "shelf", cardKind: "web", title: `${section} Sites in ${cat}`, action: "View sites", href: depthHref({ Sections: [section], Categories: [cat] }) };
    if (style)
      return { variant: "shelf", cardKind: "web", title: `${style} across sites`, action: "View sites", href: depthHref({ Styles: [style] }) };
    if (section)
      return { variant: "shelf", cardKind: "web", title: `${section} across sites`, action: "View sites", href: depthHref({ Sections: [section] }) };
    if (cat)
      return { variant: "similar", title: `Categories similar to ${cat}`, action: "View categories", href: depthHref({ Categories: [cat] }) };
    if (query) return crossApps(reachT === "ios" ? "web" : "ios");
    return null;
  }

  // Apps — filter-dimension breadth ("Verification in Crypto", "Onboarding in Finance").
  if (screen) {
    const c = cat ?? adjacentCategory();
    return { variant: "shelf", cardKind: "screen", title: `${screen} in ${c}`, action: "View screens", href: depthHref({ Screens: [screen], Categories: [c] }) };
  }
  if (flow) {
    const c = cat ?? adjacentCategory();
    return { variant: "shelf", cardKind: "flow", title: `${flow} in ${c}`, action: "View flows", href: depthHref({ Flows: [flow], Categories: [c] }) };
  }
  if (ui)
    return { variant: "shelf", cardKind: "screen", title: `${ui} across categories`, action: "View screens", href: depthHref({ "UI Elements": [ui] }) };
  // Category alone → similar categories; a query alone → the other app platform.
  if (cat && !query)
    return { variant: "similar", title: `Categories similar to ${cat}`, action: "View categories", href: depthHref({ Categories: [cat] }) };
  if (query) return crossApps(lens === "ios" ? "web" : "ios");
  return null;
}

/* ── Injection glyphs ── */

function DesktopGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M19 15H10.99c-.05.72-.24 1.4-.57 2H14v2H7v-2c1.06 0 1.87-.77 1.98-2H1V2h18v13ZM3 11h14V4H3v7Z" fill="currentColor" />
    </svg>
  );
}

function MobileGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <rect x="3" y="1.5" width="10" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 3.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GlobeGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.2 10h15.6M10 2.2c2.4 2.1 2.4 13.5 0 15.6M10 2.2c-2.4 2.1-2.4 13.5 0 15.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SectionsGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3" width="15" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 8h15M8 8v9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CategoriesGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="10" width="14" height="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      <path d="M5 6.5h10M7 3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ScreenGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="8" y="6" width="8" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2.5H4V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlowGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="4" cy="15" r="2.3" fill="currentColor" />
      <rect x="12" y="3" width="6" height="6" rx="1.2" fill="currentColor" />
      <path d="M4 12.5V8a3 3 0 0 1 3-3h3a3 3 0 0 0 3-3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function SparkleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l1.7 5L17 8.7l-5 1.6L10 16l-2-5.7L3 8.7l5.3-1.7L10 2z" fill="currentColor" />
    </svg>
  );
}

function reachIcon(target: Lens, type: ResultType) {
  if (target === "sites") return type === "screens" ? <SectionsGlyph /> : <GlobeGlyph />;
  return target === "ios" ? <MobileGlyph /> : <DesktopGlyph />;
}

function depthIcon(block: DepthBlock) {
  if (block.variant === "reach") return reachIcon(block.target, block.reachType);
  if (block.variant === "similar") return <CategoriesGlyph />;
  if (block.cardKind === "flow") return <FlowGlyph />;
  if (block.cardKind === "web") return <SparkleGlyph />;
  return <ScreenGlyph />;
}

/* ── UI pieces ── */

function InjectionPanel({
  icon,
  title,
  action,
  href,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  action?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const arrow = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <div className="rounded-[24px] border border-[var(--border)] p-[20px] min-[720px]:p-[24px]">
      <div className="mb-[20px] flex items-center justify-between gap-x-[12px]">
        <div className="flex items-center gap-x-[8px] text-[var(--muted-strong)]">
          {icon}
          <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--foreground)]">{title}</h3>
        </div>
        {action && href && (
          <Link
            href={href}
            className="hidden shrink-0 items-center gap-x-[4px] text-[14px] font-semibold text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)] min-[720px]:flex"
          >
            {action}
            {arrow}
          </Link>
        )}
      </div>
      {children}
      {action && href && (
        <Link
          href={href}
          className="mt-[20px] flex h-[44px] w-full items-center justify-center gap-x-[6px] rounded-full border border-[var(--border-strong)] text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)] min-[720px]:hidden"
        >
          {action}
          {arrow}
        </Link>
      )}
    </div>
  );
}

// Single scrollable row on mobile, grid on >=720px.
function Shelf({
  gridCols,
  itemWidth = "w-[78%]",
  items,
}: {
  gridCols: string;
  itemWidth?: string;
  items: React.ReactNode[];
}) {
  return (
    <div className={`scrollbar-none flex gap-[16px] overflow-x-auto min-[720px]:grid min-[720px]:overflow-visible ${gridCols}`}>
      {items.map((node, i) => (
        <div key={i} className={`${itemWidth} shrink-0 min-[720px]:w-auto`}>
          {node}
        </div>
      ))}
    </div>
  );
}

function WebMiniCard({ title, desc, href }: { title: string; desc: string; href?: string }) {
  return (
    <div className="group/cell flex flex-col gap-y-[12px]">
      <Link
        href={href ?? "#"}
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        <div className="aspect-[16/10] w-[86%] overflow-hidden rounded-[10px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
      </Link>
      <div className="flex items-center gap-x-[8px]">
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[28%] bg-[var(--surface)]">
          <LoaderDots size={14} />
        </div>
        <div className="flex min-w-0 flex-col">
          <h4 className="truncate text-[15px] font-semibold leading-[20px] text-[var(--foreground)]">{title}</h4>
          <p className="truncate text-[13px] leading-[18px] text-[var(--muted-strong)]">{desc}</p>
        </div>
      </div>
    </div>
  );
}

const SIMILAR = [
  { title: "Communication", desc: "Apps that facilitate communication and interaction between users." },
  { title: "Lifestyle", desc: "Apps that provide for general-interest subjects or lifestyle services." },
  { title: "News", desc: "Apps that provide information and developments about current events." },
];

/* ── Category content section (shown after a brand's own results) ── */

// A single content type is surfaced per brand results page, picked
// deterministically so it stays stable but differs across categories.
const CATEGORY_CONTENT = ["Onboarding", "Checkout", "Dashboard", "Sign Up", "Empty State"];

function blockLabelFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return CATEGORY_CONTENT[h % CATEGORY_CONTENT.length];
}

// Decorative app logos flanking each section title.
function CategoryDivider({ title, logos }: { title: string; logos: string[] }) {
  return (
    <div className="flex items-center gap-x-[16px]">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <div className="flex shrink-0 items-center gap-x-[10px]">
        <h3 className="whitespace-nowrap text-[16px] font-semibold leading-[24px] text-[var(--foreground)]">
          {title}
        </h3>
        <div className="flex items-center">
          {logos.map((c, i) => (
            <span
              key={i}
              className={`size-[26px] rounded-[28%] border-2 border-[var(--background)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)] ${
                i > 0 ? "-ml-[8px]" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}

// A divider title + a grid of screen cards, matching the standard SRP columns
// (5 for iOS, 3 for web).
function CategoryContentSection({ title, logos, variant }: { title: string; logos: string[]; variant: Variant }) {
  const count = variant === "ios" ? 5 : 3;
  const cols =
    variant === "ios"
      ? "grid-cols-2 min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5"
      : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
  return (
    <div className="flex flex-col gap-y-[24px]">
      <CategoryDivider title={title} logos={logos} />
      <div className={`grid gap-x-[16px] gap-y-[28px] ${cols}`}>
        {Array.from({ length: count }).map((_, i) => (
          <BareScreenCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

/* ── Result grids ── */

function ResultGrid({
  type,
  variant,
  count,
  screens = [],
  sites = false,
}: {
  type: ResultType;
  variant: Variant;
  count: number;
  screens?: RealScreen[];
  sites?: boolean;
}) {
  if (type === "flows") {
    return (
      <div className="flex flex-col gap-y-[48px]">
        {Array.from({ length: count }).map((_, i) => (
          <FlowCard key={i} variant={variant} />
        ))}
      </div>
    );
  }
  if (type === "screens") {
    const cols =
      variant === "ios"
        ? "grid-cols-2 min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5"
        : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
    return (
      <div className={`grid gap-x-[16px] gap-y-[28px] ${cols}`}>
        {Array.from({ length: count }).map((_, i) =>
          screens[i] ? (
            <BareScreenCard key={`r-${screens[i].app}`} variant={variant} screen={screens[i]} />
          ) : (
            <BareScreenCard key={i} variant={variant} />
          ),
        )}
      </div>
    );
  }
  const cols =
    variant === "ios"
      ? "grid-cols-1 min-[720px]:grid-cols-4"
      : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
  return (
    <div className={`grid gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] min-[720px]:gap-y-[40px] ${cols}`}>
      {Array.from({ length: count }).map((_, i) =>
        screens[i] ? (
          <RealAppCard key={`r-${screens[i].app}`} screen={screens[i]} variant={variant} sites={sites} />
        ) : (
          <PlaceholderCard key={i} variant={variant} />
        ),
      )}
    </div>
  );
}

// Real screens that best represent a reached-into lens.
function reachScreens(target: Lens): RealScreen[] {
  if (target === "sites") return siteScreens;
  return target === "ios" ? iosAppScreens : webAppScreens;
}

// Reach shows the target lens at the SAME granularity as the active grid.
function ReachPanelBody({ target, type }: { target: Lens; type: ResultType }) {
  const v = LENS_VARIANT[target];
  const isSites = target === "sites";
  const screens = reachScreens(target);
  // Aspect-flip shelf: portrait for iOS, landscape for web/sites.
  if (type === "flows") {
    return <FlowCard variant={v} />;
  }
  if (type === "screens") {
    const n = v === "ios" ? 5 : 3;
    return (
      <Shelf
        gridCols={v === "ios" ? "min-[720px]:grid-cols-5" : "min-[720px]:grid-cols-3"}
        itemWidth={v === "ios" ? "w-[40%]" : "w-[82%]"}
        items={Array.from({ length: n }).map((_, i) => (
          <BareScreenCard key={i} variant={v} screen={screens[i]} />
        ))}
      />
    );
  }
  const n = v === "ios" ? 4 : 3;
  return (
    <Shelf
      gridCols={v === "ios" ? "min-[720px]:grid-cols-4" : "min-[720px]:grid-cols-3"}
      itemWidth={v === "ios" ? "w-[44%]" : "w-[82%]"}
      items={Array.from({ length: n }).map((_, i) =>
        screens[i] ? (
          <RealAppCard key={`r-${screens[i].app}`} screen={screens[i]} variant={v} sites={isSites} />
        ) : (
          <PlaceholderCard key={i} variant={v} />
        ),
      )}
    />
  );
}

function DepthPanelBody({
  block,
  variant,
  experience,
  platform,
}: {
  block: DepthBlock;
  variant: Variant;
  experience: Experience;
  platform: Platform;
}) {
  if (block.variant === "similar") {
    return (
      <Shelf
        gridCols="min-[720px]:grid-cols-3"
        itemWidth="w-[82%]"
        items={SIMILAR.map((c) => (
          <WebMiniCard
            key={c.title}
            title={c.title}
            desc={c.desc}
            href={filterHref(experience, platform, "Categories", c.title)}
          />
        ))}
      />
    );
  }
  if (block.variant === "reach") {
    return <ReachPanelBody target={block.target} type={block.reachType} />;
  }
  if (block.cardKind === "flow") {
    return <FlowCard variant={variant} />;
  }
  if (block.cardKind === "web") {
    return (
      <Shelf
        gridCols="min-[720px]:grid-cols-3"
        itemWidth="w-[82%]"
        items={Array.from({ length: 3 }).map((_, i) =>
          siteScreens[i] ? (
            <RealAppCard key={`r-${siteScreens[i].app}`} screen={siteScreens[i]} variant="web" sites />
          ) : (
            <PlaceholderCard key={i} variant="web" />
          ),
        )}
      />
    );
  }
  // screens
  const screens = variant === "ios" ? iosAppScreens : webAppScreens;
  const n = variant === "ios" ? 5 : 3;
  return (
    <Shelf
      gridCols={variant === "ios" ? "min-[720px]:grid-cols-5" : "min-[720px]:grid-cols-3"}
      itemWidth={variant === "ios" ? "w-[40%]" : "w-[82%]"}
      items={Array.from({ length: n }).map((_, i) => (
        <BareScreenCard key={i} variant={variant} screen={screens[i]} />
      ))}
    />
  );
}

/* ── Main ── */

interface SearchResultsProps {
  experience: Experience;
  platform: Platform;
  type: ResultType;
  filters: Filters;
  query: string;
}

export default function SearchResults({ experience, platform, type, filters, query }: SearchResultsProps) {
  const variant: Variant = experience === "sites" ? "web" : platform === "iOS" ? "ios" : "web";
  const lens = activeLens(experience, platform);

  // Empty state injects nothing. A query alone is enough to inject.
  const injecting = query.length > 0 || hasFilters(filters);
  const reach = injecting ? reachBlock(lens, filters, query, type) : null;
  const depth = injecting ? depthBlock(lens, filters, query, reach?.target ?? "ios") : null;

  // Batch sizes so reach lands ~row 3 and depth ~row 6.
  const b1 = type === "flows" ? 2 : variant === "ios" ? (type === "screens" ? 10 : 8) : 6;
  const b2 = type === "flows" ? 3 : variant === "ios" ? (type === "screens" ? 10 : 12) : 9;
  const b3 = type === "flows" ? 2 : variant === "ios" ? (type === "screens" ? 5 : 8) : 6;

  const sites = experience === "sites";

  // Brand spotlight: a full-width banner above the results grid (all result types).
  const brand = brandFor(query);

  // The brand's own screenshots, shaped as result screens.
  const brandScreens: RealScreen[] = brand
    ? (variant === "ios" ? brand.screens : brand.screensWeb).map((src) => ({
        app: brand.name,
        description: brand.description,
        src,
        href: brand.href,
        logoColor: brand.color,
      }))
    : [];

  // Real Mobbin screens populate the first results section (one row).
  const firstRowScreens: RealScreen[] =
    type === "flows" ? [] : sites ? siteScreens : variant === "ios" ? iosAppScreens : webAppScreens;

  // A brand query renders a focused screen gallery: a full-width brand banner on
  // top, the brand's own screens, then a single same-category section — no
  // reach/depth panels or generic app filler.
  if (brand && type === "apps") {
    const screenCols =
      variant === "ios"
        ? "grid-cols-2 min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5"
        : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
    const fill = variant === "ios" ? 15 : 9;
    return (
      <div className="flex flex-col gap-y-[48px] pb-[40px]">
        <BrandBanner brand={brand} />

        <div className={`grid gap-x-[16px] gap-y-[28px] ${screenCols}`}>
          {Array.from({ length: fill }).map((_, i) =>
            brandScreens[i] ? (
              <BareScreenCard key={`bs-${i}`} variant={variant} screen={brandScreens[i]} />
            ) : (
              <BareScreenCard key={`bs-${i}`} variant={variant} />
            ),
          )}
        </div>

        <CategoryContentSection
          title={`${blockLabelFor(brand.category)} in ${brand.category} apps`}
          logos={[brand.color, "#635BFF", "#0D0D0D"]}
          variant={variant}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-[48px] pb-[40px]">
      {brand && <BrandBanner brand={brand} />}

      <ResultGrid
        type={type}
        variant={variant}
        count={b1}
        screens={firstRowScreens}
        sites={sites}
      />

      {reach && (
        <InjectionPanel
          icon={reachIcon(reach.target, type)}
          title={reach.title}
          action={reach.action}
          href={reach.href}
        >
          <ReachPanelBody target={reach.target} type={type} />
        </InjectionPanel>
      )}

      <ResultGrid type={type} variant={variant} count={b2} />

      {depth && (
        <InjectionPanel
          icon={depthIcon(depth)}
          title={depth.title}
          action={depth.action}
          href={depth.href}
        >
          <DepthPanelBody block={depth} variant={variant} experience={experience} platform={platform} />
        </InjectionPanel>
      )}

      <ResultGrid type={type} variant={variant} count={b3} />
    </div>
  );
}
