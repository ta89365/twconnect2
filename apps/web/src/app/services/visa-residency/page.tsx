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

/* ============================ 視覺調整區 ============================ */
const BRAND_BLUE = "#1C3D5A";

/** Hero 圖片焦點（0~100），影響 object-position */
const HERO_FOCAL = { x: 62, y: 42 };

/** Hero 高度（更矮一些） */
const HERO_DIM = {
  hSm: 380, // px @base
  hMd: 480, // px @md+
};

/** Hero 圖片位移與縮放（px、倍數） */
const HERO_IMG_CTRL = {
  offsetX: 0,
  offsetY: -10,
  zoom: 1,
};

/** Hero 文字物件位置與寬度（px 或 %） */
const HERO_TEXT_TUNE = {
  top: "46%",
  left: "50%",
  maxWidth: "760px",
  align: "center" as "left" | "center" | "right",
  titleSizeBase: "34px",
  titleSizeMd: "44px",
};

/** 內文容器寬度與左右 padding */
const CONTAINER_W = "max-w-7xl";
const CONTAINER_X = "px-5 sm:px-6 lg:px-10";

/** 段落上下間距節奏 */
const SECTION_Y_GAP = "py-12 md:py-16";

/** 錨點偏移（避免被 sticky 快捷列遮住） */
const ANCHOR_OFFSET = "scroll-mt-[92px] md:scroll-mt-[112px]";
/* ================================================================== */

// 保障 0~100 範圍
const clamp01 = (n: number) => Math.max(0, Math.min(100, n));
const heroObjectPosition = `${clamp01(HERO_FOCAL.x)}% ${clamp01(HERO_FOCAL.y)}%`;

