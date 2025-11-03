// apps/web/src/components/navigation.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type Lang = "jp" | "zh" | "zh-cn" | "en";
type NavChild = { label: string; href: string; external?: boolean };
type NavItem = { label?: string; href?: string; external?: boolean; order?: number; children?: NavChild[] };

type NavigationProps = {
  lang?: Lang;
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

export default function Navigation({ lang = "jp", items = [], brand }: NavigationProps) {
  const displayName = brand?.name?.trim() || "Taiwan Connect";
  const brandNameForLang = lang === "jp" ? "株式会社台湾コネクト" : displayName;

  const rawLogo = brand?.logoUrl?.trim() || "";
  const logoSrc = isValidSrc(rawLogo) ? rawLogo : "/logo.png";

  const normalizeHref = (href?: string) => {
    if (!href) return "#";
    if (/^https?:\/\//i.test(href)) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}lang=${lang}`;
  };

  const sorted = items.slice().sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  // --- 陸資下拉的本地備援 ---
  const CN_LABELS: Record<Lang, [string, string, string, string]> = {
    jp: ["中資投資ガイド", "ホワイトリスト", "UBO 実務指引", "申請資料と却下事例"],
    zh: ["中資來台投資指南", "白名單", "UBO 實務指引", "申請文件與退件原因"],
    "zh-cn": ["陆资来台投资指南", "白名单", "UBO 实务指引", "申请文件与退件原因"],
    en: ["Mainland Investment Guide", "Whitelist", "UBO Guide", "Docs and Rejection Causes"],
  };

  // --- 這裡統一做 augmentation：Service 按原樣（伺服端可帶 children）；陸資強制注入備援 children ---
  const augmented: NavItem[] = sorted.map((it) => {
    const base = it.href?.split("?")[0] || "";

    // Service：不改，維持伺服端 children（若有）
    if (base === "/services") return it;

    // 陸資：固定使用本地備援四項
    if (base === "/cn-investment") {
      const labels = CN_LABELS[lang];
      return {
        ...it,
        children: [
          { label: labels[0], href: "/cn-investment/mainland-investment" },
          { label: labels[1], href: "/cn-investment/cn-investment-whitelist" },
          { label: labels[2], href: "/cn-investment/cn-investment-ubo-guide" },
          { label: labels[3], href: "/cn-investment/cn-investment-docs-cn" },
        ],
      };
    }

    return it;
  });

  // 狀態：桌機 hover、手機抽屜與手風琴
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [accordion, setAccordion] = useState<Record<number, boolean>>({});
  const toggleAccordion = (i: number) => setAccordion((p) => ({ ...p, [i]: !p[i] }));

  return (
    <header className="w-full" style={{ backgroundColor: "#1C3D5A" }}>
      {/* 上列：Logo + 桌機選單 + 手機漢堡 */}
      <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href={normalizeHref("/")} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 overflow-hidden flex items-center justify-center">
            <Image src={logoSrc} alt={brandNameForLang} width={36} height={36} className="h-7 w-7 object-contain" />
          </div>
          <span className="text-white font-semibold text-base">{brandNameForLang}</span>
        </Link>

        {/* 桌機主選單 */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-12 whitespace-nowrap">
            {augmented.map((it, i) => {
              const hasChildren = Array.isArray(it.children) && it.children.length > 0;
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
                    className="text-slate-100 hover:text-sky-200 text-sm transition-colors inline-flex items-center gap-1"
                    aria-haspopup={hasChildren ? "menu" : undefined}
                    aria-expanded={hasChildren && openIdx === i ? true : false}
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

                  {/* 桌機下拉：更寬且自動撐開 */}
                  {hasChildren && openIdx === i && (
                    <ul
                      role="menu"
                      className="absolute left-0 top-full bg-white shadow-lg rounded-b-lg py-2 px-3 min-w-[14rem] w-auto z-50 ring-1 ring-black/5 border-t border-slate-100"
                    >
                      {it.children!.map((child, cidx) => (
                        <li role="none" key={`${child.href}-${cidx}`}>
                          <Link
                            role="menuitem"
                            href={normalizeHref(child.href)}
                            className="block px-2 py-2 text-sm text-slate-800 hover:bg-slate-50 hover:text-sky-700"
                            target={child.external ? "_blank" : undefined}
                            rel={child.external ? "noreferrer" : undefined}
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
          className="md:hidden inline-flex items-center justify-center rounded-md px-2 py-2 text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" />
          </svg>
        </button>
      </div>

      {/* 手機抽屜 */}
      <div className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!mobileOpen}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[82%] max-w-[380px] bg-white shadow-xl transition-transform ${mobileOpen ? "translate-x-0" : "translate-x-full"}`} role="dialog" aria-modal="true">
          {/* 標頭 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center">
                <Image src={logoSrc} alt={brandNameForLang} width={28} height={28} className="h-6 w-6 object-contain" />
              </div>
              <span className="font-medium text-slate-800">{brandNameForLang}</span>
            </div>
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* 內容：用 augmented 讓陸資子選單存在 */}
          <nav className="px-2 py-2 overflow-y-auto h-[calc(100%-56px)]" aria-label="Mobile">
            <ul className="space-y-1">
              {augmented.map((it, i) => {
                const hasChildren = Array.isArray(it.children) && it.children.length > 0;
                const expanded = !!accordion[i];

                return (
                  <li key={`${it.href ?? "#"}-m-${i}`} className="border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center">
                      <Link
                        href={normalizeHref(it.href)}
                        className="flex-1 block px-3 py-3 text-slate-800 text-[15px] font-medium hover:bg-slate-50 rounded-md"
                        onClick={() => setMobileOpen(false)}
                      >
                        {it.label}
                      </Link>

                      {hasChildren && (
                        <button
                          type="button"
                          aria-label="Toggle submenu"
                          aria-expanded={expanded}
                          onClick={() => toggleAccordion(i)}
                          className="px-3 py-3 text-slate-600 hover:text-slate-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <div className={`grid transition-all duration-200 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <ul className="overflow-hidden">
                          {it.children!.map((c, cidx) => (
                            <li key={`${c.href}-m-${cidx}`}>
                              <Link
                                href={normalizeHref(c.href)}
                                className="block pl-6 pr-3 py-2 text-[14px] text-slate-700 hover:bg-slate-50 rounded-md"
                                onClick={() => setMobileOpen(false)}
                              >
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
