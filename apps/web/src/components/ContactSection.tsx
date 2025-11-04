// File: apps/web/src/components/ContactSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import TimezoneSelect from "@/components/TimezoneSelect";
import type { ContactData, Lang } from "@/lib/types/contact";

type Status = "idle" | "sending" | "done" | "error";

const okMsg: Record<Lang, string> = {
  jp: "送信ありがとうございます。1営業日以内にご連絡いたします。お急ぎの場合は LINE（@030qreji）でもご連絡ください。",
  zh: "感謝您的填寫，我們將在 1 個工作日內回覆。若有急件，請直接透過 LINE（@030qreji）聯繫我們。",
  en: "Thank you for your inquiry. We will respond within 1 business day. For urgent matters, please reach us directly on LINE (@030qreji).",
};

const btnLabel: Record<Lang, { line: string; mail: string; submit: string; sending: string }> = {
  jp: { line: "LINEでのお問い合わせ", mail: "メールでのお問い合わせ", submit: "👉 無料相談を送信", sending: "送信中…" },
  zh: { line: "透過 LINE 聯絡", mail: "透過 Email 聯絡", submit: "👉 送出免費諮詢", sending: "傳送中…" },
  en: { line: "Contact via LINE", mail: "Contact via Email", submit: "👉 Send Inquiry", sending: "Sending…" },
};

/* 表單多語 */
const tForm = {
  name: { jp: "お名前 ★", zh: "姓名 ★", en: "Name ★" },
  email: { jp: "メールアドレス ★", zh: "電子郵件 ★", en: "Email ★" },
  topicLabel: { jp: "ご相談カテゴリー / Topic ★", zh: "諮詢主題 / Topic ★", en: "Topic ★" },
  message: { jp: "ご相談内容 / Message ★", zh: "諮詢內容 / Message ★", en: "Message ★" },
  company: { jp: "所属会社 / Company", zh: "所屬公司 / Company", en: "Company" },
  phone: { jp: "電話番号 / Phone", zh: "電話號碼 / Phone", en: "Phone" },
  langLabel: { jp: "希望対応言語 / Preferred Language", zh: "希望對應語言 / Preferred Language", en: "Preferred Language" },
  preferredContact: { jp: "ご希望の連絡方法", zh: "偏好聯絡方式", en: "Preferred Contact" },
  time1: { jp: "第1希望日時", zh: "第一備選時段", en: "First preferred time" },
  time2: { jp: "第2希望日時", zh: "第二備選時段", en: "Second preferred time" },
  timezone: { jp: "タイムゾーン", zh: "時區", en: "Time zone" },
} as const;

/* 內嵌提示多語（第二行顯示） */
const tHint: Record<Lang, string> = {
  zh: "請選擇日期與時間",
  jp: "日付と時刻を選択してください",
  en: "Select date and time",
};

const topicOptions: Record<Lang, string[]> = {
  jp: ["会社設立 / Company Setup", "会計・税務 / Accounting & Tax", "ビザ・人材 / Visa & HR", "市場開拓 / Market Entry", "その他 / Others"],
  zh: ["公司設立 / Company Setup", "會計與稅務 / Accounting & Tax", "簽證與人力 / Visa & HR", "市場開拓 / Market Entry", "其他 / Others"],
  en: ["Company Setup", "Accounting & Tax", "Visa & HR", "Market Entry", "Others"],
};

