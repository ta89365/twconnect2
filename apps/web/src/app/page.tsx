// apps/web/src/app/page.tsx
import HeroBanner from "@/components/hero-banner";
import type { Tune } from "@/components/hero-banner";
import LanguageSwitcher from "@/components/language-switcher";
import ChallengesSection from "@/components/ChallengesSection";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";

import CrossBorderSection, { CrossBorderData, CrossBorderTune } from "@/components/CrossBorderSection";
import ServiceSection, { ServiceItem } from "@/components/ServiceSection";
import AboutSection from "@/components/AboutSection";
import type { AboutData } from "@/lib/types/about";
import ContactSection from "@/components/ContactSection";
import type { ContactData } from "@/lib/types/contact";

import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";
import { heroByLang } from "@/lib/queries/hero";
import { servicesQueryML } from "@/lib/queries/services";
import { crossBorderByLang } from "@/lib/queries/crossBorder";
import { aboutByLang } from "@/lib/queries/about";
import { contactByLang } from "@/lib/queries/contact";
import { homePostsQuery } from "@/lib/queries/homePosts";
import Link from "next/link";

export const dynamic = "force-dynamic";

/* ========= 常數 ========= */
const NAV_HEIGHT = 72; // px

const TUNE = {
  langOffsetYrem: 0.3,
  langOffsetRightRem: 0.75,
  forceTopVh: true,
  heroContentOffsetVh: 2.5,
  heroLeftPadRem: { base: 1.0, md: 0.75, lg: 0.75 },
  heroMaxWidth: 72,
  heroObjectPos: 28,
  heroObjectPosY: 30,
  headingSizes: "text-[clamp(1.75rem,6vw,2.5rem)] sm:text-4xl md:text-6xl lg:text-7xl",
  subTextSize: "text-[clamp(0.95rem,3.8vw,1.05rem)] sm:text-lg md:text-xl",
  textColorClass: "text-white",
  ribbonRounded: "rounded-lg",
  ribbonBg: "bg-black/70",
  ctaTopMarginClass: "mt-4 sm:mt-6 md:mt-8",
  blockOffsets: {
    heading: { xRem: 0.0, yRem: -3.0 },
    subheading: { xRem: 0.0, yRem: -1.5 },
    subtitle: { xRem: 0.0, yRem: -0.5 },
    cta: { xRem: 0.0, yRem: 0.0 },
  },
} satisfies Tune;

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

const MONTH_EN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
function formatDateDeterministic(lang: "jp" | "zh" | "en", iso: string) {
  const [yyyy, mm, dd] = iso.split("-");
  const y = yyyy, m = String(Number(mm)), d = String(Number(dd));
  if (lang === "en") return `${MONTH_EN[Number(mm) - 1]} ${d}, ${y}`;
  return `${y}年${m}月${d}日`;
}

