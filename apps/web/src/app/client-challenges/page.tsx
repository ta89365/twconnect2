// apps/web/src/app/client-challenges/page.tsx
export const dynamic = "force-dynamic";

import React from "react";
import {
  Building2,
  Landmark,
  Scale,
  BadgeCheck,
  Globe2,
  FileText,
  Calculator,
  Handshake,
  Sparkles,
  ArrowRight,
  Languages,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { clientChallengesSectionDetailByLang } from "@/lib/queries/clientChallengesSectionDetail";
import { PortableText, PortableTextComponents } from "@portabletext/react";

const BRAND_BLUE = "#1C3D5A";
type Lang = "zh" | "jp" | "en";

function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "zh";
}

/* =========================
   Portable Text 工具
   ========================= */
function mkBlock(text: string) {
  return {
    _type: "block",
    style: "normal",
    markDefs: [] as any[],
    children: [{ _type: "span", text, marks: [] as any[] }],
  };
}
function toPT(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") return [mkBlock(value)];
  if (Array.isArray(value)) return value;
  return null;
}
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-white/95 leading-relaxed">{children}</p>,
  },
};
const PT: React.FC<{ value: any }> = ({ value }) => {
  const v = toPT(value);
  if (!v) return null;
  return (
    <div className="prose prose-invert max-w-none">
      <PortableText value={v} components={ptComponents} />
    </div>
  );
};

/* =========================
   型別
   ========================= */
type Img = { url?: string | null; alt?: string | null };
type ChallengeDoc = { _key: string; title?: string | null; content?: any; tip?: any; image?: Img | null; };
type FeatureDoc = { _key: string; icon?: string | null; title?: string | null; description?: any; image?: Img | null; };
type ContactSection = { linkedin?: string | null; line?: string | null; note?: any };
type PageDoc = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: Img | null;
  intro?: any;
  mediaGallery?: Img[] | null;
  challenges?: ChallengeDoc[] | null;
  conclusion?: any;
  companyIntro?: any;
  features?: FeatureDoc[] | null;
  contactSection?: ContactSection | null;
};

/* =========================
   Icon Map
   ========================= */
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
};
type IconKey = keyof typeof iconMap;
const challengeIconCycle: IconKey[] = [
  "building-2",
  "landmark",
  "calculator",
  "badge-check",
  "handshake",
  "scale",
  "globe-2",
  "file-text",
  "sparkles",
];

/* =========================
   小元件
   ========================= */
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`rounded-2xl p-6 md:p-8 bg-white/10 border border-white/10 backdrop-blur ${className}`}>{children}</div>
);

const SectionTitle: React.FC<{ overline?: string; title?: string; desc?: string }> = ({ overline, title, desc }) => (
  <div className="space-y-2">
    {overline && <div className="inline-flex items-center gap-2 text-xs tracking-wider text-white/70">
      <span className="h-px w-6 bg-white/30" />{overline}</div>}
    {title && <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>}
    {desc && <p className="text-white/85">{desc}</p>}
  </div>
);

