"use client";

import { useEffect, useState } from "react";

// Example searches surfaced to help people discover the search experience.
const EXAMPLE_QUERIES = [
  "dashboard",
  "dark mode dashboard",
  "wise",
  "linear onboarding",
  "finance",
  "finance empty state",
];

const STORAGE_KEY = "queryHelperDismissed_v2";

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path d="M10 2l1.7 5L17 8.7l-5 1.6L10 16l-2-5.7L3 8.7l5.3-1.7L10 2z" fill="currentColor" />
    </svg>
  );
}

export default function QueryHelper({ onQueryClick }: { onQueryClick: (q: string) => void }) {
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);

  // Respect a prior dismissal; otherwise reveal with a small entrance animation.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    setDismissed(false);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const close = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setDismissed(true), 200);
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed right-[16px] top-[120px] z-40 hidden w-[300px] flex-col gap-y-[12px] rounded-[20px] border border-[var(--border)] bg-[var(--overlay)] p-[16px] shadow-[0px_12px_48px_rgba(0,0,0,0.12)] backdrop-blur-[24px] transition-all duration-200 ease-out min-[768px]:flex min-[1024px]:right-[24px] min-[1160px]:top-[80px] ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-[8px] opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-x-[8px]">
        <div className="flex items-center gap-x-[6px] text-[var(--foreground)]">
          <SparkIcon />
          <span className="text-[14px] font-semibold leading-[20px]">Try a search</span>
        </div>
        <button
          onClick={close}
          aria-label="Dismiss"
          className="flex size-[24px] shrink-0 items-center justify-center rounded-full text-[var(--muted-strong)] transition-colors hover:bg-[var(--fill)] hover:text-[var(--foreground)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => onQueryClick(q)}
            className="cursor-pointer rounded-full border border-[var(--border-strong)] px-[14px] py-[7px] text-[14px] font-medium leading-[20px] text-[var(--foreground)] transition-colors hover:bg-[var(--fill)]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
