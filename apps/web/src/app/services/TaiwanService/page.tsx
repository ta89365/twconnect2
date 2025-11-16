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
  Tags,
  UserCheck,
} from "lucide-react";

import FeesSection, {
  FeeRow,
  SubsidiaryPlan,
  FeeCommonRow,
} from "./FeesSection";

type LucideIconType = typeof Building2;

const CANONICAL_SLUG = "taiwan-market-entry-support";
export const revalidate = 60;

const NAV_HEIGHT = 72;
const QUICKNAV_HEIGHT = 56;
const SECTION_SCROLL_MARGIN = NAV_HEIGHT + 16;

const HERO_TUNE = { x: 50, y: 33 };
const clamp01to100 = (n: number) =>
  Math.min(100, Math.max(0, Math.round(n)));

type Lang = "jp" | "zh" | "en";

function resolveLang(sp?: string): Lang {
  const k = String(sp ?? "").trim().toLowerCase();

  if (!k) return "jp";

  if (
    k === "zh" ||
    k === "zh-hant" ||
    k === "hant" ||
    k === "zh_tw" ||
    k === "zh-tw" ||
    k === "zh-cn" ||
    k === "zh_cn" ||
    k === "zh-hans" ||
    k === "hans" ||
    k === "cn"
  )
    return "zh";

  if (k === "en" || k === "en-us" || k === "en_us" || k === "en-gb")
    return "en";

  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";

  return "jp";
}

function t(lang: Lang, dict: Record<Lang, string>) {
  return dict[lang];
}

// 將空字串或只有空白的字串視為無效，方便 fallback
function nz(...vals: Array<string | null | undefined>): string | undefined {
  for (const v of vals) {
    const s =
      typeof v === "string" ? v.trim() : String(v ?? "").trim();
    if (s) return s;
  }
  return undefined;
}

export async function generateMetadata(props: {
  searchParams?:
    | {
        lang?: string;
      }
    | Promise<{
        lang?: string;
      }>;
}) {
  const sp =
    props.searchParams &&
    typeof (props.searchParams as any).then === "function"
      ? await (props.searchParams as Promise<{ lang?: string }>)
      : (props.searchParams as { lang?: string } | undefined);

  const lang = resolveLang(sp?.lang);

  const data = await sfetch<{ title?: string | null }>(
    twServiceDetailBySlug,
    {
      slug: CANONICAL_SLUG,
      lang,
    }
  );

  const fallbackTitle = t(
    lang,
    {
      jp: "台湾進出支援",
      zh: "台灣進出支援",
      en: "Taiwan Market Entry Support",
    } as any
  );

  const title = nz(data?.title) ?? fallbackTitle;

  return {
    title,
    description: `${title} at Taiwan Connect`,
  };
}

type ScheduleBlock = {
  title?: string | null;
  items?: string[] | null;
};

// 服務流程的每個步驟：支援新舊兩種型態
type ServiceFlowStep =
  | {
      title?: string | null;
      description?: string | null;
    }
  | string
  | null;

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
      <p className="mt-1 text-[12px] md:text-sm text-neutral-600">
        {body}
      </p>
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
  "check-circle-2": UserCheck,
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

type IconKey = (typeof ICON_POOL_KEYS)[number];

const keywordRules: Array<{ re: RegExp; key: IconKey }> = [
  {
    re: /設立|登記|incorporation|register|registration|articles/i,
    key: "building-2",
  },
  {
    re: /税務|稅務|會計|会計|tax|accounting|bookkeeping|filing/i,
    key: "scale",
  },
  {
    re: /投資|investment review|審査|審查|資本登記|capital/i,
    key: "landmark",
  },
  {
    re: /銀行|bank account|口座|開設|政府|government|agency|liaison/i,
    key: "file-text",
  },
  {
    re: /進出後|經營|運營|ongoongo|maintenance/i,
    key: "wrench",
  },
  {
    re: /法規|罰則|compliance|規範|regulation/i,
    key: "clipboard-list",
  },
  {
    re: /時間|時程|schedule|耗時|time/i,
    key: "clock",
  },
];

