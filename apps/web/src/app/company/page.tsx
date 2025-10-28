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

export const dynamic = "force-dynamic"; // (1) 依指示強制動態

type Lang = "jp" | "zh" | "en";
type NavItem = { label?: string; href?: string; external?: boolean; order?: number };

type SiteSettingsData = {
  navigation?: NavItem[];
  logoUrl?: string | null;
  logoText?: string | null;
  title?: string | null;
};

/** (3) 統一的語言解析工具 */
function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "jp";
}

/* ===== Hero 可調整參數 ===== */
const HERO_TUNE = {
  BG_POS_X_PERCENT: 50,
  BG_POS_Y_PERCENT: 50,
  MIN_HEIGHT_PX: 520,
  PADDING_TOP_PX: 96,
  PADDING_BOTTOM_PX: 72,
} as const;

const HERO_TEXT_TUNE = { MAX_WIDTH_PX: 900 } as const;

/* ===== Portable Text（簡版） ===== */
type SimpleChild = { _type: "span"; text: string; marks?: string[] };
type SimpleLinkDef = { _key: string; _type: "link"; href: string; blank?: boolean };
type SimpleBlock = {
  _type: "block";
  style?: "normal";
  children: SimpleChild[];
  markDefs?: SimpleLinkDef[];
};

const BRAND_DARK = "#1C3D5A";
const container = "container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8";
const card = "rounded-2xl bg-white/5 border border-white/15 shadow-lg";
const thickDivider = "my-10 h-[3px] w-full bg-white/25";

function isValidSrc(s?: string | null) {
  if (!s) return false;
  const v = String(s).trim();
  if (!v) return false;
  if (v.toLowerCase() === "null" || v.toLowerCase() === "undefined") return false;
  return true;
}

/** 站內連結判斷：/ 開頭或相對連結，但排除以 // 開頭的協議相對 URL */
function isInternalHref(href: string) {
  if (!href) return false;
  if (href.startsWith("//")) return false; // protocol-relative external
  return href.startsWith("/") || (!href.startsWith("http://") && !href.startsWith("https://"));
}

