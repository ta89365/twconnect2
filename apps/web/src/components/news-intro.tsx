// apps/web/src/components/news-intro.tsx 
import Link from "next/link";
import clsx from "clsx";

type Lang = "jp" | "zh" | "en";

const copy = {
  jp: {
    title: "News",
    lead1: "最新のニュースやコラムを随時更新中。",
    lead2: "海外進出に役立つ情報や実務のヒントをお届けします。",
    cta: "👉 記事一覧はこちら",
  },
  zh: {
    title: "News",
    lead1: "我們定期更新最新的新聞與專欄，",
    lead2: "分享海外拓展的實務經驗與市場資訊。",
    cta: "👉 閱讀更多文章",
  },
  en: {
    title: "News",
    lead1: "Stay up to date with our latest news and blog posts.",
    lead2: "We share insights and practical tips for global expansion.",
    cta: "👉 See All Articles",
  },
} as const;

export default function NewsIntro({
  lang = "en",
  className,
  ctaHref = "#articles",
}: {
  lang?: Lang;
  className?: string;
  ctaHref?: string;
}) {
  const t = copy[lang];

  return (
    <section
      className={clsx(
        "relative w-full overflow-hidden",
        "text-white",
        "py-16 md:py-20",
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
        <p className="mt-6 text-lg md:text-xl opacity-95">{t.lead1}</p>
        <p className="mt-1 text-lg md:text-xl opacity-95">{t.lead2}</p>

        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center rounded-lg px-5 py-3 font-medium text-white transition-colors"
            style={{ backgroundColor: "#4A90E2", color: "#FFFFFF" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#5AA2F0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#4A90E2";
            }}
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
