// File: apps/web/src/components/ContactSection.tsx
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import type { ContactData, Lang } from "@/lib/types/contact";
import { sfetch } from "@/lib/sanity/fetch";
import { contactPageByLang } from "@/lib/queries/contactus";

// 依據語系顯示 CTA 文案
const btnLabel: Record<Lang, { line: string; mail: string }> = {
  jp: { line: "LINEでのお問い合わせ", mail: "メールでのお問い合わせ" },
  zh: { line: "透過 LINE 聯絡", mail: "透過 Email 聯絡" },
  en: { line: "Contact via LINE", mail: "Contact via Email" },
};

export default async function ContactSection({
  data,
  lang,
}: {
  data: ContactData | null;
  lang: Lang;
}) {
  if (!data) return null;

  const lineHref = data.lineId
    ? `https://line.me/R/ti/p/${encodeURIComponent(data.lineId)}`
    : undefined;
  const mailHref = data.email ? `mailto:${data.email}` : undefined;

  // 🟦 關鍵：與 /contact 相同，用 GROQ 取回表單選項與提示
  const contactDoc = (await sfetch(contactPageByLang, { lang })) as {
    doc?: {
      form?: {
        subjectOptions?: string[];
        preferredContactOptions?: string[];
        summaryHint?: string;
        datetimeHint?: string;
        attachmentHint?: string;
      };
    };
  };

  const formFromGROQ = contactDoc?.doc?.form ?? {};

  // ✅ 件名：trim + 過濾空字串
  const subjectOptions = Array.isArray(formFromGROQ.subjectOptions)
    ? formFromGROQ.subjectOptions
        .map((s) => (s ?? "").trim())
        .filter((s) => s.length > 0)
    : [];

  // ✅ 偏好聯絡方式：trim + 過濾空字串（重點）
  const preferredContactOptions = Array.isArray(
    formFromGROQ.preferredContactOptions
  )
    ? formFromGROQ.preferredContactOptions
        .map((s) => (s ?? "").trim())
        .filter((s) => s.length > 0)
    : [];

  const summaryHint =
    typeof formFromGROQ.summaryHint === "string"
      ? formFromGROQ.summaryHint
      : undefined;
  const datetimeHint =
    typeof formFromGROQ.datetimeHint === "string"
      ? formFromGROQ.datetimeHint
      : undefined;
  const attachmentHint =
    typeof formFromGROQ.attachmentHint === "string"
      ? formFromGROQ.attachmentHint
      : undefined;

  return (
    <section
      className="overflow-x-hidden text-white"
      style={{ backgroundColor: "#1C3D5A" }}
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Heading / Body */}
        <div className="text-center">
          {data.heading ? (
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              {data.heading}
            </h2>
          ) : null}
          {data.body ? (
            <p className="mt-3 whitespace-pre-line leading-relaxed text-white/90 sm:mt-4">
              {data.body}
            </p>
          ) : null}
        </div>

        {/* CTA Buttons */}
        {(lineHref || mailHref) && (
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            {lineHref && (
              <a
                href={lineHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#1f2454] px-6 font-medium text-white transition hover:bg-[#2b3068] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
              >
                {btnLabel[lang].line}
              </a>
            )}
            {mailHref && (
              <a
                href={mailHref}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#1f2454] px-6 font-medium text-white transition hover:bg-[#2b3068] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
              >
                {btnLabel[lang].mail}
              </a>
            )}
          </div>
        )}

        {/* QR */}
        {data.qrUrl && (
          <div className="mt-5 flex justify-center sm:mt-6">
            <Image
              src={data.qrUrl}
              alt="LINE QR"
              width={160}
              height={160}
              className="rounded-md shadow sm:h-[160px] sm:w-[160px] md:h-[180px] md:w-[180px]"
            />
          </div>
        )}

        {/* 小表單：件名*、希望連絡方法*、提示文字等都來自 GROQ */}
        <div className="mx-auto mt-8 max-w-2xl sm:mt-10">
          <ContactForm
            lang={lang}
            subjectOptions={subjectOptions}
            preferredContactOptions={preferredContactOptions}
            summaryHint={summaryHint}
            datetimeHint={datetimeHint}
            attachmentHint={attachmentHint}
          />
        </div>
      </div>
    </section>
  );
}
