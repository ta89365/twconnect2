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
  return String(s ?? "").replace(
    /[<>&"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]!
  ));
}

/** 簡碼 ↔ 全名（可本地化顯示） */
type LangCode = "zh" | "jp" | "en";
const LANG_FULLNAME: Record<LangCode, { en: string; zh: string; jp: string }> = {
  zh: { en: "Chinese", zh: "中文", jp: "中国語" },
  jp: { en: "Japanese", zh: "日文", jp: "日本語" },
  en: { en: "English", zh: "英文", jp: "英語" },
};
/** 將語言簡碼轉為全名；displayLang 控制顯示語系 */
function langFullName(code: LangCode, displayLang: LangCode): string {
  return LANG_FULLNAME[code]?.[displayLang] ?? code;
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

/** 模板插值：{{}} escape，{{{}}} 不 escape */
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

/** 語言白名單正規化 */
function normalizeLang(input: string, fallback: LangCode = "zh"): LangCode {
  const k = String(input ?? "").toLowerCase();
  if (k === "zh" || k === "jp" || k === "en") return k as LangCode;
  return fallback;
}

export async function POST(req: Request) {
  // 頁面語言 vs. 郵件語言
  let siteLang: LangCode = "zh";
  let msgLang: LangCode = "zh";

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

    // ===== 語言欄位 =====
    siteLang = normalizeLang(String(form.get("lang") ?? "zh"), "zh"); // UI 回跳用
    const preferredLanguageRaw = String(form.get("preferredLanguage") ?? "");
    msgLang = normalizeLang(preferredLanguageRaw || siteLang, siteLang); // 郵件語系用

    // ===== 基本欄位 =====
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const company = String(form.get("company") ?? "");
    const subject = String(form.get("subject") ?? "Contact form");
    const summary = String(form.get("summary") ?? "");
    const consent = String(form.get("consent") ?? "");
    const timezone = String(form.get("timezone") ?? "");

    // ===== 新增欄位 =====
    const nationality = String(form.get("nationality") ?? "");
    const clientType = String(form.get("clientType") ?? "");
    const establishmentType = String(form.get("establishmentType") ?? "");
    const parentCompanyCountry = String(form.get("parentCompanyCountry") ?? "");

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

    // ===== 管理者通知信 =====
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
                <tr><td style="padding:6px 0;width:200px;color:#555;font-weight:600;">Subject</td><td>${esc(subject)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Name</td><td>${esc(name)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Company</td><td>${esc(company)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Email</td><td><a href="mailto:${esc(email)}" style="color:#1C3D5A;text-decoration:none;">${esc(email)}</a></td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Phone</td><td>${esc(phone)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Nationality</td><td>${esc(nationality)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Client Type</td><td>${esc(clientType)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Type of Establishment</td><td>${esc(establishmentType)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Parent Company Country</td><td>${esc(parentCompanyCountry)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Preferred Language</td><td>${esc(langFullName(msgLang, "en"))}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Site Language</td><td>${esc(langFullName(siteLang, "en"))}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Time Zone</td><td>${esc(timezone)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Consent</td><td>${esc(consent)}</td></tr>
              </tbody>
            </table>
            <div style="margin:24px 0;border-top:1px solid #e3e6ec;"></div>
            <div>
              <h4 style="margin:0 0 6px;color:#1C3D5A;">Message Summary</h4>
              <p style="white-space:pre-wrap;margin:0;">${esc(summary)}</p>
            </div>
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

    // ===== 自動回覆給填表人 =====

    const ctx = {
      lang: msgLang,
      name,
      email,
      phone,
      company,
      subject,
      summary,
      nationality,
      clientType,
      establishmentType,
      parentCompanyCountry,
      preferredLanguageFull: langFullName(msgLang, msgLang),
      year,
      lineLink: "https://line.me/ti/p/@030qreji",
    };

    const replySubject = `${MailEnv.MAIL_SUBJECT_PREFIX} ${defaultSubject(msgLang)}`.trim();

    const detailsSubmitter = `
      <p>${
        msgLang === "jp"
          ? "ご入力内容（抜粋）："
          : msgLang === "en"
          ? "Summary of your submission:"
          : "您提供的資料摘要如下："
      }</p>
      <p>
        ${msgLang === "jp" ? "ご用件" : msgLang === "en" ? "Subject" : "主旨"}：{{subject}}<br/>
        ${msgLang === "jp" ? "会社名" : msgLang === "en" ? "Company" : "公司"}：{{company}}<br/>
        ${msgLang === "jp" ? "ご氏名" : msgLang === "en" ? "Name" : "姓名"}：{{name}}<br/>
        Email：{{email}}<br/>
        ${msgLang === "jp" ? "お電話" : "Phone"}：{{phone}}<br/>
        ${msgLang === "jp" ? "国籍" : msgLang === "en" ? "Nationality" : "國籍"}：{{nationality}}<br/>
        ${msgLang === "jp" ? "顧客区分" : msgLang === "en" ? "Client type" : "A型態"}：{{clientType}}<br/>
        ${
          msgLang === "jp"
            ? "設立形態"
            : msgLang === "en"
            ? "Type of establishment"
            : "設立型態"
        }：{{establishmentType}}<br/>
        ${
          msgLang === "jp"
            ? "親会社の登録国"
            : msgLang === "en"
            ? "Parent company country"
            : "母公司設立國"
        }：{{parentCompanyCountry}}<br/>
        ${
          msgLang === "jp"
            ? "ご希望の言語"
            : msgLang === "en"
            ? "Preferred language"
            : "希望聯絡語言"
        }：{{preferredLanguageFull}}
      </p>
      <div>
        <h4 style="margin:0 0 6px;color:#1C3D5A;">${
          msgLang === "jp"
            ? "メッセージ概要"
            : msgLang === "en"
            ? "Message Summary"
            : "訊息摘要"
        }</h4>
        <p style="white-space:pre-wrap;margin:0;">{{summary}}</p>
      </div>
      <p style="margin-top:12px;">${
        msgLang === "jp"
          ? "お急ぎの場合は LINE からもお問い合わせください："
          : msgLang === "en"
          ? "If you need urgent assistance, contact us via LINE:"
          : "若需加速處理，歡迎透過 LINE 聯繫我們："
      }<br/>
        <a href="{{{lineLink}}}" target="_blank">{{{lineLink}}}</a>
      </p>
    `;

    const headerJP = `<p>お問い合わせありがとうございます。<strong>1〜2 営業日</strong>以内にご連絡いたします。</p>`;
    const headerEN = `<p>Thank you for your message. We will reply within <strong>1–2 business days</strong>.</p>`;
    const headerZH = `<p>感謝您的來信，我們將在 <strong>1–2 個工作日</strong>內回覆您。</p>`;

    const replyHtmlBlock =
      (msgLang === "jp" ? headerJP : msgLang === "en" ? headerEN : headerZH) +
      detailsSubmitter;

    const replyHtml = `
      <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f7f9fc;padding:32px;color:#333;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.06);">
          <div style="background:#1C3D5A;padding:20px 28px;">
            <h2 style="margin:0;color:#fff;font-weight:600;font-size:18px;">${esc(
              localizedBannerTitle(msgLang)
            )}</h2>
          </div>
          <div style="padding:24px 28px;font-size:14px;line-height:1.7;">
            ${renderTemplate(replyHtmlBlock, ctx)}
            <p style="margin-top:14px;color:#65728a;font-size:12px;">${esc(
              now.toLocaleString()
            )}</p>
          </div>
          <div style="background:#f3f5f8;text-align:center;padding:14px;font-size:12px;color:#777;">© ${esc(
            year
          )} TW Connect</div>
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

    // ===== Redirect：保留 UI 語言 =====
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const url = new URL("/contact", base);
    url.searchParams.set("submitted", "1");
    url.searchParams.set("lang", siteLang);
    return NextResponse.redirect(url.toString(), { status: 303 });
  } catch (err: any) {
    console.error("[/api/contact] error:", err);
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const url = new URL("/contact", base);
    url.searchParams.set("submitted", "0");
    url.searchParams.set("error", String(err?.message || "MAIL_FAILED"));
    url.searchParams.set("lang", siteLang);
    return NextResponse.redirect(url.toString(), { status: 303 });
  }
}
