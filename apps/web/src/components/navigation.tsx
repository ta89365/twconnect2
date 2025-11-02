// apps/web/src/components/navigation.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type Lang = "jp" | "zh" | "zh-cn" | "en";
type NavItem = { label?: string; href?: string; external?: boolean; order?: number };

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
  const rawLogo = brand?.logoUrl?.trim() || "";
  const logoSrc = isValidSrc(rawLogo) ? rawLogo : "/logo.png";

  const normalizeHref = (href?: string) => {
    if (!href) return "#";
    if (/^https?:\/\//i.test(href)) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}lang=${lang}`;
  };

  const sorted = items.slice().sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  return (
    <header className="w-full py-3" style={{ backgroundColor: "#1C3D5A" }}>
      {/* 外層容器：導覽內容置中 */}
      <nav className="w-full flex justify-center items-center">
        {/* 內層容器：logo + 導覽項目群 */}
        <div className="flex items-center justify-center gap-14">
          {/* Logo區塊 */}
          <Link
            href={normalizeHref("/")}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 overflow-hidden flex items-center justify-center">
              <Image
                src={logoSrc}
                alt={displayName}
                width={36}
                height={36}
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="text-white font-semibold text-base">{displayName}</span>
          </Link>

          {/* 導覽項目群 */}
          <ul className="hidden md:flex items-center gap-12 whitespace-nowrap">
            {sorted.map((it, i) => (
              <li key={`${it.href ?? "#"}-${i}`}>
                <Link
                  href={normalizeHref(it.href)}
                  target={it.external ? "_blank" : undefined}
                  rel={it.external ? "noreferrer" : undefined}
                  className="text-slate-100 hover:text-sky-200 text-sm transition-colors"
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
