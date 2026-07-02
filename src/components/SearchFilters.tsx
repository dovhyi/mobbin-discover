"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FILTER_DATA,
  SORTS,
  visibleDimensions,
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
  dark = false,
  children,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  width?: number;
  align?: "left" | "right";
  dark?: boolean;
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
      className={`${dark ? "theme-dark " : ""}z-50 max-h-[360px] overflow-y-auto rounded-[20px] border border-[var(--border)] bg-[var(--overlay)] p-[8px] text-[var(--foreground)] shadow-[0px_12px_80px_rgba(0,0,0,0.16)] backdrop-blur-[24px]`}
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
    <div className="flex h-[40px] shrink-0 items-center overflow-hidden rounded-full bg-[var(--fill)]">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex h-full items-center rounded-full px-[14px] text-[16px] font-medium tracking-[0.2px] transition-colors ${
            value === opt
              ? "border-2 border-[var(--foreground)] bg-[var(--background)] text-[var(--foreground)] shadow-[0px_1px_1px_rgba(0,0,0,0.04)]"
              : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ── Experience dropdown (Apps/Sites) ── */
function ExperienceDropdown({ value, onChange }: { value: Experience; onChange: (e: Experience) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="flex h-[40px] items-center gap-x-[4px] rounded-full border-2 border-[var(--foreground)] pl-[14px] pr-[10px] text-[16px] font-medium tracking-[0.2px] text-[var(--foreground)]"
      >
        {value === "apps" ? "Apps" : "Sites"}
        <svg
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <Dropdown open={open} anchorRef={btnRef} onClose={() => setOpen(false)} width={220}>
        {(["apps", "sites"] as Experience[]).map((opt) => {
          const isOn = value === opt;
          return (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-x-[8px] rounded-[12px] px-[12px] py-[8px] text-left text-[16px] transition-colors hover:bg-[var(--fill)] ${
                isOn ? "font-medium text-[var(--foreground)]" : "text-[var(--muted-strong)]"
              }`}
            >
              <span className="flex-1">{opt === "apps" ? "Apps" : "Sites"}</span>
              {isOn && <Check />}
            </button>
          );
        })}
      </Dropdown>
    </div>
  );
}

function Divider() {
  return <div className="mx-[12px] h-[24px] w-px shrink-0 bg-[var(--border)]" />;
}

/* ── Dimension dropdown chip ── */
function DimensionChip({
  experience,
  dimension,
  selected,
  onToggle,
  onClear,
  dark = false,
}: {
  experience: Experience;
  dimension: string;
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const groups = FILTER_DATA[experience][dimension] ?? [];
  const active = selected.length > 0;

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  const ql = q.trim().toLowerCase();
  const filteredGroups = groups
    .map((g) => ({ name: g.name, items: g.items.filter((it) => it.toLowerCase().includes(ql)) }))
    .filter((g) => g.items.length > 0);

  const renderOption = (value: string) => {
    const on = selected.includes(value);
    return (
      <button
        key={value}
        onClick={() => onToggle(value)}
        className="flex w-full items-center gap-x-[10px] rounded-[10px] px-[12px] py-[8px] text-left text-[15px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--fill)]"
      >
        <span
          className={`flex size-[20px] shrink-0 items-center justify-center rounded-[6px] ${
            on ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--surface-hover)]"
          }`}
        >
          {on && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="truncate">{value}</span>
      </button>
    );
  };

  return (
    <div className="shrink-0">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[40px] items-center gap-x-[8px] rounded-full text-[15px] transition-colors ${
          active
            ? "border-2 border-[var(--foreground)] bg-[var(--background)] pl-[16px] pr-[8px] font-semibold text-[var(--foreground)]"
            : "border border-[var(--border)] px-[16px] font-medium text-[var(--muted-strong)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
        }`}
      >
        {selected.length === 0 ? (
          <>
            <span>{dimension}</span>
            <Chevron />
          </>
        ) : selected.length === 1 ? (
          <>
            <span className="max-w-[160px] truncate">{selected[0]}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={clearAll}
              className="flex size-[18px] items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </>
        ) : (
          <>
            <span>{dimension}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={clearAll}
              className="group/badge flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--foreground)] px-[5px] text-[11px] font-semibold text-[var(--background)]"
            >
              <span className="group-hover/badge:hidden">{selected.length}</span>
              <span className="hidden group-hover/badge:flex">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </>
        )}
      </button>

      <Dropdown open={open} anchorRef={btnRef} onClose={() => setOpen(false)} width={300} dark={dark}>
        <div className="mb-[4px] flex items-center gap-x-[8px] rounded-[10px] px-[12px] py-[8px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${dimension.toLowerCase()}`}
            className="grow bg-transparent text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
          />
        </div>
        {selected.length > 0 && (
          <>
            {selected.map((v) => renderOption(v))}
            <div className="my-[6px] h-px bg-[var(--border)]" />
          </>
        )}
        {filteredGroups.map((group, gi) => (
          <div key={gi}>
            {group.name && (
              <div className="px-[12px] pb-[4px] pt-[6px] text-[13px] font-semibold text-[var(--muted)]">
                {group.name}
              </div>
            )}
            {group.items.map((item) => renderOption(item))}
          </div>
        ))}
        {filteredGroups.length === 0 && selected.length === 0 && (
          <div className="px-[12px] py-[8px] text-[14px] text-[var(--muted)]">No matches</div>
        )}
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
  dimensionsOnly?: boolean;
  dark?: boolean;
}

function DimensionChips({
  experience,
  filters,
  onToggleFilter,
  onClearDim,
  onReset,
  dark = false,
}: Pick<SearchFiltersProps, "experience" | "filters" | "onToggleFilter" | "onClearDim" | "onReset"> & {
  dark?: boolean;
}) {
  const hasActive = Object.values(filters).some((v) => v.length > 0);
  return (
    <div className="scrollbar-none flex items-center gap-x-[10px] overflow-x-auto">
      {visibleDimensions(experience, filters).map((dim) => (
        <DimensionChip
          key={dim}
          experience={experience}
          dimension={dim}
          selected={filters[dim] ?? []}
          onToggle={(value) => onToggleFilter(dim, value)}
          onClear={() => onClearDim(dim)}
          dark={dark}
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
  );
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
  dimensionsOnly = false,
  dark = false,
}: SearchFiltersProps) {
  if (dimensionsOnly) {
    return (
      <DimensionChips
        experience={experience}
        filters={filters}
        onToggleFilter={onToggleFilter}
        onClearDim={onClearDim}
        onReset={onReset}
        dark={dark}
      />
    );
  }

  const hasActive = Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="flex items-center gap-x-[16px]">
      <div className="scrollbar-none flex min-w-0 grow items-center overflow-x-auto">
        <ExperienceDropdown value={experience} onChange={onExperienceChange} />

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

        <div className="flex items-center gap-x-[10px]">
          {visibleDimensions(experience, filters).map((dim) => (
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