/** 在 PortableText 段落內，自動替站內連結加上 ?lang= 參數 */
function PortableParagraphs({
  blocks,
  lang,
}: {
  blocks?: SimpleBlock[] | null;
  lang: Lang;
}) {
  if (!blocks?.length) return null;
  return (
    <div className="space-y-4 leading-8 text-slate-200">
      {blocks.map((b, i) => {
        const linkMap = new Map<string, SimpleLinkDef>();
        b.markDefs?.forEach((d) => linkMap.set(d._key, d));
        return (
          <p key={i} className="whitespace-pre-wrap">
            {b.children?.map((ch, j) => {
              const text = ch?.text ?? "";
              if (!text) return null;
              let node: React.ReactNode = text;
              ch.marks?.forEach((m) => {
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
                      className="text-white hover:text-sky-200 underline"
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
    <div className="space-y-4">
      {blocks.map((b, i) => {
        const text = (b.children ?? []).map((c) => c.text).join("");
        return (
          <p key={i} className="leading-8 text-slate-200">
            {text}
          </p>
        );
      })}
    </div>
  );
}

/* ===== 主頁面 ===== */
export default async function CompanyPage({
  searchParams,
}: {
  // (2) 允許 Promise 以便 await
  searchParams?: { lang?: string } | Promise<{ lang?: string }>;
}) {
  // (2) 先 await 再取值
  const spRaw =
    searchParams && typeof (searchParams as any).then === "function"
      ? await (searchParams as Promise<{ lang?: string }>)
      : (searchParams as { lang?: string } | undefined);

  // (3) 用統一的 resolveLang
  const lang = resolveLang(spRaw);

  // (4) 帶入 Sanity 參數查詢
  const [site, company] = await Promise.all([
    sfetch<SiteSettingsData>(siteSettingsByLang, { lang }),
    sfetch<CompanyOverviewData>(companyOverviewByLang, { lang }),
  ]);

  // Nav 連結補 lang
  const rawItems: NavItem[] = Array.isArray(site?.navigation) ? site!.navigation! : [];
  const items: NavItem[] = rawItems
    .map((it) => {
      if (!it?.href) return it;
      if (it.external) return it; // 外部連結不加
      const join = it.href.includes("?") ? "&" : "?";
      return { ...it, href: `${it.href}${join}lang=${lang}` };
    })
    .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  // 品牌資源
  const candidateLogoCompany = (company as any)?.logo?.url || "";
  const candidateLogoSite = (typeof site?.logoUrl === "string" ? site.logoUrl : "") || "";
  const navLogoUrl =
    (isValidSrc(candidateLogoCompany) && candidateLogoCompany) ||
    (isValidSrc(candidateLogoSite) && candidateLogoSite) ||
    "/logo.png";

  const displayCompanyName: string =
    (company as any)?.logoText || site?.logoText || site?.title || "Taiwan Connect";

  // 多語固定字
  const heroSmallLabel = lang === "jp" ? "会社概要" : lang === "zh" ? "公司概要" : "Company Overview";
  const missionLabel = lang === "jp" ? "経営理念" : lang === "zh" ? "經營理念" : "Our Purpose";
  const repLabel = lang === "jp" ? "代表者メッセージ" : lang === "zh" ? "代表者訊息" : "Representative Message";
  const companyInfoLabel = lang === "jp" ? "会社情報" : lang === "zh" ? "公司資訊" : "Company Information";

  const values = (company?.values ?? [])
    .slice()
    .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0));

  const heroBg = company?.topImage?.url || "";

  /* Founder */
  const founder = company?.founder ?? null;
  const fName = lang === "jp" ? founder?.name?.jp : lang === "zh" ? founder?.name?.zh : founder?.name?.en;
  const fTitle = lang === "jp" ? founder?.title?.jp : lang === "zh" ? founder?.title?.zh : founder?.title?.en;
  const fPhoto = founder?.photo?.url;
  const fPhotoAlt = founder?.photo?.alt ?? fName ?? "Founder";

  const mapEmbedUrl = (address: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <main className="bg-[#1C3D5A] text-slate-100">
      {/* Header（滿版） */}
      <div className="w-full border-b border-white/15">
        <div className={container}>
          {/* (4) lang 傳進子元件 */}
          <NavigationServer
            items={items}
            lang={lang}
            brand={{ logoUrl: navLogoUrl, name: displayCompanyName }}
          />
        </div>
      </div>

      {/* Hero：背景圖 + 疊在圖上的「会社概要」 */}
      <section
        id="philosophy"
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
            maxWidth: HERO_TEXT_TUNE.MAX_WIDTH_PX,
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-8">
          <div className={`${container} text-center`}>
            <span
              className="inline-block font-extrabold text-white text-3xl sm:text-4xl md:text-5xl tracking-wide"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,.45)" }}
            >
              {heroSmallLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-14 sm:py-16">
        <div className={container}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-white text-center">
            {missionLabel}
          </h2>
          <div className="text-xs tracking-[0.2em] uppercase text-slate-300 text-center mt-2">
            MISSION / VISION / VALUE
          </div>
          <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

          {/* Mission */}
          <div className={`${card} backdrop-blur-sm p-5 sm:p-6 mt-6`}>
            <div className="text-xl sm:text-2xl font-semibold text-white">
              {lang === "jp" ? "ミッション" : lang === "zh" ? "使命" : "Mission"}
            </div>
            <div className="mt-6 space-y-4 leading-8 text-slate-200">
              <PortableParagraphs blocks={company?.mission as any} lang={lang} />
            </div>
          </div>

          {/* Vision */}
          <div className={`${card} backdrop-blur-sm p-5 sm:p-6 mt-6`}>
            <div className="text-xl sm:text-2xl font-semibold text-white">
              {lang === "jp" ? "ビジョン" : lang === "zh" ? "願景" : "Vision"}
            </div>
            <div className="mt-6 space-y-4 leading-8 text-slate-200">
              <PortableParagraphs blocks={company?.vision as any} lang={lang} />
            </div>
          </div>

          {/* Values */}
          <div className="mt-8">
            <div className="text-xl sm:text-2xl font-semibold text-white">
              {lang === "jp" ? "バリュー" : lang === "zh" ? "核心價值" : "Values"}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {(values as any[]).map((v, idx) => (
                <div
                  key={`${v?.key ?? "v"}-${idx}`}
                  className="rounded-2xl bg-white/5 border border-white/15 p-5 sm:p-6 shadow-md flex gap-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#1C3D5A] font-semibold">
                    {(v?.order as number) > 0 ? v.order : idx + 1}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{v?.title}</div>
                    <div className="text-slate-300 mt-1 leading-7">{v?.descLong}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 代表者メッセージ */}
      <section id="message" className="py-14 sm:py-16">
        <div className={container}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-white text-center">
            {repLabel}
          </h2>
          <div className="text-xs tracking-[0.2em] uppercase text-slate-300 text-center mt-2">MESSAGE</div>
          <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch mt-10">
            {/* 照片卡 */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-white/5 h-full">
              <Image
                src={isValidSrc(fPhoto) ? fPhoto! : "/logo.png"}
                alt={fPhotoAlt}
                width={960}
                height={1200}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 文字卡 */}
            <div className="lg:col-span-3 h-full rounded-2xl bg-white/5 border border-white/15 p-6 sm:p-8 shadow-lg flex flex-col">
              <div className="grow">
                <RepMessageBlocks blocks={company?.repMessageLong as any} />
                {company?.repMessageShort ? (
                  <div className="mt-4 rounded-xl bg-white/7 p-4 border border-white/10 text-slate-200">
                    {company.repMessageShort}
                  </div>
                ) : null}
              </div>
              {(fTitle || fName) && (
                <div className="mt-4 text-slate-200">
                  {fTitle && <span className="mr-2">{fTitle}</span>}
                  {fName}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 公司資訊 */}
      <section id="company" className="py-14 sm:py-16">
        <div className={container}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-white text-center">
            {companyInfoLabel}
          </h2>
          <div className="text-xs tracking-[0.2em] uppercase text-slate-300 text-center mt-2">COMPANY</div>
          <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

          {company?.companyInfo ? (
            <div className={`${card} p-5 sm:p-6 mt-6`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-6 text-slate-100">
                {company.companyInfo.companyName ? (
                  <>
                    <div className="text-slate-300">
                      {lang === "jp" ? "会社名" : lang === "zh" ? "公司名稱" : "Company Name"}
                    </div>
                    <div className="sm:col-span-2">{company.companyInfo.companyName}</div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border-white/10" />
                  </>
                ) : null}

                {company.companyInfo.representative ? (
                  <>
                    <div className="text-slate-300">
                      {lang === "jp" ? "代表" : lang === "zh" ? "代表人" : "Representative"}
                    </div>
                    <div className="sm:col-span-2">{company.companyInfo.representative}</div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border-white/10" />
                  </>
                ) : null}

                {Array.isArray(company.companyInfo.activities) && company.companyInfo.activities.length ? (
                  <>
                    <div className="text-slate-300">
                      {lang === "jp" ? "事業内容" : lang === "zh" ? "主要業務" : "Business Activities"}
                    </div>
                    <div className="sm:col-span-2">
                      <ul className="list-disc pl-6 leading-8 text-slate-200">
                        {company.companyInfo.activities.map((a: string, i: number) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border-white/10" />
                  </>
                ) : null}

                {company.companyInfo.addressJapan ? (
                  <>
                    <div className="text-slate-300">
                      {lang === "jp" ? "所在地（日本）" : lang === "zh" ? "據點（日本）" : "Japan Address"}
                    </div>
                    <div className="sm:col-span-2">{company.companyInfo.addressJapan}</div>
                    <div className="sm:col-span-3 pt-6 mt-6 border-t border-white/10" />
                  </>
                ) : null}

                {company.companyInfo.addressTaiwan ? (
                  <>
                    <div className="text-slate-300">
                      {lang === "jp" ? "所在地（台湾）" : lang === "zh" ? "據點（台灣）" : "Taiwan Address"}
                    </div>
                    <div className="sm:col-span-2">{company.companyInfo.addressTaiwan}</div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Maps（純外部，不需要補 lang） */}
      <section id="maps" className="py-14 sm:py-16">
        <div className={container}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-white text-center">
            {lang === "jp" ? "アクセスマップ" : lang === "zh" ? "交通地圖" : "Access Maps"}
          </h2>
          <div className="text-xs tracking-[0.2em] uppercase text-slate-300 text-center mt-2">ACCESS MAPS</div>
          <div className="mx-auto mt-2 h-px w-12 bg-white/30" />

          {/* Japan */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-200">
              {lang === "jp" ? "【日本】" : lang === "zh" ? "【日本】" : "[Japan]"}
            </div>
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-white/5">
              <iframe
                title="map-jp"
                src={mapEmbedUrl(
                  company?.companyInfo?.addressJapan ||
                    "〒173-0004 東京都板橋区板橋三丁目9番14-503号　グラスコート板橋"
                )}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[420px]"
              />
            </div>
          </div>

          <div className={thickDivider} />

          {/* Taiwan */}
          <div>
            <div className="text-sm font-semibold text-slate-200">
              {lang === "jp" ? "【台湾】" : lang === "zh" ? "【台灣】" : "[Taiwan]"}
            </div>
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-white/5">
              <iframe
                title="map-tw"
                src={mapEmbedUrl(company?.companyInfo?.addressTaiwan || "台灣桃園市平鎮區新光路三段158巷18號")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[420px]"
              />
            </div>
          </div>

          <div className={thickDivider} />

          {/* United States */}
          <div>
            <div className="text-sm font-semibold text-slate-200">
              {lang === "jp" ? "【米国】" : lang === "zh" ? "【美國】" : "[United States]"}
            </div>
            <div className="mt-3 rounded-2xl overflow-hidden border border-white/15 shadow-md bg-white/5">
              <iframe
                title="map-us"
                src={mapEmbedUrl("Houston, Texas")}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer（滿版） */}
      <div className="w-full border-t border-white/15">
        <div className={container}>
          {/* (4)(5) 將 lang 傳入；FooterServer 內部如有站內連結亦需加上 lang */}
          <FooterServer lang={lang} {...({ logoUrl: navLogoUrl, logoText: displayCompanyName } as any)} />
        </div>
      </div>
    </main>
  );
}
