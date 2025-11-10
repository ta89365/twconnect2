"use client";

import * as React from "react";

export type Lang = "jp" | "zh" | "en";

/* ========== i18n：錯誤訊息與固定文案 ========== */
function errMsgRequired(lang: Lang) {
  return lang === "jp" ? "このフィールドに入力してください。" : lang === "en" ? "Please fill out this field." : "請填寫此欄位。";
}
function errMsgEmail(lang: Lang) {
  return lang === "jp" ? "有効なメールアドレスを入力してください。" : lang === "en" ? "Please enter a valid email address." : "請輸入有效的 Email。";
}
function errMsgSelect(lang: Lang) {
  return lang === "jp" ? "いずれかを選択してください。" : lang === "en" ? "Please select an option." : "請選擇一項。";
}
function errMsgConsent(lang: Lang) {
  return lang === "jp" ? "同意が必要です。" : lang === "en" ? "Consent is required." : "請勾選同意。";
}
function errMsgRadio(lang: Lang) {
  return lang === "jp" ? "いずれかを選択してください。" : lang === "en" ? "Please choose one option." : "請選擇一個選項。";
}
function policyTextByLang(lang: Lang) {
  if (lang === "jp") return "入力いただいた情報は連絡・相談のみに使用し、第三者に共有しません。";
  if (lang === "en") return "The information you provide will be used only for communication and inquiry purposes, and will not be shared with third parties.";
  return "您提供的資訊僅作聯繫與諮詢用途，我們將妥善保護，不會提供予第三方。";
}

/* ========= 泛型驗證屬性（Client 端） ========= */
function validationProps<
  T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>(
  kind: "text" | "email" | "select" | "textarea" | "checkbox",
  lang: Lang
) {
  return {
    onInvalid: (e: React.FormEvent<T>) => {
      const el = e.currentTarget as any;
      if ("setCustomValidity" in el) el.setCustomValidity("");

      if (kind === "checkbox") {
        if ("setCustomValidity" in el) el.setCustomValidity(errMsgConsent(lang));
        return;
      }

      const validity = (el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).validity;

      if (validity?.valueMissing) {
        if ("setCustomValidity" in el)
          el.setCustomValidity(kind === "select" ? errMsgSelect(lang) : errMsgRequired(lang));
        return;
      }

      if (kind === "email" && validity?.typeMismatch) {
        if ("setCustomValidity" in el) el.setCustomValidity(errMsgEmail(lang));
        return;
      }

      if ("setCustomValidity" in el) el.setCustomValidity("");
    },

    onInput: (e: React.FormEvent<T>) => {
      const el = e.currentTarget as any;
      if ("setCustomValidity" in el) el.setCustomValidity("");
    },
  };
}

/* ========== 共用欄位元件（固定高度占位，避免左右不對齊） ========== */
export function InputField(props: {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  lang: Lang;
  placeholder?: string;
  showInlineError?: boolean; // ✅ 新增：控制是否顯示底部錯誤訊息
}) {
  const { label, name, type = "text", required, lang, placeholder, showInlineError = true } = props;

  const vProps =
    type === "email"
      ? validationProps<HTMLInputElement>("email", lang)
      : validationProps<HTMLInputElement>("text", lang);

  const inlineMsg = type === "email" ? errMsgEmail(lang) : errMsgRequired(lang);

  // 共同樣式：白底或深底的專案可自行替換
  const inputBase =
    "peer h-12 w-full min-w-0 max-w-full rounded-xl bg-white/10 px-3 py-2 text-white placeholder-white/70 outline-none";

  // 固定高度的占位列：無論是否顯示錯誤，span 都會存在，確保等高
  const errorRowClass = showInlineError
    ? "mt-1 h-4 text-xs text-red-200 invisible peer-[&:invalid]:visible"
    : "mt-1 h-4 text-xs opacity-0 select-none"; // 透明占位

  return (
    <label className="grid min-w-0 max-w-full gap-2">
      <span className="text-sm opacity-90">
        {label}
        {required ? " *" : ""}
      </span>

      <input
        type={type}
        name={name}
        className={inputBase}
        required={required}
        placeholder={placeholder ?? ""}
        {...vProps}
      />

      <span className={errorRowClass} aria-live="polite">
        {showInlineError && required ? inlineMsg : " "}
      </span>
    </label>
  );
}

