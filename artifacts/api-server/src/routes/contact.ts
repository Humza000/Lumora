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

  const { name, email, company, projectType, budget, message } = parsed.data;

  const [submission] = await db
    .insert(quoteSubmissionsTable)
    .values({ name, email, company: company ?? null, projectType, budget, message })
    .returning();

  sendQuoteNotification({ name, email, company, projectType, budget, message }).catch(
    () => {},
  );

  res.status(201).json(SubmitContactResponse.parse(submission));
});

export default router;
