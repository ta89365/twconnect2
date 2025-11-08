// File: apps/web/src/app/api/contact/route.ts

import { NextResponse } from "next/server";
import { transporter, MailEnv } from "@/lib/mail/transporter";
import { sanityServerClient } from "@/lib/sanity/serverClient";

const autoReplyQuery = /* groq */ `
{
  "doc": *[_type == "contactPage"][0]{
    "email": {
      "subject": select(
        $lang == "jp" => coalesce(autoReplySubject.jp, autoReplySubject.zh, autoReplySubject.en),
        $lang == "en" => coalesce(autoReplySubject.en, autoReplySubject.zh, autoReplySubject.jp),
        coalesce(autoReplySubject.zh, autoReplySubject.jp, autoReplySubject.en)
      ),
      "body": select(
        $lang == "jp" => coalesce(autoReplyBody.jp, autoReplyBody.zh, autoReplyBody.en),
        $lang == "en" => coalesce(autoReplyBody.en, autoReplyBody.zh, autoReplyBody.jp),
        coalesce(autoReplyBody.zh, autoReplyBody.jp, autoReplyBody.en)
      )
    }
  }
}
`;

function esc(s: unknown) {
  return String(s ?? "").replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]!));
}

function ptToPlainText(val: unknown): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    try {
      return val
        .map((block: any) => {
          if (block?._type === "block" && Array.isArray(block.children)) {
            return block.children.map((ch: any) => ch?.text ?? "").join("");
          }
          return "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
    } catch {
      return "";
    }
  }
  return "";
}

/** 模板插值：{{}} 會 escape，{{{}}} 不 escape */
function renderTemplate(tpl: string, ctx: Record<string, any>): string {
  if (!tpl) return "";
  return tpl
    .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, k: string) => {
      const value = k.split(".").reduce<Record<string, any> | any>(
        (acc: Record<string, any> | any, key: string) => acc?.[key],
        ctx
      );
      return String(value ?? "");
    })
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k: string) => {
      const value = k.split(".").reduce<Record<string, any> | any>(
        (acc: Record<string, any> | any, key: string) => acc?.[key],
        ctx
      );
      return esc(value ?? "");
    });
}

function localizedBannerTitle(lang: string) {
  if (lang === "jp") return "お問い合わせありがとうございます";
  if (lang === "en") return "Thank you for contacting TW Connect";
  return "感謝您的來信";
}

function defaultSubject(lang: string) {
  if (lang === "jp") return "お問い合わせ受付のお知らせ";
  if (lang === "en") return "We received your inquiry";
  return "我們已收到您的表單";
}

