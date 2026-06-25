"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  iosAppScreens,
  webAppScreens,
  siteScreens,
  type RealScreen,
} from "@/data/mobbinScreens";

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
  screenImage?: string;
  logoImage?: string;
  rating?: string;
  logoColor?: string;
}

const webApps: WebApp[] = [
  { name: "Pinterest", description: "Fashion, home design and ideas", screenImage: "/assets/pinterest-screen.png", logoImage: "/assets/pinterest-logo.png", rating: "4.95" },
  { name: "Posh", description: "Social experiences", screenImage: "/assets/posh-screen.png", logoImage: "/assets/posh-logo.png", rating: "5.0" },
  { name: "Kiwi.com", description: "Cheap flights", screenImage: "/assets/kiwi-screen.png", logoImage: "/assets/kiwi-logo.png", rating: "4.97" },
  { name: "Visitors", description: "Realtime web analytics", screenImage: "/assets/visitors-screen.png", logoImage: "/assets/visitors-logo.png", rating: "4.81" },
  { name: "Kraken", description: "Buy and sell crypto securely", screenImage: "/assets/kraken-screen.png", logoImage: "/assets/kraken-logo.png", rating: "5.0" },
  { name: "Linktree", description: "Link in bio creator", screenImage: "/assets/linktree-screen.png", logoImage: "/assets/linktree-logo.png", rating: "5.0" },
  { name: "Figma", description: "Design together, anywhere", logoColor: "#F24E1E" },
  { name: "Loom", description: "Async video messaging", logoColor: "#625DF5" },
  { name: "Webflow", description: "Build websites visually", logoColor: "#4353FF" },
  { name: "Framer", description: "Design and ship sites", logoColor: "#0099FF" },
  { name: "Retool", description: "Build internal tools fast", logoColor: "#3D3D3D" },
  { name: "Productboard", description: "Product management system", logoColor: "#FF2638" },
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
  { name: "Cash App", description: "Send, spend & invest", badge: "Updated", logoColor: "#00D54B" },
  { name: "Duolingo", description: "Learn languages free", badge: "New", logoColor: "#58CC02" },
  { name: "Robinhood", description: "Investing for everyone", badge: "Updated", logoColor: "#00C805" },
  { name: "Strava", description: "Track runs & rides", badge: "New", logoColor: "#FC4C02" },
  { name: "Headspace", description: "Meditation & sleep", badge: "Updated", logoColor: "#FF7E1D" },
  { name: "Cleo", description: "AI money assistant", badge: "New", logoColor: "#5B2A86" },
  { name: "Revolut", description: "Money without borders", badge: "Updated", logoColor: "#0D0D0D" },
  { name: "Calm", description: "Sleep more, stress less", badge: "New", logoColor: "#2B5DB0" },
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
  { name: "Linear", description: "The system for product development", logoColor: "#5E6AD2" },
  { name: "Vercel", description: "Build and deploy on the web", logoColor: "#111111" },
  { name: "Raycast", description: "Supercharged productivity", logoColor: "#FF6363" },
  { name: "Resend", description: "Email for developers", logoColor: "#111111" },
  { name: "Clerk", description: "Authentication & user management", logoColor: "#6C47FF" },
  { name: "Supabase", description: "The open source Firebase", logoColor: "#3ECF8E" },
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

const FLOW_TYPES = [
  "Browsing Tutorial", "Creating Account", "Onboarding",
  "Editing Profile", "Logging In", "Adding to Cart & Bag",
];

const SITE_SECTION_TYPES = [
  "Hero", "Features", "Pricing", "Testimonials", "FAQ", "Footer",
];

const SITE_STYLE_TYPES = [
  "Minimal", "Bold", "Playful", "Brutalist", "Corporate", "Gradient",
];

// Same content for iOS and Web, rearranged so the two don't look identical.
const reorderForWeb = (items: string[]) => [...items].reverse();

// Link to the search results page with this section's filter (and lens) applied.
function searchHref(experience: Experience, platform: Platform, dimension: string, value: string) {
  const params = new URLSearchParams();
  if (experience === "Sites") {
    params.set("exp", "sites");
  } else {
    params.set("exp", "apps");
    params.set("platform", platform);
  }
  params.set("f", `${dimension}:${value}`);
  return `/search?${params.toString()}`;
}

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

export function LoaderDots({ size = 18 }: { size?: number }) {
  const dots: [number, number][] = [
    [19, 12], [16.95, 16.95], [12, 19], [7.05, 16.95],
    [5, 12], [7.05, 7.05], [12, 5], [16.95, 7.05],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={1.7}
          fill="var(--muted)"
          opacity={0.35 + (i / dots.length) * 0.45}
        />
      ))}
    </svg>
  );
}

