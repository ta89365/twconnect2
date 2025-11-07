// File: apps/web/src/app/cn-investment/cn-investment-docs-cn/page.tsx
// 重點：統一字體為 Noto Sans SC，並強制將 lang="zh-cn" 傳給 NavigationServer / FooterServer

import React, { type JSX } from "react";
import Image from "next/image";
import Link from "next/link";

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";

import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentDocsCnQuery } from "@/lib/queries/cnInvestmentDocsCn.groq";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

// ✅ 簡中網頁字體
import { Noto_Sans_SC } from "next/font/google";
const notoSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sc",
});

export const revalidate = 60;
export const dynamic = "force-dynamic";

const BRAND_BLUE = "#1C3D5A";
const MAX_W = 1200;

type PTBlock = any;

interface RequiredFileItem {
  order?: number;
  key?: string;
  titleZhCn?: string;
  summaryZhCn?: string;
  detailsZhCn?: PTBlock[];
  notesZhCn?: PTBlock[];
}
interface CommonRejectionItem {
  order?: number;
  titleZhCn?: string;
  problemZhCn?: PTBlock[];
  recommendationZhCn?: PTBlock[];
  legalNotesZhCn?: PTBlock[];
}
interface PracticalTipItem {
  order?: number;
  titleZhCn?: string;
  bodyZhCn?: PTBlock[];
}
interface QueryResultDoc {
  _id: string;
  slug?: string;
  meta?: { isDraft?: boolean; lastReviewedAt?: string };
  heroTitleZhCn?: string;
  heroSubtitleZhCn?: string;
  introZhCn?: PTBlock[];
  requiredFiles?: RequiredFileItem[];
  commonRejections?: CommonRejectionItem[];
  practicalTips?: PracticalTipItem[];
  conclusionZhCn?: PTBlock[];
  contact?: { email?: string; lineId?: string };
}
interface QueryResult {
  _id?: string;
  slug?: string;
  doc?: QueryResultDoc;
}

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 text-slate-800">{children}</p>,
    h3: ({ children }) => <h3 className="text-lg md:text-xl font-semibold text-slate-900 mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base md:text-lg font-semibold text-slate-900 mt-4 mb-1.5">{children}</h4>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6 space-y-1 text-slate-800">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-6 space-y-1 text-slate-800">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-slate-400 hover:decoration-slate-700"
      >
        {children}
      </a>
    ),
  },
};

/* 紋理背景（略） */
function PatternBG(): JSX.Element {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(circle at 16px 16px, rgba(255,255,255,0.08) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,1))",
      }}
    />
  );
}

function Kicker({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="inline-flex items-center gap-1 bg-white/15 text-white/90 text-[11px] md:text-xs uppercase tracking-[0.18em] px-3 py-1 rounded-full">
      {children}
    </div>
  );
}

