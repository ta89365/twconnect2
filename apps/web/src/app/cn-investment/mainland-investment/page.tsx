// File: apps/web/src/app/cn-investment/mainland-investment/page.tsx
import React from "react";
import type { JSX } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextComponents } from "@portabletext/react";
import * as Lucide from "lucide-react";

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { Noto_Sans_SC } from "next/font/google";
import { sfetch } from "@/lib/sanity/fetch";
import {
  mainlandInvestmentGuideEntrance,
  mainlandInvestmentGuideBySlug,
} from "@/lib/queries/mainlandInvestmentGuide";

// ============================ CONFIG ============================
export const dynamic = "force-dynamic";
export const revalidate = 60;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = 1100;
const HERO_MIN_H = "52vh";
const HERO_OVERLAY =
  "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.40) 100%)";

// ✅ 固定簡中字體
const notoSC = Noto_Sans_SC({ subsets: ["latin"], weight: ["400", "500", "700"] });

// ============================ TYPES ============================
type Section = {
  heading?: string;
  content?: PortableTextBlock[];
  tips?: PortableTextBlock[];
};

type Article = {
  id: string;
  slug: string;
  publishDate?: string;
  title: string;
  subtitle?: string;
  intro?: PortableTextBlock[];
  heroImage?: {
    url?: string;
    alt?: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
  sections?: Section[];
  conclusion?: PortableTextBlock[];
  contactEmail?: string;
  contactLine?: string;
};

type EntranceItem = { id: string; slug: string };

// ============================ HELPERS ============================
function fmtDate(d?: string) {
  if (!d) return "";
  const dd = new Date(d);
  if (isNaN(dd.getTime())) return "";
  const y = dd.getFullYear();
  const m = String(dd.getMonth() + 1).padStart(2, "0");
  const da = String(dd.getDate()).padStart(2, "0");
  return `${y}/${m}/${da}`;
}

const ptComponents: PortableTextComponents = {
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
  },
  block: {
    normal: ({ children }) => <p className="leading-7">{children}</p>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="opacity-90">{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      return (
        <a href={href} target="_blank" rel="noreferrer" className="underline">
          {children}
        </a>
      );
    },
  },
};

// ============================ ICON MAP ============================
const SECTION_ICONS: (keyof typeof Lucide)[] = [
  "ShieldCheck",
  "FileText",
  "Building2",
  "Scale",
  "Users",
  "Stamp",
  "Globe2",
  "BriefcaseBusiness",
  "ClipboardCheck",
  "Layers",
];

function iconForIndex(idx: number) {
  const key = SECTION_ICONS[idx % SECTION_ICONS.length] ?? "FileText";
  const Icon = (Lucide as any)[key] as React.ComponentType<{ className?: string }>;
  return Icon ?? Lucide.FileText;
}

