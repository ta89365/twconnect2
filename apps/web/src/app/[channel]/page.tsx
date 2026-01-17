// File: apps/web/src/app/[channel]/page.tsx
// Single template for both /news and /column entrances

import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { sfetch } from "@/lib/sanity/fetch";
import { newsEntranceByLang, type Lang } from "@/lib/queries/news";
import { columnEntranceByLang } from "@/lib/queries/column";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type Channel = "news" | "column";
function isChannel(v: string): v is Channel {
  return v === "news" || v === "column";
}

const BRAND_BLUE = "#1C3D5A";
const TUNE = {
  contentMaxW: "1200px",
  heroMinH: "56vh",
  heroOverlay:
    "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0.30) 100%)",
} as const;

/* ============================ 多語 ============================ */
function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().trim().toLowerCase();

  // ✅ 與 LanguageSwitcher 對齊：zh-cn 一律視為 zh
  if (s === "zh-cn" || s === "zh_cn" || s === "zh-hans" || s === "hans" || s === "cn") return "zh";

  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "jp";
}

/**
 * ✅ 覆蓋 lang
 * ✅ 保留 query
 * ✅ 保留 hash
 */
function withLang(href: string, lang: Lang) {
  if (!href.startsWith("/")) return href;

  const [beforeHash, hash = ""] = href.split("#");
  const [path, qs = ""] = beforeHash.split("?");
  const params = new URLSearchParams(qs);
  params.set("lang", lang);

  const nextQs = params.toString();
  const out = nextQs ? `${path}?${nextQs}` : path;
  return hash ? `${out}#${hash}` : out;
}

function dict(channel: Channel, lang: Lang) {
  if (channel === "news") {
    if (lang === "jp")
      return {
        breadcrumb: "ホーム / ニュース",
        title: "ニュース・コラム",
        subtitle:
          "台湾進出の最新制度や会計・税務、在留、M&Aの視点から実務に効くインサイトを発信します",
        quickNav: "注目トピック",
        searchPH: "キーワードで検索",
        readMore: "続きを読む",
        empty: "まだ記事はありません。まもなく公開します。",
      };
    if (lang === "zh")
      return {
        breadcrumb: "首頁 / 新聞",
        title: "新聞",
        subtitle:
          "從制度變動、會計稅務、簽證居留與跨境交易等面向，分享實務觀點與最新解讀",
        quickNav: "主題快速定位",
        searchPH: "輸入關鍵字搜尋",
        readMore: "閱讀更多",
        empty: "目前尚無文章，敬請期待",
      };
    return {
      breadcrumb: "Home / News",
      title: "News and Ideas",
      subtitle:
        "Insights you can apply to Taiwan market entry accounting tax visas and cross border transactions",
      quickNav: "Quick topics",
      searchPH: "Search keywords",
      readMore: "Read more",
      empty: "No posts yet. Coming soon.",
    };
  }

  if (lang === "jp")
    return {
      breadcrumb: "ホーム / コラム",
      title: "コラム",
      subtitle: "台湾進出や会計・税務などの実務コラムを発信します",
      quickNav: "注目トピック",
      searchPH: "キーワードで検索",
      readMore: "続きを読む",
      empty: "まだ記事はありません。まもなく公開します。",
    };
  if (lang === "zh")
    return {
      breadcrumb: "首頁 / 專欄",
      title: "專欄",
      subtitle: "分享台灣市場與實務觀點的深度專欄內容",
      quickNav: "主題快速定位",
      searchPH: "輸入關鍵字搜尋",
      readMore: "閱讀更多",
      empty: "目前尚無文章，敬請期待",
    };
  return {
    breadcrumb: "Home / Column",
    title: "Column",
    subtitle: "Deeper ideas about Taiwan market entry and operations",
    quickNav: "Quick topics",
    searchPH: "Search keywords",
    readMore: "Read more",
    empty: "No posts yet. Coming soon.",
  };
}

type EntranceData = {
  posts: any[];
  settings?: {
    heroImage?: {
      url?: string;
      alt?: string;
      lqip?: string;
      hotspot?: { x?: number; y?: number };
    };
    heroTitle?: string;
    heroSubtitle?: string;
    quickTopics?: { title?: string; slug?: string }[];
  };
};

