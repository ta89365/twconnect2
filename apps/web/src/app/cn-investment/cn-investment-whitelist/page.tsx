// File: apps/web/src/app/cn-investment-whitelist/page.tsx
// CN Investment Whitelist (ZH-CN) — 全頁品牌藍背景

import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { cnInvestmentWhitelistQuery, type WhitelistDoc } from "@/lib/queries/cnInvestmentWhitelist";
import type { JSX } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/* ============================ 視覺設定 ============================ */
const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = "1100px";
const CARD_BG = "rgba(255,255,255,0.10)";
const CARD_BORDER = "rgba(255,255,255,0.18)";
const HERO_MIN_H = "56vh";
const HERO_OVERLAY =
  "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0.30) 100%)";

/* ============================ PortableText 樣式 ============================ */
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 whitespace-pre-wrap">{children}</p>,
    h2: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 pl-4 italic opacity-90">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-black/30 px-1 py-0.5 text-sm">{children}</code>
    ),
    link: ({ value, children }) => {
      const href = (value as any)?.href as string | undefined;
      const openInNewTab = Boolean((value as any)?.openInNewTab ?? true);
      if (!href) return <>{children}</>;
      return (
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="underline hover:opacity-80"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = (value as any)?.asset?._ref ? undefined : (value as any)?.url;
      const alt = (value as any)?.alt || "";
      if (!url) return null;
      return (
        <div className="my-4 overflow-hidden rounded-xl border border-white/10">
          {/* 若需要完整 hotspot/crop，可改用 @sanity/image-url */}
          {/* 這裡先用原始 URL，維持簡潔 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} className="w-full h-auto" />
        </div>
      );
    },
  },
};

/* ============================ 小工具 ============================ */
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl p-6 md:p-8"
      style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
    >
      {children}
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-sm tracking-widest opacity-80">{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl md:text-3xl font-semibold mb-3">{children}</h2>;
}

/* 用型別斷言包裝 async Server Component，取代 @ts-expect-error */
const Nav = NavigationServer as unknown as (props: Record<string, unknown>) => JSX.Element;
const Footer = FooterServer as unknown as (props: Record<string, unknown>) => JSX.Element;

/* ============================ Page ============================ */
export default async function Page() {
  const doc = (await sfetch(cnInvestmentWhitelistQuery)) as WhitelistDoc | null;

  const hero = doc?.heroImage;
  const hasHero = Boolean(hero?.url);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE, color: "#fff" }}>
      {/* 導覽列 */}
      <Nav lang="zh" />

      {/* Hero */}
      <div
        className="relative w-full"
        style={{
          minHeight: HERO_MIN_H,
          background:
            hasHero && hero?.url
              ? undefined
              : `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.00) 100%)`,
        }}
      >
        {hasHero && (
          <div className="absolute inset-0">
            <Image
              src={hero!.url!}
              alt={hero?.alt ?? ""}
              fill
              sizes="100vw"
              className="object-cover"
              placeholder={hero?.lqip ? "blur" : "empty"}
              blurDataURL={hero?.lqip}
              priority
            />
            <div className="absolute inset-0" style={{ background: HERO_OVERLAY }} aria-hidden />
          </div>
        )}
        <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-end px-5 py-16 md:px-6">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-sm">
            {doc?.heroTitleZhCn ?? "陆资来台投资「正面表列」指南"}
          </h1>
          {doc?.heroSubtitleZhCn && (
            <p className="mt-3 max-w-3xl text-base md:text-lg opacity-90">{doc.heroSubtitleZhCn}</p>
          )}
        </div>
      </div>

      {/* 內容 */}
      <main className="mx-auto w-full max-w-[1100px] px-5 md:px-6 py-10 md:py-14 space-y-8 md:space-y-10">
        {/* Intro */}
        {doc?.introZhCn?.length ? (
          <SectionCard>
            <Kicker>导读</Kicker>
            <PortableText value={doc.introZhCn} components={ptComponents} />
          </SectionCard>
        ) : null}

        {/* Policy Background */}
        {doc?.policyBackgroundZhCn?.length ? (
          <SectionCard>
            <Kicker>制度背景</Kicker>
            <PortableText value={doc.policyBackgroundZhCn} components={ptComponents} />
          </SectionCard>
        ) : null}

        {/* Categories */}
        {doc?.categories?.length ? (
          <SectionCard>
            <Kicker>开放类别</Kicker>
            <div className="space-y-6">
              {doc.categories!.map((c, idx) => (
                <div key={`${c.key ?? "cat"}-${idx}`} className="rounded-xl border border-white/15 p-5 md:p-6">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {c.titleZhCn ?? labelFromKey(c.key)}
                  </h3>
                  {c.introZhCn?.length ? (
                    <div className="mt-2">
                      <PortableText value={c.introZhCn} components={ptComponents} />
                    </div>
                  ) : null}
                  {c.allowedExamplesZhCn?.length ? (
                    <div className="mt-3">
                      <div className="text-sm opacity-80 mb-1">允许项目举例</div>
                      <ul className="list-disc pl-6 space-y-1">
                        {c.allowedExamplesZhCn!.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {c.restrictionsZhCn?.length ? (
                    <div className="mt-3">
                      <div className="text-sm opacity-80 mb-1">限制与注意</div>
                      <PortableText value={c.restrictionsZhCn} components={ptComponents} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* Review Focus */}
        {doc?.reviewFocus?.length ? (
          <SectionCard>
            <Kicker>审查重点</Kicker>
            <div className="space-y-5">
              {doc.reviewFocus!.map((f, i) => (
                <div key={`focus-${f.order ?? i}`} className="rounded-lg border border-white/15 p-5">
                  <div className="mb-1 text-sm opacity-80">重点 #{f.order ?? i + 1}</div>
                  <h3 className="text-xl font-semibold">{f.titleZhCn ?? "审查项目"}</h3>
                  {f.bodyZhCn?.length ? (
                    <div className="mt-2">
                      <PortableText value={f.bodyZhCn} components={ptComponents} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* Pitfalls */}
        {doc?.pitfalls?.length ? (
          <SectionCard>
            <Kicker>常见误区与建议</Kicker>
            <div className="space-y-5">
              {doc.pitfalls!.map((p, i) => (
                <div key={`pit-${i}`} className="rounded-lg border border-white/15 p-5">
                  <h3 className="text-lg md:text-xl font-semibold">{p.titleZhCn ?? "常见误区"}</h3>
                  {p.adviceZhCn?.length ? (
                    <div className="mt-2">
                      <PortableText value={p.adviceZhCn} components={ptComponents} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {/* Summary */}
        {doc?.summaryZhCn?.length ? (
          <SectionCard>
            <Kicker>总结与建议</Kicker>
            <PortableText value={doc.summaryZhCn} components={ptComponents} />
          </SectionCard>
        ) : null}

        {/* Contact */}
        {(doc?.contact?.email || doc?.contact?.lineId || doc?.contact?.lineUrl || doc?.contact?.noteZhCn?.length) ? (
          <SectionCard>
            <Kicker>联系 Taiwan Connect</Kicker>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                {doc?.contact?.email && (
                  <p>
                    邮件：
                    <a className="underline hover:opacity-80" href={`mailto:${doc.contact.email}`}>
                      {doc.contact.email}
                    </a>
                  </p>
                )}
                {doc?.contact?.lineId && <p>LINE ID：{doc.contact.lineId}</p>}
                {doc?.contact?.lineUrl && (
                  <p>
                    LINE：
                    <a
                      className="underline hover:opacity-80"
                      href={doc.contact.lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      前往加好友
                    </a>
                  </p>
                )}
              </div>
              {doc?.contact?.noteZhCn?.length ? (
                <div>
                  <PortableText value={doc.contact.noteZhCn} components={ptComponents} />
                </div>
              ) : null}
            </div>
            {/* Meta: 更新時間與來源 */}
            {(doc?.meta?.updatedAt || doc?.meta?.sourceUrl) && (
              <div className="mt-6 border-t border-white/10 pt-4 text-sm opacity-80">
                {doc.meta?.updatedAt && (
                  <div>更新：{new Date(doc.meta.updatedAt).toLocaleDateString("zh-CN")}</div>
                )}
                {doc.meta?.sourceUrl && (
                  <div>
                    参考：
                    <a
                      className="underline hover:opacity-80"
                      href={doc.meta.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      官方资料
                    </a>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        ) : null}

        {/* 回到頂部 或 其他導覽 */}
        <div className="flex justify-end">
          <Link href="/" className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10">
            返回首页
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer lang="zh" />
    </div>
  );
}

/* ============================ 輔助：分類 key 對應中文 ============================ */
function labelFromKey(key?: string) {
  switch (key) {
    case "manufacturing":
      return "制造业";
    case "services":
      return "服务业";
    case "public_infrastructure":
      return "公共建设";
    default:
      return "产业类别";
  }
}
