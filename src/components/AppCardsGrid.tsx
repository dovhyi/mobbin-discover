"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Experience = "Apps" | "Sites";
type Platform = "iOS" | "Web";

interface AppCardsGridProps {
  experience: Experience;
  platform: Platform;
  filter: string;
  sort: string;
}

/* ── Data ── */

interface WebApp {
  name: string;
  description: string;
  screenImage: string;
  logoImage: string;
  rating: string;
}

const webApps: WebApp[] = [
  { name: "Pinterest", description: "Fashion, home design and ideas", screenImage: "/assets/pinterest-screen.png", logoImage: "/assets/pinterest-logo.png", rating: "4.95" },
  { name: "Posh", description: "Social experiences", screenImage: "/assets/posh-screen.png", logoImage: "/assets/posh-logo.png", rating: "5.0" },
  { name: "Kiwi.com", description: "Cheap flights", screenImage: "/assets/kiwi-screen.png", logoImage: "/assets/kiwi-logo.png", rating: "4.97" },
  { name: "Visitors", description: "Realtime web analytics", screenImage: "/assets/visitors-screen.png", logoImage: "/assets/visitors-logo.png", rating: "4.81" },
  { name: "Kraken", description: "Buy and sell crypto securely", screenImage: "/assets/kraken-screen.png", logoImage: "/assets/kraken-logo.png", rating: "5.0" },
  { name: "Linktree", description: "Link in bio creator", screenImage: "/assets/linktree-screen.png", logoImage: "/assets/linktree-logo.png", rating: "5.0" },
];

interface MobileApp {
  name: string;
  description: string;
  badge: "New" | "Updated";
  logoColor: string;
}

const iosApps: MobileApp[] = [
  { name: "Lyft", description: "One app. All the rides", badge: "Updated", logoColor: "#FF00BF" },
  { name: "XChat", description: "Chat with anyone", badge: "New", logoColor: "#1A1A1A" },
  { name: "Granola", description: "AI meeting notes", badge: "New", logoColor: "#B7F03C" },
  { name: "GOAT", description: "Sneakers & apparel", badge: "Updated", logoColor: "#111111" },
];

interface Site {
  name: string;
  description: string;
  logoColor: string;
}

const sites: Site[] = [
  { name: "Midday", description: "Run your business smarter", logoColor: "#111111" },
  { name: "Whop", description: "The future of work", logoColor: "#FF6243" },
  { name: "Autosend", description: "Email for developers and marketers", logoColor: "#6E56CF" },
];

const CATEGORIES = [
  "AI", "Business", "Collaboration", "Communication", "CRM",
  "Developer Tools", "Education", "Entertainment", "Finance", "Food & Drink",
  "Graphics & Design", "Health & Fitness", "Jobs & Recruitment", "Lifestyle",
];

const SCREEN_SECTIONS = [
  "Verification", "Dashboard", "Onboarding", "Checkout", "Settings", "Profile",
];

const UI_ELEMENT_SECTIONS = [
  "Buttons", "Inputs", "Cards", "Navigation", "Modals", "Tables",
];

// Same content for iOS and Web, rearranged so the two don't look identical.
const reorderForWeb = (items: string[]) => [...items].reverse();

/* ── Shared bits ── */

function AppInfo({
  name,
  description,
  logoImage,
  logoColor,
}: {
  name: string;
  description: string;
  logoImage?: string;
  logoColor?: string;
}) {
  return (
    <section className="pointer-events-none flex w-full items-center gap-x-[8px]">
      <div
        className="relative h-[40px] w-[40px] shrink-0 overflow-hidden bg-[var(--surface)]"
        style={{ borderRadius: "30%", backgroundColor: logoColor }}
      >
        {logoImage && (
          <Image src={logoImage} alt={`${name} logo`} fill className="object-cover" />
        )}
        <div
          className="pointer-events-none absolute inset-0 shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]"
          style={{ borderRadius: "30%" }}
        />
      </div>
      <div className="flex min-w-0 grow flex-col">
        <h3 className="truncate text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-[var(--foreground)]">
          {name}
        </h3>
        <p className="truncate text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[var(--muted-strong)]">
          {description}
        </p>
      </div>
    </section>
  );
}

function SpinnerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="var(--muted)" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="var(--muted)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PlaceholderInfo() {
  return (
    <section className="pointer-events-none flex w-full items-center gap-x-[8px]">
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[30%] bg-[var(--surface)]">
        <SpinnerIcon />
      </div>
      <div className="flex min-w-0 grow flex-col">
        <h3 className="text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-[var(--foreground)]">
          App
        </h3>
        <p className="text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[var(--muted-strong)]">
          Tagline
        </p>
      </div>
    </section>
  );
}

function CompactLabel() {
  return (
    <div className="pointer-events-none flex items-center gap-x-[8px]">
      <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[28%] bg-[var(--surface)]">
        <SpinnerIcon size={13} />
      </div>
      <span className="text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-[var(--foreground)]">
        App
      </span>
    </div>
  );
}

function CornerBadge({ label, icon }: { label: string; icon?: boolean }) {
  return (
    <div className="pointer-events-none absolute left-[16px] top-[16px] flex items-center justify-center gap-x-[4px] rounded-[8px] bg-[rgba(115,115,115,0.56)] px-[8px] py-[4px] backdrop-blur-sm">
      {icon && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <path d="M5 0.5L6.12 3.68L9.51 3.94L6.93 6.18L7.74 9.5L5 7.82L2.26 9.5L3.07 6.18L0.49 3.94L3.88 3.68L5 0.5Z" fill="white" />
        </svg>
      )}
      <span className="text-[12px] font-semibold leading-[16px] text-white">{label}</span>
    </div>
  );
}

/* ── Screenshot frames (placeholders) ── */

function PhoneFrame() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-t-[28px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]">
      <div className="flex items-center justify-between px-[14px] pt-[10px] text-[10px] font-semibold text-[var(--foreground)]">
        <span>9:41</span>
        <span className="inline-block h-[8px] w-[14px] rounded-[2px] border border-current opacity-70" />
      </div>
    </div>
  );
}

function BrowserFrame() {
  return (
    <div className="relative w-[84%] overflow-hidden rounded-[10px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]">
      <div className="flex h-[20px] items-center gap-[4px] border-b border-[var(--border)] px-[10px]">
        <span className="h-[6px] w-[6px] rounded-full bg-[var(--muted)] opacity-60" />
        <span className="h-[6px] w-[6px] rounded-full bg-[var(--muted)] opacity-60" />
        <span className="h-[6px] w-[6px] rounded-full bg-[var(--muted)] opacity-60" />
      </div>
      <div className="aspect-[16/10] w-full" />
    </div>
  );
}

/* ── Card variants ── */

function WebCard({ app }: { app: WebApp }) {
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      <a
        href="#"
        className="relative block aspect-square overflow-hidden rounded-[28px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        <div className="flex size-full items-center justify-center">
          <div className="relative w-[81.7%] overflow-hidden rounded-[10px]">
            <Image
              src={app.screenImage}
              alt={`${app.name} screenshot`}
              width={800}
              height={500}
              className="w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
          </div>
        </div>
        <CornerBadge label={app.rating} icon />
      </a>
      <AppInfo name={app.name} description={app.description} logoImage={app.logoImage} />
    </div>
  );
}

function MobileCard({ app }: { app: MobileApp }) {
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      <a
        href="#"
        className="relative flex aspect-[3/5] items-end justify-center overflow-hidden rounded-[28px] bg-[var(--card)] px-[14%] pt-[12%] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        <PhoneFrame />
        <CornerBadge label={app.badge} />
      </a>
      <AppInfo name={app.name} description={app.description} logoColor={app.logoColor} />
    </div>
  );
}

