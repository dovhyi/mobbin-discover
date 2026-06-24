"use client";

import { useRef, useEffect, useState } from "react";

export interface SegmentedToggleOption {
  id: string;
  label: string;
}

interface SegmentedToggleProps {
  options: SegmentedToggleOption[];
  value: string;
  onChange: (id: string) => void;
  /** When true, clicking the active tab again deselects it (calls onChange with `defaultValue`). */
  allowDeselect?: boolean;
  /** The value to revert to when deselecting. Defaults to the first option. */
  defaultValue?: string;
}

export default function SegmentedToggle({
  options,
  value,
  onChange,
  allowDeselect = false,
  defaultValue,
}: SegmentedToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Measure the active button and position the indicator
  useEffect(() => {
    const btn = buttonRefs.current.get(value);
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [value, options]);

  const fallback = defaultValue ?? options[0]?.id;

  return (
    <div
      ref={containerRef}
      className="relative flex h-[36px] w-fit max-w-full items-center gap-[2px] rounded-full bg-[rgba(255,255,255,0.08)] p-[4px]"
    >
      {/* Sliding active background */}
      <div
        className="absolute top-[4px] h-[28px] rounded-full bg-[#141414] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)] transition-all duration-200"
        style={{ left: indicator.left, width: indicator.width }}
      />

      {options.map((option) => (
        <button
          key={option.id}
          ref={(el) => {
            if (el) buttonRefs.current.set(option.id, el);
          }}
          onClick={() => {
            if (allowDeselect && value === option.id) {
              onChange(fallback);
            } else {
              onChange(option.id);
            }
          }}
          className={`relative z-10 flex h-[28px] items-center justify-center rounded-full px-[10px] text-[14px] font-semibold leading-[20px] tracking-[0.196px] transition-colors duration-200 ${
            value === option.id ? "text-white" : "text-[#707070]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
