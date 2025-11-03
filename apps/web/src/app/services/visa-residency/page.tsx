/// apps/web/src/app/services/visa-residency/page.tsx

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";

import { sfetch } from "@/lib/sanity/fetch";
import {
  visaResidencySupportBySlug,
  resolveLang,
  type Lang,
} from "@/lib/queries/visaResidencySupport";

export const revalidate = 60;
export const dynamicParams = false;

/* ============================ 視覺調整區 ============================
   只需修改此區即可完成視覺微調（Hero 高度、圖片與文字位置、容器寬度等） */
const BRAND_BLUE = "#1C3D5A";

/** Hero 圖片焦點（0~100），影響 object-position */
const HERO_FOCAL = { x: 62, y: 42 };

/** Hero 高度（更矮一些） */
const HERO_DIM = {
  hSm: 380,  // px @base
  hMd: 480,  // px @md+
};

/** Hero 圖片位移與縮放（px、倍數） */
const HERO_IMG_CTRL = {
  offsetX: 0,   // 向右為正
  offsetY: -10, // 向下為正
  zoom: 1,      // 1=原尺寸，>1 放大
};

/** Hero 文字物件位置與寬度（px 或 %） */
const HERO_TEXT_TUNE = {
  top: "46%",        // 文字框頂端
  left: "50%",       // 文字框左側（下方有 translateX(-50%) 置中）
  maxWidth: "760px", // 文字框最大寬
  align: "center" as "left" | "center" | "right",
  titleSizeBase: "34px",
  titleSizeMd: "44px",
};

/** 內文容器寬度與左右 padding：整體再向左右延伸一些 */
const CONTAINER_W = "max-w-7xl";           // 7xl ≈ 1280px
const CONTAINER_X = "px-5 sm:px-6 lg:px-10";

/** 段落上下間距節奏 */
const SECTION_Y_GAP = "py-12 md:py-16";

/** 錨點偏移（避免被 sticky 快捷列遮住） */
const ANCHOR_OFFSET = "scroll-mt-[92px] md:scroll-mt-[112px]";

/** 🔸服務內容卡片最小高度（把容器調高 2 倍）*/
const SERVICE_CARD_BASE_MIN_H = 160;        // 原基準
const SERVICE_CARD_SCALE = 2;               // 放大 2 倍
const SERVICE_CARD_MIN_H = SERVICE_CARD_BASE_MIN_H * SERVICE_CARD_SCALE;
/* ================================================================== */

// 保障 0~100 範圍
const clamp01 = (n: number) => Math.max(0, Math.min(100, n));
const heroObjectPosition = `${clamp01(HERO_FOCAL.x)}% ${clamp01(HERO_FOCAL.y)}%`;

type FlowStep = { order?: string; title?: string; desc?: string };
type VisaResidencyItem = {
  title?: string;
  background?: string;
  challenges?: string[];
  services?: string[];           // 一般簽證與居留支援（已設公司或符合資格）
  incubationTrack?: string[];    // 育成計畫（尚未設公司）
  serviceFlow?: FlowStep[];
  fees?: string;
  heroImage?: { asset?: { url?: string | null } | null } | null;
  ctaLabel?: string;
};

function t(lang: Lang, dict: Record<Lang | "common", string>) {
  return dict[lang] ?? dict.common;
}

/* 兩個服務卡片的內建多語標題（不從 Sanity 帶） */
function getServiceCardTitles(lang: Lang) {
  const general = {
    jp: "一般ビザ・居留サポート（会社設立済みまたは条件を満たす方向け）",
    zh: "一般簽證與居留支援（適用於已設公司或符合資格者）",
    en: "General Visa & Residency Support (for established companies or qualified applicants)",
  } as const;

  const incub = {
    jp: "育成計画（インキュベーション・プラン）— 会社未設立の方向け",
    zh: "育成計畫（Incubation Track）— 適用於尚未設公司者",
    en: "Incubation Track — For applicants without an existing company",
  } as const;

  return {
    general: general[lang] ?? general.jp,
    incub: incub[lang] ?? incub.jp,
  };
}

/* ============================ 小型元件 ============================ */

function SectionHeading({
  lang,
  jp,
  zh,
  en,
  sub,
}: {
  lang: Lang;
  jp: string;
  zh: string;
  en: string;
  sub?: string | null;
}) {
  const text = t(lang, { jp, zh, en, common: jp });
  return (
    <header className="mb-6 md:mb-8">
      <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight">{text}</h2>
      {sub ? <p className="mt-2 text-base md:text-[17px] opacity-85">{sub}</p> : null}
      <div className="mt-4 h-[3px] w-16 rounded-full bg-white/25" />
    </header>
  );
}