// ============================ MAIN PAGE ============================
export default async function Page(): Promise<JSX.Element> {
  // 取得最新文章 slug
  const entrance = (await sfetch(mainlandInvestmentGuideEntrance, { limit: 1 })) as EntranceItem[];
  const latest = entrance?.[0];
  if (!latest?.slug) notFound();

  // 讀取單篇內容
  const doc = (await sfetch(mainlandInvestmentGuideBySlug, { slug: latest.slug })) as Article | null;
  if (!doc?.id) notFound();

  const heroUrl = doc?.heroImage?.url ?? "";
  const heroAlt = doc?.heroImage?.alt ?? doc?.title ?? "";
  const sectionCount = (doc?.sections ?? []).length;

  return (
    <div className={notoSC.className} style={{ backgroundColor: BRAND_BLUE, color: "white" }}>
      {/* ✅ 導覽列固定簡中 */}
      <NavigationServer lang="zh-cn" />

      {/* ================= HERO ================= */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: HERO_MIN_H,
          background:
            heroUrl.length > 0
              ? `${HERO_OVERLAY}, url(${heroUrl}) center/cover no-repeat`
              : BRAND_BLUE,
        }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] opacity-20"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#g1)" />
        </svg>

        <div className="mx-auto px-6 pb-10 pt-28" style={{ maxWidth: CONTENT_MAX_W }}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {doc?.publishDate ? (
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                發佈 {fmtDate(doc.publishDate)}
              </span>
            ) : null}
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
              章節 {sectionCount}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{doc.title}</h1>
          {doc?.subtitle ? (
            <p className="mt-3 max-w-3xl text-base opacity-95 md:text-lg">{doc.subtitle}</p>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-center gap-2">
                <Lucide.ShieldCheck className="h-5 w-5" />
                <span className="text-sm opacity-95">法遵視角</span>
              </div>
              <p className="mt-2 text-sm opacity-90">
                以投審、兩岸條例相關規範為主軸，聚焦實務判斷邏輯。
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-center gap-2">
                <Lucide.Layers className="h-5 w-5" />
                <span className="text-sm opacity-95">分層結構</span>
              </div>
              <p className="mt-2 text-sm opacity-90">
                將重點拆成模組章節，方便跨頁引用與維護。
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-center gap-2">
                <Lucide.ClipboardCheck className="h-5 w-5" />
                <span className="text-sm opacity-95">實務建議</span>
              </div>
              <p className="mt-2 text-sm opacity-90">
                每節附上 Tips，快速落地到決策與文件準備。
              </p>
            </div>
          </div>
        </div>

        {heroUrl ? (
          <Image src={heroUrl} alt={heroAlt} fill className="opacity-0" priority sizes="100vw" />
        ) : null}
      </section>

      {/* ================= BODY ================= */}
      <main className="mx-auto px-6 pb-24" style={{ maxWidth: CONTENT_MAX_W }}>
        {doc?.intro?.length ? (
          <div className="prose prose-invert mt-10 max-w-none">
            <PortableText value={doc.intro} components={ptComponents} />
          </div>
        ) : null}

        {/* 章節內容 */}
        <div className="mt-10 space-y-6">
          {(doc?.sections ?? []).map((sec, idx) => {
            const Icon = iconForIndex(idx);
            return (
              <section
                key={`sec-${idx}`}
                className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/7 p-6 md:p-8"
                style={{
                  boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="absolute left-0 top-0 h-1.5 w-24 bg-white/45" />
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-semibold leading-snug">
                      {sec.heading ?? `章節 ${idx + 1}`}
                    </h2>
                    {sec.content?.length ? (
                      <div className="prose prose-invert mt-4 max-w-none">
                        <PortableText value={sec.content} components={ptComponents} />
                      </div>
                    ) : null}
                    {sec.tips?.length ? (
                      <div className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-400/12 p-4">
                        <div className="mb-1 flex items-center gap-2 text-sm uppercase tracking-wider opacity-95">
                          <Lucide.Lightbulb className="h-4 w-4" />
                          實務建議
                        </div>
                        <div className="prose prose-invert max-w-none">
                          <PortableText value={sec.tips} components={ptComponents} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* 結論 */}
        {doc?.conclusion?.length ? (
          <section className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2">
              <Lucide.Sparkles className="h-5 w-5" />
              <h3 className="text-xl font-semibold">重點整理</h3>
            </div>
            <div className="prose prose-invert max-w-none">
              <PortableText value={doc.conclusion} components={ptComponents} />
            </div>
          </section>
        ) : null}

        {/* 聯絡我們 */}
        {(doc?.contactEmail || doc?.contactLine) && (
          <section className="mt-10 overflow-hidden rounded-3xl border border-white/15 bg-white/10">
            <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
              <div className="p-6 md:p-8">
                <div className="mb-2 text-sm uppercase tracking-wider opacity-90">
                  需要更進一步的協助嗎
                </div>
                <h4 className="text-2xl font-semibold md:text-3xl">與顧問快速確認判斷方向</h4>
                <p className="mt-3 max-w-xl text-sm opacity-95">
                  針對 UBO、控制權層級、投審會文件準備與申請流程，我們可協助進一步盤點與規劃。
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {doc.contactEmail ? (
                    <a
                      href={`mailto:${doc.contactEmail}`}
                      className="rounded-xl border border-white/20 bg-white/90 px-4 py-2 text-sm font-medium"
                      style={{ color: BRAND_BLUE }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Lucide.Mail className="h-4 w-4" />
                        {doc.contactEmail}
                      </span>
                    </a>
                  ) : null}
                  {doc.contactLine ? (
                    <span className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Lucide.MessageCircle className="h-4 w-4" />
                        LINE：{doc.contactLine}
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="relative hidden min-h-[180px] md:block">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 300"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="cta" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="400" height="300" fill="url(#cta)" />
                  <circle cx="320" cy="60" r="36" fill="#FFFFFF" opacity="0.2" />
                  <circle cx="360" cy="220" r="22" fill="#FFFFFF" opacity="0.12" />
                  <circle cx="280" cy="180" r="14" fill="#FFFFFF" opacity="0.18" />
                </svg>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ✅ Footer 改為簡中版本 */}
      <FooterServer lang="zh-cn" />
    </div>
  );
}
