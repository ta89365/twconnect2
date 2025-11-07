// File: apps/web/src/app/cn-investment/cn-investment-ubo-guide/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import type { JSX } from "react";
import { PortableText } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";

import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentUboGuideQuery } from "@/lib/queries/cnInvestmentUboGuide.groq";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import * as Lucide from "lucide-react";
import { Noto_Sans_SC } from "next/font/google";

/* ============================ Page config ============================ */
export const dynamic = "force-dynamic";
export const revalidate = 60;

const PAGE_LANG = "zh-cn" as const;
const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = 1100;

const notoSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

/* ============================ Types ============================ */
type PT = TypedObject[];
interface UboExample { titleZhCn?: string | null; scenarioZhCn?: PT | null; conclusionZhCn?: PT | null; }
interface UboAdvice { labelZhCn?: string | null; bodyZhCn?: PT | null; }
interface UboContact { email?: string | null; lineId?: string | null; contactNoteZhCn?: PT | null; }
interface UboHeroImage {
  assetId?: string | null; url?: string | null; alt?: string | null; hotspot?: unknown; crop?: unknown;
  dimensions?: { width: number; height: number; aspectRatio: number } | null; lqip?: string | null;
}
interface UboGuideDoc {
  _id: string; slug?: string | null;

  heroTitleZhCn?: string | null;
  heroSubtitleZhCn?: string | null;
  heroImage?: UboHeroImage | null;

  importanceZhCn?: PT | null;
  legalBasisZhCn?: PT | null;
  ownershipThresholdZhCn?: PT | null;
  controlCriteriaZhCn?: PT | null;
  layeredCalculationZhCn?: PT | null;
  uboFocusZhCn?: PT | null;

  examples?: UboExample[] | null;
  practicalAdvice?: UboAdvice[] | null;
  conclusionZhCn?: PT | null;

  contact?: UboContact | null;

  lastUpdatedAt?: string | null;
  meta?: { isDraft?: boolean; seoDescription?: string | null } | null;
}
type QueryResult = { doc: UboGuideDoc | null } | UboGuideDoc | null;

const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ UI tokens ============================ */
const CARD_BG = "bg-white/12 backdrop-blur-sm";
const CARD_BORDER = "border border-white/25";
const TEXT_SOFT = "text-white/90";

/** YYYY.M.D（不補零） */
function fmtDateDot(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white/90">
      {children}
    </span>
  );
}