function PlaceholderInfo() {
  return (
    <section className="pointer-events-none flex w-full items-center gap-x-[8px]">
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[30%] bg-[var(--surface)]">
        <LoaderDots />
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

function CompactLabel({ label, color }: { label?: string; color?: string }) {
  return (
    <div className="pointer-events-none flex items-center gap-x-[8px]">
      <div
        className="flex h-[24px] w-[24px] shrink-0 items-center justify-center overflow-hidden rounded-[28%] bg-[var(--surface)]"
        style={color ? { backgroundColor: color } : undefined}
      >
        {!color && <LoaderDots size={13} />}
      </div>
      <span className="truncate text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-[var(--foreground)]">
        {label ?? "App"}
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
    <div className="aspect-[9/19] h-[80%] rounded-[24px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
  );
}

function BrowserFrame() {
  return (
    <div className="relative aspect-[16/10] w-[84%] overflow-hidden rounded-[10px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
  );
}

/* ── Card variants ── */

function WebCard({ app, screen }: { app?: WebApp; screen?: RealScreen }) {
  if (screen) {
    return (
      <div className="group/cell relative flex flex-col gap-y-[16px]">
        <a
          href={screen.href}
          target="_blank"
          rel="noreferrer"
          className="relative block aspect-square overflow-hidden rounded-[28px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
        >
          <div className="flex size-full items-center justify-center">
            <div className="relative w-[81.7%] overflow-hidden rounded-[10px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={screen.src} alt={`${screen.app} screenshot`} loading="lazy" className="w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
            </div>
          </div>
        </a>
        <AppInfo name={screen.app} description={screen.description} logoColor={screen.logoColor} />
      </div>
    );
  }
  if (!app) return null;
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      <a
        href="#"
        className="relative block aspect-square overflow-hidden rounded-[28px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        <div className="flex size-full items-center justify-center">
          {app.screenImage ? (
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
          ) : (
            <div className="aspect-[16/10] w-[81.7%] overflow-hidden rounded-[10px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
          )}
        </div>
        {app.rating && <CornerBadge label={app.rating} icon />}
      </a>
      <AppInfo name={app.name} description={app.description} logoImage={app.logoImage} logoColor={app.logoColor} />
    </div>
  );
}

function MobileCard({ app, screen }: { app?: MobileApp; screen?: RealScreen }) {
  const name = screen?.app ?? app?.name ?? "";
  const description = screen?.description ?? app?.description ?? "";
  const logoColor = screen?.logoColor ?? app?.logoColor;
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      <a
        href={screen?.href ?? "#"}
        target={screen ? "_blank" : undefined}
        rel={screen ? "noreferrer" : undefined}
        className="relative flex aspect-[3/5] items-center justify-center overflow-hidden rounded-[28px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        {screen ? (
          <div className="aspect-[9/19] h-[80%] overflow-hidden rounded-[24px] bg-[var(--background-elevated)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screen.src} alt={`${name} screenshot`} loading="lazy" className="h-full w-full object-cover object-top" />
          </div>
        ) : (
          <PhoneFrame />
        )}
        {!screen && app && <CornerBadge label={app.badge} />}
      </a>
      <AppInfo name={name} description={description} logoColor={logoColor} />
    </div>
  );
}

