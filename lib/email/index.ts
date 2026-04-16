import nodemailer from "nodemailer";
import type { Locale } from "@/lib/i18n/config";

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  locale
}: {
  to: string;
  orderNumber: string;
  locale: Locale;
}) {
  if (!to || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to,
    subject: locale === "ka" ? `შეკვეთა დადასტურდა: ${orderNumber}` : `Order confirmed: ${orderNumber}`,
    html:
      locale === "ka"
        ? `<p>თქვენი შეკვეთა ${orderNumber} მიღებულია. მადლობა!</p>`
        : `<p>Your order ${orderNumber} has been received. Thank you.</p>`
  });
}
