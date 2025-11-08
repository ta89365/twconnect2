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

type LucideIconType = typeof Building2;

const CANONICAL_SLUG = "taiwan-market-entry-support";
export const revalidate = 60;

const NAV_HEIGHT = 72;
const QUICKNAV_HEIGHT = 56;
const SECTION_SCROLL_MARGIN = NAV_HEIGHT + 16;

const HERO_TUNE = { x: 50, y: 33 };
const clamp01to100 = (n: number) => Math.min(100, Math.max(0, Math.round(n)));

type Lang = "jp" | "zh" | "en";
function resolveLang(sp?: string): Lang {
  const k = String(sp ?? "").trim().toLowerCase();
  if (!k) return "jp";
  if (
    k === "zh" || k === "zh-hant" || k === "hant" ||
    k === "zh_tw" || k === "zh-tw" ||
    k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn"
  ) return "zh";
  if (k === "en" || k === "en-us" || k === "en_us" || k === "en-gb") return "en";
  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";
  return "jp";
}
function t(lang: Lang, dict: Record<Lang, string>) { return dict[lang]; }

export async function generateMetadata(props: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp = props.searchParams && typeof (props.searchParams as any).then === "function"
    ? await (props.searchParams as Promise<{ lang?: string }>)
    : (props.searchParams as { lang?: string } | undefined);

  const lang = resolveLang(sp?.lang);
  const data = await sfetch<{ title?: string | null }>(twServiceDetailBySlug, { slug: CANONICAL_SLUG, lang });

  const fallbackTitle = t(lang, { jp: "台湾進出支援", zh: "台灣進出支援", en: "Taiwan Market Entry Support" } as any);
  const title = (data?.title || "").trim() || fallbackTitle;
  return { title, description: `${title} at Taiwan Connect` };
}

type ScheduleBlock = { title?: string | null; items?: string[] | null };
type FeeRow = { category?: string | null; serviceName?: string | null; fee?: string | null; notes?: string | null };
type SubsidiaryPlan = { plan?: string | null; services?: string[] | null; who?: string | null; feeJpy?: string | null; notes?: string | null };
type FeeCommonRow = { name?: string | null; details?: string[] | string | null; idealFor?: string[] | string | null; feeJpy?: string | null; notes?: string | null };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1C3D5A]">{children}</h2>;
}
function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg md:text-xl font-semibold text-neutral-900">{children}</h3>;
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

const ICON_MAP: Record<string, LucideIconType> = {
  "building-2": Building2,
  landmark: Landmark,
  scale: Scale,
  "clipboard-list": ClipboardList,
  clock: Clock,
  wrench: Wrench,
  "file-text": FileText,
  "check-circle-2": CheckCircle2,
  tags: Tags,
  "user-check": UserCheck,
};

const ICON_POOL_KEYS = [
  "building-2",
  "landmark",
  "scale",
  "clipboard-list",
  "clock",
  "wrench",
  "file-text",
  "check-circle-2",
  "tags",
  "user-check",
] as const;

type IconKey = typeof ICON_POOL_KEYS[number];

const keywordRules: Array<{ re: RegExp; key: IconKey }> = [
  { re: /設立|登記|incorporation|register|registration|articles/i, key: "building-2" },
  { re: /税務|稅務|會計|会計|tax|accounting|bookkeeping|filing/i, key: "scale" },
  { re: /投資|investment review|審査|審查|資本登記|capital/i, key: "landmark" },
  { re: /銀行|bank account|口座|開設|政府|government|agency|liaison/i, key: "file-text" },
  { re: /進出後|經營|運營|ongoing|maintenance/i, key: "wrench" },
  { re: /法規|罰則|compliance|規範|regulation/i, key: "clipboard-list" },
  { re: /時間|時程|schedule|耗時|time/i, key: "clock" },
];

