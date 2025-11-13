// File: apps/web/src/components/ContactForm.tsx
"use client";

import * as React from "react";

/* ========== Types & i18n ========== */
export type Lang = "jp" | "zh" | "en";

function tLabel(key: string, lang: Lang): string {
  const dict: Record<string, { zh: string; jp: string; en: string }> = {
    Name: { zh: "您的姓名", jp: "お名前", en: "Your Name" },
    Email: { zh: "Email", jp: "メールアドレス", en: "Email" },
    Phone: { zh: "聯絡電話", jp: "電話番号", en: "Phone" },
    Company: { zh: "公司名稱", jp: "会社名", en: "Company" },
    Subject: { zh: "主旨", jp: "件名", en: "Subject" },
    "Please select": { zh: "請選擇", jp: "選択してください", en: "Please select" },
    "Preferred language": { zh: "偏好聯絡語言", jp: "希望言語", en: "Preferred language" },
    Chinese: { zh: "繁體中文", jp: "中国語", en: "Chinese" },
    Japanese: { zh: "日文", jp: "日本語", en: "Japanese" },
    English: { zh: "英文", jp: "英語", en: "English" },
    "Preferred contact": { zh: "希望連絡方法", jp: "希望連絡方法", en: "Preferred Contact" },
    Summary: { zh: "需求摘要", jp: "概要", en: "Summary" },
    Attachment: { zh: "附件", jp: "添付ファイル", en: "Attachment" },
    Send: { zh: "送出", jp: "送信", en: "Send" },
    "First preferred time": { zh: "第一備選時段", jp: "第1希望日時", en: "First preferred time" },
    "Second preferred time": { zh: "第二備選時段", jp: "第2希望日時", en: "Second preferred time" },
    "Attachment hint default": {
      zh: "資料附件 PDF／Excel／圖片（上限 10MB）",
      jp: "資料添付 PDF／Excel／画像（10MB まで）",
      en: "Attachments PDF / Excel / Images (up to 10MB)",
    },
  };
  return dict[key]?.[lang] ?? key;
}

/* 額外：檔案上傳按鈕與狀態多語 */
function fileButtonText(lang: Lang): string {
  if (lang === "jp") return "ファイルを選択";
  if (lang === "en") return "Choose Files";
  return "選擇檔案";
}
function noFileText(lang: Lang): string {
  if (lang === "jp") return "ファイルが選択されていません";
  if (lang === "en") return "No file chosen";
  return "尚未選擇檔案";
}

/* ========== 驗證錯誤訊息 ========== */
function errMsgRequired(lang: Lang) {
  return lang === "jp"
    ? "このフィールドに入力してください。"
    : lang === "en"
    ? "Please fill out this field."
    : "請填寫此欄位。";
}
function errMsgEmail(lang: Lang) {
  return lang === "jp"
    ? "有効なメールアドレスを入力してください。"
    : lang === "en"
    ? "Please enter a valid email address."
    : "請輸入有效的 Email。";
}
function errMsgSelect(lang: Lang) {
  return lang === "jp"
    ? "いずれかを選択してください。"
    : lang === "en"
    ? "Please select an option."
    : "請選擇一項。";
}
function errMsgRadio(lang: Lang) {
  return lang === "jp"
    ? "いずれかを選択してください。"
    : lang === "en"
    ? "Please choose one option."
    : "請選擇一個選項。";
}
function errMsgConsent(lang: Lang) {
  return lang === "jp"
    ? "同意が必要です。"
    : lang === "en"
    ? "Consent is required."
    : "請勾選同意。";
}
function policyTextByLang(lang: Lang) {
  if (lang === "jp")
    return "入力いただいた情報は連絡・相談のみに使用し、第三者に共有しません。";
  if (lang === "en")
    return "The information you provide will be used only for communication and inquiry purposes, and will not be shared with third parties.";
  return "您提供的資訊僅作聯繫與諮詢用途，我們將妥善保護，不會提供予第三方。";
}

/* ========== validation props ========== */
function validationProps<
  T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>(kind: "text" | "email" | "select" | "textarea" | "checkbox", lang: Lang) {
  return {
    onInvalid: (e: React.FormEvent<T>) => {
      const el = e.currentTarget;
      if ("setCustomValidity" in el) el.setCustomValidity("");

      if (kind === "checkbox") {
        if ("setCustomValidity" in el) el.setCustomValidity(errMsgConsent(lang));
        return;
      }
      const validity = (
        el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      ).validity;

      if (validity?.valueMissing) {
        if ("setCustomValidity" in el)
          el.setCustomValidity(
            kind === "select" ? errMsgSelect(lang) : errMsgRequired(lang)
          );
        return;
      }
      if (kind === "email" && validity?.typeMismatch) {
        if ("setCustomValidity" in el)
          el.setCustomValidity(errMsgEmail(lang));
        return;
      }
      if ("setCustomValidity" in el) el.setCustomValidity("");
    },
    onInput: (e: React.FormEvent<T>) => {
      const el = e.currentTarget;
      if ("setCustomValidity" in el) el.setCustomValidity("");
    },
  };
}

