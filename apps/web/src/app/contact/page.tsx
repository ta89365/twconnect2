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
import {
  InputField,
  TextareaField,
  SelectField,
  ConsentCheckbox,
  RadioGroupField,
  type Lang as ClientLang,
} from "./FormControls";
import FileUploadField from "./FileUploadField";
import TimezoneHidden from "./TimezoneHidden";

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
  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:"))
    return href;
  if (href.includes("?")) return `${href}&lang=${lang}`;
  return `${href}?lang=${lang}`;
}

/* ===== CTA Link ===== */
type CtaLinkProps = {
  href: string;
  lang: Lang;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};
function CtaLink({ href, lang, children, className, style }: CtaLinkProps) {
  const finalHref = linkWithLang(href, lang);
  const isExternal =
    /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
  if (isExternal) {
    return (
      <a
        href={finalHref}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={finalHref} className={className} style={style}>
      {children as any}
    </Link>
  );
}

type ContactDoc = {
  hero?: {
    title?: string;
    subtitle?: string;
    image?: { url?: string; alt?: string; lqip?: string };
    ctas?: { label?: string; kind?: string; href?: string | null; recommended?: boolean }[];
  };
  info?: { languages?: string; businessHours?: string; serviceAreas?: string };
  faqTopics?: string[];
  form?: {
    subjectOptions?: string[];
    preferredContactOptions?: string[];
    summaryHint?: string;
    datetimeHint?: string;
    attachmentHint?: string;
    consentText?: any[];
  };
  success?: { message?: any[]; email?: { subject?: string; body?: any[] } };
};

type ContactQueryResult = { doc?: ContactDoc };

/* ============================ i18n ============================ */
function labelByLang(key: string, lang: Lang): string {
  const dict: Record<string, { zh: string; jp: string; en: string }> = {
    Languages: { zh: "服務語言", jp: "対応言語", en: "Languages" },
    "Service areas": { zh: "服務範圍", jp: "サービス対象地域", en: "Service Areas" },
    "Business hours": { zh: "營業時間", jp: "営業時間", en: "Business Hours" },
    "Frequently asked topics": { zh: "常見主題", jp: "よくあるトピック", en: "Frequently Asked Topics" },
    "Contact form": { zh: "線上聯絡表單", jp: "お問い合わせフォーム", en: "Contact Form" },
    "Your name": { zh: "您的姓名", jp: "お名前", en: "Your Name" },
    Email: { zh: "電子郵件", jp: "メールアドレス", en: "Email" },
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

    // Preferred language 與選項
    "Preferred language": { zh: "偏好聯絡語言", jp: "希望言語", en: "Preferred language" },
    Chinese: { zh: "中文", jp: "中国語", en: "Chinese" },
    Japanese: { zh: "日文", jp: "日本語", en: "Japanese" },
    English: { zh: "英文", jp: "英語", en: "English" },
  };
  const found = dict[key];
  if (!found) return key;
  return found[lang] || found.zh || key;
}

function emailPlaceholder(_lang: Lang): string {
  return "name@example.com";
}
function phonePlaceholder(lang: Lang): string {
  if (lang === "en") return "+1 555 000 0000";
  if (lang === "jp") return "090-0000-0000";
  return "0900-000-000";
}

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
      <div
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: BRAND_BLUE }}
        data-lang={lang}
      >
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
  const faqTopics = Array.isArray(doc.faqTopics) ? doc.faqTopics : [];
  const heroHasImage = !!hero?.image?.url;

  const submitted = Array.isArray(sp?.submitted) ? sp?.submitted[0] : sp?.submitted;
  const errMsg = Array.isArray(sp?.error) ? sp?.error[0] : sp?.error;
  const hasSubmitted = submitted === "1" || submitted === "0";
  const isOk = submitted === "1";

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: BRAND_BLUE }}
      data-lang={lang}
    >
      <NavigationServer lang={lang} />

      {/* Hero */}
      <section
        className="relative w-full overflow-x-clip"
        style={{
          minHeight: HERO_MIN_H,
          background: heroHasImage ? `#000` : BRAND_BLUE,
        }}
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
            <div className="absolute inset-0 bg-black/40 sm:bg-black/35 md:bg-black/25" />
          </>
        )}

        <div
          className="relative mx-auto flex h-full w-full items-center justify-center px-4 py-12 sm:px-6 md:py-16"
          style={{ maxWidth: CONTENT_MAX_W }}
        >
          <div className="w-full max-w-full text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight leading-snug sm:text-4xl md:text-5xl">
              {hero?.title ?? "Contact"}
            </h1>
            {hero?.subtitle ? (
              <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed opacity-95 sm:mt-4 sm:text-lg">
                {hero.subtitle}
              </p>
            ) : null}
            {Array.isArray(hero?.ctas) && hero.ctas.length > 0 ? (
              <div className="mx-auto mt-6 flex max-w-full flex-wrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
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

      {/* 成功/失敗 */}
      {hasSubmitted && isOk ? (
        <SuccessView lang={lang} doc={doc} />
      ) : (
        <>
          {hasSubmitted && !isOk ? (
            <div
              className="mx-auto w-full max-w-full px-4 pt-5 sm:px-6"
              style={{ maxWidth: CONTENT_MAX_W }}
            >
              <ErrorToast lang={lang} errMsg={errMsg} />
            </div>
          ) : null}

          <main
            className="mx-auto w-full max-w-full overflow-x-clip px-4 py-10 text-white sm:px-6 sm:py-12"
            style={{ maxWidth: CONTENT_MAX_W }}
          >
            {/* Info cards */}
            <section className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {info.languages ? (
                <InfoCard title={labelByLang("Languages", lang)} body={info.languages} />
              ) : null}
              {info.serviceAreas ? (
                <InfoCard
                  title={labelByLang("Service areas", lang)}
                  body={info.serviceAreas}
                />
              ) : null}
              {info.businessHours ? (
                <InfoCard
                  title={labelByLang("Business hours", lang)}
                  body={info.businessHours}
                />
              ) : null}
            </section>

            {faqTopics.length > 0 ? (
              <section className="mt-10 min-w-0 sm:mt-12">
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

            {/* 表單 */}
            <section className="mt-10 min-w-0 sm:mt-12">
              <h2 className="text-xl font-semibold sm:text-2xl">
                {labelByLang("Contact form", lang)}
              </h2>
              <form
                id="contact-form"
                className="mt-5 grid min-w-0 max-w-full gap-4 rounded-2xl bg-white/5 p-4 sm:mt-6 sm:gap-5 sm:p-6"
                action={"/api/contact"}
                method="post"
                encType="multipart/form-data"
              >
                {/* hidden */}
                <input type="hidden" name="lang" value={lang} />
                <TimezoneHidden />

                {/* 第一列：Name / Email（Name 關閉錯誤列） */}
                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label={labelByLang("Your name", lang)}
                    name="name"
                    required
                    lang={lang as ClientLang}
                    showInlineError={false}
                  />
                  <InputField
                    label={labelByLang("Email", lang)}
                    name="email"
                    type="email"
                    required
                    lang={lang as ClientLang}
                    placeholder={emailPlaceholder(lang)}
                  />
                </div>

                {/* 第二列：Phone / Company（Company 關閉錯誤列；等高） */}
                <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                  <InputField
                    label={labelByLang("Phone", lang)}
                    name="phone"
                    required
                    lang={lang as ClientLang}
                    placeholder={phonePlaceholder(lang)}
                  />
                  <InputField
                    label={labelByLang("Company", lang)}
                    name="company"
                    lang={lang as ClientLang}
                    showInlineError={false}
                  />
                </div>

                {/* 件名：必填（從 GROQ） */}
                {Array.isArray(form?.subjectOptions) &&
                form.subjectOptions.length > 0 ? (
                  <SelectField
                    label={labelByLang("Subject", lang)}
                    name="subject"
                    required
                    lang={lang as ClientLang}
                  >
                    <option value="" className="bg-white text-black">
                      {labelByLang("Please select", lang)}
                    </option>
                    {form.subjectOptions.map((s, i) => (
                      <option
                        key={`sub-${i}`}
                        value={s}
                        className="bg-white text-black"
                      >
                        {s}
                      </option>
                    ))}
                  </SelectField>
                ) : null}

                {/* 希望語言 */}
                <SelectField
                  label={labelByLang("Preferred language", lang)}
                  name="preferredLanguage"
                  defaultValue={lang}
                  required
                  lang={lang as ClientLang}
                >
                  <option value="zh" className="bg-white text-black">
                    {labelByLang("Chinese", lang)}
                  </option>
                  <option value="jp" className="bg-white text-black">
                    {labelByLang("Japanese", lang)}
                  </option>
                  <option value="en" className="bg-white text-black">
                    {labelByLang("English", lang)}
                  </option>
                </SelectField>

                {/* 希望連絡方法：必填（從 GROQ） */}
                {Array.isArray(form?.preferredContactOptions) &&
                form.preferredContactOptions.length > 0 ? (
                  <RadioGroupField
                    label={labelByLang("Preferred contact", lang)}
                    name="preferredContact"
                    options={form.preferredContactOptions}
                    required
                    lang={lang as ClientLang}
                  />
                ) : null}

                {/* 概要：非必填 */}
                <TextareaField
                  label={labelByLang("Summary", lang)}
                  name="summary"
                  placeholder={form?.summaryHint ?? ""}
                  lang={lang as ClientLang}
                />

                {/* 保留但隱藏的時間欄位（UI 不顯示） */}
                <div className="hidden" aria-hidden="true">
                  <label className="relative grid min-w-0 gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("First preferred time", lang)}
                    </span>
                    <input
                      type="datetime-local"
                      name="preferredTime1"
                      className="h-16 w-full min-w-0 rounded-xl bg-white/10 px-3 text-white/50 outline-none"
                      placeholder="mm/dd/yyyy --:--"
                      disabled
                    />
                    <span className="mt-1 text-xs opacity-70">
                      {form?.datetimeHint ??
                        labelByLang("Preferred date and time", lang)}
                    </span>
                  </label>

                  <label className="relative grid min-w-0 gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("Second preferred time", lang)}
                    </span>
                    <input
                      type="datetime-local"
                      name="preferredTime2"
                      className="h-16 w-full min-w-0 rounded-xl bg-white/10 px-3 text-white/50 outline-none"
                      placeholder="mm/dd/yyyy --:--"
                      disabled
                    />
                    <span className="mt-1 text-xs opacity-70">
                      {form?.datetimeHint ??
                        labelByLang("Preferred date and time", lang)}
                    </span>
                  </label>
                </div>

                {/* 附件 + 說明（GROQ > 預設多語） */}
                <FileUploadField
                  lang={lang}
                  name="attachments"
                  label={labelByLang("Attachment", lang)}
                  hint={
                    form?.attachmentHint ??
                    (lang === "jp"
                      ? "資料添付 PDF／Excel／画像（10MB まで）"
                      : lang === "en"
                      ? "Attachments PDF / Excel / Images (up to 10MB)"
                      : "資料附件 PDF／Excel／圖片（上限 10MB）")
                  }
                />

                {/* 同意條款 */}
                <ConsentCheckbox lang={lang as ClientLang} />

                <div className="mt-2 sm:mt-3">
                  <button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-white px-5 font-medium text-black sm:w-auto"
                  >
                    {labelByLang("Send", lang)}
                  </button>
                </div>
              </form>
            </section>

            <section className="mt-10 min-w-0 sm:mt-12">
              <Link
                href={linkWithLang("/services", lang)}
                className="inline-block rounded-2xl bg-white/10 px-4 py-2 text-white"
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

/* ============================ 成功/錯誤/小元件與 Icons（原樣保留） ============================ */
function SuccessView({ lang, doc }: { lang: Lang; doc: ContactDoc }) {
  return (
    <section
      className="relative mx-auto w-full max-w-full overflow-x-clip px-4 pb-14 pt-8 text-white sm:px-6 sm:pb-16 sm:pt-10"
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

        <div className="mt-7 flex flex-wrap items中心 justify-center gap-2 sm:mt-8 sm:gap-3 md:gap-4">
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

function ErrorToast({ lang, errMsg }: { lang: Lang; errMsg?: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl bg-red-500/15 px-3 py-2.5 text-sm text-red-100 ring-1 ring-red-500/30 sm:px-4 sm:py-3"
      role="alert"
    >
      <ErrorIcon className="mt-[2px] h-5 w-5 shrink-0 text-red-200" />
      <div className="flex-1">
        <div className="font-semibold">Submission failed.</div>
        {errMsg ? <div className="mt-1 opacity-90">({String(errMsg)})</div> : null}
      </div>
      <Link
        href="#contact-form"
        className="rounded-xl bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
      >
        Try again
      </Link>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="rounded-2xl bg-white/5 p-4 sm:p-5">
      {title ? <div className="text-base font-semibold">{title}</div> : null}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed opacity-90">
        {body}
      </p>
    </div>
  );
}

/* Icons (inline) */
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
