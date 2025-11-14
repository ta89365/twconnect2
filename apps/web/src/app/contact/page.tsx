// ========================== 第 1 部：IMPORT 與 前置 ==========================

import React from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

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

// ========================== Hero 位置調整函式 ==========================

const HERO_OFFSET = { x: 0, y: -20 };

function parseObjectPos(p: string): { x: number; y: number } {
  const [xs, ys] = p.split(/\s+/);
  return {
    x: Number(xs.replace("%", "")) || 50,
    y: Number(ys.replace("%", "")) || 50,
  };
}

function heroObjectPosition(): string {
  const base = parseObjectPos(HERO_OBJECT_POS);
  const x = Math.max(0, Math.min(100, base.x + HERO_OFFSET.x));
  const y = Math.max(0, Math.min(100, base.y + HERO_OFFSET.y));
  return `${x}% ${y}%`;
}

// ========================== 語系解析 ==========================

function resolveLang(sp?: { lang?: string | string[] } | null): Lang {
  const raw = Array.isArray(sp?.lang) ? sp?.lang[0] : sp?.lang;
  const s = (raw ?? "").toLowerCase();
  return s === "zh" || s === "en" || s === "jp" ? (s as Lang) : "zh";
}

function linkWithLang(href: string, lang: Lang): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:"))
    return href;
  return href.includes("?") ? `${href}&lang=${lang}` : `${href}?lang=${lang}`;
}

// ========================== CTA Link ==========================

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
    /^(https?:)?\/\//.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

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

// ========================== Sanity Document Type ==========================

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

// ========================== i18n label ==========================

function labelByLang(key: string, lang: Lang): string {
  const dict: Record<string, { zh: string; jp: string; en: string }> = {
    Languages: { zh: "服務語言", jp: "対応言語", en: "Languages" },
    "Service areas": { zh: "服務範圍", jp: "サービス対象地域", en: "Service Areas" },
    "Business hours": { zh: "營業時間", jp: "営業時間", en: "Business Hours" },
    "Frequently asked topics": {
      zh: "常見主題",
      jp: "よくあるトピック",
      en: "Frequently Asked Topics",
    },
    "Contact form": { zh: "線上聯絡表單", jp: "お問い合わせフォーム", en: "Contact Form" },

    // Fields
    "Your name": { zh: "您的姓名", jp: "お名前", en: "Your Name" },
    Email: { zh: "電子郵件", jp: "メールアドレス", en: "Email" },
    Phone: { zh: "聯絡電話", jp: "電話番号", en: "Phone" },
    Company: { zh: "公司名稱", jp: "会社名", en: "Company" },
    Nationality: { zh: "國籍", jp: "国籍", en: "Nationality" },

    Subject: { zh: "主旨", jp: "件名", en: "Subject" },
    "Please select": { zh: "請選擇", jp: "選択してください", en: "Please select" },

    "Preferred contact": { zh: "偏好聯絡方式", jp: "希望連絡方法", en: "Preferred Contact" },
    "Preferred language": { zh: "偏好語言", jp: "希望言語", en: "Preferred Language" },

    Summary: { zh: "需求摘要", jp: "概要", en: "Summary" },
    Attachment: { zh: "附件", jp: "添付ファイル", en: "Attachment" },

    "First preferred time": {
      zh: "第一希望時間",
      jp: "第1希望時間",
      en: "First preferred time",
    },
    "Second preferred time": {
      zh: "第二希望時間",
      jp: "第2希望時間",
      en: "Second preferred time",
    },

    Send: { zh: "送出", jp: "送信", en: "Send" },

    // Success
    "Your message was sent": {
      zh: "已收到您的訊息",
      jp: "メッセージを受信しました",
      en: "Your message was sent",
    },

    // Extra new fields
    "Client Type": { zh: "型態", jp: "顧客区分", en: "Client Type" },
    "Type of Establishment": { zh: "設立型態", jp: "設立形態", en: "Type of Establishment" },
    "Parent Company Country": {
      zh: "母公司設立國",
      jp: "親会社の登録国",
      en: "Parent Company Country",
    },

    "View services": { zh: "查看服務內容", jp: "サービス一覧を見る", en: "View services" },
  };
  return dict[key]?.[lang] ?? dict[key]?.zh ?? key;
}

