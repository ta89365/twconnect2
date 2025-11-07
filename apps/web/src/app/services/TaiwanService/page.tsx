// apps/web/src/app/services/TaiwanService/page.tsx

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import Image from "next/image";
import React from "react";
import { notFound } from "next/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import { twServiceDetailBySlug } from "@/lib/queries/twServices";

import {
  Building2,
  Landmark,
  Scale,
  ClipboardList,
  Clock,
  Wrench,
  FileText,
  CheckCircle2,
  Tags,
  UserCheck,
} from "lucide-react";

/**
 * Taiwan Service – Fees polish
 * 方案卡片等高並將 Ideal For 貼齊底部
 * Branch 與 Representative 以單欄直排顯示並縮減多餘白邊
 */

const CANONICAL_SLUG = "taiwan-market-entry-support";
export const revalidate = 60;

/* ============================ 尺寸與焦點 ============================ */
const NAV_HEIGHT = 72;
const QUICKNAV_HEIGHT = 56;
const SECTION_SCROLL_MARGIN = NAV_HEIGHT + 16;

const HERO_TUNE = { x: 50, y: 33 };
const clamp01to100 = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

/* ============================ i18n helper ============================ */
type Lang = "jp" | "zh" | "en";
function resolveLang(sp?: string): Lang {
  const l = (sp ?? "").toLowerCase();
  return l === "zh" || l === "en" || l === "jp" ? (l as Lang) : "jp";
}
function t(lang: Lang, dict: Record<Lang, string>) {
  return dict[lang];
}

/* ============================ Metadata ============================ */
export async function generateMetadata(props: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp =
    props.searchParams && typeof (props.searchParams as any).then === "function"
      ? await (props.searchParams as Promise<{ lang?: string }>)
      : (props.searchParams as { lang?: string } | undefined);

  const lang = resolveLang(sp?.lang);
  const data = await sfetch<{ title?: string | null }>(twServiceDetailBySlug, {
    slug: CANONICAL_SLUG,
    lang,
  });

  const fallbackTitle = t(lang, {
    jp: "台湾進出支援",
    zh: "台灣進出支援",
    en: "Taiwan Market Entry Support",
  } as any);

  const title = (data?.title || "").trim() || fallbackTitle;
  return { title, description: `${title} at Taiwan Connect` };
}

/* ============================ Types ============================ */
type ScheduleBlock = { title?: string | null; items?: string[] | null };
type FeeRow = { category?: string | null; serviceName?: string | null; fee?: string | null; notes?: string | null };

type SubsidiaryPlan = {
  plan?: string | null;
  services?: string[] | null;
  who?: string | null;
  feeJpy?: string | null;
  notes?: string | null;
};
type FeeCommonRow = {
  name?: string | null;
  details?: string[] | null;
  idealFor?: string[] | null;
  feeJpy?: string | null;
  notes?: string | null;
};

/* ============================ 小元件 ============================ */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1C3D5A]">
      {children}
    </h2>
  );
}
function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
      {children}
    </h3>
  );
}
function Separator() {
  return (
    <div className="my-10 md:my-14">
      <div className="h-0.5 md:h-[3px] w-full rounded-full bg-gradient-to-r from-transparent via-[#1C3D5A]/30 to-transparent" />
    </div>
  );
}
function WarningBlock({ text }: { text?: string | null }) {
  if (!text) return null;
  const body = String(text).replace(/^⚠️\s*/, "");
  return (
    <div className="mb-2">
      <div className="text-amber-600 text-sm leading-none">⚠️</div>
      <p className="mt-1 text-[12px] md:text-sm text-neutral-600">{body}</p>
    </div>
  );
}

