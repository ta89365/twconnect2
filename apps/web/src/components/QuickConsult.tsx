"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Lang = "jp" | "zh" | "en";

type Props = {
  offsetY?: number;        // top-right: 距頂；bottom-right: 距底
  offsetRight?: number;    // 距右
  targetId?: string;
  lang?: Lang;
  anchorSelector?: string | null;
  followAnchor?: boolean;
  position?: "top-right" | "bottom-right";
  topAdjustRem?: number;
  rightAdjustRem?: number;
  matchAnchorWidth?: boolean;
  widthAdjustRem?: number;
  hideAtRatio?: number;
  showAtRatio?: number;
};

const BRAND_BLUE_RGB = "28,61,90"; // #1C3D5A
const OP = { border: 0.28, text: 0.98, shadow: 0.18 };

function normalizeLang(input?: string | null): Lang {
  const k = String(input ?? "").trim().toLowerCase();
  if (["zh-cn", "zh_cn", "zh-hans", "hans", "cn"].includes(k)) return "zh";
  if (["zh", "zh-hant", "zh_tw", "zh-tw", "tw", "hant"].includes(k)) return "zh";
  if (["en", "en-us", "en_us"].includes(k)) return "en";
  if (["jp", "ja", "ja-jp"].includes(k)) return "jp";
  return "jp";
}