function createUniqueIconPicker() {
  const used = new Set<IconKey>();

  function nextUnused(): IconKey {
    const k =
      ICON_POOL_KEYS.find((kk) => !used.has(kk)) ?? "check-circle-2";
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
    return (
      <IconC className="w-5 h-5 text-[#1C3D5A] shrink-0 mr-2" />
    );
  };
}

function parseWeekPrefix(input?: string) {
  const s = String(input ?? "").trim();
  const m = s.match(
    /^第?([一二三四五六七八九十百千0-9]+)\s*週[:：]?\s*(.*)$/
  );

  if (!m) return { week: null as string | null, body: s };

  return { week: m[1], body: m[2] || "" };
}

function ScheduleItem({ text }: { text: string }) {
  const { week, body } = parseWeekPrefix(text);

  return (
    <li className="relative ps-10">
      <span
        className="absolute left-4 top-0 bottom-0 w-px bg-[#1C3D5A]/15"
        aria-hidden
      />
      <span
        className="absolute left-[14px] top-1.5 h-3 w-3 rounded-full bg-[#1C3D5A]"
        aria-hidden
      />
      <div className="flex items-start gap-3">
        {week ? (
          <span className="inline-flex select-none items-center rounded-full border border-[#1C3D5A]/25 bg-[#1C3D5A]/5 px-2 py-0.5 text-xs font-semibold text-[#1C3D5A] leading-6">
            第{week}週
          </span>
        ) : null}
        <span className="text-neutral-900">{body}</span>
      </div>
    </li>
  );
}

type HeaderLabels = {
  plan: string;
  serviceDetails: string;
  idealFor: string;
  feeJpy: string;
  category: string;
  service: string;
  fee: string;
  notes: string;
};

