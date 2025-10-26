// apps/web/src/app/api/send-contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 簡單必填檢查
    if (!data?.name || !data?.email || !data?.message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // SMTP 設定：用你的供應商或 Gmail App Password
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,          // 例如 smtp.gmail.com 或自家的 SMTP
      port: Number(process.env.MAIL_PORT) || 465,
      secure: process.env.MAIL_SECURE !== "false", // 465 -> true, 587 -> false
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const subject = `[TW Connect] New Inquiry - ${data.topic || "General"}`;

    await transporter.sendMail({
      from: `"TW Connect Contact" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || "info@twconnects.com",
      subject,
      replyTo: data.email,
      text: `
Lang: ${data.lang || "-"}
Name: ${data.name}
Email: ${data.email}
Topic: ${data.topic || "-"}
Company: ${data.company || "-"}
Phone: ${data.phone || "-"}
Preferred Language: ${data.language || "-"}
Message:
${data.message}
      `.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Send failed" }, { status: 500 });
  }
}
