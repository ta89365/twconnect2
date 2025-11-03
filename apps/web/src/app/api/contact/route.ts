// apps/web/src/app/api/contact/route.ts
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
  return String(s ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

// 將 Portable Text 轉成純文字（足夠用於 text 版）
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

export async function POST(req: Request) {
  let lang = "zh"; // 失敗時 redirect 也有語系
  try {
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

    // 讀語系供 redirect 與自動回覆
    lang = String(form.get("lang") ?? "zh");

    // 欄位
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const company = String(form.get("company") ?? "");
    const subject = String(form.get("subject") ?? "Contact form");
    const summary = String(form.get("summary") ?? "");
    const preferredContact = String(form.get("preferredContact") ?? "");
    const datetime = String(form.get("datetime") ?? "");
    const consent = String(form.get("consent") ?? "");

    // 支援 attachments 與單一 attachment
    const attachments: any[] = [];
    const files: unknown[] = [
      ...form.getAll("attachments"),
      ...form.getAll("attachment"), // 兼容舊欄位名
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

    // 共用時間字串，避免在模板中直接 new Date()
    const isoNow = new Date().toISOString();
    const year = String(new Date().getFullYear());

    // ===== 後台通知信（品牌樣式） =====
    const adminSubject = `${MailEnv.MAIL_SUBJECT_PREFIX} ${subject}`.trim();
    const adminHtml = `
      <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color:#f7f9fc; padding:32px; color:#333;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.06);">
          <div style="background:#1C3D5A;padding:20px 28px;">
            <h2 style="margin:0;color:#fff;font-weight:600;font-size:20px;letter-spacing:.3px;">New Contact Submission</h2>
            <div style="margin-top:6px;color:#d5e4f0;font-size:12px;">${esc(isoNow)}</div>
          </div>
          <div style="padding:24px 28px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tbody>
                <tr><td style="padding:6px 0;width:150px;color:#555;font-weight:600;">Subject</td><td style="padding:6px 0;">${esc(subject)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Name</td><td style="padding:6px 0;">${esc(name)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Company</td><td style="padding:6px 0;">${esc(company)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:#1C3D5A;text-decoration:none;">${esc(email)}</a></td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Phone</td><td style="padding:6px 0;">${esc(phone)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Preferred Contact</td><td style="padding:6px 0;">${esc(preferredContact)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Preferred Time</td><td style="padding:6px 0;">${esc(datetime)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Consent</td><td style="padding:6px 0;">${esc(consent)}</td></tr>
                <tr><td style="padding:6px 0;color:#555;font-weight:600;">Lang</td><td style="padding:6px 0;">${esc(lang)}</td></tr>
              </tbody>
            </table>

            <div style="margin:24px 0;border-top:1px solid #e3e6ec;"></div>

            <div>
              <h4 style="margin:0 0 6px;color:#1C3D5A;">Message Summary</h4>
              <p style="white-space:pre-wrap;margin:0;font-size:14px;color:#333;">${esc(summary)}</p>
            </div>
          </div>
          <div style="background:#f3f5f8;text-align:center;padding:14px 16px;font-size:12px;color:#777;border-top:1px solid #e0e3e9;">
            © ${esc(year)} TW Connect
          </div>
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

    // ===== 取 Sanity 自動回覆文案 =====
    let autoSubject = "";
    let autoBodyPlain = "";
    let autoBodyHtml = "";

    try {
      const res = await sanityServerClient.fetch(autoReplyQuery, { lang });
      const s = res?.doc?.email?.subject;
      const b = res?.doc?.email?.body;
      autoSubject = typeof s === "string" ? s : ptToPlainText(s);
      const plain = ptToPlainText(b);
      autoBodyPlain = plain || "";
      autoBodyHtml = plain ? `<p>${esc(plain).replace(/\n+/g, "<br/>")}</p>` : "";
    } catch {
      // 忽略，使用預設
    }

    // 先把自動回覆 HTML 決定好，避免在插值中再宣告模板字串
    const fallbackReplyHtml = `
      <p>Hi ${esc(name || "")},</p>
      <p>We have received your message and will get back to you soon.</p>
      <p style="margin-top:14px;">
        <b>Your subject:</b> ${esc(subject)}<br/>
        <b>Submitted at:</b> ${esc(isoNow)}
      </p>
      <p>— TW Connect</p>
    `;
    const replyBodyHtml = autoBodyHtml || fallbackReplyHtml;

    // ===== 自動回覆（品牌樣式） =====
    if (email) {
      const replySubject =
        autoSubject || `${MailEnv.MAIL_SUBJECT_PREFIX} We received your inquiry`.trim();

      const replyHtml = `
        <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background:#f7f9fc;padding:32px;color:#333;">
          <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.06);">
            <div style="background:#1C3D5A;padding:20px 28px;">
              <h2 style="margin:0;color:#fff;font-weight:600;font-size:18px;letter-spacing:.3px;">Thank you for contacting TW Connect</h2>
            </div>
            <div style="padding:24px 28px;font-size:14px;line-height:1.7;">
              ${replyBodyHtml}
            </div>
            <div style="background:#f3f5f8;text-align:center;padding:14px 16px;font-size:12px;color:#777;border-top:1px solid #e0e3e9;">
              © ${esc(year)} TW Connect
            </div>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: MailEnv.MAIL_FROM,
        to: email,
        subject: replySubject,
        text:
          autoBodyPlain ||
          `Hi ${name || ""},\n\nWe have received your message and will get back to you soon.\n\nSubject: ${subject}\nSubmitted at: ${isoNow}\n\n— TW Connect`,
        html: replyHtml,
      });
    }

// ✅ 成功 → 回到 contact 顯示成功訊息
const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
const url = new URL('/contact', base);
url.searchParams.set('submitted', '1');
url.searchParams.set('lang', lang);
return NextResponse.redirect(url.toString(), { status: 303 });
} catch (err: any) {
  console.error('[/api/contact] error:', err);
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const url = new URL('/contact', base);
  url.searchParams.set('submitted', '0');
  url.searchParams.set('error', String(err?.message || 'MAIL_FAILED'));
  url.searchParams.set('lang', lang);
  return NextResponse.redirect(url.toString(), { status: 303 });
}

}
