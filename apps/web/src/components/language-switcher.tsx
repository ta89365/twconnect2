// apps/web/src/components/LanguageSwitcher.tsx
"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Lang = "zh" | "zh-cn" | "jp" | "en";

function normalizeLang(input?: string | null): Lang {
  const k = String(input ?? "").trim().toLowerCase();
  if (k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn") return "zh-cn";
  if (k === "zh" || k === "zh-hant" || k === "zh_tw" || k === "zh-tw" || k === "tw" || k === "hant") return "zh";
  if (k === "en" || k === "en-us" || k === "en_us") return "en";
  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";
  return "jp";
}

type Props = {
  current?: Lang;
  offsetY?: number;
  offsetRight?: number;
};

export default function LanguageSwitcher({
  current,
  offsetY = 5,
  offsetRight = 1.25,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const BRAND_BLUE_RGB = "28,61,90"; // #1C3D5A
  const OP = {
    border: 0.30,
    active: 0.08,   // 非 hover 時，當前語言微弱底色
    divider: 0.22,
    text: 0.98,
    dot: 0.95,
  };

  // 只讓被 hover 的那個按鈕變色
  const [hoverKey, setHoverKey] = useState<Lang | null>(null);

  const rawUrlLang = searchParams?.get("lang");
  const activeLang = normalizeLang(rawUrlLang ?? current);

  // ✅ 繁中顯示為「中文」
  const items = useMemo(
    () => [
      { key: "zh" as Lang, label: "中文" },
      { key: "jp" as Lang, label: "日本語" },
      { key: "en" as Lang, label: "English" },
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
      className="fixed z-[80] flex flex-col overflow-hidden rounded-xl backdrop-blur-md shadow-lg select-none"
      style={{
        top: `${offsetY}rem`,
        right: `${offsetRight}rem`,
        backgroundColor: "rgba(255,255,255,1)",
        border: `1px solid rgba(${BRAND_BLUE_RGB},${OP.border})`,
        color: `rgba(${BRAND_BLUE_RGB},${OP.text})`,
      }}
      role="group"
      aria-label="Language switcher"
    >
      {items.map((it, idx) => {
        const active = it.key === activeLang;
        const hovered = it.key === hoverKey;

        // hover 時完全品牌藍底、白字；非 hover 時維持原樣
        const btnBg = hovered
          ? `rgba(${BRAND_BLUE_RGB},1)`
          : active
          ? `rgba(${BRAND_BLUE_RGB},${OP.active})`
          : "transparent";

        const btnColor = hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},${OP.text})`;

        const dotBg = hovered
          ? "#FFFFFF"
          : active
          ? `rgba(${BRAND_BLUE_RGB},${OP.dot})`
          : "transparent";

        const dividerColor = hovered
          ? "rgba(255,255,255,0.25)" // 這條 divider 在藍底上淡一點
          : `rgba(${BRAND_BLUE_RGB},${OP.divider})`;

        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setLang(it.key)}
            onMouseEnter={() => setHoverKey(it.key)}
            onMouseLeave={() => setHoverKey(null)}
            onFocus={() => setHoverKey(it.key)}   // 鍵盤聚焦也套用相同效果
            onBlur={() => setHoverKey(null)}
            aria-pressed={active}
            className="relative flex items-center justify-between px-2.5 py-1.5 text-[13px] whitespace-nowrap outline-none min-w-[70px] transition-colors duration-150"
            style={{
              backgroundColor: btnBg,
              color: btnColor,
            }}
          >
            <span className="truncate">{it.label}</span>

            <span
              aria-hidden="true"
              className="ml-1 h-2 w-2 rounded-full"
              style={{ backgroundColor: dotBg }}
            />

            {idx !== items.length - 1 && (
              <span
                aria-hidden
                className="absolute left-0 right-0"
                style={{ bottom: -0.5, height: 1, backgroundColor: dividerColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
