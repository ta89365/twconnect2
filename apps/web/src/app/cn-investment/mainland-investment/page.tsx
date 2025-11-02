// File: apps/web/src/app/cn-investment/mainland-investment/page.tsx
import React from "react";
import type { JSX } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextComponents } from "@portabletext/react";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import {
  mainlandInvestmentGuideEntrance,
  mainlandInvestmentGuideBySlug,
} from "@/lib/queries/mainlandInvestmentGuide";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = "1100px";
const HERO_MIN_H = "48vh";
const HERO_OVERLAY =
  "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.40) 100%)";

/* ========================== Types ========================== */
type Section = {
  heading?: string;
  content?: PortableTextBlock[];
  tips?: PortableTextBlock[];
};

type Article = {
  id: string;
  slug: string;
  publishDate?: string;
  title: string;
  subtitle?: string;
  intro?: PortableTextBlock[];
  heroImage?: {
    url?: string;
    alt?: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
  sections?: Section[];
  conclusion?: PortableTextBlock[];
  contactEmail?: string;
  contactLine?: string;
};

type EntranceItem = {
  id: string;
  slug: string;
};

/* ====================== Helpers & Components ====================== */
function fmtDate(d?: string) {
  if (!d) return "";
  const dd = new Date(d);
  if (isNaN(dd.getTime())) return "";
  return `${dd.getFullYear()}/${String(dd.getMonth() + 1).padStart(2, "0")}/${String(
    dd.getDate()
  ).padStart(2, "0")}`;
}

// 正確型別的 Portable Text components（符合 @portabletext/react v4）
const ptComponents: PortableTextComponents = {
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
  },
  block: {
    normal: ({ children }) => <p className="leading-7">{children}</p>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="opacity-90">{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      return (
        <a href={href} target="_blank" rel="noreferrer" className="underline">
          {children}
        </a>
      );
    },
  },
};

// 用型別斷言包裝 async Server Component，避免使用 @ts-expect-error
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ Page ============================ */
export default async function Page(): Promise<JSX.Element> {
  // 先拿最新一筆的 slug
  const entrance = (await sfetch(mainlandInvestmentGuideEntrance, {
    limit: 1,
  })) as EntranceItem[];
  const latest = entrance?.[0];
  if (!latest?.slug) {
    notFound();
  }

  // 讀取單篇內容
  const doc = (await sfetch(mainlandInvestmentGuideBySlug, {
    slug: latest.slug,
  })) as Article | null;

  if (!doc?.id) {
    notFound();
  }

  const heroUrl = doc?.heroImage?.url ?? "";
  const heroAlt = doc?.heroImage?.alt ?? "";

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE, color: "white" }}>
      <Nav />

      {/* Hero */}
      <section
        className="relative w-full"
        style={{
          minHeight: HERO_MIN_H,
          background:
            heroUrl.length > 0
              ? `${HERO_OVERLAY}, url(${heroUrl}) center/cover no-repeat`
              : BRAND_BLUE,
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: CONTENT_MAX_W }}>
          <div className="pt-24 pb-10">
            <div className="text-xs opacity-85">{fmtDate(doc?.publishDate)}</div>
            <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">
              {doc?.title}
            </h1>
            {doc?.subtitle && (
              <p className="mt-3 text-base md:text-lg opacity-90">{doc.subtitle}</p>
            )}
          </div>
        </div>
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={heroAlt || doc.title}
            fill
            className="opacity-0"
            priority
            sizes="100vw"
          />
        )}
      </section>

      {/* Body */}
      <main className="mx-auto px-6 pb-24" style={{ maxWidth: CONTENT_MAX_W }}>
        {/* Intro */}
        {doc?.intro?.length ? (
          <div className="prose prose-invert max-w-none mt-10">
            <PortableText value={doc.intro} components={ptComponents} />
          </div>
        ) : null}

        {/* Sections */}
        <div className="mt-10 space-y-10">
          {(doc?.sections ?? []).map((sec, idx) => (
            <section
              key={`sec-${idx}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              {sec.heading ? (
                <h2 className="text-2xl font-semibold mb-3">{sec.heading}</h2>
              ) : null}
              {sec.content?.length ? (
                <div className="prose prose-invert max-w-none">
                  <PortableText value={sec.content} components={ptComponents} />
                </div>
              ) : null}
              {sec.tips?.length ? (
                <div className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-400/10 p-4">
                  <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
                    實務建議
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <PortableText value={sec.tips} components={ptComponents} />
                  </div>
                </div>
              ) : null}
            </section>
          ))}
        </div>

        {/* Conclusion */}
        {doc?.conclusion?.length ? (
          <div className="prose prose-invert max-w-none mt-12">
            <PortableText value={doc.conclusion} components={ptComponents} />
          </div>
        ) : null}

        {/* Contact */}
        {(doc?.contactEmail || doc?.contactLine) && (
          <div className="mt-12 rounded-2xl bg-white/8 border border-white/15 p-6">
            <h3 className="text-xl font-semibold">聯絡我們</h3>
            <div className="mt-2 text-sm opacity-95">
              {doc.contactEmail ? (
                <div>
                  Email：{" "}
                  <a className="underline" href={`mailto:${doc.contactEmail}`}>
                    {doc.contactEmail}
                  </a>
                </div>
              ) : null}
              {doc.contactLine ? <div>LINE： {doc.contactLine}</div> : null}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
