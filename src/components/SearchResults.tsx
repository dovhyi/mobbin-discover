"use client";

import {
  BareScreenCard,
  FlowCard,
  LoaderDots,
  PlaceholderCard,
} from "@/components/AppCardsGrid";
import type { Experience, Filters, Platform, ResultType } from "@/lib/search";

type Variant = "ios" | "web";

/* ── Small building blocks ── */

function SectionBar({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-x-[12px]">
      <div className="flex items-center gap-x-[8px] text-[var(--muted-strong)]">
        {icon}
        <h3 className="text-[16px] font-semibold leading-[24px] text-[var(--foreground)]">
          {title}
        </h3>
      </div>
      {action && (
        <button className="flex shrink-0 items-center gap-x-[4px] text-[14px] font-semibold text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)]">
          {action}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

function DesktopGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M19 15H10.99c-.05.72-.24 1.4-.57 2H14v2H7v-2c1.06 0 1.87-.77 1.98-2H1V2h18v13ZM3 11h14V4H3v7Z" fill="currentColor" />
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

function WebMiniCard({ title, desc, color }: { title: string; desc: string; color?: string }) {
  return (
    <div className="group/cell flex flex-col gap-y-[12px]">
      <a
        href="#"
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        <div className="aspect-[16/10] w-[86%] overflow-hidden rounded-[10px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
      </a>
      <div className="flex items-center gap-x-[8px]">
        <div
          className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[28%] bg-[var(--surface)]"
          style={color ? { backgroundColor: color } : undefined}
        >
          {!color && <LoaderDots size={14} />}
        </div>
        <div className="flex min-w-0 flex-col">
          <h4 className="truncate text-[15px] font-semibold leading-[20px] text-[var(--foreground)]">
            {title}
          </h4>
          <p className="truncate text-[13px] leading-[18px] text-[var(--muted-strong)]">
            {desc}
          </p>
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

const WEB_APPS = [
  { title: "Notion", desc: "The AI workspace that works for you", color: "#111111" },
  { title: "Claude", desc: "AI assistant for life and work", color: "#D97757" },
  { title: "Linear", desc: "The system for product development", color: "#5E6AD2" },
];

/* ── Grids ── */

function AppGrid({ variant, count }: { variant: Variant; count: number }) {
  const cols =
    variant === "ios"
      ? "grid-cols-2 min-[720px]:grid-cols-4"
      : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
  return (
    <div className={`grid gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] min-[720px]:gap-y-[40px] ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <PlaceholderCard key={i} variant={variant} />
      ))}
    </div>
  );
}

function ScreenGrid({ variant, count }: { variant: Variant; count: number }) {
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

/* ── Main ── */

interface SearchResultsProps {
  experience: Experience;
  platform: Platform;
  type: ResultType;
  filters: Filters;
}

export default function SearchResults({ experience, platform, type, filters }: SearchResultsProps) {
  const variant: Variant = experience === "sites" ? "web" : platform === "iOS" ? "ios" : "web";
  const category = filters["Categories"]?.[0] ?? "Collaboration";
  const screenValue =
    filters["Screens"]?.[0] ?? filters["UI Elements"]?.[0] ?? filters["Sections"]?.[0] ?? "Verification";

  if (type === "flows") {
    return (
      <div className="flex flex-col gap-y-[48px] pb-[40px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <FlowCard key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (type === "screens") {
    return (
      <div className="flex flex-col gap-y-[48px] pb-[40px]">
        <ScreenGrid variant={variant} count={variant === "ios" ? 10 : 6} />
        <div className="flex flex-col gap-y-[20px]">
          <SectionBar icon={<DesktopGlyph />} title={`${screenValue} in Web Apps`} action="View in Web Apps" />
          <FlowCard variant="web" />
        </div>
        <ScreenGrid variant={variant} count={variant === "ios" ? 10 : 6} />
      </div>
    );
  }

  // type === "apps"
  return (
    <div className="flex flex-col gap-y-[48px] pb-[40px]">
      <AppGrid variant={variant} count={variant === "ios" ? 8 : 6} />

      <div className="flex flex-col gap-y-[20px]">
        <SectionBar icon={<LockGlyph />} title={`Categories similar to ${category}`} />
        <div className="grid grid-cols-1 gap-[16px] min-[720px]:grid-cols-3">
          {SIMILAR.map((c) => (
            <WebMiniCard key={c.title} title={c.title} desc={c.desc} />
          ))}
        </div>
      </div>

      <AppGrid variant={variant} count={variant === "ios" ? 8 : 6} />

      <div className="flex flex-col gap-y-[20px]">
        <SectionBar icon={<DesktopGlyph />} title={`Web Apps in ${category}`} action="View Web Apps" />
        <div className="grid grid-cols-1 gap-[16px] min-[720px]:grid-cols-3">
          {WEB_APPS.map((a) => (
            <WebMiniCard key={a.title} title={a.title} desc={a.desc} color={a.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
