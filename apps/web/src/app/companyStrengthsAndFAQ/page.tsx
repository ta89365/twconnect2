// C:\Users\ta893\twconnect2\apps\web\src\app\companyStrengthsAndFAQ\page.tsx

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import {
  companyStrengthsAndFAQByLang,
  type CompanyStrengthsFAQ,
  type Lang,
} from "@/lib/queries/companyStrengthsAndFAQ";
import * as Lucide from "lucide-react";

export const revalidate = 60;
// ✅ 讓 ?lang=jp|zh|en 逐請求生效
export const dynamic = "force-dynamic";

/** 語言解析（?lang=jp|zh|en） */
function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "jp";
}

const BRAND_BLUE = "#1C3D5A";

/* ============================ 視覺調整區 ============================ */
const HERO_TUNE = {
  height: 420,
  overlayOpacity: 0.35,
  contentMaxW: "72rem",
  image: {
    useHotspot: true,
    x: 50,
    y: 65,
  },
} as const;

type IconName =
  | "Globe"
  | "Scale"
  | "Handshake"
  | "Target"
  | "ShieldCheck"
  | "LineChart"
  | "Building2"
  | "Users"
  | "BookOpenText"
  | "FileCheck"
  | "Compass"
  | "Sparkles";

const ICON_MAP: Record<IconName, React.ComponentType<any>> = {
  Globe: Lucide.Globe,
  Scale: Lucide.Scale,
  Handshake: Lucide.Handshake,
  Target: Lucide.Target,
  ShieldCheck: Lucide.ShieldCheck,
  LineChart: Lucide.LineChart,
  Building2: Lucide.Building2,
  Users: Lucide.Users,
  BookOpenText: Lucide.BookOpenText,
  FileCheck: Lucide.FileCheck,
  Compass: Lucide.Compass,
  Sparkles: Lucide.Sparkles,
};

function pickIconByTitle(title?: string): IconName {
  const t = (title ?? "").toLowerCase();
  if (/(合規|法規|コンプライアンス|compliance|regulation)/.test(t)) return "ShieldCheck";
  if (/(會計|会計|税|稅|tax|account|finance)/.test(t)) return "Scale";
  if (/(跨境|クロスボーダー|cross|global|international|國際)/.test(t)) return "Globe";
  if (/(人脈|ネットワーク|network|partner|alliance)/.test(t)) return "Handshake";
  if (/(成長|growth|scal|擴張|拡大)/.test(t)) return "LineChart";
  if (/(策略|strategy|戦略|target|定位)/.test(t)) return "Target";
  if (/(企業|公司|法人|会社|enterprise|corporate)/.test(t)) return "Building2";
  if (/(團隊|チーム|team|experts|專家)/.test(t)) return "Users";
  if (/(知識|ナレッジ|knowledge|指南|guide|手冊)/.test(t)) return "BookOpenText";
  if (/(流程|手續|プロセス|process|document)/.test(t)) return "FileCheck";
  if (/(導覽|方向|指引|方針|navigate|方向性)/.test(t)) return "Compass";
  return "Sparkles";
}

function resolveIconComp(iconKey?: string | null, title?: string) {
  const key = (iconKey ?? "").trim();
  if (key && (ICON_MAP as any)[key]) return (ICON_MAP as any)[key] as React.ComponentType<any>;
  const guess = pickIconByTitle(title);
  return ICON_MAP[guess];
}

function CornerAccent() {
  return (
    <svg aria-hidden="true" className="absolute -top-6 -right-6 h-24 w-24 opacity-20" viewBox="0 0 100 100" fill="none">
      <path d="M5 95 L95 5" stroke="white" strokeOpacity="0.35" strokeWidth="3" />
      <path d="M25 95 L95 25" stroke="white" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M45 95 L95 45" stroke="white" strokeOpacity="0.15" strokeWidth="2" />
    </svg>
  );
}

/** 依調整區與 hotspot 產生 object-position 百分比字串 */
function objectPositionFrom(h?: { x?: number; y?: number } | null): string {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const useSpot = HERO_TUNE.image.useHotspot && typeof h?.x === "number" && typeof h?.y === "number";
  const x = clamp(useSpot ? h!.x! : HERO_TUNE.image.x);
  const y = clamp(useSpot ? h!.y! : HERO_TUNE.image.y);
  return `${x}% ${y}%`;
}

