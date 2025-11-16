// File: apps/web/src/components/language-switcher.tsx
"use client";

import * as React from "react";
import { useMemo, useState, useEffect } from "react";
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
  offsetY?: number;      // 額外往下距離（rem），會加在 Nav 高度之後
  offsetRight?: number;
  /** fixed = 固定在視窗；static = 相對父層絕對定位（可保留選項） */
  behavior?: "fixed" | "static";
  className?: string;
};

// 導覽列高度 72px → 約 4.5rem
const NAV_HEIGHT_REM = 72 / 16; // 4.5

export default function LanguageSwitcher({
  current,
  offsetY = 0.3,          // 微調用，主要高度來自 NAV_HEIGHT_REM
  offsetRight = 0.75,
  behavior = "fixed",     // ✅ 全站統一固定在右上（但用捲動隱藏）
  className = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1) 目前路徑（用來判斷要不要藏起來）
  const isCnInvestmentRoute =
    pathname === "/cn-investment" || pathname?.startsWith("/cn-investment/");

  // 2) 捲動位置：用來控制「捲動一段距離後就隱藏」
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      // 只要知道大概高度，不需要很精準
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll(); // 初始化
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 捲動超過 80px 就隱藏語言列
  const scrolledPastTop = scrollY > 80;

  const BRAND_BLUE_RGB = "28,61,90"; // #1C3D5A
  const OP = { border: 0.30, active: 0.08, divider: 0.22, text: 0.98, dot: 0.95 };

  const [hoverKey, setHoverKey] = useState<Lang | null>(null);

  const rawUrlLang = searchParams?.get("lang");
  const activeLang = normalizeLang(rawUrlLang ?? current);

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

  // ✅ 先加上 Nav 高度，再加 offsetY
  const topRem = NAV_HEIGHT_REM + offsetY;

  const positionStyle: React.CSSProperties =
    behavior === "fixed"
      ? { position: "fixed", top: `${topRem}rem`, right: `${offsetRight}rem` }
      : { position: "absolute", top: `${topRem}rem`, right: `${offsetRight}rem` };

  // ✅ 這裡才決定要不要整個不 render（所有 hooks 都已經跑完，React 不會抱怨）
  const shouldHide = isCnInvestmentRoute || scrolledPastTop;
  if (shouldHide) {
    return null;
  }

  return (
    <>
      <div
        data-lang-switcher="true"
        className={[
          "z-[80] inline-flex flex-col overflow-hidden rounded-xl backdrop-blur-md shadow-lg select-none",
          className,
        ].join(" ")}
        style={{
          ...positionStyle,
          width: "max-content",
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
            ? "rgba(255,255,255,0.25)"
            : `rgba(${BRAND_BLUE_RGB},${OP.divider})`;

          return (
            <button
              key={it.key}
              type="button"
              onClick={() => setLang(it.key)}
              onMouseEnter={() => setHoverKey(it.key)}
              onMouseLeave={() => setHoverKey(null)}
              onFocus={() => setHoverKey(it.key)}
              onBlur={() => setHoverKey(null)}
              aria-pressed={active}
              className="relative flex items-center gap-2 px-3 py-2 text-[13px] outline-none transition-colors duration-150"
              style={{ backgroundColor: btnBg, color: btnColor }}
            >
              <span className="truncate">{it.label}</span>
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full flex-shrink-0"
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

      {/* 手機版開啟側邊選單時隱藏語言切換（一般 <style> 寫法，避免 TS 抱怨 jsx/global） */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 767.98px) {
            html[data-mobile-nav="open"] [data-lang-switcher="true"] {
              display: none !important;
            }
          }
        `,
        }}
      />
    </>
  );
}