function emailPlaceholder(_lang: Lang) {
  return "name@example.com";
}

function phonePlaceholder(lang: Lang) {
  return lang === "en"
    ? "+1 555 000 0000"
    : lang === "jp"
    ? "090-0000-0000"
    : "0900-000-000";
}

// ========================== 第 2 部：Page 主體開始 ==========================

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsNow>;
}) {
  const sp = (await searchParams) ?? {};
  const lang = resolveLang({ lang: sp.lang });

  const data = (await sfetch(contactPageByLang, { lang })) as {
    doc?: ContactDoc;
  };

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
  const faqTopics = Array.isArray(doc?.faqTopics) ? doc.faqTopics : [];
  const form = doc.form ?? {};

  const submitted = Array.isArray(sp.submitted)
    ? sp.submitted[0]
    : sp.submitted;

  const isOk = submitted === "1";
  const hasSubmitted = submitted === "1" || submitted === "0";

  const heroHasImage = !!hero?.image?.url;

  // 動態選項
  const clientTypeOptions =
    lang === "en" ? ["Corporation", "Individual"] : ["法人", "個人"];

  const establishmentOptions =
    lang === "en"
      ? ["Subsidiary", "Branch", "Representative Office", "Undecided"]
      : lang === "jp"
      ? ["子会社", "支店", "駐在員事務所", "未定"]
      : ["子公司", "分公司", "辦事處", "尚未決定"];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: BRAND_BLUE }}
      data-lang={lang}
    >
      <NavigationServer lang={lang} />

      {/* ========================== HERO 區塊 ========================== */}
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
            <div className="absolute inset-0" style={{ background: HERO_OVERLAY }}></div>
            <div className="absolute inset-0 bg-black/40 sm:bg-black/35 md:bg-black/25"></div>
          </>
        )}

        <div
          className="relative mx-auto flex h-full w-full items-center justify-center px-4 py-12 sm:px-6 md:py-16"
          style={{ maxWidth: CONTENT_MAX_W }}
        >
          <div className="w-full text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {hero?.title ?? "Contact"}
            </h1>

            {hero?.subtitle ? (
              <p className="mx-auto mt-3 max-w-3xl text-base opacity-95 sm:text-lg">
                {hero.subtitle}
              </p>
            ) : null}

            {Array.isArray(hero.ctas) && hero.ctas.length > 0 && (
              <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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
                          : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20",
                      ].join(" ")}
                    >
                      {label}
                    </CtaLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================== 成功 / 失敗 顯示 ========================== */}
      {hasSubmitted && isOk ? (
        <SuccessView lang={lang} doc={doc} />
      ) : (
        <>
          {/* 錯誤提示 */}
          {hasSubmitted && !isOk && (
            <div
              className="mx-auto w-full max-w-full px-4 pt-5 sm:px-6"
              style={{ maxWidth: CONTENT_MAX_W }}
            >
              <ErrorToast lang={lang} errMsg={sp.error as string} />
            </div>
          )}

          {/* ========================== 主內容 ========================== */}
          <main
            className="mx-auto w-full max-w-full px-4 py-10 text-white sm:px-6 sm:py-12"
            style={{ maxWidth: CONTENT_MAX_W }}
          >
            {/* ========================== Info Cards ========================== */}
            <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {info.languages && (
                <InfoCard
                  title={labelByLang("Languages", lang)}
                  body={info.languages}
                />
              )}

              {info.serviceAreas && (
                <InfoCard
                  title={labelByLang("Service areas", lang)}
                  body={info.serviceAreas}
                />
              )}

              {info.businessHours && (
                <InfoCard
                  title={labelByLang("Business hours", lang)}
                  body={info.businessHours}
                />
              )}
            </section>

            {/* ========================== FAQ topics ========================== */}
            {faqTopics.length > 0 && (
              <section className="mt-10 sm:mt-12">
                <h2 className="text-xl font-semibold sm:text-2xl">
                  {labelByLang("Frequently asked topics", lang)}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
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
            )}

            {/* ========================== 表單開始 ========================== */}
            <section className="mt-10 sm:mt-12">
              <h2 className="text-xl font-semibold sm:text-2xl">
                {labelByLang("Contact form", lang)}
              </h2>

              <form
                id="contact-form"
                className="mt-5 grid gap-4 rounded-2xl bg-white/5 p-4 sm:gap-5 sm:p-6"
                action="/api/contact"
                method="post"
                encType="multipart/form-data"
              >
                {/* hidden */}
                <input type="hidden" name="lang" value={lang} />
                <TimezoneHidden />

                {/* ========================== 第一列：Name / Email ========================== */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                {/* ========================== 第二列：Phone / Company ========================== */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                {/* ========================== 國籍 ========================== */}
                <InputField
                  label={labelByLang("Nationality", lang)}
                  name="nationality"
                  required
                  lang={lang as ClientLang}
                  showInlineError={true}
                />

                {/* ========================== SUBJECT（加入 data-role） ========================== */}
                {Array.isArray(form.subjectOptions) &&
                  form.subjectOptions.length > 0 && (
                    <SelectField
                      data-role="subject-select"
                      label={labelByLang("Subject", lang)}
                      name="subject"
                      required
                      lang={lang as ClientLang}
                    >
                      <option value="" className="bg-white text-black">
                        {labelByLang("Please select", lang)}
                      </option>

                      {form.subjectOptions.map((s, i) => (
                        <option key={`sub-${i}`} value={s} className="bg-white text-black">
                          {s}
                        </option>
                      ))}
                    </SelectField>
                  )}

                {/* ========================== Preferred Language ========================== */}
                <SelectField
                  label={labelByLang("Preferred language", lang)}
                  name="preferredLanguage"
                  defaultValue={lang}
                  required
                  lang={lang as ClientLang}
                >
                  <option value="zh" className="bg-white text-black">
                    中文
                  </option>
                  <option value="jp" className="bg-white text-black">
                    日本語
                  </option>
                  <option value="en" className="bg-white text-black">
                    English
                  </option>
                </SelectField>

                {/* ========================== 型態：Client Type（動態顯示） ========================== */}
                <div
                  id="client-type-block"
                  data-role="client-type-block"
                  className="hidden"
                >
                  <RadioGroupField
                    data-role="client-type"
                    label={labelByLang("Client Type", lang)}
                    name="clientType"
                    options={clientTypeOptions}
                    required
                    lang={lang as ClientLang}
                  />
                </div>

                {/* ========================== 法人選項額外出現的兩個問題 ========================== */}
                <div
                  id="corp-extra-block"
                  data-role="corp-extra-block"
                  className="hidden space-y-4"
                >
                  <RadioGroupField
                    label={labelByLang("Type of Establishment", lang)}
                    name="establishmentType"
                    options={establishmentOptions}
                    required
                    lang={lang as ClientLang}
                  />

                  <InputField
                    label={labelByLang("Parent Company Country", lang)}
                    name="parentCompanyCountry"
                    required
                    lang={lang as ClientLang}
                  />
                </div>

                {/* ========================== Preferred Contact（來自 Sanity） ========================== */}
                {Array.isArray(form.preferredContactOptions) &&
                  form.preferredContactOptions.length > 0 && (
                    <RadioGroupField
                      label={labelByLang("Preferred contact", lang)}
                      name="preferredContact"
                      options={form.preferredContactOptions}
                      required
                      lang={lang as ClientLang}
                    />
                  )}

                {/* ========================== Summary ========================== */}
                <TextareaField
                  label={labelByLang("Summary", lang)}
                  name="summary"
                  placeholder={form?.summaryHint ?? ""}
                  lang={lang as ClientLang}
                />

                {/* ========================== Hidden datetime fields ========================== */}
                <div className="hidden" aria-hidden="true">
                  <label className="grid gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("First preferred time", lang)}
                    </span>
                    <input
                      type="datetime-local"
                      name="preferredTime1"
                      disabled
                      className="h-16 rounded-xl bg-white/10 px-3 text-white/50 outline-none"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm opacity-90">
                      {labelByLang("Second preferred time", lang)}
                    </span>
                    <input
                      type="datetime-local"
                      name="preferredTime2"
                      disabled
                      className="h-16 rounded-xl bg-white/10 px-3 text-white/50 outline-none"
                    />
                  </label>
                </div>

                {/* ========================== Attachment ========================== */}
                <FileUploadField
                  name="attachments"
                  lang={lang}
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

                {/* ========================== Consent ========================== */}
                <ConsentCheckbox lang={lang as ClientLang} />

                {/* ========================== Submit ========================== */}
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

            {/* ========================== 底部連結 ========================== */}
            <section className="mt-10 sm:mt-12">
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

      {/* ========================== 動態顯示 Script ========================== */}
      <Script id="contact-form-dynamics" strategy="afterInteractive">{`
        (function () {
          // 會觸發 A 型態出現的 Subject 文案
          var TRIGGER_SUBJECTS = new Set([
            "台湾進出支援",
            "台灣設立支援",
            "Taiwan Market Entry Support"
          ]);

          function qsa(selector) {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
          }

          function toggleHidden(el, show) {
            if (!el) return;
            el.classList.toggle("hidden", !show);
          }

          // 從整個 form 取得 name="subject" 的值，不管是 select 還是別的控件
          function getSubjectValue() {
            var form = document.getElementById("contact-form");
            if (!form || !form.elements) return "";
            var el = form.elements.namedItem("subject");
            if (!el) return "";
            var v = el.value || (el.getAttribute && el.getAttribute("value")) || "";
            return String(v).trim();
          }

          function isClientTypeCorp() {
            var radios = qsa('input[name="clientType"]');
            if (!radios.length) return false;
            // 約定第一個選項是「法人 / Corporation」
            return !!radios[0].checked;
          }

          function isEstablishmentChosen() {
            var radios = qsa('input[name="establishmentType"]');
            return radios.some(function (r) { return r.checked; });
          }

          // 控制 RadioGroupField 裡那顆 sr-only hidden input 的 required / disabled
          function setRadioGroupRequired(blockSelector, shouldRequire, isSatisfied) {
            var block = document.querySelector(blockSelector);
            if (!block) return;
            var hidden = block.querySelector("input.sr-only");
            if (!hidden) return;

            hidden.disabled = !shouldRequire;
            hidden.required = !!shouldRequire;

            if (!shouldRequire) {
              hidden.value = "ok";
              hidden.setCustomValidity("");
            } else {
              hidden.value = isSatisfied ? "ok" : "";
              hidden.setCustomValidity("");
            }
          }

          // 控制一般 text input 的 required / disabled
          function setInputRequired(selector, shouldRequire) {
            var input = document.querySelector(selector);
            if (!input) return;
            input.disabled = !shouldRequire;
            input.required = !!shouldRequire;
            if (!shouldRequire && input.setCustomValidity) {
              input.setCustomValidity("");
            }
          }

          function updateVisibility() {
            var subjectValue = getSubjectValue();
            var showClientType = TRIGGER_SUBJECTS.has(subjectValue);
            var isCorp = isClientTypeCorp();
            var showCorpExtra = showClientType && isCorp;

            var clientTypeBlock = document.querySelector('[data-role="client-type-block"]');
            var corpExtraBlock = document.querySelector('[data-role="corp-extra-block"]');

            toggleHidden(clientTypeBlock, showClientType);
            toggleHidden(corpExtraBlock, showCorpExtra);

            // A 型態：只在 showClientType = true 時必填
            setRadioGroupRequired(
              '[data-role="client-type-block"]',
              showClientType,
              isCorp || qsa('input[name="clientType"]').some(function (r) { return r.checked; })
            );

            // 設立型態：只在 showCorpExtra = true（法人，而且 A 型態顯示）時必填
            setRadioGroupRequired(
              '[data-role="corp-extra-block"]',
              showCorpExtra,
              isEstablishmentChosen()
            );

            // 母公司設立國：同樣只在 showCorpExtra = true 時必填
            setInputRequired('input[name="parentCompanyCountry"]', showCorpExtra);
          }

          function init() {
            var form = document.getElementById("contact-form");
            if (!form || !form.elements) return;

            var subjectEl = form.elements.namedItem("subject");
            if (subjectEl && subjectEl.addEventListener) {
              subjectEl.addEventListener("change", updateVisibility);
              subjectEl.addEventListener("input", updateVisibility);
            }

            var clientTypeRadios = qsa('input[name="clientType"]');
            clientTypeRadios.forEach(function (r) {
              r.addEventListener("change", updateVisibility);
            });

            var estTypeRadios = qsa('input[name="establishmentType"]');
            estTypeRadios.forEach(function (r) {
              r.addEventListener("change", updateVisibility);
            });

            // 初次載入就跑一次（處理預設值或回填）
            updateVisibility();
          }

          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", init);
          } else {
            init();
          }
        })();
      `}</Script>

      <FooterServer lang={lang} />
    </div>
  );
}

// ========================== 成功畫面 ==========================

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
          We will get back to you within 1–2 business days.
        </p>

        {Array.isArray(doc?.success?.message) && doc.success?.message?.length > 0 ? (
          <div className="prose prose-invert mt-5 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm sm:mt-6 sm:p-5">
            <PortableText value={doc.success.message} />
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 rounded-2xl bg-white/6 p-4 ring-1 ring-white/15 backdrop-blur-sm sm:mt-6 sm:p-5">
            <li className="flex items-start gap-3">
              <MailIcon className="mt-[2px] h-5 w-5 opacity-90" />
              <span className="text-sm opacity-95">
                A confirmation email has been sent. If you do not see it, please check your spam folder.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CalendarIcon className="mt-[2px] h-5 w-5 opacity-90" />
              <span className="text-sm opacity-95">
                If you proposed a time, our team will confirm availability or suggest alternatives.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldIcon className="mt-[2px] h-5 w-5 opacity-90" />
              <span className="text-sm opacity-95">
                Your information is kept confidential and used only for this inquiry.
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
            Back to Home
          </CtaLink>

          <CtaLink
            href="/services"
            lang={lang}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/10 px-5 font-medium text-white ring-1 ring-white/15 hover:bg-white/16 sm:h-11 md:h-12"
          >
            <ArrowRightIcon className="h-5 w-5" />
            View Services
          </CtaLink>

          <CtaLink
            href="/companyStrengthsAndFAQ"
            lang={lang}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/10 px-5 font-medium text-white ring-1 ring-white/15 hover:bg-white/16 sm:h-11 md:h-12"
          >
            <HelpIcon className="h-5 w-5" />
            View FAQ
          </CtaLink>
        </div>
      </div>
    </section>
  );
}

// ========================== Error Toast ==========================

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

// ========================== Info Card ==========================

function InfoCard({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="rounded-2xl bg-white/5 p-4 sm:p-5">
      {title && <div className="text-base font-semibold">{title}</div>}
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed opacity-90">
        {body}
      </p>
    </div>
  );
}

// ========================== Icons ==========================

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth={2} d="M4 6h16v12H4z" />
      <path strokeWidth={2} d="M22 6l-10 7L2 6" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x={3} y={4} width={18} height={18} rx={2} />
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
      <circle cx={12} cy={12} r={10} />
      <path d="M9.09 9a3 3 0 115.82 1c0 2-3 2-3 4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx={12} cy={12} r={10} />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}