export default function QuickConsult({
  offsetY = 1,           // 右下角預設貼底 1rem
  offsetRight = 0.9,     // 距右 0.9rem
  targetId = "contact",
  lang,
  anchorSelector = '[data-lang-switcher="true"]',
  followAnchor = false,
  position = "bottom-right",
  topAdjustRem = 0,
  rightAdjustRem = 0,
  matchAnchorWidth = false,
  widthAdjustRem = 0,
  hideAtRatio = 0.85,
  showAtRatio = 0.55,
}: Props) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const activeLang = (lang ?? normalizeLang(sp?.get("lang"))) as Lang;

  const isHome = pathname === "/" || pathname === "";
  const langQuery = activeLang ? `?lang=${activeLang}` : "";
  const contactHref = `/contact${langQuery}`;

  const label = useMemo(
    () => ({ jp: "今すぐ相談", zh: "立刻諮詢", en: "Consult Now" }[activeLang]),
    [activeLang]
  );

  const backToTopLabel = useMemo(
    () => ({ jp: "トップへ", zh: "回到頂端", en: "Back to top" }[activeLang]),
    [activeLang]
  );

  const [hovered, setHovered] = useState(false);
  const [topHovered, setTopHovered] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 根據 position 決定貼邊距離
  const effectiveOffsetY = position === "bottom-right" ? offsetY : Math.max(offsetY, 1);

  const initialPinned = {
    topRem: effectiveOffsetY + topAdjustRem,
    rightRem: offsetRight + rightAdjustRem,
    widthRem: undefined as number | undefined,
  };

  const [pinned, setPinned] = useState<{ topRem: number; rightRem: number; widthRem?: number }>(initialPinned);
  const [hiddenNearTarget, setHiddenNearTarget] = useState(false);
  const anchorElRef = useRef<HTMLElement | null>(null);

  const bg = hovered ? `rgba(${BRAND_BLUE_RGB},1)` : "rgba(255,255,255,1)";
  const color = hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},${OP.text})`;
  const border = hovered ? `1px solid rgba(${BRAND_BLUE_RGB},1)` : `1px solid rgba(${BRAND_BLUE_RGB},${OP.border})`;
  const shadow = hovered
    ? `0 12px 24px rgba(${BRAND_BLUE_RGB}, ${OP.shadow})`
    : `0 8px 18px rgba(${BRAND_BLUE_RGB}, ${OP.shadow})`;

  const topBg = topHovered ? `rgba(${BRAND_BLUE_RGB},1)` : "rgba(255,255,255,1)";
  const topColor = topHovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},${OP.text})`;
  const topBorder = topHovered ? `1px solid rgba(${BRAND_BLUE_RGB},1)` : `1px solid rgba(${BRAND_BLUE_RGB},${OP.border})`;
  const topShadow = topHovered
    ? `0 12px 24px rgba(${BRAND_BLUE_RGB}, ${OP.shadow})`
    : `0 8px 18px rgba(${BRAND_BLUE_RGB}, ${OP.shadow})`;

  // 避免在表單中段忽隱忽現
  useEffect(() => {
    if (!isHome) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    let cooldown = false;
    const COOLDOWN_MS = 120;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const ratio = e?.intersectionRatio ?? 0;

        if (cooldown) return;

        if (!hiddenNearTarget && ratio >= hideAtRatio) {
          setHiddenNearTarget(true);
          cooldown = true;
          setTimeout(() => (cooldown = false), COOLDOWN_MS);
          return;
        }
        if (hiddenNearTarget && ratio <= showAtRatio) {
          setHiddenNearTarget(false);
          cooldown = true;
          setTimeout(() => (cooldown = false), COOLDOWN_MS);
          return;
        }
      },
      { root: null, rootMargin: "0px", threshold: [0, 0.25, 0.5, showAtRatio, 0.7, hideAtRatio, 1] }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [isHome, targetId, hideAtRatio, showAtRatio, hiddenNearTarget]);

  // 右上角模式才跟隨語言列
  useEffect(() => {
    if (position !== "top-right") {
      setPinned(initialPinned);
      return;
    }

    let el: HTMLElement | null = null;
    try {
      el = document.querySelector(anchorSelector || "") as HTMLElement | null;
    } catch {}
    anchorElRef.current = el;

    const GAP_PX = 8;
    function compute() {
      const baseFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      if (el) {
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        let rightPx = parseFloat(cs.right);
        if (!Number.isFinite(rightPx)) rightPx = window.innerWidth - rect.right;

        const rightRem = rightPx / baseFont + rightAdjustRem;
        const topRem = (rect.bottom + GAP_PX) / baseFont + topAdjustRem;
        const widthRem = matchAnchorWidth ? rect.width / baseFont + widthAdjustRem : undefined;

        setPinned({ topRem, rightRem, widthRem });
      } else {
        setPinned(initialPinned);
      }
    }

    compute();

    if (!followAnchor) return;
    const ro = el ? new ResizeObserver(() => compute()) : null;
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    ro?.observe(el!);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      ro?.disconnect();
    };
  }, [
    position,
    anchorSelector,
    followAnchor,
    rightAdjustRem,
    topAdjustRem,
    matchAnchorWidth,
    widthAdjustRem,
    initialPinned.topRem,
    initialPinned.rightRem,
  ]);

  // 捲動一定高度後才顯示「回到頂端」
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      setShowBackToTop(y > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onGo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = isHome
      ? document.getElementById(targetId) ||
        (document.querySelector('[data-contact-anchor="true"]') as HTMLElement | null)
      : null;

    if (isHome && el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onBackToTop = (e: any) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const href = isHome ? `#${targetId}` : contactHref;

  return (
    <div
      data-quick-consult="true"
      className={[
        "fixed z-[100] pointer-events-auto transition-all duration-200",
        hiddenNearTarget ? "opacity-0 translate-y-1 pointer-events-none" : "opacity-100 translate-y-0",
      ].join(" ")}
      style={{
        top: position === "top-right" ? `calc(${pinned.topRem}rem + env(safe-area-inset-top, 0px))` : "auto",
        bottom:
          position === "bottom-right"
            ? `calc(${pinned.topRem}rem + env(safe-area-inset-bottom, 0px))`
            : "auto",
        left: "auto",
        right: `calc(${pinned.rightRem}rem + env(safe-area-inset-right, 0px))`,
      }}
    >
      {/* 外層 inline-flex，兩顆按鈕共用同一個寬度容器 */}
      <div className="inline-flex flex-col items-stretch gap-2">
        {showBackToTop && (
          <button
            type="button"
            onClick={onBackToTop}
            onMouseEnter={() => setTopHovered(true)}
            onMouseLeave={() => setTopHovered(false)}
            onFocus={() => setTopHovered(true)}
            onBlur={() => setTopHovered(false)}
            aria-label={backToTopLabel}
            className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium select-none rounded-xl outline-none shadow-lg backdrop-blur-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(28,61,90,0.35)]"
            style={{
              backgroundColor: topBg,
              color: topColor,
              border: topBorder,
              boxShadow: topShadow,
            }}
          >
            <span className="truncate text-left">{backToTopLabel}</span>
            <span aria-hidden="true" className="ml-2 text-xs leading-none">
              ↑
            </span>
          </button>
        )}

        <a
          href={href}
          onClick={onGo}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={label}
          aria-controls={isHome ? targetId : undefined}
          role="button"
          className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium select-none rounded-xl outline-none shadow-lg backdrop-blur-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(28,61,90,0.35)]"
          style={{
            backgroundColor: bg,
            color,
            border,
            boxShadow: shadow,
          }}
        >
          <span className="truncate text-left">{label}</span>
          <span
            aria-hidden="true"
            className="ml-2 h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},0.9)` }}
          />
        </a>
      </div>
    </div>
  );
}
