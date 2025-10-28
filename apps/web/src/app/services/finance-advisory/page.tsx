// apps/web/src/app/services/finance-advisory/page.tsx
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import * as Lucide from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { sfetch } from "@/lib/sanity/fetch";
import {
  financeAdvisoryDetailBySlug,
  resolveLang,
  type Lang,
} from "@/lib/queries/financeAdvisoryDetail";

export const revalidate = 60;
export const dynamic = "force-dynamic"; // ✅ (1) 改為強制動態

/* ============================ 視覺調整區 ============================ */
const BRAND_BLUE = "#1C3D5A";

/** Hero 圖片焦點與最小高度 */
const HERO_TUNE = {
  focalX: 55,
  focalY: 45,
  minH: 440,
};

/** Hero 文字區位置與寬度調整 */
const HERO_TEXT_TUNE = {
  top: "40%",
  left: "33%",
  maxWidth: "40%",
  align: "left" as "left" | "center" | "right",
};

/** Hero 圖片位移與縮放 */
const HERO_IMG_CTRL = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
};

/** 保留（不位移快捷列） */
const BELOW_HERO_OFFSET = 64;

/** Hero ➜ 背景 與 背景 ➜ 課題 的等距留白 */
const HERO_TO_BG_GAP = 80;

/* ============================ 其他設定 ============================ */
const FIXED_SLUG = "financial-accounting-advisory";
const NAV_H = 72;

const LAYOUT = {
  container: "max-w-6xl",
  yGap: "space-y-12 md:space-y-16",
};

const QUICK_LINKS: Array<{ id: string; icon: keyof typeof Lucide; label: Record<Lang, string> }> = [
  { id: "background", icon: "Info", label: { jp: "背景", zh: "背景", en: "Background" } },
  { id: "challenges", icon: "AlertTriangle", label: { jp: "課題", zh: "挑戰", en: "Challenges" } },
  { id: "services", icon: "ListChecks", label: { jp: "サービス内容", zh: "服務內容", en: "Services" } },
  { id: "flow", icon: "Workflow", label: { jp: "サービスの流れ", zh: "服務流程", en: "Service Flow" } },
  { id: "fees", icon: "BadgeDollarSign", label: { jp: "料金（参考）", zh: "費用（參考）", en: "Fees" } },
];

/* ============================ 型別 ============================ */
type HeroImage = {
  url?: string | null;
  alt?: string | null;
  lqip?: string | null;
  hotspot?: { x?: number; y?: number } | null;
};

type FinanceAdvisoryData = {
  title?: string | null;
  background?: string | null;
  challenges?: string[] | null;
  services?: string[] | null;
  serviceFlow?: Array<{ step?: string | null; desc?: string | null }> | null;
  fees?: { title?: string | null; items?: string[] | null } | null;
  heroImage?: HeroImage | null;
};

/* ============================ 小工具：標題不斷行 ============================ */
function renderTitleNoWrap(t: string, lang: Lang) {
  const hardWord =
    lang === "jp" ? "海外展開支援" :
    lang === "zh" ? "海外發展支援" :
    "Overseas Expansion Support";

  if (t.includes(hardWord)) {
    const [pre, ...rest] = t.split(hardWord);
    return (
      <>
        {pre}
        <span className="whitespace-nowrap">{hardWord}</span>
        {rest.join(hardWord)}
      </>
    );
  }

  const seps = ["／", "/", "｜", "|"];
  for (const s of seps) {
    if (t.includes(s)) {
      const [left, right] = t.split(s);
      return (
        <>
          {left}{s}
          <span className="whitespace-nowrap">{right}</span>
        </>
      );
    }
  }
  return t;
}

/* ============================ 元件 ============================ */
function GlassCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: NAV_H + 80 }}>
      <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-5">{title}</h2>
        <div className="prose prose-invert max-w-none">{children}</div>
      </div>
    </section>
  );
}

