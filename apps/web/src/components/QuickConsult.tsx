"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Lang = "jp" | "zh" | "en";

type Props = {
  /** 與邊界的距離（rem）。top-right 表示距頂，bottom-right 表示距底。 */
  offsetY?: number;
  /** 與右邊距離（rem） */
  offsetRight?: number;
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
  // 注意：這裡的預設值只用作「上邊距」的情境。
  // 右下角時會在程式內把預設調成 1rem。
  offsetY = 8,
  offsetRight = 0.75,
  targetId = "contact",
  lang,
  anchorSelector = '[data-lang-switcher="true"]',
  followAnchor = false,
  position = "top-right",
  topAdjustRem = 0,
  rightAdjustRem = 0,
  matchAnchorWidth = true,
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

  const [hovered, setHovered] = useState(false);

  // 根據 position 決定貼邊距離的預設：右下角預設 1rem，比較符合「貼角落」預期
  const effectiveOffsetY = position === "bottom-right" ? 1 : offsetY;

  // 初始定位：topRem 代表「距離該邊的距離」（top-right=距頂，bottom-right=距底）
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

  // 使用遲滯避免靠近表單時忽隱忽現
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

  // 只在「右上角模式」才跟隨語言列
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
        let rightPx = parseFloat((cs as any).right);
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

  const href = isHome ? `#${targetId}` : contactHref;

  return (
    <div
      data-quick-consult="true"
      className={[
        "fixed z-[100] pointer-events-auto transition-all duration-200",
        hiddenNearTarget ? "opacity-0 translate-y-1 pointer-events-none" : "opacity-100 translate-y-0",
      ].join(" ")}
      style={{
        // 明確避免被其他樣式覆蓋：非當前定位方向一律給 auto
        top:
          position === "top-right"
            ? `calc(${pinned?.topRem ?? initialPinned.topRem}rem + env(safe-area-inset-top, 0px))`
            : "auto",
        bottom:
          position === "bottom-right"
            ? `calc(${pinned?.topRem ?? initialPinned.topRem}rem + env(safe-area-inset-bottom, 0px))`
            : "auto",
        left: "auto",
        right: `calc(${pinned?.rightRem ?? initialPinned.rightRem}rem + env(safe-area-inset-right, 0px))`,
      }}
    >
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
        className="flex items-center justify-between px-3 py-2 text-[13px] font-medium select-none rounded-xl outline-none shadow-lg backdrop-blur-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(28,61,90,0.35)]"
        style={{
          backgroundColor: bg,
          color,
          border,
          boxShadow: shadow,
          width: pinned?.widthRem ? `${pinned.widthRem}rem` : undefined,
        }}
      >
        <span className="truncate text-left">{label}</span>
        <span
          aria-hidden="true"
          className="ml-2 h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},0.9)` }}
        />
      </a>

      {/* 手機版覆寫：<= 768px */}
      <style jsx>{`
        @media (max-width: 768px) {
          [data-quick-consult="true"] {
            position: fixed !important;
            top: auto !important;
            left: auto !important;
            right: calc(env(safe-area-inset-right, 0px) + 12px) !important;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 16px) !important;
            z-index: 100 !important;
          }
          [data-quick-consult="true"] a {
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            padding: 0 !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
