"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Lang = "jp" | "zh" | "zh-cn" | "en";

export type ServiceItem = {
  _id: string;
  order?: number | null;
  href?: string | null;
  imageUrl?: string | null;
  title?: string | null;
  desc?: string | null;
};

type CnInvestmentHero = {
  url?: string | null;
  alt?: string | null;
} | null;

/* 將 URL 的 ?lang 正規化；簡體一律當成 zh */
function normalizeLang(input?: string | null): Exclude<Lang, "zh-cn"> {
  const k = String(input ?? "").trim().toLowerCase();
  if (k === "zh-cn" || k === "zh_cn" || k === "zh-hans" || k === "hans" || k === "cn") return "zh";
  if (k === "zh" || k === "zh-hant" || k === "zh_tw" || k === "zh-tw" || k === "tw" || k === "hant") return "zh";
  if (k === "en" || k === "en-us" || k === "en_us") return "en";
  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";
  return "jp";
}

/** 左側服務內容主標＋副標 */
function resolveCopy(lang: Exclude<Lang, "zh-cn">) {
  const dict = {
    jp: {
      heading: "サービス内容",
      subheading: "― 専門アドバイザリーチームが台湾進出や国際ビジネス展開の第一歩を支援 ―",
      cta: "詳細を見る",
      bottomCta: "会社概要を見る",
    },
    zh: {
      heading: "服務內容",
      subheading: "— 專業顧問團隊支援您邁出進軍臺灣與國際業務拓展的第一步 —",
      cta: "了解方案",
      bottomCta: "公司概要",
    },
    en: {
      heading: "Services",
      subheading: "— Our advisory team supports your first steps into Taiwan and global expansion —",
      cta: "Learn More",
      bottomCta: "Company Overview",
    },
  } as const;
  return dict[lang];
}

/** 右側陸資專區文案 */
function resolveCnInvestmentTexts(lang: Exclude<Lang, "zh-cn">) {
  if (lang === "jp") {
    return {
      blockHeading: "中国資本台湾投資",
      blockSubheading: "中中国投資者による対台湾投資を専門的に支援",
      cardTitle: "中国資本台湾投資",
      cardSubtitle: "中国投資者による対台湾投資を専門的に支援",
    };
  }
  if (lang === "en") {
    return {
      blockHeading: "Mainland China Investment",
      blockSubheading:
        "Professional support for China based investors entering and establishing in Taiwan",
      cardTitle: "Mainland China Investment",
      cardSubtitle:
        "Professional support for China based investors entering and establishing in Taiwan",
    };
  }
  return {
    blockHeading: "陸資來台投資專區",
    blockSubheading:
      "專為中國資本來台投資設立、審查及合規營運打造的專業顧問專區，協助企業順利通過審核並成功落地經營。",
    cardTitle: "陸資來台投資專區",
    cardSubtitle:
      "專為中國資本來台投資設立、審查及合規營運打造的專業顧問專區，協助企業順利通過審核並成功落地經營。",
  };
}

function isBypassLink(href?: string | null): boolean {
  const s = String(href ?? "").trim().toLowerCase();
  if (!s) return true;
  return (
    s.startsWith("http://") ||
    s.startsWith("https://") ||
    s.startsWith("mailto:") ||
    s.startsWith("tel:") ||
    s.startsWith("#")
  );
}

function addLangQuery(href: string, lang: Exclude<Lang, "zh-cn">): string {
  if (!href.startsWith("/")) return href;
  if (/[?&]lang=/.test(href)) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}lang=${lang}`;
}

export default function ServiceSection({
  items,
  lang,
  heading,
  subheading,
  ctaText,
  cnInvestmentHero,
  cnInvestmentHref,
}: {
  items: ServiceItem[];
  lang?: Lang;
  heading?: string;
  subheading?: string;
  ctaText?: string;
  cnInvestmentHero?: CnInvestmentHero;
  cnInvestmentHref?: string;
}) {
  if (!items?.length) return null;

  const sp = useSearchParams();
  const urlLang = normalizeLang(sp?.get("lang"));
  const effectiveLang = normalizeLang(lang ?? urlLang);

  const copy = resolveCopy(effectiveLang);
  const cnInvTexts = resolveCnInvestmentTexts(effectiveLang);

  const toHref = (raw?: string | null) => {
    const href = String(raw ?? "").trim();
    if (!href) return "#";
    if (isBypassLink(href)) return href;
    return addLangQuery(href, effectiveLang);
  };

  const finalBottomHref = addLangQuery("/company", effectiveLang);

  const cnInvImageUrl = cnInvestmentHero?.url ?? null;
  const cnInvAlt = cnInvestmentHero?.alt || cnInvTexts.cardTitle;
  const cnInvHrefFinal = cnInvestmentHref ? toHref(cnInvestmentHref) : "/cn-investment?lang=zh-cn";

  // 四個卡片固定高度
  const CARD_H = "h-[380px]";

  // 合併左側 items + 陸資卡片，統一用一個 grid 排版
  const cards = [
    ...items.map((it) => ({
      key: it._id,
      title: it.title,
      desc: it.desc,
      imageUrl: it.imageUrl,
      href: toHref(it.href),
      alt: it.title || "",
    })),
    ...(cnInvImageUrl
      ? [
          {
            key: "cn-investment",
            title: cnInvTexts.cardTitle,
            desc: cnInvTexts.cardSubtitle,
            imageUrl: cnInvImageUrl,
            href: cnInvHrefFinal,
            alt: cnInvAlt,
          },
        ]
      : []),
  ];

  return (
    <section className="relative overflow-hidden bg-[#1C3D5A] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-6xl">
          {/* 上方只保留主標題，置中 */}
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {heading ?? copy.heading}
            </h2>
          </div>

          {/* 單一 grid：最多四張卡片同高度 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {cards.map((card) => (
              <div
                key={card.key}
                className={`
                  group relative flex flex-col overflow-hidden rounded-2xl
                  bg-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/10
                  transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]
                  ${CARD_H}
                `}
              >
                {card.imageUrl ? (
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={card.imageUrl}
                      alt={card.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1280px) 260px, (min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-slate-700" />
                )}

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h3 className="text-base font-semibold leading-snug text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-200 line-clamp-4">
                    {card.desc}
                  </p>

                  <div className="mt-auto pt-4 flex justify-center">
                    <Link
                      href={card.href}
                      className="
                        inline-flex h-10 items-center justify-center rounded-xl
                        px-4 text-sm font-semibold shadow
                        transition-colors duration-200
                        text-white bg-[#1f2454] hover:bg-[#2b3068]
                      "
                    >
                      {ctaText ?? copy.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部大 CTA：維持原本多語 /company 邏輯 */}
        <div className="mt-10 flex justify-center">
          <Link
            href={finalBottomHref}
            className="inline-flex items-center rounded-xl px-6 py-3 text-sm sm:text-base font-medium transition
                      text-white bg-[#1f2454] hover:bg-[#2b3068]
                      focus:outline-none focus:ring-2 focus:ring-[#2b3068]
                      focus:ring-offset-2 focus:ring-offset-[#1C3D5A]"
          >
            {copy.bottomCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
