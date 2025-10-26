// C:\Users\ta893\twconnect2\apps\web\src\app\news\[slug]\page.tsx
// Article detail page with wider layout and brand-blue background

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { PortableText } from "@portabletext/react";
import { sfetch } from "@/lib/sanity/fetch";
import { postBySlugAndLang, type Lang } from "@/lib/queries/news";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = "1200px"; // ✅ 放寬整體內容寬度

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
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(dt);
  } catch {
    return d ?? "";
  }
}

function withLang(href: string, lang: Lang) {
  if (!href.startsWith("/")) return href;
  const hasQuery = href.includes("?");
  return hasQuery ? `${href}&lang=${lang}` : `${href}?lang=${lang}`;
}

function ptComponentsFactory(lang: Lang) {
  return {
    block: {
      h1: ({ children }: any) => <h2 className="mt-10 text-3xl font-semibold text-slate-900">{children}</h2>,
      h2: ({ children }: any) => <h3 className="mt-8 text-2xl font-semibold text-slate-900">{children}</h3>,
      h3: ({ children }: any) => <h4 className="mt-6 text-xl font-semibold text-slate-900">{children}</h4>,
      normal: ({ children }: any) => <p className="mt-5 leading-8 text-slate-800">{children}</p>,
      blockquote: ({ children }: any) => (
        <blockquote className="mt-8 border-l-4 border-slate-300 pl-5 italic text-slate-700">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => <ul className="mt-5 list-disc pl-6 text-slate-800 space-y-1">{children}</ul>,
      number: ({ children }: any) => <ol className="mt-5 list-decimal pl-6 text-slate-800 space-y-1">{children}</ol>,
    },
    marks: {
      link: ({
        value,
        children,
      }: {
        value: { href?: string };
        children: React.ReactNode;
      }) => {
        const hrefRaw = value?.href ?? "#";
        const href = hrefRaw.startsWith("/") ? withLang(hrefRaw, lang) : hrefRaw;
        const isInternal = hrefRaw.startsWith("/");
        return isInternal ? (
          <Link href={href} className="underline underline-offset-2 hover:opacity-90">
            {children}
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:opacity-90">
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: any) => {
        const src = value?.url ?? value?.asset?.url;
        if (!src) return null;
        return (
          <figure className="my-8 overflow-hidden rounded-2xl ring-1 ring-slate-200">
            <Image src={src} alt={value?.alt ?? ""} width={1600} height={900} className="h-auto w-full" />
            {value?.alt && <figcaption className="px-3 py-2 text-xs text-slate-500">{value.alt}</figcaption>}
          </figure>
        );
      },
    },
  } as any;
}

export default async function NewsPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string | string[] } | null>;
}) {
  const sp = await searchParams;
  const { slug } = await params;
  const lang = resolveLang(sp ?? undefined);

  const data = await sfetch<{
    _id?: string;
    title?: string | null;
    excerpt?: string | null;
    body?: any[] | null;
    coverImage?: { url?: string | null; alt?: string | null } | null;
    publishedAt?: string | null;
    readingMinutes?: number | null;
    category?: { title?: string | null; slug?: string | null } | null;
    tags?: Array<{ _id: string; title?: string | null; slug?: string | null }> | null; // ✅ 帶回 _id
    author?: { name?: string | null; title?: string | null; avatar?: string | null; linkedin?: string | null; email?: string | null } | null;
    gallery?: Array<{ url?: string | null; alt?: string | null }> | null;
    related?: Array<{ _id: string; slug?: string | null; title?: string | null; excerpt?: string | null; coverImage?: { url?: string | null; alt?: string | null } | null; publishedAt?: string | null }> | null;
  }>(postBySlugAndLang, { lang, slug });

  if (!data?._id) return notFound();

  const ptComponents = ptComponentsFactory(lang);

  return (
    <div style={{ backgroundColor: BRAND_BLUE }} className="min-h-screen text-white">
      <NavigationServer lang={lang} />

      {/* HERO 區 */}
      <section className="relative">
        {data.coverImage?.url && (
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image src={data.coverImage.url} alt={data.coverImage.alt ?? ""} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C3D5A]/40 via-[#1C3D5A]/80 to-[#1C3D5A]"></div>
          </div>
        )}
        <div className="mx-auto px-6 lg:px-10 pt-10 pb-8" style={{ maxWidth: CONTENT_MAX_W }}>
          <nav className="text-sm/6 text-white/80">
            <Link href={withLang("/news", lang)} className="hover:opacity-90">News</Link>
            <span className="mx-2">/</span>
            {data.category?.title && (
              <>
                <Link href={withLang(`/news?category=${data.category.slug ?? ""}`, lang)} className="hover:opacity-90">
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
              {data.publishedAt && <time dateTime={data.publishedAt}>{formatDate(data.publishedAt, lang)}</time>}
              {typeof data.readingMinutes === "number" && <span>{data.readingMinutes} min read</span>}
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
              <Image src={data.coverImage.url} alt={data.coverImage.alt ?? ""} fill className="object-cover" priority />
            </div>
          )}
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
                        <Image src={g.url} alt={g.alt ?? ""} width={1200} height={800} className="h-auto w-full object-cover" />
                        {g.alt && <figcaption className="px-3 py-2 text-xs text-slate-500">{g.alt}</figcaption>}
                      </figure>
                    ) : null
                  )}
                </div>
              </section>
            )}

            {data.tags && data.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {data.tags.map((t, i) => (
                  <span key={i} className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 bg-slate-50">
                    {t.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 相關文章 */}
        {data.related && data.related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold">Related</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {data.related.map((r) => (
                <article key={r._id} className="rounded-2xl bg-white text-slate-900 ring-1 ring-black/5 overflow-hidden">
                  {r.coverImage?.url && (
                    <div className="relative aspect-[16/9] w-full">
                      <Image src={r.coverImage.url} alt={r.coverImage.alt ?? ""} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold leading-snug">
                      <Link href={withLang(`/news/${r.slug ?? ""}`, lang)} className="hover:underline">
                        {r.title ?? "Untitled"}
                      </Link>
                    </h3>
                    {r.excerpt && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{r.excerpt}</p>}
                    <div className="mt-3">
                      <Link
                        href={withLang(`/news/${r.slug ?? ""}`, lang)}
                        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:opacity-90"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 text-center">
          <Link
            href={withLang("/news", lang)}
            className="inline-flex items-center rounded-md border border-white/40 px-5 py-2.5 text-sm text-white hover:bg-white/10"
          >
            ← Back to News
          </Link>
        </div>
      </article>

      <FooterServer lang={lang} />
    </div>
  );
}
