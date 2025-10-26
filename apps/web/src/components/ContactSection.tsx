// apps/web/src/components/ContactSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { ContactData, Lang } from "@/lib/types/contact";

type Status = "idle" | "sending" | "done" | "error";

const okMsg: Record<Lang, string> = {
  jp: "送信ありがとうございます。1営業日以内にご連絡いたします。お急ぎの場合は LINE（@030qreji）でもご連絡ください。",
  zh: "感謝您的填寫，我們將在 1 個工作日內回覆。若有急件，請直接透過 LINE（@030qreji）聯繫我們。",
  en: "Thank you for your inquiry. We will respond within 1 business day. For urgent matters, please reach us directly on LINE (@030qreji).",
};

const btnLabel: Record<Lang, { line: string; mail: string; submit: string }> = {
  jp: { line: "LINEでのお問い合わせ", mail: "メールでのお問い合わせ", submit: "👉 無料相談を送信" },
  zh: { line: "透過 LINE 聯絡", mail: "透過 Email 聯絡", submit: "👉 送出免費諮詢" },
  en: { line: "Contact via LINE", mail: "Contact via Email", submit: "👉 Send Inquiry" },
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
    // 簡單的 honeypot 防垃圾
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
              className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] px-6 py-3 font-medium"
            >
              {btnLabel[lang].line}
            </a>
          )}
          {mailHref && (
            <a
              href={mailHref}
              className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] px-6 py-3 font-medium"
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
              {/* 必填 */}
              <input name="name" required placeholder="お名前 / Name ★" className="w-full rounded border p-3" />
              <input name="email" type="email" required placeholder="メールアドレス / Email ★" className="w-full rounded border p-3" />
              <select name="topic" required className="w-full rounded border p-3">
                <option value="">{`ご相談カテゴリー / Topic ★`}</option>
                <option>会社設立 / Company Setup</option>
                <option>会計・税務 / Accounting & Tax</option>
                <option>ビザ・人材 / Visa & HR</option>
                <option>市場開拓 / Market Entry</option>
                <option>その他 / Others</option>
              </select>
              <textarea name="message" required placeholder="ご相談内容 / Message ★" rows={4} className="w-full rounded border p-3" />

              {/* 任意 */}
              <input name="company" placeholder="所属会社 / Company" className="w-full rounded border p-3" />
              <input name="phone" placeholder="電話番号 / Phone" className="w-full rounded border p-3" />
              <select name="language" className="w-full rounded border p-3">
                <option value="">{`希望対応言語 / Preferred Language`}</option>
                <option>日本語</option>
                <option>中文</option>
                <option>English</option>
              </select>

              {/* honeypot: 隱藏欄位，真用戶不會填 */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] py-3 text-white font-medium"
              >
                {status === "sending" ? "Sending..." : btnLabel[lang].submit}
              </button>

              {status === "error" && (
                <p className="text-sm text-red-600">{err}</p>
              )}

              {/* footer copy */}
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
