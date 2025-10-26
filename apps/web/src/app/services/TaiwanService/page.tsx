// apps/web/src/app/services/TaiwanService/page.tsx

import NavigationServer from "@/components/NavigationServer";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";
import { sfetch } from "@/lib/sanity/fetch";
import { twServiceDetailBySlug, type Lang } from "@/lib/queries/twServices";

/** 固定為這個服務文件的 Sanity slug（你可以按需更改） */
const CANONICAL_SLUG = "taiwan-market-entry-support";

export const revalidate = 60;

/* ============================ 圖片調整區 ============================
   heroX、heroY 用來控制 Hero 圖片的對位百分比。
   0 表示最左/最上，100 表示最右/最下，50 表示置中。 */
const HERO_TUNE = {
  x: 50, // 左右：0~100，數字越大越靠右
  y: 33, // 上下：0~100，數字越大越靠下
};
/* ================================================================== */

function clamp01to100(n: number) {
  return Math.min(100, Math.max(0, Math.round(n)));
}

/** lang 解析（支援 ?lang=jp|zh|en，預設 jp） */
function resolveLang(sp?: string): Lang {
  const l = (sp ?? "").toLowerCase();
  return l === "zh" || l === "en" || l === "jp" ? (l as Lang) : "jp";
}

function t(lang: Lang, dict: Record<"jp" | "zh" | "en", string>) {
  return dict[lang];
}

/** 依據固定 slug 產生靜態頁面的 metadata */
export async function generateMetadata(props: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp =
    props.searchParams && typeof (props.searchParams as any).then === "function"
      ? await (props.searchParams as Promise<{ lang?: string }>)
      : (props.searchParams as { lang?: string } | undefined);

  const lang = resolveLang(sp?.lang);

  const data = await sfetch<{ title?: string | null }>(twServiceDetailBySlug, {
    slug: CANONICAL_SLUG,
    lang,
  });

  const title = data?.title ?? "Service Detail";
  return {
    title,
    description: `${title} at Taiwan Connect`,
  };
}

type ScheduleBlock = { title?: string | null; items?: string[] | null };
type FeeRow = {
  category?: string | null;
  serviceName?: string | null;
  fee?: string | null;
  notes?: string | null;
};

/** 分隔元素（品牌藍淡色漸層，稍微加粗） */
function Separator() {
  return (
    <div className="my-10 md:my-14">
      <div className="h-0.5 md:h-[3px] w-full rounded-full bg-gradient-to-r from-transparent via-[#1C3D5A]/30 to-transparent" />
    </div>
  );
}

/* ============================ Emoji 選擇邏輯 ============================ */
function emojiForChallenge(text: string): string {
  const ttext = text.toLowerCase();
  if (/設立|登記|口座|ビザ|手続|procedure|incorporation|register|visa|account/.test(ttext) || /銀行/.test(text)) return "🧾";
  if (/会計|會計|税務|稅務|法規|罰則|コンプライアンス|compliance|tax|accounting|regulation|penalty/.test(text) || /compliance|penalt/.test(ttext)) return "⚖️";
  if (/言語|制度|差異|違い|自力|language|system|framework|difference|barrier/.test(text)) return "🧩";
  if (/専門家|專家|窓口|信頼|信賴|不安|expert|advisor|trusted|contact/.test(text)) return "🤝";
  if (/不十分|不充分|準備|機会損失|機會|損失|コスト|成本|cost|overrun|loss/.test(text)) return "⏳";
  if (/時間|time\-consuming|delay|遅/.test(text) || /かかる/.test(text)) return "🕒";
  return "🔹";
}

function emojiForService(text: string): string {
  if (/会社設立|公司設立|incorporation|registration|定款|登記|articles/.test(text)) return "🏢";
  if (/税務|稅務|会計|會計|帳簿|申告|申報|tax|accounting|bookkeeping|filing/.test(text)) return "📚";
  if (/外国投資|外國投資|審査|審查|資本登記|investment review|capital registration/.test(text)) return "📝";
  if (/銀行口座|口座開設|bank account|開設|政府|government|機関|agency|調整|liaison/.test(text)) return "🏦";
  if (/進出後|経営支援|經營支援|コンプライアンス|compliance|ongoing|after entry/.test(text)) return "🛠️";
  return "✅";
}
/* ===================================================================== */

