// File: apps/web/src/app/cn-investment/cn-investment-docs-cn/page.tsx
// Purpose: "陆资来台投资申请文件准备与常见退件原因" 專用頁面（簡中內容），整頁背景為品牌藍。
// Notes:
// - 以 Sanity 資料型別 cnInvestmentDocsCn 為後端，對應 GROQ 查詢 cnInvestmentDocsCnQuery。
// - 使用 Portable Text 解析 intro / details / notes / problem / recommendation / legalNotes / body / conclusion 等段落陣列。
// - 採用白底卡片置於品牌藍背景上，提升可讀性。
// - 相容 Next.js App Router（Server Component）。

import React, { type JSX } from "react";
import Image from "next/image";
import Link from "next/link";

// 站內共用元件（若為 async server component，保留 @ts-expect-error）
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";

// Sanity 取數工具與查詢
import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentDocsCnQuery } from "@/lib/queries/cnInvestmentDocsCn.groq";

// Portable Text
import { PortableText, type PortableTextComponents } from "@portabletext/react";

export const revalidate = 60;
export const dynamic = "force-dynamic";

/* ============================ 視覺基礎 ============================ */
const BRAND_BLUE = "#1C3D5A"; // 品牌藍
const MAX_W = "1200px";      // 內容最大寬

/* ============================ 型別宣告 ============================ */
type PTBlock = any; // 若已於專案導入 @portabletext/types，可細化為 PortableTextBlock

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
  doc?: QueryResultDoc; // 若你的 sfetch 直接回傳 doc，請視情況調整
}

/* ============================ Portable Text 樣式 ============================ */
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 text-slate-800">{children}</p>,
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-1 text-slate-800">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-1 text-slate-800">{children}</ol>
    ),
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

/* ============================ 小型 UI 元件 ============================ */
function SectionCard({
  title,
  children,
  anchor,
}: {
  title: string;
  children: React.ReactNode;
  anchor?: string;
}): JSX.Element {
  return (
    <section id={anchor} className="w-full">
      <div className="bg-white/95 text-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
          {title}
        </h2>
        <div className="prose prose-slate max-w-none">
          {children}
        </div>
      </div>
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="inline-block bg-white/15 text-white/90 text-xs uppercase tracking-widest px-3 py-1 rounded-full">
      {children}
    </div>
  );
}