function SiteCard({ site, screen }: { site?: Site; screen?: RealScreen }) {
  const name = screen?.app ?? site?.name ?? "";
  const description = screen?.description ?? site?.description ?? "";
  const logoColor = screen?.logoColor ?? site?.logoColor;
  return (
    <div className="group/cell relative flex flex-col gap-y-[16px]">
      <a
        href={screen?.href ?? "#"}
        target={screen ? "_blank" : undefined}
        rel={screen ? "noreferrer" : undefined}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px] bg-[var(--card)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]"
      >
        {screen ? (
          <div className="relative aspect-[16/10] w-[84%] overflow-hidden rounded-[10px] bg-[var(--background-elevated)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screen.src} alt={`${name} screenshot`} loading="lazy" className="h-full w-full object-cover object-top" />
            <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)]" />
          </div>
        ) : (
          <BrowserFrame />
        )}
      </a>
      <AppInfo name={name} description={description} logoColor={logoColor} />
    </div>
  );
}

// Real app/site result card, picking the right layout for the active lens.
export function RealAppCard({ screen, variant, sites }: { screen: RealScreen; variant: "ios" | "web"; sites?: boolean }) {
  if (sites) return <SiteCard screen={screen} />;
  return variant === "ios" ? <MobileCard screen={screen} /> : <WebCard screen={screen} />;
}