function SiteCard({ site }: { site: Site }) {
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      <a
        href="#"
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        <BrowserFrame />
      </a>
      <AppInfo name={site.name} description={site.description} logoColor={site.logoColor} />
    </div>
  );
}

function PlaceholderCard({ variant }: { variant: "ios" | "web" }) {
  return (
    <div className="flex flex-col gap-y-[16px]">
      {variant === "ios" ? (
        <div className="relative flex aspect-[3/5] items-end justify-center overflow-hidden rounded-[28px] bg-[var(--card)] px-[14%] pt-[12%]">
          <PhoneFrame />
        </div>
      ) : (
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px] bg-[var(--card)]">
          <BrowserFrame />
        </div>
      )}
      <PlaceholderInfo />
    </div>
  );
}

// Bare screen (no chrome) — used by the Screens / UI Elements filters.
function BareScreenCard({ variant }: { variant: "ios" | "web" }) {
  const aspect = variant === "ios" ? "aspect-[9/19]" : "aspect-[16/10]";
  const rounded = variant === "ios" ? "rounded-[28px]" : "rounded-[16px]";
  return (
    <div className="group/cell flex flex-col gap-y-[12px]">
      <a
        href="#"
        className={`block ${aspect} ${rounded} bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]`}
      />
      <CompactLabel />
    </div>
  );
}

/* ── Skeletons ── */

function SkeletonCard({ aspect }: { aspect: string }) {
  return (
    <div className="flex flex-col gap-y-[16px]">
      <div className={`${aspect} animate-pulse rounded-[28px] bg-[var(--card)]`} />
      <div className="flex w-full items-center gap-x-[8px]">
        <div className="h-[40px] w-[40px] shrink-0 animate-pulse rounded-[30%] bg-[var(--card)]" />
        <div className="flex min-w-0 grow flex-col gap-y-[6px]">
          <div className="h-[14px] w-[55%] animate-pulse rounded-[4px] bg-[var(--card)]" />
          <div className="h-[12px] w-[80%] animate-pulse rounded-[4px] bg-[var(--card)]" />
        </div>
      </div>
    </div>
  );
}

function BareSkeletonCard({ variant }: { variant: "ios" | "web" }) {
  const aspect = variant === "ios" ? "aspect-[9/19]" : "aspect-[16/10]";
  const rounded = variant === "ios" ? "rounded-[28px]" : "rounded-[16px]";
  return (
    <div className="flex flex-col gap-y-[12px]">
      <div className={`${aspect} ${rounded} animate-pulse bg-[var(--card)]`} />
      <div className="flex items-center gap-x-[8px]">
        <div className="h-[24px] w-[24px] shrink-0 animate-pulse rounded-[28%] bg-[var(--card)]" />
        <div className="h-[14px] w-[40px] animate-pulse rounded-[4px] bg-[var(--card)]" />
      </div>
    </div>
  );
}

/* ── Sections ── */

function CategorySection({ name, variant }: { name: string; variant: "ios" | "web" }) {
  return (
    <div className="flex flex-col gap-y-[20px] min-[720px]:gap-y-[24px]">
      <h2 className="text-[20px] font-[652] leading-[28px] text-[var(--foreground)]">
        {name}
      </h2>
      <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px] min-[720px]:grid-cols-4 min-[720px]:gap-x-[16px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <PlaceholderCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function CategorySectionSkeleton({ aspect }: { aspect: string }) {
  return (
    <div className="flex flex-col gap-y-[20px] min-[720px]:gap-y-[24px]">
      <div className="h-[28px] w-[160px] animate-pulse rounded-[6px] bg-[var(--card)]" />
      <div className="grid grid-cols-2 gap-x-[12px] gap-y-[20px] min-[720px]:grid-cols-4 min-[720px]:gap-x-[16px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} aspect={aspect} />
        ))}
      </div>
    </div>
  );
}

