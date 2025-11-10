// apps/web/src/components/navigation.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

type Lang = "jp" | "zh" | "zh-cn" | "en";
type NavChild = { label: string; href: string; external?: boolean };
type NavItem = { label?: string; href?: string; external?: boolean; order?: number; children?: NavChild[] };

type NavigationProps = {
  lang?: Lang;                      // 顯示文案用語言
  linkLang?: Lang;                  // 連結輸出用語言；未給則沿用 lang（且 zh-cn 會自動轉 zh）
  items?: NavItem[];
  brand?: { logoUrl?: string | null; name?: string | null };
};

function isValidSrc(s?: string | null) {
  if (!s) return false;
  const v = String(s).trim();
  if (!v) return false;
  if (v.toLowerCase() === "null" || v.toLowerCase() === "undefined") return false;
  return true;
}

function isContactItem(it?: { label?: string; href?: string }) {
  const base = String(it?.href ?? "").split("?")[0];
  if (base === "/contact") return true;
  const label = String(it?.label ?? "").trim();
  const CONTACT_LABELS = new Set(["聯絡我們", "联系我们", "お問い合わせ", "Contact", "Contact Us"]);
  return CONTACT_LABELS.has(label);
}

export default function Navigation({ lang = "jp", linkLang, items = [], brand }: NavigationProps) {
  usePathname();
  const BRAND_BLUE = "#1C3D5A";

  const linkLangEffective: Lang = (linkLang ?? lang) === "zh-cn" ? "zh" : (linkLang ?? lang);

  const displayName = brand?.name?.trim() || "Taiwan Connect";
  const brandNameForLang = lang === "jp" ? "株式会社台湾コネクト" : displayName;
  const rawLogo = brand?.logoUrl?.trim() || "";
  const logoSrc = isValidSrc(rawLogo) ? rawLogo : "/logo.png";

  const normalizeHref = (href?: string) => {
    if (!href) return "#";
    if (/^https?:\/\//i.test(href)) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}lang=${linkLangEffective}`;
  };

  const sorted = items.slice().sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  // ===== 陸資專區子選單（文案依 lang 顯示）=====
  const CN_LABELS: Record<Lang, [string, string, string, string, string]> = {
    zh: ["陸資首頁", "公司設立流程指引", "營業項目與政策", "最終受益人判斷方法", "退件原因與顧問建議"],
    "zh-cn": ["陆资首页", "公司设立流程指引", "经营项目与政策", "最终受益人判定方法", "退件原因与顾问建议"],
    jp: ["陸資トップページ", "会社設立の手続きガイド", "事業項目と関連政策", "最終受益者の判定方法", "差し戻し理由"],
    en: ["Main Page", "Company Setup Guidance", "Business Scope Limitation", "UBO Check", "Rejected Reasons & Advice"],
  };

  const augmented: NavItem[] = sorted.map((it) => {
    const base = it.href?.split("?")[0] || "";
    if (base === "/cn-investment") {
      const labels = CN_LABELS[lang];
      return {
        ...it,
        children: [
          { label: labels[0], href: "/cn-investment" },
          { label: labels[1], href: "/cn-investment/mainland-investment" },
          { label: labels[2], href: "/cn-investment/cn-investment-whitelist" },
          { label: labels[3], href: "/cn-investment/cn-investment-ubo-guide" },
          { label: labels[4], href: "/cn-investment/cn-investment-docs-cn" },
        ],
      };
    }
    return it;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [accordion, setAccordion] = useState<Record<number, boolean>>({});
  const toggleAccordion = (i: number) => setAccordion((p) => ({ ...p, [i]: !p[i] }));

  // === 全站統一樣式 ===
  const desktopItemBase =
    "text-slate-100 hover:text-sky-200 text-[15px] leading-6 transition-colors inline-flex items-center gap-1 font-medium";
  const desktopContactSpecial =
    "inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 font-bold text-black transition-all hover:bg-slate-100 ring-1 ring-black/5";
  const mobileItemBase =
    "flex-1 block px-3 py-3 text-white text-[15px] font-medium hover:bg-white/10 rounded-md";
  const mobileContactSpecial =
    "flex-1 block px-3 py-3 rounded-md bg-white font-bold text-black hover:bg-slate-100";

  return (
    <header className="w-full" style={{ backgroundColor: BRAND_BLUE }}>
      {/* 滿版：左右貼邊 */}
      <div className="w-full px-0 py-3 flex items-center gap-6">
        {/* 左：Logo + 公司名 */}
        <Link href={normalizeHref("/")} className="flex items-center gap-5 flex-shrink-0 pl-3 md:pl-4">
          <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 overflow-hidden flex items-center justify-center">
            <Image src={logoSrc} alt={brandNameForLang} width={36} height={36} className="h-7 w-7 object-contain" />
          </div>
          <span className="text-white font-semibold text-base">{brandNameForLang}</span>
        </Link>

        {/* spacer 把導覽推到最右 */}
        <div className="flex-1" />

        {/* 右：主選單 */}
        <nav aria-label="Main" className="hidden md:flex pr-3 md:pr-4">
          <ul className="flex items-center gap-8 whitespace-nowrap justify-end">
            {augmented.map((it, i) => {
              const hasChildren = Array.isArray(it.children) && it.children.length > 0;
              const contactSpecial = isContactItem(it);

              return (
                <li
                  key={`${it.href ?? "#"}-${i}`}
                  className="relative group"
                  onMouseEnter={() => hasChildren && setOpenIdx(i)}
                  onMouseLeave={() => setOpenIdx(null)}
                >
                  <Link
                    href={normalizeHref(it.href)}
                    target={it.external ? "_blank" : undefined}
                    rel={it.external ? "noreferrer" : undefined}
                    className={contactSpecial ? desktopContactSpecial : desktopItemBase}
                  >
                    {it.label}
                    {hasChildren && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 opacity-80">
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </Link>

                  {hasChildren && openIdx === i && (
                    <ul
                      role="menu"
                      className="absolute right-0 top-full bg-white shadow-lg rounded-b-lg py-1.5 px-2 w-max max-w-[70vw] whitespace-nowrap z-50 ring-1 ring-black/5 border-t border-slate-100"
                    >
                      {(it.children ?? []).map((child, cidx) => (
                        <li key={`${child.href ?? "child"}-${cidx}`}>
                          <Link
                            href={normalizeHref(child.href)}
                            className="block px-2.5 py-1.5 text-sm text-slate-800 hover:bg-slate-50 hover:text-sky-700"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 手機漢堡 */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="md:hidden ml-auto mr-2 inline-flex items-center justify-center rounded-md px-2 py-2 text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" />
          </svg>
        </button>
      </div>

      {/* 手機抽屜 */}
      <div className={`md:hidden fixed inset-0 z-50 transition-all duration-200 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute right-0 top-0 h-full w-[82%] max-w-[380px] transition-transform ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ backgroundColor: BRAND_BLUE, color: "#fff" }}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
            <Link href={normalizeHref("/")} className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="h-8 w-8 rounded-md bg-white/10 overflow-hidden flex items-center justify-center ring-1 ring-white/20">
                <Image src={logoSrc} alt={brandNameForLang} width={28} height={28} className="h-6 w-6 object-contain" />
              </div>
              <span className="font-medium text-white">{brandNameForLang}</span>
            </Link>
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-white hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <nav className="px-2 py-3 overflow-y-auto h-[calc(100%-56px)]">
            <ul className="space-y-1">
              {augmented.map((it, i) => {
                const hasChildren = Array.isArray(it.children) && it.children.length > 0;
                const expanded = !!accordion[i];
                const contactSpecial = isContactItem(it);

                return (
                  <li key={`${it.href ?? "#"}-m-${i}`} className="border-b border-white/15 last:border-b-0">
                    <div className="flex items-center">
                      <Link
                        href={normalizeHref(it.href)}
                        className={contactSpecial ? mobileContactSpecial : mobileItemBase}
                        onClick={() => setMobileOpen(false)}
                      >
                        {it.label}
                      </Link>
                      {hasChildren && (
                        <button type="button" onClick={() => toggleAccordion(i)} className="px-3 py-3 text-white hover:text-sky-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {hasChildren && (
                      <div className={`grid transition-all duration-200 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <ul className="overflow-hidden">
                          {(it.children ?? []).map((c, cidx) => (
                            <li key={`${c.href ?? "child"}-m-${cidx}`}>
                              <Link href={normalizeHref(c.href)} className="block pl-6 pr-3 py-2 text-[14px] text-white/90 hover:bg白/10 rounded-md" onClick={() => setMobileOpen(false)}>
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
