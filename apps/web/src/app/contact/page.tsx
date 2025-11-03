// File: apps/web/src/app/contact/page.tsx

import React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import NavigationServer from "@/components/NavigationServer";
import FooterServer from "@/components/FooterServer";
import { sfetch } from "@/lib/sanity/fetch";
import { contactPageByLang } from "@/lib/queries/contactus";
import { PortableText } from "@portabletext/react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type Lang = "jp" | "zh" | "en";
type SearchParamsNow = Record<string, string | string[] | undefined> | undefined;

const BRAND_BLUE = "#1C3D5A";
const CONTENT_MAX_W = "1100px";
const HERO_MIN_H = "56vh";
const HERO_OVERLAY =
  "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0.30) 100%)";
const HERO_OBJECT_POS = "50% 62%";

/* ============================ 可調 Hero 位置 ============================ */
const HERO_OFFSET = { x: 0, y: -20 };
function parseObjectPos(p: string): { x: number; y: number } {
  const [xs, ys] = p.split(/\s+/);
  const x = Number(String(xs).replace("%", "")) || 50;
  const y = Number(String(ys).replace("%", "")) || 50;
  return { x, y };
}
function heroObjectPosition(): string {
  const base = parseObjectPos(HERO_OBJECT_POS);
  const x = Math.max(0, Math.min(100, base.x + HERO_OFFSET.x));
  const y = Math.max(0, Math.min(100, base.y + HERO_OFFSET.y));
  return `${x}% ${y}%`;
}
/* ========================================================================= */

function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  let v = sp?.lang;
  if (Array.isArray(v)) v = v[0];
  const s = (v ?? "").toString().toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "zh";
}

function linkWithLang(href: string, lang: Lang): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  if (href.includes("?")) return `${href}&lang=${lang}`;
  return `${href}?lang=${lang}`;
}

type CtaLinkProps = {
  href: string;
  lang: Lang;
  children?: ReactNode;
  className?: string;
};