/** 單行卡片（值｜標籤）— 不換行，最小寬度 320px，避免被擠壓 */
function StatCardOneLine(props: { icon: JSX.Element; text: string }) {
  return (
    <div
      className={`${CARD_BG} ${CARD_BORDER} rounded-2xl px-5 py-4 flex items-center gap-3 shadow-md ring-1 ring-white/15 min-w-[320px]`}
    >
      <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white shrink-0">
        {props.icon}
      </div>
      <div className="text-lg md:text-xl font-semibold text-white tracking-tight whitespace-nowrap">
        {props.text}
      </div>
    </div>
  );
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-6 shadow-md ${props.className ?? ""}`}>{props.children}</div>;
}

function SectionTitle(props: { icon: JSX.Element; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white">{props.icon}</div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white">{props.title}</h2>
      </div>
      {props.subtitle ? <p className={`mt-2 ${TEXT_SOFT}`}>{props.subtitle}</p> : null}
    </div>
  );
}

function ExampleDisclosure({ ex, idx }: { ex: UboExample; idx: number }) {
  return (
    <details className={`${CARD_BG} ${CARD_BORDER} rounded-xl p-5 group shadow`}>
      <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 text-white grid place-items-center text-sm">{idx}</div>
          <h3 className="text-lg md:text-xl text-white font-semibold">{ex.titleZhCn || `示例 ${idx}`}</h3>
        </div>
        <Lucide.ChevronDown className="size-5 text-white/80 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-3">
        {ex.scenarioZhCn ? (
          <div className={`${TEXT_SOFT}`}>
            <PortableText value={ex.scenarioZhCn as TypedObject[]} components={ptComponents as any} />
          </div>
        ) : null}
        {ex.conclusionZhCn ? (
          <div className="pt-3 border-t border-white/15 text-white">
            <PortableText value={ex.conclusionZhCn as TypedObject[]} components={ptComponents as any} />
          </div>
        ) : null}
      </div>
    </details>
  );
}

function SideTOC() {
  const items = [
    { href: "#sec-why", label: "为何重要" },
    { href: "#sec-law", label: "法规依据" },
    { href: "#sec-criteria", label: "判定标准" },
    { href: "#sec-method", label: "计算与焦点" },
    { href: "#sec-examples", label: "常见案例" },
    { href: "#sec-advice", label: "实务建议" },
    { href: "#sec-end", label: "结语与联系" },
  ];
  return (
    <aside className="hidden lg:block lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-3">
        <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-4 shadow`}>
          <div className="text-white font-semibold mb-2 flex items-center gap-2">
            <Lucide.ListTree className="size-4" /> 内容索引
          </div>
          <nav className="flex flex-col gap-1">
            {items.map((it) => (
              <a key={it.href} href={it.href} className="text-white/80 hover:text-white transition-colors text-sm py-1">
                {it.label}
              </a>
            ))}
          </nav>
        </div>
        <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-4 shadow`}>
          <div className="text-white font-semibold mb-2 flex items-center gap-2">
            <Lucide.Info className="size-4" /> 小提醒
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            UBO 判定涉及持股、控制与实际受益。若结构多层且跨境，建议先做简化图再逐层回溯。
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ============================ PT ============================ */
const ptComponents = {
  block: ({ children }: any) => <p className="mb-3 leading-relaxed text-white/90">{children}</p>,
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 space-y-1 mb-3 text-white/90">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 space-y-1 mb-3 text-white/90">{children}</ol>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-white/90">{children}</em>,
    underline: ({ children }: any) => <span className="underline">{children}</span>,
    link: ({ value, children }: any) => (
      <a href={value?.href || "#"} className="underline decoration-white/40 hover:decoration-white text-white">
        {children}
      </a>
    ),
  },
};

/* ============================ Page ============================ */
export default async function Page() {
  const raw = (await sfetch(cnInvestmentUboGuideQuery)) as QueryResult;
  const doc: UboGuideDoc | null =
    raw && typeof raw === "object" && "doc" in raw ? (raw as { doc: UboGuideDoc | null }).doc : (raw as UboGuideDoc | null);

  if (!doc) notFound();
  const hero = doc.heroImage;

  return (
    // 整體底色更淡：從深藍過度到品牌藍（低不透明度）
    <div className={`min-h-screen flex flex-col ${notoSC.className} bg-gradient-to-b from-[#0E1B27] to-[#1C3D5A]/70`}>
      <Nav lang={PAGE_LANG} />

      {/* ============================ Hero ============================ */}
      <section className="relative w-full min-h-[60vh] grid place-items-center text-center text-white px-6 overflow-hidden">
        {hero?.url ? (
          <>
            <Image
              src={hero.url}
              alt={hero.alt || "UBO 判定指南"}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-90"
            />
            {/* 遮罩很淺：僅在底部加 25%，中段只 5% */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C3D5A]/5 to-[#1C3D5A]/25" />
          </>
        ) : null}

        {/* Hero 內容容器放大，避免撐不下 */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge><Lucide.ShieldCheck className="size-3.5" />陆资判定与 UBO</Badge>
            <Badge><Lucide.Scale className="size-3.5" />法规要点</Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            {doc.heroTitleZhCn || "实质受益人（UBO）判定指南"}
          </h1>
          {doc.heroSubtitleZhCn ? (
            <p className="mt-3 md:mt-4 text-base md:text-lg text-white/90">{doc.heroSubtitleZhCn}</p>
          ) : null}

          {/* 自適應網格：auto-fit + minmax(320px, 1fr)，每張卡至少 320px 且單行不換行 */}
          <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            <StatCardOneLine icon={<Lucide.BookCheck className="size-5" />} text="3+ 条｜核心规范与要点" />
            <StatCardOneLine icon={<Lucide.Network className="size-5" />} text="多层回溯｜跨层股权判定逻辑" />
            <StatCardOneLine icon={<Lucide.Clock className="size-5" />} text={`${fmtDateDot(doc.lastUpdatedAt) ?? "—"}｜最新更新`} />
          </div>
        </div>
      </section>

      {/* ============================ Main ============================ */}
      <main className="flex-grow px-6 py-12">
        <div className="mx-auto flex flex-col-reverse lg:flex-row gap-8 md:gap-10" style={{ maxWidth: CONTENT_MAX_W }}>
          {/* 主內容 */}
          <div className="flex-1 space-y-10">
            {doc.importanceZhCn ? (
              <section id="sec-why">
                <SectionTitle icon={<Lucide.Star className="size-5" />} title="一、为何「陆资身份判定」如此重要" />
                <Card>
                  <PortableText value={doc.importanceZhCn as TypedObject[]} components={ptComponents as any} />
                </Card>
              </section>
            ) : null}

            {doc.legalBasisZhCn ? (
              <section id="sec-law">
                <SectionTitle icon={<Lucide.Scroll className="size-5" />} title="二、法规依据" />
                <div className="grid md:grid-cols-2 gap-5">
                  <Card>
                    <div className="flex items-start gap-3">
                      <Lucide.FileText className="size-5 text-white/90 shrink-0 mt-0.5" />
                      <div className="space-y-3">
                        <PortableText value={doc.legalBasisZhCn as TypedObject[]} components={ptComponents as any} />
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <div className="flex items-start gap-3">
                      <Lucide.Lightbulb className="size-5 text-white/90 shrink-0 mt-0.5" />
                      <p className={`${TEXT_SOFT}`}>整理「条文要点」与「审查着眼」两栏，有助于加速文件准备。</p>
                    </div>
                  </Card>
                </div>
              </section>
            ) : null}

            {doc.ownershipThresholdZhCn || doc.controlCriteriaZhCn ? (
              <section id="sec-criteria">
                <SectionTitle icon={<Lucide.Funnel className="size-5" />} title="三、持股比例与控制能力标准" />
                <div className="grid md:grid-cols-2 gap-5">
                  {doc.ownershipThresholdZhCn ? (
                    <Card>
                      <div className="flex items-start gap-3">
                        <Lucide.Percent className="size-5 text-white/90 shrink-0 mt-0.5" />
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold">持股比例门槛</h3>
                          <PortableText value={doc.ownershipThresholdZhCn as TypedObject[]} components={ptComponents as any} />
                        </div>
                      </div>
                    </Card>
                  ) : null}
                  {doc.controlCriteriaZhCn ? (
                    <Card>
                      <div className="flex items-start gap-3">
                        <Lucide.SlidersHorizontal className="size-5 text-white/90 shrink-0 mt-0.5" />
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold">控制能力判断</h3>
                          <PortableText value={doc.controlCriteriaZhCn as TypedObject[]} components={ptComponents as any} />
                        </div>
                      </div>
                    </Card>
                  ) : null}
                </div>
              </section>
            ) : null}

            {doc.layeredCalculationZhCn || doc.uboFocusZhCn ? (
              <section id="sec-method">
                <SectionTitle icon={<Lucide.GitBranch className="size-5" />} title="四、计算方式与 UBO 焦点" />
                <div className="grid md:grid-cols-2 gap-5">
                  {doc.layeredCalculationZhCn ? (
                    <Card>
                      <div className="flex items-start gap-3">
                        <Lucide.GitCommitVertical className="size-5 text-white/90 shrink-0 mt-0.5" />
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold">多层回溯计算</h3>
                          <PortableText value={doc.layeredCalculationZhCn as TypedObject[]} components={ptComponents as any} />
                        </div>
                      </div>
                    </Card>
                  ) : null}
                  {doc.uboFocusZhCn ? (
                    <Card>
                      <div className="flex items-start gap-3">
                        <Lucide.Target className="size-5 text-white/90 shrink-0 mt-0.5" />
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold">审查焦点</h3>
                          <PortableText value={doc.uboFocusZhCn as TypedObject[]} components={ptComponents as any} />
                        </div>
                      </div>
                    </Card>
                  ) : null}
                </div>
              </section>
            ) : null}

            {Array.isArray(doc.examples) && doc.examples.length > 0 ? (
              <section id="sec-examples">
                <SectionTitle icon={<Lucide.CaseSensitive className="size-5" />} title="五、常见判定示例" />
                <div className="space-y-4">
                  {doc.examples.map((ex, i) => (
                    <ExampleDisclosure key={i} ex={ex} idx={i + 1} />
                  ))}
                </div>
              </section>
            ) : null}

            {Array.isArray(doc.practicalAdvice) && doc.practicalAdvice.length > 0 ? (
              <section id="sec-advice">
                <SectionTitle icon={<Lucide.Hammer className="size-5" />} title="六、实务建议" />
                <div className="grid md:grid-cols-2 gap-5">
                  {doc.practicalAdvice.map((p, i) => (
                    <Card key={i}>
                      <div className="flex items-start gap-3">
                        <Lucide.CheckCircle2 className="size-5 text-white shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          {p.labelZhCn ? <h3 className="text-white font-semibold">{p.labelZhCn}</h3> : null}
                          {p.bodyZhCn ? (
                            <div className={`${TEXT_SOFT}`}>
                              <PortableText value={p.bodyZhCn as TypedObject[]} components={ptComponents as any} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null}

            {doc.conclusionZhCn || doc.contact ? (
              <section id="sec-end">
                <SectionTitle icon={<Lucide.MessageSquare className="size-5" />} title="七、结语与联系" />
                <div className="grid md:grid-cols-3 gap-5">
                  <Card className="md:col-span-2">
                    {doc.conclusionZhCn ? (
                      <PortableText value={doc.conclusionZhCn as TypedObject[]} components={ptComponents as any} />
                    ) : (
                      <p className={`${TEXT_SOFT}`}>如需更多信息，欢迎与我们联系。</p>
                    )}
                  </Card>
                  {doc.contact ? (
                    <Card>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <Lucide.LifeBuoy className="size-5" />
                          联系我们
                        </div>
                        {doc.contact.email ? (
                          <p className={`${TEXT_SOFT}`}>
                            <span className="inline-flex items-center gap-2">
                              <Lucide.Mail className="size-4" />
                              <a className="underline" href={`mailto:${doc.contact.email}`}>
                                {doc.contact.email}
                              </a>
                            </span>
                          </p>
                        ) : null}
                        {doc.contact.lineId ? (
                          <p className={`${TEXT_SOFT}`}>
                            <span className="inline-flex items-center gap-2">
                              <Lucide.MessageCircle className="size-4" />
                              LINE：<span className="font-mono">{doc.contact.lineId}</span>
                            </span>
                          </p>
                        ) : null}
                        {doc.contact.contactNoteZhCn ? (
                          <div className="pt-2 border-t border-white/15">
                            <PortableText value={doc.contact.contactNoteZhCn as TypedObject[]} components={ptComponents as any} />
                          </div>
                        ) : null}
                      </div>
                    </Card>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          {/* 右側索引（桌機顯示） */}
          <SideTOC />
        </div>
      </main>

      <Footer lang={PAGE_LANG} />
    </div>
  );
}
