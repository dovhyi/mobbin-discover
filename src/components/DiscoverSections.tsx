"use client";

import Link from "next/link";
import {
  BareScreenCard,
  FlowCard,
  PlaceholderCard,
  RealAppCard,
} from "@/components/AppCardsGrid";
import { iosAppScreens, webAppScreens, siteScreens, type RealScreen } from "@/data/mobbinScreens";
import { srpHref } from "@/components/DiscoverGrid";

function Arrow() {
  return (
    <svg
      className="shrink-0 opacity-0 transition-all duration-150 group-hover/head:translate-x-[2px] group-hover/head:opacity-100"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Editorial heading + "{Type} in {Experience}" subheading, linking to the SRP.
function SectionHead({ heading, type, exp, href }: { heading: string; type: string; exp: string; href: string }) {
  return (
    <Link href={href} className="group/head flex w-fit flex-col gap-y-[2px]">
      <h2 className="text-[24px] font-[652] leading-[32px] tracking-[0.2px] text-[var(--foreground)]">{heading}</h2>
      <span className="flex items-center gap-x-[6px] text-[15px] font-[456] leading-[22px] text-[var(--muted-strong)]">
        <span>
          <span className="text-[var(--foreground)]">{type}</span> in {exp}
        </span>
        <Arrow />
      </span>
    </Link>
  );
}

function Section({ children, ...head }: { heading: string; type: string; exp: string; href: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-y-[20px] min-[720px]:gap-y-[24px]">
      <SectionHead {...head} />
      {children}
    </section>
  );
}

const appsWebCols = "grid grid-cols-1 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
const appsIosCols = "grid grid-cols-2 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-4";
const sitesCols = "grid grid-cols-1 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";
const screensIosCols = "grid grid-cols-2 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5";
const screensWebCols = "grid grid-cols-1 gap-x-[16px] gap-y-[28px] min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3";

function appCards(screens: RealScreen[], count: number, variant: "ios" | "web", sites = false) {
  return Array.from({ length: count }).map((_, i) =>
    screens[i] ? (
      <RealAppCard key={`r-${screens[i].app}`} screen={screens[i]} variant={variant} sites={sites} />
    ) : (
      <PlaceholderCard key={i} variant={variant} />
    ),
  );
}

function screenCards(screens: RealScreen[], count: number, variant: "ios" | "web") {
  return Array.from({ length: count }).map((_, i) =>
    screens[i] ? (
      <BareScreenCard key={`s-${screens[i].app}`} variant={variant} screen={screens[i]} />
    ) : (
      <BareScreenCard key={i} variant={variant} />
    ),
  );
}

// Curated editorial shelves — each pairs a headline with a filterable SRP link.
export default function DiscoverSections() {
  return (
    <div className="flex flex-col gap-y-[64px] pb-[64px]">
      <Section
        heading="How power tools stay calm"
        type="Developer Tools"
        exp="Web Apps"
        href={srpHref({ exp: "apps", platform: "Web", dim: "Categories", value: "Developer Tools" })}
      >
        <div className={appsWebCols}>{appCards(webAppScreens, 3, "web")}</div>
      </Section>

      <Section
        heading="Make money feel safe"
        type="Finance"
        exp="iOS Apps"
        href={srpHref({ exp: "apps", platform: "iOS", dim: "Categories", value: "Finance" })}
      >
        <div className={appsIosCols}>{appCards(iosAppScreens, 4, "ios")}</div>
      </Section>

      <Section
        heading="Pages built to sell"
        type="Shopping"
        exp="Sites"
        href={srpHref({ exp: "sites", dim: "Categories", value: "Shopping" })}
      >
        <div className={sitesCols}>{appCards(siteScreens, 3, "web", true)}</div>
      </Section>

      <Section
        heading="Beyond the chat bubble"
        type="Chat Bot"
        exp="iOS Apps"
        href={srpHref({ exp: "apps", platform: "iOS", dim: "Screens", value: "Chat Bot" })}
      >
        <div className={screensIosCols}>{screenCards(iosAppScreens, 5, "ios")}</div>
      </Section>

      <Section
        heading="Motion with a job to do"
        type="Animations"
        exp="Web Apps"
        href={srpHref({ exp: "apps", platform: "Web" })}
      >
        <div className={screensWebCols}>{screenCards(webAppScreens, 3, "web")}</div>
      </Section>

      <Section
        heading="How Cosmos earns fifteen screens"
        type="Onboarding"
        exp="iOS Apps"
        href={srpHref({ exp: "apps", platform: "iOS", dim: "Flows", value: "Onboarding" })}
      >
        <FlowCard variant="ios" />
      </Section>

      <Section
        heading="Raw type, real results"
        type="Brutalist Style"
        exp="Sites"
        href={srpHref({ exp: "sites", dim: "Styles", value: "Brutalist" })}
      >
        <div className={sitesCols}>{appCards(siteScreens, 3, "web", true)}</div>
      </Section>
    </div>
  );
}
