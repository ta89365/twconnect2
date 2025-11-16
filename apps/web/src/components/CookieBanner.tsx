// apps/web/src/components/CookieBanner.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConsentContext } from "./ConsentProvider";

const BRAND_BLUE = "#1C3D5A";

type Lang = "en" | "jp" | "zh" | "zh-cn";

const copy: Record<
  Lang,
  {
    line: string;
    manage: string;
    reject: string;
    accept: string;
    modalTitle: string;
    aLabel: string;
    aDesc: string;
    adLabel: string;
    adDesc: string;
    close: string;
    save: string;
  }
> = {
  en: {
    line: "We use cookies to make our site work and to improve analytics and advertising when you allow it. You can change your choice anytime in Privacy settings.",
    manage: "Manage preferences",
    reject: "Reject non essential",
    accept: "Accept all",
    modalTitle: "Cookie preferences",
    aLabel: "Analytics cookies",
    aDesc: "Help us understand site traffic and improve performance.",
    adLabel: "Advertising cookies",
    adDesc: "Enable personalized advertising and remarketing features.",
    close: "Close",
    save: "Save preferences",
  },
  jp: {
    line: "当サイトは機能のために Cookie を使用し、許可いただいた場合は分析と広告の改善にも利用します。設定はいつでも変更できます。",
    manage: "設定を管理",
    reject: "必須以外を拒否",
    accept: "すべて許可",
    modalTitle: "Cookie 設定",
    aLabel: "分析用 Cookie",
    aDesc: "トラフィック把握とパフォーマンス改善に役立ちます。",
    adLabel: "広告用 Cookie",
    adDesc: "パーソナライズ広告とリマーケティングを有効化します。",
    close: "閉じる",
    save: "設定を保存",
  },
  zh: {
    line: "我們使用 Cookie 以確保網站正常運作，並在你允許時改進分析與廣告。你可隨時在隱私設定中變更選擇。",
    manage: "管理偏好",
    reject: "拒絕非必要",
    accept: "全部接受",
    modalTitle: "Cookie 偏好",
    aLabel: "分析型 Cookie",
    aDesc: "協助我們了解網站流量並提升效能。",
    adLabel: "廣告型 Cookie",
    adDesc: "啟用個人化廣告與再行銷功能。",
    close: "關閉",
    save: "儲存偏好",
  },
  "zh-cn": {
    line: "我们使用 Cookie 以确保网站正常运行，并在您允许时改进分析与广告。您可随时在隐私设置中更改选择。",
    manage: "管理偏好",
    reject: "拒绝非必要",
    accept: "全部接受",
    modalTitle: "Cookie 偏好",
    aLabel: "分析型 Cookie",
    aDesc: "帮助我们了解网站流量并提升性能。",
    adLabel: "广告型 Cookie",
    adDesc: "启用个性化广告与再营销功能。",
    close: "关闭",
    save: "保存偏好",
  },
};

function normalizeLangToken(raw?: string | null): Lang | null {
  const k = String(raw || "").trim().toLowerCase();
  if (!k) return null;
  if (k === "ja" || k === "jp" || k === "ja-jp") return "jp";
  if (k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn") return "zh-cn";
  if (k === "zh" || k === "zh-hant" || k === "zh_tw" || k === "zh-tw" || k === "tw" || k === "hant") return "zh";
  if (k === "en" || k === "en-us" || k === "en_us") return "en";
  return null;
}

export default function CookieBanner() {
  const { consent, hasMadeChoice, acceptAll, rejectNonEssential, saveCustom } =
    React.useContext(ConsentContext);

  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [ads, setAds] = useState(consent.ads);

  // 避免 SSR / 初次掛載時閃爍：等到真正 mounted 再決定要不要顯示
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const searchParams = useSearchParams();

  const lang: Lang = useMemo(() => {
    const fromQuery = normalizeLangToken(searchParams.get("lang"));
    if (fromQuery) return fromQuery;

    if (typeof document !== "undefined") {
      const fromHtml = normalizeLangToken(
        document.documentElement.getAttribute("lang"),
      );
      if (fromHtml) return fromHtml;
    }

    return "en";
  }, [searchParams]);

  const t = copy[lang] ?? copy.en;

  // 還沒 mounted 或已經做過選擇時，都不要畫出 Banner，避免「跳出又閃退」
  if (!mounted || hasMadeChoice) return null;

  return (
    <>
      {/* Mobile: 貼底全寬 / Desktop: 置中卡片 */}
      <div className="fixed inset-x-0 bottom-0 z-[1000] px-3 pb-3 sm:bottom-4 sm:pb-0 flex justify-center">
        <div
          className="w-full max-w-5xl rounded-2xl border shadow-xl bg-white"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5">
            <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed">
              {t.line}
            </p>

            <div className="mt-3 sm:mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {/* Manage 按鈕：淺底色 深字，加邊框 */}
              <button
                onClick={() => setOpen(true)}
                className="w-full sm:w-auto text-center sm:text-left px-4 py-2 text-sm font-medium rounded-lg border bg-gray-50 text-gray-800 hover:bg-gray-100"
                style={{ borderColor: "rgba(0,0,0,0.15)" }}
              >
                {t.manage}
              </button>

              {/* Reject 按鈕：白底 深字，加邊框 */}
              <button
                onClick={rejectNonEssential}
                className="w-full sm:w-auto text-center px-4 py-2 rounded-lg border font-medium text-sm text-gray-800 bg-white hover:bg-gray-50"
                style={{ borderColor: "rgba(0,0,0,0.2)" }}
              >
                {t.reject}
              </button>

              {/* Accept all：維持品牌藍底 白字 */}
              <button
                onClick={acceptAll}
                className="w-full sm:w-auto text-center px-4 py-2 rounded-lg text-white font-medium text-sm"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 偏好管理彈層 */}
      {open && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl border p-5 sm:p-6">
            <h3
              className="text-base sm:text-lg font-semibold"
              style={{ color: BRAND_BLUE }}
            >
              {t.modalTitle}
            </h3>

            <div className="mt-4 space-y-4">
              <fieldset className="border rounded-lg p-3 sm:p-4">
                <legend className="px-1 text-sm font-semibold">
                  {t.aLabel}
                </legend>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  {t.aDesc}
                </p>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span className="text-sm">On</span>
                </label>
              </fieldset>

              <fieldset className="border rounded-lg p-3 sm:p-4">
                <legend className="px-1 text-sm font-semibold">
                  {t.adLabel}
                </legend>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  {t.adDesc}
                </p>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(e) => setAds(e.target.checked)}
                  />
                  <span className="text-sm">On</span>
                </label>
              </fieldset>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
              <button
                className="px-3 py-2 text-xs sm:text-sm underline"
                onClick={() => setOpen(false)}
              >
                {t.close}
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium text-xs sm:text-sm"
                style={{ backgroundColor: BRAND_BLUE }}
                onClick={() => {
                  saveCustom({ analytics, ads });
                  setOpen(false);
                }}
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
