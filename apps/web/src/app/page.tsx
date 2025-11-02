// apps/web/src/app/page.tsx
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
import { newsEntranceByLang } from "@/lib/queries/news";

import Link from "next/link";
import type { JSX } from "react";

type NavItem = { label?: string; href?: string; external?: boolean; order?: number };
type Lang = "jp" | "zh" | "en";

/** Hero 參數 */
const NAV_HEIGHT = 72;
const TUNE = {
  langOffsetYrem: (NAV_HEIGHT + 8) / 16,
  langOffsetRightRem: 1.25,
  forceTopVh: true,
  heroContentOffsetVh: 4.0,
  heroLeftPadRem: { base: 12.5, md: 0.75, lg: 0.75 },
  heroMaxWidth: "72rem",
  heroObjectPos: "28%",
  heroObjectPosY: "30%",
  headingSizes: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  subTextSize: "text-base sm:text-lg md:text-xl",
  textColorClass: "text-white",
  ribbonRounded: "rounded-lg",
  ribbonBg: "bg-black/70",
  ctaTopMarginClass: "",
  blockOffsets: {
    heading: { xRem: 0.0, yRem: -12.25 },
    subheading: { xRem: 5.0, yRem: -9.0 },
    subtitle: { xRem: 8.5, yRem: -6.25 },
    cta: { xRem: 20.0, yRem: -3.5 },
  },
} as const;

