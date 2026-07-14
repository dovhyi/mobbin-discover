"use client";

import Link from "next/link";

// Builds a search-results URL with an optional preselected filter.
export function srpHref(opts: { exp: "apps" | "sites"; platform?: "iOS" | "Web"; dim?: string; value?: string }) {
  const p = new URLSearchParams();
  p.set("exp", opts.exp);
  if (opts.platform) p.set("platform", opts.platform);
  if (opts.dim && opts.value) p.set("f", `${opts.dim}:${opts.value}`);
  return `/search?${p.toString()}`;
}

interface Item {
  label: string;
  href: string;
}

// iOS is the default lens for the dimension links.
const dim = (name: string, values: string[]): Item[] =>
  values.map((value) => ({ label: value, href: srpHref({ exp: "apps", platform: "iOS", dim: name, value }) }));

const EXPERIENCE: Item[] = [
  { label: "Apps", href: srpHref({ exp: "apps", platform: "iOS" }) },
  { label: "Sites", href: srpHref({ exp: "sites" }) },
];

const PLATFORM: Item[] = [
  { label: "iOS", href: srpHref({ exp: "apps", platform: "iOS" }) },
  { label: "Web", href: srpHref({ exp: "apps", platform: "Web" }) },
];

const CATEGORIES = dim("Categories", ["Finance", "Food & Drink", "Travel", "Shopping", "Social", "Productivity"]);
const SCREENS = dim("Screens", ["Login", "Home", "Search", "Checkout", "Settings", "Chat Bot"]);
const UI_ELEMENTS = dim("UI Elements", ["Card", "Button", "Toast", "Banner", "Tab Bar", "Progress Indicator"]);
const FLOWS = dim("Flows", ["Logging In", "Onboarding", "Subscribing & Upgrading", "Transferring Money", "Setting Up", "Editing Profile"]);

function Column({ title, items, onNavigate }: { title: string; items: Item[]; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-y-[8px]">
      <h3 className="text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[var(--muted-strong)]">{title}</h3>
      <ul className="flex flex-col">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              onClick={onNavigate}
              className="block w-fit text-[24px] font-[652] leading-[34px] tracking-[0.2px] text-[var(--foreground)] transition-colors hover:text-[var(--muted)]"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The discovery grid: experience/platform plus the four content dimensions,
// every entry linking to a preselected search-results page.
export default function DiscoverGrid({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-[24px] gap-y-[40px] min-[720px]:grid-cols-3 min-[1024px]:grid-cols-5 min-[1024px]:gap-x-[40px]">
      <div className="flex flex-col gap-y-[36px]">
        <Column title="Experience" items={EXPERIENCE} onNavigate={onNavigate} />
        <Column title="Platform" items={PLATFORM} onNavigate={onNavigate} />
      </div>
      <Column title="Categories" items={CATEGORIES} onNavigate={onNavigate} />
      <Column title="Screens" items={SCREENS} onNavigate={onNavigate} />
      <Column title="UI Elements" items={UI_ELEMENTS} onNavigate={onNavigate} />
      <Column title="Flows" items={FLOWS} onNavigate={onNavigate} />
    </div>
  );
}
