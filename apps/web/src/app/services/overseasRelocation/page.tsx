// C:\Users\ta893\twconnect2\apps\web\src\app\services\overseasRelocation\page.tsx
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import * as Lucide from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { sfetch } from "@/lib/sanity/fetch";
import { overseasRelocationDetailBySlug } from "@/lib/queries/overseasRelocation";
import { resolveLang, type Lang } from "@/lib/i18n";

export const revalidate = 60;
// ✅ 讓多語 ?lang=jp|zh|en 生效（逐請求依參數決定內容）
export const dynamic = "force-dynamic";

const FIXED_SLUG = "overseas-residence-relocation-support";

/* ============================ 視覺/調參區 ============================ */
const BRAND_BLUE = "#1C3D5A";
const HERO_TUNE = { x: 60, y: 42 }; // 0~100 焦點百分比
const CONTAINER_W = "max-w-6xl";
const CONTAINER_X = "px-4 sm:px-6 lg:px-8";
const SECTION_Y = "py-10 md:py-14";
const clamp01 = (n: number) => Math.max(0, Math.min(100, n));
const heroObjectPosition = `${clamp01(HERO_TUNE.x)}% ${clamp01(HERO_TUNE.y)}%`;

/* ===== 🔧 Hero 文字調整區（紅框三項＋CTA） ===== */
const HERO_PANEL_TUNE = {
  yBase: "pt-80",
  yMd: "md:pt-96",
  pillMb: "mb-4",
  titleSize: "text-3xl md:text-5xl",
  groupGap: "mt-6",
  ctaPad: "px-4 py-1.5",
  ctaText: "text-sm",
  pillText: "text-xs md:text-sm",
};

/* ===== 🟦 卡片邊框調整區 ===== */
const CARD_TUNE = {
  radius: "rounded-2xl",
  border: "border-2 border-[#1C3D5A]/40 ring-2 ring-[#1C3D5A]/15",
  shadow: "shadow-[0_12px_32px_rgba(0,0,0,0.18)]",
};

/* ===== 📌 錨點偏移（避免被 sticky 快捷列遮住） ===== */
const ANCHOR_OFFSET = "scroll-mt-[92px] md:scroll-mt-[112px]";
/* ==================================================================== */

/* ------------ 多語預設內容（當 GROQ 缺資料時用） ------------ */
type Step = { stepNumber?: string; title?: string; desc?: string };

