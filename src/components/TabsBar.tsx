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
  sort: string;
  onSortChange: (value: string) => void;
}

const FILTERS: Record<Experience, string[]> = {
  Apps: ["Trending", "Categories", "Screens", "UI Elements", "Flows"],
  Sites: ["Trending", "Categories", "Sections", "Styles"],
};

const SORTS: Record<Experience, string[]> = {
  Apps: ["Latest", "Most popular", "Top Rated"],
  Sites: ["Latest", "Most popular"],
};

function Column({
  title,
  items,
  value,
  onChange,
  className,
}: {
  title: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-y-[8px] ${className ?? ""}`}>
      <h3 className="text-[14px] font-[456] leading-[20px] tracking-[0.196px] text-[var(--muted-strong)]">
        {title}
      </h3>
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
        className={experience === "Sites" ? "min-[1024px]:col-span-2" : ""}
      />

      <Column
        title="Sort"
        items={SORTS[experience]}
        value={sort}
        onChange={onSortChange}
      />
    </div>
  );
}
