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

  // 中資暫用本地備援
  const CN_LABELS: Record<Lang, [string, string, string, string]> = {
    jp: ["中資投資ガイド", "ホワイトリスト", "UBO 実務指引", "申請資料と却下事例"],
    zh: ["中資來台投資指南", "白名單", "UBO 實務指引", "申請文件與退件原因"],
    "zh-cn": ["陆资来台投资指南", "白名单", "UBO 实务指引", "申请文件与退件原因"],
    en: ["Mainland Investment Guide", "Whitelist", "UBO Guide", "Docs and Rejection Causes"],
  };

  // Service 只吃後端 children 中資維持本地備援 其他不變
  const augmented: NavItem[] = sorted.map((it) => {
    const base = it.href?.split("?")[0] || "";

    if (base === "/services") {
      return it;
    }

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

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <header className="w-full py-3" style={{ backgroundColor: "#1C3D5A" }}>
      <nav className="w-full flex justify-center items-center">
        <div className="flex items-center justify-center gap-14">
          <Link href={normalizeHref("/")} className="flex items-center gap-3 flex-shrink-0">
            <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 overflow-hidden flex items-center justify-center">
              <Image src={logoSrc} alt={brandNameForLang} width={36} height={36} className="h-7 w-7 object-contain" />
            </div>
            <span className="text-white font-semibold text-base">{brandNameForLang}</span>
          </Link>

          <ul className="hidden md:flex items-center gap-12 whitespace-nowrap">
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

                  {hasChildren && openIdx === i && (
                    <ul
                      role="menu"
                      className="absolute left-0 top-full bg-white shadow-lg rounded-b-lg py-2 w-56 z-50 ring-1 ring-black/5 border-t border-slate-100"
                    >
                      {it.children!.map((child, cidx) => (
                        <li role="none" key={`${child.href}-${cidx}`}>
                          <Link
                            role="menuitem"
                            href={normalizeHref(child.href)}
                            className="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-50 hover:text-sky-700"
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
        </div>
      </nav>
    </header>
  );
}