/* ========== Styles ========== */
const inputBase =
  "peer box-border mt-1 w-full max-w-full min-w-0 rounded-xl border border-gray-300/70 bg-white px-3 py-3 h-12 text-[15px] " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition";
const textareaBase =
  "peer box-border mt-1 w-full max-w-full min-w-0 rounded-xl border border-gray-300/70 bg-white px-3 py-3 text-[15px] min-h-[130px] " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition";

/* ========== Fields ========== */
export function InputField(props: {
  label: string;
  name: string;
  lang: Lang;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
}) {
  const { label, name, type = "text", required, lang, placeholder } = props;
  const vProps =
    type === "email"
      ? validationProps<HTMLInputElement>("email", lang)
      : validationProps<HTMLInputElement>("text", lang);
  const inline = type === "email" ? errMsgEmail(lang) : errMsgRequired(lang);
  return (
    <label className="grid min-w-0 max-w-full gap-1.5">
      <span className="text-sm font-medium text-gray-900">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder ?? ""}
        className={inputBase}
        {...vProps}
      />
      <span className="mt-1 h-4 text-xs text-red-600 invisible peer-[&:invalid]:visible">
        {inline}
      </span>
    </label>
  );
}

export function TextareaField(props: {
  label: string;
  name: string;
  lang: Lang;
  required?: boolean;
  placeholder?: string;
}) {
  const { label, name, required, lang, placeholder } = props;
  return (
    <label className="grid min-w-0 max-w-full gap-1.5">
      <span className="text-sm font-medium text-gray-900">
        {label}
        {required ? " *" : ""}
      </span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder ?? ""}
        className={textareaBase}
        {...validationProps<HTMLTextAreaElement>("textarea", lang)}
      />
      <span className="mt-1 h-4 text-xs text-red-600 invisible peer-[&:invalid]:visible">
        {errMsgRequired(lang)}
      </span>
    </label>
  );
}

