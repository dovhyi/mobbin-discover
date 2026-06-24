"use client";

import { useState } from "react";
import Image from "next/image";
import SegmentedToggle from "@/components/SegmentedToggle";

const platformOptions = [
  { id: "iOS", label: "iOS" },
  { id: "Web", label: "Web" },
];
const sortTabs = ["Latest", "Most popular", "Top rated", "Animations"];

export default function TabsBar() {
  const [activePlatform, setActivePlatform] = useState("Web");
  const [activeSort, setActiveSort] = useState("Top rated");

  return (
    <div className="flex items-center justify-between">
      {/* Left side */}
      <div
        className="flex w-full items-center gap-x-[16px] min-[720px]:gap-x-[24px]"
      >
        {/* Platform toggle */}
        <SegmentedToggle
          options={platformOptions}
          value={activePlatform}
          onChange={setActivePlatform}
        />

        {/* Divider */}
        <div className="h-[20px] w-px shrink-0 bg-[rgba(255,255,255,0.08)]" />

        {/* Sort tabs — scrollable container */}
        <div className="scrollbar-none flex min-w-0 overflow-x-auto">
          <div className="flex gap-x-[24px]">
            {sortTabs.map((tab) => (
              <a
                key={tab}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSort(tab);
                }}
                className={`whitespace-nowrap py-[4px] text-[16px] font-semibold leading-[24px] tracking-[0.144px] transition-colors ${
                  activeSort === tab
                    ? "border-b-2 border-white text-white"
                    : "border-b-2 border-transparent text-[#707070] hover:text-white"
                }`}
              >
                {tab}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Filter — hidden on small mobile */}
      <div className="hidden min-[720px]:block">
        <button className="flex h-[36px] shrink-0 items-center rounded-full px-[12px] transition-colors hover:bg-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-center gap-[8px]">
            <Image
              src="/assets/filter-icon.svg"
              alt=""
              width={20}
              height={20}
            />
            <span className="text-[14px] font-semibold leading-[20px] tracking-[0.144px] text-white">
              Filter
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
