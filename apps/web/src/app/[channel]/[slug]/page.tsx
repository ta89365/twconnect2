// File: apps/web/src/app/[channel]/[slug]/page.tsx
// Single template for both /news/[slug] and /column/[slug]

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as React from "react";
import type { JSX } from "react"; // ✅ add this line
import { PortableText } from "@portabletext/react";
import { sfetch } from "@/lib/sanity/fetch";
import { postBySlugAndLang, type Lang } from "@/lib/queries/news";
import { columnPostBySlugAndLang } from "@/lib/queries/column";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type Channel = "news" | "column";
function isChannel(v: string): v is Channel {
  return v === "news" || v === "column";
}

const BRAND_BLUE = "#1C3D5A";
const ACCENT_BLUE = "#4A90E2"; // ✅ 內卡 CTA 主要按鈕底色
const CONTENT_MAX_W = "1200px";

/* ============================ 多語與工具 ============================ */
function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "jp";
}

function formatDate(d?: string | null, lang: Lang = "jp") {
  if (!d) return "";
  try {
    const dt = new Date(d);
    const locale = lang === "jp" ? "ja-JP" : lang === "zh" ? "zh-TW" : "en-US";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dt);
  } catch {
    return d ?? "";
  }
}

function withLang(href: string, lang: Lang) {
  if (!href.startsWith("/")) return href;
  return href.includes("?") ? `${href}&lang=${lang}` : `${href}?lang=${lang}`;
}