const MediaStrip: React.FC<{ items?: Img[] | null }> = ({ items }) => {
  if (!items?.length) return null;
  return (
    <div className="mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-3 min-w-max">
        {items.map((m, i) => (
          <div key={i} className="relative h-24 w-40 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {m.url ? (
              <Image src={m.url} alt={m.alt ?? ""} fill className="object-cover" sizes="160px" />
            ) : (
              <div className="h-full flex items-center justify-center text-white/60"><ImageIcon className="h-6 w-6" /></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================
   Page 主體
   ========================= */
export default async function ClientChallengesPage(props: {
  searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
}) {
// 先把 searchParams 解成普通物件，再只把 lang 丟進 resolveLang
const spResolved: Record<string, string | string[] | undefined> =
  typeof (props.searchParams as any)?.then === "function"
    ? await (props.searchParams as Promise<Record<string, string | string[] | undefined>>)
    : ((props.searchParams || {}) as Record<string, string | string[] | undefined>);

const lang = resolveLang({ lang: spResolved.lang });


  const data = (await sfetch<PageDoc>(clientChallengesSectionDetailByLang, { lang })) as PageDoc;

  return (
    <div style={{ backgroundColor: BRAND_BLUE }} className="min-h-screen text-white">
      <NavigationServer lang={lang} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {data.heroImage?.url && (
          <Image src={data.heroImage.url} alt={data.heroImage.alt ?? ""} fill className="absolute inset-0 object-cover opacity-25" />
        )}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-5 md:space-y-6">
              {data.heroTitle && <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{data.heroTitle}</h1>}
              {data.heroSubtitle && <p className="text-white/90 text-base md:text-lg max-w-2xl">{data.heroSubtitle}</p>}
            </div>

            {(data.intro || data.mediaGallery?.length) && (
              <Card className="md:max-w-sm w-full">
                {data.intro && <PT value={data.intro} />}
                <MediaStrip items={data.mediaGallery} />
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Challenges */}
      {!!data.challenges?.length && (
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <SectionTitle
              overline="CHALLENGES"
              title={lang === "jp" ? "台湾進出でつまずきやすいポイント" : lang === "en" ? "Common Pitfalls When Entering Taiwan" : "最常見的五個難點"}
            />
            <div className="mt-8 grid md:grid-cols-2 gap-6 lg:gap-8">
              {data.challenges.map((c, i) => {
                const Icon = iconMap[challengeIconCycle[i % challengeIconCycle.length]];
                return (
                  <Card key={c._key}>
                    <div className={c.image?.url ? "grid md:grid-cols-[1fr_180px] gap-4" : "flex gap-4"}>
                      <div className="flex gap-4">
                        <div className="rounded-2xl bg-white/15 p-3 border border-white/10">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          {c.title && <h3 className="text-lg font-semibold">{c.title}</h3>}
                          <PT value={c.content} />
                          {c.tip && (
                            <div className="mt-2 rounded-xl bg-white/5 p-3 border border-white/10">
                              <PT value={c.tip} />
                            </div>
                          )}
                        </div>
                      </div>
                      {c.image?.url && (
                        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-white/10">
                          <Image src={c.image.url} alt={c.image.alt ?? ""} fill className="object-cover" sizes="180px" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Company Intro + Conclusion */}
      {(data.companyIntro || data.conclusion) && (
        <section>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-6">
            {data.companyIntro && <Card><PT value={data.companyIntro} /></Card>}
            {data.conclusion && <Card><PT value={data.conclusion} /></Card>}
          </div>
        </section>
      )}

      {/* Features */}
      {!!data.features?.length && (
        <section>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <SectionTitle
              overline="STRENGTHS"
              title={lang === "jp" ? "Taiwan Connect の強み" : lang === "en" ? "Why Choose Taiwan Connect" : "我們的優勢"}
            />
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.features.map((f) => {
                const Icon = f.icon && f.icon in iconMap ? iconMap[f.icon as IconKey] : null;
                return (
                  <Card key={f._key}>
                    <div className="flex gap-4">
                      {f.image?.url ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10">
                          <Image src={f.image.url} alt={f.image.alt ?? ""} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : Icon ? (
                        <div className="rounded-2xl bg-white/15 p-3 border border-white/10"><Icon className="w-6 h-6" /></div>
                      ) : f.icon ? (
                        <div className="rounded-2xl bg-white/15 p-3 border border-white/10 text-lg">{f.icon}</div>
                      ) : null}
                      <div className="space-y-2">
                        {f.title && <h4 className="text-base font-semibold">{f.title}</h4>}
                        <PT value={f.description} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {data.contactSection && (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <PT value={data.contactSection.note} />
                <div className="flex gap-3">
                  {data.contactSection.linkedin && (
                    <a href={data.contactSection.linkedin} target="_blank" rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold border border-white/10 hover:opacity-90">
                      LinkedIn
                    </a>
                  )}
                  {data.contactSection.line && (
                    <a href={data.contactSection.line} target="_blank" rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20">
                      LINE
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      <FooterServer lang={lang} />
    </div>
  );
}