/* ============================ 主頁面 ============================ */
export default async function Page(): Promise<JSX.Element> {
  // 若你的 sfetch 直接回傳 doc，請依實際回傳格式調整
  const data = (await sfetch(cnInvestmentDocsCnQuery)) as QueryResultDoc | QueryResult;
  const doc: QueryResultDoc = (data as any)?.doc ?? (data as QueryResultDoc);

  const title = doc?.heroTitleZhCn ?? "陆资来台投资申请文件准备与常见退件原因";
  const subtitle = doc?.heroSubtitleZhCn ?? "一次搞懂文件要点，避免重复补件与审查延误";

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE }}>
      {/* 導覽列 */}
      {/** @ts-ignore Async Server Component */}
      <NavigationServer />

      {/* Hero 區塊 */}
      <header className="relative">
        <div className="mx-auto" style={{ maxWidth: MAX_W }}>
          <div className="px-5 md:px-8 pt-12 md:pt-16 pb-8 md:pb-10">
            <Kicker>CN Investment · 文件與退件重點</Kicker>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mt-4">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-white/90 text-base md:text-lg mt-3 md:mt-4 max-w-3xl">
                {subtitle}
              </p>
            ) : null}
            {/* 快速導覽超連結 */}
            <nav className="mt-5 flex flex-wrap gap-3">
              <a href="#intro" className="text-white/90 underline underline-offset-4 hover:text-white">前言</a>
              <a href="#files" className="text-white/90 underline underline-offset-4 hover:text-white">申请所需文件</a>
              <a href="#rejections" className="text-white/90 underline underline-offset-4 hover:text-white">常见退件</a>
              <a href="#tips" className="text-white/90 underline underline-offset-4 hover:text-white">实务建议</a>
              <a href="#conclusion" className="text-white/90 underline underline-offset-4 hover:text-white">结语与联系</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 內容區塊 */}
      <main className="pb-16">
        <div className="mx-auto px-5 md:px-8 space-y-8" style={{ maxWidth: MAX_W }}>
          {/* 前言 */}
          {doc?.introZhCn?.length ? (
            <SectionCard title="一、前言" anchor="intro">
              <PortableText value={doc.introZhCn} components={ptComponents} />
            </SectionCard>
          ) : null}

          {/* 申請所需主要文件 */}
          {doc?.requiredFiles?.length ? (
            <SectionCard title="二、申请所需主要文件" anchor="files">
              <div className="space-y-6">
                {doc.requiredFiles
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((item, idx) => (
                    <div key={`${item.key ?? idx}`} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-800 text-sm font-semibold">
                            {(item.order ?? idx + 1).toString()}
                          </span>
                          <h3 className="text-base md:text-lg font-semibold text-slate-900">
                            {item.titleZhCn ?? "未命名文件"}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4 md:p-5 space-y-3">
                        {item.summaryZhCn ? (
                          <p className="text-slate-800">{item.summaryZhCn}</p>
                        ) : null}
                        {item.detailsZhCn?.length ? (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">要点</h4>
                            <PortableText value={item.detailsZhCn} components={ptComponents} />
                          </div>
                        ) : null}
                        {item.notesZhCn?.length ? (
                          <div className="mt-2">
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">备注</h4>
                            <PortableText value={item.notesZhCn} components={ptComponents} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </div>
            </SectionCard>
          ) : null}

          {/* 常見退件與補件原因 */}
          {doc?.commonRejections?.length ? (
            <SectionCard title="三、常见退件与补件原因" anchor="rejections">
              <div className="space-y-6">
                {doc.commonRejections
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((item, idx) => (
                    <div key={`rej-${idx}`} className="border border-rose-200 rounded-xl overflow-hidden">
                      <div className="bg-rose-50 px-4 py-3">
                        <h3 className="text-base md:text-lg font-semibold text-rose-900">
                          {item.titleZhCn ?? `情形 ${idx + 1}`}
                        </h3>
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
            </SectionCard>
          ) : null}

          {/* 實務建議 */}
          {doc?.practicalTips?.length ? (
            <SectionCard title="四、实务经验与建议" anchor="tips">
              <div className="space-y-6">
                {doc.practicalTips
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((tip, idx) => (
                    <div key={`tip-${idx}`} className="border border-slate-200 rounded-xl p-4 md:p-5 bg-slate-50">
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">
                        {tip.titleZhCn ?? `建议 ${idx + 1}`}
                      </h3>
                      {tip.bodyZhCn?.length ? (
                        <PortableText value={tip.bodyZhCn} components={ptComponents} />
                      ) : null}
                    </div>
                  ))}
              </div>
            </SectionCard>
          ) : null}

          {/* 結語 */}
          {(doc?.conclusionZhCn?.length || doc?.contact?.email || doc?.contact?.lineId) ? (
            <SectionCard title="五、结语" anchor="conclusion">
              {doc?.conclusionZhCn?.length ? (
                <div className="mb-4">
                  <PortableText value={doc.conclusionZhCn} components={ptComponents} />
                </div>
              ) : null}

              {(doc?.contact?.email || doc?.contact?.lineId) ? (
                <div className="mt-4 rounded-xl bg-slate-100 px-4 py-4">
                  <p className="text-slate-800">
                    需要协助？欢迎联系 Taiwan Connect 团队：
                  </p>
                  <ul className="mt-2 text-slate-900 space-y-1">
                    {doc.contact?.email ? (
                      <li>
                        📩 Email：
                        <a className="underline ml-1" href={`mailto:${doc.contact.email}`}>{doc.contact.email}</a>
                      </li>
                    ) : null}
                    {doc.contact?.lineId ? (
                      <li>
                        💬 LINE：<span className="ml-1">{doc.contact.lineId}</span>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
            </SectionCard>
          ) : null}
        </div>
      </main>

      {/* 頁尾 */}
      {/** @ts-ignore Async Server Component */}
      <FooterServer />
    </div>
  );
}
