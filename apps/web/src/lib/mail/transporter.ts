// apps/web/src/lib/mail/transporter.ts
import nodemailer from "nodemailer";

function reqEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

const MAIL_HOST = reqEnv("MAIL_HOST");
const MAIL_PORT = Number(reqEnv("MAIL_PORT"));
const MAIL_SECURE = String(process.env.MAIL_SECURE ?? "true") === "true";
const MAIL_USER = reqEnv("MAIL_USER");
const MAIL_PASS = reqEnv("MAIL_PASS");
const MAIL_FROM = process.env.MAIL_FROM ?? MAIL_USER;
const MAIL_TO = reqEnv("MAIL_TO"); // 允許多收件人，以逗號分隔
const MAIL_REPLY_TO = process.env.MAIL_REPLY_TO ?? MAIL_FROM;
const MAIL_SUBJECT_PREFIX = process.env.MAIL_SUBJECT_PREFIX ?? "";

export const MailEnv = {
  MAIL_FROM,
  MAIL_TO,
  MAIL_REPLY_TO,
  MAIL_SUBJECT_PREFIX,
};

export const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE, // 465 -> true
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});
