// File: apps/web/src/app/page.tsx
import NavigationServer from "@/components/NavigationServer"; // 伺服端導覽，支援 zh-cn
import HeroBanner from "@/components/hero-banner";
import LanguageSwitcher from "@/components/language-switcher";
import ChallengesSection from "@/components/ChallengesSection";

// CrossBorder 區段
import CrossBorderSection, {
  CrossBorderData,
  CrossBorderTune,
} from "@/components/CrossBorderSection";

// Service 區段
import ServiceSection, { ServiceItem } from "@/components/ServiceSection";

// About 區段
import AboutSection from "@/components/AboutSection";
import type { AboutData } from "@/lib/types/about";

// Contact 區段
import ContactSection from "@/components/ContactSection";
import type { ContactData } from "@/lib/types/contact";

// Footer
import FooterServer from "@/components/FooterServer";

import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";
import { heroByLang } from "@/lib/queries/hero";
import { servicesQueryML } from "@/lib/queries/services";
import { crossBorderByLang } from "@/lib/queries/crossBorder";
import { aboutByLang } from "@/lib/queries/about";
import { contactByLang } from "@/lib/queries/contact";
import { mixedHomeFeedByLang } from "@/lib/queries/insights";

import Link from "next/link";
import type { JSX } from "react";

/* ============================ 視覺與版面設定 ============================ */
const NAV_HEIGHT = 72;

/**
 * 手機優化重點：
 * 1) Hero 標題字級用 clamp 在小螢幕下降低
 * 2) Hero 區塊的內容位移全面縮小，避免溢出
 * 3) 語言切換器在手機時右上角更靠內，避免被瀏海或邊角遮擋
 * 4) 全站 main 加上 overflow-x-hidden 防止橫向捲動
 * 5) Section padding 在手機時降低，閱讀更順
 */
const TUNE = {
  // 語言切換器位置：手機時更靠內與略低
  langOffsetYrem: (NAV_HEIGHT + 6) / 16, // 手機略低一點
  langOffsetRightRem: 0.75,              // 手機更靠內
  forceTopVh: true,

  // Hero 內容的整體上移量（以 vh 為單位）
  heroContentOffsetVh: 2.5, // 手機更貼近視窗

  // Hero 左邊內距（rem）：手機縮小
  heroLeftPadRem: { base: 1.0, md: 0.75, lg: 0.75 },

  // Hero 內容最大寬：手機時自然換行，桌機維持視覺寬度
  heroMaxWidth: "72rem",

  // Hero 圖片焦點：稍微上移，讓人物或主體不被遮擋
  heroObjectPos: "28%",
  heroObjectPosY: "30%",

  // 手機以 clamp 限制字級，避免超出
  headingSizes: "text-[clamp(1.75rem,6vw,2.5rem)] sm:text-4xl md:text-6xl lg:text-7xl",
  subTextSize: "text-[clamp(0.95rem,3.8vw,1.05rem)] sm:text-lg md:text-xl",

  textColorClass: "text-white",
  ribbonRounded: "rounded-lg",
  ribbonBg: "bg-black/70",
  ctaTopMarginClass: "mt-4 sm:mt-6 md:mt-8",

  // 針對 Hero 中各元素偏移：手機縮小位移，避免跑版
  blockOffsets: {
    // rem 單位，base 將偏移量大幅縮小
    heading: { xRem: 0.0,  yRem: -3.0 },
    subheading: { xRem: 0.0, yRem: -1.5 },
    subtitle: { xRem: 0.0, yRem: -0.5 },
    cta: { xRem: 0.0, yRem: 0.0 },
  },
} as const;

/** CrossBorder 位置微調（手機位移更保守） */
const CROSS_TUNE: CrossBorderTune = {
  containerAlign: "center",
  offsetYvh: -2,
  blockOffsets: {
    heading: { xRem: 0, yRem: -2.5 },
    lead1: { xRem: 0, yRem: -1.25 },
    lead2: { xRem: 0, yRem: 0 },
    body: { xRem: 0, yRem: 0.75 },
    cta: { xRem: 0, yRem: 1.0 },
  },
};

/** 分隔帶：簡潔白線版 */
function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div
        className="h-[2px] w-full opacity-50"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}

/** 日期格式器（deterministic，不用 Intl 依賴環境） */
const MONTH_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
function formatDateDeterministic(lang: "jp" | "zh" | "en", iso: string) {
  const [yyyy, mm, dd] = iso.split("-");
  const y = yyyy;
  const m = String(Number(mm));
  const d = String(Number(dd));
  if (lang === "en") return `${MONTH_EN[Number(mm) - 1]} ${d}, ${y}`;
  return `${y}年${m}月${d}日`;
}

/* ============================ 型別 ============================ */
type NavItem = { label?: string; href?: string; external?: boolean; order?: number };
type Lang = "jp" | "zh" | "en";

