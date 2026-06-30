import { ReplitConnectors } from "@replit/connectors-sdk";
import { logger } from "./logger";

export interface QuoteEmailData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  message: string;
  companySize?: string | null;
  existingWebsite?: string | null;
  projectDriver?: string | null;
  industry?: string | null;
}

export async function sendQuoteNotification(data: QuoteEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!adminEmail) {
    logger.warn("ADMIN_EMAIL not set — skipping email notification");
    return;
  }

  const connectors = new ReplitConnectors();

  const response = await connectors.proxy("resend", "/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `Lumora Website <${fromEmail}>`,
      to: [adminEmail],
      subject: `New Quote Request from ${data.name}`,
      html: `
        <h2>New Quote Request</h2>
        <table style="border-collapse: collapse; width: 100%; font-family: sans-serif;">
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Project Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.projectType}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Timeline</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.timeline}</td></tr>
          ${data.companySize ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Company Size</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.companySize}</td></tr>` : ""}
          ${data.industry ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Industry</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.industry}</td></tr>` : ""}
          ${data.existingWebsite ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Existing Website</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="${data.existingWebsite}">${data.existingWebsite}</a></td></tr>` : ""}
          ${data.projectDriver ? `<tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">What's Driving This</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.projectDriver}</td></tr>` : ""}
          <tr><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${data.message}</td></tr>
        </table>
        <p style="margin-top: 24px; color: #666; font-size: 13px;">Submitted via Lumora Agency Website</p>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    logger.error({ status: response.status, body }, "Failed to send quote notification email");
  } else {
    logger.info({ to: adminEmail, from: data.email }, "Quote notification email sent");
  }
}