/** 簡易清單（帶 emoji 點綴） */
function EmojiList({
  items,
  emoji = "•",
  className = "",
}: {
  items?: string[];
  emoji?: string;
  className?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((txt, i) => (
        <li key={i} className="leading-relaxed flex gap-3">
          <span aria-hidden className="shrink-0">{emoji}</span>
          <span className="opacity-95">{txt}</span>
        </li>
      ))}
    </ul>
  );
}

/** 垂直時間軸卡片 */
function Timeline({ steps }: { steps?: FlowStep[] }) {
  if (!steps || steps.length === 0) return null;
  return (
    <ol className="relative ml-4 pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/15" />
      {steps.map((s, i) => (
        <li key={i} className="mb-7 last:mb-0 relative">
          <div className="absolute -left-[22px] mt-1 h-4 w-4 rounded-full bg-white/85 ring-4 ring-white/20" />
          <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
            <div className="text-[11px] md:text-xs uppercase tracking-wide opacity-80">
              {s.order ?? `0${i + 1}`}
            </div>
            <div className="mt-1 text-[18px] font-semibold">{s.title}</div>
            {s.desc ? <p className="mt-2 text-sm leading-relaxed opacity-90">{s.desc}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ============================ 主頁面 ============================ */

export default async function VisaResidencyStaticPage({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await searchParams
      : (searchParams as { lang?: string } | undefined);

  const lang: Lang = resolveLang(spRaw?.lang);
  const slug = "visa-residency-support";

  const item = (await sfetch(visaResidencySupportBySlug, {
    slug,
    lang,
  })) as VisaResidencyItem | null;

  if (!item) return notFound();

  const {
    title,
    background,
    challenges = [],
    services = [],
    incubationTrack = [],
    serviceFlow = [],
    fees,
    heroImage,
    ctaLabel,
  } = item;

  const heroUrl = heroImage?.asset?.url ?? null;

  const labels = {
    breadcrumb: t(lang, {
      jp: "ホーム / サービス / ビザ・在留支援",
      zh: "首頁 / 服務內容 / 簽證與居留支援",
      en: "Home / Services / Visa and Residency",
      common: "首頁 / 服務內容 / 簽證與居留支援",
    }),
    background: t(lang, { jp: "背景", zh: "背景", en: "Background", common: "背景" }),
    challenges: t(lang, { jp: "課題", zh: "挑戰", en: "Challenges", common: "挑戰" }),
    services: t(lang, { jp: "サービス内容", zh: "服務內容", en: "Services", common: "服務內容" }),
    flow: t(lang, { jp: "サービスの流れ", zh: "服務流程", en: "Service Flow", common: "服務流程" }),
    fees: t(lang, { jp: "料金（参考）", zh: "費用參考", en: "Fees (Reference)", common: "費用參考" }),
    contact:
      ctaLabel ?? t(lang, { jp: "お問い合わせ", zh: "聯絡我們", en: "Contact Us", common: "聯絡我們" }),
    ctaSub: t(lang, {
      jp: "案件内容に応じて最適なプランをご提案します",
      zh: "將依據您的條件提供最合適的申請方案",
      en: "We tailor the right plan to your case",
      common: "將依據您的條件提供最合適的申請方案",
    }),
    quickInfo: t(lang, {
      jp: "対応可能な在留・ビザの一例",
      zh: "常見簽證與居留類型",
      en: "Typical visa and residency categories",
      common: "常見簽證與居留類型",
    }),
  };

  const { general: generalTitle, incub: incubTitle } = getServiceCardTitles(lang);

  const visaBadges = [
    t(lang, { jp: "経営管理", zh: "經營管理", en: "Entrepreneur", common: "經營管理" }),
    t(lang, { jp: "就労", zh: "工作簽", en: "Work", common: "工作簽" }),
    t(lang, { jp: "投資", zh: "投資簽", en: "Investment", common: "投資簽" }),
    t(lang, { jp: "家族帯同", zh: "家屬陪同", en: "Dependent", common: "家屬陪同" }),
    t(lang, { jp: "延長・更新", zh: "延長與更新", en: "Extension", common: "延長與更新" }),
  ];

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ backgroundColor: BRAND_BLUE }}>
      <NavigationServer lang={lang} />

      {/* ============================== Hero ============================== */}
      <section className="relative w-full">
        <div
          className="relative overflow-hidden"
          style={{
            height: `${HERO_DIM.hSm}px`,
          }}
        >
          <div className="hidden md:block" style={{ height: `${HERO_DIM.hMd}px` }} />

          {heroUrl ? (
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translate(${HERO_IMG_CTRL.offsetX}px, ${HERO_IMG_CTRL.offsetY}px) scale(${HERO_IMG_CTRL.zoom})`,
                transformOrigin: "center",
              }}
            >
              <Image
                src={heroUrl}
                alt={title ?? ""}
                fill
                sizes="100vw"
                priority
                className="object-cover"
                style={{ objectPosition: heroObjectPosition }}
              />
            </div>
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: BRAND_BLUE }} />
          )}

          {/* 疊加漸層：頂部深壓、中央透明、底部品牌藍過渡 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0f2334]/25 to-[rgba(28,61,90,0.92)]" />

          {/* 文字區（可自由定位） */}
          <div
            className="absolute z-10"
            style={{
              top: HERO_TEXT_TUNE.top,
              left: HERO_TEXT_TUNE.left,
              transform: "translate(-50%, -50%)",
              maxWidth: HERO_TEXT_TUNE.maxWidth,
              textAlign: HERO_TEXT_TUNE.align,
            }}
          >
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/12 border border-white/18 px-4 py-1 text-xs md:text-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
                {labels.breadcrumb}
              </div>
            </div>
            <h1
              className="font-bold tracking-tight drop-shadow-sm"
              style={{
                fontSize: `clamp(${HERO_TEXT_TUNE.titleSizeBase}, 4.5vw, ${HERO_TEXT_TUNE.titleSizeMd})`,
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {visaBadges.map((b, i) => (
                <span
                  key={i}
                  className="text-sm md:text-base bg-white/12 border border-white/18 px-3 py-1 rounded-full"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero 底部柔光帶，與主體連接更自然 */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-1/3 h-24 blur-3xl opacity-70"
          style={{ backgroundColor: BRAND_BLUE }}
        />
      </section>

      {/* ============================ 快速導覽（吸頂） ============================ */}
      <nav className="sticky top-0 z-30 bg-[rgba(28,61,90,0.88)] backdrop-blur-md border-b border-white/12">
        <div className={`${CONTAINER_W} mx-auto ${CONTAINER_X} py-3 flex flex-wrap gap-2 justify-center text-sm md:text-base`}>
          <a href="#bg" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
            {labels.background}
          </a>
          {challenges.length > 0 && (
            <a href="#ch" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
              {labels.challenges}
            </a>
          )}
          {(services.length > 0 || incubationTrack.length > 0) && (
            <a href="#sv" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
              {labels.services}
            </a>
          )}
          {serviceFlow.length > 0 && (
            <a href="#fl" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
              {labels.flow}
            </a>
          )}
          {fees && (
            <a href="#fe" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
              {labels.fees}
            </a>
          )}
        </div>
      </nav>

      {/* =============================== 內容區 =============================== */}
      <main className="relative z-10">
        <div className={`${CONTAINER_W} mx-auto w-full ${CONTAINER_X} text-[17px] md:text-[18px]`}>
          <div className={`${SECTION_Y_GAP} grid gap-10 md:gap-12 lg:grid-cols-[1fr,360px]`}>
            {/* ------------------------------ 主內容 ------------------------------ */}
            <div className="space-y-12">
              {/* 背景 */}
              <section id="bg" className={ANCHOR_OFFSET}>
                <SectionHeading lang={lang} jp="背景" zh="背景" en="Background" />
                {background ? (
                  <article className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7 leading-relaxed whitespace-pre-line">
                    {background}
                  </article>
                ) : null}
              </section>

              {/* 課題 / 挑戰 */}
{challenges.length > 0 && (
  <section id="ch" className={ANCHOR_OFFSET}>
    <SectionHeading lang={lang} jp="課題" zh="挑戰" en="Challenges" />
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7">
        <EmojiList
          items={challenges.slice(0, Math.ceil(challenges.length / 2))}
          emoji="⚠️"
        />
      </div>
      <div className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7">
        <EmojiList
          items={challenges.slice(Math.ceil(challenges.length / 2))}
          emoji="🧩"
        />
      </div>
    </div>
  </section>
)}


{/* 服務內容：左＝一般簽證與居留支援；右＝育成計畫 */}
{(services.length > 0 || incubationTrack.length > 0) && (
  <section id="sv" className={ANCHOR_OFFSET}>
    <SectionHeading lang={lang} jp="サービス内容" zh="服務內容" en="Services" />
    <div className="grid md:grid-cols-2 gap-5">
      {/* 左卡：一般簽證與居留支援 */}
      {services.length > 0 && (
        <div className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7">
          <h3 className="text-[16px] md:text-[17px] font-semibold mb-3 opacity-95">
            {generalTitle}
          </h3>
          <EmojiList items={services} emoji="✅" />
        </div>
      )}

      {/* 右卡：育成計畫 */}
      {incubationTrack.length > 0 && (
        <div className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7">
          <h3 className="text-[16px] md:text-[17px] font-semibold mb-3 opacity-95">
            {incubTitle}
          </h3>
          <EmojiList items={incubationTrack} emoji="🛠️" />
        </div>
      )}
    </div>
  </section>
)}

              {/* 服務流程 */}
              {serviceFlow.length > 0 && (
                <section id="fl" className={ANCHOR_OFFSET}>
                  <SectionHeading lang={lang} jp="サービスの流れ" zh="服務流程" en="Service Flow" />
                  <Timeline steps={serviceFlow} />
                </section>
              )}

              {/* 費用參考 */}
              {fees && (
                <section id="fe" className={ANCHOR_OFFSET}>
                  <SectionHeading lang={lang} jp="料金（参考）" zh="費用參考" en="Fees (Reference)" />
                  <div className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7">
                    <p className="whitespace-pre-line leading-relaxed">{fees}</p>
                  </div>
                </section>
              )}
            </div>

            {/* ------------------------------ 右側欄 ------------------------------ */}
            <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
              {/* 快速說明卡 */}
              <div className="bg-white/8 border border-white/15 rounded-2xl p-6 text-center">
                <div className="text-xs uppercase tracking-wide opacity-85">
                  {labels.quickInfo}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {visaBadges.map((b, i) => (
                    <div
                      key={i}
                      className={`rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-center ${
                        i === visaBadges.length - 1 ? "col-span-2" : ""
                      }`}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA 卡 */}
              <div
                className="border border-white/15 rounded-2xl p-6 text-center"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))" }}
              >
                <div className="text-lg font-semibold">{labels.contact}</div>
                <p className="mt-2 text-sm opacity-90">{labels.ctaSub}</p>
                <div className="mt-5 flex gap-3 justify-center">
                  <a
                    href={`/contact?lang=${lang}`}
                    className="inline-flex items-center justify-center rounded-lg bg-white text-[#1C3D5A] font-semibold px-4 py-2 hover:bg-gray-100 transition"
                  >
                    {t(lang, { jp: "問い合わせ", zh: "聯絡我們", en: "Get in touch", common: "聯絡我們" })}
                  </a>
                  <a
                    href="https://line.me/R/ti/p/@030qreji"
                    className="inline-flex items-center justify-center rounded-lg bg-white/10 border border-white/20 px-4 py-2 hover:bg-white/15 transition"
                  >
                    LINE
                  </a>
                </div>
                <div className="mt-4 text-xs opacity-75">
                  {t(lang, {
                    jp: "※ 事案や条件により費用と期間が異なります。まずはお気軽にご相談ください。",
                    zh: "※ 依案件與條件不同，費用與時程會有所差異，歡迎先與我們討論。",
                    en: "Note: Fees and timelines vary by case. Contact us for a tailored assessment.",
                    common: "※ 依案件與條件不同，費用與時程會有所差異，歡迎先與我們討論。",
                  })}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ============================== 底部整寬 CTA ============================== */}
      <section className={`border-t border-white/12 ${SECTION_Y_GAP} text-center`}>
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl md:text-2xl font-semibold">
            {t(lang, {
              jp: "最適な在留・ビザ戦略で、台湾での新しい一歩を",
              zh: "用最合適的簽證與居留策略，安心展開在台新生活與事業",
              en: "Start your next chapter in Taiwan with the right visa and residency plan",
              common: "用最合適的簽證與居留策略，安心展開在台新生活與事業",
            })}
          </h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={`/contact?lang=${lang}`}
              className="inline-block bg-white text-[#1C3D5A] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              {labels.contact}
            </a>
            <a
              href="mailto:info@twconnects.com"
              className="inline-block bg-white/10 border border-white/20 font-semibold px-6 py-3 rounded-lg hover:bg-white/15 transition"
            >
              info@twconnects.com
            </a>
          </div>
        </div>
      </section>

      <FooterServer lang={lang} />
    </div>
  );
}