export default async function TaiwanServicePage({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const sp =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  const lang = resolveLang(sp?.lang);

  const data = await sfetch<{
    _id: string;
    slug: string;
    title?: string | null;
    coverImage?: { url?: string | null } | null;
    background?: string | null;
    challenges?: string[] | null;
    services?: { items?: string[] | null; keywords?: string[] | null } | null;
    serviceFlow?: string[] | null;
    scheduleExample?: ScheduleBlock[] | null;
    feesFlat?: FeeRow[] | null;
    ctaLabel?: string | null;
    ctaLink?: string | null;
  }>(twServiceDetailBySlug, { slug: CANONICAL_SLUG, lang });

  if (!data) {
    console.error("[TaiwanService] Not found. slug:", CANONICAL_SLUG);
    notFound();
  }

  const title = data.title ?? "";
  const coverUrl = data.coverImage?.url ?? "";
  const background = data.background ?? "";
  const challenges = data.challenges ?? [];
  const services = data.services?.items ?? [];
  const keywords = data.services?.keywords ?? [];
  const flow = data.serviceFlow ?? [];
  const schedules = data.scheduleExample ?? [];
  const feesFlat = data.feesFlat ?? [];
  const ctaText = data.ctaLabel ?? t(lang, { jp: "お問い合わせはこちら", zh: "聯絡我們", en: "Contact Us" });
  const ctaLink = data.ctaLink ?? "/contact";

  // 取用調整區的數值並做界限保護
  const heroX = clamp01to100(HERO_TUNE.x);
  const heroY = clamp01to100(HERO_TUNE.y);

  // 各段落是否存在
  const hasBackground = !!background;
  const hasChallenges = challenges.length > 0;
  const hasServices = services.length > 0 || keywords.length > 0;
  const hasFlow = flow.length > 0;
  const hasSchedules = schedules.length > 0;
  const hasFees = feesFlat.length > 0;

  // 文字字典
  const labels = {
    breadcrumb: t(lang, {
      jp: "ホーム / サービス / 台湾進出支援",
      zh: "首頁 / 服務內容 / 台灣進出支援",
      en: "Home / Services / Taiwan Market Entry",
    }),
    quickNav: {
      bg: t(lang, { jp: "背景", zh: "背景", en: "背景" as any }) as string || "背景",
      ch: t(lang, { jp: "課題", zh: "挑戰", en: "Challenges" }),
      sv: t(lang, { jp: "サービス内容", zh: "服務內容", en: "Services" }),
      fl: t(lang, { jp: "サービスの流れ", zh: "服務流程", en: "Service Flow" }),
      sc: t(lang, { jp: "スケジュール例", zh: "時程範例", en: "Schedule" }),
      fe: t(lang, { jp: "料金（参考）", zh: "費用參考", en: "Fees (Reference)" }),
    },
    bottomCTAHeading: t(lang, {
      jp: "最適な進出戦略で、台湾での新しい一歩を",
      zh: "用最合適的進出策略，安心展開在台事業",
      en: "Start your next chapter in Taiwan with the right market entry plan",
    }),
    contactBtn: t(lang, { jp: "お問い合わせはこちら", zh: "聯絡我們", en: "Contact Us" }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1C3D5A] text-white">
      <NavigationServer lang={lang} />

      {/* Hero：加上麵包屑膠囊＋大標題 */}
      <section className="relative w-full">
        <div className="relative h-[38vh] sm:h-[46vh] md:h-[52vh] lg:h-[60vh] w-full overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              style={{ objectPosition: `${heroX}% ${heroY}%` }}
            />
          ) : (
            <div className="h-full w-full bg-[#1C3D5A]" />
          )}
          {/* 漸層遮罩，讓字更清楚 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#1C3D5A]" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10 text-center">
              <div className="inline-block rounded-full bg-white/10 border border-white/15 px-4 py-1 text-xs md:text-sm mb-4">
                {labels.breadcrumb}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Hero 下方：快速導覽按鈕（水平排列） */}
      <nav className="bg-[#0f2a40]/60 backdrop-blur-sm border-t border-b border-white/10 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3 px-4 md:px-6">
          {hasBackground && (
            <a href="#bg" className="px-4 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition">
              {labels.quickNav.bg}
            </a>
          )}
          {hasChallenges && (
            <a href="#ch" className="px-4 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition">
              {labels.quickNav.ch}
            </a>
          )}
          {hasServices && (
            <a href="#sv" className="px-4 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition">
              {labels.quickNav.sv}
            </a>
          )}
          {hasFlow && (
            <a href="#fl" className="px-4 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition">
              {labels.quickNav.fl}
            </a>
          )}
          {hasSchedules && (
            <a href="#sc" className="px-4 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition">
              {labels.quickNav.sc}
            </a>
          )}
          {hasFees && (
            <a href="#fe" className="px-4 py-2 rounded-full border border-white/20 text-sm md:text-base hover:bg-white/10 transition">
              {labels.quickNav.fe}
            </a>
          )}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 py-8 md:py-12 text-neutral-900">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="rounded-3xl bg-white shadow-lg ring-1 ring-black/5 p-6 md:p-10">
            {background && (
              <>
                <section id="bg" className="mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1C3D5A]">
                    {labels.quickNav.bg}
                  </h2>
                  <p className="text-base md:text-lg leading-7 text-neutral-800 whitespace-pre-line">
                    {background}
                  </p>
                </section>
                {(hasChallenges || hasServices || hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {hasChallenges && (
              <>
                <section id="ch" className="mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1C3D5A]">
                    {labels.quickNav.ch}
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {challenges.map((item, idx) => {
                      const icon = emojiForChallenge(item ?? "");
                      return (
                        <li key={`challenge-${idx}`} className="rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white">
                          <span className="text-neutral-900">
                            <span role="img" aria-hidden className="me-2 text-lg">{icon}</span>
                            {item}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                {(hasServices || hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {hasServices && (
              <>
                <section id="sv" className="mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1C3D5A]">
                    {labels.quickNav.sv}
                  </h2>

                  {services.length > 0 && (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {services.map((svc, idx) => {
                        const icon = emojiForService(svc ?? "");
                        return (
                          <li key={`svc-${idx}`} className="rounded-2xl border border-neutral-200 p-4 md:p-5 bg-white">
                            <span className="text-neutral-900">
                              <span role="img" aria-hidden className="me-2 text-lg">{icon}</span>
                              {svc}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {keywords.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3 text-neutral-700">
                        {t(lang, { jp: "キーワード", zh: "關鍵詞", en: "Keywords" })}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((kw, idx) => (
                          <span key={`kw-${idx}`} className="inline-flex items-center rounded-full border border-[#1C3D5A]/20 px-3 py-1 text-sm bg-[#1C3D5A]/5">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
                {(hasFlow || hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {hasFlow && (
              <>
                <section id="fl" className="mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1C3D5A]">
                    {labels.quickNav.fl}
                  </h2>
                <ol className="relative ms-5 border-s-2 border-[#1C3D5A]/30">
                    {flow.map((step, idx) => (
                      <li key={`flow-${idx}`} className="mb-6 ms-4">
                        <div className="absolute w-3 h-3 bg-[#1C3D5A] rounded-full mt-2.5 -start-1.5 border border-white"></div>
                        <div className="bg-white rounded-xl border border-neutral-200 p-4 md:p-5">
                          <div className="text-sm text-neutral-500 mb-1">
                            {t(lang, { jp: "ステップ", zh: "步驟", en: "Step" })} {idx + 1}
                          </div>
                          <div className="text-neutral-900">{step}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
                {(hasSchedules || hasFees) && <Separator />}
              </>
            )}

            {hasSchedules && (
              <>
                <section id="sc" className="mb-10 md:mb-14">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1C3D5A]">
                    {labels.quickNav.sc}
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    {schedules.map((blk, idx) => (
                      <div key={`sched-${idx}`} className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
                        {blk.title && <h3 className="text-lg font-semibold text-neutral-900 mb-3">{blk.title}</h3>}
                        <ul className="list-disc ms-5 space-y-1">
                          {(blk.items ?? []).map((it, i) => (
                            <li key={`sched-item-${idx}-${i}`} className="text-neutral-800">{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
                {hasFees && <Separator />}
              </>
            )}

            {hasFees && (
              <section id="fe" className="mb-2 md:mb-4">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1C3D5A]">
                  {labels.quickNav.fe}
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "カテゴリ", zh: "類別", en: "Category" })}</th>
                        <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "サービス", zh: "服務項目", en: "Service" })}</th>
                        <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "料金 JPY", zh: "費用 JPY", en: "Fee JPY" })}</th>
                        <th className="text-left px-5 py-3 font-medium text-neutral-700">{t(lang, { jp: "備考", zh: "備註", en: "Notes" })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feesFlat.map((row, idx) => (
                        <tr key={`fee-${idx}`} className="border-t border-neutral-200">
                          <td className="px-5 py-3">{row.category ?? ""}</td>
                          <td className="px-5 py-3">{row.serviceName ?? ""}</td>
                          <td className="px-5 py-3">{row.fee ?? ""}</td>
                          <td className="px-5 py-3 text-neutral-700">{row.notes ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* 底部整寬 CTA（參照簽證頁第二張圖風格） */}
      <section className="bg-[#1C3D5A] py-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl md:text-2xl font-semibold">
            {labels.bottomCTAHeading}
          </h3>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href={
                ctaLink.startsWith("/")
                  ? `${ctaLink}${ctaLink.includes("?") ? "&" : "?"}lang=${lang}`
                  : ctaLink
              }
              className="inline-block bg-white text-[#1C3D5A] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              {labels.contactBtn}
            </a>
            <a
              href="mailto:info@twconnects.com"
              className="inline-block bg-white/10 border border-white/20 font-semibold px-6 py-3 rounded-lg hover:bg-white/15 transition"
            >
              info@twconnects.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
