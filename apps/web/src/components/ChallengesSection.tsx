// apps/web/src/app/_components/ChallengesSection.tsx
import React from "react";
import { sfetch } from "@/lib/sanity/fetch";
import { challengesQueryML } from "@/lib/queries/challenges";
import {
  Building2,
  Landmark,
  Scale,
  BadgeCheck,
  Globe2,
  Sparkles,
  FileText,
  Calculator,
  Handshake,
  Circle,
} from "lucide-react";

type Lang = "jp" | "zh" | "zh-cn" | "en";

type ChallengeItem = {
  _id: string;
  order?: number | null;
  iconKey?: string | null;
  title?: string | null;
  desc?: string | null;
};

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const iconMap = {
  "building-2": Building2,
  landmark: Landmark,
  scale: Scale,
  "badge-check": BadgeCheck,
  "globe-2": Globe2,
  "file-text": FileText,
  calculator: Calculator,
  handshake: Handshake,
  sparkles: Sparkles,
} as const;

function resolveIconKey(title?: string, fallback: keyof typeof iconMap = "sparkles") {
  const t = (title || "").toLowerCase();
  if (/(設立|登記|法人設立|会社設立|registration|incorporation)/.test(t)) return "building-2";
  if (/(銀行|口座|資金|kyc|資金源|bank|account|fund|コンプライアンス)/.test(t)) return "landmark";
  if (/(会計|會計|請求|発票|invoice|報告|申告|申報)/.test(t)) return "file-text";
  if (/(税|稅|tax|計算|cost|コスト)/.test(t)) return "calculator";
  if (/(合約|契約|合規|compliance|審査|審核)/.test(t)) return "badge-check";
  if (/(跨境|越境|global|globe|コラボ|データ|data)/.test(t)) return "globe-2";
  if (/(合作|協議|取引|deal|handshake)/.test(t)) return "handshake";
  if (/(法律|法規|監管|regulation|法務|規制)/.test(t)) return "scale";
  return fallback;
}

function getIconComp(key: string): IconComp {
  const comp = (iconMap as Record<string, unknown>)[key] as IconComp | undefined;
  return (comp ?? Circle) as IconComp;
}

function ChallengeIcon({ item }: { item: ChallengeItem }) {
  const key = resolveIconKey(item?.title ?? undefined);
  const Ico = getIconComp(key);
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
      {React.createElement(Ico, {
        className: "h-5 w-5 text-black",
        stroke: "black",
        strokeWidth: 2,
        "aria-hidden": true,
      })}
    </span>
  );
}

/** 內建多語字串（不走 Sanity） */
function resolveCopy(lang: Lang) {
  // ✅ 若為 zh-cn 視為 zh（繁體中文）
  const key: "jp" | "zh" | "en" = lang === "zh-cn" ? "zh" : (lang as any);

  const dict = {
    jp: {
      heading: "台湾進出で、こんな課題はありませんか？",
      sub: "解決策を提示する前に、まずよくある本当の課題を整理しましょう。",
      ribbonTitle: "Taiwan Connect が解決します",
      ribbonSub: "グローバル展開を、もっとスムーズに。",
      cta: "お問い合わせ",
    },
    zh: {
      heading: "常見的五大挑戰",
      sub: "在提出解決方案之前，我們先整理企業最常面臨的真實問題。",
      ribbonTitle: "Taiwan Connect 為你解決",
      ribbonSub: "讓跨境布局，更順暢。",
      cta: "看我們怎麼解決",
    },
    en: {
      heading: "Five Common Challenges",
      sub: "Before proposing solutions, let's first organize the real challenges businesses often face.",
      ribbonTitle: "Taiwan Connect Solves It",
      ribbonSub: "Make global expansion smoother.",
      cta: "See How We Solve It",
    },
  } as const;

  return dict[key];
}

export default async function ChallengesSection({
  lang = "jp",
  heading,
  sub,
}: {
  lang?: Lang;
  heading?: string;
  sub?: string;
}) {
  const copy = resolveCopy(lang);
  const items = await sfetch<ChallengeItem[]>(challengesQueryML, { lang: lang === "zh-cn" ? "zh" : lang });
  if (!items?.length) return null;

  const list = items.slice(0, 5);
  const head = list.slice(0, 3);
  const tail = list.slice(3);

  return (
    <section className="relative bg-[#1C3D5A] py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow">
            {heading ?? copy.heading}
          </h2>
          <p className="mt-3 text-base sm:text-lg md:text-xl text-slate-300">
            {sub ?? copy.sub}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {head.map((it) => (
            <article
              key={it._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur transition hover:border-white/20"
            >
              <div className="mb-4 flex items-center gap-3">
                <ChallengeIcon item={it} />
                {typeof it.order === "number" && (
                  <span className="text-xs font-medium text-slate-400">
                    #{String(it.order).padStart(2, "0")}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">{it.title}</h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300">
                {it.desc}
              </p>
            </article>
          ))}

          {tail.map((it) => (
            <article
              key={it._id}
              className="lg:hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur transition hover:border-white/20"
            >
              <div className="mb-4 flex items-center gap-3">
                <ChallengeIcon item={it} />
                {typeof it.order === "number" && (
                  <span className="text-xs font-medium text-slate-400">
                    #{String(it.order).padStart(2, "0")}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">{it.title}</h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300">
                {it.desc}
              </p>
            </article>
          ))}

          <div className="hidden lg:block lg:col-span-3">
            <div className="grid grid-cols-[auto_auto] gap-5 w-fit mx-auto">
              {tail.map((it) => (
                <article
                  key={it._id}
                  className="w-[380px] rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur transition hover:border-white/20"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <ChallengeIcon item={it} />
                    {typeof it.order === "number" && (
                      <span className="text-xs font-medium text-slate-400">
                        #{String(it.order).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{it.title}</h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-300">
                    {it.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* CTA ribbon（改為品牌藍按鈕樣式） */}
        <div className="mt-8 sm:mt-10 md:mt-14">
          <div className="w-fit mx-auto flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-white backdrop-blur sm:flex-row sm:px-8 sm:py-5">
            <div className="text-center sm:text-left">
              <div className="font-semibold whitespace-nowrap">{copy.ribbonTitle}</div>
              <div className="text-slate-200 whitespace-nowrap">{copy.ribbonSub}</div>
            </div>

            {/* ✅ 改成指定底色 + Hover 效果 */}
<a
  href={`/client-challenges?lang=${lang}`}
  className="
    inline-flex items-center justify-center rounded-full
    px-6 py-2.5 text-sm font-semibold shadow transition-colors duration-200
    text-white bg-[#4A90E2] hover:bg-[#5AA2F0] whitespace-nowrap
  "
>
  {copy.cta}
</a>

          </div>
        </div>
      </div>
    </section>
  );
}
