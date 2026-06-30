import { Router, type IRouter } from "express";
import { db, quoteSubmissionsTable } from "@workspace/db";
import { SubmitContactBody, SubmitContactResponse } from "@workspace/api-zod";
import { sendQuoteNotification } from "../lib/email";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, company, projectType, timeline, message, companySize, existingWebsite, projectDriver, industry } = parsed.data;

  const [submission] = await db
    .insert(quoteSubmissionsTable)
    .values({ name, email, company, projectType, timeline, message, companySize: companySize ?? null, existingWebsite: existingWebsite ?? null, projectDriver: projectDriver ?? null, industry: industry ?? null })
    .returning();

  sendQuoteNotification({ name, email, company, projectType, timeline, message, companySize, existingWebsite, projectDriver, industry }).catch(
    () => {},
  );

  res.status(201).json(SubmitContactResponse.parse(submission));
});

export default router;
