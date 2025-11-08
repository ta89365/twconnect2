// File: apps/web/src/app/cn-investment-whitelist/page.tsx

import React from "react";
import type { JSX } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentWhitelistQuery } from "@/lib/queries/cnInvestmentWhitelist.groq";
import {
  ShieldCheck,
  FileText,
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  Info,
  LineChart,
  Landmark,
  Globe2,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Noto_Sans_SC } from "next/font/google";

/* ============================ Font ============================ */
const notoSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 60;

/* ============================ Tokens ============================ */
const BRAND_BLUE = "#1C3D5A";
const ACCENT = "#4A90E2";
const CONTENT_MAX_W = 1100 as const;
const GRID_GAP = 28; // px

type PT = TypedObject[];

interface Category {
  key?: string;
  titleZhCn?: string;
  introZhCn?: PT;
  policyItems?: { titleZhCn?: string; bodyZhCn?: PT }[];
}

interface WhitelistDoc {
  _id: string;
  slug?: string;
  heroTitleZhCn?: string;
  heroSubtitleZhCn?: string;
  heroImage?: {
    url?: string;
    alt?: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
  introZhCn?: PT;
  policyBackgroundZhCn?: PT;
  categories?: Category[];
  contact?: { email?: string; lineId?: string; contactNoteZhCn?: PT };
}

/* ============================ Helpers ============================ */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

function catIcon(key?: string) {
  const k = String(key ?? "").toLowerCase();
  if (k.includes("manufact") || k.includes("factory")) return <Building2 className="h-5 w-5" />;
  if (k.includes("finance") || k.includes("bank") || k.includes("fund")) return <Landmark className="h-5 w-5" />;
  if (k.includes("service") || k.includes("biz") || k.includes("consult")) return <BriefcaseBusiness className="h-5 w-5" />;
  if (k.includes("export") || k.includes("trade")) return <Globe2 className="h-5 w-5" />;
  if (k.includes("list") || k.includes("check")) return <ListChecks className="h-5 w-5" />;
  return <ShieldCheck className="h-5 w-5" />;
}

const ptComponents: PortableTextComponents = {
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
  },
  block: {
    h2: ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>,
    h3: ({ children }) => <h4 className="text-lg font-semibold">{children}</h4>,
    h4: ({ children }) => <h5 className="text-base font-semibold">{children}</h5>,
    normal: ({ children }) => <p className="leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 pl-4 italic opacity-90">{children}</blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href as string | undefined;
      return (
        <a
          href={href}
          className="text-[#1C3D5A] underline decoration-[#1C3D5A]/60 underline-offset-4 hover:decoration-[#1C3D5A]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

/* ========== UI Primitives ========== */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 text-white">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs tracking-wide">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold">{title}</h2>
      {subtitle && <p className="mt-2 opacity-90">{subtitle}</p>}
    </div>
  );
}

function WhiteCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-white border border-[#e5e7eb] ${className}`}>
      <div className="p-6 md:p-7 text-[#1C3D5A]">{children}</div>
    </div>
  );
}

