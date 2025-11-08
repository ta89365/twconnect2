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
  topAdjustRem?: number;
  rightAdjustRem?: number;
  matchAnchorWidth?: boolean;
  widthAdjustRem?: number;
  /** 多少可見比例時隱藏（遲滯上界） */
  hideAtRatio?: number;
  /** 多少可見比例時顯示（遲滯下界） */
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
  hideAtRatio = 0.85,   // ↑ 到這個比例才隱藏
  showAtRatio = 0.55,   // ↓ 低於這個比例才重新顯示
}: Props) {
  const sp = useSearchParams();
  const activeLang = (lang ?? normalizeLang(sp?.get("lang"))) as Lang;

  const label = useMemo(
    () => ({ jp: "今すぐ相談", zh: "立刻諮詢", en: "Consult Now" }[activeLang]),
    [activeLang]
  );

  const [hovered, setHovered] = useState(false);

  // 初始定位，避免水合前 top/right 為 undefined
  const initialPinned = {
    topRem: offsetY + topAdjustRem,
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

  // ===== 使用「遲滯」避免在表單中段忽隱忽現 =====
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    // 冷卻避免極短時間內連續切換（可選）
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
        // 介於 showAtRatio ~ hideAtRatio 之間不變更狀態，避免抖動
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, showAtRatio, 0.7, hideAtRatio, 1],
      }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [targetId, hideAtRatio, showAtRatio, hiddenNearTarget]);

  // 對齊語言列位置（桌機）
  useEffect(() => {
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
    const el =
      document.getElementById(targetId) ||
      (document.querySelector('[data-contact-anchor="true"]') as HTMLElement | null);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      data-quick-consult="true"
      className={[
        "fixed z-[100] pointer-events-auto transition-all duration-200",
        hiddenNearTarget ? "opacity-0 translate-y-1 pointer-events-none" : "opacity-100 translate-y-0",
      ].join(" ")}
      style={{
        top:
          position === "top-right"
            ? `calc(${pinned?.topRem ?? initialPinned.topRem}rem + env(safe-area-inset-top, 0px))`
            : undefined,
        right: `calc(${pinned?.rightRem ?? initialPinned.rightRem}rem + env(safe-area-inset-right, 0px))`,
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
