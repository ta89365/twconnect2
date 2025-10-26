"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Lang = "zh" | "jp" | "en";
type CC = "TW" | "JP" | "US";

function FlagSVG({ cc }: { cc: CC }) {
  if (cc === "JP") {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
        <rect width="16" height="12" fill="#fff" />
        <circle cx="8" cy="6" r="3.5" fill="#bc002d" />
      </svg>
    );
  }
  if (cc === "US") {
    return (
      <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
        <rect width="16" height="12" fill="#b22234" />
        <g fill="#fff">
          <rect y="2" width="16" height="1" />
          <rect y="4" width="16" height="1" />
          <rect y="6" width="16" height="1" />
          <rect y="8" width="16" height="1" />
          <rect y="10" width="16" height="1" />
        </g>
        <rect width="7" height="5" fill="#3c3b6e" />
      </svg>
    );
  }
  // TW
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
      <rect width="16" height="12" fill="#fe0000" />
      <rect width="7" height="5.5" fill="#000095" />
      <circle cx="3.5" cy="2.75" r="1.5" fill="#fff" />
    </svg>
  );
}

export default function LanguageSwitcher({
  current,
  offsetY = 5,
  offsetRight = 1.25,
}: {
  current: Lang;
  offsetY?: number; // rem
  offsetRight?: number; // rem
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const items = useMemo(
    () => [
      { key: "zh" as Lang, cc: "TW" as CC, label: "中文" },
      { key: "jp" as Lang, cc: "JP" as CC, label: "日本語" },
      { key: "en" as Lang, cc: "US" as CC, label: "English" },
    ],
    []
  );

  const setLang = (lang: Lang) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("lang", lang);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className="
        fixed z-[80] flex flex-col overflow-hidden
        rounded-2xl bg-white/15 backdrop-blur-md
        border border-white/30 shadow-lg
        text-[13px] text-white select-none
      "
      style={{ top: `${offsetY}rem`, right: `${offsetRight}rem` }}
      role="group"
      aria-label="Language switcher"
    >
      {items.map((it, idx) => {
        const active = it.key === current;
        return (
          <button
            key={it.key}
            onClick={() => setLang(it.key)}
            aria-pressed={active}
            className={[
              "flex items-center gap-3 px-3 py-2 w-40 text-left transition-colors outline-none",
              idx !== items.length - 1 ? "border-b border-white/25" : "",
              active
                ? "bg-white/30 font-semibold"
                : "hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60",
            ].join(" ")}
          >
            <span className="w-4 h-3.5 flex items-center justify-center">
              <FlagSVG cc={it.cc} />
            </span>
            <span className="w-6 text-[11px] uppercase opacity-80">{it.cc}</span>
            <span className="text-white">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
