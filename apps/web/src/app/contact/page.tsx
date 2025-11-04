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
import TimezoneSelect from "@/components/TimezoneSelect"; // ★ 新增：可偵測的時區下拉

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
      <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE }} data-lang={lang}>
        <NavigationServer lang={lang} />
        <div className="mx-auto w-full" style={{ maxWidth: CONTENT_MAX_W }}>
          <div className="px-4 py-16 text-white sm:px-6">
            <h1 className="text-3xl font-semibold sm:text-4xl">Contact</h1>
            <p className="mt-3 opacity-90 sm:text-lg">Content not found.</p>
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
    <div className="min-h-screen" style={{ backgroundColor: BRAND_BLUE }} data-lang={lang}>
      <NavigationServer lang={lang} />

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
              // 手機視窗較小，維持既有定位但加強遮罩避免文字與背景衝突
              style={{ objectPosition: heroObjectPosition() }}
            />
            <div className="absolute inset-0" style={{ background: HERO_OVERLAY }} />
            {/* 手機加強一點對比，md 以上降低 */}
            <div className="absolute inset-0 bg-black/40 sm:bg-black/35 md:bg-black/25" />
          </>
        )}

        <div
          className="relative mx-auto flex h-full w-full items-center justify-center px-4 py-12 text-white sm:px-6 sm:py-14 md:py-16"
          style={{ maxWidth: CONTENT_MAX_W }}
        >
          <div className="w-full text-center">
            <h1 className="text-3xl font-bold tracking-tight leading-snug sm:text-4xl md:text-5xl">
              {hero?.title ?? "Contact"}
            </h1>

            {hero?.subtitle ? (
              <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed opacity-95 sm:mt-4 sm:text-lg">
                {hero.subtitle}
              </p>
            ) : null}

            {Array.isArray(hero?.ctas) && hero.ctas.length > 0 ? (
              <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
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
                        "rounded-2xl px-4 py-2 text-sm font-medium sm:px-5 sm:py-2.5",
                        isPrimary
                          ? "bg-white text-black shadow-sm"
                          : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/16",
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

      {/* ===== 送出成功：顯示成功頁；失敗：顯示錯誤提示後保留原頁內容 ===== */}
      {hasSubmitted && isOk ? (
        <SuccessView lang={lang} doc={doc} />
      ) : (
        <>
          {hasSubmitted && !isOk ? (
            <div className="mx-auto w-full px-4 pt-5 sm:px-6" style={{ maxWidth: CONTENT_MAX_W }}>
              <ErrorToast lang={lang} errMsg={errMsg} />
            </div>
          ) : null}

          <main
            className="mx-auto w-full px-4 py-10 text-white sm:px-6 sm:py-12"
            style={{ maxWidth: CONTENT_MAX_W }}
          >
            {/* 手機單欄優先，md 起三欄 */}
            <section className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <InfoCard title={labelByLang("Languages", lang)} body={info.languages} />
              <InfoCard title={labelByLang("Service areas", lang)} body={info.serviceAreas} />
              <InfoCard title={labelByLang("Business hours", lang)} body={info.businessHours} />
            </section>

            {faqTopics.length > 0 ? (
              <section className="mt-10 sm:mt-12">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {labelByLang("Frequently asked topics", lang)}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                  {faqTopics.map((t, i) => (
                    <span
                      key={`${t}-${i}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {addresses.length > 0 ? (
              <section className="mt-10 sm:mt-12">
                <h2 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
                  {labelByLang("Addresses", lang)}
                </h2>
                {/* 手機單欄，md 起雙欄 */}
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  {addresses.map((a, i) => (
                    <div
                      key={`addr-${i}`}
                      className="group relative overflow-hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-lg sm:p-5"
                    >
                      <div className="absolute -left-2 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21c-4.97-4.97-8-8.03-8-11a8 8 0 1116 0c0 2.97-3.03 6.03-8 11z"
                          />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="pl-6">
                        {a?.label ? (
                          <h3 className="mb-1 text-base font-semibold tracking-tight sm:mb-2 sm:text-lg">
                            {a.label}
                          </h3>
                        ) : null}
                        {a?.address ? (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed opacity-90">
                            {a.address}
                          </p>
                        ) : null}
                        {a?.note ? (
                          <p className="mt-2 text-xs leading-relaxed italic opacity-70">{a.note}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* ============ 表單 ============ */}
            <section className="mt-10 sm:mt-12">
              <h2 className="text-xl font-semibold sm:text-2xl">
                {labelByLang("Contact form", lang)}
              </h2>
              <form
                className="mt-5 grid gap-4 rounded-2xl bg-white/5 p-4 sm:mt-6 sm:gap-5 sm:p-6"
                action={"/api/contact"}
                method="post"
                encType="multipart/form-data"
              >
                {/* ✅ 提供 API 讀取語系 */}
                <input type="hidden" name="lang" value={lang} />

                {/* 手機單欄，md 起雙欄 */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={labelByLang("Your name", lang)} name="name" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label={labelByLang("Phone", lang)} name="phone" />
                  <Field label={labelByLang("Company", lang)} name="company" />
                </div>

                {Array.isArray(form?.subjectOptions) && form.subjectOptions.length > 0 ? (
                  <div className="grid gap-2">
                    <label className="text-sm opacity-90">
                      {labelByLang("Subject", lang)}
                    </label>
                    <select
                      name="subject"
                      className="h-12 rounded-xl bg-white/90 px-3 py-2 text-black outline-none"
                      required
                    >
                      <option value="" className="bg-white text-black">
                        {labelByLang("Please select", lang)}
                      </option>
                      {form.subjectOptions.map((s, i) => (
                        <option key={`sub-${i}`} value={s} className="bg-white text-black">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {Array.isArray(form?.preferredContactOptions) &&
                form.preferredContactOptions.length > 0 ? (
                  <div className="grid gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("Preferred contact", lang)}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {form.preferredContactOptions.map((op, i) => (
                        <label key={`pref-${i}`} className="flex items-center gap-2">
                          <input className="h-4 w-4" type="radio" name="preferredContact" value={op} />
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
                    className="min-h-[130px] rounded-xl bg-white/10 px-3 py-3 outline-none sm:min-h-[140px]"
                    placeholder={form?.summaryHint ?? ""}
                    required
                  />
                </div>

                {/* ===== 新增：第一/第二備選時段 ===== */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("First preferred time", lang)}
                    </span>
                    <input
                      type="datetime-local"
                      name="preferredTime1"
                      className="h-12 rounded-xl bg-white/10 px-3 py-2 outline-none"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("Second preferred time", lang)}
                    </span>
                    <input
                      type="datetime-local"
                      name="preferredTime2"
                      className="h-12 rounded-xl bg-white/10 px-3 py-2 outline-none"
                    />
                  </label>
                </div>

                {/* ===== 時區：Client Component（IANA 下拉 + 自動偵測） ===== */}
                <div className="grid gap-2">
                  <label className="text-sm opacity-90" htmlFor="timezone">
                    {labelByLang("Time zone", lang)}
                  </label>
                  <TimezoneSelect id="timezone" name="timezone" />
                </div>
                {/* ===== /時區 ===== */}

                <div className="grid gap-2">
                  <label className="text-sm opacity-90">{labelByLang("Attachment", lang)}</label>
                  <input
                    type="file"
                    name="attachments"
                    multiple
                    className="rounded-xl bg-white/10 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:text-black"
                  />
                  {form?.attachmentHint ? (
                    <p className="text-xs opacity-75">{form.attachmentHint}</p>
                  ) : null}
                </div>

                {Array.isArray(form?.consentText) && form.consentText.length > 0 ? (
                  <label className="mt-1 grid gap-2 sm:mt-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="consent"
                        value="yes"
                        required
                        className="mt-1 h-4 w-4"
                      />
                      <div className="text-sm opacity-90">
                        <PortableText value={form.consentText} />
                      </div>
                    </div>
                  </label>
                ) : null}

                <div className="mt-2 sm:mt-3">
                  <button
                    type="submit"
                    className="h-11 rounded-2xl bg-white px-5 font-medium text-black sm:h-12"
                  >
                    {labelByLang("Send", lang)}
                  </button>
                </div>
              </form>
            </section>

            <section className="mt-10 sm:mt-12">
              <Link
                href={linkWithLang("/services", lang)}
                className="inline-block rounded-2xl bg-white/10 px-4 py-2"
              >
                {labelByLang("View services", lang)} →
              </Link>
            </section>
          </main>
        </>
      )}

      <FooterServer lang={lang} />
    </div>
  );
}

/* ============================ 成功頁 ============================ */
function SuccessView({ lang, doc }: { lang: Lang; doc: ContactDoc }) {
  return (
    <section
      className="relative mx-auto w-full px-4 pb-14 pt-8 text-white sm:px-6 sm:pb-16 sm:pt-10"
      style={{ maxWidth: "720px" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 -right-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="relative">
        <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-emerald-500/18 ring-1 ring-emerald-400/35 backdrop-blur-sm sm:h-[72px] sm:w-[72px]">
          <CheckIcon className="h-8 w-8 text-emerald-300 sm:h-9 sm:w-9" />
        </div>

        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight leading-snug sm:mt-6 sm:text-3xl md:text-4xl">
          {labelByLang("Your message was sent", lang)}
        </h2>
        <p className="mt-3 text-center text-base leading-relaxed opacity-90 md:text-lg">
          {labelByLang("We will get back to you within 1–2 business days.", lang)}
        </p>

        {Array.isArray(doc?.success?.message) && doc.success?.message?.length > 0 ? (
          <div
            className="prose prose-invert mt-5 rounded-2xl bg-white/6 p-4 ring-1 ring-white/12 backdrop-blur-sm sm:mt-6 sm:p-5"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <PortableText value={doc.success.message} />
          </div>
        ) : (
          <ul
            className="mt-5 grid gap-3 rounded-2xl p-4 ring-1 ring-white/12 backdrop-blur-sm sm:mt-6 sm:p-5"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <li className="flex items-start gap-3">
              <MailIcon className="mt-[2px] h-5 w-5 opacity-90" />
              <span className="text-sm opacity-95">
                {labelByLang(
                  "A confirmation email has been sent. If you do not see it, please check your spam folder.",
                  lang
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CalendarIcon className="mt-[2px] h-5 w-5 opacity-90" />
              <span className="text-sm opacity-95">
                {labelByLang(
                  "If you proposed a time, our team will confirm availability or suggest alternatives.",
                  lang
                )}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldIcon className="mt-[2px] h-5 w-5 opacity-90" />
              <span className="text-sm opacity-95">
                {labelByLang(
                  "Your information is kept confidential and used only for this inquiry.",
                  lang
                )}
              </span>
            </li>
          </ul>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3 md:gap-4">
          <CtaLink
            href="/"
            lang={lang}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-5 font-medium text-black shadow-sm sm:h-11 md:h-12"
          >
            <HomeIcon className="h-5 w-5" />
            {labelByLang("Back to Home", lang)}
          </CtaLink>

          <CtaLink
            href="/services"
            lang={lang}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/10 px-5 font-medium text-white ring-1 ring-white/15 hover:bg-white/16 sm:h-11 md:h-12"
          >
            <ArrowRightIcon className="h-5 w-5" />
            {labelByLang("View services", lang)}
          </CtaLink>

          <CtaLink
            href="/companyStrengthsAndFAQ"
            lang={lang}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/10 px-5 font-medium text-white ring-1 ring-white/15 hover:bg-white/16 sm:h-11 md:h-12"
          >
            <HelpIcon className="h-5 w-5" />
            {labelByLang("View FAQ", lang)}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}

/* ============================ 失敗提示 ============================ */
function ErrorToast({ lang, errMsg }: { lang: Lang; errMsg?: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl bg-red-500/15 px-3 py-2.5 text-sm text-red-100 ring-1 ring-red-500/30 sm:px-4 sm:py-3"
      role="alert"
    >
      <ErrorIcon className="mt-[2px] h-5 w-5 shrink-0 text-red-200" />
      <div className="flex-1">
        <div className="font-semibold">{labelByLang("Submission failed.", lang)}</div>
        {errMsg ? <div className="mt-1 opacity-90">({String(errMsg)})</div> : null}
      </div>
      <Link
        href="#contact-form"
        className="rounded-xl bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
      >
        {labelByLang("Try again", lang)}
      </Link>
    </div>
  );
}

/* ============================ 小元件 ============================ */
function InfoCard({ title, body }: { title: string; body?: string }) {
  if (!title && !body) return null;
  return (
    <div className="rounded-2xl bg-white/5 p-4 sm:p-5">
      {title ? <div className="text-base font-semibold">{title}</div> : null}
      {body ? <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed opacity-90">{body}</p> : null}
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
    <label className="grid gap-2" id="contact-form">
      <span className="text-sm opacity-90">{label}</span>
      <input
        type={type}
        name={name}
        className="h-12 rounded-xl bg-white/10 px-3 py-2 outline-none"
        required={required}
      />
    </label>
  );
}

/* ============================ Icons（inline） ============================ */
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M4 6h16v12H4z" />
      <path strokeWidth="2" d="M22 6l-10 7L2 6" />
    </svg>
  );
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
    </svg>
  );
}
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M3 11l9-8 9 8" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}
function HelpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 115.82 1c0 2-3 2-3 4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

/* ============================ i18n ============================ */
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
    "First preferred time": { zh: "第一備選時段", jp: "第1希望日時", en: "First preferred time" },
    "Second preferred time": { zh: "第二備選時段", jp: "第2希望日時", en: "Second preferred time" },
    "Time zone": { zh: "時區", jp: "タイムゾーン", en: "Time zone" },
    Attachment: { zh: "附件", jp: "添付ファイル", en: "Attachment" },
    Send: { zh: "送出", jp: "送信", en: "Send" },
    "View services": { zh: "查看服務", jp: "サービスを見る", en: "View Services" },

    // 成功頁
    "Your message was sent": { zh: "已收到您的訊息", jp: "メッセージを受信しました", en: "Your message was sent" },
    "We will get back to you within 1–2 business days.": {
      zh: "我們將在 1–2 個工作日內回覆您。",
      jp: "通常 1〜2 営業日以内にご返信いたします。",
      en: "We will get back to you within 1–2 business days.",
    },
    "A confirmation email has been sent. If you do not see it, please check your spam folder.": {
      zh: "確認信已寄出，如未看到請檢查垃圾郵件匣。",
      jp: "確認メールを送信しました。見当たらない場合は迷惑メールをご確認ください。",
      en: "A confirmation email has been sent. If you do not see it, please check your spam folder.",
    },
    "Back to Home": { zh: "回到首頁", jp: "ホームへ戻る", en: "Back to Home" },
    "View FAQ": { zh: "查看常見問題", jp: "よくある質問を見る", en: "View FAQ" },

    // 失敗
    "Submission failed.": { zh: "送出失敗。", jp: "送信に失敗しました。", en: "Submission failed." },
    "Try again": { zh: "再試一次", jp: "もう一度", en: "Try again" },
  };
  const found = dict[key];
  if (!found) return key;
  return found[lang] || found.zh || key;
}
