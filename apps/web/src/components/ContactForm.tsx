// File: apps/web/src/components/ContactForm.tsx
"use client";

import React, { useMemo, useState } from "react";

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
      preferredTime: string;
      attachments: string;
      consent: string;
      send: string;
      sending: string;
      success: string;
      failPrefix: string;
    };
    placeholder: {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      summary?: string;
      preferredContact?: string;
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
      preferredTime: "偏好聯絡時間",
      attachments: "附件",
      consent: "我同意隱私權政策",
      send: "送出",
      sending: "傳送中…",
      success: "已送出，請留意信箱。",
      failPrefix: "送出失敗：",
    },
    placeholder: {
      name: "王小明",
      email: "name@example.com",
      phone: "0900-000-000",
      subject: "我要諮詢的主題",
      summary: "請描述您的需求與背景…",
      preferredContact: "Email / Phone / LINE",
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
      preferredTime: "ご希望の連絡時間",
      attachments: "添付ファイル",
      consent: "プライバシーポリシーに同意します",
      send: "送信",
      sending: "送信中…",
      success: "送信しました。メールをご確認ください。",
      failPrefix: "送信に失敗しました：",
    },
    placeholder: {
      name: "山田 太郎",
      email: "name@example.com",
      phone: "090-0000-0000",
      subject: "ご相談の件名",
      summary: "背景とご要望をご記入ください…",
      preferredContact: "Email / Phone / LINE",
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
      preferredTime: "Preferred Time",
      attachments: "Attachments",
      consent: "I agree to the privacy policy",
      send: "Send",
      sending: "Sending…",
      success: "Submitted. Please check your inbox.",
      failPrefix: "Failed: ",
    },
    placeholder: {
      name: "Jane Doe",
      email: "name@example.com",
      phone: "+1 555 000 0000",
      subject: "What you want to discuss",
      summary: "Describe your needs and background…",
      preferredContact: "Email / Phone / LINE",
    },
  },
};

function useI18n(lang: Lang) {
  return useMemo(() => I18N[lang] ?? I18N.zh, [lang]);
}

export default function ContactForm({
  lang = "zh",
}: {
  lang?: Lang;
}) {
  const t = useI18n(lang);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErr("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("lang", lang);
    fd.set("returnTo", typeof window !== "undefined" ? window.location.pathname : "/");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      if (res.type === "opaqueredirect" || res.redirected || res.status === 303) {
        setStatus("ok");
        form.reset();
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
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
    <form onSubmit={onSubmit} encType="multipart/form-data" className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium">{t.label.name}</label>
        <input
          name="name"
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder={t.placeholder.name}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">{t.label.email}</label>
          <input
            type="email"
            name="email"
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder={t.placeholder.email}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t.label.phone}</label>
          <input
            name="phone"
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder={t.placeholder.phone}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">{t.label.subject}</label>
        <input
          name="subject"
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder={t.placeholder.subject}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">{t.label.summary}</label>
        <textarea
          name="summary"
          className="mt-1 w-full rounded border px-3 py-2"
          rows={6}
          placeholder={t.placeholder.summary}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">{t.label.preferredContact}</label>
          <input
            name="preferredContact"
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder={t.placeholder.preferredContact}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t.label.preferredTime}</label>
          <input type="datetime-local" name="datetime" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">{t.label.attachments}</label>
        <input type="file" name="attachments" multiple className="mt-1 w-full" />
      </div>

      <div className="flex items-center gap-2">
        <input id="consent" type="checkbox" name="consent" value="yes" required />
        <label htmlFor="consent" className="text-sm">
          {t.label.consent}
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded bg-[#1C3D5A] px-4 py-2 text-white"
      >
        {status === "loading" ? t.label.sending : t.label.send}
      </button>

      {status === "ok" && <p className="text-green-600">{t.label.success}</p>}
      {status === "err" && (
        <p className="text-red-600">
          {t.label.failPrefix}
          {err}
        </p>
      )}
    </form>
  );
}
