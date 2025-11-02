// File: apps/web/src/app/cn-investment/cn-investment-ubo-guide/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentUboGuideQuery } from "@/lib/queries/cnInvestmentUboGuide.groq";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { PortableText } from "@portabletext/react";
import React from "react";
import type { JSX } from "react";               // ✅ 修正重點：加入 JSX 型別
import type { TypedObject } from "@portabletext/types";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = "900px";

/* ============================ Types ============================ */
type PT = TypedObject[];

interface UboExample {
  titleZhCn?: string;
  scenarioZhCn?: PT;
  conclusionZhCn?: PT;
}

interface UboAdvice {
  labelZhCn?: string;
  bodyZhCn?: PT;
}

interface UboContact {
  email?: string;
  lineId?: string;
  contactNoteZhCn?: PT;
}

interface UboHeroImage {
  assetId?: string;
  url?: string;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
  dimensions?: { width: number; height: number; aspectRatio: number };
  lqip?: string;
}

interface UboGuideDoc {
  _id: string;
  slug?: string;
  heroTitleZhCn?: string;
  heroSubtitleZhCn?: string;
  heroImage?: UboHeroImage;

  importanceZhCn?: PT;
  legalBasisZhCn?: PT;
  ownershipThresholdZhCn?: PT;
  controlCriteriaZhCn?: PT;
  layeredCalculationZhCn?: PT;
  uboFocusZhCn?: PT;

  examples?: UboExample[];
  practicalAdvice?: UboAdvice[];
  conclusionZhCn?: PT;

  contact?: UboContact;

  lastUpdatedAt?: string;
  meta?: { isDraft?: boolean; seoDescription?: string };
}

type QueryResult = { doc: UboGuideDoc | null };

/* 用型別斷言包裝 async Server Component，避免 TS2786 */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ Page ============================ */
export default async function Page() {
  const data = (await sfetch(cnInvestmentUboGuideQuery)) as QueryResult;
  const doc = data?.doc;
  if (!doc) notFound();

  const hero = doc.heroImage;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND_BLUE }}>
      <Nav lang="zh" />

      <section className="relative w-full min-h-[60vh] flex flex-col justify-center items-center text-center text-white px-6">
        {hero?.url && (
          <Image
            src={hero.url}
            alt={hero.alt || "UBO 判定指南"}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        )}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold mb-3">{doc.heroTitleZhCn}</h1>
          {doc.heroSubtitleZhCn ? (
            <p className="text-lg opacity-90">{doc.heroSubtitleZhCn}</p>
          ) : null}
        </div>
      </section>

      <main className="flex-grow text-white px-6 py-12 flex justify-center">
        <div className="w-full" style={{ maxWidth: CONTENT_MAX_W }}>
          <div className="space-y-12 leading-relaxed">
            {doc.importanceZhCn && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">一、为何「陆资身份判定」如此重要</h2>
                <PortableText value={doc.importanceZhCn} />
              </section>
            )}

            {doc.legalBasisZhCn && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">二、法规依据</h2>
                <PortableText value={doc.legalBasisZhCn} />
              </section>
            )}

            {(doc.ownershipThresholdZhCn || doc.controlCriteriaZhCn) && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">三、持股比例与控制能力标准</h2>
                {doc.ownershipThresholdZhCn && <PortableText value={doc.ownershipThresholdZhCn} />}
                {doc.controlCriteriaZhCn && <PortableText value={doc.controlCriteriaZhCn} />}
              </section>
            )}

            {(doc.layeredCalculationZhCn || doc.uboFocusZhCn) && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">四、计算方式与 UBO 焦点</h2>
                {doc.layeredCalculationZhCn && <PortableText value={doc.layeredCalculationZhCn} />}
                {doc.uboFocusZhCn && <PortableText value={doc.uboFocusZhCn} />}
              </section>
            )}

            {Array.isArray(doc.examples) && doc.examples.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">五、常见判定示例</h2>
                <div className="space-y-8">
                  {doc.examples.map((ex, i) => (
                    <div key={i} className="bg-white/10 p-4 rounded-lg">
                      {ex.titleZhCn && <h3 className="text-xl font-semibold mb-2">{ex.titleZhCn}</h3>}
                      {ex.scenarioZhCn && <PortableText value={ex.scenarioZhCn} />}
                      {ex.conclusionZhCn && (
                        <div className="mt-2 text-sm opacity-90">
                          <PortableText value={ex.conclusionZhCn} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {Array.isArray(doc.practicalAdvice) && doc.practicalAdvice.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">六、实务建议</h2>
                <div className="space-y-6">
                  {doc.practicalAdvice.map((p, i) => (
                    <div key={i}>
                      {p.labelZhCn && <h3 className="text-lg font-semibold mb-2">{p.labelZhCn}</h3>}
                      {p.bodyZhCn && <PortableText value={p.bodyZhCn} />}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {doc.conclusionZhCn && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">七、结语</h2>
                <PortableText value={doc.conclusionZhCn} />
              </section>
            )}

            {doc.contact && (doc.contact.email || doc.contact.lineId || doc.contact.contactNoteZhCn) && (
              <section className="border-t border-white/20 pt-8">
                <h2 className="text-2xl font-semibold mb-4">📩 联系我们</h2>
                {doc.contact.email && (
                  <p>
                    Email：
                    <a href={`mailto:${doc.contact.email}`} className="underline">
                      {doc.contact.email}
                    </a>
                  </p>
                )}
                {doc.contact.lineId && (
                  <p>
                    LINE：<span className="font-mono">{doc.contact.lineId}</span>
                  </p>
                )}
                {doc.contact.contactNoteZhCn && (
                  <div className="mt-3">
                    <PortableText value={doc.contact.contactNoteZhCn} />
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer lang="zh" />
    </div>
  );
}