export function SelectField(props: {
  label: string;
  name: string;
  lang: Lang;
  required?: boolean;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  const { label, name, lang, required, defaultValue, children } = props;
  return (
    <label className="grid min-w-0 max-w-full gap-1.5">
      <span className="text-sm font-medium text-gray-900">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={inputBase}
        {...validationProps<HTMLSelectElement>("select", lang)}
      >
        {children}
      </select>
      <span className="mt-1 h-4 text-xs text-red-600 invisible peer-[&:invalid]:visible">
        {errMsgSelect(lang)}
      </span>
    </label>
  );
}

export function RadioGroupField(props: {
  label: string;
  name: string;
  lang: Lang;
  options: string[];
  required?: boolean;
}) {
  const { label, name, lang, options, required } = props;
  const hiddenId = React.useId();
  return (
    <div className="grid min-w-0 max-w-full gap-1.5">
      <span className="text-sm font-medium text-gray-900">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        id={hiddenId}
        className="peer sr-only"
        tabIndex={-1}
        required={required}
        value=""
        onInvalid={(e) =>
          (e.currentTarget as HTMLInputElement).setCustomValidity(
            errMsgRadio(lang)
          )
        }
        onInput={(e) =>
          (e.currentTarget as HTMLInputElement).setCustomValidity("")
        }
      />
      <div
        className="flex flex-wrap items-center gap-3"
        onChange={() => {
          const h = document.getElementById(hiddenId) as HTMLInputElement | null;
          if (h) {
            h.value = "ok";
            h.setCustomValidity("");
          }
        }}
      >
        {(options ?? []).map((op, i) => (
          <label key={`rg-${name}-${i}`} className="flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={op}
              className="h-4 w-4 text-[#1C3D5A] focus:ring-[#1C3D5A]"
            />
            <span className="text-sm text-gray-900">{op}</span>
          </label>
        ))}
      </div>
      <span className="mt-1 h-4 text-xs text-red-600 invisible peer-invalid:visible">
        {errMsgRadio(lang)}
      </span>
    </div>
  );
}

export function ConsentCheckbox({ lang }: { lang: Lang }) {
  return (
    <label className="grid min-w-0 gap-2">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1C3D5A] focus:ring-[#1C3D5A]"
          {...validationProps<HTMLInputElement>("checkbox", lang)}
        />
        <div className="text-sm text-gray-700">
          {policyTextByLang(lang)}
        </div>
      </div>
      <span className="mt-1 h-4 text-xs text-red-600 invisible [input:invalid+div+&]:visible">
        {errMsgConsent(lang)}
      </span>
    </label>
  );
}

/* ========== 主表單 ========== */
export default function ContactForm({
  lang = "zh",
  subjectOptions,
  preferredContactOptions,
  summaryHint,
  datetimeHint,
  attachmentHint,
}: {
  lang?: Lang;
  subjectOptions?: string[];
  preferredContactOptions?: string[];
  summaryHint?: string | null;
  datetimeHint?: string | null;
  attachmentHint?: string | null;
}) {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  // 上傳檔案顯示文字
  const [fileText, setFileText] = React.useState<string>("");

  function detectTimezone(): string {
    try {
      const tz =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
      return tz;
    } catch {
      return "America/Chicago";
    }
  }

  function applyTimezoneToForm() {
    const form = formRef.current;
    if (!form) return;
    const el = form.elements.namedItem("timezone") as HTMLInputElement | null;
    if (el) {
      el.value = detectTimezone();
    }
  }

  // 掛載後先寫一次
  React.useEffect(() => {
    applyTimezoneToForm();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFileText("");
      return;
    }
    if (files.length === 1) {
      setFileText(files[0].name);
    } else {
      if (lang === "jp") {
        setFileText(`${files.length} 件のファイルを選択しました`);
      } else if (lang === "en") {
        setFileText(`${files.length} files selected`);
      } else {
        setFileText(`已選擇 ${files.length} 個檔案`);
      }
    }
  };

  const subjectOps = Array.isArray(subjectOptions) ? subjectOptions : [];
  const contactOps = Array.isArray(preferredContactOptions)
    ? preferredContactOptions
    : [];

  // 只有 Sanity 有提供聯絡方式選項才顯示該欄位
  const hasPreferredContact = contactOps.length > 0;

  return (
    <form
      ref={formRef}
      action="/api/contact"
      method="post"
      encType="multipart/form-data"
      className="space-y-4 overflow-x-clip rounded-2xl bg-white p-4 text-gray-900 shadow sm:space-y-5 sm:p-6"
      onSubmit={applyTimezoneToForm}
    >
      <input type="hidden" name="lang" value={lang} />
      {/* 初始值給 Chicago，實際送出前會被 applyTimezoneToForm 覆寫 */}
      <input type="hidden" name="timezone" defaultValue="America/Chicago" />

      {/* 第一列 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField label={tLabel("Name", lang)} name="name" lang={lang} required />
        <InputField
          label={tLabel("Email", lang)}
          name="email"
          type="email"
          lang={lang}
          required
          placeholder="name@example.com"
        />
      </div>

      {/* 第二列 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label={tLabel("Phone", lang)}
          name="phone"
          lang={lang}
          required
          placeholder={
            lang === "en"
              ? "+1 555 000 0000"
              : lang === "jp"
              ? "090-0000-0000"
              : "0900-000-000"
          }
        />
        <InputField label={tLabel("Company", lang)} name="company" lang={lang} />
      </div>

      {/* 件名（Subject） */}
      <SelectField
        label={tLabel("Subject", lang)}
        name="subject"
        lang={lang}
        required
        defaultValue=""
      >
        <option value="">{tLabel("Please select", lang)}</option>
        {subjectOps.map((s, i) => (
          <option key={`sub-${i}`} value={s}>
            {s}
          </option>
        ))}
      </SelectField>

      {/* 希望語言 */}
      <SelectField
        label={tLabel("Preferred language", lang)}
        name="preferredLanguage"
        lang={lang}
        required
        defaultValue={lang}
      >
        <option value="zh">{tLabel("Chinese", lang)}</option>
        <option value="jp">{tLabel("Japanese", lang)}</option>
        <option value="en">{tLabel("English", lang)}</option>
      </SelectField>

      {/* 希望連絡方法：Sanity 未回傳則不顯示也不要求必填 */}
      {hasPreferredContact && (
        <RadioGroupField
          label={tLabel("Preferred contact", lang)}
          name="preferredContact"
          lang={lang}
          options={contactOps}
          required
        />
      )}

      {/* 概要 */}
      <TextareaField
        label={tLabel("Summary", lang)}
        name="summary"
        lang={lang}
        placeholder={summaryHint ?? ""}
      />

      {/* 附件：自訂按鈕＋多語文字 */}
      <div className="grid min-w-0 gap-1.5">
        <span className="text-sm font-medium text-gray-900">
          {tLabel("Attachment", lang)}
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center rounded-xl bg-[#1C3D5A] px-3 py-2 text-sm font-medium text-white cursor-pointer">
            {fileButtonText(lang)}
            <input
              type="file"
              name="attachments"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        <span className="text-xs text-gray-600 truncate max-w-full">
            {fileText || noFileText(lang)}
          </span>
        </div>
        <span className="mt-1 text-xs text-gray-500">
          {attachmentHint ?? tLabel("Attachment hint default", lang)}
        </span>
      </div>

      <ConsentCheckbox lang={lang} />

      <div className="pt-1">
        <button
          type="submit"
          className="h-12 w-full rounded-2xl bg-[#1C3D5A] px-5 font-medium text-white transition hover:opacity-95 sm:w-auto"
        >
          {tLabel("Send", lang)}
        </button>
      </div>
    </form>
  );
}
