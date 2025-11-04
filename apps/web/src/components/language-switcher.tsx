// apps/web/src/components/LanguageSwitcher.tsx
"use client";

import { useMemo } from "react";
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
  current?: Lang;     // 父層可傳目前內容語言，但僅在 URL 無 lang 時才使用
  offsetY?: number;   // rem
  offsetRight?: number; // rem
};

export default function LanguageSwitcher({
  current,
  offsetY = 5,
  offsetRight = 1.25,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ===== 可調透明度參數 =====
  const BRAND_BLUE_RGB = "28,61,90"; // #1C3D5A
  const OP = {
    bg: 0.14,
    border: 0.30,
    active: 0.26,
    divider: 0.22,
    text: 0.98,
    dot: 0.95,
  };

  // ✅ 以「URL 的 lang」為最高優先，只有沒有時才用 props.current
  const rawUrlLang = searchParams?.get("lang");
  const activeLang = normalizeLang(rawUrlLang ?? current);

  const items = useMemo(
    () => [
      { key: "zh" as Lang, label: "繁體中文" },
      { key: "jp" as Lang, label: "日本語" },
      { key: "en" as Lang, label: "English" },
    ],
    []
  );

  const setLang = (lang: Lang) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("lang", lang); // 只改 URL 的 lang，停留在當前頁
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className="fixed z-[80] flex flex-col overflow-hidden rounded-xl backdrop-blur-md shadow-lg select-none"
      style={{
        top: `${offsetY}rem`,
        right: `${offsetRight}rem`,
        backgroundColor: `rgba(255,255,255,1)`,
        border: `1px solid rgba(255,255,255,${OP.border})`,
        color: `rgba(${BRAND_BLUE_RGB},${OP.text})`,
      }}
      role="group"
      aria-label="Language switcher"
    >
      {items.map((it, idx) => {
        const active = it.key === activeLang;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setLang(it.key)}
            aria-pressed={active}
            className="relative flex items-center gap-2 px-3 py-1.5 text-[13px] whitespace-nowrap outline-none"
            style={{
              backgroundColor: active ? `rgba(255,255,255,${OP.active})` : undefined,
            }}
          >
            <span className="truncate">{it.label}</span>
            <span
              aria-hidden="true"
              className="ml-1 h-2 w-2 rounded-full"
              style={{
                backgroundColor: active ? `rgba(${BRAND_BLUE_RGB},${OP.dot})` : "transparent",
              }}
            />
            {idx !== items.length - 1 && (
              <span
                aria-hidden
                className="absolute left-0 right-0"
                style={{ bottom: -0.5, height: 1, backgroundColor: `rgba(255,255,255,${OP.divider})` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