function iconFor(text: string) {
  const ttext = (text || "").toLowerCase();
  if (/設立|登記|incorporation|register|registration|articles/.test(ttext)) {
    return <Building2 className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  if (/税務|稅務|會計|会計|tax|accounting|bookkeeping|filing/.test(ttext)) {
    return <Scale className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  if (/投資|investment review|審査|審查|資本登記|capital/.test(ttext)) {
    return <Landmark className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  if (/銀行|bank account|口座|開設|政府|government|agency|liaison/.test(ttext)) {
    return <FileText className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  if (/進出後|經營|運營|ongoing|compliance/.test(ttext)) {
    return <Wrench className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  if (/法規|罰則|compliance|penalty|規範|regulation/.test(ttext)) {
    return <ClipboardList className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  if (/時間|時程|schedule|delay|耗時|time/.test(ttext)) {
    return <Clock className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  }
  return <CheckCircle2 className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
}

/* ========= Schedule item ========= */
function parseWeekPrefix(input?: string) {
  const s = String(input ?? "").trim();
  const m = s.match(/^第?([一二三四五六七八九十百千0-9]+)\s*週[:：]?\s*(.*)$/);
  if (!m) return { week: null as string | null, body: s };
  return { week: m[1], body: m[2] || "" };
}
function ScheduleItem({ text }: { text: string }) {
  const { week, body } = parseWeekPrefix(text);
  return (
    <li className="relative ps-10">
      <span className="absolute left-4 top-0 bottom-0 w-px bg-[#1C3D5A]/15" aria-hidden />
      <span className="absolute left-[14px] top-1.5 h-3 w-3 rounded-full bg-[#1C3D5A]" aria-hidden />
      <div className="flex items-start gap-3">
        {week ? (
          <span className="inline-flex select-none items-center rounded-full border border-[#1C3D5A]/25 bg-[#1C3D5A]/5 px-2 py-0.5 text-xs font-semibold text-[#1C3D5A] leading-6">
            第{week}週
          </span>
        ) : (
          <span className="inline-flex select-none items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-600 leading-6">
            STEP
          </span>
        )}
        <span className="text-neutral-900">{body}</span>
      </div>
    </li>
  );
}

/* ========= New fee cards ========= */
function PriceBadge({ fee }: { fee?: string | null }) {
  if (!fee) return null;
  return (
    <div className="shrink-0 rounded-full bg-[#EAF2FB] text-[#1C3D5A] px-2.5 py-1 text-xs md:text-sm font-semibold">
      {fee}
    </div>
  );
}
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[13px] md:text-sm">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
      <span className="text-neutral-900">{children}</span>
    </li>
  );
}

/* 方案卡片 等高 並將 Ideal For 貼底 */
function SubsidiaryPlanCard({ row }: { row: SubsidiaryPlan }) {
  const s = String(row.plan ?? "").trim();
  const m = s.match(/^(.*?(方案|Plan))\s*(.*)$/i);
  const lead = m ? m[1] : s;
  const rest = m && m[3] ? m[3] : "";

  return (
    <div className="group relative h-full flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 hover:shadow-md transition">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 rounded-s-2xl bg-[#1C3D5A]/70" />

      {/* 標題 + 費用 */}
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-base md:text-lg font-semibold text-neutral-900 leading-tight">
          <span>{lead}</span>
          {rest && <span className="block font-semibold">{rest}</span>}
        </h4>
        <PriceBadge fee={row.feeJpy} />
      </div>

      {/* 服務清單 */}
      {Array.isArray(row.services) && row.services.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] md:text-[11px] font-semibold tracking-wide text-neutral-500">
            SERVICE
          </div>
          <ul className="mt-1.5 space-y-1.5">
            {row.services.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] md:text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                <span className="text-neutral-900">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 分隔線與推底空白 */}
      <div className="mt-4 md:mt-5 border-t border-neutral-200" />
      <div className="mt-3 md:mt-4 flex-1" />

      {/* 警示與 Ideal For */}
      <WarningBlock text={row.notes} />
      {row.who && (
        <div className="mt-auto flex items-center gap-2 rounded-lg border border-[#1C3D5A]/15 bg-[#1C3D5A]/5 px-3 py-2 text-[13px] md:text-sm text-neutral-800">
          <UserCheck className="h-4 w-4 text-[#1C3D5A]" />
          <span className="font-medium text-neutral-900">Ideal For</span>
          <span className="text-neutral-700">{row.who}</span>
        </div>
      )}
    </div>
  );
}

/* 通用卡  用於 Branch Representative A&T Value-added */
function FeeCommonCard({ row }: { row: FeeCommonRow }) {
  return (
    <div className="group relative w-full rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 hover:shadow-md transition">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 rounded-s-2xl bg-[#1C3D5A]/50" />
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-base md:text-lg font-semibold text-neutral-900 leading-6">
          {row.name}
        </h4>
        <PriceBadge fee={row.feeJpy} />
      </div>

      {Array.isArray(row.details) && row.details.length > 0 && (
        <div className="mt-3">
          <div className="text-[10px] md:text-[11px] font-semibold tracking-wide text-neutral-500">
            DETAILS
          </div>
          <ul className="mt-1.5 space-y-1.5">
            {row.details.map((s, i) => (
              <Bullet key={i}>{s}</Bullet>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(row.idealFor) && row.idealFor.length > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#1C3D5A]/15 bg-[#1C3D5A]/5 px-3 py-2 text-[13px] md:text-sm text-neutral-800">
          <UserCheck className="h-4 w-4 text-[#1C3D5A]" />
          <span className="font-medium text-neutral-900">Ideal For</span>
          <span className="text-neutral-700">{row.idealFor.join(" ／ ")}</span>
        </div>
      )}

      {row.notes && (
        <p className="mt-2.5 text-[12px] md:text-sm text-neutral-600 whitespace-pre-line">
          {row.notes}
        </p>
      )}
    </div>
  );
}

/* ============================ Page ============================ */
export default async function TaiwanServicePage({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  const lang = resolveLang(sp?.lang);

  const data = await sfetch<{
    _id: string;
    slug: string;
    title?: string | null;
    coverImage?: { url?: string | null } | null;
    background?: string | null;
    challenges?: string[] | null;
    services?: { items?: string[] | null; keywords?: string[] | null } | null;
    serviceFlow?: string[] | null;
    scheduleExample?: ScheduleBlock[] | null;

    feesSectionTitle?: string | null;
    subsidiaryPlans?: SubsidiaryPlan[] | null;
    branchSupport?: FeeCommonRow[] | null;
    repOfficeSupport?: FeeCommonRow[] | null;
    accountingTaxSupport?: FeeCommonRow[] | null;
    valueAddedServices?: FeeCommonRow[] | null;

    feesFlat?: FeeRow[] | null;

    ctaLabel?: string | null;
    ctaLink?: string | null;
  }>(twServiceDetailBySlug, { slug: CANONICAL_SLUG, lang });

  if (!data) {
    console.error("[TaiwanService] Not found", CANONICAL_SLUG);
    notFound();
  }

  const fallbackTitle = t(lang, {
    jp: "台湾進出支援",
    zh: "台灣進出支援",
    en: "Taiwan Market Entry Support",
  } as any);

  const title = (data.title || "").trim() || fallbackTitle;
  const coverUrl = data.coverImage?.url ?? "";
  const background = data.background ?? "";
  const challenges = data.challenges ?? [];
  const services = data.services?.items ?? [];
  const keywords = data.services?.keywords ?? [];
  const flow = data.serviceFlow ?? [];
  const schedules = data.scheduleExample ?? [];

  const feesTitle =
    data.feesSectionTitle ?? t(lang, { jp: "料金（参考）", zh: "費用（參考）", en: "Fees (Reference)" } as any);
  const subsidiaryPlans = data.subsidiaryPlans ?? [];
  const branchSupport = data.branchSupport ?? [];
  const repOfficeSupport = data.repOfficeSupport ?? [];
  const accountingTaxSupport = data.accountingTaxSupport ?? [];
  const valueAddedServices = data.valueAddedServices ?? [];

  const feesFlat = data.feesFlat ?? [];

  const hasFeesNew =
    subsidiaryPlans.length +
      branchSupport.length +
      repOfficeSupport.length +
      accountingTaxSupport.length +
      valueAddedServices.length >
    0;
  const hasFees = hasFeesNew || feesFlat.length > 0;

  const ctaLink = data.ctaLink ?? "/contact";

  const heroX = clamp01to100(HERO_TUNE.x);
  const heroY = clamp01to100(HERO_TUNE.y);

  const hasBackground = !!background;
  const hasChallenges = challenges.length > 0;
  const hasServices = services.length > 0 || keywords.length > 0;
  const hasFlow = flow.length > 0;
  const hasSchedules = schedules.length > 0;

  const labels = {
    breadcrumb: t(
      lang,
      {
        jp: "ホーム / サービス / 台湾進出支援",
        zh: "首頁 / 服務內容 / 台灣進出支援",
        en: "Home / Services / Taiwan Market Entry",
      } as any
    ),
    quickNav: {
      bg: t(lang, { jp: "背景", zh: "背景", en: "Background" } as any),
      ch: t(lang, { jp: "課題", zh: "挑戰", en: "Challenges" } as any),
      sv: t(lang, { jp: "サービス内容", zh: "服務內容", en: "Services" } as any),
      fl: t(lang, { jp: "サービスの流れ", zh: "服務流程", en: "Service Flow" } as any),
      sc: t(lang, { jp: "スケジュール例", zh: "時程範例", en: "Schedule" } as any),
      fe: t(lang, { jp: "料金（参考）", zh: "費用參考", en: "Fees (Reference)" } as any),
    },
    bottomCTAHeading: t(
      lang,
      {
        jp: "最適な進出戦略で、台湾での新しい一歩を",
        zh: "用最合適的進出策略，安心展開在台事業",
        en: "Start your next chapter in Taiwan with the right market entry plan",
      } as any
    ),
    contactBtn: t(lang, { jp: "お問い合わせはこちら", zh: "聯絡我們", en: "Contact Us" } as any),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b2231] text-white isolate">
      <NavigationServer lang={lang} />

{/* ============================ HERO ============================ */}
<section className="relative w-full mt-[72px]">
  <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
    {/* 背景漸層與光暈 */}
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[110vw] h-[110vh] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(26,121,178,0.28),rgba(12,38,58,0)_70%)]" />
    <div className="absolute top-24 right-1/3 w-[70vw] h-[70vh] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08),rgba(0,0,0,0)_70%)]" />
  </div>

  <div className="relative h-[42vh] sm:h-[52vh] md:h-[60vh] w-full overflow-hidden">
    {coverUrl ? (
      <Image
        src={coverUrl}
        alt={title}
        fill
        className="object-cover opacity-90"
        priority
        sizes="100vw"
        style={{ objectPosition: `${heroX}% ${heroY}%` }}
      />
    ) : (
      <div className="h-full w-full bg-[#1C3D5A]" />
    )}

    {/* 底部漸層：讓白字清楚 */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-[#0b2231]/85" />

    {/* 置中內容 */}
    <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-10 md:pb-14 px-4 md:px-6">
      {/* 麵包屑 */}
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur px-4 py-1 text-xs md:text-sm mb-3 md:mb-5">
        <FileText className="w-4 h-4" />
        <span>{labels.breadcrumb}</span>
      </div>

      {/* 標題：置中顯示，略有陰影 */}
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
        {title}
      </h1>
    </div>
  </div>
</section>


      {/* ============================ QUICK NAV ============================ */}
      <nav
        className="bg-[#0f2c40] border-t border-b border-white/10 shadow-sm relative z-10"
        aria-label="Section quick navigation"
        style={{ height: QUICKNAV_HEIGHT }}
      >
        <div className="max-w-6xl mx-auto flex h-full flex-wrap items-center justify-center gap-2 px-4 md:px-6">
          {hasBackground && (
            <a
              href="#bg"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <ClipboardList className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.bg}</span>
            </a>
          )}
          {hasChallenges && (
            <a
              href="#ch"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <Scale className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.ch}</span>
            </a>
          )}
          {hasServices && (
            <a
              href="#sv"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <Building2 className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.sv}</span>
            </a>
          )}
          {hasFlow && (
            <a
              href="#fl"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <ClipboardList className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.fl}</span>
            </a>
          )}
          {hasSchedules && (
            <a
              href="#sc"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <Clock className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.sc}</span>
            </a>
          )}
          {hasFees && (
            <a
              href="#fe"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <FileText className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.fe}</span>
            </a>
          )}
        </div>
      </nav>

      {/* ============================ 內容 ============================ */}
      <main className="relative z-0 flex-1 py-8 md:py-12 text-neutral-900">
        <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="relative rounded-3xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden p-6 md:p-10">
            {/* 背景 */}
            {hasBackground && (
              <>
                <section id="bg" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-10 md:mb-14">
                  <SectionTitle>{labels.quickNav.bg}</SectionTitle>
                  <p className="mt-4 text-base md:text-lg leading-7 text-neutral-800 whitespace-pre-line">{background}</p>
                </section>
                {(hasChallenges || hasServices || hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {/* 課題 */}
            {hasChallenges && (
              <>
                <section id="ch" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-10 md:mb-14">
                  <SectionTitle>{labels.quickNav.ch}</SectionTitle>
                  <ul className="mt-6 grid gap-3 grid-cols-1">
                    {challenges.map((item, idx) => (
                      <li key={`challenge-${idx}`} className="flex items-center rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white hover:shadow-md transition">
                        {iconFor(item ?? "")}
                        <span className="text-neutral-900">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                {(hasServices || hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {/* 服務內容 */}
            {hasServices && (
              <>
                <section id="sv" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-10 md:mb-14">
                  <SectionTitle>{labels.quickNav.sv}</SectionTitle>

                  {services.length > 0 && (
                    <ul className="mt-6 grid gap-3 grid-cols-1">
                      {services.map((svc, idx) => (
                        <li key={`svc-${idx}`} className="flex items-center rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white hover:shadow-md transition">
                          {iconFor(svc ?? "")}
                          <span className="text-neutral-900">{svc}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {keywords.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3 text-neutral-700">
                        {t(lang, { jp: "キーワード", zh: "關鍵詞", en: "Keywords" } as any)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, idx) => (
                          <span key={`kw-${idx}`} className="inline-flex items-center rounded-full border border-[#1C3D5A]/20 px-3 py-1 text-sm bg-[#1C3D5A]/5">
                            <Tags className="w-4 h-4 mr-1.5 text-[#1C3D5A]" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
                {(hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {/* 流程 */}
            {hasFlow && (
              <>
                <section id="fl" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-10 md:mb-14">
                  <SectionTitle>{labels.quickNav.fl}</SectionTitle>
                  <ol className="mt-6 relative ms-6 border-s-2 border-[#1C3D5A]/25">
                    {flow.map((step, idx) => (
                      <li key={`flow-${idx}`} className="mb-6 ms-4">
                        <div className="absolute w-7 h-7 -start-[22px] mt-1.5 rounded-full bg-[#1C3D5A] text-white grid place-items-center text-xs font-bold ring-2 ring-white">
                          {idx + 1}
                        </div>
                        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-5 shadow-sm">
                          <div className="text-neutral-900">{step}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
                {(hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {/* 時程 */}
            {hasSchedules && (
              <>
                <section id="sc" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-10 md:mb-14">
                  <SectionTitle>{labels.quickNav.sc}</SectionTitle>

                  <div className="mt-6 grid gap-5 grid-cols-1">
                    {schedules.map((blk, idx) => (
                      <div key={`sched-${idx}`} className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 hover:shadow-md transition">
                        {blk.title && (
                          <div className="mb-4 flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1C3D5A]/10 text-[#1C3D5A]">
                              <Clock className="h-4 w-4" />
                            </span>
                            <h3 className="text-lg md:text-xl font-semibold text-neutral-900">{blk.title}</h3>
                          </div>
                        )}
                        <ol className="relative ms-1 space-y-3">
                          {(blk.items ?? []).map((it, i) => (
                            <ScheduleItem key={`sched-item-${idx}-${i}`} text={it} />
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </section>
                {hasFees && <Separator />}
              </>
            )}

            {/* ====== 費用區塊 ====== */}
            {hasFees && (
              <section id="fe" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-2 md:mb-4">
                <SectionTitle>{feesTitle}</SectionTitle>

                {/* I 子公司方案 等高卡片 1 2 3 欄 */}
                {subsidiaryPlans.length > 0 && (
                  <div className="mt-6">
                    <SubTitle>Ⅰ. Subsidiary Establishment Support</SubTitle>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                      {subsidiaryPlans.map((row, i) => (
                        <SubsidiaryPlanCard key={`sp-${i}`} row={row} />
                      ))}
                    </div>
                  </div>
                )}

                {/* II 分公司 單欄直排 滿寬 */}
                {branchSupport.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>Ⅱ. Branch Office Establishment Support</SubTitle>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {branchSupport.map((row, i) => (
                        <FeeCommonCard key={`br-${i}`} row={row} />
                      ))}
                    </div>
                  </div>
                )}

                {/* III 辦事處 單欄直排 滿寬 */}
                {repOfficeSupport.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>Ⅲ. Representative Office Establishment Support</SubTitle>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {repOfficeSupport.map((row, i) => (
                        <FeeCommonCard key={`ro-${i}`} row={row} />
                      ))}
                    </div>
                  </div>
                )}

                {/* IV 會計與稅務 兩欄維持 */}
                {accountingTaxSupport.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>Ⅳ. Accounting & Tax Support</SubTitle>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {accountingTaxSupport.map((row, i) => (
                        <FeeCommonCard key={`at-${i}`} row={row} />
                      ))}
                    </div>
                  </div>
                )}

                {/* V 加值服務 兩欄維持 */}
                {valueAddedServices.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>Ⅴ. Value-Added Services</SubTitle>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {valueAddedServices.map((row, i) => (
                        <FeeCommonCard key={`va-${i}`} row={row} />
                      ))}
                    </div>
                  </div>
                )}

                {/* 舊表 fallback */}
                {!hasFeesNew && feesFlat.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="min-w-full text-sm">
                      <thead className="bg-neutral-50 sticky top-0">
                        <tr>
                          <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "カテゴリ", zh: "類別", en: "Category" } as any)}</th>
                          <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "サービス", zh: "服務項目", en: "Service" } as any)}</th>
                          <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "料金 JPY", zh: "費用 JPY", en: "Fee JPY" } as any)}</th>
                          <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "備考", zh: "備註", en: "Notes" } as any)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feesFlat.map((row, idx) => (
                          <tr key={`fee-${idx}`} className="border-t border-neutral-200">
                            <td className="px-5 py-3">{row.category ?? ""}</td>
                            <td className="px-5 py-3">{row.serviceName ?? ""}</td>
                            <td className="px-5 py-3">{row.fee ?? ""}</td>
                            <td className="px-5 py-3 text-neutral-700">{row.notes ?? ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* ============================ 底部 CTA ============================ */}
      <section className="bg-[#0b2231] py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl md:text-2xl font-semibold">
            {t(
              lang,
              {
                jp: "最適な進出戦略で、台湾での新しい一歩を",
                zh: "用最合適的進出策略，安心展開在台事業",
                en: "Start your next chapter in Taiwan with the right market entry plan",
              } as any
            )}
          </h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={
                (ctaLink ?? "/contact").startsWith("/")
                  ? `${ctaLink ?? "/contact"}${(ctaLink ?? "/contact").includes("?") ? "&" : "?"}lang=${lang}`
                  : ctaLink ?? "/contact"
              }
              className="inline-block bg-[#4A90E2] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              {labels.contactBtn}
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

      <FooterServer lang={(sp?.lang?.toLowerCase() as any) || lang} />
    </div>
  );
}