function ptComponentsFactory(lang: Lang) {
  const C = {
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="mt-10 text-3xl font-semibold text-slate-900">{children}</h2>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="mt-8 text-2xl font-semibold text-slate-900">{children}</h3>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="mt-6 text-xl font-semibold text-slate-900">{children}</h4>
      ),
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="mt-5 leading-8 text-slate-800">{children}</p>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="mt-8 border-l-4 border-slate-300 pl-5 italic text-slate-700">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mt-5 list-disc pl-6 text-slate-800 space-y-1">{children}</ul>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mt-5 list-decimal pl-6 text-slate-800 space-y-1">{children}</ol>
      ),
    },
    marks: {
      link: ({
        value,
        children,
      }: {
        value: { href?: string };
        children?: any;
      }) => {
        const hrefRaw = value?.href ?? "#";
        const href = hrefRaw.startsWith("/") ? withLang(hrefRaw, lang) : hrefRaw;
        const isInternal = hrefRaw.startsWith("/");
        return isInternal ? (
          <Link href={href} className="underline underline-offset-2 hover:opacity-90">
            {children as any}
          </Link>
        ) : (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:opacity-90"
          >
            {children as any}
          </a>
        );
      },
    },

    types: {
      image: ({ value }: { value?: any }) => {
        const src = value?.url ?? value?.asset?.url;
        if (!src) return null;
        return (
          <figure className="my-8 overflow-hidden rounded-2xl ring-1 ring-slate-200">
            <Image
              src={src}
              alt={value?.alt ?? ""}
              width={1600}
              height={900}
              className="h-auto w-full"
            />
            {value?.alt && (
              <figcaption className="px-3 py-2 text-xs text-slate-500">
                {value.alt}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };
  return C as any;
}

/* ============================ Page ============================ */
export default async function ChannelPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ channel: string; slug: string }>;
  searchParams?: Promise<{ lang?: string | string[] } | null>;
}): Promise<JSX.Element> {
  const { channel, slug } = await params;
  if (!isChannel(channel)) return notFound();

  const sp = await searchParams;
  const lang = resolveLang(sp ?? undefined);
  const basePath = `/${channel}` as "/news" | "/column";

  // 根據 channel 選用固定查詢（避免 $channel）
  const query = channel === "news" ? postBySlugAndLang : columnPostBySlugAndLang;

  const data = await sfetch<{
    _id?: string;
    title?: string | null;
    excerpt?: string | null;
    body?: any[] | null;
    coverImage?: { url?: string | null; alt?: string | null } | null;
    publishedAt?: string | null;
    readingMinutes?: number | null;
    category?: { title?: string | null; slug?: string | null } | null;
    tags?: Array<{ _id: string; title?: string | null; slug?: string | null }> | null;
    author?: {
      name?: string | null;
      title?: string | null;
      avatar?: string | null;
      linkedin?: string | null;
      email?: string | null;
    } | null;
    gallery?: Array<{ url?: string | null; alt?: string | null }> | null;
  }>(query, { lang, slug });

  if (!data?._id) return notFound();
  const ptComponents = ptComponentsFactory(lang);

  // 麵包屑標題
  const crumbLabel = channel === "news" ? "News" : "Column";

  // 內卡 CTA 語系字串（移入白框內）
  const ctaHeading =
    lang === "jp"
      ? "安心して世界へ、一歩ずつ確実に"
      : lang === "zh"
      ? "穩健支援，安心邁向國際舞台"
      : "Steady support for your global journey";
  const ctaPrimary =
    lang === "jp" ? "お問い合わせはこちら" : lang === "zh" ? "Contact Us 聯絡我們" : "Contact Us";

  return (
    <div style={{ backgroundColor: BRAND_BLUE }} className="min-h-screen text-white">
      <NavigationServer lang={lang} />

      {/* HERO 區 */}
      <section className="relative">
        {data.coverImage?.url && (
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image
              src={data.coverImage.url}
              alt={data.coverImage.alt ?? ""}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C3D5A]/40 via-[#1C3D5A]/80 to-[#1C3D5A]" />
          </div>
        )}
        <div className="mx-auto px-6 lg:px-10 pt-10 pb-8" style={{ maxWidth: CONTENT_MAX_W }}>
          <nav className="text-sm/6 text-white/80">
            <Link href={withLang(basePath, lang)} className="hover:opacity-90">
              {crumbLabel}
            </Link>
            <span className="mx-2">/</span>
            {data.category?.title && (
              <>
                <Link
                  href={withLang(`${basePath}?category=${data.category.slug ?? ""}`, lang)}
                  className="hover:opacity-90"
                >
                  {data.category.title}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-white/90">{data.title ?? "Article"}</span>
          </nav>

          <header className="mt-5">
            <h1 className="text-4xl font-semibold tracking-tight">{data.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/85 text-sm">
              {data.publishedAt && (
                <time dateTime={data.publishedAt}>{formatDate(data.publishedAt, lang)}</time>
              )}
              {typeof data.readingMinutes === "number" && (
                <span>{data.readingMinutes} min read</span>
              )}
              {data.category?.title && <span>· {data.category.title}</span>}
            </div>
          </header>
        </div>
      </section>

      {/* 主體內容 */}
      <article className="mx-auto px-6 lg:px-10 pb-16" style={{ maxWidth: CONTENT_MAX_W }}>
        <div className="rounded-2xl bg-white text-slate-900 shadow-xl ring-1 ring-black/5 overflow-hidden">
          {data.coverImage?.url && (
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={data.coverImage.url}
                alt={data.coverImage.alt ?? ""}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 內容區 */}
          <div className="p-8 sm:p-10">
            <section>
              {Array.isArray(data.body) && data.body.length > 0 ? (
                <PortableText value={data.body} components={ptComponents} />
              ) : (
                <p className="text-slate-700">Content coming soon.</p>
              )}
            </section>

            {data.gallery && data.gallery.length > 0 && (
              <section className="mt-10">
                <h2 className="text-lg font-semibold">Gallery</h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {data.gallery.map((g, i) =>
                    g?.url ? (
                      <figure key={i} className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                        <Image
                          src={g.url}
                          alt={g.alt ?? ""}
                          width={1200}
                          height={800}
                          className="h-auto w-full object-cover"
                        />
                        {g.alt && (
                          <figcaption className="px-3 py-2 text-xs text-slate-500">
                            {g.alt}
                          </figcaption>
                        )}
                      </figure>
                    ) : null
                  )}
                </div>
              </section>
            )}

            {data.tags && data.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {data.tags.map((t, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 bg-slate-50"
                  >
                    {t.title}
                  </span>
                ))}
              </div>
            )}

            {/* ============================ 內卡 CTA（搬進白色卡片底部） ============================ */}
            <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="rounded-xl bg-slate-50 px-6 py-7 sm:px-8 sm:py-8 ring-1 ring-slate-200">
                <h3 className="text-slate-900 text-lg sm:text-xl font-semibold tracking-tight text-center">
                  {ctaHeading}
                </h3>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                  <Link
                    href={withLang("/contact", lang)}
                    className="inline-flex items-center justify-center rounded-lg px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white hover:opacity-95"
                    style={{ backgroundColor: ACCENT_BLUE, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
                  >
                    {ctaPrimary}
                  </Link>

                  <a
                    href="mailto:info@twconnects.com"
                    className="inline-flex items-center justify-center rounded-lg px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-slate-800 hover:bg-white"
                    style={{
                      border: "1px solid rgba(15,23,42,0.15)",
                      backgroundColor: "rgba(255,255,255,0.9)",
                    }}
                  >
                    info@twconnects.com
                  </a>
                </div>
              </div>

              {/* 回列表 */}
              <div className="mt-10 text-center">
                <Link
                  href={withLang(basePath, lang)}
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  ← Back to {crumbLabel}
                </Link>
              </div>
            </div>
            {/* ============================ /內卡 CTA ============================ */}
          </div>
        </div>
      </article>

      {/* 🔁 外層原 Pre-Footer CTA 已移除，避免重複出現 */}
      <FooterServer lang={lang} />
    </div>
  );
}
