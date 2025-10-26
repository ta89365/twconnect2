// apps/web/src/app/api/send-contact/route.ts
import { NextResponse } from "next/server";

// ✅ 確保使用 Node.js runtime（nodemailer 無法在 Edge 執行）
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ 基本欄位檢查
    if (!data?.name || !data?.email || !data?.message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, email, or message" },
        { status: 400 }
      );
    }

    // ✅ 驗證 email 基本格式
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ SMTP 設定（支援 Gmail App Password）
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.MAIL_PORT) || 465,
      secure: process.env.MAIL_SECURE !== "false", // 465 -> true, 587 -> false
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // ✅ 主旨與內容
    const subject = `[TW Connect] New Inquiry - ${data.topic || "General"}`;
    const textBody = `
Lang: ${data.lang || "-"}
Name: ${data.name}
Email: ${data.email}
Topic: ${data.topic || "-"}
Company: ${data.company || "-"}
Phone: ${data.phone || "-"}
Preferred Language: ${data.language || "-"}
Message:
${data.message}
    `.trim();

    // ✅ 信件發送設定
    const info = await transporter.sendMail({
      from: `"TW Connect Contact" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER, // 預設寄給自己
      cc: data.email, // ✅ 自動寄副本給寄件人
      replyTo: data.email,
      subject,
      text: textBody,
    });

    console.log("Email sent:", info.messageId);
    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (e: any) {
    console.error("Send contact error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Send failed" },
      { status: 500 }
    );
  }
}
