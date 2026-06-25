"use client";

import Link from "next/link";
import {
  BareScreenCard,
  FlowCard,
  LoaderDots,
  PlaceholderCard,
} from "@/components/AppCardsGrid";
import type { Experience, Filters, Platform, ResultType } from "@/lib/search";

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
const LENS_VARIANT: Record<Lens, Variant> = { ios: "ios", web: "web", sites: "web" };
// Strongest non-active platform first (one block per type — pick the top).
const REACH_ORDER: Record<Lens, Lens[]> = {
  ios: ["web", "sites"],
  web: ["ios", "sites"],
  sites: ["ios", "web"],
};

const NEIGHBORS = ["Crypto & Web3", "Productivity", "Finance", "Social", "Health & Fitness", "Communication"];
function adjacentCategory(cat?: string) {
  return NEIGHBORS.find((c) => c !== cat) ?? "Productivity";
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

function reachHref(target: Lens, filters: Filters, query: string) {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  const { exp, platform } = lensParams(target);
  p.set("exp", exp);
  if (platform) p.set("platform", platform);
  const f = encodeFilters(filters);
  if (f) p.set("f", f);
  return `/search?${p.toString()}`;
}

function hasFilters(filters: Filters) {
  return Object.values(filters).some((v) => v.length > 0);
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

/* ── Block computation ── */

interface ReachBlock {
  title: string;
  target: Lens;
  href: string;
}

function reachBlock(lens: Lens, filters: Filters, query: string): ReachBlock | null {
  const target = REACH_ORDER[lens][0];
  const cat = filters["Categories"]?.[0];
  const sub = subValue(filters);
  let title: string | null = null;
  if (query) title = `${LENS_LABEL[target]} that match "${query}"`;
  else if (cat && sub) title = `${LENS_LABEL[target]} with ${sub} in ${cat}`;
  else if (cat) title = `${LENS_LABEL[target]} in ${cat}`;
  else if (sub) title = `${LENS_LABEL[target]} with ${sub}`;
  if (!title) return null;
  return { title, target, href: reachHref(target, filters, query) };
}

type DepthBlock =
  | { variant: "similar"; title: string }
  | { variant: "shelf"; title: string; cardKind: "screen" | "flow" | "web" };

function depthBlock(filters: Filters): DepthBlock | null {
  const cat = filters["Categories"]?.[0];
  const screen = filters["Screens"]?.[0];
  const ui = filters["UI Elements"]?.[0];
  const flow = filters["Flows"]?.[0];
  const section = filters["Sections"]?.[0];
  const style = filters["Styles"]?.[0];

  // Priority 2 — category depth (similar categories OR a trending flow, never both).
  if (cat) {
    if (screen || ui || flow) return { variant: "shelf", title: `Onboarding in ${cat}`, cardKind: "flow" };
    return { variant: "similar", title: `Categories similar to "${cat}"` };
  }
  // Priority 3 — filter-dimension breadth.
  if (screen) return { variant: "shelf", title: `${screen} in ${adjacentCategory()}`, cardKind: "screen" };
  if (flow) return { variant: "shelf", title: `${flow} in ${adjacentCategory()}`, cardKind: "flow" };
  if (ui) return { variant: "shelf", title: `${ui} across categories`, cardKind: "screen" };
  if (section) return { variant: "shelf", title: `${section} across sites`, cardKind: "web" };
  if (style) return { variant: "shelf", title: `${style} across sites`, cardKind: "web" };
  return null;
}

/* ── UI pieces ── */

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

function LockGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function lensGlyph(lens: Lens) {
  return lens === "ios" ? <MobileGlyph /> : <DesktopGlyph />;
}

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

/* ── Result grids ── */

function ResultGrid({ type, variant, count }: { type: ResultType; variant: Variant; count: number }) {
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
        {Array.from({ length: count }).map((_, i) => (
          <BareScreenCard key={i} variant={variant} />
        ))}
      </div>
    );
  }
  const cols =
    variant === "ios"
      ? "grid-cols-1 min-[720px]:grid-cols-4"
      : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
  return (
    <div className={`grid gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] min-[720px]:gap-y-[40px] ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <PlaceholderCard key={i} variant={variant} />
      ))}
    </div>
  );
}

// Reach shows the other platform at the SAME granularity as the active grid.
function ReachPanelBody({ target, type }: { target: Lens; type: ResultType }) {
  const v = LENS_VARIANT[target];
  // Aspect-flip shelf: portrait for iOS, landscape for web/sites.
  if (type === "flows") {
    return <FlowCard variant={v} />;
  }
  if (type === "screens") {
    return (
      <Shelf
        gridCols={v === "ios" ? "min-[720px]:grid-cols-5" : "min-[720px]:grid-cols-3"}
        itemWidth={v === "ios" ? "w-[40%]" : "w-[82%]"}
        items={Array.from({ length: v === "ios" ? 5 : 3 }).map((_, i) => (
          <BareScreenCard key={i} variant={v} />
        ))}
      />
    );
  }
  const count = v === "ios" ? 4 : 3;
  return (
    <Shelf
      gridCols={v === "ios" ? "min-[720px]:grid-cols-4" : "min-[720px]:grid-cols-3"}
      itemWidth={v === "ios" ? "w-[44%]" : "w-[82%]"}
      items={Array.from({ length: count }).map((_, i) => <PlaceholderCard key={i} variant={v} />)}
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
  if (block.cardKind === "flow") {
    return <FlowCard variant={variant} />;
  }
  if (block.cardKind === "web") {
    return (
      <Shelf
        gridCols="min-[720px]:grid-cols-3"
        itemWidth="w-[82%]"
        items={Array.from({ length: 3 }).map((_, i) => <PlaceholderCard key={i} variant="web" />)}
      />
    );
  }
  // screens
  return (
    <Shelf
      gridCols={variant === "ios" ? "min-[720px]:grid-cols-5" : "min-[720px]:grid-cols-3"}
      itemWidth={variant === "ios" ? "w-[40%]" : "w-[82%]"}
      items={Array.from({ length: variant === "ios" ? 5 : 3 }).map((_, i) => (
        <BareScreenCard key={i} variant={variant} />
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

  // Empty state injects nothing.
  const injecting = query.length > 0 || hasFilters(filters);
  const reach = injecting ? reachBlock(lens, filters, query) : null;
  const depth = injecting ? depthBlock(filters) : null;

  // Batch sizes so reach lands ~row 3 and depth ~row 6.
  const b1 = type === "flows" ? 2 : variant === "ios" ? (type === "screens" ? 10 : 8) : 6;
  const b2 = type === "flows" ? 3 : variant === "ios" ? (type === "screens" ? 10 : 12) : 9;
  const b3 = type === "flows" ? 2 : variant === "ios" ? (type === "screens" ? 5 : 8) : 6;

  return (
    <div className="flex flex-col gap-y-[48px] pb-[40px]">
      <ResultGrid type={type} variant={variant} count={b1} />

      {reach && (
        <InjectionPanel
          icon={lensGlyph(reach.target)}
          title={reach.title}
          action={`View ${LENS_LABEL[reach.target]}`}
          href={reach.href}
        >
          <ReachPanelBody target={reach.target} type={type} />
        </InjectionPanel>
      )}

      <ResultGrid type={type} variant={variant} count={b2} />

      {depth && (
        <InjectionPanel icon={<LockGlyph />} title={depth.title}>
          <DepthPanelBody block={depth} variant={variant} experience={experience} platform={platform} />
        </InjectionPanel>
      )}

      <ResultGrid type={type} variant={variant} count={b3} />
    </div>
  );
}