export default async function Page(): Promise<JSX.Element> {
  const data = (await sfetch(cnInvestmentDocsCnQuery)) as QueryResultDoc | QueryResult;
  const doc: QueryResultDoc = (data as any)?.doc ?? (data as QueryResultDoc);

  const title = doc?.heroTitleZhCn ?? "陆资来台投资申请文件准备与常见退件原因";
  const subtitle = doc?.heroSubtitleZhCn ?? "一次搞懂文件要点，避免重复补件与审查延误";

  return (
    <div className={`${notoSC.className} min-h-screen relative`} style={{ backgroundColor: BRAND_BLUE }}>
      <PatternBG />

      {/* ✅ 導覽列強制使用 zh-cn */}
      {/* @ts-ignore Async Server Component */}
      <NavigationServer lang="zh-cn" />

      {/* Hero */}
      <header className="relative">
        <div className="mx-auto" style={{ maxWidth: `${MAX_W}px` }}>
          <div className="px-5 md:px-8 pt-12 md:pt-16 pb-8 md:pb-10">
            <Kicker>CN Investment · 文件與退件重點</Kicker>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mt-4">{title}</h1>
            {subtitle ? (
              <p className="text-white/90 text-base md:text-lg mt-3 md:mt-4 max-w-3xl">{subtitle}</p>
            ) : null}
            <nav className="mt-6 flex flex-wrap gap-2.5">
              <a href="#intro" className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-white/90 hover:bg-white/20 hover:text-white transition">
                前言
              </a>
              <a href="#files" className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-white/90 hover:bg-white/20 hover:text-white transition">
                申请所需文件
              </a>
              <a href="#rejections" className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-white/90 hover:bg-white/20 hover:text白 transition">
                常见退件
              </a>
              <a href="#tips" className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-white/90 hover:bg-white/20 hover:text白 transition">
                实务建议
              </a>
              <a href="#conclusion" className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-white/90 hover:bg-white/20 hover:text白 transition">
                结语与联系
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-16">
        <div className="mx-auto px-5 md:px-8 space-y-8" style={{ maxWidth: `${MAX_W}px` }}>
          {doc?.introZhCn?.length ? (
            <section id="intro" className="w-full">
              <div className="bg-white/95 text-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">一、前言</h2>
                <div className="prose prose-slate max-w-none">
                  <PortableText value={doc.introZhCn} components={ptComponents} />
                </div>
              </div>
            </section>
          ) : null}

          {doc?.requiredFiles?.length ? (
            <section id="files" className="w-full">
              <div className="bg-white/95 text-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">二、申请所需主要文件</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {doc.requiredFiles
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((item, idx) => (
                      <div key={`${item.key ?? idx}`} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                        <div className="bg-slate-50 px-4 py-3 flex items-center gap-3">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-800 text-sm font-semibold">
                            {(item.order ?? idx + 1).toString()}
                          </span>
                          <h3 className="text-base md:text-lg font-semibold text-slate-900">{item.titleZhCn ?? "未命名文件"}</h3>
                        </div>
                        <div className="p-4 md:p-5 space-y-3">
                          {item.summaryZhCn ? <p className="text-slate-800">{item.summaryZhCn}</p> : null}
                          {item.detailsZhCn?.length ? (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">要点</h4>
                              <PortableText value={item.detailsZhCn} components={ptComponents} />
                            </div>
                          ) : null}
                          {item.notesZhCn?.length ? (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">备注</h4>
                              <PortableText value={item.notesZhCn} components={ptComponents} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ) : null}

          {doc?.commonRejections?.length ? (
            <section id="rejections" className="w-full">
              <div className="bg-rose-50/40 border border-rose-200 text-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold text-rose-900 mb-4">三、常见退件与补件原因</h2>
                <div className="space-y-6">
                  {doc.commonRejections
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((item, idx) => (
                      <div key={`rej-${idx}`} className="rounded-xl overflow-hidden border border-rose-200 bg-white">
                        <div className="px-4 py-3 bg-rose-50">
                          <h3 className="text-base md:text-lg font-semibold text-rose-900">{item.titleZhCn ?? `情形 ${idx + 1}`}</h3>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                          {item.problemZhCn?.length ? (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">常见问题</h4>
                              <PortableText value={item.problemZhCn} components={ptComponents} />
                            </div>
                          ) : null}
                          {item.recommendationZhCn?.length ? (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">建议</h4>
                              <PortableText value={item.recommendationZhCn} components={ptComponents} />
                            </div>
                          ) : null}
                          {item.legalNotesZhCn?.length ? (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">法令提示</h4>
                              <PortableText value={item.legalNotesZhCn} components={ptComponents} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ) : null}

          {doc?.practicalTips?.length ? (
            <section id="tips" className="w-full">
              <div className="bg-white/95 text-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">四、实务经验与建议</h2>
                <div className="space-y-5">
                  {doc.practicalTips
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((tip, idx) => (
                      <div key={`tip-${idx}`} className="border border-slate-200 rounded-xl p-4 md:p-5 bg-slate-50">
                        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">{tip.titleZhCn ?? `建议 ${idx + 1}`}</h3>
                        {tip.bodyZhCn?.length ? <PortableText value={tip.bodyZhCn} components={ptComponents} /> : null}
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ) : null}

          {(doc?.conclusionZhCn?.length || doc?.contact?.email || doc?.contact?.lineId) ? (
            <section id="conclusion" className="w-full">
              <div className="bg-white/95 text-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">五、结语</h2>
                {doc?.conclusionZhCn?.length ? (
                  <div className="mb-4">
                    <PortableText value={doc.conclusionZhCn} components={ptComponents} />
                  </div>
                ) : null}
                {(doc?.contact?.email || doc?.contact?.lineId) ? (
                  <div className="mt-4 rounded-xl bg-slate-100 px-4 py-4">
                    <p className="text-slate-800">需要协助？欢迎联系 Taiwan Connect 团队：</p>
                    <ul className="mt-2 text-slate-900 space-y-1">
                      {doc.contact?.email ? (
                        <li>
                          📩 Email：
                          <a className="underline ml-1" href={`mailto:${doc.contact.email}`}>{doc.contact.email}</a>
                        </li>
                      ) : null}
                      {doc.contact?.lineId ? <li>💬 LINE：<span className="ml-1">{doc.contact.lineId}</span></li> : null}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {/* ============================ Prefooter CTA ============================ */}
      <section
        id="prefooter-cta"
        className="py-12 md:py-14 text-center border-t border-white/10"
        style={{ backgroundColor: BRAND_BLUE }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            用最合适的进出策略，安心展开在台事业
          </h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/contact?lang=zh-cn"
              className="inline-block bg-[#4A90E2] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              联系我们
            </Link>
            <a
              href={`mailto:${doc?.contact?.email ?? "info@twconnects.com"}`}
              className="inline-block bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/15 transition"
            >
              {doc?.contact?.email ?? "info@twconnects.com"}
            </a>
          </div>
        </div>
      </section>

      {/* ✅ Footer 強制使用 zh-cn */}
      {/* @ts-ignore Async Server Component */}
      <FooterServer lang="zh-cn" />
    </div>
  );
}
