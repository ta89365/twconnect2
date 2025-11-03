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

const PAGE_LANG = "zh-cn" as const; // ✅ 本頁固定顯示簡中
const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = 1100; // 視覺更大器

const notoSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

/* ============================ Types ============================ */
type PT = TypedObject[];

interface UboExample {
  titleZhCn?: string | null;
  scenarioZhCn?: PT | null;
  conclusionZhCn?: PT | null;
}

interface UboAdvice {
  labelZhCn?: string | null;
  bodyZhCn?: PT | null;
}

interface UboContact {
  email?: string | null;
  lineId?: string | null;
  contactNoteZhCn?: PT | null;
}

interface UboHeroImage {
  assetId?: string | null;
  url?: string | null;
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  lqip?: string | null;
}

interface UboGuideDoc {
  _id: string;
  slug?: string | null;

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

// 兼容你原註解：但本頁仍採 notFound，資料源不改
type QueryResult = { doc: UboGuideDoc | null } | UboGuideDoc | null;

/* 用型別斷言包裝 async Server Component，避免 TS2786 提示 */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ 視覺元件 ============================ */
const CARD_BG = "bg-white/10";
const CARD_BORDER = "border border-white/15";
const TEXT_SOFT = "text-white/90";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/90">
      {children}
    </span>
  );
}

function StatCard(props: { icon: JSX.Element; label: string; value: string }) {
  return (
    <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-5 flex gap-4 items-start`}>
      <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white">{props.icon}</div>
      <div>
        <div className="text-3xl font-semibold text-white tracking-tight">{props.value}</div>
        <div className={`mt-1 ${TEXT_SOFT}`}>{props.label}</div>
      </div>
    </div>
  );
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-6 ${props.className ?? ""}`}>{props.children}</div>;
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
    <details className={`${CARD_BG} ${CARD_BORDER} rounded-xl p-5 group`}>
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
        <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-4`}>
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
        <div className={`${CARD_BG} ${CARD_BORDER} rounded-2xl p-4`}>
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

/* ============================ PortableText 渲染器 ============================ */
/** 更友善的白色系樣式，並兼容未知 style 避免錯誤 */
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

  // 兼容兩種回傳：直接 doc 或 { doc }
  const doc: UboGuideDoc | null =
    raw && typeof raw === "object" && "doc" in raw ? (raw as { doc: UboGuideDoc | null }).doc : (raw as UboGuideDoc | null);

  if (!doc) notFound();

  const hero = doc.heroImage;

  return (
    <div className={`min-h-screen flex flex-col ${notoSC.className}`} style={{ backgroundColor: BRAND_BLUE }}>
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
              className="object-cover opacity-30"
            />
            {/* 漸層遮罩，讓標題可讀性更好 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C3D5A]/40 to-[#1C3D5A]" />
          </>
        ) : null}

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge>
              <Lucide.ShieldCheck className="size-3.5" />
              陆资判定与 UBO
            </Badge>
            <Badge>
              <Lucide.Scale className="size-3.5" />
              法规要点
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            {doc.heroTitleZhCn || "实质受益人（UBO）判定指南"}
          </h1>
          {doc.heroSubtitleZhCn ? <p className="mt-3 md:mt-4 text-base md:text-lg text-white/90">{doc.heroSubtitleZhCn}</p> : null}

          {/* 三個節奏卡（靜態標示，不動資料源） */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={<Lucide.BookCheck className="size-5" />} label="核心规范与要点" value="3+ 条" />
            <StatCard icon={<Lucide.Network className="size-5" />} label="跨层持股判定维度" value="多层回溯" />
            <StatCard icon={<Lucide.Clock className="size-5" />} label="更新时间" value={doc.lastUpdatedAt ? new Date(doc.lastUpdatedAt).toLocaleDateString() : "—"} />
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
