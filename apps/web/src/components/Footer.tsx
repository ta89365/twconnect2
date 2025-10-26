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
} from "lucide-react";

type Lang = "zh" | "jp" | "en";

export type FooterLink = { label?: string; href?: string; external?: boolean };
export type FooterCompany = {
  name?: string | null;
  logoUrl?: string | null;
};
export type FooterContact = {
  email?: string | null;
  lineId?: string | null;
};

type FooterProps = {
  lang?: Lang;
  company?: FooterCompany | null;
  contact?: FooterContact | null;
  primaryLinks?: FooterLink[];   // 右側第一組連結（可不傳）
  secondaryLinks?: FooterLink[]; // 右側第二組連結（可不傳）
  /** 向後相容：也可直接傳入 */
  logoUrl?: string | null;
  logoText?: string | null;
};

const BRAND_BG = "#1C3D5A";
const CONTAINER = "container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8";
const TRANSPARENT_1PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

/** 判斷字串是否可當 Image src 使用 */
function isValidSrc(s?: string | null) {
  if (!s) return false;
  const v = s.trim();
  if (!v) return false;
  // 避免硬編 'null' 'undefined'
  if (v.toLowerCase() === "null" || v.toLowerCase() === "undefined") return false;
  return true;
}

export default function Footer({
  lang = "jp",
  company,
  contact,
  primaryLinks,
  secondaryLinks, // 預留
  logoUrl, // 向後相容
  logoText, // 向後相容
}: FooterProps) {
  const t = {
    zh: {
      companyName: "株式会社 Taiwan Connect",
      desc: "專注於協助海外企業進入台灣，提供設立、會計稅務、簽證與跨境顧問服務。",
      addressJP:
        "【日本】〒173-0004 東京都板橋区板橋三丁目9番14-503号　グラスコート板橋",
      addressTW: "【台灣】台灣桃園市平鎮區新光路三段158巷18號",
      emailText: "【Email】info@twconnects.com",
      lineText: "【LINE】@030qreji",
      sitemap: "網站導覽",
      links: [
        { label: "公司概要 / About Us", href: "/company" },
        { label: "服務內容 / Services", href: "/#services" },
        { label: "成功案例 / Case Studies", href: "/cases" },
        { label: "新聞・專欄 / News & Articles", href: "/news" },
        { label: "聯絡我們 / Contact", href: "/contact" },
      ] as FooterLink[],
    },
    jp: {
      companyName: "株式会社 Taiwan Connect",
      desc:
        "海外企業の台湾進出を専門にサポート。会社設立、会計・税務、ビザ、クロスボーダーコンサルティングを提供しています。",
      addressJP:
        "【日本】〒XXX-XXXX 東京都〇〇区〇〇町X-X-X 〇〇ビル X階",
      addressTW: "【台湾】台北市中正區XXX路XX號X樓",
      emailText: "【Email】info@twconnects.com",
      lineText: "【LINE】@030qreji",
      sitemap: "サイトマップ",
      links: [
        { label: "会社概要 / About Us", href: "/company" },
        { label: "サービス / Services", href: "/#services" },
        { label: "実績紹介 / Case Studies", href: "/cases" },
        { label: "ニュース・コラム / News & Articles", href: "/news" },
        { label: "お問い合わせ / Contact", href: "/contact" },
      ] as FooterLink[],
    },
    en: {
      companyName: "Taiwan Connect Inc.",
      desc:
        "We support overseas companies entering Taiwan with incorporation, accounting & tax, visa, and cross-border advisory.",
      addressJP:
        "[Japan] X-XX-XX, XX Town, XX-ku, Tokyo, XX Building, Floor X",
      addressTW:
        "[Taiwan] X Floor, No. XX, XXX Rd., Zhongzheng Dist., Taipei",
      emailText: "【Email】info@twconnects.com",
      lineText: "【LINE】@030qreji",
      sitemap: "Sitemap",
      links: [
        { label: "About Us", href: "/company" },
        { label: "Services", href: "/#services" },
        { label: "Case Studies", href: "/cases" },
        { label: "News & Articles", href: "/news" },
        { label: "Contact", href: "/contact" },
      ] as FooterLink[],
    },
  }[lang];

  // Links：優先用傳入，否則使用預設
  const navLinks: FooterLink[] = primaryLinks?.length ? primaryLinks : t.links;

  // 內部連結加上 ?lang=，外部保持原樣
  const normalizeHref = (href?: string) => {
    if (!href) return "#";
    if (/^https?:\/\//i.test(href)) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}lang=${lang}`;
  };

  // 品牌名稱與 Logo：支援向後相容 props 與 company 物件
  const displayCompanyName =
    (logoText ?? company?.name)?.trim() || t.companyName;

  const incomingLogo = (logoUrl ?? company?.logoUrl)?.trim() || "";
  // 若無有效遠端圖，回落到 /logo.png，避免看不到品牌
  const safeLogoSrc = isValidSrc(incomingLogo) ? incomingLogo : "/logo.png";

  const displayEmail = (contact?.email || "info@twconnects.com").trim();

  return (
    <footer className="text-slate-100" style={{ backgroundColor: BRAND_BG }}>
      {/* 上分隔線與內距 */}
      <div className="border-t border-white/15">
        <div className={`${CONTAINER} py-12 sm:py-16`}>
          {/* 三欄：公司敘述 / 聯絡資料 / 網站導覽 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            {/* 公司敘述 */}
            <section className="md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden ring-1 ring-white/20">
                  <Image
                    src={safeLogoSrc}
                    alt={displayCompanyName || "Taiwan Connect"}
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="font-semibold text-white">{displayCompanyName}</div>
              </div>
              <p className="mt-4 leading-7 text-slate-300">{t.desc}</p>
            </section>

            {/* 聯絡資訊 */}
            <section className="md:col-span-4">
              <ul className="space-y-3 text-slate-200">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                  <span>{t.addressJP}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                  <span>{t.addressTW}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                  <a
                    href={`mailto:${displayEmail}`}
                    className="text-white hover:text-sky-200 transition-colors"
                  >
                    {t.emailText}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <LineChart className="h-5 w-5 text-white/90 mt-1 shrink-0" />
                  <span>{t.lineText}</span>
                </li>
              </ul>
            </section>

            {/* 網站導覽 + 社群 */}
            <nav className="md:col-span-3">
              <div className="font-semibold text-white mb-3">
                {t.sitemap}
              </div>
              <ul className="space-y-2">
                {navLinks.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <Link
                      href={normalizeHref(l.href)}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noreferrer" : undefined}
                      className="text-slate-200 hover:text-sky-200 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 mt-5">
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/90 hover:text-sky-200"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-white/90 hover:text-sky-200"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-white/90 hover:text-sky-200"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://medium.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Medium"
                  className="text-white/90 hover:text-sky-200"
                >
                  <Globe2 className="h-5 w-5" />
                </Link>
                <Link
                  href="https://note.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="note"
                  className="text-white/90 hover:text-sky-200"
                >
                  <Globe2 className="h-5 w-5" />
                </Link>
              </div>
            </nav>
          </div>

          {/* 底線 */}
          <div className="mt-10 sm:mt-12 h-px w-full bg-white/10" />

          {/* 版權列 */}
          <div className="pt-6 text-center">
            <p className="text-sm text-slate-300">
              © {new Date().getFullYear()} {displayCompanyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
