// File: apps/web/src/app/cn-investment/page.tsx

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentLandingQuery } from "@/lib/queries/cnInvestmentLanding";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { Noto_Sans_SC } from "next/font/google";
import type { JSX } from "react";

/* ============================ i18n ============================ */
type Lang = "zh" | "zh-cn" | "jp" | "en";
const PAGE_LANG: Lang = "zh-cn"; // ✅ 本頁固定顯示簡中

/* ============================ Fonts ============================ */
const notoSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "Microsoft YaHei",
    "PingFang SC",
    "Hiragino Sans GB",
    "Heiti SC",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

/* ============================ Static Settings ============================ */
export const revalidate = 60;
export const dynamic = "force-dynamic";

/* ============================ Style Tokens ============================ */
const BRAND_BLUE = "#1C3D5A";
const TUNE = {
  contentMaxW: "1200px",
  heroMinH: "56vh",
  heroOverlay:
    "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0.30) 100%)",
} as const;

/* ============================ Types ============================ */
type Block = any;

interface LandingDoc {
  _id: string;
  slug?: string;
  titleZh?: string;
  taglineEn?: string;
  heroImage?: {
    assetId?: string;
    url?: string;
    alt?: string;
    lqip?: string;
    hotspot?: any;
    crop?: any;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
  whyZh?: Block[];
  principleZh?: string;
  regulationDefinitionZh?: Block[];
  authorities?: { nameZh?: string; nameEn?: string; url?: string }[];
  reviewFocus?: { order?: number; titleZh?: string; bodyZh?: string }[];
  doubtsZh?: Block[];
  contactFormHref?: string | null;
  processSteps?: { order?: number; titleZh?: string; bodyZh?: Block[] }[];
  timelineZh?: string;
  advantagesIntroZh?: Block[];
  serviceBulletsZh?: { textZh?: string }[];
  teamImage?: { url?: string; alt?: string; lqip?: string };
  faq?: { qZh?: string; aZh?: Block[] }[];
  recommended?: {
    titleZh?: string;
    summaryZh?: string;
    ctaLabelZh?: string;
    internal?: { _id?: string; _type?: string; slug?: string; channel?: string } | null;
    external?: string | null;
    href?: string | null;
    cover?: { url?: string; alt?: string; lqip?: string } | null;
  }[];
  contactEmail?: string;
  contactLine?: string;
  bookingHref?: string;
}
type Topic = NonNullable<LandingDoc["recommended"]>[number];

/* ============================ PortableText Components ============================ */
const ptComponents: PortableTextComponents = {
  block: ({ children, value }) => {
    const style = (value as any)?.style || "normal";
    switch (style) {
      case "h2":
        return <h2 className="text-2xl md:text-3xl font-semibold mb-3">{children}</h2>;
      case "h3":
        return <h3 className="text-xl md:text-2xl font-semibold mb-2">{children}</h3>;
      case "blockquote":
        return (
          <blockquote className="border-l-4 border-white/30 pl-4 italic opacity-90">
            {children}
          </blockquote>
        );
      default:
        return <p className="leading-relaxed">{children}</p>;
    }
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value as any)?.href || "#";
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:opacity-90"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

/* ============================ Utils ============================ */
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const LANG_Q = `lang=${PAGE_LANG}`;
function withLang(href: string) {
  if (!href) return "#";
  if (/^https?:\/\//i.test(href)) return href; // 外部連結不加
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}${LANG_Q}`;
}

function safeHref(item: Topic) {
  if (item?.href) return withLang(item.href);
  if (item?.internal?.slug) {
    const ch = item.internal.channel ?? "news";
    return withLang(`/${ch}/${item.internal.slug}`);
  }
  return item?.external ?? "#";
}

/* ===== 包裝 Server Components，避免使用 @ts-expect-error ===== */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ Fallback Topics ============================ */
const FALLBACK_TOPICS: Topic[] = [
  {
    titleZh: "陆资来台投资全流程解析",
    summaryZh: "从核准到设立，一次掌握投审会申报、资金汇入、公司登记与税务登记。",
    ctaLabelZh: "阅读文章 →",
    internal: null,
    external: "/news/cn-investment-full-guide",
    href: "/news/cn-investment-full-guide",
    cover: null,
  },
  {
    titleZh: "陆资投资开放与限制行业清单",
    summaryZh: "快速了解正面表列、限制与禁止领域，判断营业项目合规性。",
    ctaLabelZh: "阅读文章 →",
    internal: null,
    external: "/news/cn-positive-list",
    href: "/news/cn-positive-list",
    cover: null,
  },
  {
    titleZh: "是否属于陆资？UBO 实质受益人判定",
    summaryZh: "用股权与控制权结构判断陆资认定，避免误判造成延误。",
    ctaLabelZh: "阅读文章 →",
    internal: null,
    external: "/news/cn-ubo-checklist",
    href: "/news/cn-ubo-checklist",
    cover: null,
  },
  {
    titleZh: "申请文件清单与常见退件原因",
    summaryZh: "准备清单、格式与常见错误，降低被退件风险。",
    ctaLabelZh: "阅读文章 →",
    internal: null,
    external: "/news/cn-application-pitfalls",
    href: "/news/cn-application-pitfalls",
    cover: null,
  },
];

/* ============================ Page ============================ */
export default async function Page(): Promise<JSX.Element> {
  const doc = (await sfetch(cnInvestmentLandingQuery)) as LandingDoc | null;
  const topics = (doc?.recommended ?? []).slice(0, 4);
  const finalTopics = topics.length >= 4 ? topics : FALLBACK_TOPICS;

  return (
    <div
      style={{ backgroundColor: BRAND_BLUE }}
      className={`${notoSC.className} min-h-screen text-white`}
    >
      {/* Nav：固定簡中 */}
      <Nav lang={PAGE_LANG} />

      {/* Hero */}
      <section className="relative w-full" style={{ minHeight: TUNE.heroMinH }}>
        {doc?.heroImage?.url && (
          <Image
            src={doc.heroImage.url}
            alt={doc.heroImage.alt || "Hero"}
            placeholder={doc.heroImage.lqip ? "blur" : "empty"}
            blurDataURL={doc.heroImage.lqip || undefined}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0" style={{ background: TUNE.heroOverlay }} />
        <div className="relative mx-auto px-6 py-16" style={{ maxWidth: TUNE.contentMaxW }}>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            {doc?.titleZh || "陆资企业进入台湾市场专区"}
          </h1>
          {!!doc?.taglineEn && (
            <p className="mt-4 text-base md:text-lg opacity-90">{doc.taglineEn}</p>
          )}
        </div>
      </section>

      {/* Why + Principle */}
      {(doc?.whyZh?.length || doc?.principleZh) && (
        <section className="mx-auto px-6 py-10 md:py-14" style={{ maxWidth: TUNE.contentMaxW }}>
          {!!doc?.whyZh?.length && (
            <div className="prose prose-invert max-w-none">
              <PortableText value={doc.whyZh} components={ptComponents} />
            </div>
          )}
          {!!doc?.principleZh && <p className="mt-6 text-lg font-medium">{doc.principleZh}</p>}
        </section>
      )}

      {/* Definition + Authorities */}
      {(doc?.regulationDefinitionZh?.length || doc?.authorities?.length) && (
        <section
          className="mx-auto px-6 py-10 md:py-14 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          {!!doc?.regulationDefinitionZh?.length && (
            <div className="prose prose-invert max-w-none">
              <h2>陆资的定义与法规依据</h2>
              <PortableText value={doc.regulationDefinitionZh} components={ptComponents} />
            </div>
          )}

          {!!doc?.authorities?.length && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">主管机关</h3>
              <ul className="space-y-2">
                {doc.authorities.map((a, i) => (
                  <li key={i} className="opacity-90">
                    {a.url ? (
                      <Link
                        href={a.url}
                        className="underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-white/60 rounded"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {a.nameZh || a.nameEn}
                      </Link>
                    ) : (
                      <span>{a.nameZh || a.nameEn}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Review Focus */}
      {!!doc?.reviewFocus?.length && (
        <section
          className="mx-auto px-6 py-10 md:py-14 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <h2 className="text-2xl font-semibold mb-4">主要审查重点</h2>
          <ol className="grid md:grid-cols-2 gap-4">
            {[...doc.reviewFocus]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((x, idx) => (
                <li key={idx} className="rounded-2xl bg-white/5 p-4">
                  <p className="font-semibold mb-1">{x.titleZh}</p>
                  {!!x.bodyZh && <p className="opacity-90 whitespace-pre-line">{x.bodyZh}</p>}
                </li>
              ))}
          </ol>
        </section>
      )}

      {/* Doubts + CTA */}
      {(doc?.doubtsZh?.length || doc?.contactFormHref) && (
        <section
          className="mx-auto px-6 py-10 md:py-14 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          {!!doc?.doubtsZh?.length && (
            <div className="prose prose-invert max-w-none">
              <h2>你是否也有以下疑问？</h2>
              <PortableText value={doc.doubtsZh} components={ptComponents} />
            </div>
          )}
          {!!doc?.contactFormHref && (
            <div className="mt-6">
              <Link
                href={withLang(doc.contactFormHref)}
                className="inline-block rounded-full bg-white text-black px-5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                前往表单
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Process Steps + Timeline */}
      {!!doc?.processSteps?.length && (
        <section
          className="mx-auto px-6 py-10 md:py-14 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <h2 className="text-2xl font-semibold mb-5">陆资投资与公司设立流程</h2>
          <ol className="space-y-4">
            {[...doc.processSteps]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((s, i) => (
                <li key={i} className="rounded-2xl bg-white/5 p-5">
                  <p className="font-semibold mb-2">{s.titleZh}</p>
                  {!!s.bodyZh && (
                    <div className="prose prose-invert max-w-none text-sm">
                      <PortableText value={s.bodyZh} components={ptComponents} />
                    </div>
                  )}
                </li>
              ))}
          </ol>
          {!!doc?.timelineZh && (
            <p className="mt-4 text-sm opacity-90">📆 预计时程：{doc.timelineZh}</p>
          )}
        </section>
      )}

      {/* Advantages + Services + Team */}
      {(doc?.advantagesIntroZh?.length ||
        doc?.serviceBulletsZh?.length ||
        doc?.teamImage?.url) && (
        <section
          className="mx-auto px-6 py-10 md:py-14 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          {!!doc?.advantagesIntroZh?.length && (
            <div className="prose prose-invert max-w-none">
              <h2>我们的优势</h2>
              <PortableText value={doc.advantagesIntroZh} components={ptComponents} />
            </div>
          )}

          {!!doc?.serviceBulletsZh?.length && (
            <ul className="mt-6 grid md:grid-cols-2 gap-3">
              {doc.serviceBulletsZh.map((b, i) => (
                <li key={i} className="rounded-xl bg-white/5 p-3">
                  {b.textZh}
                </li>
              ))}
            </ul>
          )}

          {!!doc?.teamImage?.url && (
            <div className="mt-8">
              <Image
                src={doc.teamImage.url}
                alt={doc.teamImage.alt || "Team"}
                width={1280}
                height={720}
                className="w-full h-auto rounded-2xl object-cover"
                placeholder={doc.teamImage.lqip ? "blur" : "empty"}
                blurDataURL={doc.teamImage.lqip || undefined}
              />
            </div>
          )}
        </section>
      )}

      {/* FAQ */}
      {!!doc?.faq?.length && (
        <section
          className="mx-auto px-6 py-10 md:py-14 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <h2 className="text-2xl font-semibold mb-4">常见问题（Q&A）</h2>
          <div className="space-y-3">
            {doc.faq.map((f, i) => (
              <details key={i} className="rounded-2xl bg-white/5 p-4">
                <summary className="cursor-pointer font-semibold">{f.qZh}</summary>
                {!!f.aZh && (
                  <div className="prose prose-invert max-w-none mt-2 text-sm">
                    <PortableText value={f.aZh} components={ptComponents} />
                  </div>
                )}
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Four Topic Links */}
      <section
        className="mx-auto px-6 py-12 md:py-16 border-t border-white/10"
        style={{ maxWidth: TUNE.contentMaxW }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">推荐阅读｜Recommended Articles</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {finalTopics.map((t, i) => (
            <Link
              key={i}
              href={safeHref(t)}
              className={cx(
                "group rounded-2xl bg-white/5 hover:bg-white/10 transition-colors p-4 flex flex-col focus:outline-none focus:ring-2 focus:ring-white/60"
              )}
            >
              {!!t.cover?.url && (
                <div className="relative w-full aspect-[16/9] mb-3 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.cover.url}
                    alt={t.cover.alt || t.titleZh || "cover"}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                  />
                </div>
              )}
              <h3 className="text-base font-semibold mb-1 leading-snug">{t.titleZh}</h3>
              {!!t.summaryZh && <p className="text-sm opacity-90 line-clamp-3">{t.summaryZh}</p>}
              <span className="mt-auto pt-3 text-sm font-semibold underline underline-offset-4">
                {t.ctaLabelZh || "阅读文章 →"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      {(doc?.contactEmail || doc?.contactLine || doc?.bookingHref) && (
        <section
          className="mx-auto px-6 py-12 md:py-16 border-t border-white/10"
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {!!doc?.contactEmail && (
              <div className="rounded-2xl bg白/5 p-4">
                <p className="text-sm opacity-80">Email</p>
                <p className="font-semibold">{doc.contactEmail}</p>
              </div>
            )}
            {!!doc?.contactLine && (
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm opacity-80">LINE</p>
                <p className="font-semibold">{doc.contactLine}</p>
              </div>
            )}
            {!!doc?.bookingHref && (
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm opacity-80 mb-1">预约咨询</p>
                <Link
                  href={withLang(doc.bookingHref)}
                  className="inline-block rounded-full bg-white text黑 px-5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  立即预约 →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer：固定簡中 */}
      <Footer lang={PAGE_LANG} />
    </div>
  );
}