function Bullets({ items }: { items?: (string | null | undefined)[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="grid gap-3 md:gap-3.5">
      {items.filter(Boolean).map((t, i) => (
        <li key={i} className="flex items-start gap-3">
          <Lucide.CheckCircle className="size-5 mt-0.5 shrink-0 opacity-90" />
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ items }: { items?: Array<{ step?: string | null; desc?: string | null }> | null }) {
  if (!items || items.length === 0) return null;
  return (
    <ol className="grid gap-4">
      {items.map((s, i) => (
        <li key={i} className="rounded-xl bg-white/10 border border-white/15 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-white/15 border border-white/20 grid place-items-center text-sm font-semibold">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="font-semibold mb-1.5">{s?.step}</div>
              <div className="text-sm opacity-95">{s?.desc}</div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ============================ 快捷列 ============================ */
function QuickDock({ lang }: { lang: Lang }) {
  return (
    <div
      className="sticky z-30 border-y backdrop-blur-md"
      style={{ top: 0, backgroundColor: BRAND_BLUE, borderColor: "rgba(255,255,255,0.15)" }}
    >
      <div className={`mx-auto ${LAYOUT.container} px-5 md:px-6`}>
        <div className="py-3 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar justify-center">
          {QUICK_LINKS.map(({ id, icon, label }) => {
            const IconComp =
              typeof icon === "string"
                ? ((Lucide as any)[icon] ?? Lucide.Circle)
                : (icon || Lucide.Circle);

            const IconEl = React.createElement(IconComp as any, {
              className: "size-4 opacity-90 group-hover:opacity-100",
              "aria-hidden": true,
            });

            return (
              <a
                key={id}
                href={`#${id}`} // 錨點連結不需加 lang
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-transparent hover:bg-white/10 text-white px-3.5 py-2 text-sm transition-colors"
              >
                {IconEl}
                <span>{label[lang]}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================ 主頁面 ============================ */
export default async function FinanceAdvisoryPage({
  searchParams,
}: {
  // ✅ (2) 允許 Promise 並先 await 再取得 lang
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  // ✅ (3) 使用 resolveLang 解析語言參數
  const lang = resolveLang(sp?.lang);

  // ✅ (4) 查詢時帶入 lang
  const data = await sfetch<FinanceAdvisoryData>(financeAdvisoryDetailBySlug, {
    slug: FIXED_SLUG,
    lang,
  });

  const title =
    data?.title ??
    {
      jp: "財務・会計アドバイザリー／海外展開支援",
      zh: "財務與會計顧問・海外發展支援服務",
      en: "Financial & Accounting Advisory / Overseas Expansion Support",
    }[lang];

  /* ------------ Localized UI labels ------------ */
  function dict(localLang: Lang) {
    if (localLang === "jp")
      return {
        breadcrumb: "ホーム / サービス / 海外居住・移住支援",
        heroHeading: "海外居住・移住サポート",
        bg: "背景",
        challenges: "課題",
        services: "サービス内容",
        flow: "サービスの流れ",
        fees: "料金（参考）",
        defaultCTA: "お問い合わせはこちら",
        bottomHeading: "最適な移住プランで、海外生活の第一歩を",
        feeSideHeading: "まずは無料相談",
        feeSideNote:
          "案件の内容や条件により料金が異なります。ご状況を伺った上でお見積りをご提示します。",
        tagTailored: "個別見積",
        tagQuickReply: "迅速返答",
      };
    if (localLang === "zh")
      return {
        breadcrumb: "首頁 / 服務內容 / 海外居住移居支援",
        heroHeading: "海外居住／移居支援",
        bg: "背景",
        challenges: "挑戰",
        services: "服務內容",
        flow: "服務流程",
        fees: "費用參考",
        defaultCTA: "Contact Us 聯絡我們",
        bottomHeading: "用最合適的移居方案，安心展開海外生活",
        feeSideHeading: "先進行免費諮詢",
        feeSideNote:
          "費用會依據目的與條件不同而調整。了解您的情況後，我們會提供客製化報價。",
        tagTailored: "客製報價",
        tagQuickReply: "快速回覆",
      };
    return {
      breadcrumb: "Home / Services / Overseas Residence & Relocation",
      heroHeading: "Overseas Residence and Relocation Support",
      bg: "Background",
      challenges: "Challenges",
      services: "Services",
      flow: "Service Flow",
      fees: "Fees",
      defaultCTA: "Contact Us",
      bottomHeading:
        "Start your next chapter abroad with the right relocation plan",
      feeSideHeading: "Start with a free consult",
      feeSideNote:
        "Pricing varies by purpose and requirements. Tell us your situation and we will prepare a tailored quote.",
      tagTailored: "Tailored quote",
      tagQuickReply: "Quick reply",
    };
  }
  const labels = dict(lang);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: BRAND_BLUE }}>
      {/* ===== Hero 圖 ===== */}
      {data?.heroImage?.url && (
        <div className="absolute inset-x-0 top-0 z-0 overflow-hidden" style={{ height: HERO_TUNE.minH + NAV_H }}>
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translate(${HERO_IMG_CTRL.offsetX}px, ${HERO_IMG_CTRL.offsetY}px) scale(${HERO_IMG_CTRL.zoom})`,
              transformOrigin: "center",
            }}
          >
            <Image
              src={data.heroImage.url}
              alt={data.heroImage.alt ?? ""}
              fill
              priority
              placeholder={data.heroImage.lqip ? "blur" : "empty"}
              blurDataURL={data.heroImage.lqip ?? undefined}
              className="object-cover"
              style={{ objectPosition: `${HERO_TUNE.focalX}% ${HERO_TUNE.focalY}%` }}
            />
          </div>
        </div>
      )}

      {/* 導覽列 */}
      <div className="relative z-20">
        {/* ✅ (4) lang 傳入子元件 */}
        <NavigationServer lang={lang} />
      </div>

      {/* ===== Hero 文字 ===== */}
      <header
        className="relative z-10 w-full"
        style={{ minHeight: HERO_TUNE.minH, marginTop: `-${NAV_H}px`, paddingTop: `${NAV_H}px` }}
      >
        <div
          className="absolute z-10"
          style={{
            top: HERO_TEXT_TUNE.top,
            left: HERO_TEXT_TUNE.left,
            maxWidth: HERO_TEXT_TUNE.maxWidth,
            textAlign: HERO_TEXT_TUNE.align,
            color: BRAND_BLUE,
          }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            {renderTitleNoWrap(title, lang)}
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed opacity-95">
            {lang === "jp" && "数字と戦略の両面から、国際展開を支える総合アドバイザリー。"}
            {lang === "zh" && "結合財務與策略的專業顧問，穩健支持企業的國際擴張。"}
            {lang === "en" && "Advisory that connects numbers with strategy to support global growth."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {/* 錨點連結不需加 lang */}
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1C3D5A] text-white hover:bg-[#24496C] px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <Lucide.ListChecks className="size-4" />
              {lang === "jp" && "サービス内容を見る"}
              {lang === "zh" && "查看服務內容"}
              {lang === "en" && "View Services"}
            </Link>
          </div>
        </div>
      </header>

      {/* spacer 抵銷 header 負邊距 */}
      <div style={{ height: NAV_H }} />

      {/* 快捷列 */}
      <QuickDock lang={lang} />

      {/* 主內容 */}
      <main
        className={`relative z-10 mx-auto ${LAYOUT.container} px-5 md:px-6 pb-18 md:pb-24 ${LAYOUT.yGap}`}
        style={{ marginTop: `${HERO_TO_BG_GAP}px` }}
      >
        {(data?.background ?? "").trim().length > 0 && (
          <div style={{ marginTop: 0, marginBottom: HERO_TO_BG_GAP }}>
            <GlassCard id="background" title={{ jp: "背景", zh: "背景", en: "Background" }[lang]}>
              <p className="whitespace-pre-line leading-relaxed">{data?.background}</p>
            </GlassCard>
          </div>
        )}

        {(!!data?.challenges?.length || !!data?.services?.length) && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {!!data?.challenges?.length && (
              <GlassCard id="challenges" title={{ jp: "課題", zh: "挑戰", en: "Challenges" }[lang]}>
                <Bullets items={data?.challenges ?? []} />
              </GlassCard>
            )}
            {!!data?.services?.length && (
              <GlassCard id="services" title={{ jp: "サービス内容", zh: "服務內容", en: "Services" }[lang]}>
                <Bullets items={data?.services ?? []} />
              </GlassCard>
            )}
          </div>
        )}

        {!!data?.serviceFlow?.length && (
          <GlassCard id="flow" title={{ jp: "服務流程", zh: "服務流程", en: "Service Flow" }[lang]}>
            <Steps items={data.serviceFlow} />
          </GlassCard>
        )}

        {(data?.fees?.title || data?.fees?.items?.length) && (
          <GlassCard
            id="fees"
            title={data?.fees?.title ?? { jp: "料金（参考）", zh: "費用參考", en: "Fees (Reference)" }[lang]}
          >
            <Bullets items={data?.fees?.items ?? []} />
            <div className="mt-5">
              {/* ✅ (5) 站內連結補上 ?lang */}
              <Link
                href={`/contact?lang=${lang}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-medium transition-colors text-white"
              >
                <Lucide.Mail className="size-4" />
                {lang === "jp" && "お問い合わせはこちら"}
                {lang === "zh" && "聯絡我們"}
                {lang === "en" && "Contact Us"}
              </Link>
            </div>
          </GlassCard>
        )}
      </main>

      {/* ===== Pre-Footer CTA ===== */}
      <section className="border-y" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <div className={`mx-auto ${LAYOUT.container} px-5 md:px-6`}>
          <div className="py-10 md:py-14 text-center">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              {(() => {
                if (lang === "jp") return "最適な移住プランで、海外生活の第一歩を";
                if (lang === "zh") return "用最合適的移居方案，安心展開海外生活";
                return "Start your next chapter abroad with the right relocation plan";
              })()}
            </h3>

            <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {/* ✅ (5) 站內連結補上 ?lang */}
              <Link
                href={`/contact?lang=${lang}`}
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold bg-white hover:bg-white/90"
                style={{ color: BRAND_BLUE, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
              >
                {(() => {
                  if (lang === "jp") return "お問い合わせはこちら";
                  if (lang === "zh") return "Contact Us 聯絡我們";
                  return "Contact Us";
                })()}
              </Link>

              {/* 外部連結不需要加 lang */}
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

      {/* Footer */}
      <FooterServer lang={lang} />
    </div>
  );
}
