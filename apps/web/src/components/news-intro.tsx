// apps/web/src/components/news-intro.tsx
import Link from "next/link";
import clsx from "clsx";
import { sfetch } from "@/lib/sanity/fetch";
import { homePostsQuery } from "@/lib/queries/homePosts";

type Lang = "jp" | "zh" | "en";

const copy = {
  jp: {
    title: "News",
    lead1: "最新のニュースやコラムを随時更新中。",
    lead2: "海外進出に役立つ情報や実務のヒントをお届けします。",
    cta: "👉 記事一覧はこちら",
    placeholder: "記事は準備中です。まもなく公開します。",
  },
  zh: {
    title: "News",
    lead1: "我們定期更新最新的新聞與專欄，",
    lead2: "分享海外拓展的實務經驗與市場資訊。",
    cta: "👉 閱讀更多文章",
    placeholder: "內容準備中，敬請期待。",
  },
  en: {
    title: "News",
    lead1: "Stay up to date with our latest news and blog posts.",
    lead2: "We share insights and practical tips for global expansion.",
    cta: "👉 See All Articles",
    placeholder: "No posts yet. Coming soon.",
  },
} as const;

type HomePost = {
  _id: string;
  channel?: "news" | "column";
  publishedAt?: string;
  slug?: string | null;
  title?: string | null;
  coverImage?: {
    asset?: {
      url?: string;
      mimeType?: string;
      metadata?: { dimensions?: { width?: number; height?: number } };
    } | null;
  } | null;
};

/** 與全站一致的分隔線（白色漸層，放在藍底上會清楚可見） */
function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={clsx("h-[2px] w-full opacity-50", className)}
      style={{
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
      }}
      aria-hidden
    />
  );
}

export default async function NewsIntro({
  lang = "en",
  className,
  ctaHref = "#articles",
  emptyBehavior = "hide",
  placeholderText,
  /** 是否在底部輸出分隔線（預設 true） */
  withBottomDivider = true,
}: {
  lang?: Lang;
  className?: string;
  ctaHref?: string;
  /** 沒內容時的行為："hide" 不渲染；"placeholder" 顯示準備中文案 */
  emptyBehavior?: "hide" | "placeholder";
  /** 自訂「準備中」文字（不傳則用內建多語字串） */
  placeholderText?: string;
  withBottomDivider?: boolean;
}) {
  const posts = await sfetch<HomePost[]>(homePostsQuery, { lang });
  const t = copy[lang];

  // ==== 沒內容：依設定決定隱藏或顯示 placeholder ====
  if (!posts || posts.length === 0) {
    if (emptyBehavior === "hide") return null;
    return (
      <section
        className={clsx(
          "relative w-full overflow-hidden text-white py-16 md:py-20",
          className
        )}
        style={{ backgroundColor: "#1C3D5A" }}
      >
        {/* decorative curve */}
        <svg
          className="pointer-events-none absolute -top-10 -right-10 h-[420px] w-[820px] opacity-20"
          viewBox="0 0 1440 720"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="newsCurve" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M 120 550 C 960 500, 1150 220, 1320 160"
            stroke="url(#newsCurve)"
            strokeWidth="48"
            strokeLinecap="round"
          />
        </svg>

        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {t.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-95">
            {placeholderText ?? t.placeholder}
          </p>
          <div className="mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-lg px-5 py-3 font-medium text-white transition-colors"
              style={{ backgroundColor: "#1f2454", color: "#FFFFFF" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#2b3068";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1f2454";
              }}
            >
              {t.cta}
            </Link>
          </div>
        </div>

        {/* 底部分隔線：外層加 pt-2 防止 margin 折疊，被白底覆蓋 */}
        {withBottomDivider && (
          <div className="pt-2">
            <Divider className="m-0" />
          </div>
        )}
      </section>
    );
  }

  // ==== 有內容：顯示原有版面並在底部輸出分隔線 ====
  return (
    <section
      className={clsx(
        "relative w-full overflow-hidden text-white py-16 md:py-20",
        className
      )}
      style={{ backgroundColor: "#1C3D5A" }}
    >
      {/* decorative curve */}
      <svg
        className="pointer-events-none absolute -top-10 -right-10 h-[420px] w-[820px] opacity-20"
        viewBox="0 0 1440 720"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="newsCurve" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d="M 120 550 C 960 500, 1150 220, 1320 160"
          stroke="url(#newsCurve)"
          strokeWidth="48"
          strokeLinecap="round"
        />
      </svg>

      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          {copy[lang].title}
        </h1>
        <p className="mt-6 text-lg md:text-xl opacity-95">{copy[lang].lead1}</p>
        <p className="mt-1 text-lg md:text-xl opacity-95">{copy[lang].lead2}</p>

        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center rounded-lg px-5 py-3 font-medium text-white transition-colors"
            style={{ backgroundColor: "#1f2454", color: "#FFFFFF" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#2b3068";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1f2454";
            }}
          >
            {copy[lang].cta}
          </Link>
        </div>
      </div>

      {/* 底部分隔線：外層加 pt-2 防止 margin 折疊 */}
      {withBottomDivider && (
        <div className="pt-2">
          <Divider className="m-0" />
        </div>
      )}
    </section>
  );
}