/** 首頁混合列表所需資料結構 */
type HomeNewsItem = {
  dateISO: string;        // "YYYY-MM-DD"
  title: string;
  href: string;           // /news/[slug]?lang=xx 或 /column/[slug]?lang=xx
  channelLabel: string;   // 小分類：News / Column（多語）
  hashtags?: string[];
};

/* 包裝 Server Components，避免使用 @ts-expect-error */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ Page ============================ */
export default async function Home({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  // 讀取 URL 語言
  const spLang = (spRaw?.lang ?? "").toString().toLowerCase();

  // 內容語言：若為 zh-cn 則回退 zh，其餘維持 jp/zh/en
  const contentLang: Lang =
    spLang === "zh-cn"
      ? "zh"
      : spLang === "zh" || spLang === "en" || spLang === "jp"
      ? (spLang as Lang)
      : "jp";

  const [settings, hero, crossBorder, services, about, contact, mixed] = await Promise.all([
    sfetch<any>(siteSettingsByLang, { lang: contentLang }),
    sfetch<any>(heroByLang, { lang: contentLang }),
    sfetch<CrossBorderData>(crossBorderByLang, { lang: contentLang }),
    sfetch<ServiceItem[]>(servicesQueryML, { lang: contentLang }),
    sfetch<AboutData>(aboutByLang, { lang: contentLang }),
    sfetch<ContactData>(contactByLang, { lang: contentLang }),
    // 混合 News + Column，最新 6 筆
    sfetch<any>(mixedHomeFeedByLang, { lang: contentLang, limit: 5 }),
  ]);

  // 導覽列資料供 Footer 使用
  const rawItems: NavItem[] = Array.isArray(settings?.navigation) ? settings.navigation : [];
  const items: NavItem[] = rawItems
    .map((it) => {
      if (!it?.href) return it;
      const join = it.href.includes("?") ? "&" : "?";
      return { ...it, href: `${it.href}${join}lang=${contentLang}` };
    })
    .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  // Footer
  type LooseContact = { email?: string | null; phone?: string | null };
  const c = (contact as unknown as LooseContact | null);

  const footerCompany = {
    name: settings?.logoText ?? settings?.title ?? "Taiwan Connect",
    logoUrl: settings?.logoUrl ?? null,
  };

  const footerContact = {
    email: c?.email ?? settings?.contactEmail ?? null,
    phone: c?.phone ?? settings?.contactPhone ?? null,
  };

  const primaryLinks =
    items?.map((i) => ({ label: i.label, href: i.href, external: i.external })) ?? [];

  const secondaryLinks = [
    { label: contentLang === "jp" ? "サービス" : contentLang === "zh" ? "服務內容" : "Services", href: "/services" },
    { label: contentLang === "jp" ? "事例紹介" : contentLang === "zh" ? "成功案例" : "Case Studies", href: "/cases" },
    { label: "News", href: "/news" },
    {
      label: contentLang === "jp" ? "IPOアドバイザリー" : contentLang === "zh" ? "IPO 顧問" : "IPO Advisory",
      href: "/ipo",
    },
  ];

  // 混合資料 => 首頁所需
  const posts = Array.isArray(mixed?.posts) ? mixed.posts : [];
  const channelLabel = (channel: "news" | "column"): string => {
    if (contentLang === "jp") return channel === "news" ? "ニュース" : "コラム";
    if (contentLang === "zh") return channel === "news" ? "新聞" : "專欄";
    return channel === "news" ? "News" : "Column";
  };
  const homeNewsItems: HomeNewsItem[] = posts.map((p: any) => {
    const published = typeof p?.publishedAt === "string" ? p.publishedAt : "";
    const dateISO = published ? published.slice(0, 10) : "1970-01-01";
    const slug = p?.slug ?? "";
    const base = p?.channel === "column" ? "/column" : "/news";
    const href = `${base}/${slug}?lang=${contentLang}`;
    const hashtags =
      Array.isArray(p?.tags) && p.tags.length > 0
        ? p.tags.map((t: any) => t?.title).filter(Boolean)
        : [];
    return {
      dateISO,
      title: p?.title ?? "",
      href,
      channelLabel: channelLabel(p?.channel),
      hashtags,
    };
  });

  return (
    <main
      id="top"
      className="bg-background text-foreground overflow-x-hidden" // 手機防橫向捲動
    >
      {/* 導覽列：僅導覽列支援 zh-cn 其餘內容用 contentLang */}
      <Nav lang={spRaw?.lang as string} />

      {/* 語言切換器：手機更靠內與略低，避免瀏海遮擋 */}
      <LanguageSwitcher
        current={contentLang}
        offsetY={TUNE.langOffsetYrem}
        offsetRight={TUNE.langOffsetRightRem}
      />

      {/* Hero：字級與位移已針對手機優化 */}
      <HeroBanner data={hero} navHeight={NAV_HEIGHT} tune={TUNE} />

      {/* 五大痛點：手機內距更緊湊 */}
      <div className="px-3 sm:px-4">
        {await ChallengesSection({ lang: contentLang })}
      </div>

      {/* 服務：手機時區塊上下距縮小 */}
      <div className="px-3 sm:px-4">
        <ServiceSection items={services || []} />
      </div>

      {/* CrossBorder：採用更保守的位移，避免手機溢出 */}
      <div className="px-3 sm:px-4">
        <CrossBorderSection data={crossBorder ?? null} tune={CROSS_TUNE} />
      </div>

      <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />

      {/* About 區塊：手機縮小 padding 與字距 */}
      <div className="px-3 sm:px-4">
        <AboutSection data={about ?? null} />
      </div>

      <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />

      {/* 混合 News + Column 區塊：手機字級與間距優化 */}
      <div className="px-2 sm:px-4">
        <NewsSection lang={contentLang} items={homeNewsItems} />
      </div>

      <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />

      {/* Contact：手機縮小外邊距，避免過度留白 */}
      <div className="px-3 sm:px-4">
        <ContactSection data={contact ?? null} lang={contentLang} />
      </div>

      <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />

      {/* Footer */}
      <Footer
        lang={(spRaw?.lang?.toLowerCase() as "jp" | "zh" | "en" | "zh-cn") || contentLang}
        company={footerCompany}
        contact={footerContact}
        primaryLinks={primaryLinks}
        secondaryLinks={secondaryLinks}
      />
    </main>
  );
}

/** 混合 News & Column 的首頁列表（手機優化字級與間距） */
function NewsSection({ lang, items }: { lang: Lang; items: HomeNewsItem[] }) {
  // 標題多語直接寫在程式
  const t = {
    jp: { title: "ニュースとコラム", sub: "最新のニュースと実務コラムをまとめてお届けします。", cta: "すべて見る" },
    zh: { title: "新聞與專欄", sub: "最新新聞與深度專欄一次掌握。", cta: "查看全部" },
    en: { title: "News & Column", sub: "Latest updates and columns in one place.", cta: "See all" },
  }[lang];

  return (
    <section className="text-white" style={{ backgroundColor: "#1C3D5A" }}>
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-10 sm:py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 items-start">
          {/* 左側標題與按鈕 */}
          <div className="md:col-span-1">
            <h2
              className="text-[clamp(1.35rem,5.2vw,1.75rem)] sm:text-3xl md:text-4xl font-bold tracking-wide text-white drop-shadow-sm leading-snug"
              style={{ wordBreak: "keep-all" }}
            >
              {lang === "en" ? "News &\u00A0Column" : t.title}
            </h2>

            <p className="mt-3 sm:mt-4 text-[clamp(0.95rem,3.6vw,1.05rem)] sm:text-lg text-blue-100">
              {t.sub}
            </p>

            <div className="mt-6 sm:mt-8">
              <Link
                href={`/news?lang=${lang}`}
                className="inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm md:text-base font-semibold shadow-md text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 transition-colors"
              >
                {t.cta}
              </Link>
            </div>
          </div>

          {/* 右側混合列表 */}
          <div className="md:col-span-2">
            <ul className="divide-y divide-white/20">
              {items.map((a, i) => (
                <li key={i} className="py-4 sm:py-5 md:py-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <time className="text-xs sm:text-sm text-blue-200" suppressHydrationWarning>
                      {formatDateDeterministic(lang, a.dateISO)}
                    </time>

                    {/* 小分類：News / Column（多語） */}
                    <span className="inline-flex items-center rounded-full border border-blue-200/40 bg-blue-900/30 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-blue-100">
                      {a.channelLabel}
                    </span>

                    {/* Hashtags */}
                    {a.hashtags && a.hashtags.length > 0 && (
                      <div className="w-full md:w-auto md:ml-auto text-[11px] sm:text-xs text-blue-200">
                        {a.hashtags.map((h, idx) => (
                          <span key={idx} className="mr-2">
                            #{h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2 sm:mt-3 text-[15px] sm:text-[15.5px] md:text-base leading-relaxed">
                    <Link href={a.href} className="text-white hover:text-blue-200 hover:underline">
                      {a.title}
                    </Link>
                  </h3>
                </li>
              ))}

              {/* 若沒有資料 */}
              {items.length === 0 && (
                <li className="py-6">
                  <h3 className="mt-3 text-[15px] md:text-base leading-relaxed text-blue-100">
                    {lang === "jp"
                      ? "記事は準備中です。まもなく公開します。"
                      : lang === "zh"
                      ? "內容準備中，敬請期待。"
                      : "No posts yet. Coming soon."}
                  </h3>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