function CtaLink({ href, lang, children, className }: CtaLinkProps) {
  const finalHref = linkWithLang(href, lang);
  const isExternal =
    /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
  if (isExternal) {
    return (
      <a href={finalHref} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={finalHref} className={className}>
      {children as any}
    </Link>
  );
}

type ContactDoc = {
  hero?: {
    title?: string;
    subtitle?: string;
    image?: {
      url?: string;
      alt?: string;
      lqip?: string;
    };
    ctas?: { label?: string; kind?: string; href?: string | null; recommended?: boolean }[];
  };
  info?: {
    languages?: string;
    businessHours?: string;
    serviceAreas?: string;
  };
  faqTopics?: string[];
  form?: {
    subjectOptions?: string[];
    preferredContactOptions?: string[];
    summaryHint?: string;
    datetimeHint?: string;
    attachmentHint?: string;
    consentText?: any[];
  };
  success?: {
    message?: any[];
    email?: { subject?: string; body?: any[] };
  };
  addresses?: { label?: string; address?: string; note?: string }[];
};

type ContactQueryResult = { doc?: ContactDoc };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsNow>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = resolveLang({ lang: sp.lang });

  const data = (await sfetch(contactPageByLang, { lang })) as ContactQueryResult;
  const doc = data?.doc;

  if (!doc) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE }}>
        <NavigationServer lang={lang} />
        <div className="mx-auto w-full" style={{ maxWidth: CONTENT_MAX_W }}>
          <div className="px-4 py-16 text-white">
            <h1 className="text-3xl font-semibold">Contact</h1>
            <p className="mt-3 opacity-90">Content not found.</p>
            <Link
              href={linkWithLang("/", lang)}
              className="mt-6 inline-block rounded-xl bg-white/10 px-4 py-2 text-white"
            >
              ← Back
            </Link>
          </div>
        </div>
        <FooterServer lang={lang} />
      </div>
    );
  }

  const hero = doc.hero ?? {};
  const info = doc.info ?? {};
  const form = doc.form ?? {};
  const addresses = Array.isArray(doc.addresses) ? doc.addresses : [];
  const faqTopics = Array.isArray(doc.faqTopics) ? doc.faqTopics : [];
  const heroHasImage = !!hero?.image?.url;

  // ===== 成功 / 失敗提示（讀取 ?submitted 與 ?error） =====
  const submitted = Array.isArray(sp?.submitted) ? sp?.submitted[0] : sp?.submitted;
  const errMsg = Array.isArray(sp?.error) ? sp?.error[0] : sp?.error;
  const hasSubmitted = submitted === "1" || submitted === "0";
  const isOk = submitted === "1";

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE }}>
      <NavigationServer lang={lang} />

      {/* 頁面訊息條 */}
      {hasSubmitted && (
        <div className={["mx-auto w-full px-4 pt-4", "transition-all duration-200"].join(" ")} style={{ maxWidth: CONTENT_MAX_W }}>
          <div
            className={[
              "rounded-2xl px-4 py-3 text-sm",
              isOk ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/30"
                   : "bg-red-500/15 text-red-100 ring-1 ring-red-500/30",
            ].join(" ")}
          >
            {isOk ? (
              <span>{labelByLang("Submitted successfully. Please check your mailbox.", lang)}</span>
            ) : (
              <span>
                {labelByLang("Submission failed.", lang)}{" "}
                {errMsg && <em className="opacity-80">({String(errMsg)})</em>}
              </span>
            )}
          </div>
        </div>
      )}

      {/* === Hero === */}
      <section
        className="relative w-full"
        style={{ minHeight: HERO_MIN_H, background: heroHasImage ? `#000` : BRAND_BLUE }}
      >
        {heroHasImage && (
          <>
            <Image
              src={hero.image!.url!}
              alt={hero.image?.alt ?? ""}
              fill
              className="object-cover"
              priority
              style={{ objectPosition: heroObjectPosition() }}
            />
            <div className="absolute inset-0" style={{ background: HERO_OVERLAY }} />
            <div className="absolute inset-0 bg-black/30 md:bg-black/25" />
          </>
        )}

        <div
          className="relative mx-auto flex h-full w-full items-center justify-center px-4 py-16 text-white"
          style={{ maxWidth: CONTENT_MAX_W }}
        >
          <div className="w-full text-center">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              {hero?.title ?? "Contact"}
            </h1>

            {hero?.subtitle ? (
              <p className="mx-auto mt-4 max-w-3xl text-lg opacity-95">{hero.subtitle}</p>
            ) : null}

            {Array.isArray(hero?.ctas) && hero.ctas.length > 0 ? (
              <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
                {hero.ctas.map((c, i) => {
                  const href = c?.href || "#";
                  const label = c?.label || "";
                  const isPrimary = !!c?.recommended;
                  return (
                    <CtaLink
                      key={`${label}-${i}`}
                      href={href}
                      lang={lang}
                      className={[
                        "rounded-2xl px-5 py-2 text-sm font-medium",
                        isPrimary ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20",
                      ].join(" ")}
                    >
                      {label}
                    </CtaLink>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <main className="mx-auto w-full px-4 py-12 text-white" style={{ maxWidth: CONTENT_MAX_W }}>
        <section className="grid gap-6 md:grid-cols-3">
          <InfoCard title={labelByLang("Languages", lang)} body={info.languages} />
          <InfoCard title={labelByLang("Service areas", lang)} body={info.serviceAreas} />
          <InfoCard title={labelByLang("Business hours", lang)} body={info.businessHours} />
        </section>

        {faqTopics.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">
              {labelByLang("Frequently asked topics", lang)}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {faqTopics.map((t, i) => (
                <span key={`${t}-${i}`} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {addresses.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">{labelByLang("Addresses", lang)}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {addresses.map((a, i) => (
                <div key={`addr-${i}`} className="rounded-2xl bg-white/5 p-4">
                  {a?.label ? <div className="text-base font-semibold">{a.label}</div> : null}
                  {a?.address ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm opacity-90">{a.address}</p>
                  ) : null}
                  {a?.note ? <p className="mt-2 text-sm opacity-80">{a.note}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">{labelByLang("Contact form", lang)}</h2>
          <form
            className="mt-6 grid gap-4 rounded-2xl bg-white/5 p-6"
            action={"/api/contact"}
            method="post"
            encType="multipart/form-data"
          >
            {/* ✅ 提供 API 讀取語系 */}
            <input type="hidden" name="lang" value={lang} />

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={labelByLang("Your name", lang)} name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label={labelByLang("Phone", lang)} name="phone" />
              <Field label={labelByLang("Company", lang)} name="company" />
            </div>

            {Array.isArray(form?.subjectOptions) && form.subjectOptions.length > 0 ? (
              <div className="grid gap-2">
                <label className="text-sm opacity-90">{labelByLang("Subject", lang)}</label>
                {/* 白底黑字避免受父層 text-white 影響 */}
                <select
                  name="subject"
                  className="rounded-xl bg-white/90 px-3 py-2 outline-none text-black"
                  required
                >
                  <option value="" className="text-black bg-white">
                    {labelByLang("Please select", lang)}
                  </option>
                  {form.subjectOptions.map((s, i) => (
                    <option key={`sub-${i}`} value={s} className="text-black bg-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {Array.isArray(form?.preferredContactOptions) && form.preferredContactOptions.length > 0 ? (
              <div className="grid gap-2">
                <span className="text-sm opacity-90">{labelByLang("Preferred contact", lang)}</span>
                <div className="flex flex-wrap gap-3">
                  {form.preferredContactOptions.map((op, i) => (
                    <label key={`pref-${i}`} className="flex items-center gap-2">
                      <input type="radio" name="preferredContact" value={op} />
                      <span className="text-sm">{op}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-2">
              <label className="text-sm opacity-90">{labelByLang("Summary", lang)}</label>
              <textarea
                name="summary"
                className="min-h-[120px] rounded-xl bg-white/10 px-3 py-2 outline-none"
                placeholder={form?.summaryHint ?? ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm opacity-90">{labelByLang("Preferred date and time", lang)}</label>
              <input
                type="datetime-local"
                name="datetime"
                className="rounded-xl bg-white/10 px-3 py-2 outline-none"
              />
              {form?.datetimeHint ? <p className="text-xs opacity-75">{form.datetimeHint}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm opacity-90">{labelByLang("Attachment", lang)}</label>
              <input
                type="file"
                name="attachments"
                multiple
                className="rounded-xl bg-white/10 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1 file:text-sm file:text-black"
              />
              {form?.attachmentHint ? <p className="text-xs opacity-75">{form.attachmentHint}</p> : null}
            </div>

            {Array.isArray(form?.consentText) && form.consentText.length > 0 ? (
              <label className="mt-2 grid gap-2">
                <div className="flex items-start gap-2">
                  <input type="checkbox" name="consent" value="yes" required className="mt-1" />
                  <div className="text-sm opacity-90">
                    <PortableText value={form.consentText} />
                  </div>
                </div>
              </label>
            ) : null}

            <div className="mt-4">
              <button type="submit" className="rounded-2xl bg-white px-5 py-2 font-medium text-black">
                {labelByLang("Send", lang)}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-12">
          <Link href={linkWithLang("/services", lang)} className="inline-block rounded-2xl bg-white/10 px-4 py-2">
            {labelByLang("View services", lang)} →
          </Link>
        </section>
      </main>

      <FooterServer lang={lang} />
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body?: string }) {
  if (!title && !body) return null;
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      {title ? <div className="text-base font-semibold">{title}</div> : null}
      {body ? <p className="mt-2 whitespace-pre-wrap text-sm opacity-90">{body}</p> : null}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm opacity-90">{label}</span>
      <input type={type} name={name} className="rounded-xl bg-white/10 px-3 py-2 outline-none" required={required} />
    </label>
  );
}

function labelByLang(key: string, lang: Lang): string {
  const dict: Record<string, { zh: string; jp: string; en: string }> = {
    Languages: { zh: "服務語言", jp: "対応言語", en: "Languages" },
    "Service areas": { zh: "服務範圍", jp: "サービス対象地域", en: "Service Areas" },
    "Business hours": { zh: "營業時間", jp: "営業時間", en: "Business Hours" },
    "Frequently asked topics": { zh: "常見主題", jp: "よくあるトピック", en: "Frequently Asked Topics" },
    Addresses: { zh: "地址", jp: "住所", en: "Addresses" },
    "Contact form": { zh: "線上聯絡表單", jp: "お問い合わせフォーム", en: "Contact Form" },
    "Your name": { zh: "您的姓名", jp: "お名前", en: "Your Name" },
    Phone: { zh: "聯絡電話", jp: "電話番号", en: "Phone" },
    Company: { zh: "公司名稱", jp: "会社名", en: "Company" },
    Subject: { zh: "主旨", jp: "件名", en: "Subject" },
    "Please select": { zh: "請選擇", jp: "選択してください", en: "Please select" },
    "Preferred contact": { zh: "偏好聯絡方式", jp: "希望連絡方法", en: "Preferred Contact" },
    Summary: { zh: "需求摘要", jp: "概要", en: "Summary" },
    "Preferred date and time": { zh: "可洽談時間", jp: "希望日時", en: "Preferred Date and Time" },
    Attachment: { zh: "附件", jp: "添付ファイル", en: "Attachment" },
    Send: { zh: "送出", jp: "送信", en: "Send" },
    "View services": { zh: "查看服務", jp: "サービスを見る", en: "View Services" },
    // 新增提示字串
    "Submitted successfully. Please check your mailbox.": {
      zh: "已成功送出，請留意您的信箱。",
      jp: "送信しました。メールをご確認ください。",
      en: "Submitted successfully. Please check your mailbox.",
    },
    "Submission failed.": { zh: "送出失敗。", jp: "送信に失敗しました。", en: "Submission failed." },
  };
  const found = dict[key];
  if (!found) return key;
  return found[lang] || found.zh || key;
}
