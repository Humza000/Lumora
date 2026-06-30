import { Resend } from "resend";
import { logger } from "./logger";

export interface QuoteEmailData {
  name: string;
  email: string;
  company?: string | null;
  projectType: string;
  budget: string;
  message: string;
}

export async function sendQuoteNotification(data: QuoteEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!process.env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  if (!adminEmail) {
    logger.warn("ADMIN_EMAIL not set — skipping email notification");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: `Lumora Website <${fromEmail}>`,
    to: adminEmail,
    subject: `New Quote Request from ${data.name}`,
    html: `
      <h2>New Quote Request</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: sans-serif;">
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company ?? "—"}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Project Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.projectType}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Budget</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.budget}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${data.message}</td></tr>
      </table>
      <p style="margin-top: 24px; color: #666; font-size: 13px;">Submitted via Lumora Agency Website</p>
    `,
  });

  if (error) {
    logger.error({ error }, "Failed to send quote notification email");
  } else {
    logger.info({ to: adminEmail, from: data.email }, "Quote notification email sent");
  }
}