function defaults(lang: Lang): {
  background: string;
  challenges: string[];
  services: string[];
  flowSteps: Step[];
  fees: string[];
  ctaLabel: string;
} {
  if (lang === "jp")
    return {
      background:
        "海外で新しい生活を始めるには、ビザ・在留資格だけでなく、住居、銀行、保険、税務など多くの手続きを正確に進める必要があります。Taiwan Connect は現地ネットワークを活かし、準備から生活立ち上げまで一貫してサポートします。",
      challenges: [
        "制度や必要書類が複雑で、申請に時間がかかる",
        "言語や商習慣の違いにより自己対応が難しい",
        "会計・税務・法令対応を誤ると後のリスクに直結する",
        "信頼できる現地窓口や専門家を見つけにくい",
      ],
      services: [
        "ビザ・在留資格の方針設計と申請支援",
        "住居探し、銀行口座開設、保険加入の同行サポート",
        "会計・税務登録および申告サポート",
        "外国投資審査や資本登記などの手続き代行",
      ],
      flowSteps: [
        { stepNumber: "01", title: "無料相談", desc: "目的と条件の確認、必要な進め方の仮設計" },
        { stepNumber: "02", title: "プラン提案", desc: "最適な在留区分とスケジュール、見積りをご提示" },
        { stepNumber: "03", title: "申請準備", desc: "必要書類の案内、作成・翻訳・収集サポート" },
        { stepNumber: "04", title: "提出・追跡", desc: "当局への提出、審査フォロー、追加対応" },
        { stepNumber: "05", title: "生活立上げ", desc: "口座・保険・住居・税務登録などの実務支援" },
      ],
      fees: [
        "案件の内容と緊急度によりお見積りが変動します",
        "複数手続きの同時依頼にはパッケージ割引あり",
      ],
      ctaLabel: "お問い合わせはこちら",
    };

  if (lang === "zh")
    return {
      background:
        "要在海外展開新生活，除了簽證與居留資格外，還需要處理住所、銀行、保險、稅務等各種手續。Taiwan Connect 以在地網絡與多語能力，從前期規劃到生活落地提供一站式支援。",
      challenges: [
        "制度規定繁複且易變，申請流程耗時",
        "語言與制度差異大，自行處理難度高",
        "會計稅務與法規若處理不當，後續風險大",
        "難以找到可靠的在地窗口與專業人士",
      ],
      services: [
        "簽證與居留方案設計與申請協助",
        "住所尋找、銀行開戶、保險投保之陪同與代辦",
        "會計稅務登記與申報支援",
        "外資審查、資本登記等手續代辦",
      ],
      flowSteps: [
        { stepNumber: "01", title: "免費諮詢", desc: "確認目的與條件，初步規劃流程" },
        { stepNumber: "02", title: "方案提案", desc: "提供最合適的類別、時程與報價" },
        { stepNumber: "03", title: "資料準備", desc: "文件清單、撰寫翻譯與蒐集協助" },
        { stepNumber: "04", title: "送件追蹤", desc: "向主管機關送件並持續追蹤補件" },
        { stepNumber: "05", title: "生活落地", desc: "開戶、保險、租屋與稅務等實務支援" },
      ],
      fees: ["依目的、條件與急迫度客製化報價", "多項手續可提供套餐優惠"],
      ctaLabel: "Contact Us 聯絡我們",
    };

  // en
  return {
    background:
      "Starting life abroad requires more than a visa. You will also need to set up housing, bank accounts, insurance, and tax registrations. With on-the-ground partners and multilingual support, Taiwan Connect guides you from planning to full relocation.",
    challenges: [
      "Complex rules and documents create delays and rejections",
      "Language and system differences make DIY difficult",
      "Missteps in accounting, tax, or compliance lead to risk",
      "Hard to identify reliable local experts and a single contact window",
    ],
    services: [
      "Visa and residency strategy design and filing support",
      "Housing search, bank account opening, and insurance onboarding",
      "Accounting and tax registrations and filing support",
      "Foreign investment review and capital registration handling",
    ],
    flowSteps: [
      { stepNumber: "01", title: "Free consult", desc: "Clarify goals and constraints, outline the path" },
      { stepNumber: "02", title: "Plan proposal", desc: "Best fit status, timeline, and quote" },
      { stepNumber: "03", title: "Document prep", desc: "Checklist, drafting, translation, collection" },
      { stepNumber: "04", title: "Filing & follow-up", desc: "Submission to authorities and ongoing tracking" },
      { stepNumber: "05", title: "Landing support", desc: "Accounts, insurance, housing, and tax setup" },
    ],
    fees: ["Pricing depends on scope and urgency", "Bundle discounts for combined procedures"],
    ctaLabel: "Contact Us",
  };
}

/* ------------ UI helpers ------------ */
function pick<T>(value: T | undefined | null, fallback: T): T {
  if (Array.isArray(value)) return (value.length ? value : fallback) as T;
  return value ?? fallback;
}