type FlowStep = { order?: string; title?: string; desc?: string };
type VisaCategoryRow = { order?: number; key?: string | null; name?: string; desc?: string };
type VisaResidencyItem = {
  title?: string;
  background?: string;
  challenges?: string[];
  services?: string[];
  incubationTrack?: string[];
  serviceFlow?: FlowStep[];
  fees?: string;
  heroImage?: { asset?: { url?: string | null } | null } | null;
  ctaLabel?: string;
  visaCategories?: { sectionTitle?: string; items?: VisaCategoryRow[] };
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
          <span aria-hidden className="shrink-0">
            {emoji}
          </span>
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

/** Visa Categories 表格：手機卡片、桌機表格 */
function VisaCategories({
  title,
  items,
  lang,
}: {
  title?: string;
  items?: VisaCategoryRow[];
  lang: Lang;
}) {
  if (!items || items.length === 0) return null;

  const colCat = t(lang, { jp: "カテゴリー", zh: "類別", en: "Category", common: "類別" });
  const colType = t(lang, { jp: "ビザの種類", zh: "簽證名稱", en: "Visa Type", common: "簽證名稱" });
  const colDesc = t(lang, { jp: "説明", zh: "說明", en: "Description", common: "說明" });

  return (
    <section id="vc" className={ANCHOR_OFFSET}>
      <SectionHeading lang={lang} jp={title ?? "長期ビザ・居留タイプ"} zh={title ?? "主要長期簽證與居留類型"} en={title ?? "Long-term Visa & Residency Categories"} />
      {/* 桌機表格 */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-white/15 bg-white/6">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-white/10">
            <tr>
              <th className="py-3.5 pl-5 pr-3 font-semibold"> {colCat} </th>
              <th className="py-3.5 px-3 font-semibold"> {colType} </th>
              <th className="py-3.5 pl-3 pr-5 font-semibold"> {colDesc} </th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={i} className="border-t border-white/12 hover:bg-white/6">
                <td className="py-4 pl-5 pr-3 align-top whitespace-nowrap">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/15 px-2 text-sm font-semibold">
                    {r.order ?? i + 1}
                  </span>
                </td>
                <td className="py-4 px-3 align-top font-semibold">{r.name}</td>
                <td className="py-4 pl-3 pr-5 align-top opacity-95">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 手機卡片 */}
      <div className="md:hidden space-y-4">
        {items.map((r, i) => (
          <div key={i} className="rounded-2xl border border-white/15 bg-white/8 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/15 px-2 text-sm font-semibold">
                {r.order ?? i + 1}
              </span>
              <div className="font-semibold">{r.name}</div>
            </div>
            {r.desc ? <p className="mt-2 text-sm leading-relaxed opacity-95">{r.desc}</p> : null}
          </div>
        ))}
      </div>
    </section>
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
    visaCategories,
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
    categories: visaCategories?.sectionTitle
      ? visaCategories.sectionTitle
      : t(lang, {
          jp: "長期ビザ・居留タイプ",
          zh: "主要長期簽證與居留類型",
          en: "Visa & Residency Categories",
          common: "主要長期簽證與居留類型",
        }),
    contact:
      ctaLabel ?? t(lang, { jp: "お問い合わせ", zh: "聯絡我們", en: "Contact Us", common: "聯絡我們" }),
    ctaSub: t(lang, {
      jp: "案件内容に応じて最適なプランをご提案します",
      zh: "將依據您的條件提供最合適的申請方案",
      en: "We tailor the right plan to your case",
      common: "將依據您的條件提供最合適的申請方案",
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

          {/* 疊加漸層 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0f2334]/25 to-[rgba(28,61,90,0.92)]" />

          {/* 文字區：只保留主標題且在可見區域置中 */}
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
            <h1
              className="font-bold tracking-tight drop-shadow-sm"
              style={{
                fontSize: `clamp(${HERO_TEXT_TUNE.titleSizeBase}, 4.5vw, ${HERO_TEXT_TUNE.titleSizeMd})`,
                lineHeight: 1.15,
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Hero 底部柔光帶 */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-1/3 h-24 blur-3xl opacity-70"
          style={{ backgroundColor: BRAND_BLUE }}
        />
      </section>

      {/* ============================ 快速導覽（吸頂） ============================ */}
      <nav className="sticky top-0 z-30 bg-[rgba(28,61,90,0.88)] backdrop-blur-md border-b border-white/12">
        <div
          className={`${CONTAINER_W} mx-auto ${CONTAINER_X} py-3 flex flex-wrap gap-2 justify-center text-sm md:text-base`}
        >
          <a href="#bg" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
            {labels.background}
          </a>
          {challenges.length > 0 && (
            <a href="#ch" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
              {labels.challenges}
            </a>
          )}
          {(services.length > 0 || incubationTrack.length > 0) && (
            <a href="#sv" className="px-4 py-2 rounded-full border border白色/18 hover:bg白色/10 transition">
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
          {visaCategories?.items && visaCategories.items.length > 0 && (
            <a href="#vc" className="px-4 py-2 rounded-full border border-white/18 hover:bg-white/10 transition">
              {labels.categories}
            </a>
          )}
        </div>
      </nav>

      {/* =============================== 內容區 =============================== */}
      <main className="relative z-10">
        <div className={`${CONTAINER_W} mx-auto w-full ${CONTAINER_X} text-[17px] md:text-[18px]`}>
          <div className={`${SECTION_Y_GAP} grid gap-10 md:gap-12`}>
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
                          {getServiceCardTitles(lang).general}
                        </h3>
                        <EmojiList items={services} emoji="✅" />
                      </div>
                    )}

                    {/* 右卡：育成計畫 */}
                    {incubationTrack.length > 0 && (
                      <div className="bg-white/8 border border-white/15 rounded-2xl p-6 md:p-7">
                        <h3 className="text-[16px] md:text-[17px] font-semibold mb-3 opacity-95">
                          {getServiceCardTitles(lang).incub}
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

              {/* ====== 新增：Visa Categories 表格（置於 CTA 上方） ====== */}
              {visaCategories?.items && visaCategories.items.length > 0 && (
                <VisaCategories
                  lang={lang}
                  title={visaCategories.sectionTitle}
                  items={visaCategories.items}
                />
              )}
            </div>
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
              {ctaLabel ??
                t(lang, { jp: "お問い合わせ", zh: "聯絡我們", en: "Contact Us", common: "聯絡我們" })}
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
