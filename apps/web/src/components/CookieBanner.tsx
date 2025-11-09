// apps/web/src/components/CookieBanner.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ConsentContext } from "./ConsentProvider";

const BRAND_BLUE = "#1C3D5A";

type Lang = "en" | "jp" | "zh" | "zh-cn";

const copy: Record<Lang, {
  line: string;
  manage: string;
  reject: string;
  accept: string;
  modalTitle: string;
  aLabel: string; aDesc: string;
  adLabel: string; adDesc: string;
  close: string; save: string;
}> = {
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
  const { consent, hasMadeChoice, acceptAll, rejectNonEssential, saveCustom } = React.useContext(ConsentContext);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [ads, setAds] = useState(consent.ads);

  const searchParams = useSearchParams();

  const lang: Lang = useMemo(() => {
    // 1) 先看 ?lang=
    const fromQuery = normalizeLangToken(searchParams.get("lang"));
    if (fromQuery) return fromQuery;

    // 2) 再看 <html lang="">
    if (typeof document !== "undefined") {
      const fromHtml = normalizeLangToken(document.documentElement.getAttribute("lang"));
      if (fromHtml) return fromHtml;
    }

    // 3) 最後回退英文
    return "en";
  }, [searchParams]);

  const t = copy[lang] ?? copy.en;

  if (hasMadeChoice) return null;

  return (
    <>
      {/* 非滿版：置中卡片，寬度貼內容長度；避免換行與水平捲動 */}
      <div className="fixed inset-x-0 bottom-4 z-[1000] flex justify-center px-3">
        <div
          className="rounded-2xl border shadow-xl bg-white"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            maxWidth: "min(100vw - 24px, 1400px)",
            width: "fit-content",
          }}
        >
          <div className="px-5 py-4 md:px-6 md:py-5">
            <div
              className="text-gray-800"
              style={{
                whiteSpace: "nowrap",
                fontSize: "clamp(12px, 1.4vw, 16px)",
                lineHeight: 1.6,
              }}
            >
              {t.line}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button
                onClick={() => setOpen(true)}
                className="px-3 py-2 text-sm underline underline-offset-4 font-medium"
                style={{ fontSize: "clamp(12px, 1.2vw, 14px)" }}
              >
                {t.manage}
              </button>
              <button
                onClick={rejectNonEssential}
                className="px-4 py-2 rounded-lg border font-medium"
                style={{
                  borderColor: "rgba(0,0,0,0.15)",
                  fontSize: "clamp(12px, 1.2vw, 14px)",
                }}
              >
                {t.reject}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{
                  backgroundColor: BRAND_BLUE,
                  fontSize: "clamp(12px, 1.2vw, 14px)",
                }}
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 偏好管理彈層 */}
      {open && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border p-6">
            <h3 className="text-lg font-semibold" style={{ color: BRAND_BLUE }}>
              {t.modalTitle}
            </h3>

            <div className="mt-4 space-y-4">
              <fieldset className="border rounded-lg p-4">
                <legend className="px-1 text-sm font-semibold">{t.aLabel}</legend>
                <p className="text-sm text-gray-600 mb-2">{t.aDesc}</p>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                  <span className="text-sm">On</span>
                </label>
              </fieldset>

              <fieldset className="border rounded-lg p-4">
                <legend className="px-1 text-sm font-semibold">{t.adLabel}</legend>
                <p className="text-sm text-gray-600 mb-2">{t.adDesc}</p>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={ads} onChange={(e) => setAds(e.target.checked)} />
                  <span className="text-sm">On</span>
                </label>
              </fieldset>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="px-3 py-2 text-sm underline" onClick={() => setOpen(false)}>
                {t.close}
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium"
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