export async function POST(req: Request) {
  let lang = "zh";
  try {
    // ===== 讀取請求 =====
    const ct = req.headers.get("content-type") ?? "";
    const isMultipart = ct.includes("multipart/form-data");
    let form: FormData;

    if (isMultipart) {
      form = await req.formData();
    } else {
      const json = await req.json().catch(() => ({}));
      form = new FormData();
      for (const [k, v] of Object.entries(json)) form.set(k, v as any);
    }

    // ===== 基本欄位 =====
    lang = String(form.get("lang") ?? "zh");
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const company = String(form.get("company") ?? "");
    const subject = String(form.get("subject") ?? "Contact form");
    const summary = String(form.get("summary") ?? "");
    const preferredContact = String(form.get("preferredContact") ?? "");
    const consent = String(form.get("consent") ?? "");
    const timezone = String(form.get("timezone") ?? "");

    // ===== 附件 =====
    const attachments: any[] = [];
    const files: unknown[] = [
      ...form.getAll("attachments"),
      ...form.getAll("attachment"),
    ];
    for (const f of files) {
      if (typeof f === "object" && f && "arrayBuffer" in f) {
        const file = f as File;
        const buf = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buf,
          contentType: file.type || "application/octet-stream",
        });
      }
    }

    // ===== 共用時間 =====
    const now = new Date();
    const isoNow = now.toISOString();
    const year = String(now.getFullYear());

    // ===== 管理者通知信：移除 Preferred Time 與 第1/第2希望；保留 Time Zone =====
    const adminSubject = `${MailEnv.MAIL_SUBJECT_PREFIX} ${subject}`.trim();
    const adminHtml = `
      <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f7f9fc;padding:32px;color:#333;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.06);">
          <div style="background:#1C3D5A;padding:20px 28px;">
            <h2 style="margin:0;color:#fff;font-weight:600;font-size:20px;">New Contact Submission</h2>
            <div style="margin-top:6px;color:#d5e4f0;font-size:12px;">${esc(isoNow)}</div>
          </div>
          <div style="padding:24px 28px;font-size:14px;">
            <table style="width:100%;border-collapse:collapse;">
              <tbody>
                <tr><td style="padding:6px 0;width:170px;color:#555;font-weight:600;">Subject</td><td>${esc(subject)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Name</td><td>${esc(name)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Company</td><td>${esc(company)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Email</td><td><a href="mailto:${esc(email)}" style="color:#1C3D5A;text-decoration:none;">${esc(email)}</a></td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Phone</td><td>${esc(phone)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Preferred Contact</td><td>${esc(preferredContact)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Time Zone</td><td>${esc(timezone)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Consent</td><td>${esc(consent)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Lang</td><td>${esc(lang)}</td></tr>
              </tbody>
            </table>
            <div style="margin:24px 0;border-top:1px solid #e3e6ec;"></div>
            <div><h4 style="margin:0 0 6px;color:#1C3D5A;">Message Summary</h4>
            <p style="white-space:pre-wrap;margin:0;">${esc(summary)}</p></div>
          </div>
          <div style="background:#f3f5f8;text-align:center;padding:14px;font-size:12px;color:#777;">© ${esc(year)} TW Connect</div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: MailEnv.MAIL_FROM,
      to: MailEnv.MAIL_TO,
      replyTo: email || MailEnv.MAIL_REPLY_TO,
      subject: adminSubject,
      html: adminHtml,
      attachments,
    });

    // ===== 寄給填表人：移除 Time Zone、Consent、Lang =====
    const ctx = { lang, name, email, phone, company, subject, summary, preferredContact, year, lineLink: "https://line.me/ti/p/@030qreji" };

    const replySubject = `${MailEnv.MAIL_SUBJECT_PREFIX} ${defaultSubject(lang)}`.trim();

    const detailsSubmitter = `
      <p>${lang === "jp" ? "ご入力内容（抜粋）：" : lang === "en" ? "Summary of your submission:" : "您提供的資料摘要如下："}</p>
      <p>
        ${lang === "jp" ? "ご用件" : lang === "en" ? "Subject" : "主旨"}：{{subject}}<br/>
        ${lang === "jp" ? "会社名" : lang === "en" ? "Company" : "公司"}：{{company}}<br/>
        ${lang === "jp" ? "ご氏名" : lang === "en" ? "Name" : "姓名"}：{{name}}<br/>
        Email：{{email}}<br/>
        ${lang === "jp" ? "お電話" : "Phone"}：{{phone}}<br/>
        ${lang === "jp" ? "ご希望の連絡方法" : lang === "en" ? "Preferred contact" : "首選聯絡方式"}：{{preferredContact}}
      </p>
      <div>
        <h4 style="margin:0 0 6px;color:#1C3D5A;">${lang === "jp" ? "メッセージ概要" : lang === "en" ? "Message Summary" : "訊息摘要"}</h4>
        <p style="white-space:pre-wrap;margin:0;">{{summary}}</p>
      </div>
      <p style="margin-top:12px;">${lang === "jp"
        ? "お急ぎの場合は LINE からもお問い合わせください："
        : lang === "en"
        ? "If you need urgent assistance, contact us via LINE:"
        : "若需加速處理，歡迎透過 LINE 聯繫我們：" }<br/>
        <a href="{{{lineLink}}}" target="_blank">{{{lineLink}}}</a>
      </p>`;

    const headerJP = `<p>お問い合わせありがとうございます。<strong>1〜2 営業日</strong>以内にご連絡いたします。</p>`;
    const headerEN = `<p>Thank you for your message. We will reply within <strong>1–2 business days</strong>.</p>`;
    const headerZH = `<p>感謝您的來信，我們將在 <strong>1–2 個工作日</strong>內回覆您。</p>`;

    const replyHtmlBlock =
      (lang === "jp" ? headerJP : lang === "en" ? headerEN : headerZH) + detailsSubmitter;

    const replyHtml = `
      <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f7f9fc;padding:32px;color:#333;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.06);">
          <div style="background:#1C3D5A;padding:20px 28px;">
            <h2 style="margin:0;color:#fff;font-weight:600;font-size:18px;">${esc(localizedBannerTitle(lang))}</h2>
          </div>
          <div style="padding:24px 28px;font-size:14px;line-height:1.7;">
            ${renderTemplate(replyHtmlBlock, ctx)}
            <p style="margin-top:14px;color:#65728a;font-size:12px;">${esc(now.toLocaleString())}</p>
          </div>
          <div style="background:#f3f5f8;text-align:center;padding:14px;font-size:12px;color:#777;">© ${esc(year)} TW Connect</div>
        </div>
      </div>
    `;

    if (email) {
      await transporter.sendMail({
        from: MailEnv.MAIL_FROM,
        to: email,
        subject: replySubject,
        html: replyHtml,
      });
    }

    // ===== redirect =====
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const url = new URL("/contact", base);
    url.searchParams.set("submitted", "1");
    url.searchParams.set("lang", lang);
    return NextResponse.redirect(url.toString(), { status: 303 });

  } catch (err: any) {
    console.error("[/api/contact] error:", err);
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const url = new URL("/contact", base);
    url.searchParams.set("submitted", "0");
    url.searchParams.set("error", String(err?.message || "MAIL_FAILED"));
    url.searchParams.set("lang", lang);
    return NextResponse.redirect(url.toString(), { status: 303 });
  }
}
