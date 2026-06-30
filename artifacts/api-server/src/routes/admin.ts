import { Router, type IRouter } from "express";
import { db, quoteSubmissionsTable } from "@workspace/db";
import { ListSubmissionsResponse } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/admin/submissions", async (req, res): Promise<void> => {
  const submissions = await db
    .select()
    .from(quoteSubmissionsTable)
    .orderBy(desc(quoteSubmissionsTable.createdAt));

  res.json(ListSubmissionsResponse.parse(submissions));
});

export default router;
