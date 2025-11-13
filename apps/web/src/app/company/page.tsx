// apps/web/src/app/company/page.tsx
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import Image from "next/image";
import React from "react";

import { sfetch } from "@/lib/sanity/fetch";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";
import {
  companyOverviewByLang,
  type CompanyOverviewData,
} from "@/lib/queries/companyOverview";

// ✅ lucide 圖示
import {
  Building2,
  IdCard,
  ListChecks,
  MapPin,
  Quote,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

type Lang = "jp" | "zh" | "en";

type SiteSettingsData = {
  navigation?: {
    label?: string;
    href?: string;
    external?: boolean;
    order?: number;
  }[];
  logoUrl?: string | null;
  logoText?: string | null;
  title?: string | null;
};

type CompanyInfoSafe = {
  companyName?: string;
  representative?: string;
  activities?: string[];
  addressJapan?: string;
  addressTaiwan?: string;
};

/* ===== Lang helpers ===== */
function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  if (s === "zh") return "zh";
  if (s === "en") return "en";
  if (s === "jp") return "jp";
  return "jp";
}

/* ===== Tunables ===== */
const HERO_TUNE = {
  BG_POS_X_PERCENT: 50,
  BG_POS_Y_PERCENT: 50,
  MIN_HEIGHT_PX: 420,
  PADDING_TOP_PX: 80,
  PADDING_BOTTOM_PX: 56,
} as const;

// 字級比例（baseline 15 → md 16）
const TYPO = {
  base: "text-[15px] md:text-[16px] leading-7 md:leading-7",
  h1: "text-[28px] md:text-[36px] lg:text-[40px] font-extrabold",
  h2: "text-[23px] md:text-[27px] lg:text-[30px] font-bold",
  h3: "text-[18px] md:text-[20px] font-semibold",
  smallCaps: "text-[11px] tracking-[0.22em]",
  cardBody: "text-[15px] leading-7",
} as const;

type SimpleChild = { _type?: "span"; text?: string; marks?: string[] };
type SimpleLinkDef = { _key: string; _type?: "link"; href: string; blank?: boolean };
type SimpleBlock = {
  _type?: "block";
  style?: "normal" | string;
  children?: SimpleChild[];
  markDefs?: SimpleLinkDef[];
};

const BRAND_DARK = "#1C3D5A";
const container = "container mx-auto max-w-[800px] px-4 sm:px-5";
const card = "rounded-2xl bg-white/5 border border-white/15 shadow-lg";
const thickDivider = "my-10 h-[2px] w-full bg-white/20";

function isValidSrc(s?: string | null) {
  if (!s) return false;
  const v = String(s).trim();
  return !!v && v.toLowerCase() !== "null" && v.toLowerCase() !== "undefined";
}
function isInternalHref(href: string) {
  if (!href) return false;
  if (href.startsWith("//")) return false;
  return href.startsWith("/") || (!href.startsWith("http://") && !href.startsWith("https://"));
}