export default async function OverseasRelocationPage({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await searchParams
      : (searchParams as { lang?: string } | undefined);

  const lang: Lang = resolveLang(spRaw?.lang);
  const t = dict(lang);
  const d = defaults(lang);

  const data = await sfetch(overseasRelocationDetailBySlug, {
    slug: FIXED_SLUG,
    lang,
  });

  // ---- 內容層級 fallback（若 GROQ 該欄位為空，使用 defaults(lang)）----
  // 先把 data 寬化成可選欄位以避免 {} 型別報錯
  type ORData = {
    title?: string;
    heroImage?: { url?: string | null; alt?: string | null; lqip?: string | null } | null;
    background?: string | null;
    challenges?: string[] | null;
    services?: string[] | null;
    flowSteps?: Step[] | null;
    fees?: string[] | null;
    ctaLabel?: string | null;
  };

  const $data = (data ?? {}) as ORData;

  const title = pick<string>($data.title ?? undefined, t.heroHeading);
  const heroUrl: string | undefined = $data.heroImage?.url ?? undefined;

  const background = pick<string>($data.background ?? undefined, d.background);
  const challenges = pick<string[] | undefined>($data.challenges ?? undefined, d.challenges);
  const services = pick<string[] | undefined>($data.services ?? undefined, d.services);
  const flowSteps = pick<Step[] | undefined>($data.flowSteps ?? undefined, d.flowSteps);
  const fees = pick<string[] | undefined>($data.fees ?? undefined, d.fees);
  const ctaLabel = pick<string>($data.ctaLabel ?? undefined, d.ctaLabel);

  const hasBg = !!background;
  const hasChallenges = !!challenges?.length;
  const hasServices = !!services?.length;
  const hasFlow = !!flowSteps?.length;
  const hasFees = !!fees?.length;

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ backgroundColor: BRAND_BLUE }}>
      <NavigationServer lang={lang} />

      {/* ============================== Hero ============================== */}
      <section className="relative w-full">
        <div className="relative h-[40vh] sm:h-[46vh] md:h-[45vh] lg:h-[60vh] overflow-hidden">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={$data.heroImage?.alt || title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: heroObjectPosition }}
              placeholder={$data.heroImage?.lqip ? "blur" : "empty"}
              blurDataURL={$data.heroImage?.lqip || undefined}
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: BRAND_BLUE }} />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#1C3D5A]" />
          <div
            className="pointer-events-none absolute -top-24 right-[-60px] h-72 w-72 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.22), rgba(255,255,255,0))" }}
          />

          <div className="relative z-10 h-full flex items-start">
            <div
              className={`${CONTAINER_W} w-full mx-auto ${CONTAINER_X} ${HERO_PANEL_TUNE.yBase} ${HERO_PANEL_TUNE.yMd} text-center`}
            >
              <div className={`${HERO_PANEL_TUNE.pillMb} flex justify-center`}>
                <div
                  className={`inline-flex items-center gap-2 rounded-full bg-white/12 border border-white/18 px-4 py-1 ${HERO_PANEL_TUNE.pillText}`}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
                  {t.breadcrumb}
                </div>
              </div>

              <h1 className={`${HERO_PANEL_TUNE.titleSize} font-extrabold tracking-tight drop-shadow-sm`}>{title}</h1>

              <div className={`${HERO_PANEL_TUNE.groupGap} flex flex-wrap items-center justify-center gap-2`}>
                <LangBadge lang={lang} />
                <Link
                  href={`/contact${lang ? `?lang=${lang}` : ""}`}
                  className={`inline-flex items-center gap-2 rounded-full bg-white/90 ${HERO_PANEL_TUNE.ctaPad} ${HERO_PANEL_TUNE.ctaText} font-semibold shadow-sm hover:bg-white transition`}
                  style={{ color: BRAND_BLUE }}
                >
                  <Lucide.Mail className="h-4 w-4" />
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 translate-y-1/3 h-24 blur-3xl opacity-70"
          style={{ backgroundColor: BRAND_BLUE }}
        />
      </section>

      {/* ============================ Hero 下方快速導覽 ============================ */}
      <nav className="sticky top-0 z-30 bg-[rgba(28,61,90,0.88)] backdrop-blur-md border-b border-white/12">
        <div className={`${CONTAINER_W} mx-auto ${CONTAINER_X} py-3 flex flex-wrap justify-center gap-3`}>
          {hasBg && (
            <a href="#bg" className="px-4 py-2 rounded-full border border-white/18 text-sm hover:bg-white/10 transition">
              {t.bg}
            </a>
          )}
          {hasChallenges && (
            <a href="#ch" className="px-4 py-2 rounded-full border border-white/18 text-sm hover:bg-white/10 transition">
              {t.challenges}
            </a>
          )}
          {hasServices && (
            <a href="#sv" className="px-4 py-2 rounded-full border border-white/18 text-sm hover:bg-white/10 transition">
              {t.services}
            </a>
          )}
          {hasFlow && (
            <a href="#fl" className="px-4 py-2 rounded-full border border-white/18 text-sm hover:bg-white/10 transition">
              {t.flow}
            </a>
          )}
          {hasFees && (
            <a href="#fe" className="px-4 py-2 rounded-full border border-white/18 text-sm hover:bg-white/10 transition">
              {t.fees}
            </a>
          )}
        </div>
      </nav>

      {/* ================================ 內容區 ================================ */}
      <main className={`${CONTAINER_W} mx-auto w-full ${CONTAINER_X} ${SECTION_Y} flex-1`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {hasBg && (
            <Card id="bg" title={t.bg} icon={<Lucide.Info className="h-5 w-5" />}>
              <p className="text-slate-800 leading-relaxed whitespace-pre-line">{background}</p>
            </Card>
          )}
          {hasChallenges && (
            <Card id="ch" title={t.challenges} icon={<Lucide.AlertTriangle className="h-5 w-5" />}>
              <BulletList items={challenges} />
            </Card>
          )}
          {hasServices && (
            <Card id="sv" title={t.services} icon={<Lucide.Handshake className="h-5 w-5" />}>
              <BulletList items={services} check />
            </Card>
          )}
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {hasFlow && (
            <Card id="fl" title={t.flow} icon={<Lucide.Route className="h-5 w-5" />}>
              <StepList steps={flowSteps} />
            </Card>
          )}

          {/* ========= 料金（参考）卡：點陣背景 + 浮水印 + 側邊資訊框 ========= */}
          {hasFees && (
            <Card id="fe" title={t.fees} icon={<Lucide.Receipt className="h-5 w-5" />}>
              <div
                className="relative rounded-xl p-5 md:p-6"
                style={{
                  backgroundImage: "radial-gradient(rgba(28,61,90,0.06) 1px, rgba(255,255,255,1) 1px)",
                  backgroundSize: "12px 12px",
                }}
              >
                {/* 超淡浮水印 */}
                <Lucide.Coins
                  className="absolute -top-2 -right-2 h-14 w-14 md:h-16 md:w-16 text-[#1C3D5A]/10 pointer-events-none"
                  aria-hidden
                />

                {/* 條列 */}
                <BulletList items={fees} dot />

                {/* 置底：水平資訊條 */}
                <aside className="mt-6 rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur px-4 py-4 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                    {/* 左：標題＋說明 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-slate-900 font-semibold">
                        <Lucide.MessageCircle className="h-5 w-5 text-[#1C3D5A]" />
                        <span>{t.feeSideHeading}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{t.feeSideNote}</p>

                      {/* 標籤 */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1C3D5A]/10 text-[#1C3D5A] text-xs px-2.5 py-1">
                          <Lucide.BadgeCheck className="h-3.5 w-3.5" />
                          {t.tagTailored}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#1C3D5A]/10 text-[#1C3D5A] text-xs px-2.5 py-1">
                          <Lucide.Timer className="h-3.5 w-3.5" />
                          {t.tagQuickReply}
                        </span>
                      </div>
                    </div>

                    {/* 右：CTA */}
                    <div className="mt-4 md:mt-0 md:ml-auto">
                      <Link
                        href={`/contact${lang ? `?lang=${lang}` : ""}`}
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-white text-sm font-semibold shadow-md hover:opacity-95 transition"
                        style={{ backgroundColor: BRAND_BLUE }}
                      >
                        <Lucide.Mail className="h-4 w-4" />
                        {ctaLabel}
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* ============================== 底部整寬 CTA ============================== */}
      <section className="border-t border-white/12 py-10 md:py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl md:text-2xl font-semibold">{t.bottomHeading}</h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={`/contact${lang ? `?lang=${lang}` : ""}`}
              className="inline-block bg-white text-[#1C3D5A] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              {ctaLabel}
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

/* ------------ UI helpers ------------ */
function Card({
  title,
  icon,
  children,
  id,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${ANCHOR_OFFSET} ${CARD_TUNE.radius} bg-white ${CARD_TUNE.shadow} ${CARD_TUNE.border} overflow-hidden transition-shadow`}
    >
      <div className="flex items-center gap-2 px-5 py-4 text-white" style={{ backgroundColor: BRAND_BLUE }}>
        {icon}
        <h2 className="text-base md:text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function BulletList({
  items,
  check,
  dot,
}: {
  items?: string[];
  check?: boolean;
  dot?: boolean;
}) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-3">
      {items.map((s, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: BRAND_BLUE }}
            aria-hidden
          >
            {check ? (
              <Lucide.Check className="h-3.5 w-3.5" />
            ) : dot ? (
              <Lucide.Dot className="h-4 w-4" />
            ) : (
              <Lucide.ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
          <p className="text-slate-800 leading-relaxed">{s}</p>
        </li>
      ))}
    </ul>
  );
}

function StepList({ steps }: { steps?: { stepNumber?: string; title?: string; desc?: string }[] }) {
  if (!steps?.length) return null;
  return (
    <ol className="relative ml-4 border-s-2 border-slate-200 space-y-6">
      {steps.map((st, i) => (
        <li key={i} className="ms-6">
          <span
            className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ring-2 ring-white"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            {(st.stepNumber ?? `${i + 1}`).padStart(2, "0")}
          </span>
          <div className="pl-1">
            <h3 className="text-slate-900 font-semibold">{st.title}</h3>
            {st.desc ? <p className="mt-1 text-slate-700 leading-relaxed">{st.desc}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function LangBadge({ lang }: { lang: Lang }) {
  const label = lang === "jp" ? "日本語" : lang === "zh" ? "繁體中文" : "English";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium shadow-sm ring-1 ring-black/5 text-slate-900">
      <Lucide.BadgeCheck className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

/* ------------ Localized UI labels ------------ */
function dict(lang: Lang) {
  if (lang === "jp")
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
  if (lang === "zh")
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
      feeSideNote: "費用會依據目的與條件不同而調整。了解您的情況後，我們會提供客製化報價。",
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
    bottomHeading: "Start your next chapter abroad with the right relocation plan",
    feeSideHeading: "Start with a free consult",
    feeSideNote:
      "Pricing varies by purpose and requirements. Tell us your situation and we will prepare a tailored quote.",
    tagTailored: "Tailored quote",
    tagQuickReply: "Quick reply",
  };
}
