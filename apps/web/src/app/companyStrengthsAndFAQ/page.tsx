// C:\Users\ta893\twconnect2\apps\web\src\app\companyStrengthsAndFAQ\page.tsx

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import React from "react";
import Image from "next/image";
import Link from "next/link"; // ✅ 新增：因為改用 Link CTA
import { notFound } from "next/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import {
  companyStrengthsAndFAQByLang,
  type CompanyStrengthsFAQ,
  type Lang,
} from "@/lib/queries/companyStrengthsAndFAQ";
import * as Lucide from "lucide-react";

export const revalidate = 60;
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
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
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

  /** HERO 第二行與第三行（先前已依語系固定） */
  const heroTitle =
    lang === "zh" ? "Our Strengths｜我們的優勢" : lang === "en" ? "Our Strengths" : "Our Strengths｜私たちの強み";

  const heroSubtitle =
    lang === "zh"
      ? "穩健支援，安心邁向國際舞台"
      : lang === "en"
      ? "Steady support for your global journey"
      : "安心して世界へ、一歩ずつ確実に";

  const crumb = lang === "zh" ? "Why Taiwan Connect" : lang === "en" ? "Why Taiwan Connect" : "会社情報";
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

      {/* HERO 區塊 */}
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

        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(0deg, rgba(28,61,90,${HERO_TUNE.overlayOpacity}), rgba(28,61,90,${HERO_TUNE.overlayOpacity}))` }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(1200px 400px at 20% 0%, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%), radial-gradient(1200px 400px at 80% 0%, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%)",
          }}
        />

        {/* 文字 + 透明遮罩 */}
        <div
          className="relative h-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center"
          style={{
            maxWidth: HERO_TUNE.contentMaxW,
            transform: "translateY(8%)",
          }}
        >
          <div className="inline-block max-w-3xl mx-auto rounded-3xl bg-white/55 backdrop-blur-[6px] shadow-lg border border-white/30 px-6 py-5 sm:px-8 sm:py-6">
            <p className="text-sm tracking-wide mb-1" style={{ color: BRAND_BLUE, letterSpacing: "0.05em" }}>
              {crumb}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: BRAND_BLUE }}>
              {heroTitle}
            </h1>
            <p className="mt-3 text-base sm:text-lg leading-relaxed" style={{ color: `${BRAND_BLUE}CC` }}>
              {heroSubtitle}
            </p>
          </div>
        </div>

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
  <h2 id="faq-heading" className="text-2xl font-semibold text-white">{data.faqTitle ?? labels.faq}</h2>
  {data.faqIntro && <p className="mt-2 max-w-3xl text-slate-100/85">{data.faqIntro}</p>}

  <div
    className="mt-6 overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md divide-y divide-white/20 shadow-[0_0_20px_rgba(0,0,0,0.25)]"
  >
    {(data.faqItems ?? []).map((f, i) => (
      <details
        key={`faq-${i}-${f.question}`}
        className="group px-6 py-5 open:bg-white/15 transition-colors"
      >
        <summary className="cursor-pointer list-none outline-none">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
                <Lucide.HelpCircle className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base font-medium text-white">{f.question}</span>
            </div>
            <div className="mt-0.5 h-7 w-7 rounded-full bg-white/10 border border-white/25 flex items-center justify-center transition-transform group-open:rotate-180">
              <Lucide.ChevronDown className="h-4 w-4 text-white" />
            </div>
          </div>
        </summary>
        {f.answer && <div className="mt-3 pl-12 text-slate-100/90">{f.answer}</div>}
      </details>
    ))}
  </div>
</section>

      </main>

      {/* ===== ✅ 新 Pre-Footer CTA（與 finance-advisory 同版型） ===== */}
      <section className="border-y" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="py-10 md:py-14 text-center">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              {heroSubtitle}
            </h3>

            <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Link
                href={`/contact?lang=${lang}`}
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold bg-white hover:bg-white/90"
                style={{ color: BRAND_BLUE, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
              >
                {labels.contactUs}
              </Link>

              <a
                href="mailto:info@twconnects.com"
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                info@twconnects.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ 頁尾也吃到正確語系 */}
      <FooterServer lang={lang} />
    </div>
  );
}