function ScreenSection({ name, variant }: { name: string; variant: "ios" | "web" }) {
  return (
    <div className="flex flex-col gap-y-[20px]">
      <h2 className="text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-[var(--foreground)]">
        {name}
      </h2>
      <div className="grid grid-cols-2 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <BareScreenCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function ScreenSectionSkeleton({ variant }: { variant: "ios" | "web" }) {
  return (
    <div className="flex flex-col gap-y-[20px]">
      <div className="h-[24px] w-[140px] animate-pulse rounded-[6px] bg-[var(--card)]" />
      <div className="grid grid-cols-2 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <BareSkeletonCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

/* ── Grid ── */

const wideGridStyle = {
  gridTemplateColumns:
    "repeat(auto-fill, minmax(max(300px, calc((100% - 2 * 16px) / 3)), 1fr))",
};

const PaginationDots = () => (
  <div className="flex w-full items-center justify-center py-[24px]">
    <Image src="/assets/pagination-dots.svg" alt="" width={34} height={7} />
  </div>
);

export default function AppCardsGrid({
  experience,
  platform,
  filter,
  sort,
}: AppCardsGridProps) {
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  // Simulate a server round-trip whenever the selection changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [experience, platform, filter, sort]);

  const variant = platform === "iOS" ? "ios" : "web";

  // Category-grouped sections (Apps + Categories filter).
  if (experience === "Apps" && filter === "Categories") {
    const aspect = variant === "ios" ? "aspect-[3/5]" : "aspect-square";
    const cats = variant === "ios" ? CATEGORIES : reorderForWeb(CATEGORIES);
    return (
      <div className="pb-[24px]">
        <div className="flex flex-col gap-y-[48px]">
          {loading
            ? [0, 1].map((s) => <CategorySectionSkeleton key={s} aspect={aspect} />)
            : cats.map((c) => <CategorySection key={c} name={c} variant={variant} />)}
        </div>
        <PaginationDots />
      </div>
    );
  }

  // Bare-screen sections (Apps + Screens / UI Elements filter).
  if (experience === "Apps" && (filter === "Screens" || filter === "UI Elements")) {
    const base = filter === "Screens" ? SCREEN_SECTIONS : UI_ELEMENT_SECTIONS;
    const sections = variant === "ios" ? base : reorderForWeb(base);
    return (
      <div className="pb-[24px]">
        <div className="flex flex-col gap-y-[48px]">
          {loading
            ? [0, 1].map((s) => <ScreenSectionSkeleton key={s} variant={variant} />)
            : sections.map((s) => <ScreenSection key={s} name={s} variant={variant} />)}
        </div>
        <PaginationDots />
      </div>
    );
  }

  const mode =
    experience === "Sites" ? "sites" : platform === "iOS" ? "ios" : "web";

  return (
    <div className="pb-[24px]">
      {mode === "ios" ? (
        <div className="grid grid-cols-2 content-start gap-x-[12px] gap-y-[20px] min-[720px]:grid-cols-4 min-[720px]:gap-x-[16px] min-[720px]:gap-y-[48px]">
          {loading
            ? iosApps.map((_, i) => <SkeletonCard key={i} aspect="aspect-[3/5]" />)
            : iosApps.map((app) => <MobileCard key={app.name} app={app} />)}
        </div>
      ) : (
        <div
          className="grid content-start gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] min-[720px]:gap-y-[48px]"
          style={wideGridStyle}
        >
          {mode === "sites"
            ? loading
              ? sites.map((_, i) => <SkeletonCard key={i} aspect="aspect-square" />)
              : sites.map((site) => <SiteCard key={site.name} site={site} />)
            : loading
              ? webApps.map((_, i) => <SkeletonCard key={i} aspect="aspect-square" />)
              : webApps.map((app) => <WebCard key={app.name} app={app} />)}
        </div>
      )}

      <PaginationDots />
    </div>
  );
}
