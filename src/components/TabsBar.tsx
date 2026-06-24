"use client";

type Experience = "Apps" | "Sites";
type Platform = "iOS" | "Web";

interface TabsBarProps {
  experience: Experience;
  onExperienceChange: (value: Experience) => void;
  platform: Platform;
  onPlatformChange: (value: Platform) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  onFilterHeaderClick?: () => void;
  sort: string;
  onSortChange: (value: string) => void;
}

function HeaderArrow() {
  return (
    <svg
      className="shrink-0 text-[var(--muted-strong)] opacity-0 transition-opacity duration-150 group-hover/header:opacity-100"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FILTERS: Record<Experience, string[]> = {
  Apps: ["Trending", "Categories", "Screens", "UI Elements", "Flows"],
  Sites: ["Trending", "Categories", "Sections", "Styles"],
};

// Filters whose results are ranked rather than dated.
const SECTIONED_FILTERS = ["Screens", "UI Elements", "Flows", "Sections", "Styles"];

export function sortOptionsFor(experience: Experience, filter: string): string[] {
  if (SECTIONED_FILTERS.includes(filter)) return ["Trending", "Most popular"];
  return experience === "Sites"
    ? ["Latest", "Most popular"]
    : ["Latest", "Most popular", "Top Rated"];
}

function Column({
  title,
  items,
  value,
  onChange,
  className,
  onHeaderClick,
}: {
  title: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onHeaderClick?: () => void;
}) {
  const headingClass =
    "text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[var(--muted-strong)]";
  return (
    <div className={`flex flex-col gap-y-[8px] ${className ?? ""}`}>
      {onHeaderClick ? (
        <button
          onClick={onHeaderClick}
          className="group/header flex w-fit items-center gap-x-[6px]"
        >
          <h3 className={headingClass}>{title}</h3>
          <HeaderArrow />
        </button>
      ) : (
        <h3 className={headingClass}>{title}</h3>
      )}
      <ul className="flex flex-col">
        {items.map((item) => {
          const active = value === item;
          return (
            <li key={item}>
              <button
                onClick={() => onChange(item)}
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
  );
}

export default function TabsBar({
  experience,
  onExperienceChange,
  platform,
  onPlatformChange,
  filter,
  onFilterChange,
  onFilterHeaderClick,
  sort,
  onSortChange,
}: TabsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-x-[24px] gap-y-[28px] min-[1024px]:grid-cols-4 min-[1024px]:gap-x-[40px]">
      <Column
        title="Experience"
        items={["Apps", "Sites"]}
        value={experience}
        onChange={(v) => onExperienceChange(v as Experience)}
      />

      {experience === "Apps" && (
        <Column
          title="Platform"
          items={["iOS", "Web"]}
          value={platform}
          onChange={(v) => onPlatformChange(v as Platform)}
        />
      )}

      <Column
        title="Filter"
        items={FILTERS[experience]}
        value={filter}
        onChange={onFilterChange}
        onHeaderClick={onFilterHeaderClick}
        className={experience === "Sites" ? "min-[1024px]:col-span-2" : ""}
      />

      <Column
        title="Sort"
        items={sortOptionsFor(experience, filter)}
        value={sort}
        onChange={onSortChange}
      />
    </div>
  );
}
