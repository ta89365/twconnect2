// apps/web/src/components/ContactSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { ContactData, Lang } from "@/lib/types/contact";

type Status = "idle" | "sending" | "done" | "error";

/* ===== 成功訊息（依語言） ===== */
const okMsg: Record<Lang, string> = {
  jp: "送信ありがとうございます。1営業日以内にご連絡いたします。お急ぎの場合は LINE（@030qreji）でもご連絡ください。",
  zh: "感謝您的填寫，我們將在 1 個工作日內回覆。若有急件，請直接透過 LINE（@030qreji）聯繫我們。",
  en: "Thank you for your inquiry. We will respond within 1 business day. For urgent matters, please reach us directly on LINE (@030qreji).",
};

/* ===== CTA 按鈕文案 ===== */
const btnLabel: Record<Lang, { line: string; mail: string; submit: string; sending: string }> = {
  jp: { line: "LINEでのお問い合わせ", mail: "メールでのお問い合わせ", submit: "👉 無料相談を送信", sending: "送信中…" },
  zh: { line: "透過 LINE 聯絡", mail: "透過 Email 聯絡", submit: "👉 送出免費諮詢", sending: "傳送中…" },
  en: { line: "Contact via LINE", mail: "Contact via Email", submit: "👉 Send Inquiry", sending: "Sending…" },
};

/* ===== 表單多語：placeholder 與選單 ===== */
const tForm = {
  name: { jp: "お名前 ★", zh: "姓名 ★", en: "Name ★" },
  email: { jp: "メールアドレス ★", zh: "電子郵件 ★", en: "Email ★" },
  topicLabel: { jp: "ご相談カテゴリー / Topic ★", zh: "諮詢主題 / Topic ★", en: "Topic ★" },
  message: { jp: "ご相談内容 / Message ★", zh: "諮詢內容 / Message ★", en: "Message ★" },
  company: { jp: "所属会社 / Company", zh: "所屬公司 / Company", en: "Company" },
  phone: { jp: "電話番号 / Phone", zh: "電話號碼 / Phone", en: "Phone" },
  langLabel: { jp: "希望対応言語 / Preferred Language", zh: "希望對應語言 / Preferred Language", en: "Preferred Language" },
} as const;

const topicOptions: Record<Lang, string[]> = {
  jp: ["会社設立 / Company Setup", "会計・税務 / Accounting & Tax", "ビザ・人材 / Visa & HR", "市場開拓 / Market Entry", "その他 / Others"],
  zh: ["公司設立 / Company Setup", "會計與稅務 / Accounting & Tax", "簽證與人力 / Visa & HR", "市場開拓 / Market Entry", "其他 / Others"],
  en: ["Company Setup", "Accounting & Tax", "Visa & HR", "Market Entry", "Others"],
};

const langOptions: Record<Lang, string[]> = {
  jp: ["日本語", "中文", "English"],
  zh: ["中文", "日本語", "English"],
  en: ["English", "日本語", "中文"],
};

export default function ContactSection({
  data,
  lang,
}: {
  data: ContactData | null;
  lang: Lang;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");

  if (!data) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr("");

    const fd = new FormData(e.currentTarget);

    // 蜜罐欄位：如果被填寫就當作 bot
    if ((fd.get("website") as string)?.length > 0) {
      setStatus("done");
      return;
    }

    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, lang }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    } catch (e: any) {
      setStatus("error");
      setErr(e?.message ?? "Failed to submit");
    }
  }

  const lineHref = data.lineId ? `https://line.me/R/ti/p/${encodeURIComponent(data.lineId)}` : undefined;
  const mailHref = data.email ? `mailto:${data.email}` : undefined;

  return (
    <section className="bg-[#1C3D5A] text-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          {data.heading && <h2 className="text-3xl md:text-4xl font-semibold">{data.heading}</h2>}
          {data.body && (
            <p className="mt-4 text-white/90 leading-relaxed whitespace-pre-line">
              {data.body}
            </p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {lineHref && (
            <a
              href={lineHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors"
              style={{ backgroundColor: "#4A90E2" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#5AA2F0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#4A90E2")}
            >
              {btnLabel[lang].line}
            </a>
          )}
          {mailHref && (
            <a
              href={mailHref}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors"
              style={{ backgroundColor: "#4A90E2" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#5AA2F0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#4A90E2")}
            >
              {btnLabel[lang].mail}
            </a>
          )}
        </div>

        {/* QR */}
        {data.qrUrl && (
          <div className="mt-6 flex justify-center">
            <Image
              src={data.qrUrl}
              alt="LINE QR"
              width={160}
              height={160}
              className="rounded-md shadow"
            />
          </div>
        )}

        {/* Form */}
        <div className="mt-10 mx-auto max-w-2xl">
          {status === "done" ? (
            <div className="rounded-xl bg-white/10 p-6 text-center">
              <p className="text-base">{okMsg[lang]}</p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-2xl bg-white p-6 shadow text-gray-900 space-y-4"
            >
              {/* 依語言切換的 placeholder 與選單項目 */}
              <input name="name" required placeholder={tForm.name[lang]} className="w-full rounded border p-3" />
              <input name="email" type="email" required placeholder={tForm.email[lang]} className="w-full rounded border p-3" />

              <select name="topic" required className="w-full rounded border p-3" defaultValue="">
                <option value="">{tForm.topicLabel[lang]}</option>
                {topicOptions[lang].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <textarea
                name="message"
                required
                placeholder={tForm.message[lang]}
                rows={4}
                className="w-full rounded border p-3"
              />

              <input name="company" placeholder={tForm.company[lang]} className="w-full rounded border p-3" />
              <input name="phone" placeholder={tForm.phone[lang]} className="w-full rounded border p-3" />

              <select name="language" className="w-full rounded border p-3" defaultValue="">
                <option value="">{tForm.langLabel[lang]}</option>
                {langOptions[lang].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {/* 蜜罐欄位 */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-lg py-3 font-medium text-white transition-colors"
                style={{ backgroundColor: "#4A90E2" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5AA2F0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4A90E2")}
              >
                {status === "sending" ? btnLabel[lang].sending : btnLabel[lang].submit}
              </button>

              {status === "error" && <p className="text-sm text-red-600">{err}</p>}

              <p className="pt-2 text-xs text-gray-500">
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