function createUniqueIconPicker() {
  const used = new Set<IconKey>();
  function nextUnused(): IconKey {
    const k = ICON_POOL_KEYS.find((kk) => !used.has(kk)) ?? "check-circle-2";
    used.add(k);
    return k;
  }
  return function pick(text?: string) {
    const s = String(text ?? "");
    let key: IconKey | null = null;
    for (const rule of keywordRules) {
      if (rule.re.test(s)) {
        if (!used.has(rule.key)) key = rule.key;
        break;
      }
    }
    if (!key) key = nextUnused();
    else used.add(key);
    const IconC = ICON_MAP[key];
    return <IconC className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />;
  };
}

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
          <span className="inline-flex select-none items-center rounded-full border border-[#1C3D5A]/25 bg-[#1C3D5A]/5 px-2 py-0.5 text-xs font-semibold text-[#1C3D5A] leading-6">第{week}週</span>
        ) : null}
        <span className="text-neutral-900">{body}</span>
      </div>
    </li>
  );
}
function PriceBadge({ fee }: { fee?: string | null }) {
  if (!fee) return null;
  return <div className="shrink-0 rounded-full bg-[#EAF2FB] text-[#1C3D5A] px-2.5 py-1 text-xs md:text-sm font-semibold">{fee}</div>;
}
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[13px] md:text-sm">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
      <span className="text-neutral-900">{children}</span>
    </li>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
      {children}
    </div>
  );
}
function TheadBlue({ cols }: { cols: string[] }) {
  return (
    <thead className="bg-[#1C3D5A] text-white">
      <tr>
        {cols.map((c, i) => (
          <th key={i} className="text-left px-5 py-3 font-semibold">{c}</th>
        ))}
      </tr>
    </thead>
  );
}

/* ---------- 安全轉型 helper ---------- */
function toArray(v?: string[] | string | null): string[] {
  if (Array.isArray(v)) return v.filter(Boolean) as string[];
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}
function detailsArray(v?: string[] | string | null): string[] {
  return toArray(v);
}

