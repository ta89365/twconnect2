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
import * as Lucide from "lucide-react";
import type { JSX } from "react";

/* ============================ i18n ============================ */
type Lang = "zh" | "zh-cn" | "jp" | "en";
/** 本頁固定以簡中呈現，但所有連結一律導向 zh；Nav/Footer 亦傳 zh 以確保連結正確 */
const PAGE_LANG: Lang = "zh";
const NAV_FOOTER_LANG: "jp" | "zh" | "en" = "zh";

/* ============================ Fonts ============================ */
const notoSC = Noto_Sans_SC({
  weight: ["400", "500", "700", "900"],
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
  heroMinH: "60vh",
  heroOverlay:
    "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.50) 100%)",
} as const;

// 淡淡底色（整段區塊底的輕微白霧層）
const STRIP_BG = "bg-white/5";

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

/* ============================ Utils ============================ */
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const LANG_Q = `lang=${PAGE_LANG}`;
function withLang(href: string) {
  if (!href) return "#";
  if (/^https?:\/\//i.test(href)) return href; // 外部連結不加 lang
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}${LANG_Q}`;
}

function safeHref(item: Topic) {
  if (item?.href) return withLang(item.href);
  if (item?.internal?.slug) {
    const ch = item.internal.channel ?? "news";
    return withLang(`/${ch}/${item.internal.slug}`);
  }
  // external 直接回傳，不加 lang
  return item?.external ?? "#";
}

/* ===== 包裝 Server Components ===== */
const Nav = NavigationServer as unknown as (props: Record<string, any>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, any>) => JSX.Element;

/* ============================ PortableText Components ============================ */
const ptComponents: PortableTextComponents = {
  block: ({ children, value }) => {
    const style = (value as any)?.style || "normal";
    switch (style) {
      case "h2":
        return <h2 className="text-2xl md:text-3xl font-bold mb-4">{children}</h2>;
      case "h3":
        return <h3 className="text-xl md:text-2xl font-semibold mb-3">{children}</h3>;
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
      const raw = (value as any)?.href || "#";
      const href = /^https?:\/\//i.test(raw) ? raw : withLang(raw);
      return (
        <a
          href={href}
          target={/^https?:\/\//i.test(href) ? "_blank" : "_self"}
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

/* ============================ 小元件 ============================ */
function Badge({
  icon: Icon,
  label,
}: {
  icon: Lucide.LucideIcon;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </span>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: Lucide.LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-md p-4 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.02]">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white/40 p-2 mt-1">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex flex-col leading-tight">
          <div className="text-2xl font-extrabold leading-none">{value}</div>
          <div className="text-sm opacity-85 mt-1.5">{label}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================ Page ============================ */
export default async function Page(): Promise<JSX.Element> {
  const doc = (await sfetch(cnInvestmentLandingQuery)) as LandingDoc | null;
  const topics = (doc?.recommended ?? []).slice(0, 4);
  const finalTopics: Topic[] =
    topics.length >= 4
      ? topics
      : [
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

  return (
    <div
      style={{ backgroundColor: BRAND_BLUE }}
      className={`${notoSC.className} min-h-screen text-white`}
    >
      {/* Nav：傳 zh，讓導覽列所有連結均為中文版本 */}
      <Nav lang="zh-cn" linkLang="zh" />

      {/* ============================ Hero ============================ */}
      <section className={`relative w-full ${STRIP_BG}`} style={{ minHeight: TUNE.heroMinH }}>
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
        <div className="relative mx-auto px-6 py-16 md:py-20" style={{ maxWidth: TUNE.contentMaxW }}>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge icon={Lucide.BadgeCheck} label="陆资投资专区" />
            <Badge icon={Lucide.FileCheck2} label="核准到设立一站式" />
            <Badge icon={Lucide.ShieldCheck} label="政策与合规" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            {doc?.titleZh || "陆资企业进入台湾市场专区"}
          </h1>
          {!!doc?.taglineEn && (
            <p className="mt-4 text-base md:text-lg opacity-90">{doc.taglineEn}</p>
          )}

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat icon={Lucide.Clock} value="全程代辦" label="最快 1个月内核准" />
            <Stat icon={Lucide.Files} value="12+ 项" label="关键申请与佐证文件" />
            <Stat icon={Lucide.SquareCheck} value="6 阶段" label="从核准到开业全流程" />
            <Stat icon={Lucide.Users} value="专案制" label="顾问与法遵协作" />
          </div>
        </div>
      </section>

      {/* ============================ Why + Principle ============================ */}
      {(doc?.whyZh?.length || doc?.principleZh) && (
        <section
          className={`mx-auto px-6 py-14 md:py-20 border-t border-white/10 ${STRIP_BG}`}
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-6 transition-all hover:from-white/15 hover:to-white/10 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-white/20 p-2.5">
                  <Lucide.Target className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold">进入台湾的正确路径</p>
              </div>
              {!!doc?.whyZh?.length ? (
                <div className="prose prose-invert max-w-none text-sm leading-relaxed opacity-90">
                  <PortableText value={doc.whyZh} components={ptComponents} />
                </div>
              ) : (
                <p className="text-sm opacity-90 leading-relaxed">
                  台湾市场具有高潜能与法制完善的投资环境。陆资若未依法核准设立，可能导致严重退件或延误。
                  <br />
                  Taiwan Connect 提供合规路径，协助顺利核准、设立、营运。
                </p>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl bg-gradient-to-r from-[#4FC3F7] to-[#A7FFEB]" />
            </div>

            <div className="relative rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-6 transition-all hover:from-white/15 hover:to-white/10 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-white/20 p-2.5">
                  <Lucide.Scale className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold">合规先行的核心原则</p>
              </div>
              <p className="text-sm opacity-90 leading-relaxed whitespace-pre-line">
                {doc?.principleZh || "让陆资企业合规落地、顺利营运，真正开启台湾市场的大门。"}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300]" />
            </div>

            <div className="relative rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-6 transition-all hover:from-white/15 hover:to-white/10 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-white/20 p-2.5">
                  <Lucide.Layers className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold">从核准到营运的衔接</p>
              </div>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle2 className="h-4 w-4 mt-0.5 text-[#80DEEA]" />
                  投审会核准
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle2 className="h-4 w-4 mt-0.5 text-[#80DEEA]" />
                  公司设立与开户
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle2 className="h-4 w-4 mt-0.5 text-[#80DEEA]" />
                  税务登记与人事合规
                </li>
              </ul>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl bg-gradient-to-r from-[#64B5F6] to-[#1E88E5]" />
            </div>
          </div>
        </section>
      )}

      {/* ============================ 法規與審查重點 ============================ */}
      {(doc?.regulationDefinitionZh?.length || doc?.authorities?.length) && (
        <section
          className={`mx-auto px-6 py-12 md:py-16 border-t border-white/10 ${STRIP_BG}`}
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          {!!doc?.regulationDefinitionZh?.length && (
            <div className="rounded-2xl bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-white/10 p-2">
                  <Lucide.BookOpenCheck className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">陆资的定义与法规依据</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <PortableText value={doc.regulationDefinitionZh} components={ptComponents} />
              </div>
            </div>
          )}

          {!!doc?.authorities?.length && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">主管机关</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {doc.authorities.map((a, i) => (
                  <Link
                    key={i}
                    href={a.url || "#"}
                    target={a.url ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="group rounded-2xl bg-white/5 p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <span>{a.nameZh || a.nameEn}</span>
                    <Lucide.ExternalLink className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!!doc?.reviewFocus?.length && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-white/10 p-2">
                  <Lucide.FileSearch className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">主要审查重点</h3>
              </div>
              <p className="opacity-80 text-sm mb-4">Key items evaluated by MOEAIC / MAC.</p>

              <div className="grid md:grid-cols-2 gap-4">
                {[...doc.reviewFocus]
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((x, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-5"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-xl bg-white/10 p-2">
                          <Lucide.SearchCheck className="h-5 w-5" />
                        </div>
                        <p className="font-semibold leading-tight">{x.titleZh}</p>
                      </div>
                      {!!x.bodyZh && (
                        <p className="opacity-90 text-sm leading-relaxed whitespace-pre-line">
                          {x.bodyZh}
                        </p>
                      )}
                      <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-[#4FC3F7]/70 to-[#A7FFEB]/70" />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================ 疑問與 CTA ============================ */}
      {(doc?.doubtsZh?.length || doc?.contactFormHref) && (
        <section
          className={`mx-auto px-6 py-12 md:py-16 border-t border-white/10 ${STRIP_BG}`}
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-2xl bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-white/10 p-2">
                  <Lucide.HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">你是否也有以下疑问</h2>
              </div>
              {!!doc?.doubtsZh?.length && (
                <div className="prose prose-invert max-w-none">
                  <PortableText value={doc.doubtsZh} components={ptComponents} />
                </div>
              )}
            </div>

            {!!doc?.contactFormHref && (
              <div className="rounded-2xl bg-white text-black p-6">
                <p className="font-semibold">与顾问联系</p>
                <p className="mt-2 text-sm opacity-80">留下需求，我们将在 1 个工作日内回复。</p>
                <Link
                  href={withLang(doc.contactFormHref)}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/50"
                >
                  前往表单
                  <Lucide.ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============================ 流程 ============================ */}
      {!!doc?.processSteps?.length && (
        <section
          className={`mx-auto px-6 py-12 md:py-16 border-t border-white/10 ${STRIP_BG}`}
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <h2 className="text-2xl font-bold mb-6">陆资投资与公司设立流程</h2>
          <ol className="relative">
            {[...doc.processSteps]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((s, i, arr) => {
                const last = i === arr.length - 1;
                return (
                  <li key={i} className="relative pl-10 pb-6">
                    <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-xs font-bold">
                      {i + 1}
                    </span>
                    {!last && (
                      <span className="absolute left-2.5 top-8 h-full w-px bg-white/30" aria-hidden />
                    )}
                    <div className="rounded-2xl bg-white/5 p-5">
                      <p className="font-semibold mb-2">{s.titleZh}</p>
                      {!!s.bodyZh && (
                        <div className="prose prose-invert max-w-none text-sm">
                          <PortableText value={s.bodyZh} components={ptComponents} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ol>
          {!!doc?.timelineZh && (
            <p className="mt-4 text-sm opacity-90">📆 预计时程：{doc.timelineZh}</p>
          )}
        </section>
      )}

      {/* ============================ 優勢 + 服務 + 團隊 ============================ */}
      {(doc?.advantagesIntroZh?.length ||
        doc?.serviceBulletsZh?.length ||
        doc?.teamImage?.url) && (
        <section
          className={`mx-auto px-6 py-12 md:py-16 border-t border-white/10 ${STRIP_BG}`}
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {!!doc?.advantagesIntroZh?.length && (
              <div className="rounded-2xl bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-white/10 p-2">
                    <Lucide.Star className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">我们的优势</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <PortableText value={doc.advantagesIntroZh} components={ptComponents} />
                </div>
              </div>
            )}

            {!!doc?.serviceBulletsZh?.length && (
              <div className="rounded-2xl bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-white/10 p-2">
                    <Lucide.ListChecks className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">我们能协助的事项</h2>
                </div>
                <ul className="grid md:grid-cols-1 gap-2">
                  {doc.serviceBulletsZh.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Lucide.CheckCircle2 className="h-4 w-4 mt-0.5" />
                      <span>{b.textZh}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

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

      {/* ============================ FAQ ============================ */}
      {!!doc?.faq?.length && (
        <section
          className={`mx-auto px-6 py-12 md:py-16 border-t border-white/10 ${STRIP_BG}`}
          style={{ maxWidth: TUNE.contentMaxW }}
        >
          <h2 className="text-2xl font-bold mb-6">常见问题（Q&A）</h2>
          <div className="space-y-3">
            {doc.faq.map((f, i) => (
              <details key={i} className="rounded-2xl bg-white/5 p-4 group">
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between">
                  {f.qZh}
                  <Lucide.ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
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

      {/* ============================ 推薦閱讀 ============================ */}
      <section
        className={`mx-auto px-6 py-12 md:py-16 border-t border-white/10 ${STRIP_BG}`}
        style={{ maxWidth: TUNE.contentMaxW }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">推荐阅读</h2>
          <span className="text-sm opacity-80">Recommended Articles</span>
        </div>
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
              <h3 className="text-base font-semibold mb-1 leading-snug line-clamp-2">{t.titleZh}</h3>
              {!!t.summaryZh && (
                <p className="text-sm opacity-90 line-clamp-3">{t.summaryZh}</p>
              )}
              <span className="mt-auto pt-3 inline-flex items-center text-sm font-semibold underline underline-offset-4">
                {t.ctaLabelZh || "阅读文章"}
                <Lucide.ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================ Prefooter CTA ============================ */}
      {(() => {
        const rawHref = doc?.contactFormHref || doc?.bookingHref || "/contact";
        const ctaHref = withLang(rawHref);
        const isExternal = /^https?:\/\//i.test(ctaHref);
        return (
          <section
            id="prefooter-cta"
            className="py-12 md:py-14 text-center border-t border-white/10"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <div className="max-w-4xl mx-auto px-6">
              <h3 className="text-xl md:text-2xl font-semibold">
                用最合适的进出策略，安心展开在台事业
              </h3>
              <div className="mt-5 flex items-center justify-center gap-3">
                <a
                  href={ctaHref}
                  {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-block bg-[#4A90E2] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                >
                  联系我们
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
        );
      })()}

      {/* Footer：傳 zh，讓頁尾所有連結均為中文版本 */}
      <Footer lang="zh-cn" linkLang="zh" />
    </div>
  );
}
