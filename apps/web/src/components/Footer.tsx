// apps/web/src/components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Linkedin,
  Facebook,
  Instagram,
  Globe2,
  LineChart,
  Mail,
  MapPin,
  Github,
} from "lucide-react";

type Lang = "zh" | "zh-cn" | "jp" | "en";

export type FooterLink = { label?: string; href?: string; external?: boolean; order?: number };

export type FooterCompany = {
  name?: string | null;
  logoUrl?: string | null;
  desc?: string | null;
};

export type FooterContact = {
  email?: string | null;
  lineId?: string | null;
  addressJp?: string | null;
  addressTw?: string | null;
};

export type FooterSocial = {
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  github?: string | null;
  medium?: string | null;
  note?: string | null;
  line?: string | null;
};

type FooterProps = {
  lang?: Lang;
  company?: FooterCompany | null;
  contact?: FooterContact | null;
  primaryLinks?: FooterLink[];
  secondaryLinks?: FooterLink[];
  sitemapLabel?: string | null;
  social?: FooterSocial | null;
  logoUrl?: string | null;
  logoText?: string | null;
};

const BRAND_BG = "#1C3D5A";

/* ===== helpers ===== */
const isValidSrc = (s?: string | null) => {
  if (!s) return false;
  const v = s.trim().toLowerCase();
  return v !== "" && v !== "null" && v !== "undefined";
};
const nonEmpty = (s?: string | null) => !!s && s.trim() !== "";
const withLang = (href?: string, lang?: Lang) => {
  if (!href) return "#";
  if (/^https?:\/\//i.test(href)) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}lang=${lang ?? "jp"}`;
};
const defaultSitemap = (lang: Lang) =>
  lang === "jp" ? "サイトマップ" : lang === "en" ? "Sitemap" : "網站導覽";
const fallbackLinks = (lang: Lang): FooterLink[] => [
  { label: lang === "en" ? "About Us" : lang === "jp" ? "会社概要 / About Us" : "公司概要 / About Us", href: "/company" },
  { label: lang === "en" ? "Services" : lang === "jp" ? "サービス / Services" : "服務內容 / Services", href: "/#services" },
  { label: lang === "en" ? "Case Studies" : lang === "jp" ? "実績紹介 / Case Studies" : "成功案例 / Case Studies", href: "/cases" },
  { label: lang === "en" ? "News & Articles" : lang === "jp" ? "ニュース・コラム / News & Articles" : "新聞・專欄 / News & Articles", href: "/news" },
  { label: lang === "en" ? "Contact" : lang === "jp" ? "お問い合わせ / Contact" : "聯絡我們 / Contact", href: "/contact" },
];
const toExternalHref = (u?: string | null) => {
  if (!nonEmpty(u)) return undefined;
  const s = u!.trim();
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};

export default function Footer({
  lang = "jp",
  company,
  contact,
  primaryLinks,
  secondaryLinks, // unused
  sitemapLabel,
  social,
  logoUrl,
  logoText,
}: FooterProps) {
  const displayCompanyName =
    (logoText ?? company?.name)?.trim() ||
    (lang === "en" ? "Taiwan Connect Inc." : "株式会社 Taiwan Connect");

  const incomingLogo = (logoUrl ?? company?.logoUrl)?.trim() || "";
  const safeLogoSrc = isValidSrc(incomingLogo) ? incomingLogo : "/logo.png";

  const displayEmail = (contact?.email || "info@twconnects.com").trim();
  const displayLineId = contact?.lineId?.trim() || "@030qreji";
  const displayDesc =
    (company?.desc && company.desc.trim()) ||
    (lang === "en"
      ? "We support overseas companies entering Taiwan with incorporation, accounting and tax, visa, and cross-border advisory."
      : lang === "jp"
      ? "海外企業の台湾進出を専門にサポート。会社設立、会計・税務、ビザ、クロスボーダーコンサルティングを提供しています。"
      : lang === "zh-cn"
      ? "专注协助海外企业进入台湾，提供设立、会计税务、签证与跨境顾问服务。"
      : "專注於協助海外企業進入台灣，提供設立、會計稅務、簽證與跨境顧問服務。");

  const navLinks: FooterLink[] = primaryLinks?.length ? primaryLinks : fallbackLinks(lang);
  const displaySitemap = sitemapLabel?.trim() || defaultSitemap(lang);

  const s = social || {};

  return (
    <footer className="text-slate-100" style={{ backgroundColor: BRAND_BG }}>
      <div className="border-t border-white/15">
        {/* ✅ 高度更緊湊，gap與padding縮小 */}
        <div className="mx-auto max-w-7xl px-8 py-8 sm:py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-5">
          {/* 左：公司敘述（40%） */}
          <section className="md:w-[40%]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden ring-1 ring-white/20">
                <Image
                  src={safeLogoSrc}
                  alt={displayCompanyName || "Taiwan Connect"}
                  width={36}
                  height={36}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="font-semibold text-white text-[15px]">{displayCompanyName}</div>
            </div>
            <p className="mt-2 text-[14px] leading-6 text-slate-300">{displayDesc}</p>
          </section>

          {/* 中：聯絡資訊（34%） */}
          <section className="md:w-[34%]">
            <ul className="space-y-1.5 text-slate-200 text-[14px]">
              {contact?.addressJp && (
                <li className="flex items-start gap-2 leading-5">
                  <MapPin className="h-4 w-4 text-white/90 mt-[2px] shrink-0" />
                  <span>{contact.addressJp}</span>
                </li>
              )}
              {contact?.addressTw && (
                <li className="flex items-start gap-2 leading-5">
                  <MapPin className="h-4 w-4 text-white/90 mt-[2px] shrink-0" />
                  <span>{contact.addressTw}</span>
                </li>
              )}
              {displayEmail && (
                <li className="flex items-start gap-2 leading-5">
                  <Mail className="h-4 w-4 text-white/90 mt-[2px] shrink-0" />
                  <a
                    href={`mailto:${displayEmail}`}
                    className="text-white hover:text-sky-200 transition-colors"
                  >
                    {displayEmail}
                  </a>
                </li>
              )}
              {displayLineId && (
                <li className="flex items-start gap-2 leading-5">
                  <LineChart className="h-4 w-4 text-white/90 mt-[2px] shrink-0" />
                  <span>{displayLineId}</span>
                </li>
              )}
            </ul>
          </section>

          {/* 右：網站導覽 + 社群（26%） */}
          <nav className="md:w-[26%]">
            <div className="font-semibold text-white mb-1 text-[14px]">
              {displaySitemap}
            </div>
            <ul className="space-y-[3px] text-[14px]">
              {navLinks.map((l, i) => (
                <li key={`${l.href}-${i}`}>
                  <Link
                    href={withLang(l.href, lang)}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer" : undefined}
                    className="text-slate-200 hover:text-sky-200 transition-colors"
                    prefetch={false}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 社群連結 */}
            <div className="flex items-center gap-3 mt-3">
              {nonEmpty(s.linkedin) && (
                <Link
                  href={toExternalHref(s.linkedin)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              )}
              {nonEmpty(s.facebook) && (
                <Link
                  href={toExternalHref(s.facebook)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              )}
              {nonEmpty(s.instagram) && (
                <Link
                  href={toExternalHref(s.instagram)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              )}
              {nonEmpty(s.github) && (
                <Link
                  href={toExternalHref(s.github)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <Github className="h-4 w-4" />
                </Link>
              )}
              {nonEmpty(s.medium) && (
                <Link
                  href={toExternalHref(s.medium)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Medium"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <Globe2 className="h-4 w-4" />
                </Link>
              )}
              {nonEmpty(s.note) && (
                <Link
                  href={toExternalHref(s.note)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="note"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <Globe2 className="h-4 w-4" />
                </Link>
              )}
              {nonEmpty(s.line) && (
                <Link
                  href={toExternalHref(s.line)!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LINE"
                  className="text-white/90 hover:text-sky-200"
                  prefetch={false}
                >
                  <LineChart className="h-4 w-4" />
                </Link>
              )}
            </div>
          </nav>
        </div>

        {/* 底線與版權列 */}
        <div className="mx-auto max-w-7xl px-8">
          <div className="mt-6 h-px w-full bg-white/10" />
          <div className="py-4 text-center">
            <p className="text-xs text-slate-300">
              © {new Date().getFullYear()} {displayCompanyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