function objPosFromHotspot(hs?: { x?: number; y?: number }) {
  if (!hs || typeof hs.x !== "number" || typeof hs.y !== "number") return "50% 50%";
  return `${Math.round(hs.x * 100)}% ${Math.round(hs.y * 100)}%`;
}

/* ============================ Page ============================ */
export default async function ChannelEntrancePage({
  params,
  searchParams,
}: {
  params: Promise<{ channel: string }>;
  searchParams?: Promise<{ lang?: string | string[] } | null>;
}) {
  const { channel } = await params;
  if (!isChannel(channel)) return notFound();

  const sp = await searchParams;
  const lang = resolveLang(sp ?? undefined);
  const t = dict(channel, lang);
  const basePath = `/${channel}` as "/news" | "/column";

  const query = channel === "news" ? newsEntranceByLang : columnEntranceByLang;
  const data = await sfetch<EntranceData>(query, { lang, limit: 24 });

  const posts: any[] = data?.posts ?? [];
  const settings = data?.settings ?? {};
  const heroImg = settings?.heroImage;

  const [featured, ...rest] = posts;

  const contactLabel =
    lang === "jp" ? "お問い合わせはこちら" : lang === "zh" ? "Contact Us 聯絡我們" : "Contact Us";

  return (
    <div style={{ backgroundColor: BRAND_BLUE }} className="min-h-screen text-white">
      <NavigationServer lang={lang} />

      <section className="relative w-full overflow-hidden" style={{ minHeight: TUNE.heroMinH }}>
        {!!heroImg?.url && (
          <Image
            src={heroImg.url}
            alt={heroImg.alt || `${channel} hero`}
            fill
            priority
            sizes="100vw"
            className="pointer-events-none select-none object-cover filter saturate-50 contrast-95 brightness-95"
            style={{ objectPosition: objPosFromHotspot(heroImg.hotspot) }}
            placeholder={heroImg.lqip ? "blur" : "empty"}
            blurDataURL={heroImg.lqip}
          />
        )}
        <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: BRAND_BLUE, opacity: 0.18 }} />
        <div className="absolute inset-0 bg-black/18" />
        <div className="absolute inset-0" style={{ background: TUNE.heroOverlay }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[rgba(28,61,90,0.22)]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ maxWidth: TUNE.contentMaxW }}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm/6 tracking-wide text-white/85">{t.breadcrumb}</p>
              <h1 className="mt-2 text-4xl font-semibold sm:text-5xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                {(settings as any)?.heroTitle ?? t.title}
              </h1>
              <p className="mt-3 text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                {(settings as any)?.heroSubtitle ?? t.subtitle}
              </p>

              {Array.isArray((settings as any)?.quickTopics) && (settings as any).quickTopics.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {(settings as any).quickTopics.map((topic: any) => (
                    <a
                      key={topic.slug}
                      href={`#tag-${topic.slug}`}
                      className="shrink-0 inline-flex items-center rounded-full border border-white/50 bg-white/30 backdrop-blur-[2px] px-3 py-2 text-sm text-white hover:bg-white/40 transition"
                    >
                      {topic.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="h-10 sm:h-12 lg:h-14" />

      {featured && (
        <section className="relative">
          <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pb-6" style={{ maxWidth: TUNE.contentMaxW }}>
            <FeaturedCard post={featured} lang={lang} readMoreLabel={t.readMore} basePath={basePath} />
          </div>
        </section>
      )}

      <section className="relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.00))" }}
        />
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14" style={{ maxWidth: TUNE.contentMaxW }}>
          {rest.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p: any) => (
                <ArticleCard
                  key={p._id}
                  slug={p.slug}
                  tag={p.category?.title ?? ""}
                  tagSlug={p.category?.slug ?? ""}
                  title={p.title ?? ""}
                  excerpt={p.excerpt ?? ""}
                  coverUrl={p.coverImage?.url ?? ""}
                  authorName={p.author?.name ?? ""}
                  tags={p.tags ?? []}
                  lang={lang}
                  readMoreLabel={t.readMore}
                  basePath={basePath}
                />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-white/90">{t.empty}</p>
          )}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: TUNE.contentMaxW }}>
          <div className="py-10 md:py-14 text-center">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              {(settings as any)?.heroSubtitle ?? t.subtitle}
            </h3>

            <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Link
                href={withLang("/contact", lang)}
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold bg-white hover:bg-white/90"
                style={{ color: BRAND_BLUE, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
              >
                {contactLabel}
              </Link>

              <a
                href="mailto:info@twconnects.com"
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              >
                info@twconnects.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterServer lang={lang} />
    </div>
  );
}

