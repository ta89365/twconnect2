// File: apps/web/src/components/ContactForm.tsx
"use client";

import React, { useMemo, useState } from "react";
import TimezoneSelect from "@/components/TimezoneSelect";

type Lang = "jp" | "zh" | "en";

const I18N: Record<
  Lang,
  {
    label: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      summary: string;
      preferredContact: string;
      preferredTime1: string;
      preferredTime2: string;
      timezone: string;
      attachments: string;
      consent: string;
      send: string;
      sending: string;
      success: string;
      failPrefix: string;
      pleaseSelect: string;
    };
    placeholder: {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      summary?: string;
      preferredContact?: string;
      timezone?: string;
    };
  }
> = {
  zh: {
    label: {
      name: "姓名",
      email: "電子郵件",
      phone: "電話",
      subject: "主旨",
      summary: "需求摘要",
      preferredContact: "偏好聯絡方式",
      preferredTime1: "第一備選時段",
      preferredTime2: "第二備選時段",
      timezone: "時區",
      attachments: "附件",
      consent: "我同意隱私權政策",
      send: "送出",
      sending: "傳送中…",
      success: "已送出，請留意信箱。",
      failPrefix: "送出失敗：",
      pleaseSelect: "請選擇",
    },
    placeholder: {
      name: "王小明",
      email: "name@example.com",
      phone: "0900-000-000",
      subject: "我要諮詢的主題",
      summary: "請描述您的需求與背景…",
      preferredContact: "Email / Phone / LINE",
      timezone: "例如 Asia/Taipei",
    },
  },
  jp: {
    label: {
      name: "お名前",
      email: "メールアドレス",
      phone: "電話番号",
      subject: "件名",
      summary: "ご相談内容",
      preferredContact: "ご希望の連絡方法",
      preferredTime1: "第1希望日時",
      preferredTime2: "第2希望日時",
      timezone: "タイムゾーン",
      attachments: "添付ファイル",
      consent: "プライバシーポリシーに同意します",
      send: "送信",
      sending: "送信中…",
      success: "送信しました。メールをご確認ください。",
      failPrefix: "送信に失敗しました：",
      pleaseSelect: "選択してください",
    },
    placeholder: {
      name: "山田 太郎",
      email: "name@example.com",
      phone: "090-0000-0000",
      subject: "ご相談の件名",
      summary: "背景とご要望をご記入ください…",
      preferredContact: "Email / Phone / LINE",
      timezone: "例：Asia/Tokyo",
    },
  },
  en: {
    label: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      subject: "Subject",
      summary: "Summary",
      preferredContact: "Preferred Contact",
      preferredTime1: "First preferred time",
      preferredTime2: "Second preferred time",
      timezone: "Time zone",
      attachments: "Attachments",
      consent: "I agree to the privacy policy",
      send: "Send",
      sending: "Sending…",
      success: "Submitted. Please check your inbox.",
      failPrefix: "Failed: ",
      pleaseSelect: "Please select",
    },
    placeholder: {
      name: "Jane Doe",
      email: "name@example.com",
      phone: "+1 555 000 0000",
      subject: "What you want to discuss",
      summary: "Describe your needs and background…",
      preferredContact: "Email / Phone / LINE",
      timezone: "e.g. America/Chicago",
    },
  },
};

function useI18n(lang: Lang) {
  return useMemo(() => I18N[lang] ?? I18N.zh, [lang]);
}