type NavItem = { label?: string; href?: string; external?: boolean; order?: number };
type Lang = "jp" | "zh" | "en";
function addLangQuery(href?: string, lang?: Lang): string {
  if (!href || !lang) return href || "";
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

export default async function Home({ searchParams }: { searchParams?: { lang?: string } | Promise<{ lang?: string }> }) {
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  const spLang = (spRaw?.lang ?? "").toString().toLowerCase();
  const contentLang: Lang =
    spLang === "zh-cn" ? "zh" :
    spLang === "zh" || spLang === "en" || spLang === "jp" ? (spLang as Lang) : "jp";

  const [
    settings, hero, crossBorder, services, about, contact, homePosts
  ] = await Promise.all([
    sfetch<any>(siteSettingsByLang, { lang: contentLang }),
    sfetch<any>(heroByLang, { lang: contentLang }),
    sfetch<CrossBorderData>(crossBorderByLang, { lang: contentLang }),
    sfetch<ServiceItem[]>(servicesQueryML, { lang: contentLang }),
    sfetch<AboutData>(aboutByLang, { lang: contentLang }),
    sfetch<ContactData>(contactByLang, { lang: contentLang }),
    sfetch<any[]>(homePostsQuery, { lang: contentLang }),
  ]);

  const rawItems: NavItem[] = Array.isArray(settings?.navigation) ? settings.navigation : [];
  const items: NavItem[] = rawItems
    .map((it) => (it?.href ? { ...it, href: addLangQuery(it.href, contentLang) } : it))
    .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  type LooseContact = { email?: string | null; phone?: string | null };
  const c = (contact as unknown as LooseContact | null);

  const footerCompany = {
    name: settings?.logoText ?? settings?.title ?? "Taiwan Connect",
    logoUrl: settings?.logoUrl ?? null,
  };
  const footerContact = { email: c?.email ?? settings?.contactEmail ?? null, phone: c?.phone ?? settings?.contactPhone ?? null };

  const primaryLinks =
    items?.map((i) => ({ label: i.label, href: i.href, external: i.external })) ?? [];

  const secondaryLinks = [
    { label: contentLang === "jp" ? "サービス" : contentLang === "zh" ? "服務內容" : "Services", href: addLangQuery("/services", contentLang) },
    { label: contentLang === "jp" ? "事例紹介" : contentLang === "zh" ? "成功案例" : "Case Studies", href: addLangQuery("/cases", contentLang) },
    { label: "News", href: addLangQuery("/news", contentLang) },
    { label: contentLang === "jp" ? "IPOアドバイザリー" : contentLang === "zh" ? "IPO 顧問" : "IPO Advisory", href: addLangQuery("/ipo", contentLang) },
  ];

  const channelLabel = (channel: "news" | "column"): string => {
    if (contentLang === "jp") return channel === "news" ? "ニュース" : "コラム";
    if (contentLang === "zh") return channel === "news" ? "新聞" : "專欄";
    return channel === "news" ? "News" : "Column";
  };

  const posts = Array.isArray(homePosts) ? homePosts : [];
  const homeNewsItems = posts.map((p: any) => {
    const dateISO = typeof p?.publishedAt === "string" ? p.publishedAt.slice(0, 10) : "1970-01-01";
    const base = p?.channel === "column" ? "/column" : "/news";
    return {
      dateISO,
      title: p?.title ?? "",
      href: addLangQuery(`${base}/${p?.slug ?? ""}`, contentLang),
      channelLabel: channelLabel(p?.channel ?? "news"),
      hashtags: [],
    };
  });

  return (
    <main id="top" className="bg-background text-foreground overflow-x-hidden">
      {await (NavigationServer as any)({ lang: spRaw?.lang as string })}

      {/* 語言切換：維持先前桌機定位（static + relative 容器），手機預設顯示，開啟行動選單時自動隱藏 */}
      <div className="relative" style={{ height: 0 }}>
        <LanguageSwitcher
          current={contentLang}
          behavior="static"
          offsetY={TUNE.langOffsetYrem}
          offsetRight={TUNE.langOffsetRightRem}
        />
      </div>

      <section className="relative">
        <HeroBanner data={hero} navHeight={NAV_HEIGHT} tune={TUNE} lang={contentLang} />
      </section>

      <div>{await ChallengesSection({ lang: contentLang })}</div>
      <div><ServiceSection items={services || []} lang={contentLang} /></div>
      <div><CrossBorderSection data={crossBorder ?? null} tune={CROSS_TUNE} lang={contentLang} /></div>

      <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />

      {/* About 區塊暫時停用，但保留程式碼與 import */}
      {false && (
        <div>
          <AboutSection data={about ?? null} lang={contentLang} />
          <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />
        </div>
      )}

      {/* News 區塊 */}
      <div><NewsSection lang={contentLang} items={homeNewsItems ?? []} /></div>

      <div className="relative py-2" style={{ backgroundColor: "#1C3D5A" }}>
        <SectionDivider className="m-0" />
      </div>

      <div id="contact" data-contact-anchor="true" className="scroll-mt-[84px]">
        {await (ContactSection as any)({ data: contact ?? null, lang: contentLang })}
      </div>

      <SectionDivider className="mt-2 sm:-mt-2 md:-mt-4" />
      {await (FooterServer as any)({
        lang: (spRaw?.lang?.toLowerCase() as "jp" | "zh" | "en" | "zh-cn") || contentLang,
        company: { name: settings?.logoText ?? settings?.title ?? "Taiwan Connect", logoUrl: settings?.logoUrl ?? null },
        contact: footerContact,
        primaryLinks,
        secondaryLinks,
      })}
    </main>
  );
}

/** News 區塊 */
function NewsSection({
  lang,
  items,
}: {
  lang: "jp" | "zh" | "en";
  items: { dateISO: string; title: string; href: string; channelLabel: string; hashtags?: string[] }[];
}) {
  const t = {
    jp: { title: "ニュースとコラム", sub: "最新のニュースと実務コラムをまとめてお届けします。", cta: "すべて見る" },
    zh: { title: "新聞與專欄", sub: "最新新聞與深度專欄一次掌握。", cta: "更多內容" },
    en: { title: "News & Column", sub: "Latest updates and columns in one place.", cta: "See all" },
  }[lang];

  return (
    <section
      id="home-news"
      className="text-white relative z-[1] min-h-[120px]"
      style={{ backgroundColor: "#1C3D5A" }}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-10 sm:py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 items-start">
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
                href={addLangQuery("/news", lang)}
                className="inline-flex items-center justify-center rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm md:text-base font-semibold shadow-md text-white bg-[#1f2454] hover:bg-[#2b3068] transition-colors"
              >
                {t.cta}
              </Link>
            </div>
          </div>
          <div className="md:col-span-2">
            <ul className="divide-y divide-white/20">
              {items.map((a, i) => (
                <li key={i} className="py-4 sm:py-5 md:py-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <time className="text-xs sm:text-sm text-blue-200" suppressHydrationWarning>
                      {formatDateDeterministic(lang, a.dateISO)}
                    </time>
                    <span className="inline-flex items-center rounded-full border border-blue-200/40 bg-blue-900/30 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-blue-100">
                      {a.channelLabel}
                    </span>
                  </div>
                  <h3 className="mt-2 sm:mt-3 text-[15px] sm:text-[15.5px] md:text-base leading-relaxed">
                    <Link href={a.href} className="text-white hover:text-blue-200 hover:underline">
                      {a.title}
                    </Link>
                  </h3>
                </li>
              ))}
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
