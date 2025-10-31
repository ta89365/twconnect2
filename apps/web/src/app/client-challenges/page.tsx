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
} from "lucide-react";
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
   Portable Text 正規化工具
   ========================= */

// 把字串轉成標準 PT block
function mkBlock(text: string) {
  return {
    _type: "block",
    style: "normal",
    markDefs: [] as any[],
    children: [{ _type: "span", text, marks: [] as any[] }],
  };
}

// 將輸入 value 強制轉為「乾淨的 PT 陣列或 null」
function toPT(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") return [mkBlock(value)];
  if (Array.isArray(value)) {
    const cleaned = value
      .filter((v) => v && typeof v === "object" && "_type" in (v as any))
      .map((v) => {
        const b = v as any;
        // 防破損：block 缺 children 或 style 時補上
        if (b._type === "block") {
          if (!Array.isArray(b.children)) b.children = [];
          if (!b.style) b.style = "normal";
          if (!Array.isArray(b.markDefs)) b.markDefs = [];
        }
        return b;
      });
    return cleaned.length ? cleaned : null;
  }
  // 其他型別直接忽略
  return null;
}

// 輕量 PT 元件，預設只處理段落與 span
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-white/95 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1">{children}</ol>
    ),
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

type ChallengeDoc = {
  _key: string;
  order?: number | null;
  title?: string | null;
  content?: any; // PT 或 string
  tip?: any; // PT 或 string
};

type FeatureDoc = {
  _key: string;
  icon?: string | null; // lucide key 或 emoji
  title?: string | null;
  description?: any; // PT 或 string
};

type ContactSection = {
  linkedin?: string | null;
  line?: string | null;
  note?: any; // PT 或 string
};

type PageDoc = {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: { url?: string | null; alt?: string | null } | null;
  intro?: any;
  challenges?: ChallengeDoc[] | null;
  conclusion?: any;
  companyIntro?: any;
  features?: FeatureDoc[] | null;
  contactSection?: ContactSection | null;
};

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

const challengeIconCycle: (keyof typeof iconMap)[] = [
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

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  className = "",
  children,
}) => (
  <div className={`rounded-2xl shadow-lg p-6 md:p-8 bg-white/10 border border-white/10 ${className}`}>
    {children}
  </div>
);

export default async function ClientChallengesPage(props: {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}) {
  // await searchParams 再取 lang
  const sp =
    typeof (props.searchParams as any)?.then === "function"
      ? await (props.searchParams as Promise<Record<string, string | string[] | undefined>>)
      : (props.searchParams as Record<string, string | string[] | undefined>);

  const lang = resolveLang(sp);

  // Sanity 取數據
  const data = (await sfetch<PageDoc>(clientChallengesSectionDetailByLang, { lang })) as PageDoc;

  return (
    <div style={{ backgroundColor: BRAND_BLUE }} className="min-h-screen text-white">
      <NavigationServer lang={lang} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 md:pt-20 md:pb-12">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4 md:space-y-5">
              {data.heroTitle && (
                <h1 className="text-2xl md:text-4xl font-bold leading-snug">{data.heroTitle}</h1>
              )}
              {data.heroSubtitle && (
                <p className="text-white/90 text-base md:text-lg">{data.heroSubtitle}</p>
              )}

              {/* 語言切換：站內連結務必附上 ?lang=${lang} */}
              <div className="flex gap-2">
                {(["jp", "zh", "en"] as Lang[]).map((l) => (
                  <a
                    key={l}
                    href={`/client-challenges?lang=${l}`}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border ${
                      lang === l
                        ? "bg-white text-slate-900 border-white/10"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    {l.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            {data.heroImage?.url ? (
              <div className="shrink-0 rounded-2xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.heroImage.url}
                  alt={data.heroImage.alt ?? ""}
                  className="w-56 h-40 object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* Intro */}
          <div className="mt-8">
            <PT value={data.intro} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </section>

      {/* Challenges */}
      {!!data.challenges?.length && (
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {data.challenges.map((c, idx) => {
                const iconKey = challengeIconCycle[idx % challengeIconCycle.length];
                const Icon = iconMap[iconKey];
                return (
                  <div key={c._key ?? idx}>
                    <Card className="h-full">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-2xl bg-white/15 p-3 border border-white/10">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-3">
                          {c.title && (
                            <h3 className="text-lg md:text-xl font-semibold">{c.title}</h3>
                          )}
                          <PT value={c.content} />
                          {c.tip && (
                            <div className="mt-2 rounded-xl bg-white/5 p-4 border border-white/10">
                              <PT value={c.tip} />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
        </section>
      )}

      {/* Company Intro + Conclusion */}
      {(data.companyIntro || data.conclusion) && (
        <section>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
            {data.companyIntro && (
              <Card>
                <PT value={data.companyIntro} />
              </Card>
            )}
            {data.conclusion && (
              <Card>
                <PT value={data.conclusion} />
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      {!!data.features?.length && (
        <section>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {data.features.map((f) => {
                const maybeLucide =
                  f.icon && f.icon in iconMap ? (f.icon as keyof typeof iconMap) : null;
                const Icon = maybeLucide ? iconMap[maybeLucide] : null;
                return (
                  <Card key={f._key}>
                    <div className="flex items-start gap-4">
                      {Icon ? (
                        <div className="shrink-0 rounded-2xl bg-white/15 p-3 border border-white/10">
                          <Icon className="w-6 h-6" />
                        </div>
                      ) : f.icon ? (
                        <div className="shrink-0 rounded-2xl bg-white/15 p-3 border border-white/10">
                          <span className="text-lg" aria-hidden>
                            {f.icon}
                          </span>
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        {f.title && (
                          <h4 className="text-base md:text-lg font-semibold">{f.title}</h4>
                        )}
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
                <div className="space-y-2">
                  <PT value={data.contactSection.note} />
                </div>
                <div className="flex items-center gap-3">
                  {data.contactSection.linkedin && (
                    <a
                      href={data.contactSection.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold border border-white/10 hover:opacity-90"
                    >
                      LinkedIn
                    </a>
                  )}
                  {data.contactSection.line && (
                    <a
                      href={data.contactSection.line}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20"
                    >
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
