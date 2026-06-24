"use client";

import { useState } from "react";

type GroupKey = "experience" | "platform" | "filter" | "sort";

const filterGroups: { key: GroupKey; title: string; items: string[] }[] = [
  { key: "experience", title: "Experience", items: ["Apps", "Sites"] },
  { key: "platform", title: "Platform", items: ["iOS", "Web"] },
  {
    key: "filter",
    title: "Filter",
    items: ["Trending", "Categories", "Screens", "UI Elements", "Flows"],
  },
  { key: "sort", title: "Sort", items: ["Latest", "Most popular", "Top Rated"] },
];

export default function TabsBar() {
  const [selected, setSelected] = useState<Record<GroupKey, string>>({
    experience: "Apps",
    platform: "iOS",
    filter: "Trending",
    sort: "Latest",
  });

  return (
    <div className="grid grid-cols-2 gap-x-[24px] gap-y-[28px] min-[1024px]:grid-cols-4 min-[1024px]:gap-x-[40px]">
      {filterGroups.map((group) => (
        <div key={group.key} className="flex flex-col gap-y-[8px]">
          <h3 className="text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[var(--muted-strong)]">
            {group.title}
          </h3>
          <ul className="flex flex-col">
            {group.items.map((item) => {
              const active = selected[group.key] === item;
              return (
                <li key={item}>
                  <button
                    onClick={() =>
                      setSelected((prev) => ({ ...prev, [group.key]: item }))
                    }
                    className={`text-left text-[24px] font-[652] leading-[30px] transition-colors duration-150 ${
                      active
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