/** CrossBorder 位置微調 */
const CROSS_TUNE: CrossBorderTune = {
  containerAlign: "center",
  offsetYvh: -4,
  blockOffsets: {
    heading: { xRem: -20, yRem: -5.5 },
    lead1: { xRem: -22.5, yRem: -3 },
    lead2: { xRem: -22.5, yRem: -1 },
    body: { xRem: 0, yRem: 1.25 },
    cta: { xRem: -23, yRem: 1.0 },
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

/** 日期格式器 */
const MONTH_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function formatDateDeterministic(lang: "jp" | "zh" | "en", iso: string) {
  const [yyyy, mm, dd] = iso.split("-");
  const y = yyyy;
  const m = String(Number(mm));
  const d = String(Number(dd));
  if (lang === "en") return `${MONTH_EN[Number(mm) - 1]} ${d}, ${y}`;
  return `${y}年${m}月${d}日`;
}

/** 首頁 News Section 需要的最小資料結構（由 Sanity 映射而來） */
type HomeNewsItem = {
  dateISO: string; // "YYYY-MM-DD"
  title: string;
  href: string; // 站內連結 /news/[slug]?lang=xx
  badge?: string | null; // 類別名稱
  hashtags?: string[]; // tags 名稱陣列
};

/* 包裝 Server Components，避免使用 @ts-expect-error */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

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

  const [settings, hero, crossBorder, services, about, contact, news] = await Promise.all([
    sfetch<any>(siteSettingsByLang, { lang: contentLang }),
    sfetch<any>(heroByLang, { lang: contentLang }),
    sfetch<CrossBorderData>(crossBorderByLang, { lang: contentLang }),
    sfetch<ServiceItem[]>(servicesQueryML, { lang: contentLang }),
    sfetch<AboutData>(aboutByLang, { lang: contentLang }),
    sfetch<ContactData>(contactByLang, { lang: contentLang }),
    sfetch<any>(newsEntranceByLang, { lang: contentLang, limit: 4 }),
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

  // Sanity -> 首頁 NewsSection 所需資料
  const newsPosts = Array.isArray(news?.posts) ? news.posts : [];
  const homeNewsItems: HomeNewsItem[] = newsPosts.slice(0, 4).map((p: any) => {
    const published = typeof p?.publishedAt === "string" ? p.publishedAt : "";
    const dateISO = published ? published.slice(0, 10) : "1970-01-01";
    const slug = p?.slug ?? "";
    const href = `/news/${slug}?lang=${contentLang}`;
    const badge = p?.category?.title ?? null;
    const hashtags =
      Array.isArray(p?.tags) && p.tags.length > 0
        ? p.tags.map((t: any) => t?.title).filter(Boolean)
        : [];
    return {
      dateISO,
      title: p?.title ?? "",
      href,
      badge,
      hashtags,
    };
  });

  return (
    <main id="top" className="bg-background text-foreground">
      {/* 導覽列：僅導覽列支援 zh-cn 其餘內容用 contentLang */}
      <Nav lang={spRaw?.lang as string} />

      {/* 語言切換器：直接改 URL 參數 停留在當前頁面 */}
      <LanguageSwitcher
        current={contentLang}
        offsetY={TUNE.langOffsetYrem}
        offsetRight={TUNE.langOffsetRightRem}
      />

      {/* Hero */}
      <HeroBanner data={hero} navHeight={NAV_HEIGHT} tune={TUNE} />

      {/* 五大痛點 */}
      {await ChallengesSection({ lang: contentLang })}

      {/* 服務 */}
      <ServiceSection items={services || []} />

      {/* CrossBorder */}
      <CrossBorderSection data={crossBorder ?? null} tune={CROSS_TUNE} />

      {/* 分隔線 */}
      <SectionDivider className="-mt-2 md:-mt-4" />

      {/* News */}
      <NewsSection lang={contentLang} items={homeNewsItems} />

      <SectionDivider className="-mt-2 md:-mt-4" />

      {/* Contact */}
      <ContactSection data={contact ?? null} lang={contentLang} />

      <SectionDivider className="-mt-2 md:-mt-4" />

      {/* Footer */}
      <Footer
        lang={(spRaw?.lang?.toLowerCase() as "jp" | "zh" | "en" | "zh-cn") || contentLang}
      />
    </main>
  );
}

/** News Section 藍色主題：視覺維持不變 改成吃 props.items */
function NewsSection({ lang, items }: { lang: Lang; items: HomeNewsItem[] }) {
  const t = {
    jp: { title: "NEWS", sub: "当社のプレスリリースなど", cta: "一覧はこちら" },
    zh: { title: "NEWS", sub: "公司新聞與公告", cta: "查看更多" },
    en: { title: "NEWS", sub: "Press releases and updates", cta: "See all" },
  }[lang];

  return (
    <section className="text-white" style={{ backgroundColor: "#1C3D5A" }}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* 左側標題與按鈕 */}
          <div className="md:col-span-1">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-sm">
              {t.title}
            </h2>
            <p className="mt-4 text-lg text-blue-100">{t.sub}</p>

            <div className="mt-8">
              <Link
                href={`/news?lang=${lang}`}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm md:text-base font-semibold shadow-md text-white bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 transition-colors"
              >
                {t.cta}
              </Link>
            </div>
          </div>

          {/* 右側文章列表 */}
          <div className="md:col-span-2">
            <ul className="divide-y divide-white/20">
              {items.map((a, i) => (
                <li key={i} className="py-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <time className="text-sm text-blue-200" suppressHydrationWarning>
                      {formatDateDeterministic(lang, a.dateISO)}
                    </time>

                    <div className="flex flex-wrap items-center gap-2">
                      {a.badge ? (
                        <span className="inline-flex items-center rounded-full border border-blue-200/40 bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-100">
                          {a.badge}
                        </span>
                      ) : null}
                    </div>

                    {a.hashtags && a.hashtags.length > 0 && (
                      <div className="w-full md:w-auto md:ml-auto text-xs text-blue-200">
                        {a.hashtags.map((h, idx) => (
                          <span key={idx} className="mr-2">
                            #{h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-3 text-[15px] md:text-base leading-relaxed">
                    <Link href={a.href} className="text-white hover:text-blue-200 hover:underline">
                      {a.title}
                    </Link>
                  </h3>
                </li>
              ))}

              {/* 若沒有資料 仍維持版位不動視覺 */}
              {items.length === 0 && (
                <li className="py-6">
                  <h3 className="mt-3 text-[15px] md:text-base leading-relaxed text-blue-100">
                    {lang === "jp"
                      ? "記事は準備中です。まもなく公開します。"
                      : lang === "zh"
                      ? "內容準備中，敬請期待。"
                      : "No news yet. Coming soon."}
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