export default async function CompanyStrengthsAndFAQPage({
  searchParams,
}: {
  // ✅ 允許 Promise 型別，避免同步 API 錯誤
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  // ✅ 先把 searchParams 攤平成同步物件
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await searchParams
      : (searchParams as { lang?: string } | undefined);

  const lang = resolveLang(spRaw);

  const data = await sfetch<CompanyStrengthsFAQ | null>(companyStrengthsAndFAQByLang, { lang });
  if (!data) notFound();

  const labels = data.labels ?? {
    strengths: lang === "zh" ? "我們的優勢" : lang === "en" ? "Our Strengths" : "私たちの強み",
    faq: lang === "zh" ? "常見問題" : lang === "en" ? "FAQ" : "よくある質問",
    contactUs: lang === "zh" ? "聯絡我們" : lang === "en" ? "Contact us" : "お問い合わせ",
  };

  const pageIntro =
    lang === "zh"
      ? "以台灣為中心的跨境顧問服務與常見問題彙整"
      : lang === "en"
      ? "Cross border advisory centered on Taiwan and a concise FAQ"
      : "台湾を起点としたクロスボーダー支援とFAQのご案内";

  const crumb = lang === "zh" ? "公司介紹" : lang === "en" ? "Company" : "会社情報";
  const ctaText = labels.contactUs;

  const heroUrl = data.heroImage?.url ?? null;
  const heroAlt = data.heroImage?.alt ?? "";
  const heroHotspot = data.heroImage?.hotspot ?? null;
  const heroBlur = data.heroImage?.lqip ?? undefined;
  const heroPos = objectPositionFrom(heroHotspot);

  return (
    <div className="min-h-screen text-white" style={{ background: BRAND_BLUE }}>
      {/* ✅ 導覽列吃到正確語系 */}
      <NavigationServer lang={lang} />

      {/* HERO 區塊：導覽列下，品牌藍為底，疊 Sanity 圖片 */}
      <header className="relative w-full" style={{ height: `${HERO_TUNE.height}px`, background: BRAND_BLUE }}>
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: heroPos }}
            placeholder={heroBlur ? "blur" : "empty"}
            blurDataURL={heroBlur}
          />
        )}

        {/* 深藍覆蓋層：確保與全站品牌一致 */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(0deg, rgba(28,61,90,${HERO_TUNE.overlayOpacity}), rgba(28,61,90,${HERO_TUNE.overlayOpacity}))` }}
        />

        {/* 額外光暈層次 */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 400px at 20% 0%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%), radial-gradient(1200px 400px at 80% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%)",
          }}
        />

{/* 文字 + 透明遮罩（品牌藍字） */}
<div
  className="relative h-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center"
  style={{
    maxWidth: HERO_TUNE.contentMaxW,
    transform: "translateY(8%)",
  }}
>
  <div
    className="inline-block max-w-3xl mx-auto rounded-3xl bg-white/55 backdrop-blur-[6px] shadow-lg border border-white/30 px-6 py-5 sm:px-8 sm:py-6"
  >
    <p
      className="text-sm tracking-wide mb-1"
      style={{ color: BRAND_BLUE, letterSpacing: "0.05em" }}
    >
      {crumb}
    </p>
    <h1
      className="text-4xl sm:text-5xl font-bold tracking-tight"
      style={{ color: BRAND_BLUE }}
    >
      {data.title ?? "Our Strengths"}
    </h1>
    <p
      className="mt-3 text-base sm:text-lg leading-relaxed"
      style={{ color: `${BRAND_BLUE}CC` }}
    >
      {pageIntro}
    </p>
  </div>
</div>

        {/* 分隔線 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/15" />
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {/* Strengths */}
        <section aria-labelledby="strengths-heading" className="pt-10">
          <div className="flex items-baseline justify-between gap-6">
            <h2 id="strengths-heading" className="text-2xl font-semibold text-white">
              {labels.strengths}
            </h2>
            <div className="text-sm text-slate-200/80">{data.strengthsCount ?? data.strengths?.length ?? 0}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {(data.strengths ?? []).map((item, idx) => {
              const Icon = resolveIconComp(item.icon ?? undefined, item.title ?? undefined);
              return (
                <article
                  key={`s-${idx}-${item.title}`}
                  className="relative rounded-2xl border border-white/15 bg-white/5 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:bg-white/7.5"
                >
                  <CornerAccent />
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 h-10 w-10 shrink-0 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-white">{item.title}</h3>
                      {item.body && <p className="mt-2 whitespace-pre-line text-slate-100/90">{item.body}</p>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-white/10" />

        {/* FAQ */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold text白">{data.faqTitle ?? labels.faq}</h2>
          {data.faqIntro && <p className="mt-2 max-w-3xl text-slate-100/85">{data.faqIntro}</p>}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg白/5 backdrop-blur-sm divide-y divide-white/10">
            {(data.faqItems ?? []).map((f, i) => (
              <details key={`faq-${i}-${f.question}`} className="group px-5 py-4 open:bg白/7.5 transition">
                <summary className="cursor-pointer list-none outline-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg白/15 border border-white/20 flex items-center justify-center">
                        <Lucide.HelpCircle className="h-4 w-4 text白" />
                      </div>
                      <span className="text-base font-medium text白">{f.question}</span>
                    </div>
                    <div className="mt-0.5 h-7 w-7 rounded-full bg白/10 border border-white/20 flex items-center justify-center transition group-open:rotate-180">
                      <Lucide.ChevronDown className="h-4 w-4 text白" />
                    </div>
                  </div>
                </summary>
                {f.answer && <div className="mt-3 pl-11 text-slate-100/90">{f.answer}</div>}
              </details>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              // ✅ 保留 from 並帶上 lang，避免跳頁後語言重置
              href={`/contact?from=companyStrengthsAndFAQ${lang ? `&lang=${lang}` : ""}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-slate-900 bg白 hover:bg-slate-100 shadow-sm"
            >
              <Lucide.MessageCircle className="h-4 w-4" />
              {ctaText}
            </a>
            <span className="text-sm text-slate-100/85">
              {lang === "zh" ? "首次諮詢免費" : lang === "en" ? "The first consultation is free" : "初回相談は無料です"}
            </span>
          </div>
        </section>
      </main>

      {/* ✅ 頁尾也吃到正確語系 */}
      <FooterServer lang={lang} />
    </div>
  );
}
