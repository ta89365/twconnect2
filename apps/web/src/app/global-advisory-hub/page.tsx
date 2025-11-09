// File: apps/web/src/app/global-advisory-hub/page.tsx
import Image from "next/image";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { globalAdvisoryHubByLang } from "@/lib/queries/globalAdvisoryHub";
import { notFound } from "next/navigation";
import Link from "next/link";
import * as Lucide from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/* ============================ i18n ============================ */
type Lang = "jp" | "zh" | "en";
function normalizeLang(input?: string | null): Lang {
  const k = String(input ?? "").trim().toLowerCase();
  if (k === "jp" || k === "ja" || k === "ja-jp") return "jp";
  if (k === "zh" || k === "zh-hant" || k === "zh-tw" || k === "tw" || k === "hant") return "zh";
  if (k === "en" || k === "en-us" || k === "en_us") return "en";
  return "zh";
}

/* ============================ 視覺設定 ============================ */
const BRAND_BLUE = "#1C3D5A";
const ACCENT = "rgba(255,255,255,0.55)";
const TUNE = {
  contentMaxW: "1200px",
  heroMinH: "60vh",
  sectionPadY: "py-10 md:py-14",
  h2: "text-2xl md:text-3xl font-semibold tracking-tight text-white",
  sub: "text-base md:text-lg text-white/85",
  card:
    "rounded-2xl border border-white/14 bg-white/[0.08] text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-white/24 hover:bg-white/[0.12]",
  badge:
    "inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/10 backdrop-blur",
  divider: "h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent",
};

/* ============================ 取得資料 ============================ */
type FeePkg = {
  name?: string;
  priceNote?: string;
  features?: string[];
};
async function getData(lang: Lang) {
  const data = await sfetch(globalAdvisoryHubByLang, { lang });
  return data as {
    slug?: string;
    hero?: {
      title?: string;
      subtitle?: string;
      badge?: string;
      bgImage?: { url?: string; alt?: string; objectPosition?: string };
    };
    introduction?: {
      lead?: string;
      body?: string;
      networkBlurb?: string;
      stats?: { countriesCount?: string; regions?: string[] };
    };
    challenges?: { sectionTitle?: string; items?: string[] };
    services?: {
      intro?: string;
      financialAdvisory?: { pillarTitle?: string; items?: { label?: string; desc?: string; icon?: string }[] };
      overseasSupport?: { pillarTitle?: string; items?: { label?: string; desc?: string; icon?: string }[] };
    };
    serviceFlow?: {
      sectionTitle?: string;
      steps?: { stepNo?: number; title?: string; desc?: string; icon?: string }[];
    };
    feesFinancial?: {
      sectionTitle?: string;
      disclaimer?: string;
      body?: string;
      packages?: FeePkg[];
      showContactCta?: boolean;
    };
    feesOverseas?: {
      sectionTitle?: string;
      disclaimer?: string;
      body?: string;
      packages?: FeePkg[];
      showContactCta?: boolean;
    };
    cta?: { title?: string; subtitle?: string; buttonText?: string; buttonHref?: string };
    seo?: { metaTitle?: string; metaDescription?: string; ogImage?: { url?: string; alt?: string } };
  } | null;
}

/* ============================ Icon 映射 ============================ */
const ICONS: Record<string, Lucide.LucideIcon> = {
  "bar-chart-3": Lucide.BarChart3,
  "line-chart": Lucide.LineChart,
  "clipboard-list": Lucide.ClipboardList,
  "shield-check": Lucide.ShieldCheck,
  "building-2": Lucide.Building2,
  scale: Lucide.Scale,
  layers: Lucide.Layers,
  briefcase: Lucide.Briefcase,
  mail: Lucide.Mail,
  "message-square": Lucide.MessageSquare,
  "file-text": Lucide.FileText,
  "check-circle-2": Lucide.CheckCircle2,
  "alert-triangle": Lucide.AlertTriangle,
  target: Lucide.Target,
  "help-circle": Lucide.HelpCircle,
  "shield-alert": Lucide.ShieldAlert,
  "circle-alert": Lucide.CircleAlert,
  flag: Lucide.Flag,
  radar: Lucide.Radar,
  bug: Lucide.Bug,
  eye: Lucide.Eye,
  activity: Lucide.Activity,
};
function IconByName({ name, className }: { name?: string; className?: string }) {
  const Comp = name && ICONS[name] ? ICONS[name] : Lucide.Circle;
  return <Comp className={className} aria-hidden="true" />;
}

