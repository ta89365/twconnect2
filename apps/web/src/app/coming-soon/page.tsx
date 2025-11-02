// File: apps/web/src/app/coming-soon/page.tsx
// TW_Connect — "Page Under Construction" with multilingual copy and brand styles

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Async Server Components in this codebase
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";

export const revalidate = 60;
export const dynamic = "force-dynamic";

/* ============================== 視覺設定 ============================== */
const BRAND_BLUE = "#1C3D5A";

type Lang = "jp" | "zh" | "zh-cn" | "en";

/** zh-cn 一律視為 zh（繁體） */
function resolveLang(raw?: string | string[] | null): "jp" | "zh" | "en" {
  const v = String(Array.isArray(raw) ? raw[0] : raw ?? "").toLowerCase();
  if (v === "jp") return "jp";
  if (v === "zh-cn" || v === "zh") return "zh";
  if (v === "en") return "en";
  return "jp";
}

const COPY: Record<"jp" | "zh" | "en", {
  title: string;
  subtitle: string;
  desc: string;
  home: string;
  contact: string;
  note?: string;
}> = {
  jp: {
    title: "ページ準備中",
    subtitle: "もう少しだけお待ちください",
    desc: "現在、コンテンツを整備しております。公開までの間は、下記のリンクからトップページやお問い合わせをご利用いただけます。",
    home: "トップへ",
    contact: "お問い合わせ",
    note: "通常は1営業日以内にご返信いたします。",
  },
  zh: {
    title: "頁面準備中",
    subtitle: "內容正在上線前最後調整",
    desc: "我們正在整理與優化本頁內容。期間內如需協助，歡迎先回到首頁或直接聯繫我們。",
    home: "回到首頁",
    contact: "聯絡我們",
    note: "一般於一個工作日內回覆。",
  },
  en: {
    title: "Page Under Construction",
    subtitle: "We are putting on the finishing touches",
    desc: "This page is being prepared. In the meantime you can return to the home page or reach us through the contact page.",
    home: "Home",
    contact: "Contact",
    note: "We usually reply within one business day.",
  },
};

/* ============================== SEO ============================== */
export const metadata: Metadata = {
  title: "Coming Soon | Taiwan Connect",
  description: "This page is under construction. Please visit the home or contact us.",
  robots: { index: false, follow: true },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const lang = resolveLang(searchParams?.lang);
  const t = COPY[lang];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND_BLUE }}>
      {/* 導覽列 */}
      <NavigationServer lang={lang} />

      {/* 內容 */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* 背景裝飾 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(40rem 40rem at 20% -10%, rgba(255,255,255,0.18), rgba(0,0,0,0)), radial-gradient(28rem 28rem at 90% 10%, rgba(255,255,255,0.10), rgba(0,0,0,0))",
            }}
          />
          <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-28 text-white">
            {/* 標誌（使用 /public/images/logo-light.png） */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative h-10 w-10 rounded-2xl overflow-hidden ring-1 ring-white/20">
                <Image
                  src="/images/logo-light.png"
                  alt="Taiwan Connect"
                  fill
                  className="object-contain p-1.5"
                  sizes="40px"
                />
              </div>
              <span className="text-xl/6 font-semibold tracking-wide">Taiwan Connect</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{t.title}</h1>
            <p className="mt-3 text-lg md:text-xl text-white/90">{t.subtitle}</p>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-white/85">{t.desc}</p>
            {t.note ? <p className="mt-2 text-sm text-white/70">{t.note}</p> : null}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium shadow-md transition-colors bg-[#4A90E2] hover:bg-[#5AA2F0] text-white"
              >
                {t.home}
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium shadow-md transition-colors bg-[#4A90E2] hover:bg-[#5AA2F0] text-white"
              >
                {t.contact}
              </Link>
            </div>

            {/* 插圖（使用 /public/images/coming-soon-illustration.jpg） */}
            <div className="mt-14 relative w-full max-w-3xl aspect-[16/9] rounded-3xl overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/coming-soon-illustration.jpg"
                alt="Under construction illustration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          </div>
        </section>
      </main>

      {/* 頁尾 */}
      <FooterServer lang={lang} />
    </div>
  );
}