export default function ContactForm({ lang = "zh" }: { lang?: Lang }) {
  const t = useI18n(lang);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string>("");

  const inputBase =
    "mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-3 h-12 text-[15px] leading-none placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition";
  const textAreaBase =
    "mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-3 text-[15px] placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition min-h-[140px] resize-y";
  const labelBase = "block text-sm font-medium";
  const sectionGap = "space-y-4 sm:space-y-5";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErr("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("lang", lang);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      // 處理 303 redirect（Vercel/Edge）
      const loc = res.headers.get("Location") || res.headers.get("location") || "";
      if (res.status === 303 && typeof window !== "undefined") {
        try {
          const url = new URL(loc || "/contact", window.location.origin);
          const submitted = url.searchParams.get("submitted");
          const errMsg = url.searchParams.get("error") || "";
          if (submitted === "1") {
            setStatus("ok");
            form.reset();
            return;
          }
          if (submitted === "0") {
            setStatus("err");
            setErr(errMsg || "MAIL_FAILED");
            return;
          }
        } catch {
          setStatus("ok");
          form.reset();
          return;
        }
      }

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "SEND_FAILED");
        setStatus("ok");
        form.reset();
        return;
      }

      if (res.ok) {
        setStatus("ok");
        form.reset();
        return;
      }

      throw new Error(`HTTP ${res.status}`);
    } catch (e: any) {
      setStatus("err");
      setErr(e?.message ?? "SEND_FAILED");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      encType="multipart/form-data"
      className={`max-w-xl ${sectionGap}`}
      // 手機優先：增加邊界與可點擊高度
      noValidate
    >
      <input type="hidden" name="lang" value={lang} />

      <div>
        <label className={labelBase}>{t.label.name}</label>
        <input
          name="name"
          className={inputBase}
          placeholder={t.placeholder.name}
          required
          autoComplete="name"
          inputMode="text"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelBase}>{t.label.email}</label>
          <input
            type="email"
            name="email"
            className={inputBase}
            placeholder={t.placeholder.email}
            required
            autoComplete="email"
            inputMode="email"
          />
        </div>
        <div>
          <label className={labelBase}>{t.label.phone}</label>
          <input
            name="phone"
            className={inputBase}
            placeholder={t.placeholder.phone}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
      </div>

      <div>
        <label className={labelBase}>{t.label.subject}</label>
        <input
          name="subject"
          className={inputBase}
          placeholder={t.placeholder.subject}
          required
          autoComplete="off"
        />
      </div>

      <div>
        <label className={labelBase}>{t.label.summary}</label>
        <textarea
          name="summary"
          className={textAreaBase}
          rows={6}
          placeholder={t.placeholder.summary}
          required
        />
        {/* 手機可讀性提示行高稍高 */}
        <p className="mt-1 text-xs text-gray-500">
          {/* 保持簡短，不影響原流程 */}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelBase}>{t.label.preferredContact}</label>
          <input
            name="preferredContact"
            className={inputBase}
            placeholder={t.placeholder.preferredContact}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={labelBase}>{t.label.preferredTime1}</label>
          <input
            type="datetime-local"
            name="preferredTime1"
            className={inputBase}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelBase}>{t.label.preferredTime2}</label>
          <input
            type="datetime-local"
            name="preferredTime2"
            className={inputBase}
            inputMode="numeric"
          />
        </div>

        {/* ✅ 使用新版 TimezoneSelect（保持 variant="light" 不變） */}
        <div>
          <label className={labelBase}>{t.label.timezone}</label>
          <div className="mt-1">
            <TimezoneSelect name="timezone" variant="light" />
          </div>
        </div>
      </div>

      <div>
        <label className={labelBase}>{t.label.attachments}</label>
        <input
          type="file"
          name="attachments"
          multiple
          className="mt-1 w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#1C3D5A] file:px-3 file:py-2 file:text-white"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          id="consent"
          type="checkbox"
          name="consent"
          value="yes"
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1C3D5A] focus:ring-[#1C3D5A]"
        />
        <label htmlFor="consent" className="text-sm leading-6">
          {t.label.consent}
        </label>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-12 w-full rounded-2xl bg-[#1C3D5A] px-5 font-medium text-white transition hover:opacity-95 disabled:opacity-70 sm:w-auto"
        >
          {status === "loading" ? t.label.sending : t.label.send}
        </button>
      </div>

      <div aria-live="polite" className="min-h-[1.25rem]">
        {status === "ok" && <p className="text-sm text-green-600">{t.label.success}</p>}
        {status === "err" && (
          <p className="text-sm text-red-600">
            {t.label.failPrefix}
            {err}
          </p>
        )}
      </div>
    </form>
  );
}