export default async function TaiwanServicePage({
  searchParams,
}: {
  searchParams?:
    | {
        lang?: string;
      }
    | Promise<{
        lang?: string;
      }>;
}) {
  const sp =
    searchParams &&
    typeof (searchParams as any).then === "function"
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
    services?: {
      items?: string[] | null;
      keywords?: string[] | null;
    } | null;
    serviceFlow?: ServiceFlowStep[] | null;
    scheduleExample?: ScheduleBlock[] | null;

    // 五個表格的小標題（已依語系回傳）
    subsidiaryTitle?: string | null;
    branchTitle?: string | null;
    repOfficeTitle?: string | null;
    accountingTaxTitle?: string | null;
    valueAddedTitle?: string | null;

    // 五個表格欄位標題（已依語系回傳）
    subsidiaryColumns?:
      | {
          col1?: string | null;
          col2?: string | null;
          col3?: string | null;
          col4?: string | null;
        }
      | null;
    branchColumns?:
      | {
          col1?: string | null;
          col2?: string | null;
          col3?: string | null;
        }
      | null;
    repOfficeColumns?:
      | {
          col1?: string | null;
          col2?: string | null;
          col3?: string | null;
        }
      | null;
    accountingTaxColumns?:
      | {
          col1?: string | null;
          col2?: string | null;
          col3?: string | null;
        }
      | null;
    valueAddedColumns?:
      | {
          col1?: string | null;
          col2?: string | null;
          col3?: string | null;
        }
      | null;

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
  }>(
    `*[_type in ["twServiceDetail","twService","service"] && slug.current == $slug][0]{
      "jp": coalesce(titleJp, title.jp),
      "zh": coalesce(titleZh, title.zh),
      "en": coalesce(titleEn, title.en)
    }`,
    { slug: CANONICAL_SLUG }
  );

  const fallbackTitle = t(
    lang,
    {
      jp: "台湾進出支援",
      zh: "台灣進出支援",
      en: "Taiwan Market Entry Support",
    } as any
  );

  const preferByLang =
    lang === "jp"
      ? titles?.jp
      : lang === "zh"
      ? titles?.zh
      : titles?.en;

  const heroTitle =
    nz(preferByLang) || nz(data.title) || fallbackTitle;

  const coverUrl = data.coverImage?.url ?? "";
  const background = data.background ?? "";

  const challengesRaw = data.challenges ?? [];
  const services = data.services?.items ?? [];
  const keywords = data.services?.keywords ?? [];
  const flow = data.serviceFlow ?? [];
  const schedules = data.scheduleExample ?? [];

  const feesTitle =
    nz(data.feesSectionTitle) ??
    t(
      lang,
      {
        jp: "料金（参考）",
        zh: "費用（參考）",
        en: "Fees (Reference)",
      } as any
    );

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
  const hasChallenges = challengesRaw.length > 0;
  const hasServices = services.length > 0 || keywords.length > 0;
  const hasFlow = flow.some((step) => {
    if (!step) return false;
    if (typeof step === "string") return step.trim().length > 0;
    const title = (step.title ?? "").trim();
    const desc = (step.description ?? "").trim();
    return !!(title || desc);
  });
  const hasSchedules = schedules.length > 0;

  const labels = {
    quickNav: {
      bg: t(
        lang,
        {
          jp: "背景",
          zh: "背景",
          en: "Background",
        } as any
      ),
      ch: t(
        lang,
        {
          jp: "サービス課題",
          zh: "挑戰",
          en: "Challenges",
        } as any
      ),
      sv: t(
        lang,
        {
          jp: "サービス内容",
          zh: "服務內容",
          en: "Services",
        } as any
      ),
      fl: t(
        lang,
        {
          jp: "サービスの流れ",
          zh: "服務流程",
          en: "Service Flow",
        } as any
      ),
      sc: t(
        lang,
        {
          zh: "服務流程和時程範例",
          en: "Service Process & Timeline Example",
          jp: "サービスの流れとスケジュール例",
        } as any
      ),
      fe: t(
        lang,
        {
          jp: "サービスプラン",
          zh: "服務介紹",
          en: "Service Plans",
        } as any
      ),
    },
  };

  // 五個表格小標題：優先使用 Sanity，否則回退到預設三語
  const tableTitles = {
    subsidiary:
      nz(data.subsidiaryTitle) ??
      t(
        lang,
        {
          jp: "子会社設立サポート",
          zh: "子公司設立支援",
          en: "Subsidiary Establishment Support",
        } as any
      ),
    branch:
      nz(data.branchTitle) ??
      t(
        lang,
        {
          jp: "支店設立サポート",
          zh: "分公司設立支援",
          en: "Branch Office Establishment Support",
        } as any
      ),
    rep:
      nz(data.repOfficeTitle) ??
      t(
        lang,
        {
          jp: "駐在員事務所設立サポート",
          zh: "駐在辦事處設立支援",
          en: "Representative Office Establishment Support",
        } as any
      ),
    accounting:
      nz(data.accountingTaxTitle) ??
      t(
        lang,
        {
          jp: "会計・税務サポート",
          zh: "會計與稅務支援",
          en: "Accounting & Tax Support",
        } as any
      ),
    valueAdded:
      nz(data.valueAddedTitle) ??
      t(
        lang,
        {
          jp: "付加価値サービス",
          zh: "專業附加服務",
          en: "Value-Added Services",
        } as any
      ),
  };

  // 共用預設表頭（字串翻譯）
  const defaultHdr: HeaderLabels = {
    plan: t(
      lang,
      { jp: "プラン", zh: "方案", en: "Plan" } as any
    ),
    serviceDetails: t(
      lang,
      {
        jp: "サービス内容",
        zh: "服務內容",
        en: "Service Details",
      } as any
    ),
    idealFor: t(
      lang,
      {
        jp: "対象",
        zh: "適合對象",
        en: "Ideal For",
      } as any
    ),
    feeJpy: t(
      lang,
      {
        jp: "料金 JPY",
        zh: "費用 JPY",
        en: "Fee JPY",
      } as any
    ),
    category: t(
      lang,
      {
        jp: "カテゴリ",
        zh: "類別",
        en: "Category",
      } as any
    ),
    service: t(
      lang,
      {
        jp: "サービス",
        zh: "服務項目",
        en: "Service",
      } as any
    ),
    fee: t(
      lang,
      {
        jp: "料金 JPY",
        zh: "費用 JPY",
        en: "Fee JPY",
      } as any
    ),
    notes: t(
      lang,
      {
        jp: "備考",
        zh: "備註",
        en: "Notes",
      } as any
    ),
  };

  // I. 子公司表頭：只看 subsidiaryColumns，缺再用預設字串
  const hdrSubsidiary: HeaderLabels = {
    plan: nz(data.subsidiaryColumns?.col1) ?? defaultHdr.plan,
    serviceDetails:
      nz(data.subsidiaryColumns?.col2) ?? defaultHdr.serviceDetails,
    idealFor:
      nz(data.subsidiaryColumns?.col3) ?? defaultHdr.idealFor,
    feeJpy:
      nz(data.subsidiaryColumns?.col4) ?? defaultHdr.feeJpy,
    category: defaultHdr.category,
    service: defaultHdr.service,
    fee: defaultHdr.fee,
    notes: defaultHdr.notes,
  };

  // II. Branch 表頭：只看 branchColumns，缺再回退到預設
  const hdrBranch: HeaderLabels = {
    plan: defaultHdr.plan,
    serviceDetails:
      nz(data.branchColumns?.col1) ?? defaultHdr.serviceDetails,
    idealFor:
      nz(data.branchColumns?.col2) ?? defaultHdr.idealFor,
    feeJpy: nz(data.branchColumns?.col3) ?? defaultHdr.feeJpy,
    category: defaultHdr.category,
    service: defaultHdr.service,
    fee: defaultHdr.fee,
    notes: defaultHdr.notes,
  };

  // III. Rep Office 表頭
  const hdrRep: HeaderLabels = {
    plan: defaultHdr.plan,
    serviceDetails:
      nz(data.repOfficeColumns?.col1) ?? defaultHdr.serviceDetails,
    idealFor:
      nz(data.repOfficeColumns?.col2) ?? defaultHdr.idealFor,
    feeJpy: nz(data.repOfficeColumns?.col3) ?? defaultHdr.feeJpy,
    category: defaultHdr.category,
    service: defaultHdr.service,
    fee: defaultHdr.fee,
    notes: defaultHdr.notes,
  };

  // IV. Accounting & Tax 表頭
  const hdrAccounting: HeaderLabels = {
    plan: defaultHdr.plan,
    serviceDetails:
      nz(data.accountingTaxColumns?.col1) ??
      defaultHdr.serviceDetails,
    idealFor:
      nz(data.accountingTaxColumns?.col2) ?? defaultHdr.idealFor,
    feeJpy:
      nz(data.accountingTaxColumns?.col3) ?? defaultHdr.feeJpy,
    category: defaultHdr.category,
    service: defaultHdr.service,
    fee: defaultHdr.fee,
    notes: defaultHdr.notes,
  };

  // V. Value-Added 表頭
  const hdrValueAdded: HeaderLabels = {
    plan: defaultHdr.plan,
    serviceDetails:
      nz(data.valueAddedColumns?.col1) ?? defaultHdr.serviceDetails,
    idealFor:
      nz(data.valueAddedColumns?.col2) ?? defaultHdr.idealFor,
    feeJpy:
      nz(data.valueAddedColumns?.col3) ?? defaultHdr.feeJpy,
    category: defaultHdr.category,
    service: defaultHdr.service,
    fee: defaultHdr.fee,
    notes: defaultHdr.notes,
  };

  // 舊 flat fallback 用（只有一張表，用預設即可）
  const hdrFlat: HeaderLabels = defaultHdr;

  // 欄寬設定
  const widthsSubsidiary = [8, 12, 15, 13]; // Plan / Details / Ideal / Fee
  const widthsCommon = [35, 32, 24]; // Details / Ideal / Fee

  const pickIconForChallenge = createUniqueIconPicker();
  const pickIconForService = createUniqueIconPicker();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b2231] text-white isolate">
      <NavigationServer lang={lang} />

      {/* HERO */}
      <section className="relative w-full">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 overflow-hidden"
        >
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
              style={{
                objectPosition: `${heroX}% ${heroY}%`,
              }}
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
            <a
              href="#bg"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <ClipboardList className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">
                {labels.quickNav.bg}
              </span>
            </a>
          )}

          {(hasChallenges || hasServices) && (
            <a
              href="#ch"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <Scale className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">
                {labels.quickNav.ch}
              </span>
            </a>
          )}

          {hasFlow && (
            <a
              href="#fl"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <ClipboardList className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">
                {labels.quickNav.fl}
              </span>
            </a>
          )}

          {hasSchedules && (
            <a
              href="#sc"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <Clock className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">
                {labels.quickNav.sc}
              </span>
            </a>
          )}

          {hasFees && (
            <a
              href="#fe"
              className="group inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm md:text-base transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <FileText className="w-4 h-4 mr-2 opacity-80 group-hover:opacity-100" />
              <span className="opacity-80 group-hover:opacity-100">
                {labels.quickNav.fe}
              </span>
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
                <section
                  id="bg"
                  style={{
                    scrollMarginTop: SECTION_SCROLL_MARGIN,
                  }}
                  className="mb-10 md:mb-14"
                >
                  <SectionTitle>
                    {labels.quickNav.bg}
                  </SectionTitle>
                  <p className="mt-4 text-base md:text-lg leading-7 text-neutral-800 whitespace-pre-line">
                    {background}
                  </p>
                </section>

                {(hasChallenges ||
                  hasServices ||
                  hasFlow ||
                  hasSchedules ||
                  hasFees) && <Separator />}
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
                  {/* 標題：手機與桌機都左右兩欄 */}
                  <div className="mb-4 md:mb-6 grid grid-cols-2 gap-4">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1C3D5A]">
                      {labels.quickNav.ch}
                    </h2>
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1C3D5A]">
                      {labels.quickNav.sv}
                    </h2>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {Array.from({
                      length: Math.max(
                        challengesRaw.length,
                        services.length
                      ),
                    }).map((_, i) => {
                      const rawCh = challengesRaw[i];
                      const chText = String(rawCh ?? "").trim();
                      const isEllipsis =
                        chText &&
                        /^[.。．…]+$/.test(chText);
                      const ch =
                        chText && !isEllipsis ? chText : "";

                      const svRaw = services[i];
                      const sv = String(svRaw ?? "").trim();

                      return (
                        <li
                          key={`pair-${i}`}
                          className="grid grid-cols-2 gap-3"
                        >
                          {/* 左：挑戰 */}
                          <div className="flex items-center rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white hover:shadow-md transition min-h-[56px]">
                            {ch ? (
                              <>
                                {pickIconForChallenge(ch)}
                                <span className="text-neutral-900">
                                  {ch}
                                </span>
                              </>
                            ) : (
                              <span className="text-neutral-400">
                                &nbsp;
                              </span>
                            )}
                          </div>

                          {/* 右：服務內容 */}
                          <div className="flex items-center rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white hover:shadow-md transition min-h-[56px]">
                            {sv ? (
                              <>
                                {pickIconForService(sv)}
                                <span className="text-neutral-900">
                                  {sv}
                                </span>
                              </>
                            ) : (
                              <span className="text-neutral-400">
                                &nbsp;
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Keywords 區塊已依需求移除 */}
                </section>

                {/* 保留錨點供 quick nav 用 */}
                <section
                  id="sv"
                  style={{
                    scrollMarginTop: SECTION_SCROLL_MARGIN,
                  }}
                  className="hidden"
                  aria-hidden
                />

                {(hasFlow || hasSchedules || hasFees) && (
                  <Separator />
                )}
              </>
            )}

            {/* 流程 */}
            {hasFlow && (
              <>
                <section
                  id="fl"
                  style={{
                    scrollMarginTop: SECTION_SCROLL_MARGIN,
                  }}
                  className="mb-10 md:mb-14"
                >
                  <SectionTitle>
                    {labels.quickNav.fl}
                  </SectionTitle>

                  <ol className="mt-6 relative ms-6 border-s-2 border-[#1C3D5A]/25">
                    {flow.map(
                      (step: ServiceFlowStep, idx: number) => {
                        let title = "";
                        let desc = "";

                        if (typeof step === "string") {
                          title = step.trim();
                        } else if (step) {
                          title = (step.title ?? "").trim();
                          desc =
                            (step.description ?? "").trim();
                        }

                        if (!title && !desc) return null;

                        return (
                          <li
                            key={`flow-${idx}`}
                            className="mb-6 ms-4"
                          >
                            <div className="absolute w-7 h-7 -start-[22px] mt-1.5 rounded-full bg-[#1C3D5A] text-white grid place-items-center text-xs font-bold ring-2 ring-white">
                              {idx + 1}
                            </div>

                            <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-5 shadow-sm">
                              {title && (
                                <div className="text-neutral-900 font-semibold">
                                  {title}
                                </div>
                              )}
                              {desc && (
                                <p className="mt-1 text-sm md:text-base text-neutral-800">
                                  {desc}
                                </p>
                              )}
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ol>
                </section>

                {(hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {/* 時程 */}
            {hasSchedules && (
              <>
                <section
                  id="sc"
                  style={{
                    scrollMarginTop: SECTION_SCROLL_MARGIN,
                  }}
                  className="mb-10 md:mb-14"
                >
                  <SectionTitle>
                    {labels.quickNav.sc}
                  </SectionTitle>

                  <div className="mt-6 grid gap-5 grid-cols-1">
                    {schedules.map(
                      (blk: ScheduleBlock, idx: number) => (
                        <div
                          key={`sched-${idx}`}
                          className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 hover:shadow-md transition"
                        >
                          {blk.title && (
                            <div className="mb-4 flex items-center gap-2">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1C3D5A]/10 text-[#1C3D5A]">
                                <Clock className="h-4 w-4" />
                              </span>
                              <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
                                {blk.title}
                              </h3>
                            </div>
                          )}

                          <ol className="relative ms-1 space-y-3">
                            {(blk.items ?? []).map(
                              (it: string, i: number) => (
                                <ScheduleItem
                                  key={`sched-item-${idx}-${i}`}
                                  text={it}
                                />
                              )
                            )}
                          </ol>
                        </div>
                      )
                    )}
                  </div>
                </section>

                {hasFees && <Separator />}
              </>
            )}

            {/* ====== 費用（表格樣式） ====== */}
            {hasFees && (
              <section
                id="fe"
                style={{
                  scrollMarginTop: SECTION_SCROLL_MARGIN,
                }}
                className="mb-2 md:mb-4"
              >
                <SectionTitle>{feesTitle}</SectionTitle>

                <FeesSection
                  tableTitles={tableTitles}
                  hdrSubsidiary={hdrSubsidiary}
                  hdrBranch={hdrBranch}
                  hdrRep={hdrRep}
                  hdrAccounting={hdrAccounting}
                  hdrValueAdded={hdrValueAdded}
                  hdrFlat={hdrFlat}
                  widthsSubsidiary={widthsSubsidiary}
                  widthsCommon={widthsCommon}
                  subsidiaryPlans={subsidiaryPlans}
                  branchSupport={branchSupport}
                  repOfficeSupport={repOfficeSupport}
                  accountingTaxSupport={accountingTaxSupport}
                  valueAddedServices={valueAddedServices}
                  feesFlat={feesFlat}
                />
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
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
                  ? `${ctaLink ?? "/contact"}${
                      (ctaLink ?? "/contact").includes("?")
                        ? "&"
                        : "?"
                    }lang=${lang}`
                  : ctaLink ?? "/contact"
              }
              className="inline-block bg-[#4A90E2] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              {t(
                lang,
                {
                  jp: "お問い合わせはこちら",
                  zh: "聯絡我們",
                  en: "Contact Us",
                } as any
              )}
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

      <FooterServer
        lang={(sp?.lang?.toLowerCase() as any) || lang}
      />
    </div>
  );
}
