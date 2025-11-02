// File: apps/web/src/app/cn-investment-whitelist/page.tsx

import React from "react";
import type { JSX } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentWhitelistQuery } from "@/lib/queries/cnInvestmentWhitelist.groq";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = "900px";

/* ============================ Types ============================ */
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

/* ============================ Components ============================ */
// 包裝 Server Component 避免 TS2786
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ Page ============================ */
export default async function Page() {
  const data = (await sfetch(cnInvestmentWhitelistQuery)) as WhitelistDoc | null;
  if (!data) notFound();

  const doc = data;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND_BLUE }}>
      <Nav lang="zh" />

      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center items-center text-center text-white px-6">
        {doc.heroImage?.url && (
          <Image
            src={doc.heroImage.url}
            alt={doc.heroImage.alt || "陆资白名单指南"}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        )}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold mb-3">{doc.heroTitleZhCn}</h1>
          {doc.heroSubtitleZhCn && (
            <p className="text-lg opacity-90">{doc.heroSubtitleZhCn}</p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow text-white px-6 py-12 flex justify-center">
        <div className="w-full space-y-12 leading-relaxed" style={{ maxWidth: CONTENT_MAX_W }}>
          {doc.introZhCn && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">一、白名单制度简介</h2>
              <PortableText value={doc.introZhCn} />
            </section>
          )}

          {doc.policyBackgroundZhCn && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">二、政策背景</h2>
              <PortableText value={doc.policyBackgroundZhCn} />
            </section>
          )}

          {Array.isArray(doc.categories) && doc.categories.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">三、适用类别与政策要点</h2>
              <div className="space-y-10">
                {doc.categories.map((cat, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/10 border border-white/15 p-6"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {cat.titleZhCn ?? `类别 ${i + 1}`}
                    </h3>
                    {cat.introZhCn && (
                      <div className="mb-4">
                        <PortableText value={cat.introZhCn} />
                      </div>
                    )}
                    {Array.isArray(cat.policyItems) && cat.policyItems.length > 0 && (
                      <div className="space-y-4">
                        {cat.policyItems.map((item, j) => (
                          <div key={j}>
                            {item.titleZhCn && (
                              <h4 className="font-semibold mb-1">{item.titleZhCn}</h4>
                            )}
                            {item.bodyZhCn && <PortableText value={item.bodyZhCn} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
      </main>

      <Footer lang="zh" />
    </div>
  );
}