export default async function TaiwanServicePage({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp = searchParams && typeof (searchParams as any).then === "function"
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

    // ★ 新增：五個表格的多語標題（由 GROQ 回傳已選語系字串）
    subsidiaryTitle?: string | null;
    branchTitle?: string | null;
    repOfficeTitle?: string | null;
    accountingTaxTitle?: string | null;
    valueAddedTitle?: string | null;

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

  const titles = await sfetch<{
    jp?: string | null;
    zh?: string | null;
    en?: string | null;
  }>(`
*[_type in ["twServiceDetail","twService","service"] && slug.current == $slug][0]{
  "jp": coalesce(titleJp, title.jp),
  "zh": coalesce(titleZh, title.zh),
  "en": coalesce(titleEn, title.en)
}
  `, { slug: CANONICAL_SLUG });

  const fallbackTitle = t(lang, { jp: "台湾進出支援", zh: "台灣進出支援", en: "Taiwan Market Entry Support" } as any);
  const preferByLang =
    lang === "jp" ? titles?.jp :
    lang === "zh" ? titles?.zh :
    titles?.en;

  const heroTitle =
    (preferByLang && String(preferByLang).trim()) ||
    ((data.title ?? "").trim()) ||
    fallbackTitle;

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
    valueAddedServices.length > 0;
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
    breadcrumb: t(lang, { jp: "ホーム / サービス / 台湾進出支援", zh: "首頁 / 服務內容 / 台灣進出支援", en: "Home / Services / Taiwan Market Entry" } as any),
    quickNav: {
      bg: t(lang, { jp: "背景", zh: "背景", en: "Background" } as any),
      ch: t(lang, { jp: "サービス課題", zh: "挑戰", en: "Challenges" } as any),
      sv: t(lang, { jp: "サービス内容", zh: "服務內容", en: "Services" } as any),
      fl: t(lang, { jp: "サービスの流れ", zh: "服務流程", en: "Service Flow" } as any),
      sc: t(lang, {
        zh: "服務流程和時程範例",
        en: "Service Process & Timeline Example",
        jp: "サービスの流れとスケジュール例",
      } as any),
      fe: t(lang, { jp: "料金（参考）", zh: "費用參考", en: "Fees (Reference)" } as any),
    },
    bottomCTAHeading: t(lang, {
      jp: "最適な進出戦略で、台湾での新しい一歩を",
      zh: "用最合適的進出策略，安心展開在台事業",
      en: "Start your next chapter in Taiwan with the right market entry plan",
    } as any),
    contactBtn: t(lang, { jp: "お問い合わせはこちら", zh: "聯絡我們", en: "Contact Us" } as any),
  };

  // ★ 五個表格小標題：優先使用 Sanity，否則回退到預設三語
  const tableTitles = {
    subsidiary: data.subsidiaryTitle ?? t(lang, {
      jp: "子会社設立サポート",
      zh: "子公司設立支援",
      en: "Subsidiary Establishment Support",
    } as any),
    branch: data.branchTitle ?? t(lang, {
      jp: "支店設立サポート",
      zh: "分公司設立支援",
      en: "Branch Office Establishment Support",
    } as any),
    rep: data.repOfficeTitle ?? t(lang, {
      jp: "駐在員事務所設立サポート",
      zh: "駐在辦事處設立支援",
      en: "Representative Office Establishment Support",
    } as any),
    accounting: data.accountingTaxTitle ?? t(lang, {
      jp: "会計・税務サポート",
      zh: "會計與稅務支援",
      en: "Accounting & Tax Support",
    } as any),
    valueAdded: data.valueAddedTitle ?? t(lang, {
      jp: "付加価値サービス",
      zh: "加值服務",
      en: "Value-Added Services",
    } as any),
  };

  const pickIconForChallenge = createUniqueIconPicker();
  const pickIconForService = createUniqueIconPicker();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b2231] text-white isolate">
      <NavigationServer lang={lang} />

      {/* HERO */}
      <section className="relative w-full">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[110vw] h-[110vh] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(26,121,178,0.28),rgba(12,38,58,0)_70%)]" />
          <div className="absolute top-24 right-1/3 w-[70vw] h-[70vh] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08),rgba(0,0,0,0)_70%)]" />
        </div>

        <div className="relative h-[42vh] sm:h-[52vh] md:h-[60vh] w-full overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={heroTitle}
              fill
              className="object-cover opacity-90"
              priority
              sizes="100vw"
              style={{ objectPosition: `${heroX}% ${heroY}%` }}
            />
          ) : (
            <div className="h-full w-full bg-[#1C3D5A]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-[#0b2231]/85" />

          <div className="absolute inset-0 grid place-items-center px-4 md:px-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-white text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
              {heroTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <nav
        className="bg-[#0f2c40] border-t border-b border-white/10 shadow-sm relative z-10"
        aria-label="Section quick navigation"
        style={{ height: QUICKNAV_HEIGHT }}
      >
        <div className="max-w-6xl mx-auto flex h-full flex-wrap items-center justify-center gap-2 px-4 md:px-6">
          {hasBackground && (
            <a href="#bg" className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30">
              <ClipboardList className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.bg}</span>
            </a>
          )}
          {(hasChallenges || hasServices) && (
            <a href="#ch" className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30">
              <Scale className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.ch}</span>
            </a>
          )}
          {hasFlow && (
            <a href="#fl" className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30">
              <ClipboardList className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.sc}</span>
            </a>
          )}
          {hasSchedules && (
            <a href="#sc" className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30">
              <Clock className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.sc}</span>
            </a>
          )}
          {hasFees && (
            <a href="#fe" className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30">
              <FileText className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">{labels.quickNav.fe}</span>
            </a>
          )}
        </div>
      </nav>

      {/* CONTENT */}
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

            {/* 挑戰 × 服務內容 */}
            {(hasChallenges || hasServices) && (
              <>
                <section
                  id="ch"
                  style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }}
                  className="mb-10 md:mb-14"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1C3D5A]">
                      {labels.quickNav.ch}
                    </h2>
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1C3D5A]">
                      {labels.quickNav.sv}
                    </h2>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {Array.from({ length: Math.max(challenges.length, services.length) }).map((_, i) => {
                      const ch = challenges[i];
                      const sv = services[i];
                      return (
                        <li key={`pair-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white hover:shadow-md transition min-h-[56px]">
                            {ch ? (
                              <>
                                {pickIconForChallenge(ch)}
                                <span className="text-neutral-900">{ch}</span>
                              </>
                            ) : (
                              <span className="text-neutral-400">&nbsp;</span>
                            )}
                          </div>

                          <div className="flex items-center rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white hover:shadow-md transition min-h-[56px]">
                            {sv ? (
                              <>
                                {pickIconForService(sv)}
                                <span className="text-neutral-900">{sv}</span>
                              </>
                            ) : (
                              <span className="text-neutral-400">&nbsp;</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {keywords.length > 0 && (
                    <div className="mt-6 md:mt-8">
                      <h3 className="text-lg font-medium mb-3 text-neutral-700">
                        {t(lang, { jp: "キーワード", zh: "關鍵詞", en: "Keywords" } as any)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((kw: string, idx: number) => (
                          <span
                            key={`kw-${idx}`}
                            className="inline-flex items-center rounded-full border border-[#1C3D5A]/20 px-3 py-1 text-sm bg-[#1C3D5A]/5"
                          >
                            <Tags className="w-4 h-4 mr-1.5 text-[#1C3D5A]" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <section id="sv" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="hidden" aria-hidden />

                {(hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {/* 流程：合併標題；移除每行「步驟 n」小字 */}
            {hasFlow && (
              <>
                <section id="fl" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-10 md:mb-14">
                  <SectionTitle>{labels.quickNav.sc}</SectionTitle>
                  <ol className="mt-6 relative ms-6 border-s-2 border-[#1C3D5A]/25">
                    {flow.map((step: string, idx: number) => (
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
                    {schedules.map((blk: ScheduleBlock, idx: number) => (
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
                          {(blk.items ?? []).map((it: string, i: number) => <ScheduleItem key={`sched-item-${idx}-${i}`} text={it} />)}
                        </ol>
                      </div>
                    ))}
                  </div>
                </section>
                {hasFees && <Separator />}
              </>
            )}

            {/* ====== 費用（表格樣式） ====== */}
            {hasFees && (
              <section id="fe" style={{ scrollMarginTop: SECTION_SCROLL_MARGIN }} className="mb-2 md:mb-4">
                <SectionTitle>{feesTitle}</SectionTitle>

                {/* I. Subsidiary */}
                {subsidiaryPlans.length > 0 && (
                  <div className="mt-6">
                    <SubTitle>{tableTitles.subsidiary}</SubTitle>
                    <TableShell>
                      <table className="min-w-full text-sm">
                        <TheadBlue cols={["Plan", "Service Details", "Ideal For", "Fee (JPY)"]} />
                        <tbody>
                          {subsidiaryPlans.map((row, i) => (
                            <tr key={`sp-${i}`} className="border-t border-neutral-200 align-top">
                              <td className="px-5 py-4 font-semibold text-neutral-900">{row.plan ?? ""}</td>
                              <td className="px-5 py-4">
                                <ul className="space-y-1">
                                  {(row.services ?? []).map((s, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                      <span className="text-neutral-900">{s}</span>
                                    </li>
                                  ))}
                                </ul>
                                {row.notes && <p className="mt-2 text-xs text-neutral-600">{row.notes}</p>}
                              </td>
                              <td className="px-5 py-4 text-neutral-800">{row.who ?? ""}</td>
                              <td className="px-5 py-4 font-semibold text-neutral-900">{row.feeJpy ?? ""}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableShell>
                  </div>
                )}

                {/* II. Branch */}
                {branchSupport.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>{tableTitles.branch}</SubTitle>
                    <TableShell>
                      <table className="min-w-full text-sm">
                        <TheadBlue cols={["Service Details", "Ideal For", "Fee (JPY)"]} />
                        <tbody>
                          {branchSupport.map((row, i) => {
                            const ideal = toArray(row.idealFor).join(" ／ ");
                            const details = detailsArray(row.details);
                            return (
                              <tr key={`br-${i}`} className="border-t border-neutral-200 align-top">
                                <td className="px-5 py-4">
                                  <div className="font-semibold text-neutral-900">{row.name ?? ""}</div>
                                  <ul className="mt-1.5 space-y-1">
                                    {details.map((d, k) => (
                                      <li key={k} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                        <span>{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {row.notes && <p className="mt-2 text-xs text-neutral-600">{row.notes}</p>}
                                </td>
                                <td className="px-5 py-4 text-neutral-800">{ideal}</td>
                                <td className="px-5 py-4 font-semibold text-neutral-900">{row.feeJpy ?? ""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TableShell>
                  </div>
                )}

                {/* III. Representative */}
                {repOfficeSupport.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>{tableTitles.rep}</SubTitle>
                    <TableShell>
                      <table className="min-w-full text-sm">
                        <TheadBlue cols={["Service Details", "Ideal For", "Fee (JPY)"]} />
                        <tbody>
                          {repOfficeSupport.map((row, i) => {
                            const ideal = toArray(row.idealFor).join(" ／ ");
                            const details = detailsArray(row.details);
                            return (
                              <tr key={`ro-${i}`} className="border-t border-neutral-200 align-top">
                                <td className="px-5 py-4">
                                  <div className="font-semibold text-neutral-900">{row.name ?? ""}</div>
                                  <ul className="mt-1.5 space-y-1">
                                    {details.map((d, k) => (
                                      <li key={k} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                        <span>{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {row.notes && <p className="mt-2 text-xs text-neutral-600">{row.notes}</p>}
                                </td>
                                <td className="px-5 py-4 text-neutral-800">{ideal}</td>
                                <td className="px-5 py-4 font-semibold text-neutral-900">{row.feeJpy ?? ""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TableShell>
                  </div>
                )}

                {/* IV. Accounting & Tax */}
                {accountingTaxSupport.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>{tableTitles.accounting}</SubTitle>
                    <TableShell>
                      <table className="min-w-full text-sm">
                        <TheadBlue cols={["Service Details", "Ideal For", "Fee (JPY)"]} />
                        <tbody>
                          {accountingTaxSupport.map((row, i) => {
                            const ideal = toArray(row.idealFor).join(" ／ ");
                            const details = detailsArray(row.details);
                            return (
                              <tr key={`at-${i}`} className="border-t border-neutral-200 align-top">
                                <td className="px-5 py-4">
                                  <div className="font-semibold text-neutral-900">{row.name ?? ""}</div>
                                  <ul className="mt-1.5 space-y-1">
                                    {details.map((d, k) => (
                                      <li key={k} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                        <span>{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {row.notes && <p className="mt-2 text-xs text-neutral-600">{row.notes}</p>}
                                </td>
                                <td className="px-5 py-4 text-neutral-800">{ideal}</td>
                                <td className="px-5 py-4 font-semibold text-neutral-900">{row.feeJpy ?? ""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TableShell>
                  </div>
                )}

                {/* V. Value-Added */}
                {valueAddedServices.length > 0 && (
                  <div className="mt-10">
                    <SubTitle>{tableTitles.valueAdded}</SubTitle>
                    <TableShell>
                      <table className="min-w-full text-sm">
                        <TheadBlue cols={["Service Details", "Ideal For", "Fee (JPY)"]} />
                        <tbody>
                          {valueAddedServices.map((row, i) => {
                            const ideal = toArray(row.idealFor).join(" ／ ");
                            const details = detailsArray(row.details);
                            return (
                              <tr key={`va-${i}`} className="border-t border-neutral-200 align-top">
                                <td className="px-5 py-4">
                                  <div className="font-semibold text-neutral-900">{row.name ?? ""}</div>
                                  <ul className="mt-1.5 space-y-1">
                                    {details.map((d, k) => (
                                      <li key={k} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                        <span>{d}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {row.notes && <p className="mt-2 text-xs text-neutral-600">{row.notes}</p>}
                                </td>
                                <td className="px-5 py-4 text-neutral-800">{ideal}</td>
                                <td className="px-5 py-4 font-semibold text-neutral-900">{row.feeJpy ?? ""}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </TableShell>
                  </div>
                )}

                {/* 舊 flat fallback */}
                {!hasFeesNew && feesFlat.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                    <table className="min-w-full text-sm">
                      <thead className="bg-[#1C3D5A] text-white">
                        <tr>
                          <th className="text-left px-5 py-3 font-semibold">{t(lang, { jp: "カテゴリ", zh: "類別", en: "Category" } as any)}</th>
                          <th className="text-left px-5 py-3 font-semibold">{t(lang, { jp: "サービス", zh: "服務項目", en: "Service" } as any)}</th>
                          <th className="text-left px-5 py-3 font-semibold">{t(lang, { jp: "料金 JPY", zh: "費用 JPY", en: "Fee JPY" } as any)}</th>
                          <th className="text-left px-5 py-3 font-semibold">{t(lang, { jp: "備考", zh: "備註", en: "Notes" } as any)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feesFlat.map((row: FeeRow, idx: number) => (
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

      {/* Bottom CTA */}
      <section className="bg-[#0b2231] py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl md:text-2xl font-semibold">
            {t(lang, { jp: "最適な進出戦略で、台湾での新しい一歩を", zh: "用最合適的進出策略，安心展開在台事業", en: "Start your next chapter in Taiwan with the right market entry plan" } as any)}
          </h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={(ctaLink ?? "/contact").startsWith("/") ? `${ctaLink ?? "/contact"}${(ctaLink ?? "/contact").includes("?") ? "&" : "?"}lang=${lang}` : ctaLink ?? "/contact"}
              className="inline-block bg-[#4A90E2] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              {t(lang, { jp: "お問い合わせはこちら", zh: "聯絡我們", en: "Contact Us" } as any)}
            </a>
            <a href="mailto:info@twconnects.com" className="inline-block bg白/10 border border-white/20 font-semibold px-6 py-3 rounded-lg hover:bg-white/15 transition">
              info@twconnects.com
            </a>
          </div>
        </div>
      </section>

      <FooterServer lang={(sp?.lang?.toLowerCase() as any) || lang} />
    </div>
  );
}