export default function ContactSection({ data, lang }: { data: ContactData | null; lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");

  if (!data) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // 蜜罐
    if ((fd.get("website") as string)?.length > 0) {
      setStatus("done");
      return;
    }

    // 對齊 /api/contact
    const topic = (fd.get("topic") as string) || "";
    const message = (fd.get("message") as string) || "";
    fd.set("subject", topic);
    fd.set("summary", message);
    fd.delete("topic");
    fd.delete("message");
    fd.set("lang", lang);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd, headers: { Accept: "application/json" } });
      const loc = res.headers.get("Location") || res.headers.get("location") || "";
      if (res.status === 303 && typeof window !== "undefined") {
        try {
          const url = new URL(loc || "/contact", window.location.origin);
          const submitted = url.searchParams.get("submitted");
          const errMsg = url.searchParams.get("error") || "";
          if (submitted === "1") { setStatus("done"); form.reset(); return; }
          if (submitted === "0") { setStatus("error"); setErr(errMsg || "MAIL_FAILED"); return; }
        } catch { setStatus("done"); form.reset(); return; }
      }
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "SEND_FAILED");
        setStatus("done"); form.reset(); return;
      }
      if (res.ok) { setStatus("done"); form.reset(); return; }
      throw new Error(`HTTP ${res.status}`);
    } catch (e: any) { setStatus("error"); setErr(e?.message ?? "Failed to submit"); }
  }

  const lineHref = data.lineId ? `https://line.me/R/ti/p/${encodeURIComponent(data.lineId)}` : undefined;
  const mailHref = data.email ? `mailto:${data.email}` : undefined;

  /* 共用輸入樣式：加上 box-border 防溢出 */
  const inputBase =
    "box-border w-full max-w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-3 h-12 text-[15px] leading-none " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition";
  const selectBase =
    "box-border w-full max-w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-3 h-12 text-[15px] leading-none " +
    "focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition";
  const textareaBase =
    "box-border w-full max-w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 py-3 text-[15px] leading-relaxed min-h-[140px] " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C3D5A] focus:border-transparent transition";

  /* datetime：高度拉高＋下緣留白，並保留 box-border */
  const dtInputBase =
  inputBase.replace("h-12", "h-16") +
  " pt-2 pb-6 truncate whitespace-nowrap overflow-hidden";

  return (
    <section className="bg-[#1C3D5A] text-white overflow-x-hidden">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          {data?.heading && <h2 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">{data.heading}</h2>}
          {data?.body && <p className="mt-3 whitespace-pre-line leading-relaxed text-white/90 sm:mt-4">{data.body}</p>}
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
          {lineHref && (
            <a
              href={lineHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#4A90E2] px-6 font-medium text-white transition hover:bg-[#5AA2F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              {btnLabel[lang].line}
            </a>
          )}
          {mailHref && (
            <a
              href={mailHref}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#4A90E2] px-6 font-medium text-white transition hover:bg-[#5AA2F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              {btnLabel[lang].mail}
            </a>
          )}
        </div>

        {/* QR */}
        {data?.qrUrl && (
          <div className="mt-5 flex justify-center sm:mt-6">
            <Image src={data.qrUrl} alt="LINE QR" width={140} height={140} className="rounded-md shadow sm:h-[160px] sm:w-[160px] md:h-[180px] md:w-[180px]" />
          </div>
        )}

        {/* Form */}
        <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
          {status === "done" ? (
            <div className="rounded-2xl bg-white/10 p-5 text-center sm:p-6">
              <p className="text-base">{okMsg[lang]}</p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="space-y-4 overflow-x-clip rounded-2xl bg-white p-4 text-gray-900 shadow sm:space-y-5 sm:p-6"
              encType="multipart/form-data"
              noValidate
            >
              <input type="hidden" name="lang" value={lang} />

              <input name="name" required placeholder={tForm.name[lang]} className={inputBase} />
              <input name="email" type="email" required placeholder={tForm.email[lang]} className={inputBase} />

              <select name="topic" required className={selectBase} defaultValue="">
                <option value="">{tForm.topicLabel[lang]}</option>
                {topicOptions[lang].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              <textarea name="message" required placeholder={tForm.message[lang]} rows={4} className={textareaBase} />

              <input name="company" placeholder={tForm.company[lang]} className={inputBase} />
              <input name="phone" placeholder={tForm.phone[lang]} className={inputBase} />

              <input name="preferredContact" placeholder={tForm.preferredContact[lang]} className={inputBase} />

              {/* ===== 兩個備選時段（第二行提示，防溢出） ===== */}
              <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative w-full min-w-0 overflow-hidden">
                  <input
                    type="datetime-local"
                    name="preferredTime1"
                    className={`${dtInputBase} pr-10`}
                    aria-label={tForm.time1[lang]}
                  />
                  <span className="pointer-events-none absolute left-4 bottom-1 max-w-[calc(100%-2rem)] truncate text-xs text-gray-500">
                    {tHint[lang]}
                  </span>
                </div>
                <div className="relative w-full min-w-0">
                  <input
                    type="datetime-local"
                    name="preferredTime2"
                    className={`${dtInputBase} pr-10`}
                    aria-label={tForm.time2[lang]}
                  />
                  <span className="pointer-events-none absolute left-4 bottom-1 max-w-[calc(100%-2rem)] truncate text-xs text-gray-500">
                    {tHint[lang]}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="sr-only" aria-hidden="true">
                  {tForm.timezone[lang]}
                </div>
                <TimezoneSelect name="timezone" variant="light" />
              </div>

              {/* 蜜罐欄位 */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

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
                  {lang === "jp" ? "プライバシーポリシーに同意します" : lang === "zh" ? "我同意隱私權政策" : "I agree to the privacy policy"}
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="h-12 w-full rounded-2xl bg-[#4A90E2] px-5 font-medium text-white transition hover:bg-[#5AA2F0] disabled:opacity-70 sm:w-auto"
              >
                {status === "sending" ? btnLabel[lang].sending : btnLabel[lang].submit}
              </button>

              <div aria-live="polite" className="min-h-[1.25rem]">
                {status === "error" && <p className="text-sm text-red-600">{err}</p>}
              </div>

              <p className="pt-1 text-xs text-gray-500 sm:pt-2">
                {lang === "jp" && "※ 相談は無料です。費用が発生する場合は、必ず事前にお見積りをご提示します。"}
                {lang === "zh" && "※ 諮詢免費，如需收費服務，將先行提供報價並徵得同意。"}
                {lang === "en" && "Consultation is free. Any fees will be quoted in advance."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