function PortableParagraphs({
  blocks,
  lang,
}: {
  blocks?: SimpleBlock[] | null;
  lang: Lang;
}) {
  if (!blocks?.length) return null;
  return (
    <div className={TYPO.cardBody + " text-slate-200"}>
      {blocks.map((b, i) => {
        const linkMap = new Map<string, SimpleLinkDef>();
        b.markDefs?.forEach((d) => linkMap.set(d._key, d));
        const children = b.children ?? [];
        return (
          <p key={i} className="whitespace-pre-wrap mb-3 last:mb-0">
            {children.map((ch, j) => {
              const text = ch?.text ?? "";
              if (!text) return null;
              let node: React.ReactNode = text;
              (ch?.marks ?? []).forEach((m) => {
                const def = linkMap.get(m);
                if (def?.href) {
                  let finalHref = def.href;
                  if (isInternalHref(finalHref)) {
                    const join = finalHref.includes("?") ? "&" : "?";
                    finalHref = `${finalHref}${join}lang=${lang}`;
                  }
                  node = (
                    <a
                      key={`${i}-${j}-${m}`}
                      href={finalHref}
                      target={def.blank ? "_blank" : undefined}
                      rel={def.blank ? "noreferrer" : undefined}
                      className="underline decoration-white/40 underline-offset-4 hover:text-white"
                    >
                      {node}
                    </a>
                  );
                }
              });
              return <React.Fragment key={j}>{node}</React.Fragment>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function RepMessageBlocks({ blocks }: { blocks?: SimpleBlock[] | null }) {
  if (!blocks?.length) return null;
  return (
    <div className={TYPO.cardBody + " text-slate-200 space-y-3"}>
      {blocks.map((b, i) => {
        const text = (b.children ?? []).map((c) => c.text ?? "").join("");
        return <p key={i} className="whitespace-pre-wrap">{text}</p>;
      })}
    </div>
  );
}

/* ===== 小元件：標題左側帶小圖示 ===== */
function HeadingIcon({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-[14px] w-[14px] opacity-90" />
      </span>
      <span>{children}</span>
    </div>
  );
}

/* ===== Page ===== */
export default async function CompanyPage({
  searchParams,
}: {
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  const lang = resolveLang(spRaw);

  const [site, company] = await Promise.all([
    sfetch<SiteSettingsData>(siteSettingsByLang, { lang }),
    sfetch<CompanyOverviewData>(companyOverviewByLang, { lang }),
  ]);

  const cinfo = ((company as any)?.companyInfo ?? {}) as CompanyInfoSafe;

  // brand 給 Footer 用（Header 交給共用 NavigationServer 自己處理）
  const candidateLogoCompany = (company as any)?.logo?.url || "";
  const candidateLogoSite = (typeof site?.logoUrl === "string" ? site.logoUrl : "") || "";
  const navLogoUrl =
    (isValidSrc(candidateLogoCompany) && candidateLogoCompany) ||
    (isValidSrc(candidateLogoSite) && candidateLogoSite) ||
    "/logo.png";
  const displayCompanyName: string =
    (company as any)?.logoText || site?.logoText || site?.title || "Taiwan Connect";

  // i18n labels
  const heroSmallLabel =
    lang === "jp" ? "会社概要" : lang === "zh" ? "公司概要" : "Company Overview";
  const missionLabel =
    lang === "jp" ? "経営理念" : lang === "zh" ? "經營理念" : "Our Purpose";
  const repLabel =
    lang === "jp" ? "代表者メッセージ" : lang === "zh" ? "代表者訊息" : "Representative Message";
  const companyInfoLabel =
    lang === "jp" ? "会社情報" : lang === "zh" ? "公司資訊" : "Company Information";
  const leadershipLabel =
    lang === "jp" ? "創業者・代表" : lang === "zh" ? "創辦人代表" : "Founder & Representative";
  const founderBioLabel =
    lang === "jp" ? "創業者紹介" : lang === "zh" ? "創辦人介紹" : "About the Founder";
  const cofounderBioLabel =
    lang === "jp" ? "共同創業者略歴" : lang === "zh" ? "共同創辦人詳細經歷" : "Co-Founder Long Biography";

  const heroBg = company?.topImage?.url || "";

  /* Founder */
  const founder = company?.founder ?? null;
  const fName =
    lang === "jp" ? founder?.name?.jp : lang === "zh" ? founder?.name?.zh : founder?.name?.en;
  const fTitle =
    lang === "jp" ? founder?.title?.jp : lang === "zh" ? founder?.title?.zh : founder?.title?.en;
  const fPhoto = founder?.photo?.url;
  const fPhotoAlt = founder?.photo?.alt ?? fName ?? "Founder";
  const fBioBlocks = (founder as any)?.bioLong?.[lang] as SimpleBlock[] | undefined;

  /* Co-Founder */
  const coFounder = company?.coFounder ?? null;
  const cName =
    lang === "jp" ? coFounder?.name?.jp : lang === "zh" ? coFounder?.name?.zh : coFounder?.name?.en;
  const cTitle =
    lang === "jp" ? coFounder?.title?.jp : lang === "zh" ? coFounder?.title?.zh : coFounder?.title?.en;
  const cPhoto = coFounder?.photo?.url;
  const cPhotoAlt = coFounder?.photo?.alt ?? cName ?? "Co-Founder";
  const cBioBlocks = (coFounder as any)?.bioLong?.[lang] as SimpleBlock[] | undefined;

  return (
    <main className={`${TYPO.base} bg-[#1C3D5A] text-slate-100 tracking-[0.01em]`}>
      {/* Header：改用共用 NavigationServer，保持與其他頁一致 */}
      <div className="w-full border-b border-white/15">
        <NavigationServer lang={lang} />
      </div>

      {/* Hero */}
      <section
        className="relative w-full"
        style={{
          background: heroBg
            ? `linear-gradient(0deg, rgba(10,25,40,0.55) 0%, rgba(10,25,40,0.35) 60%, rgba(10,25,40,0.15) 100%), url('${heroBg}') no-repeat`
            : BRAND_DARK,
          backgroundSize: heroBg ? "cover" : undefined,
          backgroundPosition: `${HERO_TUNE.BG_POS_X_PERCENT}% ${HERO_TUNE.BG_POS_Y_PERCENT}%`,
          minHeight: `${HERO_TUNE.MIN_HEIGHT_PX}px`,
        }}
      >
        <div
          className={container}
          style={{
            paddingTop: HERO_TUNE.PADDING_TOP_PX,
            paddingBottom: HERO_TUNE.PADDING_BOTTOM_PX,
            maxWidth: "800px",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-6">
          <div className={`${container} text-center`}>
            <span
              className={`${TYPO.h1} inline-block text-white`}
              style={{ textShadow: "0 2px 10px rgba(0,0,0,.45)" }}
            >
              {heroSmallLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="py-12 md:py-14">
        <div className={container}>
          <h2 className={`${TYPO.h2} text-center`}>Our Purpose</h2>
          <div className={`${TYPO.smallCaps} text-slate-300 text-center mt-1`}>
            MISSION / VISION / VALUE
          </div>
          <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

          {/* Mission */}
          <div className={`${card} p-4 md:p-5 mt-6`}>
            <div className={`${TYPO.h3}`}>
              <HeadingIcon icon={UserRound}>
                {missionLabel === "Our Purpose"
                  ? "Mission"
                  : missionLabel === "經營理念"
                  ? "使命"
                  : "ミッション"}
              </HeadingIcon>
            </div>
            <div className="mt-3">
              <PortableParagraphs blocks={company?.mission as any} lang={lang} />
            </div>
          </div>

          {/* Vision */}
          <div className={`${card} p-4 md:p-5 mt-6`}>
            <div className={`${TYPO.h3}`}>
              <HeadingIcon icon={Quote}>
                {lang === "jp" ? "ビジョン" : lang === "zh" ? "願景" : "Vision"}
              </HeadingIcon>
            </div>
            <div className="mt-3">
              <PortableParagraphs blocks={company?.vision as any} lang={lang} />
            </div>
          </div>

          {/* Values */}
          <div className="mt-8">
            <div className={`${TYPO.h3}`}>
              <HeadingIcon icon={ListChecks}>
                {lang === "jp" ? "バリュー" : lang === "zh" ? "核心價值" : "Values"}
              </HeadingIcon>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {(company?.values ?? []).map((v: any, idx: number) => (
                <div
                  key={`${v?.key ?? "v"}-${idx}`}
                  className="rounded-2xl bg-white/5 border border-white/15 p-4 md:p-5 shadow-md flex gap-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#1C3D5A] font-semibold">
                    {(v?.order as number) > 0 ? v.order : idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{v?.title}</div>
                    <div className="text-slate-300 mt-1">{v?.descLong}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      {(fBioBlocks?.length || cBioBlocks?.length) && (
        <section className="py-12 md:py-14">
          <div className={container}>
            <h2 className={`${TYPO.h2} text-center`}>{leadershipLabel}</h2>
            <div className={`${TYPO.smallCaps} text-slate-300 text-center mt-1`}>
              LEADERSHIP
            </div>
            <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

            {/* Founder */}
            {fBioBlocks?.length ? (
              <div className="mt-7 grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-6 items-stretch">
                <div className="lg:col-span-2 h-full relative rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-white/5">
                  <Image
                    src={isValidSrc(fPhoto) ? fPhoto! : "/logo.png"}
                    alt={fPhotoAlt}
                    fill
                    sizes="(max-width:1024px) 100vw, 420px"
                    className="object-cover object-[50%_12%]"
                  />
                  {(fTitle || fName) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0D2436]/70 to-transparent p-3 text-sm text-white/90">
                      <span className="font-medium">{fName}</span>
                      {fTitle ? (
                        <span className="ml-2 text-white/75">{fTitle}</span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-3 h-full rounded-2xl bg-white/5 border border-white/15 p-4 md:p-5 shadow-lg">
                  <div className={`${TYPO.h3}`}>
                    <HeadingIcon icon={UserRound}>{founderBioLabel}</HeadingIcon>
                  </div>
                  <div className="mt-3">
                    <PortableParagraphs blocks={fBioBlocks} lang={lang} />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Co-Founder */}
            {cBioBlocks?.length ? (
              <>
                <div className={thickDivider} />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-6 items-stretch">
                  <div className="lg:col-span-2 order-last lg:order-first rounded-2xl bg白/5 border border-white/15 p-4 md:p-5 shadow-lg">
                    <div className={`${TYPO.h3}`}>
                      <HeadingIcon icon={UserRound}>{cofounderBioLabel}</HeadingIcon>
                    </div>
                    <div className="mt-3">
                      <PortableParagraphs blocks={cBioBlocks} lang={lang} />
                    </div>
                    {(cTitle || cName) && (
                      <div className="mt-5 text-slate-200">
                        {cTitle && <span className="mr-2">{cTitle}</span>}
                        {cName}
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-3 order-first lg:order-last relative h-full rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-white/5">
                    <Image
                      src={isValidSrc(cPhoto) ? cPhoto! : "/logo.png"}
                      alt={cPhotoAlt}
                      fill
                      sizes="(max-width:1024px) 100vw, 520px"
                      className="object-cover object-[50%_12%]"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}

      {/* Representative Message */}
      {(company?.repMessageLong || company?.repMessageShort) && (
        <section className="py-12 md:py-14">
          <div className={container}>
            <h2 className={`${TYPO.h2} text-center`}>{repLabel}</h2>
            <div className={`${TYPO.smallCaps} text-slate-300 text-center mt-1`}>
              MESSAGE
            </div>
            <div className="mx-auto mt-2 h-px w-12 bg白/30" />

            <div className={`${card} p-4 md:p-5 mt-7`}>
              <RepMessageBlocks blocks={company?.repMessageLong as any} />

              {company?.repMessageShort ? (
                <div
                  className="mt-4 rounded-xl bg-white/7 p-3.5 border border-white/10 text-slate-200 text-[16px] leading-8 shadow-inner"
                  style={{
                    fontFamily:
                      "'Bradley Hand', 'Segoe Script', 'Comic Sans MS', 'DFKai-SB', 'KaiTi', 'Yu Mincho', cursive",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {company.repMessageShort}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* Company Info */}
      <section className="py-12 md:py-14">
        <div className={container}>
          <h2 className={`${TYPO.h2} text-center`}>{companyInfoLabel}</h2>
          <div className={`${TYPO.smallCaps} text-slate-300 text-center mt-1`}>
            COMPANY
          </div>
          <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

          {!!company?.companyInfo && (
            <div className={`${card} p-4 md:p-5 mt-7`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-6 text-slate-100">
                {!!cinfo.companyName && (
                  <>
                    <div className="text-slate-300 text-[14px] flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                        <Building2 className="h-[14px] w-[14px]" />
                      </span>
                      {lang === "jp"
                        ? "会社名"
                        : lang === "zh"
                        ? "公司名稱"
                        : "Company Name"}
                    </div>
                    <div className="sm:col-span-2">{cinfo.companyName}</div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border-white/10" />
                  </>
                )}

                {!!cinfo.representative && (
                  <>
                    <div className="text-slate-300 text-[14px] flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg白/10">
                        <IdCard className="h-[14px] w-[14px]" />
                      </span>
                      {lang === "jp"
                        ? "代表"
                        : lang === "zh"
                        ? "代表人"
                        : "Representative"}
                    </div>
                    <div className="sm:col-span-2">{cinfo.representative}</div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border白/10" />
                  </>
                )}

                {Array.isArray(cinfo.activities) && cinfo.activities.length > 0 && (
                  <>
                    <div className="text-slate-300 text-[14px] flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg白/10">
                        <ListChecks className="h-[14px] w-[14px]" />
                      </span>
                      {lang === "jp"
                        ? "事業内容"
                        : lang === "zh"
                        ? "主要業務"
                        : "Business Activities"}
                    </div>
                    <div className="sm:col-span-2">
                      <ul className="list-disc pl-6 text-[15px] leading-7 text-slate-200">
                        {cinfo.activities.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border白/10" />
                  </>
                )}

                {!!cinfo.addressJapan && (
                  <>
                    <div className="text-slate-300 text-[14px] flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg白/10">
                        <MapPin className="h-[14px] w-[14px]" />
                      </span>
                      {lang === "jp"
                        ? "所在地（日本）"
                        : lang === "zh"
                        ? "據點（日本）"
                        : "Japan Address"}
                    </div>
                    <div className="sm:col-span-2">{cinfo.addressJapan}</div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border白/10" />
                  </>
                )}

                {!!cinfo.addressTaiwan && (
                  <>
                    <div className="text-slate-300 text-[14px] flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg白/10">
                        <MapPin className="h-[14px] w-[14px]" />
                      </span>
                      {lang === "jp"
                        ? "所在地（台湾）"
                        : lang === "zh"
                        ? "據點（台灣）"
                        : "Taiwan Address"}
                    </div>
                    <div className="sm:col-span-2">{cinfo.addressTaiwan}</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="w-full border-t border-white/15">
        <div className={container}>
          <FooterServer
            lang={lang}
            {...({ logoUrl: navLogoUrl, logoText: displayCompanyName } as any)}
          />
        </div>
      </div>
    </main>
  );
}