export function PlaceholderCard({ variant }: { variant: "ios" | "web" }) {
  return (
    <div className="flex flex-col gap-y-[16px]">
      {variant === "ios" ? (
        <div className="relative flex aspect-[3/5] items-center justify-center overflow-hidden rounded-[28px] bg-[var(--card)]">
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
export function BareScreenCard({ variant, screen }: { variant: "ios" | "web"; screen?: RealScreen }) {
  const aspect = variant === "ios" ? "aspect-[9/19]" : "aspect-[16/10]";
  const rounded = variant === "ios" ? "rounded-[28px]" : "rounded-[16px]";
  return (
    <div className="group/cell flex flex-col gap-y-[12px]">
      <a
        href={screen?.href ?? "#"}
        target={screen ? "_blank" : undefined}
        rel={screen ? "noreferrer" : undefined}
        className={`block overflow-hidden ${aspect} ${rounded} bg-[var(--card)] shadow-[inset_0px_0px_0px_0.5px_var(--border-strong)] transition-colors duration-300 group-hover/cell:bg-[var(--card-hover)]`}
      >
        {screen && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={screen.src} alt={`${screen.app} screenshot`} loading="lazy" className="h-full w-full object-cover object-top" />
        )}
      </a>
      {screen ? <CompactLabel label={screen.app} color={screen.logoColor} /> : <CompactLabel />}
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

const categoryGridCols = (variant: "ios" | "web") =>
  variant === "ios"
    ? "grid-cols-1 min-[720px]:grid-cols-4"
    : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";

function CategorySection({
  name,
  variant,
  href,
  screens = [],
  sites = false,
}: {
  name: string;
  variant: "ios" | "web";
  href?: string;
  screens?: RealScreen[];
  sites?: boolean;
}) {
  const count = variant === "ios" ? 4 : 3;
  return (
    <div className="group/section flex flex-col gap-y-[20px] min-[720px]:gap-y-[24px]">
      <SectionHeader name={name} href={href} />
      <div className={`grid gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] ${categoryGridCols(variant)}`}>
        {Array.from({ length: count }).map((_, i) =>
          screens[i] ? (
            <RealAppCard key={`r-${screens[i].app}`} screen={screens[i]} variant={variant} sites={sites} />
          ) : (
            <PlaceholderCard key={i} variant={variant} />
          ),
        )}
      </div>
    </div>
  );
}

function CategorySectionSkeleton({ variant }: { variant: "ios" | "web" }) {
  const count = variant === "ios" ? 4 : 3;
  const aspect = variant === "ios" ? "aspect-[3/5]" : "aspect-square";
  return (
    <div className="flex flex-col gap-y-[20px] min-[720px]:gap-y-[24px]">
      <div className="h-[28px] w-[160px] animate-pulse rounded-[6px] bg-[var(--card)]" />
      <div className={`grid gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] ${categoryGridCols(variant)}`}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} aspect={aspect} />
        ))}
      </div>
    </div>
  );
}

function ScreenSection({
  name,
  variant,
  href,
  screens = [],
}: {
  name: string;
  variant: "ios" | "web";
  href?: string;
  screens?: RealScreen[];
}) {
  const count = variant === "ios" ? 5 : 3;
  const cols =
    variant === "ios"
      ? "grid-cols-2 min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5"
      : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
  return (
    <div className="group/section flex flex-col gap-y-[20px]">
      <SectionHeader name={name} href={href} />
      <div className={`grid gap-x-[16px] gap-y-[28px] ${cols}`}>
        {Array.from({ length: count }).map((_, i) =>
          screens[i] ? (
            <BareScreenCard key={`r-${screens[i].app}`} variant={variant} screen={screens[i]} />
          ) : (
            <BareScreenCard key={i} variant={variant} />
          ),
        )}
      </div>
    </div>
  );
}

function ScreenSectionSkeleton({ variant }: { variant: "ios" | "web" }) {
  const count = variant === "ios" ? 5 : 3;
  const cols =
    variant === "ios"
      ? "grid-cols-2 min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5"
      : "grid-cols-1 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
  return (
    <div className="flex flex-col gap-y-[20px]">
      <div className="h-[24px] w-[140px] animate-pulse rounded-[6px] bg-[var(--card)]" />
      <div className={`grid gap-x-[16px] gap-y-[28px] ${cols}`}>
        {Array.from({ length: count }).map((_, i) => (
          <BareSkeletonCard key={i} variant={variant} />
        ))}
      </div>
    </div>
  );
}

/* ── Section header (with hover arrow) ── */

function SectionArrow() {
  return (
    <svg
      className="shrink-0 text-[var(--muted-strong)] opacity-0 transition-opacity duration-150 group-hover/section:opacity-100"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeader({ name, small, href }: { name: string; small?: boolean; href?: string }) {
  const inner = (
    <>
      <h2
        className={
          small
            ? "text-[16px] font-semibold leading-[24px] tracking-[0.144px] text-[var(--foreground)]"
            : "text-[20px] font-[652] leading-[28px] text-[var(--foreground)]"
        }
      >
        {name}
      </h2>
      <SectionArrow />
    </>
  );
  return href ? (
    <Link href={href} className="flex w-fit items-center gap-x-[8px]">
      {inner}
    </Link>
  ) : (
    <div className="flex items-center gap-x-[8px]">{inner}</div>
  );
}

/* ── Flows ── */

const FLOW_WIDTH = {
  ios: "w-[200px] min-[1024px]:w-[260px]",
  web: "w-[320px] min-[1024px]:w-[420px]",
};

function FlowScreen({ variant, kind }: { variant: "ios" | "web"; kind: "video" | "empty" }) {
  const aspect = variant === "ios" ? "aspect-[9/19]" : "aspect-[16/10]";
  const rounded = variant === "ios" ? "rounded-[20px]" : "rounded-[14px]";
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${FLOW_WIDTH[variant]} ${aspect} ${rounded} ${
        kind === "video" ? "bg-[var(--card-hover)]" : "bg-[var(--card)]"
      }`}
    >
      {kind === "video" && (
        <>
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.12)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3.5L14 9L5 14.5V3.5Z" fill="#141414" />
            </svg>
          </div>
          <span className="absolute bottom-[12px] right-[12px] rounded-[6px] bg-white px-[6px] py-[2px] text-[12px] font-semibold leading-[16px] text-[#141414]">
            01:11
          </span>
        </>
      )}
    </div>
  );
}

function FlowMoreButton() {
  return (
    <button
      aria-label="See more"
      className="absolute right-0 top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--foreground)] shadow-[0px_2px_8px_rgba(0,0,0,0.10)] transition-colors hover:bg-[var(--fill-hover)]"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function FlowLabel() {
  return (
    <div className="flex flex-col gap-y-[2px]">
      <div className="flex items-center gap-x-[6px] text-[16px] leading-[24px]">
        <span className="font-semibold text-[var(--foreground)]">Flow</span>
        <span className="text-[var(--muted-strong)]">in</span>
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-[28%] bg-[var(--surface)]">
          <LoaderDots size={11} />
        </span>
        <span className="font-semibold text-[var(--foreground)]">App</span>
      </div>
      <span className="text-[14px] leading-[20px] text-[var(--muted-strong)]">15 screens</span>
    </div>
  );
}

export function FlowCard({ variant }: { variant: "ios" | "web" }) {
  const count = variant === "ios" ? 8 : 5;
  return (
    <div className="flex flex-col gap-y-[16px]">
      <div className="relative">
        <div className="flex gap-x-[16px] overflow-x-auto scrollbar-none pr-[64px]">
          {Array.from({ length: count }).map((_, i) => (
            <FlowScreen key={i} variant={variant} kind={i === 0 ? "video" : "empty"} />
          ))}
        </div>
        <FlowMoreButton />
      </div>
      <FlowLabel />
    </div>
  );
}

function FlowSection({ name, variant, href }: { name: string; variant: "ios" | "web"; href?: string }) {
  return (
    <div className="group/section flex flex-col gap-y-[24px]">
      <SectionHeader name={name} href={href} />
      <div className="flex flex-col gap-y-[32px]">
        <FlowCard variant={variant} />
        <FlowCard variant={variant} />
      </div>
    </div>
  );
}

function FlowSectionSkeleton({ variant }: { variant: "ios" | "web" }) {
  const count = variant === "ios" ? 8 : 5;
  const aspect = variant === "ios" ? "aspect-[9/19]" : "aspect-[16/10]";
  const rounded = variant === "ios" ? "rounded-[20px]" : "rounded-[14px]";
  return (
    <div className="flex flex-col gap-y-[24px]">
      <div className="h-[28px] w-[180px] animate-pulse rounded-[6px] bg-[var(--card)]" />
      <div className="flex flex-col gap-y-[32px]">
        {[0, 1].map((r) => (
          <div key={r} className="flex flex-col gap-y-[16px]">
            <div className="flex gap-x-[16px] overflow-hidden">
              {Array.from({ length: count }).map((_, i) => (
                <div
                  key={i}
                  className={`shrink-0 ${FLOW_WIDTH[variant]} ${aspect} ${rounded} animate-pulse bg-[var(--card)]`}
                />
              ))}
            </div>
            <div className="h-[16px] w-[160px] animate-pulse rounded-[4px] bg-[var(--card)]" />
          </div>
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
    const cats = variant === "ios" ? CATEGORIES : reorderForWeb(CATEGORIES);
    return (
      <div className="pb-[24px]">
        <div className="flex flex-col gap-y-[80px]">
          {loading
            ? [0, 1].map((s) => <CategorySectionSkeleton key={s} variant={variant} />)
            : cats.map((c, i) => (
                <CategorySection
                  key={c}
                  name={c}
                  variant={variant}
                  href={searchHref(experience, platform, "Categories", c)}
                  screens={i === 0 ? (variant === "ios" ? iosAppScreens : webAppScreens) : undefined}
                />
              ))}
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
        <div className="flex flex-col gap-y-[80px]">
          {loading
            ? [0, 1].map((s) => <ScreenSectionSkeleton key={s} variant={variant} />)
            : sections.map((s, i) => (
                <ScreenSection
                  key={s}
                  name={s}
                  variant={variant}
                  href={searchHref(experience, platform, filter, s)}
                  screens={i === 0 ? (variant === "ios" ? iosAppScreens : webAppScreens) : undefined}
                />
              ))}
        </div>
        <PaginationDots />
      </div>
    );
  }

  // Flow sections (Apps + Flows filter).
  if (experience === "Apps" && filter === "Flows") {
    const types = variant === "ios" ? FLOW_TYPES : reorderForWeb(FLOW_TYPES);
    return (
      <div className="pb-[24px]">
        <div className="flex flex-col gap-y-[80px]">
          {loading
            ? [0, 1].map((s) => <FlowSectionSkeleton key={s} variant={variant} />)
            : types.map((t) => (
                <FlowSection key={t} name={t} variant={variant} href={searchHref(experience, platform, "Flows", t)} />
              ))}
        </div>
        <PaginationDots />
      </div>
    );
  }

  // Sites — category-grouped sections with site cards.
  if (experience === "Sites" && filter === "Categories") {
    return (
      <div className="pb-[24px]">
        <div className="flex flex-col gap-y-[80px]">
          {loading
            ? [0, 1].map((s) => <CategorySectionSkeleton key={s} variant="web" />)
            : CATEGORIES.map((c, i) => (
                <CategorySection
                  key={c}
                  name={c}
                  variant="web"
                  href={searchHref(experience, platform, "Categories", c)}
                  screens={i === 0 ? siteScreens : undefined}
                  sites
                />
              ))}
        </div>
        <PaginationDots />
      </div>
    );
  }

  // Sites — bare-screen sections for Sections / Styles.
  if (experience === "Sites" && (filter === "Sections" || filter === "Styles")) {
    const base = filter === "Sections" ? SITE_SECTION_TYPES : SITE_STYLE_TYPES;
    return (
      <div className="pb-[24px]">
        <div className="flex flex-col gap-y-[80px]">
          {loading
            ? [0, 1].map((s) => <ScreenSectionSkeleton key={s} variant="web" />)
            : base.map((s, i) => (
                <ScreenSection
                  key={s}
                  name={s}
                  variant="web"
                  href={searchHref(experience, platform, filter, s)}
                  screens={i === 0 ? siteScreens : undefined}
                />
              ))}
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
        <div className="grid grid-cols-1 content-start gap-x-[12px] gap-y-[20px] min-[720px]:grid-cols-4 min-[720px]:gap-x-[16px] min-[720px]:gap-y-[48px]">
          {loading
            ? iosApps.map((_, i) => <SkeletonCard key={i} aspect="aspect-[3/5]" />)
            : [
                ...iosAppScreens.slice(0, 4).map((s) => <MobileCard key={`r-${s.app}`} screen={s} />),
                ...iosApps.map((app) => <MobileCard key={app.name} app={app} />),
              ]}
        </div>
      ) : (
        <div
          className="grid content-start gap-x-[12px] gap-y-[20px] min-[720px]:gap-x-[16px] min-[720px]:gap-y-[48px]"
          style={wideGridStyle}
        >
          {mode === "sites"
            ? loading
              ? sites.map((_, i) => <SkeletonCard key={i} aspect="aspect-square" />)
              : [
                  ...siteScreens.slice(0, 3).map((s) => <SiteCard key={`r-${s.app}`} screen={s} />),
                  ...sites.map((site) => <SiteCard key={site.name} site={site} />),
                ]
            : loading
              ? webApps.map((_, i) => <SkeletonCard key={i} aspect="aspect-square" />)
              : [
                  ...webAppScreens.slice(0, 3).map((s) => <WebCard key={`r-${s.app}`} screen={s} />),
                  ...webApps.map((app) => <WebCard key={app.name} app={app} />),
                ]}
        </div>
      )}

      <PaginationDots />
    </div>
  );
}