export function TextareaField(props: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  lang: Lang;
}) {
  const { label, name, placeholder, required, lang } = props;

  const base =
    "peer min-h-[130px] w-full min-w-0 max-w-full rounded-xl bg-white/10 px-3 py-3 text-white placeholder-white/60 outline-none sm:min-h-[140px]";

  return (
    <label className="grid min-w-0 max-w-full gap-2">
      <span className="text-sm opacity-90">
        {label}
        {required ? " *" : ""}
      </span>

      <textarea
        name={name}
        className={base}
        placeholder={placeholder ?? ""}
        required={required}
        {...validationProps<HTMLTextAreaElement>("textarea", lang)}
      />

      {/* 與 InputField 一致，固定高度 */}
      <span
        className={required ? "mt-1 h-4 text-xs text-red-200 invisible peer-[&:invalid]:visible" : "mt-1 h-4 text-xs opacity-0 select-none"}
        aria-live="polite"
      >
        {required ? errMsgRequired(lang) : " "}
      </span>
    </label>
  );
}

export function SelectField(props: {
  label: string;
  name: string;
  children: React.ReactNode;
  required?: boolean;
  defaultValue?: string;
  lang: Lang;
}) {
  const { label, name, children, required, defaultValue, lang } = props;

  const base =
    "peer h-12 w-full min-w-0 max-w-full rounded-xl bg-white/90 px-3 py-2 text-black outline-none";

  return (
    <div className="grid min-w-0 max-w-full gap-2">
      <label className="text-sm opacity-90">
        {label}
        {required ? " *" : ""}
      </label>

      <select
        name={name}
        defaultValue={defaultValue}
        className={base}
        required={required}
        {...validationProps<HTMLSelectElement>("select", lang)}
      >
        {children}
      </select>

      {/* 固定高度占位 */}
      <span
        className={required ? "mt-1 h-4 text-xs text-red-200 invisible peer-[&:invalid]:visible" : "mt-1 h-4 text-xs opacity-0 select-none"}
        aria-live="polite"
      >
        {required ? errMsgSelect(lang) : " "}
      </span>
    </div>
  );
}

/* 單選群組（必填） */
export function RadioGroupField(props: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  lang: Lang;
}) {
  const { label, name, options, required, lang } = props;

  // 用一個不可見的 input 來承載 required 與自訂訊息
  const hiddenId = React.useId();

  return (
    <div className="grid min-w-0 max-w-full gap-2">
      <span className="text-sm opacity-90">
        {label}
        {required ? " *" : ""}
      </span>

      {/* 隱藏 required 承載器，當群組沒有被選時會處於 :invalid */}
      <input
        id={hiddenId}
        tabIndex={-1}
        className="peer sr-only"
        required={required}
        value=""
        onFocus={(e) => e.currentTarget.blur()}
        onInvalid={(e) => {
          const el = e.currentTarget as HTMLInputElement;
          el.setCustomValidity(errMsgRadio(lang));
        }}
        onInput={(e) => {
          const el = e.currentTarget as HTMLInputElement;
          el.setCustomValidity("");
        }}
      />

      <div
        className="flex flex-wrap items-center gap-3"
        onChange={() => {
          const hidden = document.getElementById(hiddenId) as HTMLInputElement | null;
          if (hidden) {
            hidden.value = "ok"; // 任何改變都代表已選擇
            hidden.setCustomValidity("");
          }
        }}
      >
        {options.map((op, i) => (
          <label key={`radio-${name}-${i}`} className="flex min-w-0 items-center gap-2">
            <input className="h-4 w-4 accent-white" type="radio" name={name} value={op} />
            <span className="text-sm">{op}</span>
          </label>
        ))}
      </div>

      {/* 固定高度占位 */}
      <span
        className={required ? "mt-1 h-4 text-xs text-red-200 invisible peer-invalid:visible" : "mt-1 h-4 text-xs opacity-0 select-none"}
        aria-live="polite"
      >
        {required ? errMsgRadio(lang) : " "}
      </span>
    </div>
  );
}

export function ConsentCheckbox(props: { lang: Lang }) {
  const { lang } = props;
  return (
    <label className="mt-1 grid min-w-0 gap-2 sm:mt-2">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="consent"
          value="Yes"
          required
          className="mt-1 h-4 w-4 accent-white"
          {...validationProps<HTMLInputElement>("checkbox", lang)}
        />
        <div className="text-sm opacity-90">{policyTextByLang(lang)}</div>
      </div>
      {/* 固定高度占位 */}
      <span className="mt-1 h-4 text-xs text-red-200 opacity-0 select-none [input:invalid+div+&]:opacity-100" aria-live="polite">
        {errMsgConsent(lang)}
      </span>
    </label>
  );
}