/* ============================ Page ============================ */
export default async function Page() {
  const data = (await sfetch(cnInvestmentWhitelistQuery)) as WhitelistDoc | null;
  if (!data) notFound();
  const doc = data;

  return (
    <div
      className={`${notoSC.className} min-h-screen flex flex-col antialiased`}
      style={{ backgroundColor: BRAND_BLUE, fontSynthesisWeight: "none" }}
    >
      <Nav lang="zh-cn" />

      {/* ============================ Hero（遮罩調淡） ============================ */}
      <section className="relative">
        <div className="relative min-h-[64vh] flex items-center justify-center text-center text-white overflow-hidden">
          {doc.heroImage?.url && (
            <Image
              src={doc.heroImage.url}
              alt={doc.heroImage.alt || "陆资白名单指南"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              placeholder={doc.heroImage.lqip ? "blur" : "empty"}
              blurDataURL={doc.heroImage.lqip}
            />
          )}
          <div className="absolute inset-0 bg-[#0A1B29]/25" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_-10%,rgba(74,144,226,0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#1C3D5A]/20 to-[#1C3D5A]/40" />

          <div className="relative z-10 w-full px-6">
            <div className="mx-auto max-w-5xl">
              <div className="mx-auto max-w-4xl p-[1px] rounded-xl bg-gradient-to-b from-white/25 via-white/10 to-white/5">
                <div className="rounded-xl bg-black/20 backdrop-blur-md border border-white/25 px-6 py-8 md:px-10 md:py-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>陆资白名单</span>
                  </div>
                  <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    {doc.heroTitleZhCn || "陆资白名单指南"}
                  </h1>
                  {doc.heroSubtitleZhCn && (
                    <p className="mt-3 md:mt-4 text-base md:text-lg opacity-95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                      {doc.heroSubtitleZhCn}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {[
                      { icon: <Info />, label: "简介", href: "#intro" },
                      { icon: <FileText />, label: "政策背景", href: "#policy" },
                      { icon: <ListChecks />, label: "类别与要点", href: "#categories" },
                      { icon: <ShieldCheck />, label: "流程", href: "#steps" },
                    ].map((btn, i) => (
                      <a
                        key={i}
                        href={btn.href}
                        className="group inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm hover:bg-white/30 transition"
                      >
                        {React.cloneElement(btn.icon, { className: "h-4 w-4" })}
                        {btn.label}
                        <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#1C3D5A]" />
        </div>
      </section>

      {/* ============================ Content（白框＋藍字） ============================ */}
      <main className="flex-grow">
        <div className="mx-auto px-6 w-full" style={{ maxWidth: CONTENT_MAX_W }}>
          <div className="grid grid-cols-12 gap-6 md:gap-8 py-10 md:py-14">
            {/* 主內容（左） */}
            <section className="col-span-12 lg:col-span-9 space-y-10">
              {/* Intro */}
              {doc.introZhCn && (
                <div id="intro" className="scroll-mt-28">
                  <SectionHeader
                    eyebrow="Overview"
                    title="一、正面表列制度简介"
                    subtitle="以明确清单取代原则性限制，让合规路径更清楚。"
                  />
                  <WhiteCard>
                    <div className="prose max-w-none">
                      <PortableText value={doc.introZhCn} components={ptComponents} />
                    </div>
                  </WhiteCard>
                </div>
              )}

              {/* Policy */}
              {doc.policyBackgroundZhCn && (
                <div id="policy" className="scroll-mt-28">
                  <SectionHeader
                    eyebrow="Context"
                    title="二、政策背景"
                    subtitle="理解主管机关的监管目标与开放节奏，有助设定投资结构与时程。"
                  />
                  <WhiteCard>
                    <div className="prose max-w-none">
                      <PortableText value={doc.policyBackgroundZhCn} components={ptComponents} />
                    </div>
                  </WhiteCard>
                </div>
              )}

              {/* Categories：改為直排 */}
              {Array.isArray(doc.categories) && doc.categories.length > 0 && (
                <div id="categories" className="scroll-mt-28">
                  <SectionHeader
                    eyebrow="Eligibility"
                    title="三、适用类别与政策要点"
                    subtitle="依产业与业务属性区分，掌握门槛、限制与必要文件。"
                  />

                  {/* 單欄直排 */}
                  <div className="grid grid-cols-1 gap-6">
                    {doc.categories.map((cat, i) => (
                      <WhiteCard key={i}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-[#1C3D5A]">{catIcon(cat.key)}</div>
                          <div className="w-full">
                            <h3 className="text-lg font-semibold">
                              {cat.titleZhCn ?? `类别 ${i + 1}`}
                            </h3>

                            {cat.introZhCn && (
                              <div className="prose max-w-none mt-2">
                                <PortableText value={cat.introZhCn} components={ptComponents} />
                              </div>
                            )}

                            {Array.isArray(cat.policyItems) && cat.policyItems.length > 0 && (
                              <div className="mt-4 space-y-4">
                                {cat.policyItems.map((item, j) => (
                                  <div
                                    key={j}
                                    className="rounded-lg bg-white border border-[#e6e9ee] p-4 text-[#1C3D5A]"
                                  >
                                    {item.titleZhCn && (
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <h4 className="font-semibold">{item.titleZhCn}</h4>
                                      </div>
                                    )}
                                    {item.bodyZhCn && (
                                      <div className="prose max-w-none">
                                        <PortableText value={item.bodyZhCn} components={ptComponents} />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </WhiteCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div id="steps" className="scroll-mt-28">
                <SectionHeader
                  eyebrow="Process"
                  title="四、實務流程"
                  subtitle="從資格判定到核准落地的關鍵節點與交付物。"
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6 items-stretch">
                  {[
                    { title: "資格與類別確認", desc: "確認投資人屬性與是否適用白名單類別。" },
                    { title: "文件與結構準備", desc: "依類別準備證明文件與投資架構說明。" },
                    { title: "送件與溝通", desc: "按規範送件並就疑義與機關溝通。" },
                    { title: "核准與落地", desc: "完成匯入、設立登記與後續合規。" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="h-full min-h-[220px] flex flex-col justify-between rounded-xl
                                 bg-white border border-[#e5e7eb] p-6 text-[#1C3D5A]"
                    >
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#1C3D5A]/10 border border-[#1C3D5A]/25 text-[#1C3D5A]">
                          <span className="text-sm font-semibold">{idx + 1}</span>
                        </div>
                        <div className="text-sm opacity-90">Step {idx + 1}</div>
                      </div>

                      <div className="mt-3 flex-1">
                        <h4 className="font-semibold text-base mb-1">{s.title}</h4>
                        <p className="opacity-95 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

{/* 黏附導覽（右）— 真正縮小寬度 */}
<aside className="hidden lg:block col-span-3">
  <div className="sticky top-24 flex justify-end">
    <div className="w-[180px] rounded-md bg-white border border-[#e5e7eb] text-[#1C3D5A] shadow-sm">
      <nav className="px-3 py-2.5">
        <div className="text-[13px] font-medium tracking-wide opacity-80 mb-2">
          快速导览
        </div>
        <ul className="space-y-1 text-[13px]">
          {[
            { href: "#intro", label: "一、制度简介" },
            { href: "#policy", label: "二、政策背景" },
            { href: "#categories", label: "三、类别与要点" },
            { href: "#steps", label: "四、实务流程" },
          ].map((i) => (
            <li key={i.href}>
              <a
                href={i.href}
                className="group flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-[#1C3D5A]/5 transition-colors"
              >
                <span className="inline-block h-1 w-1 rounded-full bg-[#1C3D5A]/70 group-hover:bg-[#1C3D5A]" />
                <span>{i.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
</aside>


          </div>
        </div>
      </main>

      {/* CTA stripe */}
      <section className="relative border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_120px_at_50%_0%,rgba(74,144,226,0.25),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-10 text-center text-white">
          <h3 className="text-xl md:text-2xl font-semibold">用最合适的进出策略，安心展开在台事业</h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href="/contact?lang=zh-cn"
              className="inline-block bg-[#4A90E2] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              联系我们
            </a>
          </div>
        </div>
      </section>

      {/* 回到頂部 */}
      <a
        href="#"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-sm hover:bg-white/25 transition"
        aria-label="回到顶部"
      >
        ↑
      </a>

      <Footer lang="zh-cn" />
    </div>
  );
}
