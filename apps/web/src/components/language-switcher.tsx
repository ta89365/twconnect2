"use client";

import { useEffect, useMemo, useState } from "react";
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
  behavior?: "fixed" | "static"; // static = 絕對定位在父層；fixed = 固定在視窗
  className?: string;
  /** 手機上若任一 selector 代表選單開啟，就暫時隱藏語言切換（桌機不受影響） */
  hideWhenSelectors?: string[];
};

export default function LanguageSwitcher({
  current,
  offsetY = 5,
  offsetRight = 1.25,
  behavior = "fixed",
  className = "",
  hideWhenSelectors = [
    'nav[aria-expanded="true"]',
    '[data-mobile-nav="open"]',
    '[data-nav-open="true"]',
    '[data-drawer="open"]',
    '[aria-modal="true"][role="dialog"][data-nav="true"]',
  ],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const BRAND_BLUE_RGB = "28,61,90"; // #1C3D5A
  const OP = { border: 0.30, active: 0.08, divider: 0.22, text: 0.98, dot: 0.95 };

  const [hoverKey, setHoverKey] = useState<Lang | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const positionStyle: React.CSSProperties =
    behavior === "fixed"
      ? { position: "fixed", top: `${offsetY}rem`, right: `${offsetRight}rem` }
      : { position: "absolute", top: `${offsetY}rem`, right: `${offsetRight}rem` };

  // 手機偵測是否開啟行動選單：開啟時隱藏，桌機一律顯示
  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      try {
        for (const sel of hideWhenSelectors) {
          const el = document.querySelector(sel) as HTMLElement | null;
          if (!el) continue;
          const ariaExpanded = el.getAttribute("aria-expanded");
          const dataOpen =
            el.getAttribute("data-open") ||
            el.getAttribute("data-state") ||
            el.getAttribute("data-nav-open") ||
            el.getAttribute("data-mobile-nav") ||
            el.getAttribute("data-drawer");
          const hasOpenAttr = (el as any).open === true;
          if (
            ariaExpanded === "true" ||
            dataOpen === "true" ||
            el.getAttribute("data-mobile-nav") === "open" ||
            el.getAttribute("data-drawer") === "open" ||
            hasOpenAttr
          ) {
            return true;
          }
        }
      } catch {}
      return false;
    };

    const update = () => setMobileMenuOpen(check());
    update();

    const mo = new MutationObserver(update);
    mo.observe(document.body, { attributes: true, childList: true, subtree: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [hideWhenSelectors]);

  // 手機開啟選單時隱藏；桌機不受影響
  const mobileHideClass = mobileMenuOpen ? "hidden md:block" : "";

  return (
    <div
      data-lang-switcher="true"
      className={[
        // 改成 inline-flex，並用 max-content 寬度，讓容器自動收斂到內容
        "z-[80] inline-flex flex-col overflow-hidden rounded-xl backdrop-blur-md shadow-lg select-none",
        mobileHideClass,
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

        const btnBg = hovered ? `rgba(${BRAND_BLUE_RGB},1)` : active ? `rgba(${BRAND_BLUE_RGB},${OP.active})` : "transparent";
        const btnColor = hovered ? "#FFFFFF" : `rgba(${BRAND_BLUE_RGB},${OP.text})`;
        const dotBg = hovered ? "#FFFFFF" : active ? `rgba(${BRAND_BLUE_RGB},${OP.dot})` : "transparent";
        const dividerColor = hovered ? "rgba(255,255,255,0.25)" : `rgba(${BRAND_BLUE_RGB},${OP.divider})`;

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
  );
}
