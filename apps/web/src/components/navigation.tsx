// C:\Users\ta893\twconnect2\apps\web\src\components\navigation.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type Lang = "jp" | "zh" | "en";
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
  // 不再封鎖 /logo.png；只擋空值與明顯的無效字串
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
    // ✅ 加上品牌底色，避免白字在白底頁面消失
    <header className="w-full py-3" style={{ backgroundColor: "#1C3D5A" }}>
      <nav className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href={normalizeHref("/")} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white/10 ring-1 ring-white/20 overflow-hidden flex items-center justify-center">
            <Image
              src={logoSrc}
              alt={displayName}
              width={36}
              height={36}
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="text-white font-semibold">{displayName}</span>
        </Link>

        {/* Nav items */}
        <ul className="hidden md:flex items-center gap-6">
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
      </nav>
    </header>
  );
}
