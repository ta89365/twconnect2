"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Lang = "jp" | "zh" | "en";

type Props = {
  offsetY?: number;
  offsetRight?: number;
  targetId?: string;
  lang?: Lang;
  anchorSelector?: string | null;
  followAnchor?: boolean;
  position?: "top-right" | "bottom-right";
  topAdjustRem?: number;       // 額外上移或下移
  rightAdjustRem?: number;
  matchAnchorWidth?: boolean;  // 是否同步語言列寬度
  widthAdjustRem?: number;     // 微調寬度
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
}: Props) {
  const sp = useSearchParams();
  const activeLang = (lang ?? normalizeLang(sp?.get("lang"))) as Lang;

  const label = useMemo(
    () => ({ jp: "今すぐ相談", zh: "立刻諮詢", en: "Consult Now" }[activeLang]),
    [activeLang]
  );

  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState<{ topRem: number; rightRem: number; widthRem?: number } | null>(null);
  const [hiddenNearTarget, setHiddenNearTarget] = useState(false);
  const anchorElRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const bg = hovered ? `rgba(${BRAND_BLUE_RGB},1)` : "rgba(255,255,255,1)";
  const color = hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},${OP.text})`;
  const border = hovered ? `1px solid rgba(${BRAND_BLUE_RGB},1)` : `1px solid rgba(${BRAND_BLUE_RGB},${OP.border})`;
  const shadow = hovered
    ? `0 12px 24px rgba(${BRAND_BLUE_RGB}, ${OP.shadow})`
    : `0 8px 18px rgba(${BRAND_BLUE_RGB}, ${OP.shadow})`;

  // 接近 contact 區塊時淡出
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        setHiddenNearTarget(isVisible);
      },
      { rootMargin: "0px 0px -40% 0px", threshold: [0, 0.01] }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  // 對齊語言列位置
  useEffect(() => {
    let el: HTMLElement | null = null;
    try {
      el = document.querySelector(anchorSelector || "") as HTMLElement | null;
    } catch {}
    anchorElRef.current = el;

    const GAP_PX = 8; // 與語言列距離
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
        setPinned({ topRem: offsetY + topAdjustRem, rightRem: offsetRight + rightAdjustRem });
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
  }, [anchorSelector, offsetY, offsetRight, followAnchor, topAdjustRem, rightAdjustRem, matchAnchorWidth, widthAdjustRem]);

  const onGo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el =
      document.getElementById(targetId) ||
      (document.querySelector('[data-contact-anchor="true"]') as HTMLElement | null);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <div
      className={[
        "fixed z-[79] pointer-events-auto transition-all duration-200",
        hiddenNearTarget ? "opacity-0 translate-y-1 pointer-events-none" : "opacity-100 translate-y-0",
      ].join(" ")}
      style={{
        top:
          pinned && position === "top-right" && !isMobile
            ? `calc(${pinned.topRem}rem + env(safe-area-inset-top, 0px))`
            : undefined,
        right:
          pinned && !isMobile
            ? `calc(${pinned.rightRem}rem + env(safe-area-inset-right, 0px))`
            : undefined,
      }}
    >
      <a
        href={`#${targetId}`}
        onClick={onGo}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={label}
        aria-controls={targetId}
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
        {/* 左邊文字靠左 */}
        <span className="truncate text-left">{label}</span>

        {/* 右邊藍點靠右 */}
        <span
          aria-hidden="true"
          className="ml-2 h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},0.9)` }}
        />
      </a>
    </div>
  );
}