/* ============================ Featured 主打卡 ============================ */
function FeaturedCard({
  post,
  lang,
  readMoreLabel,
  basePath,
}: {
  post: any;
  lang: Lang;
  readMoreLabel: string;
  basePath: "/news" | "/column";
}) {
  const coverUrl = post?.coverImage?.url as string | undefined;
  return (
    <article className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/[0.04] backdrop-blur-sm">
      <div className="grid gap-0 md:grid-cols-5">
        <div className="relative md:col-span-3 aspect-[16/10] md:aspect-auto md:h-full">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={post?.title ?? "cover"}
              width={1200}
              height={800}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full bg-white/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          {post?.category?.title && (
            <span className="absolute left-3 top-3 inline-flex rounded-full bg-black/50 px-3 py-1 text-xs text-white ring-1 ring-white/20">
              {post.category.title}
            </span>
          )}
        </div>

        <div className="md:col-span-2 p-6 md:p-7 flex flex-col">
          <h3 className="text-2xl font-semibold leading-snug">
            <Link href={withLang(`${basePath}/${post.slug}`, lang)} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          {post?.excerpt && <p className="mt-3 text-white/90 line-clamp-4">{post.excerpt}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
            {post?.author?.name && <span>👤 {post.author.name}</span>}
            {Array.isArray(post?.tags) && post.tags.length > 0 && (
              <span>🏷️ {post.tags.map((t: any) => t?.title).filter(Boolean).join(", ")}</span>
            )}
          </div>
          <div className="mt-6">
            <Link
              href={withLang(`${basePath}/${post.slug}`, lang)}
              className="inline-flex items-center rounded-lg bg-white text-slate-900 text-sm px-3 py-2 hover:opacity-90"
            >
              {readMoreLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================ 元件：文章卡 ============================ */
function ArticleCard({
  slug,
  tag,
  tagSlug,
  title,
  excerpt,
  coverUrl,
  authorName,
  tags,
  lang,
  readMoreLabel,
  basePath,
}: {
  slug: string;
  tag: string;
  tagSlug?: string;
  title: string;
  excerpt: string;
  coverUrl?: string;
  authorName?: string;
  tags?: { title?: string }[];
  lang: Lang;
  readMoreLabel: string;
  basePath: "/news" | "/column";
}) {
  const anchorId = tagSlug ? `tag-${tagSlug}` : undefined;
  return (
    <article
      id={anchorId}
      className="group relative flex flex-col rounded-2xl bg-white text-slate-900 shadow-sm ring-1 ring-black/5 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {coverUrl ? (
        <div className="relative aspect-[16/9] w-full">
          <Image src={coverUrl} alt={title} width={800} height={450} className="object-cover w-full h-full" />
          {tag && (
            <span className="absolute left-3 top-3 inline-flex rounded-full bg-black/65 px-2.5 py-1 text-xs text-white">
              {tag}
            </span>
          )}
        </div>
      ) : (
        <div className="relative aspect-[16/9] w-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
          Cover image
        </div>
      )}

      <div className="flex-1 p-5">
        <h3 className="text-lg font-semibold leading-snug line-clamp-2 group-hover:underline">
          <Link href={withLang(`${basePath}/${slug}`, lang)}>{title}</Link>
        </h3>
        {excerpt && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{excerpt}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {authorName && <span>👤 {authorName}</span>}
          {tags && tags.length > 0 && <span>🏷️ {tags.map((t) => t.title).join(", ")}</span>}
        </div>
      </div>

      <div className="px-5 pb-5">
        <Link
          href={withLang(`${basePath}/${slug}`, lang)}
          className="inline-flex items-center rounded-lg bg-slate-900 text-white text-sm px-3 py-2 hover:opacity-90"
        >
          {readMoreLabel}
        </Link>
      </div>
    </article>
  );
}
