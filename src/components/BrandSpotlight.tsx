"use client";

import type { Brand } from "@/data/brands";

// These surfaces are always dark (brand-tinted), regardless of page theme.
function bg(color: string) {
  return {
    backgroundImage: `linear-gradient(0deg, rgba(20,20,20,0.74), rgba(20,20,20,0.74)), linear-gradient(0deg, ${color}, ${color})`,
  };
}

function BrandLogo({ brand, size = 40 }: { brand: Brand; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[30%] text-[#141414]"
      style={{ width: size, height: size, backgroundColor: brand.color }}
    >
      <span className="text-[18px] font-bold leading-none">{brand.name[0]}</span>
    </div>
  );
}

function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M6 0.6l1.35 3.82L11.4 4.5 8.25 6.86 9.3 11.4 6 8.94 2.7 11.4l1.05-4.54L0.6 4.5l4.05-0.08L6 0.6Z" fill="currentColor" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-[2px] text-white">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} />
      ))}
    </div>
  );
}

function Rating({ brand }: { brand: Brand }) {
  return (
    <div className="flex items-center gap-[10px]">
      <Stars />
      <span className="text-[16px] font-medium leading-[22px] tracking-[0.2px] text-white">
        {brand.rating} ({brand.ratingCount})
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="truncate text-[14px] leading-[20px] tracking-[0.2px] text-white/60">{label}</span>
      <div className="text-[16px] font-medium leading-[22px] tracking-[0.2px] text-white">{children}</div>
    </div>
  );
}

function SaveButton() {
  return (
    <button className="flex shrink-0 items-center justify-center rounded-full bg-white/95 px-[16px] py-[11px] text-[16px] font-medium leading-[22px] tracking-[0.2px] text-[#141414] backdrop-blur-[24px] transition-colors hover:bg-white">
      Save
    </button>
  );
}

/* ── Horizontal banner — shown on screen / UI element / flow results ── */
export function BrandBanner({ brand }: { brand: Brand }) {
  return (
    <div
      className="theme-dark flex items-center gap-[16px] overflow-hidden rounded-[24px] border border-[rgba(237,237,237,0.08)] p-[16px] min-[720px]:gap-[24px]"
      style={bg(brand.color)}
    >
      <div className="flex min-w-0 flex-[1_1_0] items-center gap-[16px]">
        <BrandLogo brand={brand} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[16px] font-medium leading-[22px] tracking-[0.2px] text-white">
            {brand.name} —
          </span>
          <span className="truncate text-[16px] leading-[22px] tracking-[0.2px] text-white/70">
            {brand.description}
          </span>
        </div>
      </div>

      <div className="hidden flex-[1_1_0] items-start gap-[16px] min-[900px]:flex">
        <div className="flex min-w-0 flex-[1_1_0]">
          <Field label="Platform">{brand.platforms.join(", ")}</Field>
        </div>
        <div className="w-[150px] shrink-0">
          <Field label="Rating">
            <Rating brand={brand} />
          </Field>
        </div>
        <div className="w-[120px] shrink-0">
          <Field label="Category">{brand.category}</Field>
        </div>
      </div>

      <SaveButton />
    </div>
  );
}

/* ── Vertical card — shown on app (iOS / web) results ── */
export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className="theme-dark flex min-w-0 flex-col gap-[24px] self-start overflow-hidden rounded-[24px] p-[24px]"
      style={bg(brand.color)}
    >
      {/* Header */}
      <div className="flex w-full items-center gap-[12px]">
        <a
          href={brand.href}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 flex-[1_1_0] items-center gap-[8px]"
        >
          <BrandLogo brand={brand} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[16px] font-medium leading-[22px] tracking-[0.2px] text-white">
              {brand.name}
            </span>
            <span className="truncate text-[14px] leading-[20px] tracking-[0.2px] text-white/60">
              {brand.description}
            </span>
          </div>
        </a>
        <SaveButton />
      </div>

      {/* Rating + Category */}
      <div className="flex w-full items-center gap-[24px]">
        <div className="w-[150px] shrink-0">
          <Field label="Rating">
            <Rating brand={brand} />
          </Field>
        </div>
        <div className="w-[120px] shrink-0">
          <Field label="Category">{brand.category}</Field>
        </div>
      </div>

      {/* Screenshot strip (bleeds to the right edge, scrolls) */}
      <div className="scrollbar-none -mr-[24px] flex min-w-0 gap-[12px] overflow-x-auto pr-[24px]">
        {brand.screens.map((src, i) => (
          <div
            key={i}
            className="aspect-[1180/2676] h-[260px] shrink-0 overflow-hidden rounded-[16px] border-[0.5px] border-[rgba(255,255,255,0.12)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${brand.name} screenshot`} loading="lazy" className="h-full w-full object-cover object-top" />
          </div>
        ))}
      </div>

      {/* Platforms */}
      <div className="flex w-full flex-col">
        <span className="text-[14px] leading-[20px] tracking-[0.2px] text-white/60">Platforms</span>
        <p className="text-[16px] font-medium leading-[22px] tracking-[0.2px]">
          <span className="text-white">{brand.platforms[0]}</span>
          {brand.platforms.length > 1 && (
            <span className="text-white/60">, {brand.platforms.slice(1).join(", ")}</span>
          )}
        </p>
      </div>
    </div>
  );
}
