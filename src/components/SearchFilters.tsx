"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DIMENSIONS,
  FILTER_DATA,
  SORTS,
  type Experience,
  type Filters,
  type Platform,
} from "@/lib/search";

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="-mr-[2px] opacity-70">
      <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto shrink-0">
      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Portal dropdown (anchored, not clipped by overflow) ── */
function Dropdown({
  open,
  anchorRef,
  onClose,
  width = 280,
  align = "left",
  children,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  width?: number;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const a = anchorRef.current;
      if (!a) return;
      const r = a.getBoundingClientRect();
      const rawLeft = align === "right" ? r.right - width : r.left;
      const left = Math.max(8, Math.min(rawLeft, window.innerWidth - width - 8));
      setPos({ top: r.bottom + 8, left });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, align, width, anchorRef]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose, anchorRef]);

  if (!open || !pos || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, width }}
      className="z-50 max-h-[360px] overflow-y-auto rounded-[16px] border border-[var(--border)] bg-[var(--overlay)] p-[8px] shadow-[0px_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-[24px]"
    >
      {children}
    </div>,
    document.body,
  );
}

/* ── Segmented control (iOS/Web) ── */
function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex h-[40px] shrink-0 items-center gap-[2px] rounded-full bg-[var(--fill)] p-[4px]">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex h-[32px] items-center rounded-full px-[14px] text-[15px] font-semibold transition-colors ${
            value === opt
              ? "bg-[var(--background)] text-[var(--foreground)] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="h-[24px] w-px shrink-0 bg-[var(--border)]" />;
}

/* ── Dimension dropdown chip ── */
function DimensionChip({
  experience,
  dimension,
  selected,
  onToggle,
  onClear,
}: {
  experience: Experience;
  dimension: string;
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const active = selected.length > 0;
  const groups = FILTER_DATA[experience][dimension] ?? [];

  const label =
    selected.length === 0
      ? dimension
      : selected.length === 1
        ? selected[0]
        : `${selected[0]} +${selected.length - 1}`;

  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[40px] items-center gap-x-[6px] rounded-full text-[15px] font-medium transition-colors ${
          active
            ? "bg-[var(--foreground)] pl-[16px] pr-[8px] font-semibold text-[var(--background)]"
            : "bg-[var(--fill)] px-[16px] text-[var(--muted-strong)] hover:bg-[var(--fill-hover)]"
        }`}
      >
        <span className="max-w-[200px] truncate">{label}</span>
        {active ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--background)]/20 transition-opacity hover:opacity-80"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <Chevron />
        )}
      </button>

      <Dropdown open={open} anchorRef={btnRef} onClose={() => setOpen(false)} width={280}>
        {groups.map((group, gi) => (
          <div key={gi} className="mb-[4px]">
            {group.name && (
              <div className="px-[12px] pb-[4px] pt-[8px] text-[13px] font-semibold text-[var(--muted)]">
                {group.name}
              </div>
            )}
            {group.items.map((item) => {
              const isOn = selected.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => onToggle(item)}
                  className={`flex w-full items-center gap-x-[8px] rounded-[10px] px-[12px] py-[8px] text-left text-[15px] transition-colors hover:bg-[var(--fill)] ${
                    isOn ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-strong)]"
                  }`}
                >
                  <span className="truncate">{item}</span>
                  {isOn && <Check />}
                </button>
              );
            })}
          </div>
        ))}
      </Dropdown>
    </div>
  );
}

/* ── Sort dropdown ── */
function SortDropdown({ sort, onChange }: { sort: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="flex h-[36px] items-center gap-x-[6px] rounded-full px-[10px] text-[15px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
      >
        {sort}
        <Chevron />
      </button>
      <Dropdown open={open} anchorRef={btnRef} onClose={() => setOpen(false)} width={180} align="right">
        {SORTS.map((s) => (
          <button
            key={s}
            onClick={() => {
              onChange(s);
              setOpen(false);
            }}
            className={`flex w-full items-center gap-x-[8px] rounded-[10px] px-[12px] py-[8px] text-left text-[15px] transition-colors hover:bg-[var(--fill)] ${
              s === sort ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-strong)]"
            }`}
          >
            <span>{s}</span>
            {s === sort && <Check />}
          </button>
        ))}
      </Dropdown>
    </div>
  );
}

function IconButton({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[var(--fill)] text-[var(--muted-strong)] transition-colors hover:bg-[var(--fill-hover)] hover:text-[var(--foreground)]"
    >
      {children}
    </button>
  );
}

interface SearchFiltersProps {
  experience: Experience;
  onExperienceChange: (e: Experience) => void;
  platform: Platform;
  onPlatformChange: (p: Platform) => void;
  filters: Filters;
  onToggleFilter: (dim: string, value: string) => void;
  onClearDim: (dim: string) => void;
  onReset: () => void;
  sort: string;
  onSortChange: (s: string) => void;
  count: number;
  countNoun: string;
}

export default function SearchFilters({
  experience,
  onExperienceChange,
  platform,
  onPlatformChange,
  filters,
  onToggleFilter,
  onClearDim,
  onReset,
  sort,
  onSortChange,
  count,
  countNoun,
}: SearchFiltersProps) {
  const hasActive = Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="flex items-center gap-x-[16px]">
      <div className="scrollbar-none flex min-w-0 grow items-center gap-x-[10px] overflow-x-auto">
        <div className="flex shrink-0 items-center gap-x-[4px]">
          {(["apps", "sites"] as Experience[]).map((opt) => {
            const on = experience === opt;
            return (
              <button
                key={opt}
                onClick={() => onExperienceChange(opt)}
                className={`h-[40px] rounded-full px-[18px] text-[15px] font-semibold transition-colors ${
                  on
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {opt === "apps" ? "Apps" : "Sites"}
              </button>
            );
          })}
        </div>

        <Divider />

        {experience === "apps" && (
          <>
            <Segmented
              options={["iOS", "Web"] as Platform[]}
              value={platform}
              onChange={onPlatformChange}
            />
            <Divider />
          </>
        )}

        {DIMENSIONS[experience].map((dim) => (
          <DimensionChip
            key={dim}
            experience={experience}
            dimension={dim}
            selected={filters[dim] ?? []}
            onToggle={(value) => onToggleFilter(dim, value)}
            onClear={() => onClearDim(dim)}
          />
        ))}

        {hasActive && (
          <IconButton label="Reset filters" onClick={onReset}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9a6 6 0 1 0 1.8-4.3M3 3v2.7h2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        )}
      </div>

      <div className="hidden shrink-0 items-center gap-x-[16px] min-[900px]:flex">
        <span className="text-right text-[13px] leading-[16px] text-[var(--muted-strong)]">
          Showing
          <br />
          {count.toLocaleString()} {countNoun}
        </span>
        <SortDropdown sort={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