/* ============================ 共用元件 ============================ */
function SectionHeading({ title, kicker }: { title?: string; kicker?: string }) {
  return (
    <div className="mb-6">
      {kicker ? (
        <div className="mb-2 inline-flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.18em] text-white/70 uppercase">
          <span className="h-[1px] w-6 bg-white/40" />
          {kicker}
        </div>
      ) : null}
      <h2 className={TUNE.h2}>{title}</h2>
    </div>
  );
}
function StatPill({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur">
      {label}
    </span>
  );
}
function Divider() {
  return <div className={`${TUNE.divider} my-8`} />;
}

/* ============================ Page ============================ */
export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = normalizeLang(typeof sp.lang === "string" ? sp.lang : undefined);

  const data = await getData(lang);
  if (!data) notFound();

  const H = data.hero;
  const I = data.introduction;
  const C = data.challenges;
  const S = data.services;
  const F = data.serviceFlow;
  const FF = data.feesFinancial;
  const FO = data.feesOverseas;

  const CHALLENGE_ICONS = [
    "alert-triangle",
    "target",
    "help-circle",
    "shield-alert",
    "circle-alert",
    "flag",
    "radar",
    "bug",
    "eye",
    "activity",
  ] as const;

  return (
    <main className="min-h-screen text-white">
      <style>{`
        :root { --brand-blue: ${BRAND_BLUE}; --page-bg: ${BRAND_BLUE}; --page-fg: #ffffff; }
        html, body, #__next { background-color: var(--page-bg) !important; color: var(--page-fg); }
      `}</style>

      {/* 背景安全層與裝飾光暈 */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[var(--page-bg)]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Server Nav */}
      {await NavigationServer({ lang })}

      {/* ============================ Hero ============================ */}
      <section className="relative isolate" style={{ minHeight: TUNE.heroMinH }}>
        <div className="absolute inset-0 bg-[--brand-blue]" />
        {H?.bgImage?.url && (
          <Image
            src={H.bgImage.url}
            alt={H.bgImage.alt || "Global Advisory Hub"}
            fill
            priority
            className="object-cover opacity-70"
            style={{ objectPosition: H.bgImage.objectPosition || "50% 50%" }}
            sizes="100vw"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),transparent_35%,rgba(0,0,0,0.35))]" />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2248%22 height=%2248%22 filter=%22url(%23n)%22 opacity=%220.2%22/></svg>')",
            }}
          />
          <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M5,65 C30,40 70,60 95,35" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            <path d="M10,78 C38,55 62,70 90,50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
          </svg>
        </div>
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] flex-col items-start justify-end px-6 pb-14 pt-24">
          {H?.badge ? (
            <div className={`${TUNE.badge} mb-2`}>
              <Lucide.BadgeCheck className="h-4 w-4" />
              <span>{H.badge}</span>
            </div>
          ) : null}
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight drop-shadow-sm">{H?.title}</h1>
          {H?.subtitle ? <p className="mt-3 max-w-3xl text-base md:text-lg text-white/85 leading-7">{H.subtitle}</p> : null}
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-[var(--page-bg)]" />
      </section>

      {/* ============================ Introduction ============================ */}
      <section className={TUNE.sectionPadY}>
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <div>
              <SectionHeading title={I?.lead} />
              {I?.body ? <p className="leading-7 text-white/85">{I.body}</p> : null}
              {I?.networkBlurb ? (
                <div className="mt-4 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white/90 backdrop-blur">
                  <div className="mb-1 text-sm font-semibold text-white/90">Global Network & On-ground Capability</div>
                  <p className="text-sm leading-6 text-white/85">{I.networkBlurb}</p>
                </div>
              ) : null}
            </div>
            <aside className="space-y-3">
              <div className={`${TUNE.card} p-4`}>
                <div className="text-sm font-semibold text-white/90">Coverage</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatPill label={`Countries: ${I?.stats?.countriesCount || "—"}`} />
                  {(I?.stats?.regions || []).map((r, idx) => (
                    <StatPill key={idx} label={r} />
                  ))}
                </div>
              </div>
              <div className={`${TUNE.card} p-4`}>
                <div className="text-sm font-semibold text-white/90">Positioning</div>
                <p className="mt-1.5 text-sm text-white/80">
                  {lang === "zh"
                    ? "不論規模大小或所處階段，都有對應的專業團隊與方案。"
                    : lang === "jp"
                    ? "規模やステージを問わず、最適な専門チームが伴走します。"
                    : "At any scale or stage, the right advisory team is available."}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Divider />

      {/* ============================ Challenges（倒三角排列） ============================ */}
      <section className={TUNE.sectionPadY}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading
            kicker={lang === "zh" ? "我們解決的問題" : lang === "jp" ? "解決する課題" : "What We Solve"}
            title={C?.sectionTitle || (lang === "zh" ? "挑戰" : lang === "jp" ? "課題" : "Challenges")}
          />

          {(() => {
            const items = C?.items || [];
            const top = items.slice(0, 3);
            const bottom = items.slice(3);

            const Card = (t: string, i: number) => {
              const numberLabel = lang === "zh" ? `重點 ${i + 1}` : lang === "jp" ? `ポイント ${i + 1}` : `Point ${i + 1}`;
              const iconName = CHALLENGE_ICONS[i % CHALLENGE_ICONS.length];
              return (
                <div key={i} className={`${TUNE.card} p-4`}>
                  <div className="mb-2 flex items-center gap-2">
                    <IconByName name={iconName} className="h-5 w-5" />
                    <div className="text-sm font-semibold text-white/90">{numberLabel}</div>
                  </div>
                  <p className="text-white/85 leading-7">{t}</p>
                </div>
              );
            };

            return (
              <div className="space-y-4">
                {/* 第一排：最多三張，桌機三欄 */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {top.map((t, idx) => Card(t, idx))}
                </div>

                {/* 第二排：其餘卡片；桌機置中，形成倒三角視覺 */}
                {bottom.length > 0 && (
                  <div
                    className={[
                      // 手機與平板：一到兩欄自然換行
                      "grid gap-4 md:grid-cols-2",
                      // 桌機：兩欄並置中，讓它在三欄第一排下方形成倒三角
                      "lg:grid-cols-2 lg:max-w-[800px] lg:mx-auto",
                    ].join(" ")}
                  >
                    {bottom.map((t, idx) => Card(t, idx + top.length))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      <Divider />

      {/* ============================ Services (Dual Pillars) ============================ */}
      <section className={TUNE.sectionPadY}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading
            kicker={lang === "zh" ? "雙主軸顧問" : lang === "jp" ? "二本柱のアドバイザリー" : "Dual Pillars"}
            title={
              lang === "zh"
                ? "財務會計顧問 × 海外發展支援"
                : lang === "jp"
                ? "財務・会計アドバイザリー × 海外展開支援"
                : "Financial & Accounting Advisory × Overseas Expansion Support"
            }
          />
          {S?.intro ? <p className="mb-6 text-white/85 leading-7">{S.intro}</p> : null}

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Pillar A */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white ring-1 ring-white/20">
                  <Lucide.PieChart className="h-4 w-4" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white">{S?.financialAdvisory?.pillarTitle}</h3>
              </div>
              <div className="grid gap-3">
                {(S?.financialAdvisory?.items || []).map((it, idx) => (
                  <div key={idx} className={`${TUNE.card} p-4`}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <IconByName name={it.icon} className="h-5 w-5 text-white" />
                      <div className="font-medium text-white">{it.label}</div>
                    </div>
                    {it.desc ? <p className="text-sm text-white/80 leading-6">{it.desc}</p> : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar B */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white ring-1 ring-white/20">
                  <Lucide.Globe className="h-4 w-4" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white">{S?.overseasSupport?.pillarTitle}</h3>
              </div>
              <div className="grid gap-3">
                {(S?.overseasSupport?.items || []).map((it, idx) => (
                  <div key={idx} className={`${TUNE.card} p-4`}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <IconByName name={it.icon} className="h-5 w-5 text-white" />
                      <div className="font-medium text-white">{it.label}</div>
                    </div>
                    {it.desc ? <p className="text-sm text-white/80 leading-6">{it.desc}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ============================ Service Flow ============================ */}
      <section className={TUNE.sectionPadY}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading
            kicker={lang === "zh" ? "合作方式" : lang === "jp" ? "ご契約まで" : "How We Work"}
            title={F?.sectionTitle}
          />
          <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(F?.steps || []).map((st, idx, arr) => {
              const isLast = idx === arr.length - 1;
              const stepText =
                lang === "zh" ? `步驟 ${st.stepNo}` : lang === "jp" ? `STEP ${st.stepNo}` : `Step ${st.stepNo}`;
              return (
                <li
                  key={idx}
                  className={[
                    TUNE.card,
                    "p-4 min-h-32 flex flex-col relative",
                    !isLast
                      ? 'lg:after:content-[""] lg:after:absolute lg:after:top-1/2 lg:after:left-[calc(100%+0.25rem)] lg:after:w-6 lg:after:h-px lg:after:bg-white/40 lg:after:opacity-70 lg:after:-translate-y-1/2'
                      : "",
                    !isLast
                      ? 'after:content-[""] after:absolute after:bottom-[-0.8rem] after:left-1/2 after:-translate-x-1/2 after:h-6 after:w-px after:bg-gradient-to-b after:from-white/70 after:to-white/0 lg:after:hidden'
                      : "after:hidden",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className="grid h-7 w-7 place-items-center rounded-full text-[13px] font-bold"
                        style={{ backgroundColor: ACCENT, color: BRAND_BLUE }}
                        aria-hidden
                      >
                        {st.stepNo}
                      </span>
                      <div className="text-sm font-semibold text-white/85">{stepText}</div>
                    </div>
                    <IconByName name={st.icon} className="h-5 w-5 text-white" />
                  </div>

                  <div className="font-medium text-white">{st.title}</div>
                  {st.desc ? <p className="mt-1 text-sm text-white/80 leading-6">{st.desc}</p> : null}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <Divider />

      {/* ============================ Fees（雙欄：財務會計顧問 / 海外發展支援） ============================ */}
      <section className={TUNE.sectionPadY}>
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading
            kicker={lang === "zh" ? "費用與專案制度" : lang === "jp" ? "料金・プロジェクト制度" : "Fees & Project Model"}
            title={
              lang === "zh"
                ? "財務會計顧問與海外發展支援"
                : lang === "jp"
                ? "財務・会計アドバイザリーと海外展開支援"
                : "Financial Advisory and Overseas Support"
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {/* 左：財務會計顧問 */}
            <article className={`${TUNE.card} p-5`}>
              <header className="mb-3 flex items-center gap-2">
                <Lucide.Calculator className="h-5 w-5" />
                <h3 className="text-lg font-semibold">
                  {FF?.sectionTitle ||
                    (lang === "zh"
                      ? "財務會計顧問"
                      : lang === "jp"
                      ? "財務・会計アドバイザリー"
                      : "Financial & Accounting Advisory")}
                </h3>
              </header>
              {FF?.disclaimer ? <p className="text-white/90 leading-7">{FF.disclaimer}</p> : null}
              {FF?.body ? <p className="mt-2.5 text-white/80 leading-7">{FF.body}</p> : null}

              {Array.isArray(FF?.packages) && FF.packages.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {FF.packages.map((p, idx) => (
                    <div key={idx} className="rounded-xl border border-white/15 bg-white/10 p-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="font-semibold">{p.name}</div>
                        {p.priceNote ? <span className="text-sm text-white/80">{p.priceNote}</span> : null}
                      </div>
                      {Array.isArray(p.features) && p.features.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/85">
                          {p.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>

            {/* 右：海外發展支援 */}
            <article className={`${TUNE.card} p-5`}>
              <header className="mb-3 flex items-center gap-2">
                <Lucide.Plane className="h-5 w-5" />
                <h3 className="text-lg font-semibold">
                  {FO?.sectionTitle ||
                    (lang === "zh" ? "海外發展支援" : lang === "jp" ? "海外展開支援" : "Overseas Expansion Support")}
                </h3>
              </header>
              {FO?.disclaimer ? <p className="text-white/90 leading-7">{FO.disclaimer}</p> : null}
              {FO?.body ? <p className="mt-2.5 text-white/80 leading-7">{FO.body}</p> : null}

              {Array.isArray(FO?.packages) && FO.packages.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {FO.packages.map((p, idx) => (
                    <div key={idx} className="rounded-xl border border-white/15 bg-white/10 p-4">
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="font-semibold">{p.name}</div>
                        {p.priceNote ? <span className="text-sm text-white/80">{p.priceNote}</span> : null}
                      </div>
                      {Array.isArray(p.features) && p.features.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/85">
                          {p.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          </div>

          {(FF?.showContactCta || FO?.showContactCta) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/contact?lang=${lang}`}
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold"
                style={{ backgroundColor: "#ffffff", color: BRAND_BLUE, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
              >
                {lang === "jp" ? "お問い合わせはこちら" : lang === "zh" ? "Contact Us 聯絡我們" : "Contact Us"}
              </Link>
              <a
                href="mailto:info@twconnects.com"
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white"
                style={{ border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                info@twconnects.com
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ============================ Pre-Footer CTA ============================ */}
      <section className="border-y" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <div className="mx-auto max-w-[1200px] px-5 md:px-6">
          <div className="py-8 md:py-12 text-center">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              {(() => {
                if (lang === "jp") return "台湾から世界へ、つながる未来へ";
                if (lang === "zh") return "從台灣出發，連結世界";
                return "From Taiwan to the world — building bridges for global growth";
              })()}
            </h3>

            <div className="mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Link
                href={`/contact?lang=${lang}`}
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold"
                style={{ backgroundColor: "#ffffff", color: BRAND_BLUE, boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
              >
                {lang === "jp" ? "お問い合わせはこちら" : lang === "zh" ? "Contact Us 聯絡我們" : "Contact Us"}
              </Link>

              <a
                href="mailto:info@twconnects.com"
                className="inline-flex items-center justify-center rounded-xl px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base font-semibold text-white"
                style={{ border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                info@twconnects.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {await FooterServer({ lang })}
    </main>
  );
}
