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
  Mail,
  LineChart,
  Landmark,
  Globe2,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Noto_Sans_SC } from "next/font/google"; // ✅ 新增

/* ============================ Font ============================ */
const notoSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 60;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = 1080 as const; // px
const GRID_GAP = "28px";

type PT = TypedObject[];

interface Category {
  key?: string;
  titleZhCn?: string;
  introZhCn?: PT;
  policyItems?: {
    titleZhCn?: string;
    bodyZhCn?: PT;
  }[];
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
  contact?: {
    email?: string;
    lineId?: string;
    contactNoteZhCn?: PT;
  };
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
          className="underline decoration-white/60 underline-offset-4 hover:decoration-white"
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

/* ============================ Page ============================ */
export default async function Page() {
  const data = (await sfetch(cnInvestmentWhitelistQuery)) as WhitelistDoc | null;
  if (!data) notFound();
  const doc = data;

  return (
    <div
      className={`${notoSC.className} min-h-screen flex flex-col antialiased`}
      style={{
        backgroundColor: BRAND_BLUE,
        fontSynthesisWeight: "none", // ✅ 關掉偽粗體，確保中文字清晰
      }}
    >
      <Nav lang="zh-cn" />

      {/* Hero */}
      <section className="relative w-full">
        <div className="relative min-h-[60vh] flex items-center justify-center px-6 text-center text-white">
          {doc.heroImage?.url && (
            <Image
              src={doc.heroImage.url}
              alt={doc.heroImage.alt || "陆资白名单指南"}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
              placeholder={doc.heroImage.lqip ? "blur" : "empty"}
              blurDataURL={doc.heroImage.lqip}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C3D5A]/60 to-[#1C3D5A]" />
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {doc.heroTitleZhCn || "陆资白名单指南"}
            </h1>
            {doc.heroSubtitleZhCn && (
              <p className="mt-4 text-base md:text-lg opacity-90">{doc.heroSubtitleZhCn}</p>
            )}

            {/* Hero 標籤列 */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {[
                { icon: <CheckCircle2 className="h-4 w-4" />, text: "法规脉络清晰" },
                { icon: <FileText className="h-4 w-4" />, text: "要点一览" },
                { icon: <LineChart className="h-4 w-4" />, text: "实务可操作" },
              ].map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-sm"
                >
                  {b.icon}
                  {b.text}
                </span>
              ))}
            </div>

            {/* 快速導航 */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: <Info />, label: "白名单简介", href: "#intro" },
                { icon: <FileText />, label: "政策背景", href: "#policy" },
                { icon: <ListChecks />, label: "类别与要点", href: "#categories" },
                { icon: <ShieldCheck />, label: "实务流程", href: "#steps" },
                { icon: <Mail />, label: "联系我们", href: "#contact" },
              ].map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  className="group inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm hover:bg-white/25 transition"
                >
                  {React.cloneElement(btn.icon, { className: "h-4 w-4" })}
                  {btn.label}
                  <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="flex-grow text-white px-6 py-12 flex justify-center">
        <div className="w-full" style={{ maxWidth: CONTENT_MAX_W }}>
          {/* Intro */}
          {doc.introZhCn && (
            <section id="intro" className="scroll-mt-24">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 shrink-0 mt-1" />
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">一、白名单制度简介</h2>
                    <div className="prose prose-invert max-w-none">
                      <PortableText value={doc.introZhCn} components={ptComponents} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Policy */}
          {doc.policyBackgroundZhCn && (
            <section id="policy" className="mt-10 scroll-mt-24">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 shrink-0 mt-1" />
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">二、政策背景</h2>
                    <div className="prose prose-invert max-w-none">
                      <PortableText value={doc.policyBackgroundZhCn} components={ptComponents} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Categories */}
          {Array.isArray(doc.categories) && doc.categories.length > 0 && (
            <section id="categories" className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-4">三、适用类别与政策要点</h2>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                  gap: GRID_GAP,
                }}
              >
                {doc.categories.map((cat, i) => (
                  <div
                    key={i}
                    className="col-span-12 md:col-span-6 rounded-2xl border border-white/15 bg-white/5 p-6 hover:bg-white/[0.08] transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-white/90">{catIcon(cat.key)}</div>
                      <div className="space-y-3 w-full">
                        <h3 className="text-lg font-semibold">
                          {cat.titleZhCn ?? `类别 ${i + 1}`}
                        </h3>
                        {cat.introZhCn && (
                          <div className="prose prose-invert max-w-none">
                            <PortableText value={cat.introZhCn} components={ptComponents} />
                          </div>
                        )}
                        {Array.isArray(cat.policyItems) && cat.policyItems.length > 0 && (
                          <div className="mt-2 space-y-4">
                            {cat.policyItems.map((item, j) => (
                              <div
                                key={j}
                                className="rounded-xl bg-white/5 border border-white/10 p-4"
                              >
                                {item.titleZhCn && (
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <h4 className="font-semibold">{item.titleZhCn}</h4>
                                  </div>
                                )}
                                {item.bodyZhCn && (
                                  <div className="prose prose-invert max-w-none">
                                    <PortableText value={item.bodyZhCn} components={ptComponents} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Steps */}
          <section id="steps" className="mt-10 scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4">四、实务流程示意</h2>
            <ol className="relative border-l border-white/20 ml-3 space-y-6">
              {[
                { icon: <Info className="h-4 w-4" />, title: "资格与类别确认", desc: "确认投资人属性与是否适用白名单类别。" },
                { icon: <FileText className="h-4 w-4" />, title: "文件与结构准备", desc: "依类别准备证明文件与投资架构说明。" },
                { icon: <ShieldCheck className="h-4 w-4" />, title: "送件与沟通", desc: "按主管机关规范送件并说明疑义。" },
                { icon: <CheckCircle2 className="h-4 w-4" />, title: "核准与落地", desc: "核准后完成汇入、设立与后续合规作业。" },
              ].map((step, idx) => (
                <li key={idx} className="ml-4">
                  <div className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full bg-white" />
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 opacity-90">{step.icon}</div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="opacity-95">{step.desc}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Contact */}
          {(doc.contact && (doc.contact.email || doc.contact.lineId || doc.contact.contactNoteZhCn)) && (
            <section id="contact" className="mt-10 scroll-mt-24">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-3">五、联系我们</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm opacity-80">咨询邮箱</div>
                    {doc.contact.email ? (
                      <a
                        href={`mailto:${doc.contact.email}`}
                        className="text-lg underline decoration-white/50 underline-offset-4 hover:decoration-white"
                      >
                        {doc.contact.email}
                      </a>
                    ) : (
                      <span className="opacity-70">未提供</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm opacity-80">LINE</div>
                    {doc.contact.lineId ? (
                      <span className="font-mono text-lg">{doc.contact.lineId}</span>
                    ) : (
                      <span className="opacity-70">未提供</span>
                    )}
                  </div>
                </div>

                {doc.contact.contactNoteZhCn && (
                  <div className="prose prose-invert max-w-none mt-6">
                    <PortableText value={doc.contact.contactNoteZhCn} components={ptComponents} />
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer lang="zh-cn" />
    </div>
  );
}
